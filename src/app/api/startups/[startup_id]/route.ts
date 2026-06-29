import { NextRequest, NextResponse } from "next/server";
import { getSheetData } from "@/lib/google-sheets";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ startup_id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { startup_id } = await params;

    // RBAC: Verify if the user is allowed to view this specific startup
    const permissions = (session.user as any).permissions;
    if (permissions?.accessibleStartups !== 'ALL' && Array.isArray(permissions?.accessibleStartups)) {
      const allowedIds = permissions.accessibleStartups.map((id: string) => id.trim().toLowerCase());
      if (!allowedIds.includes(startup_id.toLowerCase())) {
        return NextResponse.json({ error: "Forbidden: You do not have access to this startup." }, { status: 403 });
      }
    }

    const data = await getSheetData("Master_Database 2026-27");

    for (const startup of data) {
      if (String(startup["Startup Registration number"] || "").trim() === String(startup_id).trim()) {
        return NextResponse.json(startup);
      }
    }
    
    return NextResponse.json({ error: "Startup not found" }, { status: 404 });
  } catch (error) {
    console.error("Error fetching startup:", error);
    return NextResponse.json({ error: "Failed to fetch startup" }, { status: 500 });
  }
}
