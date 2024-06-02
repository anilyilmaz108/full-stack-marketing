const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "Live Api",
    description:
      "Angular, Nodejs, PostgreSQL, Docker, Redis, Gemini AI, Firebase kullanılarak yapılan Full-Stack bir projenin Swagger dökümantasyon sayfasıdır. Veriler LiveApi şeklinde günlük olarak değişmekte olup istenilen veriler DB ve Cache içinde tutulur. Conrainer kullanılmış olup, Redis -> Docker ile kaldırılmıştır. Backend Nodejs ile Frontend Angular ile yazılmıştır. Sunucu tarafında Firebase Hosting kullanılmıştır.",
    contact: {
        email: "anilyilmaz108@gmail.com",
    }
  },
  host: "localhost:8000",
  schemes: ["http"],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./index.js"];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  require("./index.js");
});
