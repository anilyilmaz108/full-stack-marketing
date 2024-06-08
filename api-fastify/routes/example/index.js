"use strict";

const fastify = require("fastify");

const schema = require("./schema");
/**
 * @param {import("fastify").FastifyInstance} fastify
 * @param {*} opts
 */

module.exports = async (fastify, opts) => {
  const jwtVerify = [fastify.authCommon /**/];
  fastify.get(
    "/select/:cache/:id" /**/,
    { preValidation: jwtVerify, schema: schema.getWithCache /**/ },
    async (req, reply) => {
      const sql /**/ = `
        SELECT "id", "user", "dolar", "euro", "altin", "hisse", "lira", "hisse_lot" AS "hisseLot", "created_at" AS "createdAt", "updated_at" AS "updatedAt", "version" FROM "portfolio" AS "Portfolio" WHERE "Portfolio"."user" = '${req.params.id}' LIMIT 1;
        `;
      const data = await fastify.advancedSelect(
        req.params.cache,
        fastify.removeFirstParameter(req.raw.url),
        fastify.config().ttlDefault /**/,
        sql
      );
      reply.send(data);
    }
  );
};
