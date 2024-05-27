const PORT = process.env.APP_PORT || 8000;
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const app = express();

// Cors Options
var cors = require("cors");
app.use(cors());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", [
    "http://localhost:8000",
    "http://localhost:8001",
    "http://localhost:3307",
  ]);
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

var corsOptions = {
  origin: "http://localhost:4200",
  optionsSuccessStatus: 200,
};

const db = require("./db/db");
const router = express.Router();

app.use(express.json());
app.use(router);

//Swagger Integration => node swagger.js
var swaggerUi = require("swagger-ui-express");

swaggerDocument = require("./swagger-output.json");
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Redis
// docker run --name liveapiredis -p 8001:6379 -d redis
// docker-compose -f docker-compose.yml up
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
const constants = require("./constants");

// İnit Model
const User = require("./models/user-model");
const Bist = require("./models/bist-model");
const Usd = require("./models/usd-model");
const Euro = require("./models/euro-model");
const Gold = require("./models/gold-model");
const Share = require("./models/share-model");
const Follow = require("./models/follow-model");
const Portfolio = require("./models/portfolio-model");

// Livedata Listeleri
const data = [];
const bist100Data = [];
const market = [];
const news = [];

app.get("/", (req, res) => {
  res.send("Welcome");
});

// User login olma => GetUserByEmailAndPassword
router.post(
  "/login",
  cors(corsOptions),
  validateUser.validateUser(),
  async (req, res) => {
    const { email, password } = req.body;
    const errors = validationResult(req);
    if (constants.token) {
      logger.logInfo(
        `${req.ip} den ilgili endpointe  ${req.path} erişim sağlandı token üretildi = ${constants.token} `
      );
      console.log("Hash Password:", constants.hashToPassword(password));
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
    } else {
      res.status(500).json({ message: "Hatalı Token" });
      logger.logError(
        `${req.ip} den ilgili endpointe  ${req.path} erişim sağlandı hata alındı hata bilgileri ${errors} token bulunamadı`
      );
    }
    // #swagger.summary = 'Login İşlemi'
    // #swagger.description = 'Cache kontrol edilir. Eğer Cachede veri bulunursa DBye bakmadan işlem yapılır. Yoksa DB kontrolü ile giriş yapılır.'
    /*  #swagger.parameters['Auth'] = {
        in: 'body',
        description: 'String tipinde email ile password verisi kullanılmaktadır. Middeware içindeki validation kurallarına uyma kontrolü yapılır.',
      } */
    // #swagger.tags = ['Auth']
  }
);

// Create User => GetUserByID
router.post(
  "/register",
  cors(corsOptions),
  validateUser.validateUser(),
  async (req, res) => {
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
    // #swagger.summary = 'Register İşlemi'
    // #swagger.description = 'Veriler DBye kaydedilir. Kayıt işlemi sonrasında Cache içine de eklenir.'
    /*  #swagger.parameters['Auth'] = {
        in: 'body',
        description: 'String tipinde email ile password verisi kullanılmaktadır. Middeware içindeki validation kurallarına uyma kontrolü yapılır.',
      } */
    // #swagger.tags = ['Auth']
  }
);

// User Oluşturma + Redis
router.post("/createUser", cors(corsOptions), async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const userData = await User.create(
      {
        email,
        password,
        role,
      },
      { logging: true }
    );
    const jsonData = JSON.stringify(userData);
    const redisKey = JSON.parse(jsonData);
    logger.logInfo(
      `${req.ip} den ilgili endpointe  ${req.path} erişim sağlandı `
    );
    res.status(200).json(userData);
    // Redis SET
    client
      .set("User" + redisKey["id"], JSON.stringify(userData), { EX: ttl5sn })
      .then(async (v) => {
        console.log("SET ETME İŞLEMİ", v);
      });
  } catch (error) {
    logger.logError(
      `${req.ip} den ilgili endpointe  ${req.path} erişim sağlandı hata alındı hata bilgileri ${error} `
    );
    res.status(500).json({ message: "Hata Gerçekleşti" });
    console.log("err", error);
  }
  // #swagger.tags = ['User']
  // #swagger.summary = 'User Oluşturma'
  // #swagger.description = 'Veriler DBye kaydedilir. Kayıt işlemi sonrasında Cache içine de eklenir. Register işlemi ile farkı role verisi default olarak user gelir fakat bu işlemde rol de verilir. '
  /*  #swagger.parameters['Auth'] = {
        in: 'body',
        description: 'String tipinde email ile password verisi kullanılmaktadır. Middeware içindeki validation kurallarına uyma kontrolü yapılır.',
      } */
});

// Bütün Userları Listeleme + Redis
router.get("/getAllUser", cors(corsOptions), async (req, res) => {
  let keys = [];
  await client.keys("*").then(async (r) => {
    keys = r;
    console.log("KEY LIST", keys);
  });
  if (keys.length > 0) {
    console.log("isExist", keys.length);
    logger.logInfo(
      `${req.ip} den ilgili endpointe  ${req.path} erişim sağlandı `
    );
    await client.mGet(keys).then(async (reply) => {
      let str = "[" + reply + "]";
      res.status(200).json(JSON.parse(str));
    });
  } else {
    console.log("NotExist", keys);
    try {
      // attributes kullanarak filtreleme yapılabilir
      // kullanılmazsa tüm veriler gelir
      const response = await User.findAll({
        // attributes: ['user_id', 'testMail','12345678']
      });
      logger.logInfo(
        `${req.ip} den ilgili endpointe  ${req.path} erişim sağlandı `
      );
      res.status(200).json(response);
      // Redis MSET
      const records = {};
      response.forEach((element) => {
        records["User" + element.email + element.password] =
          JSON.stringify(element);
      });
      client.mSet(records, { EX: ttl5sn }).then(async (v) => {
        console.log("SET ETME İŞLEMİ", v);
      });
    } catch (error) {
      logger.logError(
        `${req.ip} den ilgili endpointe  ${req.path} erişim sağlandı hata alındı hata bilgileri ${error} `
      );
      res.status(500).json({ message: "Hata Gerçekleşti" });
    }
  }
  // #swagger.tags = ['User']
  // #swagger.summary = 'Tüm User Verilerini Okuma'
  // #swagger.description = 'Cache kontrol edilir. Eğer Cachede veri bulunursa DBye bakmadan işlem yapılır. Yoksa DB kontrolü ile giriş yapılır.'
});

// ID'ye Göre User Çekme
router.get("/getUserById/:userId", cors(corsOptions), async (req, res) => {
  const { userId } = req.params;
  client.get("User" + userId).then(async (r) => {
    if (r) {
      console.log("isExist", r);
      logger.logInfo(
        `${req.ip} den ilgili endpointe  ${req.path} erişim sağlandı `
      );
      res.status(200).json(JSON.parse(r));
    } else {
      console.log("notExist", r);
      try {
        const findedData = await User.findByPk(userId);
        logger.logInfo(
          `${req.ip} den ilgili endpointe  ${req.path} erişim sağlandı `
        );
        res.status(200).json(findedData);

        // Eğer Redisde Yoksa Redise Eklesin. Bir Sonraki Aramalarda DB Çağırılmasın
        client
          .set("User" + userId, JSON.stringify(findedData), { EX: ttl5sn })
          .then(async (v) => {
            console.log("SET ETME İŞLEMİ", v);
          });
      } catch (error) {
        console.log("err", error);
        logger.logError(
          `${req.ip} den ilgili endpointe  ${req.path} erişim sağlandı hata alındı hata bilgileri ${error} `
        );
        res.status(500).json({ message: "Hata Gerçekleşti " });
      }
    }
  });
  // #swagger.summary = 'User Verilerini IDye Göre Okuma'
  // #swagger.description = 'Cache kontrol edilir. Eğer Cachede veri bulunursa DBye bakmadan işlem yapılır. Yoksa DB kontrolü ile giriş yapılır.'
  /*  #swagger.parameters['User'] = {
        in: 'path',
        description: 'User IDye Göre İşlem Yapılır.',
      } */
  // #swagger.tags = ['User']
});

// ID'ye Göre User Silme
router.delete("/deleteUser/:userId", cors(corsOptions), async (req, res) => {
  const { userId } = req.params;
  client.del("User" + userId).then(async (r) => {
    if (r) {
      console.log("isExist", r);
      logger.logInfo(
        `${req.ip} den ilgili endpointe  ${req.path} erişim sağlandı `
      );
      //res.status(200).json(JSON.parse(r))
      try {
        const user = await User.findByPk(userId);
        const removedData = await user.destroy();
        console.log("removedData", removedData);
        logger.logInfo(
          `${req.ip} den ilgili endpointe  ${req.path} erişim sağlandı `
        );
        res.status(200).json(removedData);
      } catch (error) {
        logger.logError(
          `${req.ip} den ilgili endpointe  ${req.path} erişim sağlandı hata alındı hata bilgileri ${error} `
        );
        res.status(500).json({ message: "Hata Gerçekleşti" });
        console.log("err", error);
      }
    } else {
      try {
        const user = await User.findByPk(userId);
        const removedData = await user.destroy();
        console.log("removedData", removedData);
        logger.logInfo(
          `${req.ip} den ilgili endpointe  ${req.path} erişim sağlandı `
        );
        res.status(200).json(removedData);
      } catch (error) {
        logger.logError(
          `${req.ip} den ilgili endpointe  ${req.path} erişim sağlandı hata alındı hata bilgileri ${error} `
        );
        res.status(500).json({ message: "Hata Gerçekleşti" });
        console.log("err", error);
      }
    }
  });
  // #swagger.tags = ['User']
  // #swagger.summary = 'IDye Göre User Silme'
  // #swagger.description = 'Veriler DB ve Cacheden Silinir.'
  /*  #swagger.parameters['User'] = {
        in: 'path',
        description: 'User IDye Göre İşlem Yapılır.',
      } */
});

// Userın takip ettiği hisseler POST
router.post("/createFollow", cors(corsOptions), async (req, res) => {
  const { user, shareSymbol } = req.body;
  try {
    const followData = await Follow.create(
      { user: user, hisse: shareSymbol },
      { logging: true }
    );
    logger.logInfo(
      `${req.ip} den ilgili endpointe  ${req.path} erişim sağlandı `
    );
    res.status(200).json(followData);
  } catch (error) {
    logger.logError(
      `${req.ip} den ilgili endpointe  ${req.path} erişim sağlandı hata alındı hata bilgileri ${error} `
    );
    res.status(500).json({ message: "Hata Gerçekleşti" });
    console.log("err", error);
  }
  // #swagger.tags = ['Follow']
  // #swagger.summary = 'Userın Takip Listesi Oluşturma'
  // #swagger.description = 'Veriler DBye kaydedilir.'
  /*  #swagger.parameters['Follow'] = {
        in: 'body',
        description: 'Int tipinde user ile String tipinde hisse verisi kullanılmaktadır.',
      } */
});

// Userın takip ettiği hisseleri silme DELETE
router.delete(
  "/deleteFollow/:userId/:shareSymbol",
  cors(corsOptions),
  async (req, res) => {
    const { userId, shareSymbol } = req.params;
    try {
      await Follow.destroy({ where: { user: userId, hisse: shareSymbol } });
      logger.logInfo(
        `${req.ip} den ilgili endpointe  ${req.path} erişim sağlandı `
      );
      res.status(200).json({ message: "Silme İşlemi Başarılı" });
    } catch (error) {
      logger.logError(
        `${req.ip} den ilgili endpointe  ${req.path} erişim sağlandı hata alındı hata bilgileri ${error} `
      );
      res.status(500).json({ message: "Hata Gerçekleşti" });
      console.log("err", error);
    }
    // #swagger.tags = ['Follow']
    // #swagger.summary = 'Userın Takip Listesi Silme'
    // #swagger.description = 'Veriler DBden silinir.'
    /*  #swagger.parameters['Follow'] = {
        in: 'path',
        description: 'User ID ile hisse sembolü verisi kullanılmaktadır.',
      } */
  }
);

// Userın takip listesi GET
router.get("/getFollow/:userId", cors(corsOptions), async (req, res) => {
  var jsonAllData = [];
  const { userId } = req.params;
  try {
    const findedData = await Follow.findAll({ where: { user: userId } });
    for (let index = 0; index < findedData.length; index++) {
      const element = findedData[index];
      const follows = await Share.findAll({ where: { hisse: element.hisse } });
      var x = {
        id: follows[0].id,
        hisse: follows[0].hisse,
        sonFiyat: follows[0].sonFiyat,
        satisFiyat: follows[0].sonFiyat,
        fiyat: follows[0].fiyat,
        dusukFiyat: follows[0].dusukFiyat,
        ortalama: follows[0].ortalama,
        yuzde: follows[0].yuzde,
        dunKapanis: follows[0].dunKapanis,
        fark: follows[0].fark,
        taban: follows[0].taban,
        tavan: follows[0].tavan,
        hacimLot: follows[0].hacimLot,
        hacim: follows[0].hacim,
        saat: follows[0].saat,
      };
      jsonAllData.push(x);
    }
    logger.logInfo(
      `${req.ip} den ilgili endpointe  ${req.path} erişim sağlandı `
    );
    res.status(200).json(jsonAllData);
  } catch (error) {
    console.log("err", error);
    logger.logError(
      `${req.ip} den ilgili endpointe  ${req.path} erişim sağlandı hata alındı hata bilgileri ${error} `
    );
    res.status(500).json({ message: "Hata Gerçekleşti " });
  }
  // #swagger.tags = ['Follow']
  // #swagger.summary = 'Userın Tüm Takip Listesi'
  // #swagger.description = 'Veriler DBden Okunur.'
  /*  #swagger.parameters['Follow'] = {
        in: 'path',
        description: 'User ID verisi kullanılmaktadır.',
      } */
});

// Userın takip ettiği tek bir hiise GET
router.get(
  "/getFollowByShare/:userId/:shareSymbol",
  cors(corsOptions),
  async (req, res) => {
    var jsonAllData = [];
    const { userId, shareSymbol } = req.params;
    try {
      const findedData = await Follow.findAll({
        where: { user: userId, hisse: shareSymbol },
      });
      for (let index = 0; index < findedData.length; index++) {
        const element = findedData[index];
        const follows = await Share.findAll({
          where: { hisse: element.hisse },
        });
        var x = {
          id: follows[0].id,
          hisse: follows[0].hisse,
          sonFiyat: follows[0].sonFiyat,
          satisFiyat: follows[0].sonFiyat,
          fiyat: follows[0].fiyat,
          dusukFiyat: follows[0].dusukFiyat,
          ortalama: follows[0].ortalama,
          yuzde: follows[0].yuzde,
          dunKapanis: follows[0].dunKapanis,
          fark: follows[0].fark,
          taban: follows[0].taban,
          tavan: follows[0].tavan,
          hacimLot: follows[0].hacimLot,
          hacim: follows[0].hacim,
          saat: follows[0].saat,
        };
        jsonAllData.push(x);
      }
      logger.logInfo(
        `${req.ip} den ilgili endpointe  ${req.path} erişim sağlandı `
      );
      res.status(200).json(jsonAllData);
    } catch (error) {
      console.log("err", error);
      logger.logError(
        `${req.ip} den ilgili endpointe  ${req.path} erişim sağlandı hata alındı hata bilgileri ${error} `
      );
      res.status(500).json({ message: "Hata Gerçekleşti " });
    }
    // #swagger.tags = ['Follow']
    // #swagger.summary = 'Userın ID ve Hisseye Göre Takip Listesi'
    // #swagger.description = 'Veriler DBden Okunur.'
    /*  #swagger.parameters['Follow'] = {
        in: 'path',
        description: 'User ID ve hisse sembolü verisi kullanılmaktadır.',
      } */
  }
);

// User portfolyo oluşturma
router.post("/createPortfolio", cors(corsOptions), async (req, res) => {
  const { user, euro, dolar, altin, hisse, lira } = req.body;
  try {
    const portfolioData = await Portfolio.create(
      {
        user: user,
        euro: euro,
        dolar: dolar,
        altin: altin,
        hisse: hisse,
        lira: lira,
      },
      { logging: true }
    );
    const jsonData = JSON.stringify(portfolioData);
    const redisKey = JSON.parse(jsonData);
    logger.logInfo(
      `${req.ip} den ilgili endpointe  ${req.path} erişim sağlandı `
    );
    res.status(200).json(portfolioData);
    // Redis SET
    client
      .set("Portfolio" + redisKey["user"], JSON.stringify(portfolioData), {
        EX: ttl5sn,
      })
      .then(async (v) => {
        console.log("SET ETME İŞLEMİ", v);
      });
  } catch (error) {
    logger.logError(
      `${req.ip} den ilgili endpointe  ${req.path} erişim sağlandı hata alındı hata bilgileri ${error} `
    );
    res.status(500).json({ message: "Hata Gerçekleşti" });
    console.log("err", error);
  }
  // #swagger.tags = ['Portfolio']
  // #swagger.summary = 'User Portfolio Oluşturma'
  // #swagger.description = 'Veriler DBye kaydedilir. DBye kayıt işlemi sonrası Cachede kaydedilir.'
  /*  #swagger.parameters['Portfolio'] = {
        in: 'body',
        description: 'Int tipinde user verisi, String tipinde euro, dolar, altın, lira verisi ve String Array tipinde hisse verisi kullanılmaktadır.',
      } */
});

// User portfolio verilerini çekme
router.get("/getPortfolio/:user", cors(corsOptions), async (req, res) => {
  const { user } = req.params;
  client.get("Portfolio" + user).then(async (r) => {
    if (r) {
      console.log("isExist", r);
      logger.logInfo(
        `${req.ip} den ilgili endpointe  ${req.path} erişim sağlandı `
      );
      res.status(200).json(JSON.parse(r));
    } else {
      console.log("notExist", r);
      try {
        const findedData = await Portfolio.findOne({ where: { user: user } });
        logger.logInfo(
          `${req.ip} den ilgili endpointe  ${req.path} erişim sağlandı `
        );
        res.status(200).json(findedData);

        // Eğer Redisde Yoksa Redise Eklesin. Bir Sonraki Aramalarda DB Çağırılmasın
        client
          .set("Portfolio" + userId, JSON.stringify(findedData), { EX: ttl5sn })
          .then(async (v) => {
            console.log("SET ETME İŞLEMİ", v);
          });
      } catch (error) {
        console.log("err", error);
        logger.logError(
          `${req.ip} den ilgili endpointe  ${req.path} erişim sağlandı hata alındı hata bilgileri ${error} `
        );
        res.status(500).json({ message: "Hata Gerçekleşti " });
      }
    }
  });
  // #swagger.tags = ['Portfolio']
  // #swagger.summary = 'User IDye Göre Portfolio Listesi'
  // #swagger.description = 'Cache kontrol edilir. Eğer Cachede veri bulunursa DBye bakmadan işlem yapılır. Yoksa DB kontrolü ile giriş yapılır.'
  /*  #swagger.parameters['Portfolio'] = {
        in: 'path',
        description: 'User ID verisi kullanılmaktadır.',
      } */
});

// User portfolio verilerini silme
router.delete("/deletePortfolio/:user", cors(corsOptions), async (req, res) => {
  const { user } = req.params;
  client.del("Portfolio" + user).then(async (r) => {
    if (r) {
      console.log("isExist", r);
      logger.logInfo(
        `${req.ip} den ilgili endpointe  ${req.path} erişim sağlandı `
      );
      //res.status(200).json(JSON.parse(r))
      try {
        const portfolio = await Portfolio.findOne({ where: { user: user } });
        const removedData = await portfolio.destroy();
        console.log("removedData", removedData);
        logger.logInfo(
          `${req.ip} den ilgili endpointe  ${req.path} erişim sağlandı `
        );
        res.status(200).json(removedData);
      } catch (error) {
        logger.logError(
          `${req.ip} den ilgili endpointe  ${req.path} erişim sağlandı hata alındı hata bilgileri ${error} `
        );
        res.status(500).json({ message: "Hata Gerçekleşti" });
        console.log("err", error);
      }
    } else {
      try {
        const portfolio = await Portfolio.findOne({ where: { user: user } });
        const removedData = await portfolio.destroy();
        console.log("removedData", removedData);
        logger.logInfo(
          `${req.ip} den ilgili endpointe  ${req.path} erişim sağlandı `
        );
        res.status(200).json(removedData);
      } catch (error) {
        logger.logError(
          `${req.ip} den ilgili endpointe  ${req.path} erişim sağlandı hata alındı hata bilgileri ${error} `
        );
        res.status(500).json({ message: "Hata Gerçekleşti" });
        console.log("err", error);
      }
    }
  });
  // #swagger.tags = ['Portfolio']
  // #swagger.summary = 'User IDye Göre Portfolio Silme'
  // #swagger.description = 'Veriler DBden silinir.'
  /*  #swagger.parameters['Portfolio'] = {
        in: 'path',
        description: 'User ID verisi kullanılmaktadır.',
      } */
});

// User portfolio verilerini güncelleme
router.put("/updatePortfolio/:user", cors(corsOptions), async (req, res) => {
  const { user } = req.params;
  const { euro, dolar, altin, hisse, lira } = req.body;
  try {
    const findedData = await Portfolio.findOne({ where: { user: user } });
    const up = await Portfolio.update(
      {
        euro: euro,
        dolar: dolar,
        altin: altin,
        hisse: hisse,
        lira: lira,
      },
      { where: { user: user } },
      { logging: true }
    );
    logger.logInfo(
      `${req.ip} den ilgili endpointe  ${req.path} erişim sağlandı `
    );
    res.status(200).json(up);
    // Redis SET
    client
      .set("Portfolio" + user, JSON.stringify(findedData), { EX: ttl5sn })
      .then(async (v) => {
        console.log("SET ETME İŞLEMİ", v);
      });
  } catch (error) {
    logger.logError(
      `${req.ip} den ilgili endpointe  ${req.path} erişim sağlandı hata alındı hata bilgileri ${error} `
    );
    res.status(500).json({ message: "Hata Gerçekleşti " });
    console.log("err", error);
  }
  // #swagger.tags = ['Portfolio']
  // #swagger.summary = 'User Portfolio Güncelleme'
  // #swagger.description = 'Veriler DBye kaydedilir. DBye kayıt işlemi sonrası Cachede kaydedilir.'
  /*  #swagger.parameters['Portfolio'] = [
    {
        in: 'path',
        description: 'Int tipinde user verisi kullanılmaktadır.',
      },
         {
        in: 'body',
        description: 'String tipinde euro, dolar, altın, lira verisi ve String Array tipinde hisse verisi kullanılmaktadır.',
      },
  ] */
});

// BIST100 Verileri
router.get("/bist100", cors(corsOptions), async (req, res) => {
  bist100Data.splice(0, bist100Data.length);
  axios
    .get("https://bigpara.hurriyet.com.tr/borsa/canli-borsa/bist100/")
    .then(async (response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      $("a", html).each(async function () {
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
            const saat = $(`li[id=h_td_saat_id_${hisse}]`, html)
              .text()
              .trim()
              .toString();
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
            var datetime = new Date(); //new Date().setHours(new Date().getHours() + 3) => Sunucu Tarih Ayarı için bir sorun olursa
            console.log(datetime);
            // Veri Tabanına Günde 1 kez kayıt edilsin.
            if (datetime.getHours() == 19 && datetime.getMinutes() == 0) {
              try {
                const shareData = await Share.create(
                  {
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
                  },
                  { logging: true }
                );
                logger.logInfo(
                  `${req.ip} den ilgili endpointe  ${req.path} erişim sağlandı `
                );
              } catch (error) {
                logger.logError(
                  `${req.ip} den ilgili endpointe  ${req.path} erişim sağlandı hata alındı hata bilgileri ${error} `
                );
                console.log("err", error);
              }
            }
          }
        }
      });
      res.status(200).json(bist100Data);
    })
    .catch((err) => console.log(err));
  // #swagger.tags = ['Bist']
  // #swagger.summary = 'Günlük Bist Verileri'
  // #swagger.description = 'Veriler DBye 19:00da kaydedilir.'
});

// Hisse Arama => Arama işleminde kullanılacağı için DB'ye eklemeye gerek yok.
router.get("/bist100/:share", cors(corsOptions), async (req, res) => {
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
  // #swagger.tags = ['Bist']
  // #swagger.summary = 'Bist Verileri Arama'
  // #swagger.description = 'Veriler DBye kayıt edilmez. Client tarafında search işlemleri için kullanılır.'
});

// Client tarafında tarih kontrolü yapıp, eğer tarih uyuyorsa bu kısım çalıştır gibi bir şey yapılabilir.
// Saat 19:00:00'da eğer istek gelirse DB'ye atılır.
// Piyasalar (Bist-Dolar-Euro-Altın)
router.get("/market/:marketId", cors(corsOptions), async (req, res) => {
  const { marketId } = req.params;
  market.splice(0, market.length);
  axios
    .get("https://bigpara.hurriyet.com.tr/borsa/hisse-senetleri/")
    .then(async (response) => {
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

      if (marketId == 1) {
        market.push({
          bist,
          degisimBist,
          hacimBist,
          yuksekBist,
          acilisBist,
          dusukBist,
          tarihBist,
          sonVeriSaatiBist,
        });
      } else if (marketId == 2) {
        market.push({
          dolar,
          degisimdolar,
          dusukdolar,
          tarihdolar,
          yuksekdolar,
          acilisdolar,
        });
      } else if (marketId == 3) {
        market.push({
          euro,
          degisimeuro,
          dusukeuro,
          tariheuro,
          yuksekeuro,
          aciliseuro,
        });
      } else {
        market.push({
          altin,
          degisimaltin,
          dusukaltin,
          tarihaltin,
          yuksekaltin,
          acilisaltin,
        });
      }

      res.status(200).json(market);
      var datetime = new Date(); //new Date().setHours(new Date().getHours() + 3) => Sunucu Tarih Ayarı için bir sorun olursa
      console.log(datetime);
      // Veri Tabanına Günde 1 kez kayıt edilsin.
      if (datetime.getHours() == 19 && datetime.getMinutes() == 0) {
        console.log("DB Market Kayıt");
        try {
          const bistData = await Bist.create(
            {
              bist,
              degisimBist,
              tarihBist,
            },
            { logging: true }
          );
          const usdData = await Usd.create(
            {
              dolar,
              degisimdolar,
              tarihdolar,
            },
            { logging: true }
          );
          const euroData = await Euro.create(
            {
              euro,
              degisimeuro,
              tariheuro,
            },
            { logging: true }
          );
          const altintData = await Gold.create(
            {
              altin,
              degisimaltin,
              tarihaltin,
            },
            { logging: true }
          );
          logger.logInfo(
            `${req.ip} den ilgili endpointe  ${req.path} erişim sağlandı `
          );
        } catch (error) {
          logger.logError(
            `${req.ip} den ilgili endpointe  ${req.path} erişim sağlandı hata alındı hata bilgileri ${error} `
          );
          console.log("err", error);
        }
      }
    })
    .catch((err) => console.log(err));
  // #swagger.tags = ['Market']
  // #swagger.summary = 'Günlük Bist, Dolar, Euro ve Altın Verileri'
  // #swagger.description = 'Veriler DBye 19:00da kaydedilir.'
});

// Ekonomi Haberleri => Günlük değiştikleri için DB'ye atmaya gerek yok.
router.get("/news", cors(corsOptions), async (req, res) => {
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
  // #swagger.tags = ['News']
  // #swagger.summary = 'Günlük Ekonomi Haberleri'
  // #swagger.description = 'Veriler DBye kayıt edilmez. Client tarafında search işlemleri için kullanılır.'
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
    console.log(constants.token);
  });
});

// Client tarafında grafik ile veriler gösterileceği için Server tarafında Update yerine Create Yapılmalı
// Grafikte spesifik bir tarihe gitmek için Client tarafında sorgu yapılabilir.
