
export const list = async (req, res) => {
    const endpoint = '/user/list';
    const limit = 20;
    // SQL 文
    const sql = `SELECT * FROM users LIMIT ?;`;
    // SQL 実行
    const [users] = await pool.query(sql, [limit]);
    // 実行した  SQL 文
    const formattedSql = pool.format(sql, [limit]);
    // 結果返却 JSON
    const result = { users, sql: formattedSql, endpoint };
    res.json(result);
}

export const find = async (req, res) => {
    const endpoint = '/user/:id/find';
    const id = req.params.id;
    const sql = `SELECT * FROM users WHERE id = ?;`;
    const [user] = await pool.query(sql, [id]);
    const formattedSql = pool.format(sql, [id]);
    const result = { user, sql: formattedSql, endpoint };
    res.json(result);
}

export const update = async (req, res) => {
    const { name, email } = req.body;
    // avatar
    const avatar = req.file ? req.file.filename : null;
    let avatar_url = null;
    // avatar upload
    if (avatar) {
        avatar_url = `/images/users/${avatar}`;
        const avatar_path = path.join(__dirname, '../public/images/users/', avatar);
        const avatar_data = fs.readFileSync(avatar_path);
        const avatar_buffer = Buffer.from(avatar_data);
        // アバター画像をストリームに変換
        const avatar_stream = new ReadableStream({
            start(controller) {
                controller.enqueue(avatar_buffer);
                controller.close();
            },
        });
        const avatar_file = {
            filename: avatar,
            data: avatar_stream,
        };
        const avatar_result = await uploadFile(avatar_file);
        console.log('Avatar Upload Result:', avatar_result);
    }

    const endpoint = '/user/:id/update';
    // ID 取得
    const id = req.params.id;
    // SQL 文
    const sql = `UPDATE users 
                SET name = ?, email = ?, avatar_url = ? 
                WHERE id = ?`;
    // SQL 実行
    const [rows] = await pool.query(sql, [name, email, avatar_url, id]);
    const user = rows[0];

    // 実行した SQL 文
    const formattedSql = pool.format(sql, [name, email, avatar_url, id]);
    // 結果返却 JSON
    const result = { user, sql: formattedSql, endpoint };
    res.json(result);
}

export const login = async (req, res) => {
    const { email, password } = req.body;

    const endpoint = '/login';
    const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';
    // SQL 実行
    const [rows] = await pool.query(sql, [email, password]);
    const authUser = rows.length > 0 ? rows[0] : null;
    // 実行した SQL 文  
    const formattedSql = pool.format(sql, [email, password]);
    // 結果返却 JSON
    const result = { authUser, sql: formattedSql, endpoint };
    res.json(result);
}