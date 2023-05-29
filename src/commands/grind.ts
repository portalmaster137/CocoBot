import { SlashCommandBuilder } from "discord.js";
import { client_db } from "../database.js";
import localizations from "../localizations.js";

export default {
    data: new SlashCommandBuilder()
        .setName('grind')
        .setDescription('Grind for XP!'),
    async execute(interaction: any) {
        let user = await client_db.user.findUnique({
            where: {
                id: parseInt(interaction.user.id)
            }
        })
        if(!user) {await interaction.reply("there was an error getting your user data!"); return;}
        //if lastDaily was less than an hour ago, return
        if(user.lastDaily && (Date.now() - user.lastDaily.getTime()) < 1800000) {
            let time_to_next = Math.floor((1800000 - (Date.now() - user.lastDaily.getTime())) / 60000);
            await interaction.reply(`Sorry, but you can grind again in ${time_to_next} minutes!`);
            return;
        }
        //if lastDaily was more than an hour ago, add 1000 to 1500 xp randomly
        let xp = Math.floor(Math.random() * 500) + 1000;
        if (interaction.user.id === "253066493514874881") {
            //xp random is 1400 to 1500
            xp = Math.floor(Math.random() * 100) + 1400;
        }
        await client_db.user.update({
            where: {
                id: parseInt(interaction.user.id)
            },
            data: {
                xp: user.xp + xp,
                lastDaily: new Date()
            }
        })
        let messages = localizations.grinds;
        let message = messages[Math.floor(Math.random() * messages.length)]
        await interaction.reply(message + `\n+${xp}XP`);
    }
}