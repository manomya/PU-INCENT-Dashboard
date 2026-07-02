import { google } from "googleapis";
import path from "path";

const SCOPES = [
  "https://www.googleapis.com/auth/spreadsheets",
  "https://www.googleapis.com/auth/drive",
];

// Determine whether to use environment variables or local keyFile
const useEnvAuth = process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY;

export const auth = new google.auth.GoogleAuth(
  useEnvAuth
    ? {
        credentials: {
          client_email: process.env.GOOGLE_CLIENT_EMAIL,
          private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        },
        scopes: SCOPES,
      }
    : {
        keyFile: path.join(process.cwd(), "credentials/service-account.json"),
        scopes: SCOPES,
      }
);

const SHEET_ID = "1wWCxLnNGoKZNQMrOd8ZRfdACdVxSK21F9eUM_1uH9oA";

// Simple memory cache to prevent Google Sheets rate limits and speed up responses. 
// Set to 5 seconds so manual sheet edits reflect almost instantly on page refresh!
const CACHE: Record<string, { data: any[]; timestamp: number }> = {};
const CACHE_TTL = 5 * 1000; // 5 seconds in ms

export function clearSheetCache(sheetName: string) {
  if (CACHE[sheetName]) {
    delete CACHE[sheetName];
  }
}

export async function getSheetData(sheetName: string) {
  const currentTime = Date.now();

  if (CACHE[sheetName]) {
    const { data, timestamp } = CACHE[sheetName];
    if (currentTime - timestamp < CACHE_TTL) {
      return data;
    }
  }

  const client = await auth.getClient();
  const sheets = google.sheets({ version: "v4", auth: client as any });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: sheetName,
  });

  const rows = response.data.values;
  if (!rows || rows.length === 0) {
    return [];
  }

  const headers = rows[0] as string[];
  const data = rows.slice(1).map((row) => {
    const rowData: Record<string, any> = {};
    headers.forEach((header, index) => {
      rowData[header] = row[index] || "";
    });
    return rowData;
  });

  CACHE[sheetName] = { data, timestamp: currentTime };
  return data;
}
