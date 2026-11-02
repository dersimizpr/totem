/* =========================================================
   TOTEM — SİTE AYARLARI
   Sitedeki tüm değiştirilebilir bilgiler bu dosyadadır.
   Bir değeri değiştirip kaydedin, sayfayı yenileyin (F5).
   ========================================================= */

window.TOTEM_AYARLAR = {

  // WhatsApp numarası: ülke koduyla, boşluksuz, başında + veya 0 olmadan.
  // Örnek: 0532 123 45 67  →  "905321234567"
  whatsapp: "905372815570",

  // Boş bırakılan ("") bilgiler sitede gösterilmez.
  instagram: "",          // @ işareti olmadan kullanıcı adı, örn. "totemajanda"
  eposta: "",             // örn. "merhaba@totem.com"
  sehir: "Türkiye",

  slogan: "Yılın, senin ritminde.",
  duyuru: "2027 ajandaları hazır · Sipariş ve bilgi için WhatsApp'tan yazın",

  /* ---------------------------------------------------------
     ÜRÜNLER
     - id: adres çubuğunda görünür, Türkçe karakter ve boşluk kullanmayın
     - kategori: "ajanda" veya "aksesuar"
     - cizim: ürün illüstrasyonu (ajanda, kalem, defter, ayrac, sticker, kilif, kalemlik, canta)
     - foto: fotoğraflarınız hazır olduğunda, assets/foto klasörüne koyup
             her renk sırasıyla yolunu yazın. Örn: foto: ["assets/foto/ajanda-siyah.jpg", ...]
             Boş bırakılırsa çizim gösterilir.
     - oneCikan: true ise ana sayfada gösterilir
     --------------------------------------------------------- */
  urunler: [
    {
      id: "ajanda-2027",
      ad: "TOTEM 2027 Ajanda",
      kategori: "ajanda",
      cizim: "ajanda",
      oneCikan: true,
      kisa: "Aylık planlama ve haftalık açılımlar, keten kapak.",
      aciklama: "Yılın tamamını tek bakışta gördüğün aylık sayfalar ve günlerine nefes aldıran haftalık açılımlar bir arada. Keten kaplı sert kapağı, lastik kapaması ve kumaş ayracıyla TOTEM 2027, bütün yıl yanında taşıyacağın sakin bir eşlikçi.",
      ozellikler: [
        "A5 boyut (14,8 × 21 cm)",
        "Keten kaplı sert kapak, kabartma logo",
        "224 sayfa, 90 gr krem kağıt",
        "12 aylık takvim sayfası + 53 haftalık açılım",
        "Yıllık hedefler, alışkanlık takibi ve not sayfaları",
        "Kumaş ayraç ve lastik kapama"
      ],
      renkler: [
        { ad: "Siyah",   hex: "#2E2B28" },
        { ad: "Kum",     hex: "#D8C6A9" },
        { ad: "Adaçayı", hex: "#9EAA90" },
        { ad: "Bordo",   hex: "#6B2D33" }
      ],
      foto: []
    },
    {
      id: "not-defteri",
      ad: "TOTEM Not Defteri",
      kategori: "aksesuar",
      cizim: "defter",
      oneCikan: true,
      kisa: "Çizgili ya da noktalı, ajandanın sessiz yol arkadaşı.",
      aciklama: "Ajandana sığmayan fikirler, listeler ve eskizler için. Dikişli sırtı sayesinde tamamen düz açılır; yumuşak kapağı çantada yer kaplamaz.",
      ozellikler: [
        "A5 boyut (14,8 × 21 cm)",
        "Yumuşak keten kapak, açık dikişli sırt",
        "128 sayfa, 90 gr krem kağıt",
        "Çizgili veya noktalı sayfa seçeneği"
      ],
      renkler: [
        { ad: "Kum",     hex: "#D8C6A9" },
        { ad: "Adaçayı", hex: "#9EAA90" },
        { ad: "Siyah",   hex: "#2E2B28" }
      ],
      secenekler: { baslik: "Sayfa", liste: ["Çizgili", "Noktalı"] },
      foto: []
    },
    {
      id: "ajanda-kilifi",
      ad: "Keten Ajanda Kılıfı",
      kategori: "aksesuar",
      cizim: "kilif",
      oneCikan: true,
      kisa: "Ajandanı ve kalemini birlikte koruyan keten kılıf.",
      aciklama: "A5 ajandanı ve kalemini birlikte taşıman için tasarlandı. Kapaklı yapısı ve iç kalem cebiyle çantanın içinde her şey yerli yerinde kalır.",
      ozellikler: [
        "A5 ajanda ve defterlerle uyumlu",
        "Yıkanmış keten kumaş, pamuk astar",
        "İç kalem cebi",
        "Mıknatıslı kapak"
      ],
      renkler: [
        { ad: "Kum",   hex: "#D8C6A9" },
        { ad: "Kil",   hex: "#B08D6E" },
        { ad: "Siyah", hex: "#2E2B28" }
      ],
      foto: []
    },
    {
      id: "kalem",
      ad: "TOTEM Kalem",
      kategori: "aksesuar",
      cizim: "kalem",
      oneCikan: true,
      kisa: "Dengeli metal gövde, akıcı siyah mürekkep.",
      aciklama: "Elde dengeli duran metal gövdesi ve akıcı mürekkebiyle uzun yazılarda bile yormaz. Ajandanın kağıdında dağılmadan, temiz bir çizgi bırakır.",
      ozellikler: [
        "Metal gövde, mat kaplama",
        "0,7 mm siyah mürekkep, değiştirilebilir kartuş",
        "Döner mekanizma",
        "Kabartma TOTEM logosu"
      ],
      renkler: [
        { ad: "Siyah", hex: "#2E2B28" },
        { ad: "Kum",   hex: "#D8C6A9" },
        { ad: "Bordo", hex: "#6B2D33" }
      ],
      foto: []
    },
    {
      id: "ayrac-seti",
      ad: "Kumaş Ayraç Seti",
      kategori: "aksesuar",
      cizim: "ayrac",
      oneCikan: false,
      kisa: "Püsküllü üçlü kumaş ayraç seti.",
      aciklama: "Ajandanda, defterinde ya da okuduğun kitapta kaldığın yeri zarifçe işaretlemek için üçlü kumaş ayraç seti.",
      ozellikler: [
        "3 adet kumaş ayraç",
        "Pamuk püskül",
        "Kum, kil ve adaçayı tonları"
      ],
      renkler: [],
      foto: []
    },
    {
      id: "sticker-seti",
      ad: "Planlama Sticker Seti",
      kategori: "aksesuar",
      cizim: "sticker",
      oneCikan: false,
      kisa: "Ajandana uyumlu sade işaret ve etiketler.",
      aciklama: "Önemli günleri, alışkanlıkları ve hatırlatmaları işaretlemek için ajandanın renk paletiyle uyumlu, sade tasarımlı sticker seti.",
      ozellikler: [
        "4 sayfa, 120+ sticker",
        "Mat kağıt, kolay sökülür",
        "Sayfa sekmeleri, işaretler ve küçük etiketler"
      ],
      renkler: [],
      foto: []
    },
    {
      id: "kalemlik",
      ad: "Fermuarlı Kalemlik",
      kategori: "aksesuar",
      cizim: "kalemlik",
      oneCikan: false,
      kisa: "Kalemlerin, ayraçların ve küçük şeylerin için.",
      aciklama: "Kalemler, ayraçlar, sticker'lar ve çantada kaybolan tüm küçük şeyler için yumuşak keten kalemlik.",
      ozellikler: [
        "21 × 9 cm",
        "Keten kumaş, pamuk astar",
        "Metal fermuar, deri çekme ucu"
      ],
      renkler: [
        { ad: "Kum",     hex: "#D8C6A9" },
        { ad: "Adaçayı", hex: "#9EAA90" },
        { ad: "Bordo",   hex: "#6B2D33" }
      ],
      foto: []
    },
    {
      id: "bez-canta",
      ad: "TOTEM Bez Çanta",
      kategori: "aksesuar",
      cizim: "canta",
      oneCikan: false,
      kisa: "Ajandan, defterin ve günün geri kalanı için.",
      aciklama: "Kalın dokulu pamuk kumaştan, gündelik kullanım için sağlam ve sade bir bez çanta. İç cebi ajandanı ayrı tutar.",
      ozellikler: [
        "38 × 42 cm",
        "%100 kalın pamuk kanvas",
        "İç cep, uzun sap",
        "TOTEM baskı"
      ],
      renkler: [
        { ad: "Ham bez", hex: "#E9DFCC" },
        { ad: "Siyah",   hex: "#2E2B28" }
      ],
      foto: []
    }
  ],

  /* Sıkça Sorulan Sorular */
  sss: [
    { s: "Nasıl sipariş verebilirim?",
      c: "Beğendiğin ürünün sayfasındaki “WhatsApp'tan Sipariş Ver” düğmesine dokunman yeterli. Ürün ve renk bilgisi mesaja otomatik eklenir; fiyat, stok ve teslimat bilgisini sana hemen iletiriz." },
    { s: "Fiyatları neden sitede göremiyorum?",
      c: "Ürünlerimizi küçük partiler halinde hazırlıyoruz; güncel fiyat ve stok durumunu WhatsApp üzerinden kişisel olarak paylaşıyoruz." },
    { s: "Kargo ne kadar sürer?",
      c: "Siparişler 1–3 iş günü içinde kargoya verilir. Türkiye içi teslimat genellikle 1–3 iş günü sürer." },
    { s: "Ajandaya isim yazdırabilir miyim?",
      c: "Evet. Kapağa baş harflerini ya da kısa bir ismi kabartma olarak yazdırabilirsin. Sipariş verirken WhatsApp mesajında belirtmen yeterli." },
    { s: "Ajandanın içinde neler var?",
      c: "12 aylık takvim sayfası, 53 haftalık açılım, yıllık hedef sayfaları, alışkanlık takibi ve not sayfaları. Detaylar için ajanda sayfasına göz atabilirsin." },
    { s: "İade ve değişim yapabilir miyim?",
      c: "Kullanılmamış ürünlerde teslimattan itibaren 14 gün içinde iade ve değişim yapılabilir. Kişiselleştirilmiş ürünler iade kapsamı dışındadır." },
    { s: "Toplu veya kurumsal sipariş veriyor musunuz?",
      c: "Evet, kurumsal hediyeler için logo baskılı özel üretim yapıyoruz. Adet ve tarih bilgisiyle WhatsApp'tan bize ulaşabilirsin." }
  ]
};
