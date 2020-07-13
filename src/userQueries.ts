import { sql } from './sql';
import {compare, hash} from 'bcrypt';
import { User } from './models/user';


export async function getUsers(): Promise<User> {
    const [users] = await sql.execute('SELECT * FROM users');
    return users;
}

export async function getSpecificUser(userId: number | null): Promise<User> {
    const [[users]] = await sql.execute('SELECT * FROM users WHERE ID = ?', [userId]);
    return users;
}

export async function checkUserExists(userName: string): Promise<boolean> {
    const [users] = await sql.execute('SELECT ID FROM users WHERE userName = ?', [userName]);
    return users.length > 0;
}

export async function register(firstName: string, lastName: string, username: string, password: string, isAdmin:boolean): Promise<number | null> {
    const [users] = await sql.execute('SELECT id FROM users WHERE username = ?', [username]);
    if (users.length > 0) {
        return null;
    }

    const hashedPassword = await hash(password, 10);
    console.log({hashedPassword})
    const [{insertId: userId}] = await sql.execute('INSERT INTO users (firstName, lastName, username, password, isAdmin) VALUES (?, ?, ?, ?, ?)', [firstName, lastName, username, hashedPassword, isAdmin]);
    console.log({userId})
    return userId;
}

export async function login(username: string, password: string): Promise<number | null> {
    const [users] = await sql.execute('SELECT id, password FROM users WHERE username = ?', [username]);
    if (users.length === 0) {
        return null;
    }
    
    const {id, password: hashedPasswordInDb} = users[0];
    console.log({id, password})
    const isPasswordCorrect = await compare(password, hashedPasswordInDb);
    if (!isPasswordCorrect) {
        return null;
    }
    return id;    
}