// @ts-ignore
import * as mysql from 'mysql2/promise';

export const sql = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '12345eli',
    database: 'vacationtable'
});
