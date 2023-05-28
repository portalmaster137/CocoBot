import { Message } from "discord.js";
import { client_db } from "./database.js";
import chalk from "chalk";
import { client } from "./client_handle.js";

let thread_lists: Thread[] = [];

class Thread {
    id: number;
    user: any;
    target: any;
    last_msg: Date = new Date();
    thread_obj: any;
    constructor(id: number, user: any, target: any, thread_obj: any) {
        this.id = id;
        this.user = user;
        this.target = target;
        this.thread_obj = thread_obj;
    }
}

function add_thread(thread: number, user: any, target: any, thread_object: any) {
    thread_lists.push(new Thread(thread, user, target, thread_object));
    thread_lists.forEach((t)=>{
        console.log(t.id)
    })
}

async function handle_message(message: Message<boolean>) {
    if (message.author.bot) return;
    let hundred_char_count = Math.floor(message.content.length);
    if (hundred_char_count > 0) {
        console.log(chalk.blue(`Adding ${hundred_char_count} XP to ${message.author.username}`))
        let user_db = await client_db.user.findUnique({where:{id: parseInt(message.author.id)}});
        if (user_db) {
            if (user_db.xp < 0) {
                //message.member?.setNickname("Debt Piggy~")
            }
            await client_db.user.update({
                where: {
                    id: parseInt(message.author.id)
                },
                data: {
                    xp: user_db.xp + hundred_char_count
                }
            })
        }
        
    }
    let thread = thread_lists.find((t)=>t.id.toString() === message.channel.id);
    //console.log(thread)
    if (!thread) return;
    thread.last_msg = new Date();
    console.log(message.content)
    if (message.author.id === thread.user.id || message.author.id === thread.target.id) {
    } else {
        await message.delete();
    }
    if (message.content.toLowerCase().includes("!surrender")) {
        let loser = message.author;
        //let the winner be the other person
        let winner;
        if (loser.id === thread.user.id) {
            winner = thread.target;
        } else {
            winner = thread.user;
        }
        thread.thread_obj.send(`${winner} has won, and ${loser} has lost!`);
        let winner_db = await client_db.user.findUnique({where:{id: parseInt(winner.id)}});
        let loser_db = await client_db.user.findUnique({where:{id: parseInt(loser.id)}});
        if (!winner_db || !loser_db) {
            thread.thread_obj.send("There was an error getting the winner or loser's data, this is a bug. Please contact Porta :)");
            return;
        }
        //since we surrender, we transfer %50 of our xp to the winner
        let xp_to_transfer = Math.floor(loser_db.xp / 2);
        let new_winner_xp = winner_db.xp + xp_to_transfer;
        let new_loser_xp = loser_db.xp - xp_to_transfer;
        if (new_loser_xp < 0) {new_loser_xp = 0;}
        await client_db.user.update({
            where: {
                id: parseInt(winner.id)
            },
            data: {
                xp: new_winner_xp
            }
        });
        await client_db.user.update({
            where: {
                id: parseInt(loser.id)
            },
            data: {
                xp: new_loser_xp
            }
        });
        await thread.thread_obj.send(`${winner} has gained ${xp_to_transfer} XP, and now has ${new_winner_xp} XP!`);
        await thread.thread_obj.send(`${loser} has lost ${xp_to_transfer} XP, and now has ${new_loser_xp} XP!`);
        thread.thread_obj.setLocked(true);
    } else if (message.content.toLowerCase().includes("!lose")) {
        let loser = message.author;
        //let the winner be the other person
        let winner;
        if (loser.id === thread.user.id) {
            winner = thread.target;
        } else {
            winner = thread.user;
        }
        thread.thread_obj.send(`${winner} has won, and ${loser} has lost!`);
        let winner_db = await client_db.user.findUnique({where:{id: parseInt(winner.id)}});
        let loser_db = await client_db.user.findUnique({where:{id: parseInt(loser.id)}});
        if (!winner_db || !loser_db) {
            thread.thread_obj.send("There was an error getting the winner or loser's data, this is a bug. Please contact Porta :)");
            return;
        }
        //since we got drained, we transfer %100 of our xp to the winner
        let xp_to_transfer = loser_db.xp;
        let new_winner_xp = winner_db.xp + xp_to_transfer;
        let new_loser_xp = 0
        await client_db.user.update({
            where: {
                id: parseInt(winner.id)
            },
            data: {
                xp: new_winner_xp
            }
        });
        await client_db.user.update({
            where: {
                id: parseInt(loser.id)
            },
            data: {
                xp: new_loser_xp
            }
        });
        await thread.thread_obj.send(`${winner} has gained ${xp_to_transfer} xp, and now has ${new_winner_xp} xp!`);
        await thread.thread_obj.send(`${loser} has lost ${xp_to_transfer} xp, and now has ${new_loser_xp} xp!`);
        thread.thread_obj.setLocked(true);
    } else if (message.content.toLowerCase().includes("!drained")) {
        let loser = message.author;
        //let the winner be the other person
        let winner;
        if (loser.id === thread.user.id) {
            winner = thread.target;
        } else {
            winner = thread.user;
        }
        let winner_db = await client_db.user.findUnique({where:{id: parseInt(winner.id)}});
        let loser_db = await client_db.user.findUnique({where:{id: parseInt(loser.id)}});
        if (!winner_db || !loser_db) {
            thread.thread_obj.send("There was an error getting the winner or loser's data, this is a bug. Please contact Porta :)");
            return;
        }
        //since we got drained, we transfer %10 of our xp to the winner
        let xp_to_transfer = Math.floor(loser_db.xp / 10);
        let new_winner_xp = winner_db.xp + xp_to_transfer;
        let new_loser_xp = loser_db.xp - xp_to_transfer;
        if (new_loser_xp < 0) {new_loser_xp = 0;}
        await client_db.user.update({
            where: {
                id: parseInt(winner.id)
            },
            data: {
                xp: new_winner_xp
            }
        });
        await client_db.user.update({
            where: {
                id: parseInt(loser.id)
            },
            data: {
                xp: new_loser_xp
            }
        });
        await thread.thread_obj.send(`${loser} has lost ${xp_to_transfer} xp to ${winner}!`);
    }
}

function thread_tick() {
    thread_lists.forEach((t)=>{
        if ((Date.now() - t.last_msg.getTime()) > 600000) {
            console.log("Deleting thread " + t.id)
            t.thread_obj.delete();
            thread_lists.splice(thread_lists.indexOf(t), 1);
        }
    })
}

export { add_thread, thread_lists, handle_message, thread_tick };