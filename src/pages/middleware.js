// middleware.js

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// ვქმნით Supabase კლიენტს Edge გარემოსთვის
// დარწმუნდით, რომ .env.local ფაილში გაქვთ ეს ცვლადები
const supabaseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const supabaseAnonKey = process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ფუნქცია IP მისამართის უსაფრთხო ჰეშირებისთვის
async function hashIp(ip) {
  const encoder = new TextEncoder();
  const data = encoder.encode(ip);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // ვამოწმებთ, რომ არ დავაფიქსიროთ API მოთხოვნები, სურათები და სხვა ფაილები
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico")
  ) {
    return NextResponse.next();
  }

  // ვიღებთ საჭირო ინფორმაციას მოთხოვნიდან
  const ip = req.ip ?? "127.0.0.1";
  const userAgent = req.headers.get("user-agent");
  const { country, city } = req.geo || {};

  // ვაკეთებთ IP მისამართის ჰეშირებას
  const ip_hash = await hashIp(ip);

  // ვინახავთ მონაცემებს Supabase-ში
  // არ ვიყენებთ await-ს, რომ პასუხი არ შევაყოვნოთ. "Fire and forget"
  supabase
    .from("page_views")
    .insert({
      path: pathname,
      ip_hash,
      user_agent: userAgent,
      country,
      city,
    })
    .then(({ error }) => {
      if (error) {
        console.error("Supabase middleware error:", error);
      }
    });

  // ვაგრძელებთ მოთხოვნის შესრულებას
  return NextResponse.next();
}
