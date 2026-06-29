import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import path from "path";
import { clearSheetCache } from "@/lib/google-sheets";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

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
const TAB_NAME = "Master_Database 2026-27";

const HEADERS = [
  "Startup Registration number", "Startup Name", "Logo", "Domain", "Founder Name", 
  "Founder's Photo", "College Email", "Phone Number", "Year", "Department", 
  "Registration Number", "Branch", "Co - Founder", "Stage", "Website", 
  "Incubation Start Date", "Personal Email", "MSME Registration ", "Pitch Deck"
];

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !(session.user as any)?.permissions?.canAdd) {
      return NextResponse.json({ error: "Unauthorized to add startups" }, { status: 403 });
    }

    const body = await req.json();

    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client as any });

    // Format the values exactly in the order of the columns
    const rowValues = HEADERS.map(header => {
      // Return the value from the request body, or empty string if missing
      return body[header] || "";
    });

    // Append the row to the bottom of the sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: TAB_NAME,
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: [rowValues],
      },
    });

    // Clear cache
    clearSheetCache(TAB_NAME);

    return NextResponse.json({ success: true, message: "Startup created successfully" });
  } catch (error) {
    console.error("Error creating startup:", error);
    return NextResponse.json({ error: "Failed to create startup in Google Sheet" }, { status: 500 });
  }
}
