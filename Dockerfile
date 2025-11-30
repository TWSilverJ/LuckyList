# =====================
# 階段 1: 建置階段
# =====================
FROM node:22-alpine AS builder

WORKDIR /app

# 複製 package 檔案
COPY package*.json ./

# 安裝所有依賴（包含 devDependencies）
RUN npm ci

# 複製原始碼
COPY . .

# 建置應用程式
RUN npm run build

# 移除 devDependencies，只保留 production 依賴
RUN npm prune --production

# =====================
# 階段 2: 執行階段
# =====================
FROM node:22-alpine AS runner

WORKDIR /app

# 設定環境變數
ENV NODE_ENV=production
ENV PORT=3000

# 建立非 root 使用者
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 sveltekit

# 從建置階段複製必要檔案
COPY --from=builder --chown=sveltekit:nodejs /app/build ./build
COPY --from=builder --chown=sveltekit:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=sveltekit:nodejs /app/package.json ./

# 切換到非 root 使用者
USER sveltekit

# 暴露連接埠
EXPOSE 3000

# 啟動應用程式
CMD ["node", "build"]
