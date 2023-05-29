import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, SlashCommandBuilder } from "discord.js";
import { add_thread } from "../seduce_thread_manager.js";

export default {
    data: new SlashCommandBuilder()
        .setName("seduce")
        .setDescription("Seduce someone!")
        .addUserOption(option=>option.setName("user").setDescription("The target to seduce~").setRequired(true)),
    async execute(interaction: any) {
        const target = interaction.options.getUser("user");
        const user = interaction.user;
        if(target.id === user.id) {
            await interaction.reply("You can't seduce yourself!");
            return;
        }
        if(!target) {
            await interaction.reply("User not found!");
            return;
        }
        const seduce_btn = new ButtonBuilder()
            .setCustomId("seduce")
            .setStyle(ButtonStyle.Primary)
            .setEmoji("💦");

        const private_btn = new ButtonBuilder()
            .setCustomId("private")
            .setStyle(ButtonStyle.Primary)
            .setEmoji("🔒");

        const row = new ActionRowBuilder()
            .addComponents(seduce_btn, private_btn);
        
        if (target === interaction.client.user) {
            await interaction.reply({content: "Why the fuck are you trying to seduce me? I'm too good for you, loser~", components: []});
            return;
        }
        const resp = await interaction.reply({content: `${user} is attempting to seduce ${target}!`, components: [row]});
        const filt = (i: { user: { id: any; }; }) => i.user.id === target.id;
        let opt;
        try {
            opt = await resp.awaitMessageComponent({filter: filt, time: 15000 });
        } catch (e) {
            await interaction.editReply({content: `${target} didn't respond in time!`, components: []});
            return
        }
        await interaction.editReply({content: `${user} has started seducing ${target}!`, components: []});
        let thread;
        if (opt.customId === "private") {
            thread = await interaction.channel.threads.create({
                name: `${user.username} and ${target.username}'s Private seduction`,
                autoArchiveDuration: 1440,
                reason: "Seduction",
                type: ChannelType.PrivateThread 
            });
        } else {
            thread = await interaction.channel.threads.create({
                name: `${user.username} and ${target.username}'s seduction`,
                autoArchiveDuration: 1440,
                reason: "Seduction",
                type: ChannelType.PublicThread 
            });
        }
        
        await thread.members.add(user);
        await thread.members.add(target);
        add_thread(thread.id, user, target, thread);

    }
}