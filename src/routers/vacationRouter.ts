import express from "express";
import { updateVacation, getFollowedVacationsOfUserInOrder, increaseFollowersAmount, decreaseFollowersAmount, followVacation, addVacation, unfollowVacation, getVacations, deleteVacation, isUserFollowingVacation, getFollowedVacationsOfUser, getFavoriteVacations, deleteVacationIdFromUsers_Vacations, getDestinationNamesForChart, getFollowersAmountForChart } from '../vacationQueries';
import { getSpecificUser } from '../userQueries';
import { vacationSchema } from "../schemas/vacation";
import { number } from "@hapi/joi";
import {serverIo} from "../wss";


const router = express.Router();

router.post('/', async (req, res) => {
    //@ts-ignore
    const { id: userId } = req.user;
    console.log('this is req user', userId);
    const { description, destination, picture, departure, returnAt, price } = req.body;

    const result = vacationSchema.validate({ userId, description, destination, departure, returnAt, price });
    if (result.error) {
        res.status(400).send(JSON.stringify({ success: false, msg: result.error }));
        return;
    }

    const ID = await addVacation(description, destination, picture, departure, returnAt, price);

    const newVacation = { ID, description, destination, picture, departure, returnAt, price };

    if (ID) {
        console.log("send from server the WS the newVacation", newVacation);
        serverIo().in('users').emit('ADDED_NEW_VACATION', {newVacation});
    } else {
        res.status(500).send(JSON.stringify({ success: false, msg: 'Please try again later.' }))
    }
});

router.put('/:id', async (req, res) => {
    //@ts-ignore
    const { id: userId } = req.user;
    console.log({ userId })
    const { description, destination, picture, departure, returnAt, price } = req.body;
    const departureFromMiliseconds = new Date(departure);
    const returnAtFromMiliseconds = new Date (returnAt);
    console.log({ description, destination, picture, departureFromMiliseconds, returnAtFromMiliseconds, price })

    if (isNaN(Number(userId))) {
        res.status(400).send('userId must be a number');
        return;
    }
    const { id } = req.params;
    console.log('this is req user', userId, 'and this is the vacation id:', id);
    const data = { description, destination, picture, departure:departureFromMiliseconds, returnAt:returnAtFromMiliseconds, price, ID:+id };


    const result = await updateVacation(Number(id), data);
    console.log({ result })
    if (result) {
        // sendAllClients({
        //     type: 'UPDATED_FIELDS',
        //     payload: { success: true, msg: 'Field updated successfully.', data }
        // });
    } else {
        res.status(500).send(JSON.stringify({ success: false, msg: 'Please try again later.' }))
    }
});


router.delete('/:id', async (req, res) => {
    console.log("deleted vacation  ");
    //@ts-ignore
    const { id: userId } = req.user;
    const { id } = req.params;
    console.log("deleted vacation with ID: ", id);
    if (isNaN(Number(userId))) {
        res.status(400).send('userId must be a number');
        return;
    }

    if (isNaN(Number(id))) {
        res.status(400).send('id must be a number');
        return;
    }
    await deleteVacationIdFromUsers_Vacations(Number(id));
    const result = await deleteVacation(Number(id));
    console.log('in delete ROUTER is:', id, "and the result is ", result);
    // sendAllClients({
    //     type: 'DELETED_VACATION_WS',
    //     payload: { id }
    // });
});

router.get('/', async (req, res) => {
    //@ts-ignore
    const { id } = req.user;
    if (isNaN(Number(id))) {
        res.status(400).send('userId must be a number');
        return;
    }
    try {
        const vacations = await getVacations();
        const vacationNames = await getDestinationNamesForChart();
        const followedVacationsOfUser = await getFollowedVacationsOfUser(id);
        const userActive = await getSpecificUser(id);
        const vacationsInTheOrderOfFollow = await getFollowedVacationsOfUserInOrder(id);
        const followersAmountForChart = await getFollowersAmountForChart();

        console.log({ followedVacationsOfUser,vacationNames, followersAmountForChart })
        res.send({ vacations, followedVacationsOfUser, userActive, vacationsInTheOrderOfFollow, vacationNames, followersAmountForChart });
    } catch (e) {
        res.status(500).send('Server is unavailable, please try again later');
    }
});

router.get('/:userId', async (req, res) => {
    //@ts-ignore
    const { id: userId } = req.user;
    if (isNaN(Number(userId))) {
        res.status(400).send('userId must be a number');
        return;
    }
    try {
        const vacations = await getFavoriteVacations(userId);
        console.log(vacations);
        res.send(vacations);
    } catch (e) {
        res.status(500).send('Server is unavailable, please try again later');
    }
});

router.post('/:id/toggleFollow', async (req, res) => {
    //@ts-ignore
    const { id: userId } = req.user;
    const { id: vacationIdParam } = req.params;
    console.log(userId, vacationIdParam);
    if (isNaN(Number(userId))) {
        res.status(400).send('userId must be a number');
        return;
    }
    const vacationId = Number(vacationIdParam);
    if (isNaN(vacationId)) {
        res.status(400).send('vacationId must be a number');
        return;
    }
    const isFollowing = await isUserFollowingVacation(userId, vacationId);

    if (isFollowing) {
        unfollowVacation(userId, vacationId);
        decreaseFollowersAmount(vacationId);

        // sendAllClients({
        //     type: 'FOLLOW_VACATION',
        //     payload: { success: false, msg: "Vacation unfollowed!", vacationId, userId }
        // });
    } else {
        followVacation(userId, vacationId);
        increaseFollowersAmount(vacationId);
        console.log("Vacation is followed!");

        // sendAllClients({
        //     type: 'FOLLOW_VACATION',
        //     payload: { success: true, msg: "Vacation followed!", vacationId, userId }
        // });
    }

});

// function sendAllClients(msg: any) {
//     const json = JSON.stringify(msg);

//     wss.clients.forEach((client) => {
//             client.send(json);
//     });
// };

export { router as vacations };