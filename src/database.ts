import { PrismaClient } from "@prisma/client";

let client_db: PrismaClient;

function setup_client(client: PrismaClient){
    client_db = client;
}

export { client_db, setup_client}