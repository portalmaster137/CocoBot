import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, MessageComponentInteraction, SlashCommandBuilder } from "discord.js";
import { client_db } from "../database.js";
import localizations from "../localizations.js";
import { animation } from "../wheel_anim.js";

function weighted_random(options: string | any[]) {
    var i;

    var weights = [options[0].weight];

    for (i = 1; i < options.length; i++)
        weights[i] = options[i].weight + weights[i - 1];
    
    var random = Math.random() * weights[weights.length - 1];
    
    for (i = 0; i < weights.length; i++)
        if (weights[i] > random)
            break;
    
    return options[i].item;
}

function get_random_emotes() {
    let emotes = [
        ":peach:",
        ":man_bowing",
        ":farmer:",
        ":kiss:",
        ":wheel:",
        ":wheelchair:"
    ]
    //shuffle the array
    for (let i = emotes.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [emotes[i], emotes[j]] = [emotes[j], emotes[i]];
    }
    //return the first 5 in a string
    return emotes.slice(0, 5).join("");
}

export default {
    data: new SlashCommandBuilder()
        .setName("store")
        .setDescription("Opens the store!"),
    async execute(interaction: any) {
        let shopEmbed = new EmbedBuilder()
            .setTitle("Store")
            .setDescription("Welcome to the store! Here you can buy items to help you in your journey!")
            .addFields(
                {name: "Peach box", value: "1 Peach", inline: true},
                {name: "Biiig Mystery Box", value: "50k XP", inline: true},
                {name: "Pretty In Pink", value: "30 Peaches", inline: true},
                {name: "Huge Trap", value: "250k XP", inline: true},
                {name: "Horny Hole", value: "100k XP", inline: true},
                {name: "Grind Wheel", value: "10k XP", inline: true},
                {name: "Peach Wheel", value: "9 Peaches", inline: true},
                {name: "Loser Wheel~", value: "3 Peaches", inline: true},
            )
            .setFooter({text: "Don't spend too much, slut~"});
            const user_data = await client_db.user.findUnique({
                where: {
                    id: parseInt(interaction.user.id)
                }
            })
        if (!user_data) {await interaction.reply({content: "You don't have a profile yet, this is a bug.", ephemeral: true}); return;}
        let peach_box_button = new ButtonBuilder()
            .setCustomId("peach_box")
            .setLabel("Peach Box")
            .setStyle(ButtonStyle.Primary)
            .setEmoji("🍑")
            .setDisabled(user_data.peaches < 1);
        let big_mystery_box_button = new ButtonBuilder()
            .setCustomId("big_mystery_box")
            .setLabel("Big Mystery Box")
            .setStyle(ButtonStyle.Primary)
            .setEmoji("🎁")
            .setDisabled(user_data.xp < 50000);
        let pretty_in_pink_button = new ButtonBuilder()
            .setCustomId("pretty_in_pink")
            .setLabel("Pretty In Pink")
            .setStyle(ButtonStyle.Primary)
            .setEmoji("🎀")
            .setDisabled(user_data.peaches < 30);
        let huge_trap_button = new ButtonBuilder()
            .setCustomId("huge_trap")
            .setLabel("Huge Trap")
            .setStyle(ButtonStyle.Primary)
            .setEmoji("🪤")
            .setDisabled(user_data.xp < 250000);
        let horny_hole_button = new ButtonBuilder()
            .setCustomId("horny_hole")
            .setLabel("Horny Hole")
            .setStyle(ButtonStyle.Primary)
            .setEmoji("🕳️")
            .setDisabled(user_data.xp < 100000);
        let grind_wheel_button = new ButtonBuilder()
            .setCustomId("grind_wheel")
            .setLabel("Grind Wheel")
            .setStyle(ButtonStyle.Primary)
            .setEmoji("🎡")
            .setDisabled(user_data.xp < 10000);
        let peach_wheel_button = new ButtonBuilder()
            .setCustomId("peach_wheel")
            .setLabel("Peach Wheel")
            .setStyle(ButtonStyle.Primary)
            .setEmoji("🎡")
            .setDisabled(user_data.peaches < 9);
        let loser_wheel_button = new ButtonBuilder()
            .setCustomId("loser_wheel")
            .setLabel("Loser Wheel~")
            .setStyle(ButtonStyle.Primary)
            .setEmoji("🎡")
            .setDisabled(user_data.peaches < 3 || true);
            //TODO: remove true statement when the wheel is done

        const row_1 = new ActionRowBuilder()
            .addComponents(peach_box_button, big_mystery_box_button, pretty_in_pink_button);
        const row_2 = new ActionRowBuilder()
            .addComponents(huge_trap_button, horny_hole_button, grind_wheel_button);
        const row_3 = new ActionRowBuilder()
            .addComponents(peach_wheel_button, loser_wheel_button);

        const resp = await interaction.reply({embeds: [shopEmbed], components: [row_1, row_2, row_3], ephemeral: false});
        const collectorFilter = (i: { user: { id: any; }; }) => i.user.id === interaction.user.id;
        let option;
        try {
            option = await resp.awaitMessageComponent({filter: collectorFilter, time: 60000}) as MessageComponentInteraction;
        } catch (e) {
            await interaction.editReply({content: "Shop window expired.", components: [], embeds: []});
            return;
        }
        switch (option.customId) {
            case "peach_box":
                await option.deferUpdate();
                //take 1 peach from the user as payment, and award 10k xp
                await client_db.user.update({
                    where: {
                        id: parseInt(interaction.user.id)
                    },
                    data: {
                        peaches: {
                            decrement: 1
                        },
                        xp: {
                            increment: 10000
                        }
                    }
                });
                await option.editReply({content: "You bought a peach box! You got 10k xp!", components: [], embeds: []});
                break;
            case "big_mystery_box":
                await option.deferUpdate();
                //take 50k xp from the user as payment, this is a fucking scam lol
                await client_db.user.update({
                    where: {id: parseInt(interaction.user.id)},
                    data: {
                        xp: {
                            decrement: 50000
                        }
                    }
                });
                await client_db.server.update({
                    where: {id: "SERVER"},
                    data: {community_pool: {increment: 50000}}
                })
                await option.editReply({content: "Hehehe, fucking idiot~", components: [], embeds: []});
                break;
            case "pretty_in_pink":
                await option.deferUpdate();
                await client_db.user.update({
                    where: {id: parseInt(interaction.user.id)},
                    data: {
                        xp: {
                            decrement: 300000
                        }
                    }
                });
                await option.editReply({content: "Awww, you look so pretty like that~ (Message Coco for a special role ;p)", components: [], embeds: []});
                break;
            case "huge_trap":
                await option.deferUpdate();
                //take 50k xp from the user as payment, this is a fucking scam lol
                await client_db.user.update({
                    where: {id: parseInt(interaction.user.id)},
                    data: {
                        xp: {
                            decrement: 250000
                        }
                    }
                });
                await client_db.server.update({
                    where: {id: "SERVER"},
                    data: {community_pool: {increment: 250000}}
                })
                await option.editReply({content: "Wow, you're fucking braindead~", components: [], embeds: []});
                break;
            case "horny_hole":
                await option.deferUpdate();
                //take 50k xp from the user as payment, this is a fucking scam lol
                await client_db.user.update({
                    where: {id: parseInt(interaction.user.id)},
                    data: {
                        xp: {
                            decrement: 100000
                        }
                    }
                });
                await client_db.server.update({
                    where: {id: "SERVER"},
                    data: {community_pool: {increment: 100000}}
                })
                await option.editReply({content: "Dumbass horny gooner~", components: [], embeds: []});
                break;

            case "grind_wheel":
                await option.deferUpdate();
                await client_db.user.update({
                    where: {id: parseInt(interaction.user.id)},
                    data: {
                        xp: {
                            decrement: 10000
                        }
                    }
                });
                
                let weights = [{
                    item: "peach",
                    weight: 9
                }, {
                    item: "peach_pals",
                    weight: 3,
                }, {
                    item: "peach_farmer",
                    weight: 1
                }, {
                    item: "trap",
                    weight: 9
                }, {
                    item: "good",
                    weight: 9
                }, {
                    item: "super",
                    weight: 3
                }]
                let result = weighted_random(weights);
                //await a timeout to make it look like it's rolling
                await option.editReply({content: "Rolling the wheel~", components: [], embeds: []});
                await new Promise(r => setTimeout(r, 2000));
                //for (let i = 0; i < 6; i++) {
                //    await option.editReply({content: get_random_emotes(), components: [], embeds: []});
                //    await new Promise(r => setTimeout(r, 500));
                //}
                //TODO: Cool animation for the wheela
                await animation(option, weights, result);
                switch (result) {
                    case "peach":
                        await client_db.user.update({
                            where: {id: parseInt(interaction.user.id)},
                            data: {
                                peaches: {
                                    increment: 1
                                }
                            }
                        });
                        await option.editReply({content: localizations.wheels.grind.peach, components: [], embeds: []});
                        break;
                    case "peach_pals":
                        await client_db.user.update({
                            where: {id: parseInt(interaction.user.id)},
                            data: {
                                peaches: {
                                    increment: 3
                                }
                            }
                        });
                        await option.editReply({content: localizations.wheels.grind.pals, components: [], embeds: []});
                        break;
                    case "peach_farmer":
                        await client_db.user.update({
                            where: {id: parseInt(interaction.user.id)},
                            data: {
                                peaches: {
                                    increment: 5
                                }
                            }
                        });
                        await option.editReply({content: localizations.wheels.grind.farmer, components: [], embeds: []});
                        break;
                    case "trap":
                        //decrease xp by 5k, making sure it doesn't go below 0
                        await client_db.user.update({
                            where: {id: parseInt(interaction.user.id)},
                            data: {
                                xp: {
                                    decrement: Math.min(5000, user_data.xp)
                                }
                            }
                        });
                        await option.editReply({content: localizations.wheels.grind.unlucky, components: [], embeds: []});
                        break;
                    case "good":
                        //increase xp by 11k
                        await client_db.user.update({
                            where: {id: parseInt(interaction.user.id)},
                            data: {
                                xp: {
                                    increment: 11000
                                }
                            }
                        });
                        await option.editReply({content: localizations.wheels.grind.lucky, components: [], embeds: []});
                        break;
                    case "super":
                        //increase xp by 20k
                        await client_db.user.update({
                            where: {id: parseInt(interaction.user.id)},
                            data: {
                                xp: {
                                    increment: 20000
                                }
                            }
                        });
                        await option.editReply({content: localizations.wheels.grind.very, components: [], embeds: []});
                        break;
                }
                //ping the user
                
                return
                
            case "peach_wheel":
                await option.deferUpdate();
                await client_db.user.update({
                    where: {id: parseInt(interaction.user.id)},
                    data: {
                        peaches: {
                            decrement: 9
                        }
                    }
                });
                let pweights = [{
                    item: "scammed",
                    weight: 9
                }, {
                    item: "huge",
                    weight: 1,
                }, {
                    item: "win",
                    weight: 9
                }, {
                    item: "edged",
                    weight: 9
                }, {
                    item: "dom",
                    weight: 9
                }, {
                    item: "total",
                    weight: 1
                }]
                let presult = weighted_random(pweights);
                await option.editReply({content: "Rolling the wheel~", components: [], embeds: []});
                await new Promise(r => setTimeout(r, 2000));
                //for (let i = 0; i < 6; i++) {
                //    await option.editReply({content: get_random_emotes(), components: [], embeds: []});
                //    await new Promise(r => setTimeout(r, 500));
                //}
                await animation(option, pweights, presult);
                switch (presult) {
                    case "scammed":
                        //lose 50k
                        await client_db.user.update({
                            where: {id: parseInt(interaction.user.id)},
                            data: {
                                xp: {
                                    decrement: 50000
                                }
                            }
                        });
                        await option.editReply({content: localizations.wheels.peach.scammed, components: [], embeds: []});
                        break;
                    case "huge":
                        await client_db.user.update({
                            where: {id: parseInt(interaction.user.id)},
                            data: {
                                xp: {
                                    decrement: 200000
                                }
                            }
                        });
                        await option.editReply({content: localizations.wheels.peach.huge, components: [], embeds: []});
                        break;
                    case "win":
                        await client_db.user.update({
                            where: {id: parseInt(interaction.user.id)},
                            data: {
                                xp: {
                                    increment: 50000
                                }
                            }
                        });
                        await option.editReply({content: localizations.wheels.peach.win, components: [], embeds: []});
                        break;
                    case "edged":
                        await client_db.user.update({
                            where: {id: parseInt(interaction.user.id)},
                            data: {
                                xp: {
                                    increment: 100000
                                }
                            }
                        });
                        await option.editReply({content: localizations.wheels.peach.edge, components: [], embeds: []});
                        break;
                    case "dom":
                        await client_db.user.update({
                            where: {id: parseInt(interaction.user.id)},
                            data: {
                                xp: {
                                    increment: 180000
                                }
                            }
                        });
                        await option.editReply({content: localizations.wheels.peach.dom, components: [], embeds: []});
                        break;
                    case "total":
                        await client_db.user.update({
                            where: {id: parseInt(interaction.user.id)},
                            data: {
                                xp: {
                                    increment: 180000
                                }
                            }
                        });
                        await option.editReply({content: localizations.wheels.peach.total, components: [], embeds: []});
                        break;
                }
                return;

        }
        
    }
}