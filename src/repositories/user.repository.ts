import { AppDataSource } from "../data-source";
import { Users } from "../model/users.model";

export default class User {
    static Repository = () => AppDataSource.getRepository(Users);
}
