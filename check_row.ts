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

async function checkData() {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: "v4", auth: client as any });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: "Master_Database 2026-27",
  });

  const rows = response.data.values;
  if (!rows || rows.length === 0) return;

  const headers = rows[0] as string[];
  const data = rows.slice(1).map((row) => {
    const rowData: Record<string, any> = {};
    headers.forEach((header, index) => {
      rowData[header] = row[index] || "";
    });
    return rowData;
  });

  const target = data.find(s => s["Startup Registration number"] === "PU-GCEC-2025-005");
  console.log("Target:", target);
}

checkData().catch(console.error);
