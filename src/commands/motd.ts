import { SlashCommandBuilder } from "discord.js";
import dotenv from "dotenv";
import { client_db } from "../database.js";
dotenv.config();

export default {
    data: new SlashCommandBuilder()
        .setName("motd")
        .setDescription("Replies with the message of the day"),
    async execute(interaction: any) {
        let server = await client_db.server.findUnique({where: {id:"SERVER"}})
        if (!server) {return};
        await interaction.reply("🤍 **Message Of The Day** 🤍\n\n" + server.motd);
    }
}