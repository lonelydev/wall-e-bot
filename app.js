const security = require('./security');
const axios = require('axios');
const db = require('./db');

const signingSecret = process.env.SLACK_SIGNING_SECRET;
const token = process.env.SLACK_BOT_TOKEN;

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
    if (security.validateSlackRequest(event, signingSecret)){
        const body = JSON.parse(event.body);
        switch(body.type){
            case "url_verification": callback(null, body.challenge); console.log(body); break;
            case "event_callback": processRequest(body, callback); break;
            default: callback(null);
        }
    }else callback("verfication failed");
};

const processRequest = (body, callback) => {
    switch(body.event.type){
        case "message": processMessages(body, callback); break;
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