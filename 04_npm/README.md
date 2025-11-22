## Nodeプロジェクト初期化
```bash
npm init -y
```

## インストール
### dotenv, bcrypt, uuid
```bash
npm i dotenv bcrypt uuid
```

### Express
```bash
npm i express
npm i express-session
```

```bash
npm i -D nodemon
```

## 環境設定ファイル作成
- .env を作成

```env
NO="0000001"
NAME="東京 太郎"
HOST=localhost
PORT=3000
SESSION_SECRET=mySecretKey
```
