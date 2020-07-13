import { SECRET } from "./secret";
import express from "express";
import jwt from "jsonwebtoken";
import { checkUserExists, register, login, getUsers, getSpecificUser } from '../userQueries';
import { registerSchema } from '../schemas/register';
import { loginSchema } from '../schemas/login';

const router = express.Router();

router.post('/register', async (req, res) => {
    const { firstName, lastName, userName, password } = req.body;
    console.log({ firstName, lastName, userName, password })
    const { error } = registerSchema.validate({ firstName, lastName, userName, password });
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }
    if (await checkUserExists(userName)) {
        res.status(400).send('User already exists');
        return;
    }
    const isAdmin = false;
    const userId = await register(firstName, lastName, userName, password, isAdmin);
    const userActive = await getSpecificUser(userId);
    const token = generateToken(userId, 'user');

    res.send({ success: true, msg: 'welcome!', token, userActive });
});

router.post('/login', async (req, res) => {
    const { userName, password } = req.body;
    console.log({ userName, password });
    const { error } = loginSchema.validate({ userName, password });
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }

    const userNameId = await login(userName, password);
    const userActive = await getSpecificUser(userNameId);
    console.log("this is the user id: ", userNameId)
    if (!userNameId) {
        return res.status(401).send("username or password don't match");
    }
    const userType = userActive.isAdmin ? 'admin': 'user';
    const token = generateToken(userNameId , userType);
    res.send({ success: true, msg: 'welcome back ', token, userNameId: userNameId, userActive });
});

router.get('/', async (req, res) => {
    //@ts-ignore
    const { id } = req.user;
    if (isNaN(Number(id))) {
        res.status(400).send('userId must be a number');
        return;
    }
    try {
        const users = await getUsers();
        console.log({ users })
        res.send(users);
    } catch (e) {
        res.status(500).send('Server is unavailable, please try again later');
    }
});

function generateToken(userId: number | null, userType: string) {
    return jwt.sign({ id: userId, userType }, SECRET);
}

export { router as users };