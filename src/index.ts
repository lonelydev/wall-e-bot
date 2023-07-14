import { Context, APIGatewayProxyResult, APIGatewayEvent, Handler } from 'aws-lambda';
import { App, AwsLambdaReceiver, GenericMessageEvent, LogLevel } from "@slack/bolt";

// Initialize your custom receiver
// https://github.com/slackapi/bolt-js/blob/main/examples/deploy-aws-lambda/app.js
const awsLambdaReceiver = new AwsLambdaReceiver({
    signingSecret: process.env.SLACK_SIGNING_SECRET,
  });
  
const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    appToken: process.env.SLACK_APP_TOKEN,
    port: Number(process.env.PORT) || 3000,
    logLevel: LogLevel.DEBUG,
    receiver: awsLambdaReceiver
});

// Listens to incoming messages that contain "hello"
app.message('hello', async ({ message, say }) => {
    var genericMessageEvent = message as GenericMessageEvent;
    // say() sends a message to the channel where the event was triggered
    await say({
      blocks: [
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": `Hey there <@${genericMessageEvent.user}>!`
          },
          "accessory": {
            "type": "button",
            "text": {
              "type": "plain_text",
              "text": "Click Me"
            },
            "action_id": "button_click"
          }
        }
      ],
      text: `Hey there <@${genericMessageEvent.user}>!`
    });
  });


app.event('app_mention', async({event, client, logger}) => {
    try{
        const result = await client.chat.postMessage({
            channel: event.channel,
            text: `Received your mention! Thank you <@${event.user}>! 🎉`
        });
        logger.info(result);
    }
    catch(error){
        logger.error(error);
    }
});

/***
 * Some resources to get you started on this:
 * https://docs.aws.amazon.com/lambda/latest/dg/typescript-handler.html
 * 
 */
export const handler: Handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
    try{
        console.log(`Event: ${JSON.stringify(event, null, 2)}`);
        console.log(`Context: ${JSON.stringify(context, null, 2)}`);
        const handler = await awsLambdaReceiver.start();
    } catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'some error happened',
            }),
        };
    }
};
