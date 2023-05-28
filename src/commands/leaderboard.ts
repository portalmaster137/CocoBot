import { SlashCommandBuilder } from "discord.js";
import dotenv from "dotenv";
import { client_db } from "../database.js";
import { client } from "../client_handle.js";
dotenv.config();

export default {
    data: new SlashCommandBuilder()
        .setName("leaderboard")
        .setDescription("Shows the leaderboard"),
    async execute(interaction: any) {
        let users = await client_db.user.findMany({
            where: {
                xp: {
                    gt: 0
                }
            }
        })
        users.sort((a, b) => {
            return b.xp - a.xp;
        });
        //cap the user list at 10 users
        users = users.slice(0, 10);
        
        let leaderboard = "";
        users.forEach((user, index) => {
            console.log(user.id.toString())
            leaderboard += `${index + 1}. ${user.username} - ${user.xp} XP, ${user.peaches} peaches\n`
        })
        
        await interaction.reply("🤍 **Leaderboard** 🤍\n\n" + leaderboard);
    }
}