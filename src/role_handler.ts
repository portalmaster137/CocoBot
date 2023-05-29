import { GuildMember, User } from "discord.js";
import { client_db } from "./database.js";
import { Role } from "@prisma/client";

let role_db: Role[];

async function init() {
    role_db = await client_db.role.findMany();
    console.log(role_db);
}

async function update_user_roles(user: GuildMember){
    if (!role_db) return;
    let user_db = await client_db.user.findUnique({where: {id: parseInt(user.id)}});
    if (!user_db) return;
    //so, we need to get the highest role in the role_db that the user has enough xp for
    let highest_role: Role | undefined;
    for (let i = 0; i < role_db.length; i++) {
        if (user_db.xp >= role_db[i].min_xp) {
            highest_role = role_db[i];
        }
    }
    if (!highest_role) return;
    //first, get a list of all the roles the user has, thats also in the role_db
    let user_roles = user.roles.cache.filter(role => role_db.find(db_role => db_role.id === role.id));
    //now, we need to remove all of these roles
    user_roles.forEach(async (role)=>{
        await user.roles.remove(role);
        //console.log(`Removed role: ${role.name} from user: ${user.user.username}`);
    })
    //now, we need to add the role
    await user.roles.add(highest_role.id);
    //console.log(`Added role: ${highest_role.name} to user: ${user.user.username}`);
    
}

export { init, update_user_roles }