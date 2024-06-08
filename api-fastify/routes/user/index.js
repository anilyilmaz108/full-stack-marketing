"use strict";
/**
 * @param {import("fastify").FastifyInstance} fastify
 * @param {*} opts
 */

const schema = require("./schema");
const nodemailer = require("nodemailer");
// Winston ile Loglama
const MyLogger = require('../../logs/logger');
const logger = new MyLogger();
module.exports = async (fastify, opts) => {
  const jwtVerify = [fastify.authCommon /**/];
  // Tüm User Verileri
  fastify.get(
    "/getAllUser",
    { preValidation: jwtVerify, schema: schema.getAllUser },
    async (req, reply) => {
      const sql = `SELECT "id", "email", "password", "role", "created_at" AS "createdAt", "updated_at" AS "updatedAt", "version" FROM "user" AS "User";`;
      const res = await fastify.simpleExecute(sql);
      logger.logInfo(
        `${req.ip} den ilgili endpointe  ${req.url} erişim sağlandı. ${req.method} kullanıldı. ${req.user} kişisi işlem yaptı.`
      );
      // console.log("RES", res);

      reply.send(res);
    }
  );

  // ID'ye göre User Verisi
  fastify.get(
    "/getUserById/:userId",
    { preValidation: jwtVerify, schema: schema.getUserById },
    async (req, reply) => {
      const { userId } = req.params;
      const sql = `SELECT "id", "email", "password", "role", "created_at" AS "createdAt", "updated_at" AS "updatedAt", "version" FROM "user" AS "User" WHERE "User"."id" = $1;`;
      const binds = [userId];
      const res = await fastify.simpleExecute(sql, binds);
      // console.log("RES", res);
      logger.logInfo(
        `${req.ip} den ilgili endpointe  ${req.url} erişim sağlandı. ${req.method} kullanıldı. ${req.user} kişisi işlem yaptı.`
      );
      reply.send(res);
    }
  );

  // ID'ye göre User Silme
  fastify.delete(
    "/deleteUser/:userId",
    { preValidation: jwtVerify, schema: schema.deleteUser },
    async (req, reply) => {
      const { userId } = req.params;
      const sql = `DELETE FROM "user" WHERE "id" = $1 AND "version" = 0`;
      const binds = [userId];
      const res = await fastify.simpleExecute(sql, binds);
      // console.log("RES", res);
      logger.logInfo(
        `${req.ip} den ilgili endpointe  ${req.url} erişim sağlandı. ${req.method} kullanıldı. ${req.user} kişisi işlem yaptı.`
      );
      reply.send(res);
    }
  );

  // User Güncelleme
  fastify.put("/updateUser/:userId", { preValidation: jwtVerify, schema: schema.updateUser }, async (req, reply) => {
    const { userId } = req.params;
    const { email, password } = req.body;
    const date = new Date();
    const sql = `UPDATE "user" SET "email"=$1,"password"=$2,"updated_at"=$3 WHERE "id" = $4;`;
    const binds = [email, password, date, userId];
    const res = await fastify.simpleExecute(sql, binds);

    const updatedSql = `SELECT "id", "email", "password", "role", "created_at" AS "createdAt", "updated_at" AS "updatedAt", "version" FROM "user" AS "User" WHERE "User"."id" = $1;`;
    const updatedbinds = [userId];
    const updatedRes = await fastify.simpleExecute(updatedSql, updatedbinds);
    // console.log("RES", updatedRes);
    logger.logInfo(
      `${req.ip} den ilgili endpointe  ${req.url} erişim sağlandı. ${req.method} kullanıldı. ${req.user} kişisi işlem yaptı.`
    );
    reply.send(updatedRes);
  });

  // User'a Mail Gönderme
  fastify.post('/sendmail' /**/, { preValidation: jwtVerify, schema: schema.sendmail /**/ }, async (req, reply) => {
    // console.log(req.body);
  
    console.log("request came");
    let user = req.body;
    sendMail(user, info => {
      console.log(`The mail has beed send 😃 and the id is ${info.messageId}`);
      logger.logInfo(
        `${req.ip} den ilgili endpointe  ${req.url} erişim sağlandı. ${req.method} kullanıldı. ${req.user} kişisi işlem yaptı.`
      );
      reply.send(info);
    });
  });
  
  async function sendMail(user, callback) {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      //host: "smtp.gmail.com",
      //port: 587,
      //secure: false, // true for 465, false for other ports
      service: "gmail",
      auth: {
        user: `${process.env.MAILUSER}`,
        pass: `${process.env.MAILPASS}`,
      },
    });
  
    let mailOptions = {
      from: user.email, // sender address
      to: `"Developer"<${process.env.TOMAIL}>`, // list of receivers
      subject: user.subject, // Subject line
      html: `<h1>${user.name} tarafından gönderildi.</h1><br>
      <h4>${user.message}</h4>`,
    };
  
    // send mail with defined transport object
    let info = await transporter.sendMail(mailOptions);
  
    callback(info);
  }
};
