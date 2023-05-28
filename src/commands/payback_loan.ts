import { SlashCommandBuilder } from "discord.js";
import { client_db } from "../database.js";


export default {
    data: new SlashCommandBuilder()
        .setName('payback_loan')
        .setDescription('Payback a loan!')
        .addStringOption(option=>option.setName("loan_id").setDescription("The id of the loan you want to payback").setRequired(true)),
    async execute(interaction: any) {
        let loan_db = await client_db.loans.findUnique({
            where: {
                id: interaction.options.getString("loan_id") as string
            }
        })
        if(!loan_db) {await interaction.reply("Loan not found!"); return;}
        if (loan_db.loanee !== interaction.user.id) {await interaction.reply("You are not the loanee of this loan!"); return;}
        let loanee = await client_db.user.findUnique({
            where: {
                id: parseInt(interaction.user.id)
        }});
        if (!loanee) {await interaction.reply("User not found in database, this is a bug. Wait a bit and try again, if problem persists contact Porta :)"); return;}
        if (loanee.xp < loan_db.payback) {await interaction.reply("You don't have enough xp to payback this loan!"); return;}
        let loaner = await client_db.user.findUnique({
            where: {
                id: parseInt(loan_db.loaner)
        }});
        if (!loaner) {await interaction.reply("Loaner not found in database, this is a bug. Wait a bit and try again, if problem persists contact Porta :)"); return;}
        await client_db.user.update({
            where: {
                id: parseInt(interaction.user.id)
            },
            data: {
                xp: {
                    decrement: loan_db.payback
                }
            }
        })
        await client_db.user.update({
            where: {
                id: parseInt(loan_db.loaner)
            },
            data: {
                xp: {
                    increment: loan_db.payback
                }
            }
        });
        await client_db.loans.delete({
            where: {
                id: interaction.options.getString("loan_id") as string
            }
        })
        await interaction.reply("Loan payback successful!");

    }
}