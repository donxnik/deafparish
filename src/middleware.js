// middleware.js
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function hashIp(ip) {
  const encoder = new TextEncoder();
  const data = encoder.encode(ip);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico")
  ) {
    return NextResponse.next();
  }

  // --- DEBUGGING ---
  console.log(`Middleware is running for path: ${pathname}`);

  const ip = req.ip ?? "127.0.0.1";
  const userAgent = req.headers.get("user-agent");
  const { country, city } = req.geo || {};
  const ip_hash = await hashIp(ip);

  console.log(`Attempting to insert for IP hash: ${ip_hash}`);

  // ვიყენებთ upsert-ს დუბლიკატების თავიდან ასაცილებლად
  const { data, error } = await supabase.from("page_views").upsert(
    {
      path: pathname,
      ip_hash,
      user_agent: userAgent,
      country,
      city,
      // visit_date ავტომატურად შეივსება ბაზაში DEFAULT CURRENT_DATE-ით
    },
    {
      onConflict: "ip_hash,visit_date", // ვუთითებთ, რომელი სვეტების კონფლიქტი დააიგნოროს
      ignoreDuplicates: true,
    }
  );

  if (error) {
    // მოსალოდნელია, რომ onConflict-ის გამო შეცდომა არ იქნება, მაგრამ მაინც ვტოვებთ
    console.error("SUPABASE MIDDLEWARE UPSERT ERROR:", error);
  } else {
    console.log("SUPABASE UPSERT:", data); // წარმატების შემთხვევაში, null-ს დააბრუნებს
  }
  // --- END DEBUGGING ---

  return NextResponse.next();
}
