FROM node:20 AS builder

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./

RUN pnpm i --frozen-lockfile

COPY . .

RUN npx prisma generate && pnpm build


FROM node:20

WORKDIR /app

COPY --from=builder /app ./

EXPOSE 3000

CMD ["pnpm", "start"]
