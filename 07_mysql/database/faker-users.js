import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';

// __dirname を使えるようにする（ESM対策）
const __filename = path.resolve();
const __dirname = path.dirname(__filename);

const sqlDir = path.join(__dirname);
const sqlFile = 'insert_users.sql';
const sqlFilePath = path.join(sqlDir, sqlFile);

const password = await bcrypt.hash("pass1234", 12);

// SQLエスケープ（超重要）
const escapeSQL = (str) => {
    return str.replace(/'/g, "''");
};

// 1ユーザー生成
const createUser = (index) => {
    const name = escapeSQL(faker.person.fullName());
    const email = `user${index}@test.com`;
    const avatar_url = `/images/users/${index}.png`;

    return { name, email, password, avatar_url };
};

// 複数ユーザー生成
const createUsers = (num) => {
    const users = [];
    for (let i = 1; i <= num; i++) {
        users.push(createUser(i));
    }
    return users;
};

// INSERT SQL を作成
const createInsertSQL = (users) => {
    const values = users.map(u =>
        `('${u.name}', '${u.email}', '${u.password}', '${u.avatar_url}')`
    ).join(",\n");

    return `INSERT INTO users (name, email, password, avatar_url)\nVALUES\n${values};\n`;
};

// 書き出し処理
const writeSQLFile = (sql) => {
    // フォルダ作成
    if (!fs.existsSync(sqlDir)) {
        fs.mkdirSync(sqlDir, { recursive: true });
    }

    fs.writeFileSync(sqlFilePath, sql, 'utf-8');
    console.log(`✔ SQLを書き出しました: ${sqlFilePath}`);
};

// 実行
const users = createUsers(50);
const sql = createInsertSQL(users);
writeSQLFile(sql);