import { AppDataSource } from "../data-source";
import { User } from "../model/user.model";

export const UserRepository = AppDataSource.getRepository(User).extend({
    findByLogs(username: string, email: string) {
        return this.createQueryBuilder("user")
            .where("user.usename = :username", { username })
            .andWhere("user.email = :email", { email })
            .getMany();
    },
});
