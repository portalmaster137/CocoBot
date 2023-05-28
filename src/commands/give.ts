import { SlashCommandBuilder } from "discord.js";
import { client_db } from "../database.js";
import SUPERUSERS from "../users.js";

export default {
    data: new SlashCommandBuilder()
        .setName("give")
        .setDescription("Gives your xp or peaches to another user")
        .addUserOption(option=>option.setName("user").setDescription("The amount of currency to give").setRequired(true))
        .addStringOption(option=>
            option.setName("type")
                .setDescription("The type of currency to give")
                .setRequired(true)
                .addChoices({name: "xp", value: "xp"}, {name: "peaches", value: "peaches"}))
        .addIntegerOption(option=>option.setName("amount").setDescription("The amount of currency to give").setRequired(true)),
                
    async execute(interaction: any) {
        let giving_user = await client_db.user.findUnique({where: {id: parseInt(interaction.user.id)}});
        if (!giving_user) {await interaction.reply("unable to find self db. this is a bug."); return;}
        if (interaction.options.getString("type") === "xp") {
            if (giving_user.xp < interaction.options.getInteger("amount")) {
                await interaction.reply("you don't have enough xp!");
                return;
            }
            await client_db.user.update({
                where: {
                    id: parseInt(interaction.user.id)
                }, data: {
                    xp: {
                        decrement: interaction.options.getInteger("amount")
                    }
                }
            })
            await client_db.user.update({
                where: {
                    id: parseInt(interaction.options.getUser("user").id)
                }, data: {
                    xp: {
                        increment: interaction.options.getInteger("amount")
                    }
                }
            });
            await interaction.reply("gave " + interaction.options.getUser("user").username + " " + interaction.options.getInteger("amount") + " xp");
        } else if (interaction.options.getString("type") === "peaches") {
            if (giving_user.peaches < interaction.options.getInteger("amount")) {
                await interaction.reply("you don't have enough peaches!");
                return;
            }
            await client_db.user.update({
                where: {
                    id: parseInt(interaction.user.id)
                }, data: {
                    peaches: {
                        decrement: interaction.options.getInteger("amount")
                    }
                }
            })
            await client_db.user.update({
                where: {
                    id: parseInt(interaction.options.getUser("user").id)
                }, data: {
                    peaches: {
                        increment: interaction.options.getInteger("amount")
                    }
                }
            });
            await interaction.reply("gave " + interaction.options.getUser("user").username + " " + interaction.options.getInteger("amount") + " peaches");
        }
    }
}