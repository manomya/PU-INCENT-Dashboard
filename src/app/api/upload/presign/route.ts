import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2Client } from "@/lib/r2";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { filename, contentType } = body;

    if (!filename || !contentType) {
      return NextResponse.json({ error: "Missing filename or contentType" }, { status: 400 });
    }

    if (!process.env.R2_BUCKET_NAME) {
      return NextResponse.json({ error: "R2_BUCKET_NAME is not configured" }, { status: 500 });
    }

    // Generate a unique filename to prevent overwriting
    const fileExtension = filename.split('.').pop();
    const uniqueFilename = `${crypto.randomUUID()}-${Date.now()}.${fileExtension}`;
    
    // Create the command for a PUT request
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: uniqueFilename,
      ContentType: contentType,
    });

    // Generate the presigned URL (expires in 1 hour)
    const presignedUrl = await getSignedUrl(r2Client, command, { expiresIn: 3600 });
    
    // Construct the final public URL if R2_PUBLIC_URL is configured
    const publicUrl = process.env.R2_PUBLIC_URL 
      ? `${process.env.R2_PUBLIC_URL}/${uniqueFilename}`
      : `https://${process.env.R2_BUCKET_NAME}.${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${uniqueFilename}`;

    return NextResponse.json({ 
      presignedUrl, 
      finalUrl: publicUrl,
      objectKey: uniqueFilename
    });
    
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    return NextResponse.json({ error: "Failed to generate upload URL" }, { status: 500 });
  }
}
