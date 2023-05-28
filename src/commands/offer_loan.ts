import { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } from "discord.js";
import { client_db } from "../database.js";

const generateRandomString = (length: number) => {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

export default {
    data: new SlashCommandBuilder()
        .setName('offer_loan')
        .setDescription('Offer a loan to someone!')
        //user option for target
        //integer option for amount
        //interger option for amount to pay back
        .addUserOption(option=>option.setName("user").setDescription("The user to loan to").setRequired(true))
        .addIntegerOption(option=>option.setName("amount").setDescription("The amount to loan").setRequired(true))
        .addIntegerOption(option=>option.setName("payback").setDescription("The amount to pay back").setRequired(true)),
    async execute(interaction: any) {
        const target = interaction.options.getUser("user");
        const amount = interaction.options.getInteger("amount");
        const total = interaction.options.getInteger("payback");
        const user = interaction.user;
        if(target.id === user.id) {await interaction.reply("You can't loan yourself money!"); return;}
        if(!target) {await interaction.reply("User not found!"); return;}
        if(amount < 0) {await interaction.reply("You can't loan negative money!"); return;}
        if(total < 0) {await interaction.reply("You can't pay back negative money!"); return;}
        let user_data = await client_db.user.findUnique({where: {id: parseInt(user.id)}});
        let target_data = await client_db.user.findUnique({where: {id: parseInt(target.id)}});
        if(!user_data) {await interaction.reply("There was an error getting your user data!"); return;}
        if(!target_data) {await interaction.reply("There was an error getting your target's user data!"); return;}
        let difference = amount - total;
        if(user_data.xp < amount) {await interaction.reply("You don't have enough xp to loan that much!"); return;}
        const accept_btn = new ButtonBuilder()
            .setCustomId("accept")
            .setStyle(ButtonStyle.Primary)
            .setEmoji("✅");
        const reject_btn = new ButtonBuilder()
            .setCustomId("reject")
            .setStyle(ButtonStyle.Primary)
            .setEmoji("❌");
        const row = new ActionRowBuilder()
            .addComponents(accept_btn, reject_btn);
        const resp = await interaction.reply({content: `${user} is offering a loan of ${amount} xp to ${target}, expecting them to pay back a total of ${total}!`, components: [row]});
        const filt = (i: { user: { id: any; }; }) => i.user.id === target.id;
        let opt;
        try {
            opt = await resp.awaitMessageComponent({filter: filt, time: 60000 });
        } catch (e) {
            await interaction.editReply({content: `${target} didn't respond in time!`, components: []});
            return
        }
        if (opt.customId === "accept") {
            await interaction.editReply({content: `${target} accepted the loan!`, components: []});
            await client_db.user.update({where: {id: parseInt(user.id)}, data: {xp: user_data.xp - amount}});
            await client_db.user.update({where: {id: parseInt(target.id)}, data: {xp: target_data.xp + total}});
            await client_db.loans.create(
                {
                    data: {
                        id: generateRandomString(16),
                        loaner: user.id,
                        loaner_nick: user.username,
                        loanee: target.id,
                        loanee_nick: target.username,
                        amount: amount,
                        payback: total,
                    }
                }
            );
            return
        } else {
            await interaction.editReply({content: `${target} rejected the loan!`, components: []});
            return
        }

        
    }
}