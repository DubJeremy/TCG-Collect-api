import * as express from "express";
import * as dotenv from "dotenv";
import "reflect-metadata";

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
    console.log("API listening on port 3000");
});
