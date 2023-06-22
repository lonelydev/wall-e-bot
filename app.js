const security = require('./security');

const signingSecret = process.env.SLACK_SIGNING_SECRET;

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
    console.debug("message", body.event.text);
    callback(null);
}