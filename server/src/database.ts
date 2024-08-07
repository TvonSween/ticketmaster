import * as mongodb from "mongodb";
import { Ticket } from "./ticket";

export const collections: {
    tickets?: mongodb.Collection<Ticket>;
} = {};

export async function connectToDatabase(uri: string) {
    const client = new mongodb.MongoClient(uri);
    await client.connect();

    const db = client.db("ticketmaster");
    await applySchemaValidation(db);

    const ticketsCollection = db.collection<Ticket>("tickets");
    collections.tickets = ticketsCollection;
}

// Update our existing collection with JSON schema validation so we know our documents will always match the shape of our Ticket model, even if added elsewhere.
// For more information about schema validation, see this blog series: https://www.mongodb.com/blog/post/json-schema-validation--locking-down-your-model-the-smart-way
async function applySchemaValidation(db: mongodb.Db) {
    const jsonSchema = {
        $jsonSchema: {
            bsonType: "object",
            required: ["name"],
            additionalProperties: false,
            properties: {
                _id: {},
                name: {
                    bsonType: "string",
                    description: "'name' is required and is a string",
                },
            },
        },
    };

    // Try applying the modification to the collection, if the collection doesn't exist, create it
    await db.command({
        collMod: "tickets",
        validator: jsonSchema
    }).catch(async (error: mongodb.MongoServerError) => {
        if (error.codeName === "NamespaceNotFound") {
            await db.createCollection("tickets", { validator: jsonSchema });
        }
    });
}