import { SlashCommandBuilder } from "discord.js";
import { client_db } from "../database.js";
import SUPERUSERS from "../users.js";


export default {
    data: new SlashCommandBuilder()
        .setName("take_xp")
        .setDescription("Takes xp from a user ⭐")
        .addUserOption(option=>option.setName("user").setDescription("The user to take xp from").setRequired(true))
        .addIntegerOption(option=>option.setName("amount").setDescription("The amount of xp to take").setRequired(true)),
    async execute(interaction: any) {
        if (!SUPERUSERS.includes(interaction.user.id)) {
            await interaction.reply("You do not have permission to use this command");
            return;
        }
        let user = await client_db.user.findUnique({
            where: {
                id: parseInt(interaction.options.getUser("user").id)
            }
        });
        if (!user) {await interaction.reply("User not found"); return;}
        let new_xp = user.xp - interaction.options.getInteger("amount")
        if (new_xp < 0) {new_xp = 0}
        await client_db.user.update({
            where: {
                id: parseInt(interaction.options.getUser("user").id)
            },
            data: {
                xp: new_xp
            }
        });
        await interaction.reply("Took " + interaction.options.getInteger("amount") + " xp from " + interaction.options.getUser("user").username);
    }
}