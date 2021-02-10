/*jslint es6*/
const Discord = require('discord.js');
const client = new Discord.Client();
var http = require('http');
var Router = require('router');
var finalhandler = require('finalhandler');

client.login(process.env.app_token);

var command_pattern = /^!consentbot\ (.*)$/im;

var duels = [];

client.on('ready', () => {
    client.user.setActivity("Informative blurb here");
});

client.on('guildCreate', (guild) => {
  // Client has joined a guild. Prompt for initial setup steps.
});

client.on('message', async (message) => {
    if (message.channel.type != 'dm') {
        
    } else {
        if (command_pattern.test(message.content)) {
            var command = message.content.substr(message.content.indexOf(' ')+1);
            //Test this string to start with recognized commands
            //then substring it again as above to get the channel ID or role ID or whatever.
        }
    }

});

var router = Router();
router.get('/', function (req, res) {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end('consentbot\n');
});

var server = http.createServer(function (req, res) {
    router(req, res, finalhandler(req, res));
});
server.listen(process.env.PORT || 8080);
