import { NextResponse, NextRequest } from "next/server";
import { getSheetData } from "@/lib/google-sheets";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // getSheetData already strips headers and returns an array of objects
    const startups = await getSheetData("Master_Database 2026-27");
    
    if (!startups || startups.length === 0) {
      return NextResponse.json({ total_startups: 0, active_startups: 0, total_domains: 0 });
    }

    // Filter out any completely empty rows just in case
    const validStartups = startups.filter((row: any) => 
      row["Startup Registration number"] && String(row["Startup Registration number"]).trim() !== ""
    );

    // Calculate Active Startups (those that are not 'NO IDEA')
    const activeStartups = validStartups.filter((row: any) => {
      const stage = String(row["Stage"] || "").trim().toUpperCase();
      return stage !== "" && stage !== "NO IDEA";
    });

    // Calculate unique domains
    const domains = new Set(validStartups.map((row: any) => String(row["Domain"] || "").trim().toLowerCase()).filter(Boolean));

    return NextResponse.json({
      total_startups: validStartups.length,
      active_startups: activeStartups.length,
      total_domains: domains.size,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard stats" }, { status: 500 });
  }
}
