/* Prométhée : infrastructure de présentation illustrée.
 * Aucun moteur, aucune sauvegarde et aucun événement de jeu ne sont pilotés ici.
 * Tous les états reçus sont lus. Un échec graphique laisse le dessin historique.
 */
(function () {
  "use strict";
  const I = window.IllustrationsJeu,
    registres = new Map(),
    ressources = new Map(),
    vues = new WeakMap();
  const media = matchMedia("(prefers-reduced-motion: reduce)");
  // Atlas statiques, six dessins à ancrage commun ; aucune règle de jeu.
  const mouvements = Object.freeze({
    "personnage-lise": Object.freeze({
      cle: "marche-lise",
      ancre: 0.9375,
      echelle: 1.1041666667,
      orientation: 1,
      type: "marche",
    }),
    "personnage-firmin": Object.freeze({
      cle: "marche-firmin",
      ancre: 0.9375,
      echelle: 1.119047619,
      orientation: 1,
      type: "marche",
    }),
    "animal-cheval": Object.freeze({
      cle: "pas-cheval",
      ancre: 0.984375,
      echelle: 0.99025,
      orientation: -1,
      type: "marche",
    }),
    "animal-poule-blanche": Object.freeze({
      cle: "picorer-poule-blanche",
      ancre: 0.984375,
      echelle: 0.9658,
      orientation: -1,
      type: "picorer",
    }),
  });
  const C = {
    trait: "#3b2a1e",
    papier: "#fff0cd",
    or: "#efbd64",
    cuivre: "#df994d",
    vert: "#8db941",
    bleu: "#80b5c1",
  };
  const borne = (n, a = 0, b = 1) => Math.max(a, Math.min(b, n));
  const hasard = (n) => {
    let x = n || 1;
    return () => {
      x = (x * 16807) % 2147483647;
      return (x - 1) / 2147483646;
    };
  };
  function ellipse(c, x, y, rx, ry, col, trait, ep = 0.65) {
    c.beginPath();
    c.ellipse(x, y, Math.max(0.01, rx), Math.max(0.01, ry), 0, 0, Math.PI * 2);
    c.fillStyle = col;
    c.fill();
    if (trait) {
      c.strokeStyle = trait;
      c.lineWidth = ep;
      c.stroke();
    }
  }
  function ligne(c, pts, col = C.trait, ep = 1) {
    c.beginPath();
    pts.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y)));
    c.lineJoin = c.lineCap = "round";
    c.strokeStyle = col;
    c.lineWidth = ep;
    c.stroke();
  }
  function boite(c, x, y, w, h, r, col, trait = C.trait, ep = 0.7) {
    c.beginPath();
    c.roundRect(x, y, w, h, r);
    c.fillStyle = col;
    c.fill();
    if (trait) {
      c.strokeStyle = trait;
      c.lineWidth = ep;
      c.stroke();
    }
  }
  function polygone(c, pts, col, trait = C.trait, ep = 0.7) {
    c.beginPath();
    pts.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y)));
    c.closePath();
    c.fillStyle = col;
    c.fill();
    if (trait) {
      c.strokeStyle = trait;
      c.lineWidth = ep;
      c.stroke();
    }
  }
  function texte(c, txt, x, y, size = 5.5, col = C.trait, align = "left") {
    c.font = `700 ${size}px "Comic Neue",sans-serif`;
    c.textAlign = align;
    c.fillStyle = col;
    c.fillText(txt, x, y);
  }
  function image(c, img, x, y, w, h) {
    if (!img) return false;
    c.drawImage(img, x, y, w, h);
    return true;
  }
  function contenir(c, img, x, y, w, h) {
    if (!img) return false;
    const s = Math.min(w / img.width, h / img.height);
    return image(
      c,
      img,
      x + (w - img.width * s) / 2,
      y + h - img.height * s,
      img.width * s,
      img.height * s,
    );
  }
  function tuyau(c, pts, col = C.cuivre) {
    ligne(c, pts, C.trait, 3.3);
    ligne(c, pts, col, 1.9);
  }
  function vanne(c, x, y, ouverture, col = C.cuivre) {
    ellipse(c, x, y, 3.5, 3.5, col, C.trait);
    const a = ouverture * Math.PI * 0.7;
    ligne(
      c,
      [
        [x - Math.cos(a) * 2.8, y - Math.sin(a) * 2.8],
        [x + Math.cos(a) * 2.8, y + Math.sin(a) * 2.8],
      ],
      C.papier,
      1,
    );
    ellipse(c, x, y, 0.7, 0.7, C.trait);
  }
  function cadran(c, x, y, v, col = C.vert) {
    ellipse(c, x, y, 6, 6, C.papier, C.trait);
    const a = Math.PI * (0.8 + 1.4 * borne(v));
    ligne(
      c,
      [
        [x, y],
        [x + Math.cos(a) * 4.2, y + Math.sin(a) * 4.2],
      ],
      col,
      1.1,
    );
    ellipse(c, x, y, 0.8, 0.8, C.trait);
  }
  function gouttes(c, x, y, t, col = C.papier, force = 1) {
    for (let i = 0; i < 3; i++) {
      const a = (t * 2.2 + i / 3) % 1;
      c.save();
      c.globalAlpha *= Math.sin(a * Math.PI);
      ellipse(c, x, y + a * 9, 0.6 * force, 1.2 * force, col);
      c.restore();
    }
  }
  // Six images en mémoire, ancrage constant ; cadence commune de 120 ms.
  const flammes = [];
  for (let k = 0; k < 6; k++) {
    const cv = document.createElement("canvas");
    cv.width = 60;
    cv.height = 60;
    const c = cv.getContext("2d");
    for (let i = 0; i < 5; i++) {
      const x = 8 + i * 10,
        h = 20 + Math.sin((k * Math.PI) / 3 + i * 1.7) * 7;
      c.beginPath();
      c.moveTo(x - 6, 57);
      c.quadraticCurveTo(x - 10, 40, x, 57 - h - 7);
      c.quadraticCurveTo(x + 11, 44, x + 7, 57);
      c.fillStyle = "#dc6b32";
      c.fill();
      ellipse(c, x + 1, 50, 3, 7, "#ffd875");
    }
    flammes.push(cv);
  }
  function feu(c, x, y, w, h, frame, force = 1) {
    if (force <= 0) return;
    // Les six sprites sont conservés ; fondu entre deux images sans saut.
    const phase = ((frame % 6) + 6) % 6,
      k = Math.floor(phase),
      f = phase - k;
    c.save();
    const alpha = c.globalAlpha;
    c.globalAlpha = alpha * (1 - f);
    image(c, flammes[k], x, y + h - h * force, w, h * force);
    if (f > 0) {
      c.globalAlpha = alpha * f;
      image(c, flammes[(k + 1) % 6], x, y + h - h * force, w, h * force);
    }
    c.restore();
  }
  function vapeur(c, x, y, t, force = 1, noire = false) {
    for (let i = 0; i < 4; i++) {
      const a = (t * 0.5 + i / 4) % 1;
      ellipse(
        c,
        x + i * 4 + Math.sin(a * 5 + i) * 2,
        y - a * 24,
        2 + a * 3,
        1.5 + a * 2,
        `rgba(${noire ? "42,34,29" : "255,248,220"},${Math.sin(a * Math.PI) * force * 0.45})`,
      );
    }
  }
  // Parcours décoratif aller/retour sur une Bézier, avec freinage et pauses.
  // Aucune position de jeu ni sauvegarde n'est écrite par cette animation.
  function trajet(t, points, duree = 14, pause = 3, decalage = 0) {
    const cycle = (t + decalage) % (2 * (duree + pause));
    const retour = cycle >= duree + pause;
    const local = retour ? cycle - duree - pause : cycle;
    const q = borne(local / duree),
      lisse = q * q * (3 - 2 * q);
    const u = retour ? 1 - lisse : lisse,
      v = 1 - u;
    const [a, b, c, d] = points;
    const x =
      v * v * v * a[0] +
      3 * v * v * u * b[0] +
      3 * v * u * u * c[0] +
      u * u * u * d[0];
    const y =
      v * v * v * a[1] +
      3 * v * v * u * b[1] +
      3 * v * u * u * c[1] +
      u * u * u * d[1];
    const dx =
      3 * v * v * (b[0] - a[0]) +
      6 * v * u * (c[0] - b[0]) +
      3 * u * u * (d[0] - c[0]);
    return {
      x,
      y,
      marche: local < duree ? Math.sin(q * Math.PI) : 0,
      direction: (retour ? -1 : 1) * (dx < 0 ? -1 : 1),
      repos: Math.max(0, local - duree),
      distance: (retour ? 2 - u : u) * Math.hypot(d[0] - a[0], d[1] - a[1]),
    };
  }
  function acteur(
    c,
    img,
    x,
    y,
    w,
    h,
    t,
    marche = 0,
    direction = 1,
    phase = 0,
    detail = null,
  ) {
    if (!img) return;
    const pas = t * 8 + phase,
      leve = Math.sin(pas) ** 2 * 0.32 * marche;
    ellipse(c, x, y, w * 0.32, h * 0.045, "rgba(45,35,19,.19)");
    c.save();
    c.translate(x, y - leve);
    c.rotate(Math.sin(pas) * 0.012 * marche);
    const respiration = Math.sin(t * 1.7 + phase);
    c.scale(direction, 1 - respiration * 0.004);
    const profil = detail?.profil;
    const atlas =
      detail?.atlas?.width === 384 && detail?.atlas?.height === 256
        ? detail.atlas
        : null;
    let poids = 0,
      pose = 0;
    if (atlas && profil) {
      if (profil.type === "marche") {
        poids = borne(marche * 5);
        pose = Math.floor(
          (((detail.distance ?? t) * 6) /
            (profil.cle === "pas-cheval" ? 4.5 : 2.2)) %
            6,
        );
      } else if (marche < 0.05) {
        poids = 1;
        pose = Math.min(5, Math.floor((detail.repos || 0) / 0.24));
        if ((detail.repos || 0) > 1.44) pose = 0;
      }
    }
    if (poids < 1) {
      c.save();
      c.globalAlpha *= 1 - poids;
      // L'animal source regarde à gauche, les mentors vers la droite.
      if (profil?.orientation === -1) c.scale(-1, 1);
      contenir(c, img, -w / 2, -h, w, h);
      c.restore();
    }
    if (poids > 0) {
      c.save();
      c.globalAlpha *= poids;
      c.scale(profil.orientation, 1);
      const taille = Math.min(h, (w * img.height) / img.width) * profil.echelle;
      c.drawImage(
        atlas,
        (pose % 3) * 128,
        Math.floor(pose / 3) * 128,
        128,
        128,
        -taille / 2,
        -taille * profil.ancre,
        taille,
        taille,
      );
      c.restore();
    }
    c.restore();
  }
  function fut(c, x, y, w = 12, h = 15) {
    ellipse(
      c,
      x + w * 0.5,
      y + h * 0.97,
      w * 0.52,
      h * 0.1,
      "rgba(43,31,18,.18)",
    );
    c.beginPath();
    c.moveTo(x + w * 0.15, y);
    c.bezierCurveTo(
      x - w * 0.13,
      y + h * 0.2,
      x - w * 0.13,
      y + h * 0.8,
      x + w * 0.15,
      y + h,
    );
    c.lineTo(x + w * 0.85, y + h);
    c.bezierCurveTo(
      x + w * 1.13,
      y + h * 0.8,
      x + w * 1.13,
      y + h * 0.2,
      x + w * 0.85,
      y,
    );
    c.closePath();
    c.fillStyle = "#b68147";
    c.fill();
    c.strokeStyle = C.trait;
    c.lineWidth = 0.7;
    c.stroke();
    for (let i = 1; i < 5; i++)
      ligne(
        c,
        [
          [x + w * (0.08 + i * 0.17), y + 1],
          [x + w * (0.03 + i * 0.19), y + h * 0.5],
          [x + w * (0.08 + i * 0.17), y + h - 1],
        ],
        "#825b35",
        0.4,
      );
    for (const f of [0.2, 0.8])
      boite(c, x, y + h * f, w, h * 0.11, 1, "#4e4a38");
    ellipse(c, x + w * 0.5, y, w * 0.36, h * 0.1, "#d2a064", C.trait, 0.5);
  }
  function verre(c, x, y, w, h, niveau, col, type = "biere", t = 0) {
    const forme = new Path2D(),
      cx = x + w / 2,
      haut = y + h * 0.07,
      bas = y + h * (type === "biere" ? 0.88 : 0.64);
    if (type === "biere") {
      forme.moveTo(x + w * 0.1, haut);
      forme.bezierCurveTo(
        x + w * 0.02,
        y + h * 0.35,
        x + w * 0.2,
        bas,
        x + w * 0.32,
        bas,
      );
      forme.lineTo(x + w * 0.68, bas);
      forme.bezierCurveTo(
        x + w * 0.8,
        bas,
        x + w * 0.98,
        y + h * 0.35,
        x + w * 0.9,
        haut,
      );
      forme.closePath();
    } else {
      forme.moveTo(x + w * 0.3, haut);
      forme.bezierCurveTo(
        x + w * 0.08,
        y + h * 0.26,
        x + w * 0.1,
        y + h * 0.48,
        cx,
        bas,
      );
      forme.bezierCurveTo(
        x + w * 0.9,
        y + h * 0.48,
        x + w * 0.92,
        y + h * 0.26,
        x + w * 0.7,
        haut,
      );
      forme.closePath();
    }
    c.save();
    c.fillStyle = "rgba(224,235,227,.14)";
    c.fill(forme);
    c.save();
    c.clip(forme);
    const n = borne(niveau),
      lh = (bas - haut) * n;
    c.fillStyle = col;
    c.globalAlpha = type === "biere" ? 0.88 : 0.67;
    c.fillRect(x, bas - lh, w, lh);
    c.globalAlpha = 1;
    const g = c.createLinearGradient(x, 0, x + w, 0);
    g.addColorStop(0, "rgba(255,255,235,.36)");
    g.addColorStop(0.35, "rgba(255,255,255,.02)");
    g.addColorStop(0.8, "rgba(85,47,14,.16)");
    g.addColorStop(1, "rgba(255,255,255,.24)");
    c.fillStyle = g;
    c.fillRect(x, haut, w, bas - haut);
    if (type === "biere" && n > 0.1) {
      ellipse(c, cx, bas - lh, w * 0.39, h * 0.025, "#fff2cf");
      if (!media.matches)
        for (let i = 0; i < 6; i++)
          ellipse(
            c,
            x + w * (0.25 + ((i * 0.13) % 0.5)),
            bas - ((t * 7 + i * 11) % Math.max(1, lh)),
            w * 0.012,
            h * 0.007,
            "rgba(255,251,218,.85)",
          );
    }
    ligne(
      c,
      [
        [x + w * 0.26, haut + 3],
        [x + w * 0.23, haut + h * 0.2],
        [x + w * 0.34, bas - h * 0.1],
      ],
      "rgba(255,255,241,.7)",
      Math.max(0.5, w * 0.025),
    );
    c.restore();
    c.strokeStyle = "#d0d7cd";
    c.lineWidth = Math.max(0.65, w * 0.02);
    c.stroke(forme);
    ellipse(
      c,
      cx,
      haut,
      w * (type === "biere" ? 0.4 : 0.2),
      h * 0.025,
      "rgba(240,249,240,.06)",
      "#c1ccc2",
      0.6,
    );
    if (type !== "biere") {
      ligne(
        c,
        [
          [cx, bas],
          [cx, y + h * 0.91],
        ],
        "#c4d0c8",
        w * 0.035,
      );
      ellipse(
        c,
        cx,
        y + h * 0.93,
        w * 0.3,
        h * 0.026,
        "rgba(220,236,223,.35)",
        "#c4d0c8",
      );
    } else
      ellipse(
        c,
        cx,
        bas,
        w * 0.19,
        h * 0.025,
        "rgba(230,244,230,.25)",
        "#c4d0c8",
      );
    c.restore();
  }

  function visible(canvas) {
    if (document.hidden || canvas.closest("[hidden]")) return false;
    const r = canvas.getBoundingClientRect();
    return r.width > 0 && r.bottom > 0 && r.top < innerHeight;
  }
  function inscrire(nom, cfg) {
    registres.set(nom, Object.freeze(cfg));
  }
  function charger(nom, vue, canvas) {
    if (!ressources.has(nom)) {
      const cfg = registres.get(nom),
        r = { images: null };
      r.promesse = Promise.all(
        (cfg.images || []).map(async (cle) => [cle, await I.charger(cle)]),
      ).then((paires) => {
        const images = Object.fromEntries(paires);
        r.images = (cfg.requises || []).every((cle) => images[cle])
          ? images
          : null;
        return r.images;
      });
      ressources.set(nom, r);
    }
    const r = ressources.get(nom);
    if (!vue.attendu) vue.attendu = new Set();
    if (!vue.attendu.has(nom)) {
      vue.attendu.add(nom);
      r.promesse.then(() => {
        if (visible(canvas)) vue.redessiner?.();
      });
    }
    return r.images;
  }
  function rendre(nom, ctx, etat, redessiner) {
    if(nom==='repasse' && ctx)window.GraphiquesJeu?.repasse(ctx.canvas,etat);
    const cfg = registres.get(nom);
    if (!cfg || !ctx || !I) return false;
    const canvas = ctx.canvas;
    let vue = vues.get(canvas);
    if (!vue) {
      vue = {};
      vues.set(canvas, vue);
    }
    if (vue.erreur) return false;
    // La dégustation réutilise le même Canvas pour plusieurs verreries.
    if (vue.nom !== nom) {
      vue.nom = nom;
      vue.fond = null;
      vue.peint = false;
    }
    vue.redessiner = redessiner;
    const images = charger(nom, vue, canvas);
    if (!images) return false;
    if (!visible(canvas)) {
      vue.dernierTemps = null;
      return true;
    }
    try {
      const rect = canvas.getBoundingClientRect(),
        dpr = Math.min(devicePixelRatio || 1, 2.5),
        w = Math.max(1, Math.round(rect.width * dpr)),
        h = Math.max(1, Math.round((w * cfg.h) / cfg.w));
      let temps = media.matches ? 0 : etat.t || 0;
      if (cfg.ambiance) {
        if (!media.matches) {
          const maintenant = performance.now();
          vue.temps =
            (vue.temps || 0) +
            (vue.dernierTemps == null
              ? 0
              : Math.min(0.05, (maintenant - vue.dernierTemps) / 1000));
          vue.dernierTemps = maintenant;
        } else vue.dernierTemps = null;
        // Le mouvement réduit fige la promenade à sa position actuelle.
        temps = vue.temps || 0;
      }
      const key = cfg.cle ? cfg.cle(etat) : "";
      const phase = ((temps * 1000) / 120) % 6,
        frame = Math.floor(phase);
      const tick = cfg.continu ? Math.floor(temps * 60) : frame;
      let change = false;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        vue.fond = null;
        change = true;
      }
      if (vue.cle !== key) {
        vue.fond = null;
        vue.cle = key;
        change = true;
      }
      canvas.classList.add("canvas-illustre");
      canvas.dataset.univers = nom;
      if (
        (cfg.continu || cfg.discret) &&
        vue.tick === tick &&
        !change &&
        vue.peint
      )
        return true;
      if (!vue.fond) {
        const fond = document.createElement("canvas");
        fond.width = w;
        fond.height = h;
        const c = fond.getContext("2d");
        c.setTransform(w / cfg.w, 0, 0, h / cfg.h, 0, 0);
        c.imageSmoothingEnabled = true;
        c.imageSmoothingQuality = "high";
        cfg.fond?.(c, images, etat);
        vue.fond = fond;
      }
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(vue.fond, 0, 0);
      ctx.setTransform(w / cfg.w, 0, 0, h / cfg.h, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      cfg.dessin(ctx, images, etat, {
        t: temps,
        frame,
        phase,
        reduit: media.matches,
      });
      vue.frame = frame;
      vue.tick = tick;
      vue.peint = true;
      return true;
    } catch (e) {
      vue.erreur = true;
      vue.fond = null;
      canvas.width = cfg.w;
      canvas.height = cfg.h;
      canvas.classList.remove("canvas-illustre");
      canvas.dataset.illustrationErreur = "univers";
      return false;
    }
  }
  const repeindre = () =>
    document.querySelectorAll("canvas[data-univers]").forEach((cv) => {
      if (visible(cv)) vues.get(cv)?.redessiner?.();
    });
  addEventListener(
    "resize",
    () => {
      document.querySelectorAll("canvas[data-univers]").forEach((cv) => {
        const v = vues.get(cv);
        if (v) v.peint = false;
      });
      repeindre();
    },
    { passive: true },
  );
  document.addEventListener("visibilitychange", () => {
    document.querySelectorAll("canvas[data-univers]").forEach((cv) => {
      const v = vues.get(cv);
      if (v) v.dernierTemps = null;
    });
    repeindre();
  });
  document.addEventListener("scroll", repeindre, {
    capture: true,
    passive: true,
  });
  media.addEventListener?.("change", () => {
    document.querySelectorAll("canvas[data-univers]").forEach((cv) => {
      const v = vues.get(cv);
      if (v) v.peint = false;
    });
    repeindre();
  });
  window.UniversJeu = {
    inscrire,
    rendre,
    visible,
    media,
    ressources,
    mouvements,
    art: Object.freeze({
      C,
      borne,
      hasard,
      ellipse,
      ligne,
      boite,
      polygone,
      texte,
      image,
      contenir,
      tuyau,
      vanne,
      cadran,
      gouttes,
      feu,
      vapeur,
      trajet,
      acteur,
      fut,
      verre,
    }),
  };
})();
