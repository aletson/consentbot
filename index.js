/*jslint es6*/
const Discord = require('discord.js');
const client = new Discord.Client();
var http = require('http');
var Router = require('router');
var finalhandler = require('finalhandler');
var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1'
});
var dynamo_client = new AWS.DynamoDB.DocumentClient();
var table = process.env.table_name;

client.login(process.env.app_token);

var command_pattern = /^!consentbot\ (.*)$/im;

client.on('ready', () => {
    client.user.setActivity("Informative blurb here");
});

client.on('guildCreate', (guild) => {
  // Client has joined a guild. Prompt for initial setup steps.
    var params = {
        TableName: table,
        Item:{
            "guild_id": guild.id
        }
    };
    dynamo_client.put(params, function(err, data) {
        if(err) {
            console.error(JSON.stringify(err, null, 2));
        }
    });
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
