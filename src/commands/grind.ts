import { SlashCommandBuilder } from "discord.js";
import { client_db } from "../database.js";

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
        if(user.lastDaily && (Date.now() - user.lastDaily.getTime()) < 3600000) {
            let time_to_next = Math.floor((3600000 - (Date.now() - user.lastDaily.getTime())) / 60000);
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
        let messages = [
            "You slayed a slime! Now you're all sticky...",
            "Barely defeated that bone witch. Your boner almost got in your way...",
            "Those imps were such a tease, but you managed to stay focused.",
            "Those spirits licked and rubbed you through your armour, you almost came!",
            "You almost willingly accepted a scam, but your companion saved you.",
            "Moans filled the room as the wall trap teased you... you barely made it away.",
            "You slayed a goblin. That's it. That's all. You'd never consider fucking one.",
            "A giantess stepped on you and you nearly caved.",
            "You were able to slay every cherub before their poison arrows got your dick throbbing."
        ]
        let message = messages[Math.floor(Math.random() * messages.length)]
        await interaction.reply(message + `\n+${xp}XP`);
    }
}