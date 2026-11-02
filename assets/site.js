/* =========================================================
   TOTEM — Ortak site kodu
   Bilgileri değiştirmek için bu dosyaya değil, ayarlar.js'e bakın.
   ========================================================= */
(function () {
  "use strict";

  var A = window.TOTEM_AYARLAR;
  var SAYFA = document.body.getAttribute("data-sayfa");
  var KIL = "#A9845F";
  var KAGIT = "#FBF7F0";
  var METAL = "#C9B699";
  var uid = 0;

  /* ---------------- Yardımcılar ---------------- */
  function $(s, k) { return (k || document).querySelector(s); }
  function $$(s, k) { return Array.prototype.slice.call((k || document).querySelectorAll(s)); }
  function esc(t) {
    return String(t).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function param(ad) {
    var m = new RegExp("[?&]" + ad + "=([^&#]*)").exec(location.search);
    return m ? decodeURIComponent(m[1].replace(/\+/g, " ")) : null;
  }
  function urunBul(id) {
    for (var i = 0; i < A.urunler.length; i++) if (A.urunler[i].id === id) return A.urunler[i];
    return null;
  }

  function waLink(mesaj) {
    return "https://wa.me/" + A.whatsapp + "?text=" + encodeURIComponent(mesaj || "Merhaba, TOTEM ürünleri hakkında bilgi almak istiyorum.");
  }
  function urunMesaj(u, renk, secenek) {
    var ek = [];
    if (renk) ek.push(renk);
    if (secenek) ek.push(secenek);
    return "Merhaba, " + u.ad + (ek.length ? " (" + ek.join(", ") + ")" : "") + " hakkında bilgi almak ve sipariş vermek istiyorum.";
  }

  // Rengi siyaha (eksi) ya da beyaza (artı) doğru karıştırır
  function ton(hex, m) {
    var n = parseInt(hex.slice(1), 16);
    var r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    var h = m < 0 ? 0 : 255, k = Math.abs(m);
    r = Math.round(r + (h - r) * k); g = Math.round(g + (h - g) * k); b = Math.round(b + (h - b) * k);
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }
  function koyuMu(hex) {
    var n = parseInt(hex.slice(1), 16);
    return (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255 < 0.5;
  }
  // Kabartma yazı tonu: koyu zeminde açık, açık zeminde koyu
  function kabartma(hex, m) { return koyuMu(hex) ? ton(hex, m || 0.3) : ton(hex, -(m || 0.28)); }

  function keten(hex) {
    var id = "k" + (++uid);
    var c = koyuMu(hex) ? "#ffffff" : "#000000";
    return {
      id: id,
      def: '<pattern id="' + id + '" width="3" height="3" patternUnits="userSpaceOnUse">' +
        '<path d="M0 .5H3M.5 0V3" stroke="' + c + '" stroke-width=".45" opacity=".09"/></pattern>'
    };
  }

  function svg(ic, opt) {
    opt = opt || {};
    return '<svg viewBox="' + (opt.vb || "0 0 400 500") + '" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" role="img" aria-label="' + esc(opt.etiket || "") + '">' +
      (opt.zemin === null ? "" : '<rect x="-50" y="-50" width="600" height="700" fill="' + (opt.zemin || "#ECE4D8") + '"/>') +
      ic + "</svg>";
  }
  function golge(cx, cy, rx) {
    return '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="10" fill="#3a2a1a" opacity=".12"/>';
  }

  /* ---------------- Ürün çizimleri (400 × 500 alan) ---------------- */
  var CIZ = {};

  CIZ.ajanda = function (hex) {
    var k = keten(hex), y = kabartma(hex);
    var s = '<g><defs>' + k.def + "</defs>" + golge(205, 392, 120) +
      '<rect x="109" y="90" width="192" height="290" rx="5" fill="#3a2a1a" opacity=".10"/>' +
      '<rect x="105" y="85" width="196" height="291" rx="5" fill="#EFE6D6"/>';
    for (var i = 0; i < 4; i++) s += '<line x1="' + (296.5 + i) + '" y1="91" x2="' + (296.5 + i) + '" y2="370" stroke="#D8CBB5" stroke-width=".5"/>';
    s += '<rect x="105" y="85" width="190" height="290" rx="5" fill="' + hex + '"/>' +
      '<rect x="105" y="85" width="190" height="290" rx="5" fill="url(#' + k.id + ')"/>' +
      '<rect x="105" y="85" width="17" height="290" rx="5" fill="' + ton(hex, -0.18) + '" opacity=".55"/>' +
      '<line x1="125" y1="86" x2="125" y2="374" stroke="' + ton(hex, -0.25) + '" stroke-width="1" opacity=".5"/>' +
      '<rect x="262" y="85" width="9" height="290" fill="' + ton(hex, -0.42) + '"/>' +
      '<rect x="262" y="85" width="2" height="290" fill="#fff" opacity=".08"/>' +
      '<path d="M196 370H206V420L201 413L196 420Z" fill="' + KIL + '"/>' +
      '<g font-family="Cormorant Garamond, Georgia, serif" text-anchor="middle">' +
      '<text x="195.5" y="213" font-size="25" letter-spacing="7" fill="#fff" opacity=".12">TOTEM</text>' +
      '<text x="195" y="212" font-size="25" letter-spacing="7" fill="' + y + '">TOTEM</text>' +
      '<line x1="180" y1="227" x2="208" y2="227" stroke="' + y + '" stroke-width=".7"/>' +
      '<text x="195" y="248" font-size="12" letter-spacing="4" fill="' + y + '">2027</text></g></g>';
    return s;
  };

  CIZ.defter = function (hex, secenek) {
    var k = keten(hex), y = kabartma(hex);
    var s = '<g><defs>' + k.def + "</defs>" + golge(205, 384, 110) +
      '<rect x="118" y="98" width="176" height="276" rx="3" fill="#3a2a1a" opacity=".09"/>' +
      '<rect x="114" y="94" width="176" height="274" rx="3" fill="#F2EADC"/>' +
      '<rect x="114" y="94" width="172" height="272" rx="3" fill="' + hex + '"/>' +
      '<rect x="114" y="94" width="172" height="272" rx="3" fill="url(#' + k.id + ')"/>';
    for (var i = 0; i < 13; i++) s += '<line x1="124" y1="' + (104 + i * 20.5) + '" x2="124" y2="' + (114 + i * 20.5) + '" stroke="' + y + '" stroke-width="1.4" stroke-linecap="round"/>';
    s += '<rect x="150" y="168" width="106" height="52" fill="none" stroke="' + y + '" stroke-width=".8"/>' +
      '<g font-family="Cormorant Garamond, Georgia, serif" text-anchor="middle" fill="' + y + '">' +
      '<text x="204" y="194" font-size="16" letter-spacing="5">TOTEM</text>' +
      '<text x="203" y="210" font-size="10" font-style="italic" letter-spacing="1">' + esc((secenek || "not defteri").toLowerCase()) + "</text></g></g>";
    return s;
  };

  CIZ.kalem = function (hex) {
    var y = kabartma(hex, 0.35);
    function govde(dx, dy, renk, op) {
      return '<g transform="translate(' + dx + "," + dy + ')" opacity="' + op + '">' +
        '<rect x="62" y="241" width="240" height="18" rx="9" fill="' + renk + '"/>' +
        '<path d="M300 242L340 248Q344 250 340 252L300 258Z" fill="' + (op < 1 ? renk : METAL) + '"/></g>';
    }
    return '<g transform="rotate(-36 200 250)">' +
      govde(8, 14, "#3a2a1a", 0.12) + govde(0, 0, hex, 1) +
      '<rect x="62" y="244" width="232" height="3" rx="1.5" fill="#fff" opacity=".22"/>' +
      '<rect x="168" y="241" width="5" height="18" fill="' + METAL + '"/>' +
      '<rect x="70" y="235" width="74" height="7" rx="3.5" fill="' + METAL + '"/>' +
      '<circle cx="342" cy="250" r="1.6" fill="#2B2622"/>' +
      '<text x="235" y="253" font-family="Cormorant Garamond, Georgia, serif" font-size="8" letter-spacing="3" text-anchor="middle" fill="' + y + '">TOTEM</text></g>';
  };

  CIZ.kilif = function (hex) {
    var k = keten(hex), y = kabartma(hex, 0.22), kapak = ton(hex, -0.07);
    return '<g><defs>' + k.def + "</defs>" + golge(205, 408, 120) +
      '<rect x="260" y="96" width="13" height="70" rx="6.5" fill="#2E2B28"/>' +
      '<rect x="261" y="96" width="11" height="9" rx="4.5" fill="' + METAL + '"/>' +
      '<rect x="99" y="134" width="212" height="270" rx="10" fill="#3a2a1a" opacity=".1"/>' +
      '<rect x="95" y="130" width="210" height="270" rx="10" fill="' + hex + '"/>' +
      '<rect x="95" y="130" width="210" height="270" rx="10" fill="url(#' + k.id + ')"/>' +
      '<rect x="104" y="139" width="192" height="252" rx="6" fill="none" stroke="' + y + '" stroke-dasharray="4 3" stroke-width=".9" opacity=".7"/>' +
      '<path d="M95 142Q95 130 107 130H293Q305 130 305 142V226Q200 268 95 226Z" fill="' + kapak + '"/>' +
      '<path d="M95 142Q95 130 107 130H293Q305 130 305 142V226Q200 268 95 226Z" fill="url(#' + k.id + ')"/>' +
      '<path d="M104 145V221Q200 258 296 221V145" fill="none" stroke="' + y + '" stroke-dasharray="4 3" stroke-width=".9" opacity=".7"/>' +
      '<path d="M95 226Q200 268 305 226" fill="none" stroke="#000" stroke-width="2" opacity=".08"/>' +
      '<circle cx="200" cy="236" r="7" fill="' + METAL + '"/><circle cx="200" cy="236" r="3" fill="#fff" opacity=".35"/>' +
      '<text x="200" y="330" font-family="Cormorant Garamond, Georgia, serif" font-size="15" letter-spacing="6" text-anchor="middle" fill="' + y + '">TOTEM</text></g>';
  };

  CIZ.kalemlik = function (hex) {
    var k = keten(hex), y = kabartma(hex, 0.25);
    var s = '<g><defs>' + k.def + "</defs>" + golge(200, 338, 140) +
      '<path d="M84 200Q70 200 70 226V300Q70 326 96 326H304Q330 326 330 300V226Q330 200 316 200Z" fill="' + hex + '"/>' +
      '<path d="M84 200Q70 200 70 226V300Q70 326 96 326H304Q330 326 330 300V226Q330 200 316 200Z" fill="url(#' + k.id + ')"/>' +
      '<path d="M76 300Q76 320 98 320H302Q324 320 324 300" fill="none" stroke="#000" opacity=".07" stroke-width="6"/>' +
      '<line x1="84" y1="222" x2="316" y2="222" stroke="' + ton(hex, -0.3) + '" stroke-width="5"/>';
    for (var x = 88; x < 314; x += 4) s += '<line x1="' + x + '" y1="220" x2="' + x + '" y2="224" stroke="' + METAL + '" stroke-width="1.6"/>';
    s += '<rect x="284" y="216" width="16" height="12" rx="2" fill="' + METAL + '"/>' +
      '<path d="M290 228L286 262Q286 268 292 268H296Q302 268 300 262L296 228Z" fill="#7A5638"/>' +
      '<circle cx="293" cy="259" r="2" fill="' + KAGIT + '" opacity=".5"/>' +
      '<text x="185" y="282" font-family="Cormorant Garamond, Georgia, serif" font-size="15" letter-spacing="6" text-anchor="middle" fill="' + y + '">TOTEM</text></g>';
    return s;
  };

  CIZ.canta = function (hex) {
    var k = keten(hex), y = kabartma(hex, 0.45), sap = ton(hex, -0.12);
    return '<g><defs>' + k.def + "</defs>" + golge(200, 426, 135) +
      '<path d="M158 172C158 72 254 72 254 172" fill="none" stroke="' + ton(hex, -0.22) + '" stroke-width="10"/>' +
      '<path d="M146 172C146 60 242 60 242 172" fill="none" stroke="' + sap + '" stroke-width="10"/>' +
      '<path d="M92 166H308L320 420H80Z" fill="' + hex + '"/>' +
      '<path d="M92 166H308L320 420H80Z" fill="url(#' + k.id + ')"/>' +
      '<path d="M92 166H308L309 186H91Z" fill="#000" opacity=".06"/>' +
      '<rect x="138" y="162" width="16" height="22" fill="' + sap + '"/><rect x="234" y="162" width="16" height="22" fill="' + sap + '"/>' +
      '<g font-family="Cormorant Garamond, Georgia, serif" text-anchor="middle" fill="' + y + '">' +
      '<text x="204" y="306" font-size="32" letter-spacing="10">TOTEM</text>' +
      '<text x="200" y="330" font-size="11" font-style="italic" letter-spacing="2">yılın, senin ritminde</text></g></g>';
  };

  CIZ.ayrac = function () {
    var renkler = ["#D8C6A9", KIL, "#9EAA90"], acilar = [-7, 0, 7], s = golge(200, 412, 110);
    renkler.forEach(function (r, i) {
      var x = 150 + i * 50;
      s += '<g transform="rotate(' + acilar[i] + " " + x + ' 250)">' +
        '<path d="M' + (x - 13) + " 120H" + (x + 13) + "V390L" + x + " 376L" + (x - 13) + ' 390Z" fill="' + r + '"/>' +
        '<path d="M' + (x - 13) + " 120H" + (x + 13) + "V390L" + x + " 376L" + (x - 13) + ' 390Z" fill="none" stroke="#000" opacity=".08"/>' +
        '<line x1="' + (x - 8) + '" y1="126" x2="' + (x - 8) + '" y2="380" stroke="#fff" opacity=".18" stroke-dasharray="3 3"/>' +
        '<circle cx="' + x + '" cy="112" r="5" fill="none" stroke="' + ton(r, -0.25) + '" stroke-width="1.5"/>' +
        '<path d="M' + x + " 117V128M" + (x - 3) + " 116L" + (x - 7) + " 100M" + (x + 3) + " 116L" + (x + 7) + " 100M" + x + ' 106V90" stroke="' + ton(r, -0.25) + '" stroke-width="1.6" stroke-linecap="round"/></g>';
    });
    return s;
  };

  CIZ.sticker = function () {
    var p = ["#2E2B28", KIL, "#9EAA90", "#6B2D33", "#D8C6A9"], s = golge(205, 402, 120);
    s += '<rect x="132" y="78" width="200" height="300" rx="4" fill="#CDB797" transform="rotate(6 232 228)"/>' +
      '<rect x="104" y="86" width="196" height="300" rx="4" fill="#3a2a1a" opacity=".08"/>' +
      '<rect x="100" y="82" width="196" height="300" rx="4" fill="' + KAGIT + '"/>' +
      '<text x="118" y="110" font-family="Cormorant Garamond, Georgia, serif" font-size="11" letter-spacing="3" fill="#6F655C">TOTEM · STICKER</text>';
    for (var i = 0; i < 6; i++) s += '<circle cx="' + (126 + i * 29) + '" cy="136" r="10" fill="' + p[i % 5] + '"/>';
    ["OCAK", "ŞUB", "MART", "NİS"].forEach(function (t, i) {
      s += '<rect x="' + (116 + i * 43) + '" y="164" width="38" height="18" rx="2" fill="' + p[(i + 1) % 5] + '"/>' +
        '<text x="' + (135 + i * 43) + '" y="176.5" font-family="Jost, sans-serif" font-size="7" letter-spacing="1" text-anchor="middle" fill="' + KAGIT + '">' + t + "</text>";
    });
    for (var j = 0; j < 5; j++) {
      var cx = 128 + j * 35;
      s += '<circle cx="' + cx + '" cy="214" r="12" fill="none" stroke="' + p[j % 4] + '" stroke-width="1.5"/>' +
        '<path d="M' + (cx - 5) + " 214L" + (cx - 1) + " 218L" + (cx + 6) + ' 209" fill="none" stroke="' + p[j % 4] + '" stroke-width="1.6" stroke-linecap="round"/>';
    }
    ["önemli", "hatırla", "doğum günü"].forEach(function (t, i) {
      var w = 42 + t.length * 4;
      s += '<rect x="116" y="' + (244 + i * 30) + '" width="' + w + '" height="20" rx="10" fill="' + ["#E9DFCC", "#DCE1D4", "#EAD7D4"][i] + '"/>' +
        '<text x="' + (116 + w / 2) + '" y="' + (258 + i * 30) + '" font-family="Cormorant Garamond, Georgia, serif" font-style="italic" font-size="12" text-anchor="middle" fill="#2B2622">' + t + "</text>";
    });
    for (var m = 0; m < 3; m++) s += '<path d="M' + (236 + (m % 2) * 26) + " " + (252 + m * 28) + 'l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" fill="' + p[(m + 1) % 5] + '"/>';
    return s;
  };

  /* ---------------- Ajanda iç sayfaları ---------------- */
  function acikKitap(sol, sag) {
    var id = "g" + (++uid);
    return '<defs><linearGradient id="' + id + '" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity="0"/>' +
      '<stop offset=".5" stop-color="#000" stop-opacity=".13"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient></defs>' +
      golge(200, 372, 175) +
      '<rect x="26" y="138" width="348" height="230" rx="4" fill="#2E2B28"/>' +
      '<rect x="32" y="134" width="168" height="230" fill="' + KAGIT + '"/>' +
      '<rect x="200" y="134" width="168" height="230" fill="' + KAGIT + '"/>' +
      sol + sag +
      '<rect x="190" y="134" width="20" height="230" fill="url(#' + id + ')"/>' +
      '<path d="M197 134H203V384L200 379L197 384Z" fill="' + KIL + '"/>';
  }
  function karalama(x, y, w, renk) {
    var d = "M" + x + " " + y, cx = x;
    while (cx < x + w) { var a = 3 + ((cx * 7) % 5); d += "q" + a / 2 + " -2.2 " + a + " 0"; cx += a; }
    return '<path d="' + d + '" fill="none" stroke="' + (renk || "#5A4E44") + '" stroke-width=".7" stroke-linecap="round" opacity=".75"/>';
  }
  var YAZI = 'font-family="Jost, sans-serif" fill="#6F655C"';
  var SERIF = 'font-family="Cormorant Garamond, Georgia, serif" fill="#2B2622"';

  function icAylik() {
    var sol = '<text x="46" y="162" ' + SERIF + ' font-size="17" letter-spacing="3">OCAK</text>' +
      '<text x="186" y="162" ' + YAZI + ' font-size="7" letter-spacing="2" text-anchor="end">2027</text>';
    var gunler = ["P", "S", "Ç", "P", "C", "C", "P"];
    for (var i = 0; i < 7; i++) sol += '<text x="' + (55 + i * 20) + '" y="180" ' + YAZI + ' font-size="6" text-anchor="middle">' + gunler[i] + "</text>";
    for (var r = 0; r <= 5; r++) sol += '<line x1="45" y1="' + (186 + r * 30) + '" x2="185" y2="' + (186 + r * 30) + '" stroke="#DDD2C2" stroke-width=".6"/>';
    for (var c = 0; c <= 7; c++) sol += '<line x1="' + (45 + c * 20) + '" y1="186" x2="' + (45 + c * 20) + '" y2="336" stroke="#DDD2C2" stroke-width=".6"/>';
    for (var g = 1; g <= 31; g++) {
      var h = g + 3, sx = h % 7, sy = Math.floor(h / 7);
      sol += '<text x="' + (47.5 + sx * 20) + '" y="' + (193 + sy * 30) + '" ' + YAZI + ' font-size="5">' + g + "</text>";
    }
    sol += '<circle cx="' + (55 + 3 * 20) + '" cy="' + (201 + 2 * 30) + '" r="8" fill="none" stroke="' + KIL + '" stroke-width=".9"/>' +
      karalama(48, 205, 14) + karalama(88, 235, 15) + karalama(128, 295, 14) +
      '<rect x="146" y="216" width="38" height="3" rx="1.5" fill="#9EAA90" opacity=".6"/>';
    var sag = '<text x="216" y="162" ' + SERIF + ' font-size="15" font-style="italic">Bu ayın niyetleri</text>';
    for (var l = 0; l < 4; l++) {
      var y = 186 + l * 20;
      sag += '<rect x="216" y="' + (y - 6) + '" width="7" height="7" fill="none" stroke="#B9AC99" stroke-width=".7"/>' +
        '<line x1="230" y1="' + (y + 1) + '" x2="352" y2="' + (y + 1) + '" stroke="#DDD2C2" stroke-width=".6"/>';
      if (l < 3) sag += karalama(231, y - 2, 60 + l * 18);
      if (l < 2) sag += '<path d="M217 ' + (y - 3) + "l2 3 4-5" + '" fill="none" stroke="' + KIL + '" stroke-width="1"/>';
    }
    sag += '<text x="216" y="282" ' + SERIF + ' font-size="13" font-style="italic">Notlar</text>';
    for (var n = 0; n < 3; n++) sag += '<line x1="216" y1="' + (300 + n * 16) + '" x2="352" y2="' + (300 + n * 16) + '" stroke="#DDD2C2" stroke-width=".6"/>';
    sag += karalama(217, 297, 96) + karalama(217, 313, 54);
    return acikKitap(sol, sag);
  }

  function icHaftalik() {
    var gun = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
    var sol = '<text x="46" y="158" ' + YAZI + ' font-size="6.5" letter-spacing="2">OCAK · 2. HAFTA</text>';
    var sag = '<text x="354" y="158" ' + YAZI + ' font-size="6.5" letter-spacing="2" text-anchor="end">4 – 10</text>';
    function blok(x, y, h, i, kucuk) {
      var s = '<line x1="' + x + '" y1="' + y + '" x2="' + (x + 140) + '" y2="' + y + '" stroke="#B9AC99" stroke-width=".7"/>' +
        '<text x="' + x + '" y="' + (y + 14) + '" ' + SERIF + ' font-size="' + (kucuk ? 11 : 12) + '">' + (4 + i) + "</text>" +
        '<text x="' + (x + 16) + '" y="' + (y + 13) + '" ' + YAZI + ' font-size="5.5" letter-spacing="1.5">' + gun[i].toLocaleUpperCase("tr-TR") + "</text>";
      for (var l = 1; l * 13 + 14 < h; l++) {
        s += '<line x1="' + x + '" y1="' + (y + 14 + l * 13) + '" x2="' + (x + 140) + '" y2="' + (y + 14 + l * 13) + '" stroke="#E6DDD0" stroke-width=".5"/>';
      }
      return s;
    }
    for (var i = 0; i < 3; i++) sol += blok(45, 170 + i * 62, 62, i);
    for (var j = 0; j < 4; j++) sag += blok(215, 170 + j * 47, 47, j + 3, true);
    sol += karalama(46, 194, 92) + karalama(46, 207, 58) + karalama(46, 256, 110) +
      '<rect x="44" y="312" width="70" height="4" rx="2" fill="' + KIL + '" opacity=".35"/>' + karalama(46, 318, 64);
    sag += karalama(216, 194, 74) + karalama(216, 241, 100) + karalama(216, 254, 40) + karalama(216, 335, 66, KIL);
    return acikKitap(sol, sag);
  }

  /* ---------------- Görsel üretimi ---------------- */
  // gorunum: "kapak" | "aylik" | "haftalik"
  function gorsel(u, renkIdx, gorunum, opt) {
    opt = opt || {};
    renkIdx = renkIdx || 0;
    var renk = u.renkler && u.renkler[renkIdx];
    if ((!gorunum || gorunum === "kapak") && u.foto && u.foto[renkIdx]) {
      return '<img src="' + esc(u.foto[renkIdx]) + '" alt="' + esc(u.ad + (renk ? " – " + renk.ad : "")) + '" loading="lazy">';
    }
    if (gorunum === "aylik") return svg(icAylik(), { vb: opt.vb, zemin: opt.zemin || "#EFE7DB", etiket: u.ad + " – aylık sayfa" });
    if (gorunum === "haftalik") return svg(icHaftalik(), { vb: opt.vb, zemin: opt.zemin || "#EFE7DB", etiket: u.ad + " – haftalık sayfa" });
    var ciz = CIZ[u.cizim] || CIZ.ajanda;
    return svg(ciz(renk ? renk.hex : "#D8C6A9", opt.secenek), { zemin: opt.zemin, etiket: u.ad + (renk ? " – " + renk.ad : "") });
  }

  function heroGorsel() {
    var aj = urunBul("ajanda-2027") || { renkler: [{ hex: "#D8C6A9" }, { hex: "#9EAA90" }] };
    var r = aj.renkler;
    var ic = '<circle cx="300" cy="300" r="250" fill="#E4D8C5"/>' +
      '<g transform="translate(18 40) rotate(-9 200 250)">' + CIZ.ajanda(r[1] ? r[1].hex : "#D8C6A9") + "</g>" +
      '<g transform="translate(168 92) rotate(5 200 250)">' + CIZ.ajanda(r[2] ? r[2].hex : "#9EAA90") + "</g>" +
      '<g transform="translate(60 310) scale(.85)">' + CIZ.kalem("#2E2B28") + "</g>";
    return svg(ic, { vb: "0 0 600 620", zemin: null, etiket: "TOTEM 2027 ajandalar" });
  }

  function renkNoktalari(u) {
    if (!u.renkler || !u.renkler.length) return "";
    return '<div class="kart-renkler">' + u.renkler.map(function (r) {
      return '<i style="background:' + r.hex + '" title="' + esc(r.ad) + '"></i>';
    }).join("") + "</div>";
  }
  function kart(u) {
    return '<a class="kart belir" href="urun.html?id=' + encodeURIComponent(u.id) + '">' +
      '<div class="gorsel-kutu">' + gorsel(u, 0) + "</div>" +
      '<div class="kart-bilgi"><h3>' + esc(u.ad) + "</h3><p>" + esc(u.kisa) + "</p>" + renkNoktalari(u) + "</div></a>";
  }

  /* ---------------- İkonlar ---------------- */
  var IKON = {
    wa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.5 11.6a8.4 8.4 0 0 1-12.4 7.4L3.5 20.5l1.5-4.4a8.4 8.4 0 1 1 15.5-4.5Z"/><path d="M9 8.8c.2 2.6 2.2 4.8 4.9 5.6l1.1-1.2 1.9.9-.4 1.6c-3.8.3-8-3.6-8.1-7.5l1.5-.6 1 1.8Z" fill="currentColor" stroke="none"/></svg>',
    ig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".9" fill="currentColor" stroke="none"/></svg>',
    eposta: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5.5" width="18" height="13" rx="1.5"/><path d="m3.5 6.5 8.5 6.5 8.5-6.5"/></svg>'
  };

  /* ---------------- Header / Footer ---------------- */
  function headerKur() {
    var linkler = [
      ["koleksiyon.html", "Koleksiyon", "koleksiyon"],
      ["urun.html?id=ajanda-2027", "2027 Ajanda", "ajanda"],
      ["hikayemiz.html", "Hikayemiz", "hikaye"],
      ["sss.html", "SSS", "sss"],
      ["iletisim.html", "İletişim", "iletisim"]
    ];
    var aktif = SAYFA === "urun" && param("id") === "ajanda-2027" ? "ajanda" : SAYFA;
    var menu = linkler.map(function (l) {
      return '<a href="' + l[0] + '"' + (l[2] === aktif ? ' class="aktif"' : "") + ">" + l[1] + "</a>";
    }).join("");
    var html = '<div class="duyuru">' + esc(A.duyuru) + "</div>" +
      '<header class="ust"><div class="kap ust-ic">' +
      '<div><nav class="menu" aria-label="Ana menü">' + menu.split("</a>").slice(0, 3).join("</a>") + "</a></nav>" +
      '<button class="hamburger" aria-label="Menüyü aç" aria-expanded="false"><span></span><span></span><span></span></button></div>' +
      '<a class="logo" href="index.html" aria-label="TOTEM ana sayfa">TOTEM</a>' +
      '<div class="ust-sag"><nav class="menu" aria-label="Diğer">' + menu.split("</a>").slice(3, 5).join("</a>") + "</a></nav>" +
      '<a class="wa-mini" href="' + waLink() + '" target="_blank" rel="noopener" aria-label="WhatsApp">' + IKON.wa + "<span>Bize yazın</span></a></div></div>" +
      '<nav class="mobil-menu" aria-label="Mobil menü">' + menu + "</nav></header>";
    document.body.insertAdjacentHTML("afterbegin", html);

    var ust = $(".ust"), btn = $(".hamburger"), mm = $(".mobil-menu");
    btn.addEventListener("click", function () {
      var acik = mm.classList.toggle("acik");
      ust.classList.toggle("menu-acik", acik);
      btn.setAttribute("aria-expanded", acik);
    });
  }

  function footerKur() {
    var html = '<footer class="alt"><div class="kap"><div class="alt-izgara">' +
      '<div><a class="logo" href="index.html">TOTEM</a><p class="soluk" style="max-width:22em">' + esc(A.slogan) +
      " Planlamayı bir ritüele dönüştüren ajanda ve yazı gereçleri.</p></div>" +
      '<div><h4>Koleksiyon</h4><ul><li><a href="urun.html?id=ajanda-2027">2027 Ajanda</a></li>' +
      '<li><a href="koleksiyon.html?kategori=aksesuar">Aksesuarlar</a></li><li><a href="koleksiyon.html">Tüm ürünler</a></li></ul></div>' +
      '<div><h4>TOTEM</h4><ul><li><a href="hikayemiz.html">Hikayemiz</a></li><li><a href="sss.html">Sıkça sorulanlar</a></li><li><a href="iletisim.html">İletişim</a></li></ul></div>' +
      '<div><h4>Bize ulaşın</h4><ul><li><a href="' + waLink() + '" target="_blank" rel="noopener">WhatsApp</a></li>' +
      (A.instagram ? '<li><a href="https://instagram.com/' + esc(A.instagram) + '" target="_blank" rel="noopener">@' + esc(A.instagram) + "</a></li>" : "") +
      (A.eposta ? '<li><a href="mailto:' + esc(A.eposta) + '">' + esc(A.eposta) + "</a></li>" : "") + "</ul></div></div>" +
      '<div class="alt-son"><span>© ' + new Date().getFullYear() + " TOTEM. Tüm hakları saklıdır.</span><span>" + esc(A.sehir) + "</span></div></div></footer>" +
      '<a class="wa-sabit" href="' + waLink() + '" target="_blank" rel="noopener" aria-label="WhatsApp ile yazın">' + IKON.wa + "</a>";
    document.body.insertAdjacentHTML("beforeend", html);
  }

  /* ---------------- Sayfalar ---------------- */
  var SAYFALAR = {};

  SAYFALAR.ana = function () {
    $("#hero-gorsel").innerHTML = heroGorsel();
    var aj = urunBul("ajanda-2027");
    if (aj) {
      $("#renk-serit").innerHTML = aj.renkler.map(function (r, i) {
        return '<a class="renk-kart belir" href="urun.html?id=ajanda-2027&renk=' + i + '"><div class="gorsel-kutu">' +
          gorsel(aj, i, "kapak", { zemin: i % 2 ? "#E4D8C5" : "#EBE2D4" }) + "</div><span>" + esc(r.ad) + "</span></a>";
      }).join("");
      $("#ic-aylik").innerHTML = gorsel(aj, 0, "aylik", { vb: "0 100 400 300" });
      $("#ic-haftalik").innerHTML = gorsel(aj, 0, "haftalik", { vb: "0 100 400 300" });
    }
    $("#one-cikan").innerHTML = A.urunler.filter(function (u) { return u.oneCikan; }).slice(0, 4).map(kart).join("");
    var kilif = urunBul("ajanda-kilifi");
    if (kilif) $("#hikaye-gorsel").innerHTML = gorsel(kilif, 1, "kapak", { zemin: "#E4D8C5" });
  };

  SAYFALAR.koleksiyon = function () {
    var izgara = $("#urun-izgara");
    function goster(kat) {
      $$(".filtre button").forEach(function (b) { b.classList.toggle("aktif", b.getAttribute("data-kat") === kat); });
      izgara.innerHTML = A.urunler.filter(function (u) { return kat === "tumu" || u.kategori === kat; }).map(kart).join("");
      gozlemle();
    }
    $$(".filtre button").forEach(function (b) {
      b.addEventListener("click", function () { goster(b.getAttribute("data-kat")); });
    });
    var k = param("kategori");
    goster(k === "ajanda" || k === "aksesuar" ? k : "tumu");
  };

  SAYFALAR.urun = function () {
    var kutu = $("#urun");
    var u = urunBul(param("id"));
    if (!u) {
      kutu.innerHTML = '<div class="sayfa-bas"><h1>Ürün bulunamadı</h1><p>Aradığın ürün kaldırılmış ya da adı değişmiş olabilir.</p>' +
        '<p style="margin-top:2rem"><a class="dugme" href="koleksiyon.html">Koleksiyona dön</a></p></div>';
      return;
    }
    document.title = u.ad + " — TOTEM";
    var renkIdx = Math.min(parseInt(param("renk"), 10) || 0, Math.max((u.renkler || []).length - 1, 0));
    var secIdx = 0, gorIdx = 0;
    var gorunumler = u.cizim === "ajanda" ? ["kapak", "aylik", "haftalik"] : ["kapak"];

    kutu.innerHTML =
      '<div class="kap urun">' +
      '<div class="galeri' + (gorunumler.length < 2 ? " galeri--tek" : "") + '">' +
      (gorunumler.length > 1 ? '<div class="galeri-kucuk"></div>' : "") +
      '<div class="galeri-buyuk"><div class="gorsel-kutu" id="buyuk"></div></div></div>' +
      '<div class="urun-bilgi">' +
      '<div class="kirinti"><a href="index.html">Ana sayfa</a> / <a href="koleksiyon.html?kategori=' + u.kategori + '">' + (u.kategori === "ajanda" ? "Ajanda" : "Aksesuarlar") + "</a></div>" +
      "<h1>" + esc(u.ad) + "</h1>" +
      '<p class="aciklama">' + esc(u.aciklama) + "</p>" +
      (u.renkler && u.renkler.length ? '<div class="secim"><div class="secim-etiket">Renk: <b id="renk-ad"></b></div><div class="renk-sec"></div></div>' : "") +
      (u.secenekler ? '<div class="secim"><div class="secim-etiket">' + esc(u.secenekler.baslik) + ': <b id="sec-ad"></b></div><div class="secenek-sec"></div></div>' : "") +
      '<a class="dugme" id="wa-siparis" target="_blank" rel="noopener">' + IKON.wa + "WhatsApp'tan sipariş ver</a>" +
      '<p class="not">Fiyat, stok ve teslimat bilgisini WhatsApp üzerinden hemen iletiyoruz.</p>' +
      '<ul class="ozellik-liste">' + u.ozellikler.map(function (o) { return "<li>" + esc(o) + "</li>"; }).join("") + "</ul>" +
      "</div></div>";

    if (u.renkler && u.renkler.length) {
      $(".renk-sec").innerHTML = u.renkler.map(function (r, i) {
        return '<button style="background:' + r.hex + '" data-i="' + i + '" aria-label="' + esc(r.ad) + '" title="' + esc(r.ad) + '"></button>';
      }).join("");
      $$(".renk-sec button").forEach(function (b) {
        b.addEventListener("click", function () { renkIdx = +b.getAttribute("data-i"); gorIdx = 0; ciz(); });
      });
    }
    if (u.secenekler) {
      $(".secenek-sec").innerHTML = u.secenekler.liste.map(function (s, i) {
        return '<button data-i="' + i + '">' + esc(s) + "</button>";
      }).join("");
      $$(".secenek-sec button").forEach(function (b) {
        b.addEventListener("click", function () { secIdx = +b.getAttribute("data-i"); ciz(); });
      });
    }

    function ciz() {
      var renk = u.renkler && u.renkler[renkIdx];
      var sec = u.secenekler ? u.secenekler.liste[secIdx] : null;
      $("#buyuk").innerHTML = gorsel(u, renkIdx, gorunumler[gorIdx], { secenek: sec });
      var kucuk = $(".galeri-kucuk");
      if (kucuk) {
        kucuk.innerHTML = gorunumler.map(function (g, i) {
          return '<button data-i="' + i + '" class="' + (i === gorIdx ? "aktif" : "") + '" aria-label="Görsel ' + (i + 1) + '">' +
            gorsel(u, renkIdx, g, { secenek: sec }) + "</button>";
        }).join("");
        $$("button", kucuk).forEach(function (b) {
          b.addEventListener("click", function () { gorIdx = +b.getAttribute("data-i"); ciz(); });
        });
      }
      $$(".renk-sec button").forEach(function (b, i) { b.classList.toggle("aktif", i === renkIdx); });
      $$(".secenek-sec button").forEach(function (b, i) { b.classList.toggle("aktif", i === secIdx); });
      if (renk) $("#renk-ad").textContent = renk.ad;
      if (sec) $("#sec-ad").textContent = sec;
      $("#wa-siparis").href = waLink(urunMesaj(u, renk && renk.ad, sec));
    }
    ciz();

    var digerleri = A.urunler.filter(function (x) { return x.id !== u.id; });
    if (u.kategori === "aksesuar") digerleri.sort(function (a, b) { return a.kategori === "ajanda" ? -1 : b.kategori === "ajanda" ? 1 : 0; });
    $("#benzer").innerHTML = digerleri.slice(0, 4).map(kart).join("");
  };

  SAYFALAR.sss = function () {
    $("#sss-liste").innerHTML = A.sss.map(function (x, i) {
      return "<details" + (i === 0 ? " open" : "") + "><summary>" + esc(x.s) + "</summary><p>" + esc(x.c) + "</p></details>";
    }).join("");
  };

  SAYFALAR.iletisim = function () {
    var kartlar = ['<a class="iletisim-kart" href="' + waLink() + '" target="_blank" rel="noopener">' + IKON.wa + "<h3>WhatsApp</h3><p>Sipariş ve sorular için en hızlı yol</p></a>"];
    if (A.instagram) kartlar.push('<a class="iletisim-kart" href="https://instagram.com/' + esc(A.instagram) + '" target="_blank" rel="noopener">' + IKON.ig + "<h3>Instagram</h3><p>@" + esc(A.instagram) + "</p></a>");
    if (A.eposta) kartlar.push('<a class="iletisim-kart" href="mailto:' + esc(A.eposta) + '">' + IKON.eposta + "<h3>E-posta</h3><p>" + esc(A.eposta) + "</p></a>");
    var kutu = $("#iletisim-kartlar");
    kutu.innerHTML = kartlar.join("");
    if (window.innerWidth > 960) kutu.style.gridTemplateColumns = "repeat(" + kartlar.length + ", 1fr)";
    if (kartlar.length === 1) kutu.style.maxWidth = "520px", kutu.style.margin = "0 auto";
    $("#mesaj-formu").addEventListener("submit", function (e) {
      e.preventDefault();
      var ad = $("#f-ad").value.trim(), mesaj = $("#f-mesaj").value.trim();
      var metin = "Merhaba, " + (ad ? "ben " + ad + ". " : "") + (mesaj || "TOTEM ürünleri hakkında bilgi almak istiyorum.");
      window.open(waLink(metin), "_blank", "noopener");
    });
  };

  /* ---------------- Ortak ---------------- */
  var gozlemci = "IntersectionObserver" in window ? new IntersectionObserver(function (girdiler) {
    girdiler.forEach(function (g) {
      if (g.isIntersecting) { g.target.classList.add("gorundu"); gozlemci.unobserve(g.target); }
    });
  }, { rootMargin: "0px 0px -8% 0px" }) : null;
  function gozlemle() {
    $$(".belir:not(.gorundu)").forEach(function (el) {
      if (gozlemci) gozlemci.observe(el); else el.classList.add("gorundu");
    });
  }

  headerKur();
  if (SAYFALAR[SAYFA]) SAYFALAR[SAYFA]();
  footerKur();
  $$("[data-wa]").forEach(function (a) {
    a.href = waLink(a.getAttribute("data-wa") || null);
    a.target = "_blank"; a.rel = "noopener";
  });
  gozlemle();
})();
