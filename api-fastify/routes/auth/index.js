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
  // LOGIN
  fastify.post("/login", { schema: schema.login }, async (req, reply) => {
    const email = req.body.email;
    const pass = req.body.password;
    const sql = `
      SELECT "id", "email", "password", "role", "created_at" AS "createdAt", "updated_at" AS "updatedAt", "version" FROM "user" AS "User" WHERE "User"."email" = $1 LIMIT 1;
    `;
    const binds = [email];
    const res = await fastify.simpleExecute(sql, binds);
    console.log("RES", res);
    // Token
    const id = res[0].id;
    const mail = res[0].email;
    const password = res[0].password;
    const role = res[0].role;
    const createdAt = res[0].createdAt;
    const updatedAt = res[0].updatedAt;
    const version = res[0].version;

    const payload = {
      id,
      mail,
      password,
      role,
      createdAt,
      updatedAt,
      version,
    };
    // console.log('PAYLOAD', payload);

    const currentUser = await fastify.jwt.sign(payload, {
      expiresIn: 60 * 60 * 24 * 6,
    }); // 6 Gün
    reply.send({currentUser});
    logger.logInfo(
      `${req.ip} den ilgili endpointe  ${req.url} erişim sağlandı. ${req.method} kullanıldı. ${req.user} kişisi işlem yaptı.`
    );
    req.log.info(req.body.email + " oturum açtı.");
  });

  // REGISTER
  fastify.post("/register", { schema: schema.register }, async (req, reply) => {
    const { email, password } = req.body;
    const date = new Date();
    const sql = `INSERT INTO "user" ("id","email","password","role","created_at","updated_at","version") VALUES (DEFAULT,$1,$2,$3,$4,$5,$6) RETURNING "id","email","password","role","created_at","updated_at","version";`;
    const binds = [email, password, "user", date, date, "0"];
    const res = await fastify.simpleExecute(sql, binds);
    // console.log("RES", res);
    logger.logInfo(
      `${req.ip} den ilgili endpointe  ${req.url} erişim sağlandı. ${req.method} kullanıldı. ${req.user} kişisi işlem yaptı.`
    );
    reply.send(res);
  });

  // CREATE USER => register ile farkı user rolünü verebilme. Admin için işe yarar.
  fastify.post(
    "/createUser",
    { schema: schema.createUser },
    async (req, reply) => {
      const { email, password, role } = req.body;
      const date = new Date();
      const sql = `INSERT INTO "user" ("id","email","password","role","created_at","updated_at","version") VALUES (DEFAULT,$1,$2,$3,$4,$5,$6) RETURNING "id","email","password","role","created_at","updated_at","version";`;
      const binds = [email, password, role, date, date, "0"];
      const res = await fastify.simpleExecute(sql, binds);
      // console.log("RES", res);
      logger.logInfo(
        `${req.ip} den ilgili endpointe  ${req.url} erişim sağlandı. ${req.method} kullanıldı. ${req.user} kişisi işlem yaptı.`
      );
      reply.send(res);
    }
  );
};
