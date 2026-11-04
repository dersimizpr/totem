/* =========================================================
   TOTEM — Küçük sürprizler
   site.js'ten sonra yüklenir; sitenin geri kalanına dokunmaz.
   1) Hero'daki ajandalar imleci/parmağı takip ederek hafifçe eğilir.
   2) Hero ajandalarına dokun: takvim yaprakları dökülür. Hızlı dokunuşlar seri yapar,
      12 dokunuşta "12 ay tamam!" büyük yaprak yağmuru.
   3) Nadir an: Ana sayfayı açanların ~25'te 1'i Altın TOTEM'i görür. (?altin=1 ile zorla)
   4) Gizli mürekkep: Konami kodu (↑↑↓↓←→←→BA) ya da üstteki duyuru şeridine
      art arda 5 dokunuş.
   ========================================================= */
(function () {
  "use strict";

  var AZ_HAREKET = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var RENKLER = ["#2E2B28", "#D8C6A9", "#9EAA90", "#6B2D33", "#A9845F", "#FBF7F0"];
  var ALTINLAR = ["#E8C877", "#C9A04E", "#F3DE9A", "#B8893B", "#FFF3CF"];
  var AYLAR = ["OCAK", "ŞUBAT", "MART", "NİSAN", "MAYIS", "HAZİRAN", "TEMMUZ", "AĞUSTOS", "EYLÜL", "EKİM", "KASIM", "ARALIK"];

  /* ---------------- Ses (WebAudio, dosyasız) ---------------- */
  var ses = null;
  function sesAl() {
    if (ses) return ses;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    try { ses = new AC(); } catch (e) { ses = null; }
    return ses;
  }
  // Kâğıt hışırtısı: filtrelenmiş kısa gürültü
  function sayfaSesi(siddet) {
    var c = sesAl(); if (!c) return;
    if (c.state === "suspended") c.resume();
    var sure = 0.18, n = Math.floor(c.sampleRate * sure);
    var buf = c.createBuffer(1, n, c.sampleRate), d = buf.getChannelData(0);
    for (var i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 2);
    var kaynak = c.createBufferSource(); kaynak.buffer = buf;
    var filtre = c.createBiquadFilter(); filtre.type = "bandpass";
    filtre.frequency.value = 2200 + Math.random() * 1600; filtre.Q.value = 0.8;
    var g = c.createGain(); g.gain.value = 0.12 * (siddet || 1);
    kaynak.connect(filtre); filtre.connect(g); g.connect(c.destination);
    kaynak.start();
  }
  // Yumuşak çan: birkaç sinüs notası
  function canSesi(notalar) {
    var c = sesAl(); if (!c) return;
    if (c.state === "suspended") c.resume();
    var t0 = c.currentTime;
    (notalar || [659.25, 783.99, 987.77, 1318.5]).forEach(function (f, i) {
      var o = c.createOscillator(), g = c.createGain();
      o.type = "sine"; o.frequency.value = f;
      var t = t0 + i * 0.11;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.09, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 1.1);
      o.connect(g); g.connect(c.destination);
      o.start(t); o.stop(t + 1.2);
    });
  }

  /* ---------------- Parçacık katmanı ---------------- */
  var tuval = null, ctx = null, parcalar = [], calisiyor = false, dpr = 1;
  function tuvalKur() {
    if (tuval) return;
    tuval = document.createElement("canvas");
    tuval.className = "surpriz-tuval";
    tuval.setAttribute("aria-hidden", "true");
    document.body.appendChild(tuval);
    ctx = tuval.getContext("2d");
    boyutla();
    window.addEventListener("resize", boyutla);
  }
  function boyutla() {
    if (!tuval) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    tuval.width = innerWidth * dpr; tuval.height = innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function ekle(p) { parcalar.push(p); if (!calisiyor) { calisiyor = true; requestAnimationFrame(kare); } }

  // Takvim yaprağı: üstünde gün numarası olan küçük kâğıt
  function yaprak(x, y, ay) {
    var w = 26 + Math.random() * 16;
    return {
      tur: "yaprak", x: x, y: y, w: w, h: w * 1.2,
      vx: (Math.random() - 0.5) * 6, vy: -4 - Math.random() * 6,
      a: Math.random() * 6.28, va: (Math.random() - 0.5) * 0.2,
      salin: Math.random() * 6.28, renk: RENKLER[(Math.random() * RENKLER.length) | 0],
      gun: 1 + ((Math.random() * 31) | 0), ay: ay, omur: 0
    };
  }
  function konfeti(x, y, altin) {
    var palet = altin ? ALTINLAR : RENKLER.concat(ALTINLAR);
    var aci = Math.random() * 6.28, hiz = 4 + Math.random() * 9;
    return {
      tur: Math.random() < 0.3 ? "yildiz" : "serit", x: x, y: y,
      vx: Math.cos(aci) * hiz, vy: Math.sin(aci) * hiz - 5,
      a: Math.random() * 6.28, va: (Math.random() - 0.5) * 0.4,
      s: 4 + Math.random() * 6, renk: palet[(Math.random() * palet.length) | 0], omur: 0
    };
  }

  function kare() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (var i = parcalar.length - 1; i >= 0; i--) {
      var p = parcalar[i];
      p.omur++;
      if (p.tur === "yaprak") {
        p.vy = Math.min(p.vy + 0.18, 2.2);
        p.vx *= 0.97;
        p.salin += 0.05;
        p.x += p.vx + Math.sin(p.salin) * 1.2;
        p.y += p.vy;
        p.a += p.va;
      } else {
        p.vy += 0.22; p.vx *= 0.985; p.vy *= 0.985;
        p.x += p.vx; p.y += p.vy; p.a += p.va;
      }
      if (p.y > innerHeight + 60 || p.omur > 900) { parcalar.splice(i, 1); continue; }
      ciz(p);
    }
    if (parcalar.length) requestAnimationFrame(kare);
    else { calisiyor = false; ctx.clearRect(0, 0, innerWidth, innerHeight); }
  }

  function ciz(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.a);
    if (p.tur === "yaprak") {
      // 3B dönüş hissi: yatay ölçek sinüsle daralıp genişler
      ctx.scale(Math.max(0.15, Math.abs(Math.cos(p.salin * 0.8))), 1);
      ctx.fillStyle = "#FBF7F0";
      ctx.shadowColor = "rgba(58,42,26,.18)"; ctx.shadowBlur = 6; ctx.shadowOffsetY = 2;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.shadowColor = "transparent";
      ctx.fillStyle = p.renk;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * 0.24);
      ctx.fillStyle = "#2B2622";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.font = "500 " + Math.round(p.w * 0.52) + "px 'Cormorant Garamond', Georgia, serif";
      ctx.fillText(String(p.gun), 0, p.h * 0.12);
      if (p.ay) {
        ctx.font = "500 " + Math.max(5, Math.round(p.w * 0.16)) + "px Jost, sans-serif";
        ctx.fillStyle = p.renk === "#FBF7F0" ? "#A9845F" : "#FBF7F0";
        ctx.fillText(p.ay, 0, -p.h * 0.38);
      }
    } else if (p.tur === "yildiz") {
      ctx.fillStyle = p.renk;
      ctx.beginPath();
      for (var k = 0; k < 8; k++) {
        var r = k % 2 ? p.s * 0.4 : p.s;
        ctx.lineTo(Math.cos(k * Math.PI / 4) * r, Math.sin(k * Math.PI / 4) * r);
      }
      ctx.closePath(); ctx.fill();
    } else {
      ctx.fillStyle = p.renk;
      ctx.fillRect(-p.s / 2, -p.s / 5, p.s, p.s / 2.5);
    }
    ctx.restore();
  }

  function patlat(x, y, adet, altin) {
    if (AZ_HAREKET) adet = Math.min(adet, 12);
    tuvalKur();
    for (var i = 0; i < adet; i++) ekle(konfeti(x, y, altin));
  }
  function yapraklar(x, y, adet, ayli) {
    if (AZ_HAREKET) adet = Math.min(adet, 6);
    tuvalKur();
    for (var i = 0; i < adet; i++) {
      ekle(yaprak(x + (Math.random() - 0.5) * 60, y + (Math.random() - 0.5) * 40, ayli ? AYLAR[i % 12] : null));
    }
  }
  function yaprakYagmuru(adet) {
    if (AZ_HAREKET) adet = Math.min(adet, 12);
    tuvalKur();
    for (var i = 0; i < adet; i++) {
      var p = yaprak(Math.random() * innerWidth, -40 - Math.random() * innerHeight * 0.8, AYLAR[i % 12]);
      p.vy = 0.5 + Math.random(); p.vx = (Math.random() - 0.5) * 2;
      ekle(p);
    }
  }

  /* ---------------- Bildirim ---------------- */
  var bildirimZaman = null;
  function bildir(baslik, metin, altin) {
    var el = document.querySelector(".surpriz-bildirim");
    if (!el) {
      el = document.createElement("div");
      el.className = "surpriz-bildirim";
      el.setAttribute("role", "status");
      el.setAttribute("aria-live", "polite");
      document.body.appendChild(el);
    }
    el.classList.toggle("altin", !!altin);
    el.innerHTML = "<strong></strong><span></span>";
    el.firstChild.textContent = baslik;
    el.lastChild.textContent = metin;
    // yeniden tetiklemek için sınıfı kaldır-ekle
    el.classList.remove("acik");
    void el.offsetWidth;
    el.classList.add("acik");
    clearTimeout(bildirimZaman);
    bildirimZaman = setTimeout(function () { el.classList.remove("acik"); }, 4200);
  }

  function sars() {
    if (AZ_HAREKET) return;
    var m = document.querySelector("main");
    if (!m) return;
    m.classList.remove("surpriz-sars");
    void m.offsetWidth;
    m.classList.add("surpriz-sars");
  }

  /* ---------------- 1 + 2: Hero eğilme ve yaprak serisi ---------------- */
  var hero = document.querySelector(".hero");
  var heroGorsel = document.getElementById("hero-gorsel");
  if (hero && heroGorsel) {
    heroGorsel.classList.add("surpriz-hero");
    heroGorsel.setAttribute("title", "Bana dokun");

    if (!AZ_HAREKET) {
      var hedefX = 0, hedefY = 0, suanX = 0, suanY = 0, egimAktif = false;
      var egimKare = function () {
        suanX += (hedefX - suanX) * 0.08;
        suanY += (hedefY - suanY) * 0.08;
        var svgEl = heroGorsel.querySelector("svg");
        if (svgEl) svgEl.style.transform = "perspective(900px) rotateY(" + (suanX * 10).toFixed(2) + "deg) rotateX(" + (-suanY * 8).toFixed(2) + "deg)";
        if (Math.abs(hedefX - suanX) > 0.001 || Math.abs(hedefY - suanY) > 0.001) requestAnimationFrame(egimKare);
        else egimAktif = false;
      };
      var egimBaslat = function () { if (!egimAktif) { egimAktif = true; requestAnimationFrame(egimKare); } };
      hero.addEventListener("pointermove", function (e) {
        var r = heroGorsel.getBoundingClientRect();
        hedefX = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (r.width / 1.2)));
        hedefY = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (r.height / 1.2)));
        egimBaslat();
      });
      hero.addEventListener("pointerleave", function () { hedefX = 0; hedefY = 0; egimBaslat(); });
    }

    var seri = 0, seriZaman = null, sonDokunus = 0;
    heroGorsel.addEventListener("click", function (e) {
      var simdi = Date.now();
      seri = simdi - sonDokunus < 900 ? seri + 1 : 1;
      sonDokunus = simdi;
      clearTimeout(seriZaman);
      seriZaman = setTimeout(function () { seri = 0; }, 900);

      yapraklar(e.clientX, e.clientY, 5 + Math.min(seri, 10) * 2, false);
      sayfaSesi(1 + Math.min(seri, 6) * 0.12);

      if (seri === 3) bildir("Seri ×3", "Sayfalar hızlanıyor. Devam et...");
      else if (seri === 6) bildir("Seri ×6", "Yarım yıl geride kaldı!");
      else if (seri === 12) {
        bildir("12 ay tamam!", "Bütün yıl senin. Önemli olanı işaretlemeyi unutma.");
        yaprakYagmuru(innerWidth < 600 ? 50 : 90);
        patlat(e.clientX, e.clientY, 60, false);
        canSesi();
        sars();
        rozet("seri");
        seri = 0;
      }
    });
  }

  /* ---------------- 3: Nadir an — Altın TOTEM ---------------- */
  function altinYap() {
    if (!heroGorsel) return false;
    var svgEl = heroGorsel.querySelector("svg");
    var gruplar = svgEl ? svgEl.querySelectorAll(":scope > g") : [];
    var on = gruplar[1]; // öndeki (ikinci) ajanda
    if (!on) return false;
    var NS = "http://www.w3.org/2000/svg";
    var kap = document.createElementNS(NS, "g");
    kap.setAttribute("class", "altin-kapak");
    kap.innerHTML =
      '<defs><linearGradient id="altin-g" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="#F3DE9A"/><stop offset=".45" stop-color="#C9A04E"/>' +
      '<stop offset=".7" stop-color="#E8C877"/><stop offset="1" stop-color="#9C7330"/></linearGradient>' +
      '<linearGradient id="altin-parilti" x1="0" y1="0" x2="1" y2="0">' +
      '<stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".75"/>' +
      '<stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>' +
      '<clipPath id="altin-kirp"><rect x="105" y="85" width="190" height="290" rx="5"/></clipPath></defs>' +
      '<rect x="105" y="85" width="190" height="290" rx="5" fill="url(#altin-g)"/>' +
      '<rect x="105" y="85" width="17" height="290" rx="5" fill="#8A6428" opacity=".45"/>' +
      '<rect x="262" y="85" width="9" height="290" fill="#7A5622"/>' +
      '<g font-family="Cormorant Garamond, Georgia, serif" text-anchor="middle" fill="#6E4E1C">' +
      '<text x="195.5" y="213" font-size="25" letter-spacing="7" fill="#FFF3CF" opacity=".5">TOTEM</text>' +
      '<text x="195" y="212" font-size="25" letter-spacing="7">TOTEM</text>' +
      '<line x1="180" y1="227" x2="208" y2="227" stroke="#6E4E1C" stroke-width=".7"/>' +
      '<text x="195" y="248" font-size="12" letter-spacing="4">2027</text></g>' +
      '<g clip-path="url(#altin-kirp)"><rect class="altin-isik" x="-60" y="60" width="70" height="360" fill="url(#altin-parilti)" transform="rotate(18 200 230)">' +
      (AZ_HAREKET ? "" : '<animate attributeName="x" values="-60;330;330" keyTimes="0;.45;1" dur="3.2s" repeatCount="indefinite"/>') +
      "</rect></g>";
    on.appendChild(kap);
    heroGorsel.classList.add("altin");
    return true;
  }
  var zorla = /[?&]altin=1\b/.test(location.search);
  if (document.body.getAttribute("data-sayfa") === "ana" && (zorla || Math.random() < 1 / 25)) {
    if (altinYap()) {
      setTimeout(function () {
        var r = heroGorsel.getBoundingClientRect();
        patlat(r.left + r.width * 0.6, r.top + r.height * 0.4, 50, true);
        bildir("Nadir an: Altın TOTEM", "Bu kapak her 25 ziyaretten yalnızca birinde görünür. Bugün şanslı günündesin.", true);
        rozet("altin");
      }, 900);
    }
  }

  /* ---------------- 4: Gizli mürekkep (Konami / duyuru şeridi) ---------------- */
  var murekkepAcik = false;
  function murekkep() {
    if (murekkepAcik) return;
    murekkepAcik = true;
    var ort = document.createElement("div");
    ort.className = "surpriz-murekkep";
    ort.setAttribute("role", "dialog");
    ort.setAttribute("aria-label", "Gizli sayfa");
    ort.innerHTML =
      '<div class="murekkep-kagit">' +
      '<span class="ust-baslik">Gizli sayfa · 2027</span>' +
      '<svg viewBox="0 0 600 160" aria-hidden="true"><text x="300" y="70" text-anchor="middle">Önemli olanı</text>' +
      '<text x="300" y="140" text-anchor="middle">işaretle.</text></svg>' +
      "<p>Bu sayfayı bulan çok az kişi var. Yılın, senin ritminde.</p>" +
      '<button class="dugme dugme--cizgi" type="button">Kapat</button></div>';
    document.body.appendChild(ort);
    requestAnimationFrame(function () { ort.classList.add("acik"); });
    var kapat = function () {
      ort.classList.remove("acik");
      setTimeout(function () { if (ort.parentNode) ort.parentNode.removeChild(ort); murekkepAcik = false; }, 500);
      document.removeEventListener("keydown", escKapat);
    };
    var escKapat = function (e) { if (e.key === "Escape") kapat(); };
    document.addEventListener("keydown", escKapat);
    ort.addEventListener("click", function (e) { if (e.target === ort || e.target.tagName === "BUTTON") kapat(); });
    ort.querySelector("button").focus({ preventScroll: true });
    setTimeout(function () {
      patlat(innerWidth / 2, innerHeight / 2, innerWidth < 600 ? 70 : 120, true);
      canSesi([523.25, 659.25, 783.99, 1046.5]);
    }, AZ_HAREKET ? 0 : 1700);
    rozet("murekkep");
  }

  var KONAMI = ["arrowup", "arrowup", "arrowdown", "arrowdown", "arrowleft", "arrowright", "arrowleft", "arrowright", "b", "a"];
  var konamiI = 0;
  document.addEventListener("keydown", function (e) {
    var t = (e.key || "").toLowerCase();
    konamiI = t === KONAMI[konamiI] ? konamiI + 1 : (t === KONAMI[0] ? 1 : 0);
    if (konamiI === KONAMI.length) { konamiI = 0; murekkep(); }
  });

  var duyuru = document.querySelector(".duyuru");
  if (duyuru) {
    var dSay = 0, dZaman = null;
    duyuru.addEventListener("click", function () {
      dSay++;
      clearTimeout(dZaman);
      dZaman = setTimeout(function () { dSay = 0; }, 1200);
      if (dSay >= 5) { dSay = 0; murekkep(); }
    });
  }

  /* ---------------- Rozetler (bulunan sürprizler) ---------------- */
  var ROZETLER = { seri: "12 Ay Serisi", altin: "Altın TOTEM", murekkep: "Gizli Sayfa" };
  function rozet(ad) {
    var bulunan = {};
    try { bulunan = JSON.parse(localStorage.getItem("totem-rozet") || "{}") || {}; } catch (e) { bulunan = {}; }
    if (bulunan[ad]) return;
    bulunan[ad] = 1;
    try { localStorage.setItem("totem-rozet", JSON.stringify(bulunan)); } catch (e) { /* gizli pencere */ }
    var adet = Object.keys(ROZETLER).filter(function (k) { return bulunan[k]; }).length;
    setTimeout(function () {
      bildir("Rozet: " + ROZETLER[ad], adet + " / 3 sürpriz bulundu" + (adet === 3 ? ". Hepsini buldun, tebrikler!" : "."), ad === "altin");
    }, 4600);
  }
})();
