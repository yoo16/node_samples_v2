
## モジュールインストール
### dependencies
```bash
npm i dotenv 
npm i express
```

### DevDependencies
```bash
npm i -D nodemon
```

## package.json修正
### 起動スクリプト
```json
"scripts": {
  "dev": "nodemon server.js"
},
```

### モジュール方式(ESM)
-  "type": "module", を追加

```json
{
  "name": "xxxxxxx",
  ...
  "type": "module",
  "scripts": {
    ...
  },
  ...
}
```


## サーバ起動
```bash
npm run dev
```

## cURLコマンド
### POST

```bash
curl -X POST http://localhost:3000/save \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Yoo\",\"age\":25}"
```