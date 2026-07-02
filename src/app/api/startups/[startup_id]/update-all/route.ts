import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { clearSheetCache, auth } from "@/lib/google-sheets";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const SHEET_ID = "1wWCxLnNGoKZNQMrOd8ZRfdACdVxSK21F9eUM_1uH9oA";
const TAB_NAME = "Master_Database 2026-27";

const HEADERS = [
  "Startup Registration number", "Startup Name", "Logo", "Domain", "Founder Name", 
  "Founder's Photo", "College Email", "Phone Number", "Year", "Department", 
  "Registration Number", "Branch", "Co - Founder", "Stage", "Website", 
  "Incubation Start Date", "Personal Email", "MSME Registration ", "Pitch Deck"
];

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ startup_id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const permissions = (session?.user as any)?.permissions;

    if (!session || !permissions?.canEdit) {
      return NextResponse.json({ error: "Unauthorized to edit startups" }, { status: 403 });
    }

    const { startup_id } = await params;
    
    // Check if user is restricted to specific startups
    if (permissions.accessibleStartups !== 'ALL' && Array.isArray(permissions.accessibleStartups)) {
      const allowedIds = permissions.accessibleStartups.map((id: string) => id.trim().toLowerCase());
      if (!allowedIds.includes(startup_id.toLowerCase())) {
        return NextResponse.json({ error: "You do not have permission to edit this specific startup" }, { status: 403 });
      }
    }

    const body = await req.json();

    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client as any });

    // Fetch the headers and data to find the row index
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: TAB_NAME,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: "Sheet is empty" }, { status: 404 });
    }

    const sheetHeaders = rows[0] as string[];
    const idColumnIndex = sheetHeaders.findIndex(h => h.trim() === "Startup Registration number");

    if (idColumnIndex === -1) {
      return NextResponse.json({ error: "Invalid column mappings" }, { status: 400 });
    }

    // Find the row for this startup
    let rowIndex = -1;
    for (let i = 1; i < rows.length; i++) {
      if (String(rows[i][idColumnIndex] || "").trim() === String(startup_id).trim()) {
        rowIndex = i;
        break;
      }
    }

    if (rowIndex === -1) {
      return NextResponse.json({ error: "Startup not found" }, { status: 404 });
    }

    // Prepare updated row values, retaining old values if a field isn't passed (optional logic, but here we expect the full object or we use the old value)
    const existingRow = rows[rowIndex];
    const rowValues = HEADERS.map((header, index) => {
      // If the body contains the header, use the new value, otherwise keep the old one
      return body[header] !== undefined ? body[header] : (existingRow[index] || "");
    });

    const sheetRowNumber = rowIndex + 1;
    const rangeToUpdate = `${TAB_NAME}!A${sheetRowNumber}:S${sheetRowNumber}`;

    // Update the entire row
    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: rangeToUpdate,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [rowValues],
      },
    });

    clearSheetCache(TAB_NAME);

    return NextResponse.json({ success: true, message: "Startup updated successfully" });

  } catch (error) {
    console.error("Error updating startup:", error);
    return NextResponse.json({ error: "Failed to update startup in Google Sheet" }, { status: 500 });
  }
}
