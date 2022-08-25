// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });



const functions = require('firebase-functions');
const scrapeWebsite = require('./pptr');

exports.scrape = functions
  .runWith({
    timeoutSeconds: 120,
    memory: '512MB' || '2GB',
  })
  .region('us-central1')
  .https.onRequest(async (req, res) => {
    const stories = await scrapeWebsite();
    res.type('html').send(stories.join('<br>'));
  });

exports.scrapingSchedule = functions.pubsub
  .schedule('09:00')
  .timeZone('America/New_York')
  .onRun(async (context) => {
    const stories = await scrapeWebsite();
    console.log('The NYT headlines are scraped every day at 9 AM EST', stories);
    return null;
  });