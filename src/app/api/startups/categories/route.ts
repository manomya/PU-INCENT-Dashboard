import { NextResponse } from "next/server";
import { getSheetData } from "@/lib/google-sheets";

export async function GET() {
  try {
    const data = await getSheetData("Master_Database 2026-27");

    const categories: Record<string, number> = {};

    for (const startup of data) {
      const category = startup["Domain"];
      if (category) {
        categories[category] = (categories[category] || 0) + 1;
      }
    }

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching startup categories:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}
