import ping from './ping.js';
import motd from './motd.js';
import info from './info.js';
import give_xp from './give_xp.js';
import take_xp from './take_xp.js';
import give_peaches from './give_peaches.js';
import take_peaches from './take_peaches.js';
import set_motd from './set_motd.js';
import grind from './grind.js';
import seduce from './seduce.js';
import nuke_threads from './nuke_threads.js';
import leaderboard from './leaderboard.js';
import give from './give.js';
import store from './store.js';
import offer_loan from './offer_loan.js';
import loans from './loans.js';
import payback_loan from './payback_loan.js';
import given_loans from './given_loans.js';
import update_roles from './update_roles.js';

//make an iterable array of all the commands
let commands = [ping, motd, info, give_xp, take_xp, give_peaches, take_peaches, set_motd, grind, seduce, nuke_threads];
commands.push(leaderboard);
commands.push(give);
commands.push(store)
commands.push(offer_loan)
commands.push(loans)
commands.push(payback_loan)
commands.push(given_loans)
commands.push(update_roles)
export default commands;