"use strict";
const fp = require("fastify-plugin").default;

module.exports = fp(async (fastify, opts) => {
  const Pool = require("pg").Pool;
  const pool = new Pool(fastify.config().pool);

  // BASIC EXECUTE
  fastify.decorate("simpleExecute", async (sql, binds) => {
    let connection;
    try {
      connection = await pool.connect();
      const data = await connection.query(sql, binds);
      return data.rows;
    } catch (err) {
      console.log("PG: ", err);
      return err;
    } finally {
      if (connection) await connection.end();
    }
  });

    //  SELECT (Advanced with Binds)
    fastify.decorate('select', async (cache, key, ttl, sql, binds) => {
      // Parametre Kontrolü
      // console.log('Cache Parameter:', cache + ' ' + key + ' ' + ttl);
      if (cache !== 'true' && cache !== 'false') {
        return { err7: 'NoCacheParameter' };
      }
      let connection;
      // Cache'e baksın. Yoksa çektiği datayla oluştursun.
      if (cache === 'true') {
        let cachedData = await fastify.cache.get(key);
        if (cachedData) {
          return cachedData.item;
        } else {
          try {
            connection = await pool.connect();
            const data = await connection.query(sql, binds);
            fastify.cache.set(key, data.rows, ttl);
            // console.log(data);
            // oracledb.getPool()._logStats(); // show pool statistics.  _enableStats must be true
            // Data
            return data.rows;
          } catch (err) {
            console.log('PG: ', err);
            return err;
          } finally {
            if (connection) await connection.end();
          }
        }
      }
      // Cache'e Bakmasın. Direkt DB'ye gitsin ve varsa cachedData'yı temizlesin. (Hard Refresh)
      if (cache === 'false') {
        try {
          connection = await pool.connect();
          const data = await connection.query(sql, binds);
          // Varsa Cache Temizlensin
          fastify.cache.delete(key);
          // Data
          return data.rows;
        } catch (err) {
          console.log('PG: ', err);
          return err;
        } finally {
          if (connection) await connection.end();
        }
      }
    });

});
