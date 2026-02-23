FROM node:24-alpine

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./

RUN corepack enable && corepack prepare pnpm@latest

RUN pnpm install

COPY . .

EXPOSE 3000

CMD ["pnpm", "dev"]