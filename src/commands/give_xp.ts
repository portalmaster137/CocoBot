import { SlashCommandBuilder } from "discord.js";
import { client_db } from "../database.js";
import SUPERUSERS from "../users.js";

export default {
    data: new SlashCommandBuilder()
        .setName("give_xp")
        .setDescription("Gives xp to a user ⭐")
        .addUserOption(option=>option.setName("user").setDescription("The user to give xp to").setRequired(true))
        .addIntegerOption(option=>option.setName("amount").setDescription("The amount of xp to give").setRequired(true)),
    async execute(interaction: any) {
        console.log(interaction.user.id);
        console.log(typeof(interaction.user.id))
        if (!SUPERUSERS.includes(interaction.user.id)) {
            await interaction.reply("You do not have permission to use this command");
            return;
        }
        await client_db.user.update({
            where: {
                id: parseInt(interaction.options.getUser("user").id)
            },
            data: {
                xp: {
                    increment: interaction.options.getInteger("amount")
                }
            }
        })
        await interaction.reply("Gave " + interaction.options.getUser("user").username + " " + interaction.options.getInteger("amount") + " xp");
    }
}