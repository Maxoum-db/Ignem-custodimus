/* Ulysse et verrerie : lecture seule des états de présentation du vrai jeu. */
(function () {
  "use strict";
  const U = window.UniversJeu,
    A = U.art,
    {
      C,
      borne,
      ellipse,
      ligne,
      boite,
      texte,
      image,
      tuyau,
      vanne,
      cadran,
      gouttes,
      feu,
      vapeur,
      verre,
    } = A;
  const images = ["f-fond", "f-alambic-vide", "f-condenseur"];
  function fond(c, imgs, w = 192, h = 120) {
    if (imgs["f-fond"]) {
      const img = imgs["f-fond"],
        r = Math.max(w / img.width, h / img.height);
      image(
        c,
        img,
        (w - img.width * r) / 2,
        (h - img.height * r) / 2,
        img.width * r,
        img.height * r,
      );
    } else {
      c.fillStyle = "#3a2a1c";
      c.fillRect(0, 0, w, h);
    }
  }
  function machine(c, imgs, s, fx) {
    ellipse(c, 78, 113, 68, 6, "rgba(48,30,12,.2)");
    tuyau(c, [
      [62, 33],
      [62, 19],
      [92, 19],
      [130, 37],
      [151, 46],
    ]);
    image(c, imgs["f-alambic-vide"], 10, 25, 100, 94);
    image(c, imgs["f-condenseur"], 113, 32, 57, 72);
    tuyau(c, [
      [164, 82],
      [175, 82],
      [175, 95],
    ]);
    vanne(c, 164, 82, s.prog ?? 0.5);
    cadran(c, 92, 35, s.feu?.P ?? 0.4);
    texte(c, "ULYSSE", 40, 15, 7, "#573820");
    const force =
      borne(s.feu?.flamme ?? s.force ?? 0, 0, 1.35) *
      (s.evenement === "humide" ? 0.4 : 1);
    feu(c, 60, 77, 20, 12, fx.phase, force);
    // Reflets décoratifs discrets ; les jauges continuent de lire le moteur.
    c.save();
    c.globalAlpha = 0.22 + 0.1 * Math.sin(fx.t * 0.8);
    ligne(
      c,
      [
        [38, 56],
        [37, 61],
        [38, 66],
      ],
      "#fff2bf",
      0.9,
    );
    ligne(
      c,
      [
        [120, 62],
        [120, 80],
      ],
      "#fff2bf",
      0.65,
    );
    c.restore();
    if (s.feu?.buches)
      for (let i = 0; i < Math.min(4, s.feu.buches.length); i++)
        ligne(
          c,
          [
            [60 + i * 4, 89],
            [64 + i * 4, 88],
          ],
          s.feu.buches[i].age < 1.1 ? "#60472e" : "#bc7738",
          1.5,
        );
    // Le hublot est vide dans l'asset. Le liquide et la mousse sont des couches.
    if (s.couleur) {
      c.save();
      c.beginPath();
      c.ellipse(69.5, 60, 4.3, 5.2, 0, 0, Math.PI * 2);
      c.clip();
      const y = 65.2 - borne(1 - (s.prog || 0)) * 10.4;
      c.fillStyle = s.couleur;
      c.fillRect(64, y, 12, 66 - y);
      if (y < 65) {
        c.beginPath();
        c.moveTo(64, y);
        c.quadraticCurveTo(68, y + Math.sin(fx.t * 2.5) * 0.3, 75, y);
        c.strokeStyle = "rgba(255,237,174,.7)";
        c.lineWidth = 0.35;
        c.stroke();
      }
      if (s.mousse > 0) {
        c.fillStyle = "#fff2ce";
        c.fillRect(64, y - s.mousse * 8, 12, s.mousse * 8);
      }
      c.restore();
    }
    if (s.chaud > 0.4 || (s.coup != null && s.t - s.coup < 2)) {
      ellipse(c, 64, 93, 26, 3, "rgba(220,77,34,.65)");
      if (!fx.reduit) vapeur(c, 48, 75, fx.t, 1, true);
    }
    if (s.debord != null && s.t - s.debord < 2.2)
      ligne(
        c,
        [
          [69, 55],
          [69, 34],
          [63, 25],
          [91, 23],
          [128, 39],
        ],
        "#fff1cb",
        2,
      );
    if (force > 0.05 && !fx.reduit) vapeur(c, 84, 30, fx.t, 0.45);
    if (force > 0.05 && !fx.reduit)
      for (let i = 0; i < 3; i++) {
        const a = (fx.t * 0.65 + i / 3) % 1;
        c.save();
        c.globalAlpha = Math.sin(a * Math.PI) * Math.min(force, 1) * 0.6;
        ellipse(
          c,
          62 + i * 4 + Math.sin(a * 4 + i),
          86 - a * 12,
          0.25,
          0.55,
          "#ffd38a",
        );
        c.restore();
      }
    if (s.evenement === "humide" && !fx.reduit)
      vapeur(c, 56, 73, fx.t, 0.6, true);
  }
  U.inscrire("ulysse", {
    w: 96,
    h: 72,
    images,
    requises: ["f-alambic-vide", "f-condenseur"],
    fond: (c, im) => fond(c, im, 96, 72),
    dessin(c, im, s, fx) {
      c.save();
      c.scale(0.5, 0.5);
      machine(c, im, s, fx);
      c.restore();
    },
  });
  U.inscrire("brouillis", {
    w: 192,
    h: 120,
    images,
    requises: ["f-alambic-vide", "f-condenseur"],
    fond: (c, im) => fond(c, im),
    dessin(c, im, s, fx) {
      machine(c, im, s, fx);
      boite(c, 161, 99, 23, 16, 3, "rgba(235,246,226,.3)", "#7d958a");
      const h = borne(s.prog) * 13;
      boite(
        c,
        163,
        113 - h,
        19,
        Math.max(0.1, h),
        1,
        "rgba(239,246,227,.75)",
        null,
      );
      if (s.t > 0 && s.prog < 1) gouttes(c, 175, 94, fx.t, "#f3f2d9");
      ligne(
        c,
        [
          [162, 102],
          [165, 102],
          [165, 109],
        ],
        "rgba(255,255,233,.65)",
        0.8,
      );
    },
  });
  const couleurs = {
    tetes: "#e3593d",
    esters: "#f3b04a",
    terpenes: "#9cc95e",
    cereale: "#d9c7a0",
    queues: "#8f7ad0",
    furfural: "#b9865a",
  };
  function courbes(c, s) {
    const gx = 22,
      gw = 164,
      gy = 6,
      gh = 100;
    boite(c, 9, 2, 181, 114, 5, "rgba(28,23,18,.96)", "#9b784b");
    const Y = (v) =>
        gy + gh - borne((Math.log10(Math.max(v, 0.01)) + 2) / 4) * gh,
      Yd = (d) => gy + gh - (d / 100) * gh;
    for (const v of [0.01, 0.1, 1, 10, 100]) {
      const y = Y(v);
      ligne(
        c,
        [
          [gx, y],
          [gx + gw, y],
        ],
        "#564431",
        0.4,
      );
      texte(c, String(v), 20, y + 2, 4.2, "#d8c6a5", "right");
    }
    for (const f of [0.25, 0.5, 0.75])
      ligne(
        c,
        [
          [gx + f * gw, gy],
          [gx + f * gw, gy + gh],
        ],
        "#493a2d",
        0.4,
      );
    for (const coupe of s.coupes)
      ligne(
        c,
        [
          [gx + coupe.recup * gw, gy],
          [gx + coupe.recup * gw, gy + gh],
        ],
        "#f6edd9",
        0.7,
      );
    c.save();
    c.beginPath();
    c.rect(gx, gy, gw, gh);
    c.clip();
    for (const k in couleurs) {
      const pts = s.courbe.map((p) => [gx + p.recup * gw, Y(p[k])]);
      if (pts.length) ligne(c, pts, couleurs[k], 0.8);
    }
    if (s.courbe.length)
      ligne(
        c,
        s.courbe.map((p) => [gx + p.recup * gw, Yd(p.degre)]),
        "#fff9e5",
        1,
      );
    c.restore();
    texte(c, "Alcool recueilli", 103, 114, 4.7, "#ead7b4", "center");
  }
  U.inscrire("repasse", {
    w: 192,
    h: 120,
    images,
    requises: ["f-alambic-vide", "f-condenseur"],
    cle: (s) => (s.expert ? "expert" : "atelier"),
    fond: (c, im) => fond(c, im),
    dessin(c, im, s, fx) {
      if (s.expert) {
        courbes(c, s);
        return;
      }
      c.save();
      c.translate(-3, 8);
      c.scale(0.72, 0.85);
      machine(c, im, s, fx);
      c.restore();
      boite(c, 129, 21, 13, 89, 4, "rgba(235,244,224,.55)", "#6b837a");
      const d = s.degre || 0;
      boite(
        c,
        134,
        104 - d * 0.8,
        3,
        Math.max(0.1, d * 0.8),
        1,
        "#fff4d6",
        null,
      );
      ellipse(c, 135.5, 104 - d * 0.8, 4, 2, "#efe1ba", "#7a654b");
      for (const g of [40, 50, 60, 70, 80]) {
        const y = 104 - g * 0.8;
        ligne(
          c,
          [
            [143, y],
            [147, y],
          ],
          g === 60 ? "#bd7d32" : "#6c5a42",
          0.5,
        );
        texte(c, String(g), 148, y + 1.5, 4.3);
      }
      const teintes = ["#df7554", "#87a753", "#9b83c6"];
      for (let i = 0; i < 3; i++) {
        const x = 158 + i * 10,
          f = s.fractions[i],
          h = Math.min(40, f.V * 1.2);
        boite(c, x, 62, 8, 44, 2, "rgba(239,244,228,.22)", "#7d8b7e", 0.5);
        if (h > 0)
          boite(
            c,
            x + 1,
            105 - h,
            6,
            h,
            1,
            i === s.phase ? teintes[i] : "rgba(244,235,209,.55)",
            null,
          );
        if (i === s.phase) {
          boite(c, x - 1, 57, 10, 2, 1, teintes[i], null);
          if (s.t > 0) gouttes(c, x + 4, 52, fx.t, teintes[i], 0.6);
        }
      }
      texte(c, "T", 162, 114, 5);
      texte(c, "C", 172, 114, 5);
      texte(c, "Q", 182, 114, 5);
    },
  });

  for (const nom of ["verre-biere", "verre-edv", "verre-vieilli"])
    U.inscrire(nom, {
      w: 64,
      h: 96,
      images: [],
      fond(c) {
        const g = c.createLinearGradient(0, 0, 64, 96);
        g.addColorStop(0, "#3b2b1e");
        g.addColorStop(1, "#211a14");
        c.fillStyle = g;
        c.fillRect(0, 0, 64, 96);
        ellipse(c, 32, 91, 22, 3, "rgba(0,0,0,.24)");
      },
      dessin(c, im, s, fx) {
        verre(
          c,
          5,
          1,
          54,
          94,
          (nom === "verre-biere" ? 0.88 : 0.28) * s.p,
          s.couleur,
          nom === "verre-biere" ? "biere" : "edv",
          fx.t,
        );
      },
    });
  U.inscrire("verre-aveugle", {
    w: 10,
    h: 15,
    images: [],
    dessin(c, im, s, fx) {
      verre(c, 0.3, 0, 9.4, 15, 0.28, "#eee8d7", "edv", 0);
    },
  });
  U.inscrire("flacon", {
    w: 16,
    h: 36,
    images: [],
    dessin(c, im, s) {
      const forme = new Path2D();
      forme.moveTo(6, 3);
      forme.lineTo(10, 3);
      forme.lineTo(10, 10);
      forme.quadraticCurveTo(14, 12, 14, 16);
      forme.lineTo(14, 32);
      forme.quadraticCurveTo(14, 35, 8, 35);
      forme.quadraticCurveTo(2, 35, 2, 32);
      forme.lineTo(2, 16);
      forme.quadraticCurveTo(2, 12, 6, 10);
      forme.closePath();
      c.save();
      c.fillStyle = s.edv ? "rgba(207,231,221,.25)" : "rgba(82,120,55,.5)";
      c.fill(forme);
      c.save();
      c.clip(forme);
      c.fillStyle = s.edv === "1" ? "rgba(240,238,221,.6)" : s.couleur;
      c.fillRect(2, 15, 12, 21);
      ligne(
        c,
        [
          [4, 14],
          [4, 30],
        ],
        "rgba(255,255,232,.65)",
        0.7,
      );
      c.restore();
      c.strokeStyle = "#5f422d";
      c.lineWidth = 0.7;
      c.stroke(forme);
      boite(c, 3, 21, 10, 8, 1, s.edv ? "#c98e50" : "#eddbb2", C.trait, 0.4);
      ligne(
        c,
        [
          [5, 24],
          [11, 24],
        ],
        "#825a33",
        0.7,
      );
      boite(c, 5, 1, 6, 3, 0.7, "#b78248");
      if (s.medaille)
        ellipse(
          c,
          11,
          30,
          2,
          2,
          { or: "#f0c65b", argent: "#c4ced0", bronze: "#c68a54" }[s.medaille],
          C.trait,
          0.4,
        );
      c.restore();
    },
  });
})();
