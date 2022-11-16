const env = require('./env');
const {WebClient} = require('@slack/web-api')

const token = env('SLACK_TOKEN')
const channel = env('SLACK_CHANNEL')

const client = new WebClient(token)

module.exports = async (sub) => {
  await client.chat.postMessage({
    text: 'New CV submission',
    blocks: [{
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: 'New CV submission'
      }
    }, {
      type: 'section',
      fields: [{
        type: 'mrkdwn',
        text: '*Name*\n' + sub.name
      }, {
        type: 'mrkdwn',
        text: '*Email*\n' + sub.email
      }, {
        type: 'mrkdwn',
        text: '*Job*\n' + sub.job
      }, {
        type: 'mrkdwn',
        text: '*GitHub*\n' + sub.github
      }]
    }],
    channel,
  })

  let cv = sub.cv
  if(cv && cv.startsWith('data:application/pdf;base64,')) {
    await client.files.uploadV2({
      channel_id: channel,
      filename: `CV ${sub.name}.pdf`,
      file: Buffer.from(cv.substring(cv.indexOf(',')), 'base64')
    })
  }
}
