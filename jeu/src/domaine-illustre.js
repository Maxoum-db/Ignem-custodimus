/* Carte du domaine : mêmes repères 192 × 256 et mêmes zones HTML interactives. */
(function () {
  "use strict";
  const U = window.UniversJeu,
    {
      C,
      borne,
      hasard,
      ellipse,
      ligne,
      boite,
      polygone,
      image,
      contenir,
      feu,
      vapeur,
      fut,
    } = U.art;
  const batiments = [
    "domaine-brasserie-1-batiment",
    "domaine-brasserie-2-batiment",
    "domaine-brasserie-3-batiment",
    "domaine-chai-1-batiment",
    "domaine-chai-2-batiment",
    "domaine-pigeonnier-batiment",
  ];
  const animaux = [
    "animal-cheval",
    "animal-poule-blanche",
    "animal-poule-brune",
    "animal-coq",
    "animal-chat-noir",
    "animal-canard",
  ];
  const images = [
    "decor-arbre",
    ...batiments,
    ...animaux,
    "personnage-lise",
    "personnage-firmin",
    "f-alambic-vide",
    "f-condenseur",
  ];
  const saisons = {
    printemps: {
      herbe: "#9cbe58",
      clair: "#bddc78",
      ombre: "#67983f",
      feuilles: ["#4e7c2c", "#76a93b", "#a7c84d"],
      fleurs: "#f3c9d3",
    },
    été: {
      herbe: "#a7bd4a",
      clair: "#c1cf67",
      ombre: "#72933a",
      feuilles: ["#416b28", "#6b9631", "#9bc447"],
      fleurs: "#f2d16d",
    },
    automne: {
      automne: true,
      herbe: "#a7a254",
      clair: "#c6b973",
      ombre: "#7b813d",
      feuilles: ["#82532d", "#c27a32", "#dda744"],
      fleurs: "#dcaa64",
    },
    hiver: {
      herbe: "#ccd0bc",
      clair: "#eff0dc",
      ombre: "#9aa88d",
      feuilles: null,
      fleurs: null,
    },
  };
  function arbre(c, x, y, s, p, seed = 1, fruit = false, img = null) {
    if (img && p.feuilles) {
      c.save();
      if (p.automne) c.filter = "sepia(.65) saturate(1.7) hue-rotate(-28deg)";
      contenir(c, img, x - s * 1.2, y - s * 2.8, s * 2.4, s * 2.8);
      c.restore();
      if (fruit) {
        for (let i = 0; i < 5; i++)
          ellipse(
            c,
            x + (i - 2) * s * 0.24,
            y - s * (1.2 + (i % 3) * 0.3),
            0.6,
            0.7,
            p.fleurs || "#d69a51",
            "#9b5d36",
            0.2,
          );
      }
      return;
    }
    ellipse(c, x + 1, y + 1, s * 0.8, s * 0.22, "rgba(54,51,25,.18)");
    ligne(
      c,
      [
        [x, y],
        [x - 0.3 * s, y - s * 1.7],
        [x + 0.2 * s, y - s * 2.3],
      ],
      "#5b4125",
      s * 0.3,
    );
    for (const d of [-1, 1])
      ligne(
        c,
        [
          [x, y - s * 0.6],
          [x + d * s * 0.5, y - s * 1.45],
          [x + d * s * 0.65, y - s * 1.9],
        ],
        "#6d4c2a",
        s * 0.15,
      );
    if (!p.feuilles) {
      for (let i = 0; i < 4; i++)
        ligne(
          c,
          [
            [x + (i - 1.5) * s * 0.3, y - s * (1.3 + (i % 2) * 0.3)],
            [x + (i - 1.5) * s * 0.6, y - s * (2 + (i % 2) * 0.2)],
          ],
          "#725237",
          0.5,
        );
      ellipse(c, x, y - s * 1.3, s * 0.4, s * 0.12, "#f5f2db");
      return;
    }
    const r = hasard(seed);
    c.beginPath();
    for (let i = 0; i <= 24; i++) {
      const a = (i / 24) * Math.PI * 2,
        ray = 0.82 + r() * 0.23,
        xx = x + Math.cos(a) * s * ray,
        yy = y - s * 1.75 + Math.sin(a) * s * 0.85 * ray;
      i ? c.lineTo(xx, yy) : c.moveTo(xx, yy);
    }
    c.fillStyle = p.feuilles[0];
    c.fill();
    c.strokeStyle = "#41502a";
    c.lineWidth = 0.65;
    c.stroke();
    for (let i = 0; i < 18; i++) {
      const a = r() * Math.PI * 2,
        d = Math.sqrt(r()) * 0.8;
      ellipse(
        c,
        x + Math.cos(a) * s * d - 0.1 * s,
        y - s * 1.85 + Math.sin(a) * s * 0.65 * d,
        s * (0.18 + r() * 0.18),
        s * (0.13 + r() * 0.12),
        p.feuilles[1 + (i % 2)],
      );
    }
    for (let i = 0; i < 18; i++) {
      const xx = x + (r() - 0.5) * s * 1.4,
        yy = y - s * 1.8 + (r() - 0.5) * s;
      ligne(
        c,
        [
          [xx, yy],
          [xx + s * 0.09, yy - s * 0.04],
        ],
        i % 3 ? p.feuilles[2] : p.feuilles[0],
        0.5,
      );
    }
    if (fruit)
      for (let i = 0; i < 5; i++)
        ellipse(
          c,
          x + (r() - 0.5) * s * 1.1,
          y - s * 1.7 + (r() - 0.5) * s,
          0.65,
          0.75,
          p.fleurs || "#d88c48",
          "#985c30",
          0.2,
        );
  }
  function muret(c, x, y, w) {
    for (let rang = 0; rang < 2; rang++)
      for (let i = 0; i < w / 5; i++)
        boite(
          c,
          x + i * 5 + (rang % 2) * 2.3,
          y - rang * 3,
          4.9,
          3.2,
          0.7,
          rang ? "#e5d4aa" : "#bcad86",
          "#8e805f",
          0.4,
        );
  }
  function cloture(c, pts) {
    ligne(c, pts, "#896038", 1);
    for (const [x, y] of pts) {
      ligne(
        c,
        [
          [x, y + 1],
          [x, y - 5],
        ],
        "#6b492c",
        1.2,
      );
      ellipse(c, x, y - 5, 0.8, 0.4, "#c7985d");
    }
  }
  function chemin(c, pts, largeur = 6) {
    c.beginPath();
    c.moveTo(...pts[0]);
    c.bezierCurveTo(...pts[1], ...pts[2], ...pts[3]);
    c.lineWidth = largeur + 1;
    c.strokeStyle = "#a88748";
    c.lineCap = "round";
    c.stroke();
    c.lineWidth = largeur;
    c.strokeStyle = "#dabb76";
    c.stroke();
  }
  function potager(c, x, y, p) {
    polygone(
      c,
      [
        [x, y + 7],
        [x + 24, y],
        [x + 35, y + 15],
        [x + 10, y + 22],
      ],
      "#86592f",
      "#634a29",
    );
    for (let j = 0; j < 4; j++)
      for (let i = 0; i < 5; i++) {
        const xx = x + 6 + i * 4 + j * 2.1,
          yy = y + 7 + j * 3.7 - i * 0.8;
        ellipse(c, xx, yy, 1.8, 0.7, "#567a32");
        ligne(
          c,
          [
            [xx - 1, yy],
            [xx, yy - 2],
            [xx + 1.1, yy],
          ],
          p.feuilles ? "#9abf4b" : "#ddd9bc",
          0.6,
        );
        if (j % 2 && p.fleurs)
          ellipse(c, xx, yy - 1, 1, 0.65, j === 1 ? "#cb6e3f" : "#aca559");
      }
    cloture(c, [
      [x, y + 10],
      [x + 10, y + 24],
      [x + 22, y + 21],
      [x + 36, y + 17],
    ]);
  }
  function vignes(c, p) {
    const vigne = p.feuilles ? "#6c8831" : "#8b8568";
    for (let j = 0; j < 5; j++) {
      const x = 60 + j * 14,
        y = 49 + j * 1.5;
      ligne(
        c,
        [
          [x, y],
          [x - 16, y + 27],
        ],
        "#9b7948",
        1.8,
      );
      for (let i = 0; i < 6; i++) {
        const xx = x - i * 2.6,
          yy = y + i * 4.5;
        ligne(
          c,
          [
            [xx, yy + 1],
            [xx, yy - 2],
          ],
          "#725136",
          0.7,
        );
        ellipse(c, xx, yy - 2, 2.4, 1.4, vigne);
        if (p.feuilles) {
          ellipse(c, xx - 1, yy - 3, 1.7, 1, p.feuilles[2]);
          if (j % 2 === 0) ellipse(c, xx + 0.7, yy, 0.55, 0.7, "#6f4d66");
        }
      }
    }
  }
  function terrain(c, x, y, w, h, travaux) {
    ellipse(
      c,
      x + w / 2,
      y + h * 0.6,
      w * 0.48,
      h * 0.38,
      travaux ? "#bf9d60" : "#b9ad72",
    );
    cloture(c, [
      [x, y + h],
      [x, y + 5],
      [x + w - 3, y + 1],
      [x + w, y + h - 2],
    ]);
    for (let i = 0; i < 5; i++)
      boite(
        c,
        x + 6 + i * 3,
        y + h - 3 - (i % 2) * 2,
        4,
        2,
        1,
        "#c8c3a7",
        "#8e866a",
        0.35,
      );
    for (let i = 0; i < 4; i++)
      ligne(
        c,
        [
          [x + w - 18, y + h - 8 - i * 1.2],
          [x + w - 3, y + h - 10 - i * 1.2],
        ],
        "#b48746",
        1.5,
      );
    if (travaux) {
      ligne(
        c,
        [
          [x + 5, y + 7],
          [x + 5, y - 9],
          [x + w - 7, y - 9],
          [x + w - 7, y + 4],
        ],
        "#805934",
        1.1,
      );
      ligne(
        c,
        [
          [x + 5, y - 9],
          [x + w - 7, y + 4],
        ],
        "#a37a42",
        0.8,
      );
    }
  }
  function batiment(c, img, cx, sol, w) {
    image(c, img, cx - w / 2, sol - (w / 1.5) * 0.9004, w, w / 1.5);
  }
  function auvent(c, x, y, w) {
    ligne(
      c,
      [
        [x, y],
        [x, y + 16],
        [x + w, y + 16],
        [x + w, y],
      ],
      "#78502e",
      1,
    );
    for (let i = 0; i < 8; i++)
      polygone(
        c,
        [
          [x + (i * w) / 8, y],
          [x + ((i + 1) * w) / 8, y],
          [x + ((i + 1) * w) / 8 + 2, y + 6],
          [x + (i * w) / 8 + 2, y + 6],
        ],
        i % 2 ? "#fff0cc" : "#df8948",
        "#9c6838",
        0.3,
      );
    boite(c, x - 1, y + 16, w + 3, 3, 1, "#a7743e");
  }
  function table(c, x, y) {
    ellipse(c, x, y + 2, 4, 1.5, "#6f4d2b", C.trait, 0.4);
    ligne(
      c,
      [
        [x, y + 2],
        [x, y + 8],
      ],
      "#6b4828",
      0.9,
    );
    ellipse(c, x, y + 1, 4.5, 1.8, "#c59553", C.trait, 0.4);
  }
  U.inscrire("domaine", {
    w: 192,
    h: 256,
    images,
    requises: batiments,
    discret: true,
    cle: (s) =>
      [
        s.saison,
        s.nuit,
        ...Object.values(s.bat),
        ...(s.travaux || []).map((t) => t.bat + ":" + t.fin),
      ].join("|"),
    fond(c, im, s) {
      const p = saisons[s.saison] || saisons.printemps,
        r = hasard(2403);
      const ciel = c.createLinearGradient(0, 0, 0, 74);
      ciel.addColorStop(0, "#70b6df");
      ciel.addColorStop(1, "#d6e9d0");
      c.fillStyle = ciel;
      c.fillRect(0, 0, 192, 90);
      for (let j = 0; j < 3; j++) {
        c.beginPath();
        c.moveTo(0, 60 + j * 5);
        for (let x = 0; x <= 192; x += 4)
          c.lineTo(
            x,
            50 + j * 7 + Math.sin(x / 26 + j) * 5 + Math.sin(x / 11) * 2,
          );
        c.lineTo(192, 110);
        c.lineTo(0, 110);
        c.fillStyle = ["#83aa9b", "#8ba86b", p.ombre][j];
        c.fill();
      }
      const sol = c.createLinearGradient(0, 70, 0, 256);
      sol.addColorStop(0, p.ombre);
      sol.addColorStop(0.45, p.herbe);
      sol.addColorStop(1, p.clair);
      c.fillStyle = sol;
      c.fillRect(0, 78, 192, 178);
      // Village lointain, détails de sol, fleurs, parcelles et murets indépendants.
      for (let i = 0; i < 9; i++) {
        const x = 105 + i * 4,
          y = 44 + Math.sin(i) * 2;
        boite(c, x, y, 3.8, 5, 0.4, "#d7c593", "#8f8866", 0.25);
        polygone(
          c,
          [
            [x - 0.5, y],
            [x + 2, y - 2],
            [x + 4.2, y],
          ],
          "#b66f45",
          null,
        );
      }
      polygone(
        c,
        [
          [124, 44],
          [124, 33],
          [126, 26],
          [128, 33],
          [128, 44],
        ],
        "#d9ccaa",
        "#8c9d87",
        0.3,
      );
      for (let i = 0; i < 820; i++) {
        const x = r() * 192,
          y = 79 + r() * 177;
        ellipse(
          c,
          x,
          y,
          0.15 + r() * 0.6,
          0.12 + r() * 0.24,
          i % 4 ? p.clair : p.ombre,
        );
        if (i % 39 === 0 && p.fleurs) {
          ligne(
            c,
            [
              [x, y],
              [x, y - 1.4],
            ],
            p.ombre,
            0.3,
          );
          ellipse(c, x, y - 1.5, 0.5, 0.35, p.fleurs);
        }
      }
      vignes(c, p);
      potager(c, 103, 75, p);
      for (const [x, y, z] of [
        [8, 61, 9],
        [24, 58, 10],
        [42, 65, 8],
        [155, 64, 11],
        [174, 67, 10],
        [188, 61, 10],
      ])
        arbre(c, x, y, z, p, Math.round(x * 31), false, im["decor-arbre"]);
      for (const [x, y] of [
        [38, 82],
        [54, 89],
        [67, 95],
      ])
        arbre(c, x, y, 5.5, p, x + 100, true, im["decor-arbre"]);
      muret(c, 0, 107, 39);
      muret(c, 164, 96, 28);
      chemin(
        c,
        [
          [99, 256],
          [90, 226],
          [76, 205],
          [52, 173],
        ],
        7,
      );
      chemin(
        c,
        [
          [84, 204],
          [96, 190],
          [128, 181],
          [145, 167],
        ],
        5,
      );
      chemin(
        c,
        [
          [85, 208],
          [113, 218],
          [137, 199],
          [151, 204],
        ],
        5,
      );
      chemin(
        c,
        [
          [105, 251],
          [128, 248],
          [141, 246],
          [153, 236],
        ],
        5,
      );
      chemin(
        c,
        [
          [38, 190],
          [22, 174],
          [16, 145],
          [17, 113],
        ],
        4,
      );
      // Mare et plantes de berge, sans zone interactive inventée.
      ellipse(c, 15, 88, 16, 10, "#8b9d65", "#7c8356", 1.3);
      ellipse(c, 15, 87, 14, 8, "#5eacbf", "#b2d5bb", 0.7);
      for (let i = 0; i < 10; i++) {
        const a = (i * Math.PI) / 5;
        ellipse(
          c,
          15 + Math.cos(a) * 15,
          88 + Math.sin(a) * 9,
          2,
          1.2,
          "#bcbca1",
          "#838969",
          0.35,
        );
      }
      for (let i = 0; i < 5; i++)
        ligne(
          c,
          [
            [3 + i * 2, 81],
            [2 + i * 2, 76],
            [5 + i * 2, 80],
          ],
          "#68883a",
          0.7,
        );
      // Rucher : décor et point d'information existant, toujours « bientôt ».
      for (let i = 0; i < 4; i++) {
        const x = 140 + i * 11;
        boite(
          c,
          x,
          99 + (i % 2),
          8,
          10,
          1,
          ["#ebbd48", "#e0a64c", "#94b64b", "#e5b656"][i],
        );
        polygone(
          c,
          [
            [x - 1, 99 + (i % 2)],
            [x + 4, 96 + (i % 2)],
            [x + 9, 99 + (i % 2)],
          ],
          i % 2 ? "#5c9348" : "#528ca7",
        );
        ligne(
          c,
          [
            [x + 2, 105 + (i % 2)],
            [x + 6, 105 + (i % 2)],
          ],
          "#675237",
          0.8,
        );
      }
      const tr = (nom) => (s.travaux || []).some((t) => t.bat === nom);
      batiment(
        c,
        im["domaine-brasserie-" + (s.bat.brasserie || 1) + "-batiment"],
        54,
        176,
        96,
      );
      if (s.bat.chai)
        batiment(
          c,
          im["domaine-chai-" + Math.min(2, s.bat.chai) + "-batiment"],
          143,
          169,
          78,
        );
      else terrain(c, 113, 139, 60, 24, tr("chai"));
      if (s.bat.distillerie) {
        if (s.bat.distillerie >= 2) {
          for (const x of [119, 173])
            ligne(
              c,
              [
                [x, 205],
                [x, 174],
              ],
              "#7b542e",
              1.7,
            );
          polygone(
            c,
            [
              [114, 177],
              [146, 166],
              [180, 177],
              [149, 185],
            ],
            "#d18b4c",
          );
          for (let i = 0; i < 8; i++)
            ligne(
              c,
              [
                [118 + i * 7, 178],
                [146 + i * 3, 168 + i * 0.7],
              ],
              "#ab6539",
              0.5,
            );
        }
        image(c, im["f-alambic-vide"], 116, 175, 43, 40);
        image(c, im["f-condenseur"], 157, 182, 19, 25);
        ligne(
          c,
          [
            [138, 179],
            [141, 176],
            [166, 188],
          ],
          "#b66e35",
          1.4,
        );
      } else terrain(c, 123, 188, 49, 22, tr("distillerie"));
      batiment(c, im["domaine-pigeonnier-batiment"], 49, 233, 82);
      if (s.bat.pigeonnier >= 2) {
        auvent(c, 25, 215, 49);
        fut(c, 21, 222, 7, 9);
        fut(c, 73, 222, 7, 9);
      }
      if (s.bat.pigeonnier >= 3) {
        table(c, 23, 234);
        table(c, 76, 231);
        cloture(c, [
          [14, 241],
          [41, 245],
          [69, 242],
          [85, 236],
        ]);
      }
      if (tr("brasserie")) terrain(c, 15, 172, 24, 9, true);
      if (tr("chai") && s.bat.chai) terrain(c, 158, 166, 18, 7, true);
      if (tr("pigeonnier")) terrain(c, 66, 226, 14, 7, true);
      // Foyer, bancs et petit bois pour la veillée.
      ellipse(c, 145, 242, 10, 4, "#9a8b59");
      for (let i = 0; i < 8; i++) {
        const a = (i * Math.PI) / 4;
        ellipse(
          c,
          145 + Math.cos(a) * 8,
          242 + Math.sin(a) * 3.5,
          2,
          1.2,
          "#c1b799",
          "#8c8066",
          0.4,
        );
      }
      ligne(
        c,
        [
          [139, 243],
          [150, 239],
        ],
        "#86562e",
        2,
      );
      ligne(
        c,
        [
          [140, 239],
          [150, 244],
        ],
        "#86562e",
        2,
      );
      for (const [x, y] of [
        [127, 240],
        [162, 239],
      ]) {
        ligne(
          c,
          [
            [x - 4, y],
            [x + 4, y - 2],
          ],
          "#8b6236",
          2.2,
        );
        ligne(
          c,
          [
            [x - 2, y + 1],
            [x - 2, y + 4],
          ],
          "#6b4b2c",
          0.8,
        );
      }
      for (const [x, y, z] of [
        [3, 133, 6],
        [190, 138, 7],
        [7, 249, 8],
        [188, 239, 9],
        [185, 175, 6],
      ])
        arbre(c, x, y, z, p, x * 17, false, im["decor-arbre"]);
      if (s.saison === "hiver") {
        for (let i = 0; i < 80; i++)
          ellipse(
            c,
            r() * 192,
            82 + r() * 174,
            1.5 + r() * 3,
            0.4 + r() * 0.5,
            "rgba(250,250,230,.6)",
          );
      }
    },
    dessin(c, im, s, fx) {
      const bob = [0, 0.25, 0.5, 0.25, 0, -0.2][fx.frame];
      for (let i = 0; i < 3; i++) {
        const x = ((i * 76 + fx.frame * 0.6) % 230) - 18,
          y = 17 + i * 9;
        ellipse(c, x, y, 14, 3, "#fff7e6");
        ellipse(c, x - 3, y - 3, 6, 4, "#fffaf0");
        ellipse(c, x + 5, y - 2, 7, 3, "#fffaf0");
      }
      const positions = [
        ["animal-cheval", 41, 79, 18, 24],
        ["animal-canard", 10, 79, 7, 9],
        ["animal-poule-blanche", 80, 179, 7, 10],
        ["animal-poule-brune", 98, 198, 7, 9],
        ["animal-coq", 83, 216, 7, 10],
        ["animal-chat-noir", 61, 220, 8, 10],
        ["personnage-lise", 89, 177, 10, 17],
        ["personnage-firmin", 112, 220, 12, 18],
      ];
      for (const [cle, x, y, w, h] of positions) {
        ellipse(
          c,
          x + w * 0.5,
          y + h,
          w * 0.35,
          h * 0.045,
          "rgba(45,35,19,.2)",
        );
        contenir(c, im[cle], x, y + bob, w, h);
      }
      for (let i = 0; i < 3; i++)
        ligne(
          c,
          [
            [5 + i * 6, 86 + (i % 2) * 2 + bob],
            [9 + i * 6, 86 + (i % 2) * 2 + bob],
          ],
          "rgba(234,247,226,.6)",
          0.5,
        );
      if (s.nuit) {
        c.fillStyle = "rgba(12,22,39,.57)";
        c.fillRect(0, 0, 192, 256);
        ellipse(c, 159, 22, 6, 6, "#f1e8c5");
        ellipse(c, 161, 20, 5, 5, "#354454");
        for (let i = 0; i < 20; i++)
          ellipse(
            c,
            (i * 47) % 191,
            5 + ((i * 19) % 35),
            0.35,
            0.35,
            "#eee8cb",
          );
      }
      const halo = c.createRadialGradient(145, 240, 1, 145, 240, 18);
      halo.addColorStop(
        0,
        s.nuit ? "rgba(255,187,65,.4)" : "rgba(255,193,68,.12)",
      );
      halo.addColorStop(1, "rgba(255,179,50,0)");
      c.fillStyle = halo;
      c.fillRect(126, 220, 39, 36);
      feu(c, 138, 231, 14, 12, fx.frame, 0.85);
      if (!fx.reduit && s.bat.brasserie > 1) vapeur(c, 34, 122, fx.t, 0.28);
      if (!fx.reduit && s.saison === "automne")
        for (let i = 0; i < 5; i++)
          ellipse(
            c,
            9 + i * 41 + bob * 2,
            108 + i * 19 + fx.frame * 0.4,
            0.6,
            0.3,
            "#c18b40",
          );
      if (s.saison === "printemps")
        for (const [x, y] of [
          [39, 72],
          [67, 87],
          [114, 94],
        ]) {
          ellipse(c, x - bob, y, 1, 0.45, "#f1cf82");
          ellipse(c, x + 1 + bob, y - 0.3, 1, 0.5, "#f4dd96");
        }
      if (s.saison === "hiver" && !fx.reduit)
        for (let i = 0; i < 11; i++)
          ellipse(
            c,
            (i * 43 + fx.frame * 0.6) % 192,
            80 + ((i * 29 + fx.frame * 0.7) % 170),
            0.45,
            0.6,
            "rgba(255,255,244,.8)",
          );
    },
  });
  U.arbre = arbre;
  U.batiment = batiment;
  U.auvent = auvent;
})();
