FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=4000

RUN addgroup --system --gid 1001 nestjs \
  && adduser --system --uid 1001 nestjs

# Full node_modules (incl. devDependencies) copied straight from the builder
# stage rather than reinstalled with --omit=dev: this keeps the `prisma`
# CLI available at runtime so the container can apply pending migrations
# against the production database on every start, without a separate
# manual migration step.
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma
COPY --from=builder --chown=nestjs:nestjs /app/dist ./dist

USER nestjs
EXPOSE 4000

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]
