import { AppDataSource } from "../data-source";
import { Users } from "../model/users.model";

export const UserRepository = AppDataSource.getRepository(Users).extend({
    findByLogs(username: string, email: string) {
        return this.createQueryBuilder("user")
            .where("user.usename = :username", { username })
            .andWhere("user.email = :email", { email })
            .getMany();
    },
});
