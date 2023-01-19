import { Request, Response } from "express";

import { AppDataSource } from "../data-source";
import { Card } from "../entity/Card";
import { Collection } from "../entity/Collection";
import { Users } from "../entity/Users";
import { Wanted } from "../entity/Wanted";
import { verifyToken } from "../middlewares/checking";

export default class WantedController {}
