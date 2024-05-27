FROM node:20
WORKDIR /app
COPY api /app
RUN npm install
CMD node index.js
EXPOSE 8000
