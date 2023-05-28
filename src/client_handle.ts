import { Client } from "discord.js";

let client: Client;

function set_client(_client: Client) {
    client = _client;
}

export {client, set_client};