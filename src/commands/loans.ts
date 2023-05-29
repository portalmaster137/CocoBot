import { SlashCommandBuilder } from "discord.js";
import { client_db } from "../database.js";


export default {
    data: new SlashCommandBuilder()
        .setName('loans')
        .setDescription('View someones loans!')
        .addUserOption(option=>option.setName("user").setDescription("The user to get info on, defaults to yourself").setRequired(false)),

    async execute(interaction: any) {
        let user;
        if (interaction.options.getUser("user")) {
            user = interaction.options.getUser("user")
            let loans = await client_db.loans.findMany({
                where: {
                    loanee: user.id
                }
            })
            if(!loans) {await interaction.reply("You don't have any loans!"); return;}
            let loan_list = `🤍 ${user.username}'s Loans 🤍\n\n`;
            for(let i = 0; i < loans.length; i++) {
                loan_list += `${loans[i].loaner_nick} loaned you ${loans[i].amount} xp, expecting ${loans[i].payback} xp back! (Loan ID: ${loans[i].id})\n`
            }
            await interaction.reply(loan_list);
        } else {
            user = interaction.user
            let loans = await client_db.loans.findMany({
                where: {
                    loanee: user.id
                }
            })
            if(!loans) {await interaction.reply("You don't have any loans!"); return;}
            let loan_list = "🤍 Your Loans 🤍\n\n";
            for(let i = 0; i < loans.length; i++) {
                loan_list += `${loans[i].loaner_nick} loaned you ${loans[i].amount} xp, expecting ${loans[i].payback} xp back! (Loan ID: ${loans[i].id})\n`
            }
            await interaction.reply(loan_list);
        }
        
    }
}