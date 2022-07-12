import {Router} from "express";
import {TodoRecord} from "../records/todo.record";
import {CreateTodoReq} from "../types/todo/todo";
import {ValidationError} from "../utils/errors";

export const todoRouter = Router();

todoRouter
    .get('/:userId', async (req, res) => {
        const todoList = await TodoRecord.listAll(req.params.userId);

        res.json({
            todoList,
        });
    })

    .post('/:userId', async (req, res) => {
        const newTodo = new TodoRecord(req.body as CreateTodoReq);

        await newTodo.insert(req.params.userId);

        res.json(newTodo);
    })

    .delete('/:id', async (req, res) => {
        const todo = await TodoRecord.getOne(req.params.id);

        if (!todo) {
            throw new ValidationError('No such todo.')
        }

        await todo.delete();
        res.end();
    })

    .patch('/:id', async (req, res) => {
        const todo = await TodoRecord.getOne(req.params.id);

        if (!todo) {
            throw new ValidationError('No such todo.')
        }



        if (todo.done === 0) {
            await todo.patch(1);
        } else {
            await todo.patch(0);
        }

        res.end();
    })