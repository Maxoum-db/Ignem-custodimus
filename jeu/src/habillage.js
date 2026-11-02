/* Portraits, accessoires et panoramas : décoration indépendante des règles. */
(function () {
  "use strict";
  const U = window.UniversJeu,
    I = window.IllustrationsJeu,
    {
      C,
      ellipse,
      ligne,
      boite,
      polygone,
      image,
      contenir,
      feu,
      verre,
      fut,
      acteur,
    } = U.art;
  const svg = (corps) =>
    "data:image/svg+xml;charset=utf-8," +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><g stroke="#3b2a1e" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round">' +
        corps +
        "</g></svg>",
    );
  const icones = {
    sac: '<path fill="#caa068" d="M24 8L20 3H44L40 9L44 16Q62 43 52 56Q33 65 12 56Q3 43 20 16Z"/><path fill="#f7e5b5" d="M13 28Q32 25 51 28V47Q32 50 13 47Z"/><path fill="none" d="M23 13H41M31 44V32M31 36L26 32M31 39L37 34"/>',
    cone: '<path fill="#9cc94a" d="M32 5Q16 11 11 36Q9 50 32 59Q55 50 53 36Q48 11 32 5Z"/><path fill="none" stroke="#567831" d="M32 5V59M19 16L32 27L45 16M13 28L32 40L51 28M13 42L32 53L51 42"/>',
    sachet:
      '<path fill="#e2cfa4" d="M14 6H50L53 58H11Z"/><path fill="#ece3bc" d="M15 20H49V47H15Z"/><path fill="none" d="M15 13H49M18 52H46"/><g fill="#d99b50"><ellipse cx="27" cy="32" rx="5" ry="7"/><ellipse cx="38" cy="37" rx="4" ry="6"/></g>',
    goutte:
      '<path fill="#69afc6" d="M32 4Q19 23 12 34Q3 57 32 60Q61 57 52 34Z"/><path fill="none" stroke="#def6ee" stroke-width="5" d="M23 30Q15 42 22 48"/>',
    bocal:
      '<path fill="#a7c6b0" d="M19 15H45L50 25V57H14V25Z"/><path fill="#ac7844" d="M18 8H46V17H18Z"/><path fill="#f3deb0" d="M19 30H45V49H19Z"/><path fill="#b85a43" d="M31 35Q22 32 24 41Q32 49 39 40Q41 32 33 35Z"/><path fill="none" stroke="#8ca24a" d="M32 36V30L38 27"/>',
    feu: '<path fill="#d9714a" d="M32 3Q48 21 40 28Q52 25 53 39Q59 60 32 61Q4 61 12 37Q21 42 20 29Q19 17 32 3Z"/><path fill="#ffce61" stroke="none" d="M32 27Q28 41 24 44Q17 56 32 57Q48 56 40 44Q35 39 32 27Z"/>',
    fruit:
      '<path fill="#cb704b" d="M32 20Q8 9 9 34Q10 56 28 59L34 58Q55 61 56 34Q56 11 32 20Z"/><path fill="#91b84b" d="M33 17Q34 2 51 8Q49 22 33 17Z"/><path fill="none" d="M32 22L30 8"/><path stroke="#f1b279" fill="none" d="M19 29Q14 40 21 46"/>',
    epice:
      '<path fill="#a87444" d="M12 43L42 9Q50 5 54 14L25 53Z"/><path fill="none" d="M17 45L47 13M23 50L51 17"/><path fill="#c78b49" d="M41 35L45 43L55 44L48 50L50 59L41 54L33 59L35 49L28 43L38 42Z"/>',
    miel: '<path fill="#e8b74e" d="M17 19H47L51 31V57H13V31Z"/><path fill="#ae783f" d="M15 10H49V20H15Z"/><path fill="#f6d981" d="M16 33H48V50H16Z"/><path fill="#d79a35" d="M27 36H36L40 42L36 47H27L23 42Z"/>',
    bois: '<path fill="#ad7540" d="M7 40L43 12L58 29L22 57Z"/><ellipse fill="#dcb17a" cx="15" cy="48" rx="10" ry="12"/><ellipse fill="none" cx="15" cy="48" rx="5" ry="7"/><path fill="none" d="M24 39L46 20M28 46L53 27"/>',
    bouteille:
      '<path fill="#68824b" d="M26 9H38V22Q49 26 49 34V57H15V34Q15 26 26 22Z"/><path fill="#bf8d4b" d="M25 3H39V12H25Z"/><path fill="#f5deb0" d="M18 35H46V49H18Z"/><path stroke="#c5d7a7" fill="none" d="M21 29V33M21 52V55"/>',
    outil:
      '<path fill="#b17f48" d="M13 58L9 54L42 13L48 18Z"/><path fill="#abb3a5" d="M30 15L43 3L58 16L46 29Z"/><path stroke="#e5e4c9" d="M42 8L52 17"/>',
  };
  function visage(nom) {
    let h = 0;
    for (const l of nom) h = (h * 31 + l.charCodeAt(0)) >>> 0;
    const peau = ["#e6b58c", "#ca946a", "#a87350"][h % 3],
      cheveux = ["#6c4328", "#bd8050", "#5b493c", "#c0b29a"][h % 4];
    return svg(
      '<circle fill="#8c9a65" cx="32" cy="32" r="29"/><path fill="#677b80" d="M8 64Q9 46 32 45Q55 46 56 64"/><ellipse fill="' +
        peau +
        '" cx="32" cy="29" rx="16" ry="20"/><path fill="' +
        cheveux +
        '" d="M15 28Q8 5 33 7Q58 9 48 29L42 19Q25 22 21 17Z"/><path fill="none" d="M25 29H26M38 29H39M28 39Q32 42 37 38"/>',
    );
  }
  U.habiller = function (SPR) {
    for (const [cle, corps] of Object.entries(icones)) {
      const avant = SPR[cle];
      SPR[cle] = svg(corps);
      document.querySelectorAll("img").forEach((img) => {
        if (img.src === avant) img.src = SPR[cle];
      });
    }
    for (const [cle, crop] of [
      ["lise", [0.255, 0.008, 0.43, 0.2867]],
      ["firmin", [0.285, 0.005, 0.4, 0.2667]],
    ]) {
      I.charger("personnage-" + cle).then((img) => {
        if (!img) return;
        try {
          const cv = document.createElement("canvas");
          cv.width = cv.height = 144;
          const c = cv.getContext("2d");
          c.imageSmoothingQuality = "high";
          c.fillStyle = "#ead6ac";
          c.fillRect(0, 0, 144, 144);
          c.drawImage(
            img,
            crop[0] * img.width,
            crop[1] * img.height,
            crop[2] * img.width,
            crop[3] * img.height,
            0,
            0,
            144,
            144,
          );
          const ancien = SPR[cle];
          SPR[cle] = cv.toDataURL();
          document.querySelectorAll("img").forEach((el) => {
            if (el.src === ancien) el.src = SPR[cle];
          });
        } catch {
          /* Le portrait historique reste disponible. */
        }
      });
    }
    I.charger("fut-chene").then((img) => {
      if (img)
        document.documentElement.style.setProperty(
          "--image-fut",
          'url("' + img.src + '")',
        );
    });
    let attente = false;
    const familles = {
      cereales: "sac",
      malts: "sac",
      houblons: "cone",
      levures: "sachet",
      levure: "sachet",
      eau: "goutte",
      aromates: "bocal",
      auxiliaires: "outil",
      futs: "bois",
      grimoire: "bouteille",
    };
    const decorer = () => {
      attente = false;
      document
        .querySelectorAll(".avatar:not([data-illustre])")
        .forEach((el) => {
          el.dataset.illustre = "oui";
          const nom =
            el.closest(".client-tete")?.querySelector("b")?.textContent ||
            el.textContent;
          el.style.backgroundImage = 'url("' + visage(nom) + '")';
          el.style.backgroundColor = "#8c9a65";
          el.setAttribute("aria-label", "Portrait de " + nom);
          el.textContent = "";
        });
      document
        .querySelectorAll(
          "[data-cat]:not([data-icone]),[data-rcat]:not([data-icone]),[data-onglet]:not([data-icone])",
        )
        .forEach((el) => {
          const cle =
            familles[el.dataset.cat || el.dataset.rcat || el.dataset.onglet];
          el.dataset.icone = "oui";
          if (cle) {
            el.classList.add("icone-famille");
            el.style.backgroundImage = 'url("' + svg(icones[cle]) + '")';
          }
        });
      document
        .querySelectorAll('[data-glisser="aromate"]:not([data-icone])')
        .forEach((el) => {
          el.dataset.icone = "oui";
          const a = (window.DONNEES_JEU?.aromates || []).find(
            (a) => a.id === el.dataset.id,
          );
          const cle =
            a?.type === "fruit"
              ? "fruit"
              : a?.type === "bois"
                ? "bois"
                : "epice";
          const img = el.querySelector("img");
          if (img) img.src = svg(icones[cle]);
        });
      document
        .querySelectorAll('[data-glisser="malt"]:not([data-icone])')
        .forEach((el) => {
          el.dataset.icone = "oui";
          const malt = (window.DONNEES_JEU?.malts || []).find(
            (m) => m.id === el.dataset.id,
          );
          if (/miel/i.test(malt?.nom || ""))
            el.querySelector("img").src = svg(icones.miel);
        });
    };
    new MutationObserver(() => {
      if (!attente) {
        attente = true;
        requestAnimationFrame(decorer);
      }
    }).observe(document.getElementById("jeu") || document.body, {
      childList: true,
      subtree: true,
    });
    decorer();
  };
  function fondImage(c, img) {
    if (!img) return;
    const r = Math.max(192 / img.width, 88 / img.height);
    image(
      c,
      img,
      (192 - img.width * r) / 2,
      (88 - img.height * r) / 2,
      img.width * r,
      img.height * r,
    );
  }
  U.inscrire("panorama-chai", {
    w: 192,
    h: 88,
    images: ["chai-fond", "fut-chene"],
    requises: ["chai-fond"],
    discret: true,
    cle: (s) => JSON.stringify([s.cols, s.futs]),
    fond(c, im, s) {
      fondImage(c, im["chai-fond"]);
      c.fillStyle = "rgba(27,19,16,.24)";
      c.fillRect(0, 0, 192, 88);
      for (let rang = 0; rang < 3; rang++)
        ligne(
          c,
          [
            [18, 41 + rang * 17],
            [173, 41 + rang * 17],
          ],
          "#765535",
          1.5,
        );
      s.futs.forEach((f, i) => {
        const pas = 155 / (s.cols || 6);
        const largeur = (window.Chai?.TAILLES[f.taille]?.w || 1) * pas - 1;
        const hauteur = 15 + largeur * 0.25;
        const x = 18 + f.c * pas,
          y = 41 + f.r * 17 - hauteur;
        contenir(c, im["fut-chene"], x, y, largeur, hauteur);
        if (f.plein)
          ellipse(c, x + largeur / 2, y + hauteur / 2, 1, 1, "#e7b35c");
      });
      boite(c, 128, 72, 51, 4, 1, "#966737");
      ligne(
        c,
        [
          [132, 76],
          [132, 88],
          [174, 88],
          [174, 76],
        ],
        "#6d482a",
        1.5,
      );
      verre(c, 143, 61, 8, 14, 0.3, "#c58643", "edv");
      ligne(
        c,
        [
          [157, 72],
          [165, 59],
        ],
        "#e2dbc0",
        0.8,
      );
    },
    dessin() {},
  });
  U.inscrire("panorama-boutique", {
    w: 192,
    h: 88,
    images: ["decor-arbre", "domaine-pigeonnier-batiment", "personnage-lise"],
    requises: ["domaine-pigeonnier-batiment"],
    continu: true,
    ambiance: true,
    cle: (s) => s.niveau,
    fond(c, im, s) {
      const g = c.createLinearGradient(0, 0, 192, 88);
      g.addColorStop(0, "#668246");
      g.addColorStop(1, "#c5ad6b");
      c.fillStyle = g;
      c.fillRect(0, 0, 192, 88);
      const p = { feuilles: ["#416b28", "#6b9631", "#9bc447"] };
      U.arbre(c, 17, 67, 19, p, 72, false, im["decor-arbre"]);
      U.arbre(c, 179, 72, 21, p, 32, false, im["decor-arbre"]);
      U.batiment(c, im["domaine-pigeonnier-batiment"], 83, 83, 133);
      if (s.niveau >= 2) {
        for (let i = 0; i < 6; i++) {
          boite(c, 62 + i * 7, 65, 3, 8, 0.7, i % 2 ? "#ac8048" : "#6e8249");
          boite(c, 63 + i * 7, 62, 1, 4, 0.3, "#ac8048");
        }
        fut(c, 45, 72, 10, 13);
        fut(c, 115, 72, 10, 13);
      }
      if (s.niveau >= 3) {
        ellipse(c, 149, 69, 16, 6, "#c79452", C.trait);
        ligne(
          c,
          [
            [149, 69],
            [149, 85],
          ],
          "#82572f",
          1.5,
        );
        polygone(
          c,
          [
            [130, 52],
            [149, 44],
            [169, 52],
          ],
          "#e6c17a",
        );
        ligne(
          c,
          [
            [149, 51],
            [149, 69],
          ],
          "#82572f",
          0.8,
        );
      }
    },
    dessin(c, im, s, fx) {
      if (s.niveau >= 2) U.auvent(c, 59, 54, 53, fx.reduit ? null : fx.t);
      acteur(c, im["personnage-lise"], 141, 85, 22, 40, fx.t);
      for (let i = 0; i < 2; i++) {
        const x = 37 + i * 88 + Math.sin(fx.t * 0.45 + i) * 3,
          y = 81 + Math.sin(fx.t * 3 + i) * 0.12;
        ellipse(c, x, y, 2, 1.4, "#f2edcf", C.trait, 0.25);
        ellipse(c, x + 1.8, y - 1.7, 0.9, 0.9, "#f2edcf");
        ligne(
          c,
          [
            [x - 2, y],
            [x - 3, y - 1 - Math.sin(fx.t * 3 + i) * 0.3],
          ],
          "#ccc2a5",
          0.5,
        );
      }
    },
  });
  U.inscrire("panorama-veillee", {
    w: 192,
    h: 88,
    images: ["decor-arbre", "personnage-lise", "personnage-firmin"],
    requises: ["personnage-lise", "personnage-firmin"],
    continu: true,
    ambiance: true,
    fond(c, im) {
      const g = c.createLinearGradient(0, 0, 0, 88);
      g.addColorStop(0, "#172638");
      g.addColorStop(1, "#5b5540");
      c.fillStyle = g;
      c.fillRect(0, 0, 192, 88);
      for (let i = 0; i < 24; i++)
        ellipse(c, (i * 47) % 192, 4 + ((i * 19) % 32), 0.4, 0.4, "#e4d5ad");
      ellipse(c, 159, 17, 6, 6, "#f0dfad");
      c.save();
      c.filter = "brightness(.37) saturate(.7)";
      const p = { feuilles: ["#203c2b", "#2c4a31", "#3b5735"] };
      for (const x of [9, 29, 168, 187])
        U.arbre(c, x, 69, 18, p, x, false, im["decor-arbre"]);
      c.restore();
      ellipse(c, 96, 80, 57, 15, "#82704d");
      for (const x of [49, 127]) {
        boite(c, x, 67, 25, 5, 2, "#9e703e");
        ligne(
          c,
          [
            [x + 3, 72],
            [x + 3, 82],
            [x + 22, 82],
            [x + 22, 72],
          ],
          "#74522e",
          1.2,
        );
      }
      for (let i = 0; i < 9; i++) {
        const a = (i * Math.PI * 2) / 9;
        ellipse(
          c,
          99 + Math.cos(a) * 14,
          78 + Math.sin(a) * 5,
          3,
          2,
          "#b5a47d",
          C.trait,
          0.5,
        );
      }
      ligne(
        c,
        [
          [90, 78],
          [107, 74],
        ],
        "#85532f",
        3,
      );
      ligne(
        c,
        [
          [92, 74],
          [105, 80],
        ],
        "#85532f",
        3,
      );
    },
    dessin(c, im, s, fx) {
      acteur(c, im["personnage-lise"], 64.5, 83, 25, 48, fx.t, 0, 1, 1);
      acteur(c, im["personnage-firmin"], 136, 83, 28, 47, fx.t, 0, 1, 3);
      const g = c.createRadialGradient(99, 71, 1, 99, 71, 34);
      g.addColorStop(
        0,
        `rgba(255,185,70,${0.31 + 0.025 * Math.sin(fx.t * 2.7) + 0.015 * Math.sin(fx.t * 4.1)})`,
      );
      g.addColorStop(1, "rgba(255,185,70,0)");
      c.fillStyle = g;
      c.fillRect(64, 36, 70, 52);
      feu(c, 88, 55, 23, 25, fx.phase, 0.9);
      if (!fx.reduit)
        for (let i = 0; i < 5; i++) {
          const a = (fx.t * 0.32 + i / 5) % 1;
          c.save();
          c.globalAlpha = Math.sin(a * Math.PI) * 0.7;
          ellipse(
            c,
            96 + i * 1.6 + Math.sin(a * 6 + i) * 2,
            73 - a * 28,
            0.3,
            0.65,
            "#ffd17a",
          );
          c.restore();
        }
    },
  });
  const panoramas = new Map();
  let raf = 0;
  function peindre(v, t) {
    if (!U.visible(v.cv)) return;
    const ok = U.rendre(
      "panorama-" + v.nom,
      v.cv.getContext("2d"),
      { ...v.etat, t },
      () => peindre(v, performance.now() / 1000),
    );
    if (!ok) {
      const r = U.ressources.get("panorama-" + v.nom);
      r?.promesse.then((im) => {
        if (!im) v.cv.parentElement.hidden = true;
      });
    }
  }
  function animer(t) {
    raf = 0;
    panoramas.forEach((v) => {
      if (v.anime) peindre(v, t / 1000);
    });
    if (
      !U.media.matches &&
      [...panoramas.values()].some((v) => v.anime && U.visible(v.cv))
    )
      raf = requestAnimationFrame(animer);
  }
  function reveiller() {
    panoramas.forEach((v) => peindre(v, performance.now() / 1000));
    if (
      !raf &&
      !U.media.matches &&
      [...panoramas.values()].some((v) => v.anime && U.visible(v.cv))
    )
      raf = requestAnimationFrame(animer);
  }
  const observateur = new IntersectionObserver(reveiller);
  U.panorama = function (nom, etat) {
    const cv = document.getElementById("panorama-" + nom);
    if (!cv) return;
    cv.parentElement.hidden = false;
    const v = { cv, nom, etat, anime: nom !== "chai" };
    if (!panoramas.has(cv)) observateur.observe(cv);
    panoramas.set(cv, v);
    reveiller();
  };
  document.addEventListener("visibilitychange", reveiller);
  U.media.addEventListener?.("change", reveiller);
})();
