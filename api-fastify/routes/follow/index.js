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
  // User için Takip Edilen Hisse
  fastify.post(
    "/createFollow",
    { preValidation: jwtVerify, schema: schema.createFollow },
    async (req, reply) => {
      const { user, shareSymbol } = req.body;
      const date = new Date();
      const sql = `INSERT INTO "follow" ("id","user","hisse","created_at","updated_at","version") VALUES (DEFAULT,$1,$2,$3,$4,$5) RETURNING "id","user","hisse","created_at","updated_at","version";`;
      const binds = [user, shareSymbol, date, date, "0"];
      const res = await fastify.simpleExecute(sql, binds);
      console.log("RES", res);
      logger.logInfo(
        `${req.ip} den ilgili endpointe  ${req.url} erişim sağlandı. ${req.method} kullanıldı. ${req.user} kişisi işlem yaptı.`
      );
      reply.send(res);
    }
  );

  // ID'ye göre Takip Hissesi Silme
  fastify.delete(
    "/deleteFollow/:userId/:shareSymbol",
    { preValidation: jwtVerify, schema: schema.deleteFollow },
    async (req, reply) => {
      const { userId, shareSymbol } = req.params;
      const sql = `DELETE FROM "follow" WHERE "user" = $1 AND "hisse" = $2;`;
      const binds = [userId, shareSymbol];
      const res = await fastify.simpleExecute(sql, binds);
      // console.log("RES", res);
      logger.logInfo(
        `${req.ip} den ilgili endpointe  ${req.url} erişim sağlandı. ${req.method} kullanıldı. ${req.user} kişisi işlem yaptı.`
      );
      reply.send(res);
    }
  );

  // User'ın Takip Ettiği Hisseler
  fastify.get(
    "/getFollow/:userId",
    { preValidation: jwtVerify, schema: schema.getFollow },
    async (req, reply) => {
      const { userId } = req.params;
      const sql = `SELECT "id", "user", "hisse", "created_at" AS "createdAt", "updated_at" AS "updatedAt", "version" FROM "follow" AS "Follow" WHERE "Follow"."user" = $1;`;
      const binds = [userId];
      const res = await fastify.simpleExecute(sql,binds);
      // console.log("RES", res.length);
      let jsonAllData = [];
      for (let index = 0; index < res.length; index++) {
        const element = res[index].hisse;
        const sql1 = `SELECT "id", "hisse", "son_fiyat" AS "sonFiyat", "satis_fiyat" AS "satisFiyat", "fiyat", "dusuk_fiyat" AS "dusukFiyat", "ortalama", "yuzde", "dun_kapanis" AS "dunKapanis", "fark", "taban", "tavan", "hacim_lot" AS "hacimLot", "hacim", "saat", "created_at" AS "createdAt", "updated_at" AS "updatedAt", "version" FROM "share" AS "Share" WHERE "Share"."hisse" = $1;`;
        const binds1 = [element];
        const follows = await fastify.simpleExecute(sql1,binds1);

        let x = {
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
        console.log(x);
        jsonAllData.push(x);
      }
      logger.logInfo(
        `${req.ip} den ilgili endpointe  ${req.url} erişim sağlandı. ${req.method} kullanıldı. ${req.user} kişisi işlem yaptı.`
      );
      reply.send(jsonAllData);
    }
  );

};
