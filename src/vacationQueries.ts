import { sql } from './sql';
import { Vacation } from './models/vacation';



export async function addVacation(description: string, destination: string, picture: string, departure: string, returnAt: string, price: number): Promise<number> {
    const [{ insertId }] = await sql.execute('INSERT INTO vacations (description, destination, picture, departure, returnAt, price, followersAmount) VALUES (?, ?, ?, ?, ?, ?, 0)', [description, destination, picture, departure, returnAt, price]);
    return insertId;
}


export async function getVacations(): Promise<Vacation[]> {
    const [vacations] = await sql.execute('SELECT * FROM vacations');
    return vacations;
}

export async function getSpecificVacation(vacationId: number): Promise<Vacation[]> {
    const [vacation] = await sql.execute('SELECT * FROM vacations WHERE ID = ?', [vacationId]);
    return vacation;
}

export async function getFavoriteVacations(userId: number): Promise<Vacation[]> {
    const [vacation] = await sql.execute('SELECT vacation FROM users_vacations WHERE userId = ?', [userId]);
    return vacation;
}

export async function getFollowedVacationsOfUser(userId: number): Promise<Vacation[]> {
    const [vacation] = await sql.execute('SELECT vacationId, isFollow FROM users_vacations WHERE userId = ?', [userId]);
    return vacation;
}

export async function isUserFollowingVacation(userId: number, vacationId: number): Promise<boolean> {
    const [vacations] = await sql.execute('SELECT 1 FROM users_vacations WHERE userId = ? AND vacationId = ?', [userId, vacationId]);
    return vacations.length > 0;
}

export async function updateVacation(vacationId: number, updateObj: any): Promise<number> {
    console.log({ updateObj });
    const updateStr = Object.keys(updateObj).map(key => `${key} = ?`).join(','); // "returnAt = ?, description = ?"
    console.log({ updateStr })
    const [res] = await sql.execute<any>(`UPDATE vacations SET ${updateStr} WHERE ID = ?`, [...Object.values(updateObj), vacationId]);
    console.log(res.affectedRows)
    return res.affectedRows;
}

const updateObj = { returnAt: new Date(), description: 'hey' }

const updateStr = Object.keys(updateObj).map(key => `${key} = ?`).join(','); // "returnAt = ?, description = ?"

//`UPDATE vacations SET ${updateStr} WHERE ID = ?`, [vacationId, ...Object.values(updateObj)];


export async function followVacation(userId: number, vacationId: number): Promise<any> {
    const [result] = await sql.execute('INSERT INTO users_vacations (userId, vacationId, isFollow) VALUES (?, ?, 1)', [userId, vacationId]);
    return result;
}

export async function unfollowVacation(userId: number, vacationId: number): Promise<any> {
    const [result] = await sql.execute('DELETE FROM users_vacations WHERE userId = ? AND vacationId = ?', [userId, vacationId]);
    return result.affectedRows > 0;
}

export async function deleteVacation(vacationId: number): Promise<boolean> {
    const [{ affectedRows }] = await sql.execute('DELETE FROM vacations WHERE ID = ?', [vacationId])
    console.log({ affectedRows })
    return affectedRows > 0
}

export async function deleteVacationIdFromUsers_Vacations(vacationId: number): Promise<boolean> {
    const [{ affectedRows }] = await sql.execute('DELETE FROM users_vacations WHERE vacationId = ?', [vacationId])
    console.log({ affectedRows })
    return affectedRows > 0
}

export async function increaseFollowersAmount(vacationId: number): Promise<boolean> {
    const [{ affectedRows }] = await sql.execute('UPDATE vacations SET followersAmount = followersAmount + 1 WHERE ID = ?', [vacationId])
    console.log({ affectedRows })
    return affectedRows > 0;
}

export async function decreaseFollowersAmount(vacationId: number): Promise<boolean> {
    const [{ affectedRows }] = await sql.execute('UPDATE vacations SET followersAmount = followersAmount - 1 WHERE ID = ?', [vacationId])
    return affectedRows > 0;
}

export async function getFollowedVacationsOfUserInOrder(userId: number): Promise<Vacation[]> {
    const [vacation] = await sql.execute('SELECT ID, description, destination, picture, departure, returnAt, price, IF(userId > 0, true, false) as isFollowing from vacations left join users_vacations on vacations.ID = users_vacations.vacationId AND userId = ? ORDER BY isFollowing DESC', [userId]);
    return vacation;
}

export async function getDestinationNamesForChart(): Promise<Vacation[]> {
    const [vacations] = await sql.execute('SELECT destination FROM vacations WHERE followersAmount > 0');
    return vacations;
}

export async function getFollowersAmountForChart(): Promise<any> {
    const [numOfFollowers] = await sql.execute('SELECT followersAmount FROM vacations WHERE followersAmount > 0 ');
    return numOfFollowers;
}

