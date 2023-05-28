import { SlashCommandBuilder } from "discord.js";
import {client_db} from "../database.js"
import ranks from "./ranks.js";

export default {
    data: new SlashCommandBuilder()
        .setName("info")
        .setDescription("Gives you your current XP and peaches")
        .addUserOption(option=>option.setName("user").setDescription("The user to get info on, defaults to yourself").setRequired(false)),
    async execute(interaction: any) {
        if (interaction.options.getUser("user")) {
            let int_user = interaction.options.getUser("user");
            const user = await client_db.user.findUnique({
                where: {
                    id: parseInt(int_user.id)
                }
            })
            if (!user) {
                await interaction.reply("User was not found in the database, this is a bug. wait a bit and try again, if problem persists contact Porta :)");
            } else {
                //every 10000 is a level.
                //every 5 levels is a rank
                let level = (Math.floor(user.xp / 10000))+1;
                let rank = (Math.floor(level / 10))+1;
                let rank_name = ranks.data.get(rank) as string;
                await interaction.reply("Your current XP is: " + user.xp + ", And you have : " + user.peaches + " peaches.\n\nYou are currently level " + level + ", and your rank is: " + rank_name + ".");
            }
        } else {
            const user = await client_db.user.findUnique({
                where: {
                    id: parseInt(interaction.user.id)
                }
            })
            if (!user) {
                await interaction.reply("User was not found in the database, this is a bug. wait a bit and try again, if problem persists contact Porta :)");
            } else {
                //every 10000 is a level.
                //every 5 levels is a rank
                let level = (Math.floor(user.xp / 10000))+1;
                let rank = (Math.floor(level / 10))+1;
                let rank_name = ranks.data.get(rank) as string;
                if (user.xp < 0) {rank_name = "Fucking pathetic~"}
                await interaction.reply("Your current xp is: " + user.xp + ", And you have : " + user.peaches + " peaches.\n\nYou are currently level " + level + ", and your rank is: " + rank_name);
            }
        }
        
    }
}