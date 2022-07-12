import {TodoEntity} from "./todo-entity";


export type CreateTodoReq = Omit<TodoEntity, 'id'>;

