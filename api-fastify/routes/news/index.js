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
  const economy = [];
  const finance = [];
  const tech = [];
  const culture = [];
  const health = [];
  // Ekonomi Haberleri
  fastify.get(
    "/economy/:cache",
    { preValidation: jwtVerify, schema: schema.economy },
    async (req, reply) => {
      economy.splice(0, economy.length);
      const key = fastify.removeFirstParameter(req.raw.url);
      let cachedData = await fastify.cache.get(key);

      if (cachedData) {
        reply.send(cachedData.item);
      } else {
        await fastify.axios
          .get("https://www.sondakika.com/ekonomi/")
          .then((response) => {
            const html = response.data;
            const $ = cheerio.load(html);
            $("li[class=nws]", html).each(function () {
              const totalArray = $(this).text().trim().split("   ");
              const saat = totalArray[0];
              const baslik = totalArray[2];
              const aciklama = totalArray[3];

              economy.push({
                saat,
                baslik,
                aciklama,
              });
            });
            logger.logInfo(
              `${req.ip} den ilgili endpointe  ${req.url} erişim sağlandı. ${req.method} kullanıldı. ${req.user} kişisi işlem yaptı.`
            );
            // Cache
            fastify.cache.set(key, economy, fastify.config().ttl5m);
            reply.send(economy);
          });
      }
    }
  );

  // Finans Haberleri
  fastify.get(
    "/finance/:cache",
    { preValidation: jwtVerify, schema: schema.finance },
    async (req, reply) => {
      finance.splice(0, finance.length);
      const key = fastify.removeFirstParameter(req.raw.url);
      let cachedData = await fastify.cache.get(key);

      if (cachedData) {
        reply.send(cachedData.item);
      } else {
        await fastify.axios
          .get("https://www.sondakika.com/finans/")
          .then((response) => {
            const html = response.data;
            const $ = cheerio.load(html);
            $("li[class=nws]", html).each(function () {
              const totalArray = $(this).text().trim().split("   ");
              const saat = totalArray[0];
              const baslik = totalArray[2];
              const aciklama = totalArray[3];

              finance.push({
                saat,
                baslik,
                aciklama,
              });
            });
            logger.logInfo(
              `${req.ip} den ilgili endpointe  ${req.url} erişim sağlandı. ${req.method} kullanıldı. ${req.user} kişisi işlem yaptı.`
            );
            // Cache
            fastify.cache.set(key, finance, fastify.config().ttl5m);
            reply.send(finance);
          });
      }
    }
  );

  // Teknoloji Haberleri
  fastify.get("/tech/:cache", { preValidation: jwtVerify, schema: schema.tech }, async (req, reply) => {
    tech.splice(0, tech.length);
    const key = fastify.removeFirstParameter(req.raw.url);
    let cachedData = await fastify.cache.get(key);

    if (cachedData) {
      reply.send(cachedData.item);
    } else {
      await fastify.axios
        .get("https://www.sondakika.com/teknoloji/")
        .then((response) => {
          const html = response.data;
          const $ = cheerio.load(html);
          $("li[class=nws]", html).each(function () {
            const totalArray = $(this).text().trim().split("   ");
            const saat = totalArray[0];
            const baslik = totalArray[2];
            const aciklama = totalArray[3];

            tech.push({
              saat,
              baslik,
              aciklama,
            });
          });
          logger.logInfo(
            `${req.ip} den ilgili endpointe  ${req.url} erişim sağlandı. ${req.method} kullanıldı. ${req.user} kişisi işlem yaptı.`
          );
          // Cache
          fastify.cache.set(key, tech, fastify.config().ttl5m);
          reply.send(tech);
        });
    }
  });

  // Kültür-Sanat Haberleri
  fastify.get(
    "/culture/:cache",
    { preValidation: jwtVerify, schema: schema.culture },
    async (req, reply) => {
      culture.splice(0, culture.length);
      const key = fastify.removeFirstParameter(req.raw.url);
      let cachedData = await fastify.cache.get(key);

      if (cachedData) {
        reply.send(cachedData.item);
      } else {
        await fastify.axios
          .get("https://www.sondakika.com/kultur-sanat/")
          .then((response) => {
            const html = response.data;
            const $ = cheerio.load(html);
            $("li[class=nws]", html).each(function () {
              const totalArray = $(this).text().trim().split("   ");
              const saat = totalArray[0];
              const baslik = totalArray[2];
              const aciklama = totalArray[3];

              culture.push({
                saat,
                baslik,
                aciklama,
              });
            });
            logger.logInfo(
              `${req.ip} den ilgili endpointe  ${req.url} erişim sağlandı. ${req.method} kullanıldı. ${req.user} kişisi işlem yaptı.`
            );
            // Cache
            fastify.cache.set(key, culture, fastify.config().ttl5m);
            reply.send(culture);
          });
      }
    }
  );

  // Sağlık Haberleri
  fastify.get(
    "/health/:cache",
    { preValidation: jwtVerify, schema: schema.health },
    async (req, reply) => {
      health.splice(0, health.length);
      const key = fastify.removeFirstParameter(req.raw.url);
      let cachedData = await fastify.cache.get(key);

      if (cachedData) {
        reply.send(cachedData.item);
      } else {
        await fastify.axios
          .get("https://www.sondakika.com/saglik/")
          .then((response) => {
            const html = response.data;
            const $ = cheerio.load(html);
            $("li[class=nws]", html).each(function () {
              const totalArray = $(this).text().trim().split("   ");
              const saat = totalArray[0];
              const baslik = totalArray[2];
              const aciklama = totalArray[3];

              health.push({
                saat,
                baslik,
                aciklama,
              });
            });
            logger.logInfo(
              `${req.ip} den ilgili endpointe  ${req.url} erişim sağlandı. ${req.method} kullanıldı. ${req.user} kişisi işlem yaptı.`
            );
            // Cache
            fastify.cache.set(key, health, fastify.config().ttl5m);
            reply.send(health);
          });
      }
    }
  );
};
