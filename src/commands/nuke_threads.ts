import { Guild, SlashCommandBuilder } from "discord.js";
import { client_db } from "../database.js";
import SUPERUSERS from "../users.js";

export default {
    data: new SlashCommandBuilder()
        .setName("nuke_threads")
        .setDescription("NUKE ALL THREADS ⭐"),
    async execute(interaction: any) {
        if (!SUPERUSERS.includes(interaction.user.id)) {
            await interaction.reply("You do not have permission to use this command");
            return;
        }
        const guild = await interaction.guild.fetch() as Guild;
        const threads = await guild.channels.cache.filter(x=>x.isThread());
        threads.forEach(async thread=>{
            if (thread.isThread()) {
                await thread.delete();
            }
        })
        await interaction.reply("Nuked all threads!");
    }
}