# Lucky List 🎲

一個基於 Svelte 5 + SvelteKit 的隨機選擇器應用程式。使用者可以建立清單，加入多個項目，點擊按鈕隨機選擇其中一項，並且記錄選取項目的歷程。

## 功能特色

- 📋 **清單管理**：建立、編輯、刪除清單
- 📝 **項目管理**：在清單中新增、編輯、刪除項目
- ⚖️ **權重設定**：為每個項目設定權重，影響被選中的機率
- 🎲 **隨機選擇**：具有動畫效果的隨機抽選功能
- 📜 **歷程記錄**：記錄每次選擇的結果和時間

## 技術棧

- **前端框架**：Svelte 5 + SvelteKit (SSR)
- **樣式**：Tailwind CSS 4
- **資料庫**：MariaDB / MySQL
- **語言**：TypeScript

## 安裝步驟

### 1. 安裝依賴

```sh
npm install
```

### 2. 設定環境變數

複製 `.env.example` 為 `.env` 並填入你的資料庫設定：

```sh
cp .env.example .env
```

編輯 `.env` 檔案：

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=lucky_list
```

### 3. 建立資料庫

在 MariaDB / MySQL 中建立資料庫：

```sql
CREATE DATABASE lucky_list CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 4. 啟動開發伺服器

```sh
npm run dev
```

### 5. 初始化資料表

開啟瀏覽器訪問 http://localhost:5173，點擊頁面上的「初始化資料庫」連結來建立所需的資料表。

## 開發指令

```sh
# 啟動開發伺服器
npm run dev

# 在新瀏覽器分頁開啟
npm run dev -- --open

# 型別檢查
npm run check

# 格式化程式碼
npm run format
```

## 建置部署

```sh
npm run build
npm run preview
```

## API 端點

| 方法 | 端點 | 說明 |
|------|------|------|
| GET | `/api/lists` | 取得所有清單 |
| POST | `/api/lists` | 建立新清單 |
| GET | `/api/lists/:id` | 取得單一清單 |
| PUT | `/api/lists/:id` | 更新清單 |
| DELETE | `/api/lists/:id` | 刪除清單 |
| GET | `/api/lists/:id/items` | 取得清單項目 |
| POST | `/api/lists/:id/items` | 新增項目 |
| PUT | `/api/lists/:id/items/:itemId` | 更新項目 |
| DELETE | `/api/lists/:id/items/:itemId` | 刪除項目 |
| POST | `/api/lists/:id/select` | 隨機選擇 |
| GET | `/api/lists/:id/select` | 取得選擇歷程 |
| POST | `/api/init` | 初始化資料庫 |

## 授權

MIT License
