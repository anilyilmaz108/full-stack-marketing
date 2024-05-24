const PORT = process.env.APP_PORT || 8000;
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const app = express();
const db = require("./db/db");
const router = express.Router();

app.use(express.json());
app.use(router);

// Redis
const { createClient } = require("redis");
const client = createClient({});

// Winston ile Loglama
const MyLogger = require("./logs/logger");
const logger = new MyLogger();

// Env Dosyası içinde önemli bilgileri tut
require("dotenv").config({
  override: true,
});

// Redis İşlemlerinde süre vermek için türetilebilir ttl1s, ttl1h, ttl1d e.g.
const ttl5sn = 60 * 60 * 60;

// Express-Validation
const validateUser = require("./middlewares/validators.middeware");
const { validationResult } = require("express-validator");

// İnit Model
const User = require("./models/user-model");

// Livedata Listeleri
const data = [];
const bist100Data = [];
const market = [];
const news = [];

app.get("/", (req, res) => {
  res.send("Welcome");
});

// User login olma => GetUserByEmailAndPassword
router.post("/login", validateUser.validateUser(), async (req, res) => {
  const { email, password } = req.body;
  const errors = validationResult(req);
  client.get("User" + email + password).then(async (r) => {
    if (errors.isEmpty()) {
      if (r) {
        console.log("isExist", r);
        logger.logInfo(
          `${req.ip} den ilgili endpointe  ${req.path} erişim sağlandı `
        );
        res.status(200).json(JSON.parse(r));
      } else {
        console.log("notExist", r);
        try {
          const findedData = await User.findOne(
            { where: { email: email } },
            { where: { password: password } }
          );
          logger.logInfo(
            `${req.ip} den ilgili endpointe  ${req.path} erişim sağlandı. girilen mail: ${email} girilen password: ${password}`
          );
          res.status(200).json(findedData);

          // Eğer Redisde Yoksa Redise Eklesin. Bir Sonraki Aramalarda DB Çağırılmasın
          client
            .set("User" + email + password, JSON.stringify(findedData), {
              EX: ttl5sn,
            })
            .then(async (v) => {
              console.log("SET ETME İŞLEMİ", v);
            });
        } catch (error) {
          logger.logError(
            `${req.ip} den ilgili endpointe  ${req.path} erişim sağlandı hata alındı hata bilgileri ${errors} girilen mail: ${email} girilen password: ${password}`
          );
          res.status(500).json({ message: "Hata Gerçekleşti " });
        }
      }
    } else {
      res.status(500).json({ message: "Hatalı Giriş" });
      logger.logError(
        `${req.ip} den ilgili endpointe  ${req.path} erişim sağlandı hata alındı hata bilgileri ${errors} girilen mail: ${email} girilen password: ${password}`
      );
    }
  });
});

// Create User => GetUserByID
router.post("/register", validateUser.validateUser(), async (req, res) => {
  const { email, password } = req.body;
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    try {
      const userData = await User.create(
        {
          email,
          password,
        },
        { logging: true }
      );
      const jsonData = JSON.stringify(userData);
      const redisKey = JSON.parse(jsonData);
      logger.logInfo(
        `${req.ip} den ilgili endpointe  ${req.path} erişim sağlandı. girilen mail: ${email} girilen password: ${password}`
      );
      res.status(200).json(userData);
      // Redis SET
      client
        .set(
          "User" + redisKey["email"] + redisKey["password"],
          JSON.stringify(userData),
          { EX: ttl5sn }
        )
        .then(async (v) => {
          console.log("SET ETME İŞLEMİ", v);
        });
    } catch (error) {
      logger.logError(
        `${req.ip} den ilgili endpointe  ${req.path} erişim sağlandı hata alındı hata bilgileri ${errors} girilen mail: ${email} girilen password: ${password}`
      );
      res.status(500).json({ message: "Hata Gerçekleşti" });
    }
  } else {
    logger.logError(
      `${req.ip} den ilgili endpointe  ${req.path} erişim sağlandı hata alındı hata bilgileri ${errors} girilen mail: ${email} girilen password: ${password}`
    );
    res.status(400).json(errors.array({ onlyFirstError: false }));
  }
});

// BIST100 Verileri
router.get("/bist100", (req, res) => {
  bist100Data.splice(0, bist100Data.length);
  axios
    .get("https://bigpara.hurriyet.com.tr/borsa/canli-borsa/bist100/")
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      $("a", html).each(function () {
        if ($(this).attr("href").includes("/borsa/hisse-fiyatlari/")) {
          const hisse = $(this).text();
          if (!hisse.includes("Hisse") && !hisse.includes("HİSSE")) {
            const hisseSembolu = hisse;
            const sonFiyat = $(`li[id=h_td_alis_id_${hisse}]`, html).text();
            const satisFiyat = $(`li[id=h_td_satis_id_${hisse}]`, html).text();
            const fiyat = $(`li[id=h_td_fiyat_id_${hisse}]`, html).text();
            const dusukFiyat = $(`li[id=h_td_dusuk_id_${hisse}]`, html).text();
            const ortalama = $(`li[id=h_td_aort_id_${hisse}]`, html).text();
            const yuzde = $(`li[id=h_td_yuzde_id_${hisse}]`, html).text();
            const dunKapanis = $(
              `li[id=h_td_dunkapanis_id_${hisse}]`,
              html
            ).text();
            const fark = $(`li[id=h_td_farktl_id_${hisse}]`, html).text();
            const taban = $(`li[id=h_td_taban_id_${hisse}]`, html).text();
            const tavan = $(`li[id=h_td_tavan_id_${hisse}]`, html).text();
            const hacimLot = $(`li[id=h_td_hacimlot_id_${hisse}]`, html).text();
            const hacim = $(`li[id=h_td_hacimtl_id_${hisse}]`, html).text();
            const saat = $(`li[id=h_td_saat_id_${hisse}]`, html).text();
            bist100Data.push({
              hisseSembolu,
              sonFiyat,
              satisFiyat,
              fiyat,
              dusukFiyat,
              ortalama,
              yuzde,
              dunKapanis,
              fark,
              taban,
              tavan,
              hacimLot,
              hacim,
              saat,
            });
          }
        }
      });

      res.json(bist100Data);
    })
    .catch((err) => console.log(err));
});

// Hisse Arama
router.get("/bist100/:share", (req, res) => {
  data.splice(0, data.length);
  const { share } = req.params;
  axios
    .get("https://bigpara.hurriyet.com.tr/borsa/canli-borsa/bist100/")
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const hisse = share;
      const sonFiyat = $(`li[id=h_td_alis_id_${share}]`, html).text();
      const satisFiyat = $(`li[id=h_td_satis_id_${share}]`, html).text();
      const fiyat = $(`li[id=h_td_fiyat_id_${share}]`, html).text();
      const dusukFiyat = $(`li[id=h_td_dusuk_id_${share}]`, html).text();
      const ortalama = $(`li[id=h_td_aort_id_${share}]`, html).text();
      const yuzde = $(`li[id=h_td_yuzde_id_${share}]`, html).text();
      const dunKapanis = $(`li[id=h_td_dunkapanis_id_${share}]`, html).text();
      const fark = $(`li[id=h_td_farktl_id_${share}]`, html).text();
      const taban = $(`li[id=h_td_taban_id_${share}]`, html).text();
      const tavan = $(`li[id=h_td_tavan_id_${share}]`, html).text();
      const hacimLot = $(`li[id=h_td_hacimlot_id_${share}]`, html).text();
      const hacim = $(`li[id=h_td_hacimtl_id_${share}]`, html).text();
      const saat = $(`li[id=h_td_saat_id_${share}]`, html)
        .text()
        .trim()
        .toString();

      data.push({
        hisse,
        sonFiyat,
        satisFiyat,
        fiyat,
        dusukFiyat,
        ortalama,
        yuzde,
        dunKapanis,
        fark,
        taban,
        tavan,
        hacimLot,
        hacim,
        saat,
      });

      res.json(data);
    })
    .catch((err) => console.log(err));
});

// Piyasalar (Bist-Dolar-Euro-Altın)
router.get("/market", (req, res) => {
  market.splice(0, market.length);
  axios
    .get("https://bigpara.hurriyet.com.tr/borsa/hisse-senetleri/")
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const marketArray = $("div[class=chartItem]", html)
        .text()
        .replace(/[\n\r]\s+/g, " ")
        .trim();
      // Bist
      const bist = marketArray.split(" ")[0];
      const degisimBist = marketArray.split(" ")[2];
      const hacimBist = marketArray.split(" ")[5];
      const dusukBist = marketArray.split(" ")[13];
      const acilisBist = marketArray.split(" ")[20];
      const sonVeriSaatiBist = marketArray.split(" ")[11];
      const yuksekBist = marketArray.split(" ")[17];
      const tarihBist = marketArray.split(" ")[15];

      // Dolar
      const dolar = marketArray.split(" ")[21];
      const degisimdolar = marketArray.split(" ")[23];
      const dusukdolar = marketArray.split(" ")[25];
      const tarihdolar = marketArray.split(" ")[27];
      const yuksekdolar = marketArray.split(" ")[29];
      const acilisdolar = marketArray.split(" ")[32];

      // Euro
      const euro = marketArray.split(" ")[33];
      const degisimeuro = marketArray.split(" ")[35];
      const dusukeuro = marketArray.split(" ")[37];
      const tariheuro = marketArray.split(" ")[39];
      const yuksekeuro = marketArray.split(" ")[41];
      const aciliseuro = marketArray.split(" ")[44];

      // Altın
      const altin = marketArray.split(" ")[45];
      const degisimaltin = marketArray.split(" ")[47];
      const dusukaltin = marketArray.split(" ")[49];
      const tarihaltin = marketArray.split(" ")[51];
      const yuksekaltin = marketArray.split(" ")[53];
      const acilisaltin = marketArray.split(" ")[56];

      market.push({
        bist,
        degisimBist,
        hacimBist,
        yuksekBist,
        acilisBist,
        dusukBist,
        tarihBist,
        sonVeriSaatiBist,
        dolar,
        degisimdolar,
        dusukdolar,
        tarihdolar,
        yuksekdolar,
        acilisdolar,
        euro,
        degisimeuro,
        dusukeuro,
        tariheuro,
        yuksekeuro,
        aciliseuro,
        altin,
        degisimaltin,
        dusukaltin,
        tarihaltin,
        yuksekaltin,
        acilisaltin,
      });

      res.json(market);
    })
    .catch((err) => console.log(err));
});

// Ekonomi Haberleri
router.get("/news", (req, res) => {
  news.splice(0, news.length);
  axios
    .get("https://www.sondakika.com/ekonomi/")
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      $("li[class=nws]", html).each(function () {
        const totalArray = $(this).text().trim().split("   ");
        const saat = totalArray[0];
        const baslik = totalArray[2];
        const aciklama = totalArray[3];

        // const imgArray = $('img', html).attr('alt');
        // console.log(imgArray);

        news.push({
          saat,
          baslik,
          aciklama,
        });
      });
      res.json(news);
    })
    .catch((err) => console.log(err));
});

// Redis'e Bağlanma
const connectRedis = async () => {
  await client.connect();
  console.log("Redise Bağlanıldı.");
};

connectRedis().then(() => {
  app.listen(PORT, async () => {
    await db.connect();
    // db.createTables()
    console.log("Server running...");
    // Üretilen Token
    // console.log(constants.token)
  });
});
