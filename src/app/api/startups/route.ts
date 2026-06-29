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

    const data = await getSheetData("Master_Database 2026-27");
    
    if (!data || data.length === 0) {
      return NextResponse.json([]);
    }

    const formattedStartups = data.map((row: any) => ({
      startup_id: String(row["Startup Registration number"] || ""),
      startup_name: String(row["Startup Name"] || ""),
      logo: String(row["Logo"] || ""),
      domain: String(row["Domain"] || ""),
      founder_name: String(row["Founder Name"] || ""),
      founders_photo: String(row["Founder's Photo"] || ""),
      college_email: String(row["College Email"] || ""),
      phone_number: String(row["Phone Number"] || ""),
      year: String(row["Year"] || ""),
      department: String(row["Department"] || ""),
      registration_number: String(row["Registration Number"] || ""),
      branch: String(row["Branch"] || ""),
      co_founder: String(row["Co - Founder"] || ""),
      stage: String(row["Stage"] || ""),
      website: String(row["Website"] || ""),
      incubation_start_date: String(row["Incubation Start Date"] || ""),
      personal_email: String(row["Personal Email"] || ""),
      msme_registration: String(row["MSME Registration "] || ""),
      pitch_deck: String(row["Pitch Deck"] || "")
    })).filter((startup) => startup.startup_id && startup.startup_id.trim() !== "");

    return NextResponse.json(formattedStartups);
  } catch (error) {
    console.error("Error fetching startups:", error);
    return NextResponse.json({ error: "Failed to fetch startups" }, { status: 500 });
  }
}
