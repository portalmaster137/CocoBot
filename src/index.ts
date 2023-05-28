import { ActivityType, Client, Events, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();

import commands from './commands/all_commands.js';
import { PrismaClient } from '@prisma/client';
import { setup_client } from './database.js';
import { handle_message, thread_tick } from './seduce_thread_manager.js';
import chalk from "chalk";
import { set_client } from './client_handle.js';
import localizations from './localizations.js';

const client = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers]});

const prisma = new PrismaClient();

setup_client(prisma);

let status = localizations.status;
let current_status = "";

function st_status() {
    let new_status = status[Math.floor(Math.random() * status.length)];
    if (new_status === current_status) {
        st_status();
    } else {
        current_status = new_status;
        console.log(localizations.set_status + current_status)
        client.user?.setPresence({
            activities: [{name: current_status, type: ActivityType.Watching}],
            status: "online"
        })
    }
}

client.once('ready', ()=>{
    set_client(client);
    st_status();
    setInterval(st_status, 180000);

    client.guilds.cache.forEach(async (guild)=>{
        guild.roles.cache.forEach(async (role)=>{
            //console.log(chalk.greenBright(`Found role: ${role.name}, with id: ${role.id} in guild: ${guild.name}`))
        })
    })

    console.log("Ready!");
})

setInterval(()=>{
    thread_tick();
    //console.log("tick")
}, 1000)

client.on(Events.MessageCreate, async (message)=>{
    handle_message(message);
})

client.on('interactionCreate', async (interaction)=>{
    if(!interaction.isCommand()) return;
    const command = commands.find(cmd=>cmd.data.name === interaction.commandName);
    let _user = await prisma.user.findUnique({
        where: {
            id: parseInt(interaction.user.id)
        }
    })
    if(!_user) {
        await prisma.user.create({
            data: {
                id: parseInt(interaction.user.id),
                username: interaction.user.username,
            }
        })
    } else if (!_user.username || _user.username !== interaction.user.username) {
        await prisma.user.update({
            where: {
                id: parseInt(interaction.user.id)
            },
            data: {
                username: interaction.user.username
            }
        })
        console.log("Updated username for user: " + interaction.user.id)
    }
    //console.log(_user)
    if(!command) return;
    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({content: localizations.execution_error, ephemeral: true});
    }
})

process.on('SIGINT', async ()=>{
    await prisma.$disconnect();
    process.exit();
})

client.login(process.env.TOKEN);