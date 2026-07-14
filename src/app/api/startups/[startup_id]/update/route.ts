import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { clearSheetCache, auth } from "@/lib/google-sheets";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import { AuditLog } from "@/models/AuditLog";

const SHEET_ID = "1wWCxLnNGoKZNQMrOd8ZRfdACdVxSK21F9eUM_1uH9oA";
const TAB_NAME = "Master_Database 2026-27";

export async function POST(
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

    const { field, value } = await req.json();

    if (!field || typeof value === 'undefined') {
      return NextResponse.json({ error: "Missing field or value" }, { status: 400 });
    }

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

    const headers = rows[0] as string[];
    const idColumnIndex = headers.findIndex(h => h.trim() === "Startup Registration number");
    const targetColumnIndex = headers.findIndex(h => h.trim() === field);

    if (idColumnIndex === -1 || targetColumnIndex === -1) {
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

    // Google Sheets rows are 1-indexed, so row 0 in array is row 1 in sheet. 
    // rowIndex is the array index, so sheet row is rowIndex + 1.
    const sheetRowNumber = rowIndex + 1;
    const targetColumnLetter = String.fromCharCode(65 + targetColumnIndex); // A, B, C etc (works up to Z)
    const rangeToUpdate = `${TAB_NAME}!${targetColumnLetter}${sheetRowNumber}`;

    // Update the specific cell
    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: rangeToUpdate,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[value]],
      },
    });

    // Clear the cache so the next page load gets the fresh data
    clearSheetCache(TAB_NAME);

    // Create Audit Log
    try {
      await dbConnect();
      const oldValue = rows[rowIndex][targetColumnIndex] || "";
      const startupName = rows[rowIndex][headers.findIndex(h => h.trim() === "Startup Name")] || "Unknown";
      
      await AuditLog.create({
        action: 'UPDATE',
        startupId: startup_id,
        startupName,
        user: session.user?.email || session.user?.name || "Unknown User",
        changes: [{
          field,
          oldValue,
          newValue: value
        }]
      });
    } catch (logErr) {
      console.error("Failed to create audit log", logErr);
    }

    return NextResponse.json({ success: true, updatedRange: rangeToUpdate });

  } catch (error) {
    console.error("Error updating sheet:", error);
    return NextResponse.json({ error: "Failed to update Google Sheet" }, { status: 500 });
  }
}
