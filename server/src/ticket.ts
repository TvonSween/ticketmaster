import * as mongodb from "mongodb";

export interface Ticket {
    name: string;
    _id?: mongodb.ObjectId;
}