import {UserEntity} from "../types";
import {ValidationError} from "../utils/errors";
import {v4 as uuid} from "uuid";
import {pool} from "../utils/db";
import {FieldPacket} from "mysql2";

type UserRecordResults = [UserRecord[], FieldPacket[]];

interface NewUserEntity extends Omit<UserEntity, 'id'> {
    id? : string;
}

export class UserRecord implements UserEntity {
    public id: string;
    public name: string;
    public email: string;
    public password: string;
    public confirmPassword?: string;

    constructor(obj: NewUserEntity) {
        if (!obj.name || obj.name.length < 3 || obj.name.length > 55 ) {
            throw new ValidationError('First name must not be blank and the number of characters must be between 3 and 55.');
        }
        if (!obj.email || obj.email.length < 5 || obj.email.length > 345) {
            throw new ValidationError('.Email must not be blank and the number of characters must be between 5 and 345.');
        }
        if (!obj.password || obj.password.length < 6 || obj.password.length > 16) {
            throw new ValidationError('Password must not be blank and the number of characters must be between 6 and 16.');
        }


        this.id = obj.id;
        this.name = obj.name;
        this.email = obj.email;
        this.password = obj.password;
    }

    static async getOne(email: string): Promise<UserRecord | null> {
        const [results] = await pool.execute("SELECT * FROM `users` WHERE `email` = :email", {
            email,
        }) as UserRecordResults;
        return results.length === 0 ? null : new UserRecord(results[0]);
    }

    async insert(): Promise<string> {
        if (!this.id) {
            this.id = uuid();
        }

        await pool.execute("INSERT INTO `users` VALUES(:id, :name, :email, :password)", {
            id: this.id,
            name: this.name,
            email: this.email,
            password: this.password,
        });
        return this.id;
    }
}