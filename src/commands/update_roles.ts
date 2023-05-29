import { SlashCommandBuilder } from "discord.js";
import { update_user_roles } from "../role_handler.js";


export default {
    data: new SlashCommandBuilder()
        .setName("update_roles")
        .setDescription("Updates all user roles."),
    async execute(interaction: any) {
        await interaction.reply("Updating roles...");
        interaction.guild.members.cache.forEach(async (member: any)=>{
            await update_user_roles(member);
        })
        await interaction.editReply("Done!");
    }
}