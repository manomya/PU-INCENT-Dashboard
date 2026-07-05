import { NextResponse } from "next/server";
import { getSheetData } from "@/lib/google-sheets";

export async function GET() {
  try {
    const data = await getSheetData("Master_Database 2026-27");
    if (!data || data.length === 0) return NextResponse.json({ error: "no data" });
    const firstRow = data[0];
    return NextResponse.json({ headers: Object.keys(firstRow) });
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
}
