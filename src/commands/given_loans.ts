import { SlashCommandBuilder } from "discord.js";
import { client_db } from "../database.js";

export default {
    data: new SlashCommandBuilder()
        .setName('given_loans')
        .setDescription('View your given loans!'),
    async execute(interaction: any) {
        let loans = await client_db.loans.findMany({
            where: {
                loaner: interaction.user.id
            }
        })
        if(!loans) {await interaction.reply("You don't have any loans!"); return;}
            let loan_list = `🤍 ${interaction.user.username}Given Loans 🤍\n\n`;
            for(let i = 0; i < loans.length; i++) {
                loan_list += `You've loaned ${loans[i].loanee_nick} ${loans[i].amount} xp, expecting ${loans[i].payback} xp back! (Loan ID: ${loans[i].id})\n`
            }
            await interaction.reply(loan_list);
    }
}