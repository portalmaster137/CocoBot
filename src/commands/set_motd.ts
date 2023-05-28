import { SlashCommandBuilder } from "discord.js";
import { client_db } from "../database.js";
import SUPERUSERS from "../users.js";

export default {
    data: new SlashCommandBuilder()
        .setName("set_motd")
        .setDescription("Sets the message of the day ⭐")
        .addStringOption(option=>option.setName("motd").setDescription("The message of the day").setRequired(true)),
    async execute(interaction: any) {
        if (!SUPERUSERS.includes(interaction.user.id)) {
            await interaction.reply("You do not have permission to use this command");
            return;
        }
        await client_db.server.update({
            where: {
                id: "SERVER"
            }, data: {
                motd: interaction.options.getString("motd")
            }
        })
        await interaction.reply("Set the message of the day to " + interaction.options.getString("motd"));
    }
}