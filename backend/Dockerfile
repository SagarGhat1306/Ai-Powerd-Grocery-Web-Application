FROM node:22

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5000

# Triggers your package.json start script (which runs nodemon server.js)
CMD ["npm", "start"]