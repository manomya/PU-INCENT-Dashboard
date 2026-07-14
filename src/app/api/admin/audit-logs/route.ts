import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { AuditLog } from "@/models/AuditLog";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await dbConnect();
    
    // Fetch logs sorted by latest first, limit to 500 for performance
    const logs = await AuditLog.find({}).sort({ timestamp: -1 }).limit(500);

    return NextResponse.json({ success: true, logs });
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    return NextResponse.json({ error: "Failed to fetch audit logs" }, { status: 500 });
  }
}
