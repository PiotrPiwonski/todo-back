import {UserEntity} from "./user-entity";


export type CreateUserReq = Omit<UserEntity, 'id'>;