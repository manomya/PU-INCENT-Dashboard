import { NextResponse } from "next/server";
import { getSheetData } from "@/lib/google-sheets";

export async function GET() {
  try {
    const data = await getSheetData("Master_Database 2026-27");

    const stages: Record<string, number> = {};

    for (const startup of data) {
      const stage = startup["Stage"];
      if (stage) {
        stages[stage] = (stages[stage] || 0) + 1;
      }
    }

    return NextResponse.json(stages);
  } catch (error) {
    console.error("Error fetching startup stages:", error);
    return NextResponse.json({ error: "Failed to fetch stages" }, { status: 500 });
  }
}
