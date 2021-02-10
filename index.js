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
var collectors_by_channel = new Array();

client.on('ready', () => {
    client.user.setActivity("Informative blurb here");
    //check any card_message attributes and initialize collectors again (crash defense)
});

client.on('guildCreate', (guild) => {
  // Client has joined a guild. Prompt for initial setup steps.
    // Does the guild already exist? (check first)
    
    //If the guild does not exist, add it.
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
    client.users.fetch(guild.owner).then(u => {
        u.send('Thanks for adding Consentbot! Please review the readme for next setup steps: https://github.com/aletson/consentbot/blob/main/README.md');
    });
});

client.on('message', async (message) => {
    if (message.channel.type != 'dm') {
        
    } else {
        if (command_pattern.test(message.content)) {
            var command = message.content.substr(message.content.indexOf(' ')+1);
            if (command.substr(0, message.content.indexOf(' ')) == 'modrole') {
                var params = {
                    TableName: table,
                    Key:{
                        "guild_id": message.guild.id
                    },
                    UpdateExpression: "set mod_role = :r",
                    ExpressionAttributeValues:{
                        ":r":message.mentions.roles.first.id
                    },
                    ReturnValues: "UPDATED_NEW"
                };
                dynamo_client.update(params, function(err, data) {
                    if(err) {
                        console.error(JSON.stringify(err, null, 2));
                    } else {
                        message.react('✅');
                    }
                }); // end modrole command!
            } else if (command.substr(0, message.content.indexOf(' ')) == 'pingchannel') {
                var params = {
                    TableName: table,
                    Key:{
                        "guild_id": message.guild.id
                    },
                    UpdateExpression: "set ping_channel = :c",
                    ExpressionAttributeValues:{
                        ":c":message.mentions.channels.first.id
                    },
                    ReturnValues: "UPDATED_NEW"
                };
                dynamo_client.update(params, function(err, data) {
                    if(err) {
                        console.error(JSON.stringify(err, null, 2));
                    } else {
                        message.react('✅');
                    }
                }); // end pingchannel command!
            } else if (command.substr(0, message.content.indexOf(' ')) == 'cardchannel') {
                var card_message = await message.mentions.channels.first.send('Placeholder text for reacting for cards');
                await card_message.react('🟢');
                await card_message.react('🟡');
                await card_message.react('🔴');
                
                //set up listener using awaitreactions or createreactioncollector or do a generalized on('messageReactionAdd') listener
                
                var params = {
                    TableName: table,
                    Key:{
                        "guild_id": message.guild.id
                    },
                    UpdateExpression: "set card_channel = :c, card_message = :m",
                    ExpressionAttributeValues:{
                        ":c":message.mentions.channels.first.id,
                        ":m":card_message.id
                    },
                    ReturnValues: "UPDATED_NEW"
                };
                dynamo_client.update(params, function(err, data) {
                    if(err) {
                        console.error(JSON.stringify(err, null, 2));
                    } else {
                        message.react('✅');
                    }
                }); // end cardchannel command!
            } else if (command.substr(0, message.content.indexOf(' ')) == 'lineschannel') {
                var lines_message = await messages.mentions.channels.first.send('Placeholder text for what lines are');
                var params = {
                    TableName: table,
                    Key:{
                        "guild_id": message.guild.id
                    },
                    UpdateExpression: "set lines_channel = :c",
                    ExpressionAttributeValues:{
                        ":c":message.mentions.channels.first.id
                    },
                    ReturnValues: "UPDATED_NEW"
                };
                dynamo_client.update(params, function(err, data) {
                    if(err) {
                        console.error(JSON.stringify(err, null, 2));
                    } else {
                        message.react('✅');
                    }
                }); // end lineschannel command!
            }
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
