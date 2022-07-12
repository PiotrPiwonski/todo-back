import {Router} from "express";
import {UserRecord} from "../records/user.record";
import {ValidationError} from "../utils/errors";

export const loginRouter = Router();


let userData = {id: '', name: ''};

loginRouter

    .get('/:email/:password', async (req, res) => {
        const user = await UserRecord.getOne(req.params.email);
        if (!user) {
            throw new ValidationError('There is no user with this email.')

        }
        if (req.params.password !== user.password) {
            throw new ValidationError( 'Not correct password.')

        }
        if (req.params.password === user.password) {

            userData.id = user.id;
            userData.name = user.name;

        }
        res.end();
    })
    .get('/', async (req, res) => {
        res.send(userData);
    })
    .get('/:id', async (req, res) => {
        userData = {
            id: '',
            name: '',
        }
        res.end();
    })