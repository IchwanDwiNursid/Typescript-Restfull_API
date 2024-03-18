FROM node:18-alpine

EXPOSE 3000

ENV DATABASE_URL="mysql://root:iwan@localhost:3306/belajar_typescript_restful_api"

WORKDIR /app

COPY package*.json .

COPY . .

RUN npm install

RUN npm run build

CMD ["npm", "run", "start"]
