-- Annulation complète de 001_export_jeu.sql
-- Supprime les vues et le rôle. Aucune donnée du Hub n'est touchée.
begin;
drop schema if exists jeu_export cascade;
do $$
begin
  if exists (select 1 from pg_roles where rolname = 'jeu_export_lecteur') then
    execute 'drop role jeu_export_lecteur';
  end if;
end $$;
commit;
