FROM oven/bun:1 AS deps
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

FROM oven/bun:1 AS runner
ENV NODE_ENV=production
WORKDIR /app
RUN groupadd -r appgroup && useradd -r -g appgroup appuser
USER appuser
COPY --from=deps /app/node_modules ./node_modules
COPY src ./src
COPY package.json tsconfig.json ./
EXPOSE 3000
CMD ["bun", "src/server.ts"]
