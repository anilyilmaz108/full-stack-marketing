# Marketing

It is a Full-Stack Web application developed using Angular and Nodejs. Incoming data changes daily in the form of liveapi, and the requested data is kept in PostgreSQL DB and Cache.

Conrainer was used and removed with Redis -> Docker. During the login process, personal data that comply with the validation procedures are kept with encryption in local storage. In this way, as long as you do not log out, you can operate from the page you left off when you close or refresh the site.

It is an Open-Source project. You can click on the [Swagger](http://localhost:8000/swagger/) documentation to perform Api tests.

Support was received from Gemini AI as Chatbot in the project. You can find answers to your questions in the chatbot section.

> [!NOTE]
> It was produced as Angular version 17 and Node version 20.

## Technologies

1. Angular
2. Nodejs
3. PostgreSQL
4. Docker
5. Redis
6. Swagger
7. Angular Material
8. Tailwind CSS
9. Flowbite
10. Express
11. Axios
12. Apex Charts
13. Cryptojs
14. RxJS
15. Orm - Sequelize
16. Nodemailer
17. Cors
18. Gemini AI
19. Winston Logging

##  Installing the Module

->  [Redis-Cli](https://redis.io/) needs to be installed on your computer.

-> [Docker](https://www.docker.com/products/docker-desktop/) needs to be installed on your computer.

> [!NOTE]
> The Redis file was created with [Bitnami Redis](https://hub.docker.com/r/bitnami/redis).

-> Create a Dockerfile file and write it into it as in the example.
```shell
FROM node:20
WORKDIR /app
COPY api /app
RUN npm install
CMD node index.js
EXPOSE 8000
```

> To run Redis with Docker, run the following steps from the terminal. (The port section is set to 8001 in this project. You can also write 6379 as the default. If you want to write another value, specify it in the Cors section.)

```shell
docker run --name liveapiredis -p 8001:6379 -d redis
```

```shell
docker-compose -f docker-compose.yml up
```

-> [PostgreSQL](https://www.postgresql.org/) needs to be installed on your computer.

-> Run this command to create Swagger documentation.

```shell
node swagger.js
```

-> Run this command for Nodejs.
```shell
node index.js
```

> [!NOTE]
> When you download the project, uncomment the //db.createTables() section once in the index.js in the api folder. Then comment again. This command will automatically create a PostgreSQL database.


-> Angular Project runs on localhost:4200 port. To make it work:

```shell
ng s
```

> [!NOTE]
> Api Key, Token, Mail and DB information are in the .env file and are not available on GitHub.



## Feedback

If you have any feedback, please contact us at anilyilmaz108@gmail.com.



