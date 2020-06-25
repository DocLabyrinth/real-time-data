## Realtime Dashboard Demo

This is a quick demo of a basic dashboard built using the [Google Realtime Reporting API](https://developers.google.com/analytics/devguides/reporting/realtime/v3/devguide) and [Nivo](https://nivo.rocks/).

### Google Auth

At the time of writing, the real time reporting API is in closed beta. You can get automatically approved, but requests will fail before you are approved. The auth scope is the same as the one for the analytics api for now at least.

The app uses the javascript auth flow for websites, so you'll need to create your own app, credentials and project in google cloud enable the Analytics API on the project and replace the values in [the constants file](src/constants.ts) with the relevant google auth values. The view ID is the ID of the analytics view, which is buried in the Admin section of the Google Analytics control panel. Once that's done you'll need to make sure that http://localhost:3000/ (note the trailing slash) is authorized as a redirect URL for the credentials you created. If all that is in place then the app should be able to authenticate and make requests.

### Running the app

Check out the repo and run:

```
yarn install
yarn start

```

Load up http://localhost:3000. The graphs may take a few seconds to populate. Visit the website for which you've set up the analytics view and credentials and you should see the graph update in real time. Once you close the window the API takes a while to mark you as no longer active, but the graph should eventually update.
