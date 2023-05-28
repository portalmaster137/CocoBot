import { REST, RESTPostAPIChatInputApplicationCommandsJSONBody, Routes } from "discord.js";
import commands from "./commands/all_commands.js";
import dotenv from "dotenv";
dotenv.config();

let builders: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];

commands.forEach((cmd)=>{
    builders.push(cmd.data.toJSON());
})

const rest = new REST().setToken(process.env.TOKEN as string);
(async () => {
    try {
        console.log("Started refreshing application (/) commands.");
        const data = await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID as string, process.env.GUILD_ID as string),
            { body: builders },
        );
        console.log("Successfully reloaded application (/) commands.", data);
    } catch (e) {
        console.error(e);
    }
})();