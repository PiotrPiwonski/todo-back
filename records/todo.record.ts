import {TodoEntity} from "../types";
import {ValidationError} from "../utils/errors";
import {v4 as uuid} from "uuid";
import {pool} from "../utils/db";
import {FieldPacket} from "mysql2";

type ToDoRecordResults = [TodoRecord[], FieldPacket[]];

interface NewTodoEntity extends Omit<TodoEntity, 'id' | 'done'> {
    id?: string;
    done?: number;
}

export class TodoRecord implements TodoEntity {
    public id: string;
    public description: string;
    public done: number;
    public userId: string;

    constructor(obj: NewTodoEntity) {
        if(!obj.description || obj.description.length > 100) {
            throw new ValidationError('The content of the task must not be blank or exceed 100 characters.');
        }

        this.id = obj.id;
        this.description = obj.description;
        this.done = obj.done;
        this.userId = obj.userId;
    }

    static async listAll(userId: string): Promise<TodoEntity[] | null> {
        const [results] = (await pool.execute("SELECT * FROM `todo` WHERE `userid` = :userId", {
            userId,
        })) as ToDoRecordResults;
        return results.map(obj => new TodoRecord(obj));
    }

    static async getOne(id: string): Promise<TodoRecord | null> {
        const [results] = await pool.execute("SELECT * FROM `todo` WHERE `id` = :id", {
            id,
        }) as ToDoRecordResults;
        return results.length === 0 ? null : new TodoRecord(results[0]);
    }

    async delete(): Promise<void> {
        await pool.execute("DELETE FROM `todo` WHERE `id` = :id", {
            id: this.id,
        });
    }

    async insert(userId: string): Promise<string> {
        if (!this.id) {
            this.id = uuid();
        }
        await pool.execute("INSERT INTO `todo` VALUES(:id, :description, :done, :userid)", {
            id: this.id,
            description: this.description,
            done: 0,
            userid: userId,
        });

        return this.id;
    }

    async patch(isDone: number): Promise<string> {
        await pool.execute("UPDATE `todo` SET `done`= :isDone WHERE `id`=:id", {
            isDone,
            id: this.id,
        })
        return this.id;
    }

}