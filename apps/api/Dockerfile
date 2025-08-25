FROM node:20-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate && pnpm install --prod=false
COPY . .
RUN pnpm run build
EXPOSE 3001
CMD ["node","dist/core/server.js"]
