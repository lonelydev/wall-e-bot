const security = require('./security');
const axios = require('axios');
const db = require('./db');
const dotenv = require('dotenv');
import { App } from "@slack/bolt";


dotenv.config();

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    appToken: process.env.SLACK_APP_TOKEN,
    port: process.env.PORT || 3000
});

const signingSecret = process.env.SLACK_SIGNING_SECRET;
const token = process.env.SLACK_BOT_TOKEN;


// This will match any message that contains 👋
app.message(':wave:', async ({ message, say }) => {
    // Handle only newly posted messages here
    if (message.subtype === undefined
      || message.subtype === 'bot_message'
      || message.subtype === 'file_share'
      || message.subtype === 'thread_broadcast') {
      await say(`Hello, <@${message.user}>`);
    }
  });

app.event('app_mention', async({event, client, logger}) => {
    try{
        const result = await client.chat.postMessage({
            channel: event.channel,
            text: `Received your mention! Thank you <@${event.user.id}>! 🎉`
        });
        logger.info(result);
    }
    catch(error){
        logger.error(error);
    }
});

/**
 * 
 * @param {*} event
 *  slack post request with additional properties
 * @param {*} context 
 * nodejs context
 * @param {*} callback
 * function that accepts two argument, error and data
 * response must be compatible with json stringify 
 */
exports.handler = (event, context, callback) => {
    console.log(`Received event:${event} with context:${context}`);
    if (security.validateSlackRequest(event, signingSecret)){
        const body = JSON.parse(event.body);
        switch(body.type){
            case "url_verification": callback(null, body.challenge); console.log(body); break;
            //case "event_callback": processRequest(body, callback); break;
            default: callback(null);
        }
    }else callback("Verification failed");
};

const processRequest = (body, callback) => {
    switch(body.event.type){
        case "app_mention": processAppMention(body, callback); break;
        default: callback(null);
    }
}

const processMessages = (body, callback) => {
    console.debug("message:", body.event.text);
    callback(null);
}

const processAppMention = (body, callback) => {
    const item = body.event.text.split(":").pop().trim();
    db.saveItem(item, (error, result) => {
        if(error!==null) {
            callback(null);
        } else {
            const message = {
                channel: body.event.channel,
                text: `Item: \`${item}\` is saved to *Amazon DynamoDB*!"`
            };
            axios({
                method: 'post',
                url: 'https://slack.com/api/chat.postMessage',
                headers: { 
                    'Content-Type': 'application/json; charset=utf-8',
                    'Authorization': `Bearer ${token}`
                    },
                data: message
            })
            .then((response) => {
                callback(null);
            })
            .catch((error) => {
                callback("failed to process app_mention");
            });
        }
    })
}