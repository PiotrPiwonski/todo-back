import {Router} from "express";
import {UserRecord} from "../records/user.record";
import {CreateUserReq} from "../types/user/user";
import {ValidationError} from "../utils/errors";

export const registerRouter = Router();

registerRouter

    .post('/', async (req, res) => {
        const newUser = new UserRecord(req.body as CreateUserReq);
        const newUserEmail = newUser.email;
        const oldUser = await UserRecord.getOne(newUserEmail);
        if(oldUser) {
            throw new ValidationError('User about this email already exists.')
        }
        await newUser.insert();

        // res.json(newUser);
        res.end();
    })