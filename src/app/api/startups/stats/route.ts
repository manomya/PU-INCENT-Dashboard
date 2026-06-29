import { NextResponse } from "next/server";
import { getSheetData } from "@/lib/google-sheets";

export async function GET() {
  try {
    const data = await getSheetData("Master_Database 2026-27");

    const total_startups = data.length;
    const ideation = data.filter((s) => s["Stage"] === "Ideation").length;
    const mvp = data.filter((s) => s["Stage"] === "MVP").length;
    const early_traction = data.filter((s) => s["Stage"] === "Early Traction").length;
    const scaling = data.filter((s) => s["Stage"] === "Scaling").length;

    return NextResponse.json({
      total_startups,
      ideation,
      mvp,
      early_traction,
      scaling,
    });
  } catch (error) {
    console.error("Error fetching startup stats:", error);
    return NextResponse.json({ error: "Failed to fetch startup stats" }, { status: 500 });
  }
}
