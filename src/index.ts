import * as express from "express";
import * as dotenv from "dotenv";
import { AppDataSource } from "./data-source";

import routes from "./routes";

dotenv.config();

AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!");
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err);
    });

const app = express();
app.use(express.json());

app.use("/api", routes);

app.listen(3000, () => {
    console.log("API listening on port 3000", process.env.DB_USERNAME);
});

// AppDataSource.initialize()
//     .then(async () => {
//         console.log("Inserting a new user into the database...");
//         const user = new User();
//         user.username = "Jojo";
//         user.email = "dio@gmail.com";
//         await AppDataSource.manager.save(user);
//         console.log("Saved a new user with id: " + user.id);

//         console.log("Loading users from the database...");
//         const users = await AppDataSource.manager.find(User);
//         console.log("Loaded users: ", users);

//         console.log(
//             "Here you can setup and run express / fastify / any other framework."
//         );
//     })
//     .catch((error) => console.log(error));
