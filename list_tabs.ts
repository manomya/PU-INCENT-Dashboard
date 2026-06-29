import { google } from "googleapis";
import path from "path";

const SCOPES = [
  "https://www.googleapis.com/auth/spreadsheets",
  "https://www.googleapis.com/auth/drive",
];

const credentialsPath = path.join(process.cwd(), "credentials/service-account.json");

const auth = new google.auth.GoogleAuth({
  keyFile: credentialsPath,
  scopes: SCOPES,
});

const SHEET_ID = "1wWCxLnNGoKZNQMrOd8ZRfdACdVxSK21F9eUM_1uH9oA";

async function listTabs() {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: "v4", auth: client as any });

  const response = await sheets.spreadsheets.get({
    spreadsheetId: SHEET_ID,
  });

  const tabs = response.data.sheets?.map(s => s.properties?.title);
  console.log("TABS:", tabs);
}

listTabs().catch(console.error);
