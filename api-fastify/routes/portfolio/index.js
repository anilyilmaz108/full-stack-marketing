"use strict";
/**
 * @param {import("fastify").FastifyInstance} fastify
 * @param {*} opts
 */

const schema = require("./schema");
// Winston ile Loglama
const MyLogger = require('../../logs/logger');
const logger = new MyLogger();

module.exports = async (fastify, opts) => {
  const jwtVerify = [fastify.authCommon /**/];
  // User için Portfolio Oluşturma
  fastify.post(
    "/createPortfolio/:cache",
    { preValidation: jwtVerify, schema: schema.createPortfolio },
    async (req, reply) => {
    const { user, euro, dolar, altin, hisse, lira, hisseLot } = req.body;
    const date = new Date();
      const sql = `INSERT INTO "portfolio" ("id","user","dolar","euro","altin","hisse","lira","hisse_lot","created_at","updated_at","version") VALUES (DEFAULT,$1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING "id","user","dolar","euro","altin","hisse","lira","hisse_lot","created_at","updated_at","version";`;
      const binds = [user, dolar, euro, altin, hisse, lira, hisseLot, date, date, "0"];
      const res = await fastify.select(
        req.params.cache,
        fastify.removeFirstParameter(req.raw.url),
        fastify.config().ttl5m /*5m*/,
        sql,
        binds
      );      
      logger.logInfo(
        `${req.ip} den ilgili endpointe  ${req.url} erişim sağlandı. ${req.method} kullanıldı. ${req.user} kişisi işlem yaptı.`
      );
      reply.send(res);
    }
  );

    // User'ın Portfoliosu
    fastify.get(
        "/getPortfolio/:cache/:userId",
        { preValidation: jwtVerify, schema: schema.getPortfolio },
        async (req, reply) => {
          const { userId } = req.params;
          const sql = `SELECT "id", "user", "dolar", "euro", "altin", "hisse", "lira", "hisse_lot" AS "hisseLot", "created_at" AS "createdAt", "updated_at" AS "updatedAt", "version" FROM "portfolio" AS "Portfolio" WHERE "Portfolio"."user" = $1 LIMIT 1;`;
          const binds = [userId];
          const res = await fastify.select(
            req.params.cache,
            fastify.removeFirstParameter(req.raw.url),
            fastify.config().ttl5m /*5m*/,
            sql,
            binds
          );
          // console.log("RES", res);
          logger.logInfo(
            `${req.ip} den ilgili endpointe  ${req.url} erişim sağlandı. ${req.method} kullanıldı. ${req.user} kişisi işlem yaptı.`
          );
          reply.send(res);
        }
      );

  // ID'ye göre User'ın Portfoliosunu Silme
  fastify.delete(
    "/deletePortfolio/:user",
    { preValidation: jwtVerify, schema: schema.deleteFollow },
    async (req, reply) => {
      const { user } = req.params;
      // Cache'de veri varsa temizlensin
      fastify.cache.delete('.portfolio.createPortfolio');

      const sql = `DELETE FROM "portfolio" WHERE "user" = $1 AND "version" = 0`;
      const binds = [user];
      const res = await fastify.simpleExecute(sql, binds);
      // console.log("RES", res);
      logger.logInfo(
        `${req.ip} den ilgili endpointe  ${req.url} erişim sağlandı. ${req.method} kullanıldı. ${req.user} kişisi işlem yaptı.`
      );
      reply.send(res);
    }
  );

    // User'ın Portfoliosunu Güncelleme
    fastify.put("/updatePortfolio/:cache/:user", { preValidation: jwtVerify, schema: schema.updatePortfolio }, async (req, reply) => {
        const { userId } = req.params;
        const { user, euro, dolar, altin, hisse, lira, hisseLot } = req.body;
        const date = new Date();
        fastify.cache.delete('.portfolio.getPortfolio.1');

        const sql = `UPDATE "portfolio" SET "euro"=$1,"dolar"=$2,"altin"=$3,"hisse"=$4,"lira"=$5,"hisse_lot"=$6,"updated_at"=$7 WHERE "user" = $8`;
        const binds = [euro, dolar, altin, hisse, lira, hisseLot, date, user];
        const res = await fastify.simpleExecute(sql, binds);
    
        const updatedSql = `SELECT "id", "user", "dolar", "euro", "altin", "hisse", "lira", "hisse_lot" AS "hisseLot", "created_at" AS "createdAt", "updated_at" AS "updatedAt", "version" FROM "portfolio" AS "Portfolio" WHERE "Portfolio"."user" = $1 LIMIT 1;`;
        const updatedbinds = [user];
        const updatedRes = await fastify.select(
            req.params.cache,
            fastify.removeFirstParameter(req.raw.url),
            fastify.config().ttl5m /*5m*/,
            updatedSql,
            updatedbinds
          );
        //console.log('UP', updatedRes);
        logger.logInfo(
          `${req.ip} den ilgili endpointe  ${req.url} erişim sağlandı. ${req.method} kullanıldı. ${req.user} kişisi işlem yaptı.`
        );
        reply.send(updatedRes[0]);
      });

}