import config from "config";
import { FilterQuery, get } from "mongoose";
import SessionModel, { SchemaDocument } from "../model/session.model";
import { verifyJwt, signJwt } from "../utils/jwt.utils";
import { findUser } from "./user.service";

export async function createSession(userId: string, userAgent: string){
    const session = await SessionModel.create({user: userId, userAgent})

    return session.toJSON()
}

export async function findSession(query: FilterQuery<SchemaDocument>){
    return await SessionModel.find(query).lean()
}

