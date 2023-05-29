import { MessageComponentInteraction } from "discord.js";

let wait = (ms: number) => new Promise((resolve, reject) => setTimeout(resolve, ms));

import localizations from "./localizations.js";
let store_items = localizations.store.items;

function get_human_text_from_id(id: string) {
    switch (id) {
        case "peach":
            return store_items.peach;
        case "peach_pals":
            return store_items.peach_pals;
        case "peach_farmer":
            return store_items.peach_farmer;
        case "trap":
            return store_items.trap;
        case "good":
            return store_items.good;
        case "super":
            return store_items.super;
        case "scammed":
            return store_items.scammed;
        case "huge":
            return store_items.huge;
        case "win":
            return store_items.win;
        case "edged":
            return store_items.edged;
        case "dom":
            return store_items.dom;
        case "total":
            return store_items.total;
        case "rainbow":
            return store_items.rainbow;
    }
}

function string_from_list_with_random_arrow(list: string[]) {
    let arrow_index = Math.floor(Math.random() * list.length);
    let string = "";
    list.forEach((item, index)=>{
        if (index === arrow_index) {
            string += "==>";
        }
        string += item + "\n";
    })
    return string;
}

function string_from_list_with_determined_Arrow(list: string[], arrow_pos: number) {
    let string = "";
    list.forEach((item, index)=>{
        if (index === arrow_pos) {
            string += "==>";
        }
        string += item + "\n";
    })
    return string;
}

//params
//option: MessageComponentInteraction
//choices: {name: string, value: string}[]
//result: string
async function animation(
    option: MessageComponentInteraction,
    choices: {item: string, weight: number}[],
    result: string
) {
    
    let choices_shuffled = choices.sort(()=>Math.random() - 0.5);
    //get just the names
    let choices_names = choices_shuffled.map((choice)=>choice.item);
    let human_names = choices_names.map((name)=>get_human_text_from_id(name)) as string[];
    //first, lets build the string
    //for a random amount of times, between 5, and 12
    let times = Math.floor(Math.random() * 7) + 5;
    for (let i = 0; i < times; i++) {
        let string = string_from_list_with_random_arrow(human_names);
        await option.editReply({content: string, components: []});
        await wait(1000);
    }
    //now, find our index of the result
    let result_index = choices_names.indexOf(result);
    let string = string_from_list_with_determined_Arrow(human_names, result_index);
    await option.editReply({content: string, components: []});
    await wait(3000);

}


export { animation}