import express, {json} from "express";
import cors from "cors";
import 'express-async-errors';
import {handleError} from "./utils/errors";
import {todoRouter} from "./routers/todo";
import {loginRouter} from "./routers/login";
import {registerRouter} from "./routers/register";

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
}));
app.use(json());


app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/todo', todoRouter);

app.use(handleError);

app.listen(3001, '0.0.0.0', () => {
    console.log('Listening on port http://localhost:3001');
})