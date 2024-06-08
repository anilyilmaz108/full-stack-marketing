"use strict";
/**
 * @param {import("fastify").FastifyInstance} fastify
 * @param {*} opts
 */

const schema = require("./schema");
const cheerio = require("cheerio");
// Winston ile Loglama
const MyLogger = require('../../logs/logger');
const logger = new MyLogger();

module.exports = async (fastify, opts) => {
  const jwtVerify = [fastify.authCommon /**/];

  const data = [];
  const bist100Data = [];
  const market = [];

  // Bist100 Güncel Verileri
  fastify.get(
    "/bist100/:cache",
    { preValidation: jwtVerify, schema: schema.bist100 },
    async (req, reply) => {
      bist100Data.splice(0, bist100Data.length);
      const key = fastify.removeFirstParameter(req.raw.url);
      let cachedData = await fastify.cache.get(key);

      if (cachedData) {
        reply.send(cachedData.item);
        logger.logInfo(
          `${req.ip} den ilgili endpointe  ${req.url} erişim sağlandı. ${req.method} kullanıldı. ${req.user} kişisi işlem yaptı.`
        );
      } else {
        await fastify.axios
          .get("https://bigpara.hurriyet.com.tr/borsa/canli-borsa/bist100/")
          .then(async (response) => {
            const html = response.data;
            const $ = cheerio.load(html);
            $("a", html).each(async function () {
              if ($(this).attr("href").includes("/borsa/hisse-fiyatlari/")) {
                const hisse = $(this).text();
                if (!hisse.includes("Hisse") && !hisse.includes("HİSSE")) {
                  const hisseSembolu = hisse;
                  const sonFiyat = $(
                    `li[id=h_td_alis_id_${hisse}]`,
                    html
                  ).text();
                  const satisFiyat = $(
                    `li[id=h_td_satis_id_${hisse}]`,
                    html
                  ).text();
                  const fiyat = $(`li[id=h_td_fiyat_id_${hisse}]`, html).text();
                  const dusukFiyat = $(
                    `li[id=h_td_dusuk_id_${hisse}]`,
                    html
                  ).text();
                  const ortalama = $(
                    `li[id=h_td_aort_id_${hisse}]`,
                    html
                  ).text();
                  const yuzde = $(`li[id=h_td_yuzde_id_${hisse}]`, html).text();
                  const dunKapanis = $(
                    `li[id=h_td_dunkapanis_id_${hisse}]`,
                    html
                  ).text();
                  const fark = $(`li[id=h_td_farktl_id_${hisse}]`, html).text();
                  const taban = $(`li[id=h_td_taban_id_${hisse}]`, html).text();
                  const tavan = $(`li[id=h_td_tavan_id_${hisse}]`, html).text();
                  const hacimLot = $(
                    `li[id=h_td_hacimlot_id_${hisse}]`,
                    html
                  ).text();
                  const hacim = $(
                    `li[id=h_td_hacimtl_id_${hisse}]`,
                    html
                  ).text();
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
                }
              }
            });
            logger.logInfo(
              `${req.ip} den ilgili endpointe  ${req.url} erişim sağlandı. ${req.method} kullanıldı. ${req.user} kişisi işlem yaptı.`
            );
            // Cache
            fastify.cache.set(key, bist100Data, fastify.config().ttl5m);
            reply.send(bist100Data);
          });
      }
    }
  );

  // Bist100 Search
  fastify.get("/bist/:share", { preValidation: jwtVerify, schema: schema.bist }, async (req, reply) => {
    data.splice(0, data.length);
    const { share } = req.params;

    await fastify.axios
      .get("https://bigpara.hurriyet.com.tr/borsa/canli-borsa/bist100/")
      .then(async (response) => {
        const html = response.data;
        const $ = cheerio.load(html);
        const hisse = share;
        const sonFiyat = $(`li[id=h_td_alis_id_${share}]`, html).text();
        const satisFiyat = $(`li[id=h_td_satis_id_${share}]`, html).text();
        const fiyat = $(`li[id=h_td_fiyat_id_${share}]`, html)
          .text()
          .split(",")[0];
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
      });
      logger.logInfo(
        `${req.ip} den ilgili endpointe  ${req.url} erişim sağlandı. ${req.method} kullanıldı. ${req.user} kişisi işlem yaptı.`
      );
    reply.send(data);
  });

  // Piyasa Verileri
  fastify.get(
    "/marketData/:marketId",
    { preValidation: jwtVerify, schema: schema.marketData },
    async (req, reply) => {
      market.splice(0, market.length);
      const { marketId } = req.params;

      await fastify.axios
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
        });
        logger.logInfo(
          `${req.ip} den ilgili endpointe  ${req.url} erişim sağlandı. ${req.method} kullanıldı. ${req.user} kişisi işlem yaptı.`
        );
      reply.send(market);
    }
  );
};
