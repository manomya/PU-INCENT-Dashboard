const { google } = require('googleapis');
const auth = new google.auth.GoogleAuth({
  keyFile: 'credentials/service-account.json',
  scopes: ['https://www.googleapis.com/auth/spreadsheets']
});
async function run() {
  const client = await auth.getClient();
  const sheets = google.sheets({version: 'v4', auth: client});
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: '1wWCxLnNGoKZNQMrOd8ZRfdACdVxSK21F9eUM_1uH9oA',
    range: 'Master_Database 2026-27!1:1'
  });
  console.log(res.data.values[0]);
}
run();
