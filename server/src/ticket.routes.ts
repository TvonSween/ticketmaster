import * as express from "express";
import { ObjectId } from "mongodb";
import { collections } from "./database";

export const ticketRouter = express.Router();
ticketRouter.use(express.json());

ticketRouter.get("/", async (_req, res) => {
    try {
        const tickets = await collections?.tickets?.find({}).toArray();
        res.status(200).send(tickets);
    } catch (error) {
        res.status(500).send(error instanceof Error ? error.message : "Unknown error");
    }
});

ticketRouter.get("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const query = { _id: new ObjectId(id) };
        const ticket = await collections?.tickets?.findOne(query);

        if (ticket) {
            res.status(200).send(ticket);
        } else {
            res.status(404).send(`Failed to find the ticket: ID ${id}`);
        }
    } catch (error) {
        res.status(404).send(`Failed to find the ticket: ID ${req?.params?.id}`);
    }
});

ticketRouter.post("/", async (req, res) => {
    try {
        const ticket = req.body;
        const result = await collections?.tickets?.insertOne(ticket);

        if (result?.acknowledged) {
            res.status(201).send(`Created a new ticket: ID ${result.insertedId}.`);
        } else {
            res.status(500).send("Failed to create a new ticket.");
        }
    } catch (error) {
        console.error(error);
        res.status(400).send(error instanceof Error ? error.message : "Unknown error");
    }
});

ticketRouter.put("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const ticket = req.body;
        const query = { _id: new ObjectId(id) };
        const result = await collections?.tickets?.updateOne(query, { $set: ticket });

        if (result && result.matchedCount) {
            res.status(200).send(`Updated a ticket: ID ${id}.`);
        } else if (!result?.matchedCount) {
            res.status(404).send(`Failed to find the ticket: ID ${id}`);
        } else {
            res.status(304).send(`Failed to update the ticket: ID ${id}`);
        }
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error(message);
        res.status(400).send(message);
    }
});

ticketRouter.delete("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const query = { _id: new ObjectId(id) };
        const result = await collections?.tickets?.deleteOne(query);

        if (result && result.deletedCount) {
            res.status(202).send(`Removed a ticket: ID ${id}`);
        } else if (!result) {
            res.status(400).send(`Failed to remove a ticket: ID ${id}`);
        } else if (!result.deletedCount) {
            res.status(404).send(`Failed to find a ticket: ID ${id}`);
        }
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error(message);
        res.status(400).send(message);
    }
});