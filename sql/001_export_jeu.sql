-- =====================================================================
-- Ignem custodimus — accès en LECTURE SEULE pour l'export des données
-- Projet Supabase : « Prométhée Project » (cyosmecbmjgmsdvhcmjk)
--
-- Principe :
--   * Un schéma séparé « jeu_export » contient uniquement des VUES filtrées.
--   * Un rôle « jeu_export_lecteur » ne voit QUE ce schéma.
--     Il n'a aucun droit sur « public » : les tables perso_*, shared_*,
--     phase1_*, auth.* lui sont invisibles.
--   * Aucune table du Hub n'est modifiée. Annulation complète : 999_annulation.sql
--
-- À exécuter dans l'éditeur SQL de Supabase, APRÈS relecture.
-- =====================================================================

begin;

-- 1. Schéma dédié, fermé aux rôles de l'API -----------------------------
create schema if not exists jeu_export;
revoke all on schema jeu_export from public, anon, authenticated;

-- 2. Vues filtrées ------------------------------------------------------

-- Référentiel brassage / distillation (ingrédients + fiches de théorie)
create or replace view jeu_export.reference as
select id, category, subcategory, label, data, source, updated_at
from public.hub_brewing_reference;

-- Recettes : on retire journaux de brassage, notes libres, planning et suivi perso
create or replace view jeu_export.recettes as
select id, type, name,
       data - array[
         'brewLogs','notes','comment','rating','favorite','tried',
         'timesBrewed','timesToBrew','lastBrewedAt','plannedBrewDate',
         'plannedFermenterId','fermenterId','kitStockName','stockRequirements',
         'volumeTracking','sensoryEvaluation','createdAt','livret'
       ] as data,
       updated_at
from public.hub_recipes;

-- Formation et quiz : LISTE BLANCHE de thèmes techniques.
-- Les modules projet, juridique, finance, social, charge de travail
-- contiennent des informations patrimoniales et familiales : exclus.
create or replace view jeu_export.formation_modules as
select id, phase_id, code, titre, ordre, categorie, objectifs, notions_cles,
       prerequis, heures_estimees, criteres_validation, questions_cles
from public.form_gen_modules
where code = any (array[
  'M-BRASS','M-CEREALE','M-DIST','M-FERM','M-FUT','M-HYDRO','M-LIQ',
  'M-SENSO','M-SECU','M-SANI','M-ENER','M-FRUIT','M-ACCISE','M-COUT'
]);

create or replace view jeu_export.formation_phases as
select id, code, titre, ordre, description
from public.form_gen_phases
where id in (select phase_id from jeu_export.formation_modules);

-- Decks : ceux des modules ci-dessus + fiches de bibliothèque techniques
create or replace view jeu_export.quiz_decks as
select id, title, scope, color
from public.learn_decks
where id in (select 'deck-mod-' || code from jeu_export.formation_modules)
   or (scope = 'biblio'
       and title ~* '(distillation|levures|amylac|maturation|orge|whisky|hygi)');

-- Cartes actives des decks retenus, sans l'état de révision
create or replace view jeu_export.quiz_cartes as
select c.id, c.deck_id, c.front, c.back, c.type, c.tags
from public.learn_cards c
where coalesce(c.suspended, false) = false
  and c.deck_id in (select id from jeu_export.quiz_decks);

-- Repères chiffrés techniques (finance et gîte exclus)
create or replace view jeu_export.reperes as
select id, category, subcategory, label, value, unit, source, year, region, notes
from public.hub_benchmarks
where category in ('brasserie','distillation','apiculture','biomasse','general');

-- Économie par lot
create or replace view jeu_export.economie_lots as
select id, cat, default_taille_lot, min_taille_lot, max_taille_lot,
       t_fixed_per_lot, t_var_per_unite, unit_label, lot_label, rationale
from public.hub_promethee_batch_economics
where active;

-- Paramètres : LISTE BLANCHE STRICTE.
-- La ligne source contient aussi des données personnelles (salaire, foyer,
-- crédit, famille…). Seules les clés ci-dessous sortent.
create or replace view jeu_export.parametres as
select p.id, p.label,
       coalesce((
         select jsonb_object_agg(e.key, e.value)
         from jsonb_each(p.params) e
         where e.key = any (array[
           -- distillerie
           'dist_capacite_LAP','dist_volume_alambic','dist_taille_lot_LAP',
           'dist_rendement_mash','dist_ABV_moyen','dist_ABV_embouteillage',
           'dist_pct_ange_share','dist_duree_maturation_mois','dist_duree_maturation_whisky',
           'dist_cout_grain_eur_par_kg','dist_cout_fut_par_LAP',
           'dist_cout_emballage_eur_par_bouteille','dist_prix_moyen_LAP',
           'dist_cout_kwh_bois','dist_cout_kwh_gaz','dist_cout_kwh_biomasse',
           'dist_cout_kwh_electrique','dist_entrepot_suspensif',
           -- brasserie
           'brass_taille_brassin_L','brass_volume_max_annuel_L',
           'brass_prix_moyen_litre','brass_cout_matiere_pct',
           -- ambulant (Ulysse)
           'amb_lap_par_prestation','amb_prix_facon_eur_par_LAP','amb_lap_max_par_client',
           -- eaux-de-vie et miel
           'eauvie_prix_eur_par_LAP_TTC','api_sol_edv_miel_miel_kg_lap',
           'api_sol_hydromel_miel_kg_litre',
           -- plafonds et formats
           'glob_plafond_brasserie_L_an','glob_plafond_apiculture_ruches',
           'glob_fut_capacite_LAP','glob_bouteille_70cl_volume_L',
           'glob_bouteille_75cl_volume_L','glob_tva_pct'
         ])
       ), '{}'::jsonb) as params
from public.hub_promethee_params p
where p.active;

-- 3. Rôle lecteur -------------------------------------------------------
-- Le mot de passe NE figure PAS ici. Après ce script, exécute séparément :
--   alter role jeu_export_lecteur with password 'TON_MOT_DE_PASSE_LONG';
do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'jeu_export_lecteur') then
    create role jeu_export_lecteur with login noinherit nocreatedb nocreaterole;
  end if;
end $$;

alter role jeu_export_lecteur set default_transaction_read_only = on;
alter role jeu_export_lecteur set statement_timeout = '30s';

grant usage on schema jeu_export to jeu_export_lecteur;
grant select on all tables in schema jeu_export to jeu_export_lecteur;

-- Ceinture et bretelles : aucun droit sur public
revoke all on all tables in schema public from jeu_export_lecteur;
revoke usage on schema public from jeu_export_lecteur;

commit;

-- 4. Contrôle (à lancer après) -------------------------------------------
-- Doit lister uniquement des objets du schéma jeu_export :
-- select table_schema, table_name, privilege_type
-- from information_schema.role_table_grants
-- where grantee = 'jeu_export_lecteur';
