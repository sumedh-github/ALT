import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { cloudinary } from "@/lib/cloudinary";

export async function POST() {
  const session = await auth();
  if (session?.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder: "alt-products" },
    process.env.CLOUDINARY_API_SECRET ?? ""
  );

  return NextResponse.json({
    timestamp,
    signature,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    folder: "alt-products"
  });
}
