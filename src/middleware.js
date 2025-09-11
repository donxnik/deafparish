// src/middleware.js

import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";

// IP ჰეშირების ფუნქცია (შენი კოდიდან)
async function hashIp(ip) {
  const encoder = new TextEncoder();
  const data = encoder.encode(ip);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function middleware(req) {
  const res = NextResponse.next();

  // --- მთავარი ცვლილება აქ არის ---
  // ჩვენ პირდაპირ ვუთითებთ, რომელი ცვლადებიდან წაიკითხოს მისამართი და გასაღები
  const supabase = createMiddlewareClient({ req, res });
  // --- ცვლილების დასასრული ---

  // ვიღებთ მიმდინარე სესიას
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname } = req.nextUrl;

  // ავთენტიფიკაციის ლოგიკა
  if (!session && pathname.startsWith("/admin94")) {
    const url = new URL("/login", req.url);
    return NextResponse.redirect(url);
  }

  // ანალიტიკის ლოგიკა (შენი არსებული კოდი)
  const isAnalyticsPath =
    !pathname.startsWith("/api") &&
    !pathname.startsWith("/_next") &&
    !pathname.includes(".") &&
    pathname !== "/login";

  if (isAnalyticsPath) {
    try {
      const ip = req.ip ?? "127.0.0.1";
      const userAgent = req.headers.get("user-agent");
      const { country, city } = req.geo || {};
      const ip_hash = await hashIp(ip);

      await supabase.from("page_views").upsert(
        {
          path: pathname,
          ip_hash,
          user_agent: userAgent,
          country,
          city,
        },
        { onConflict: "ip_hash,visit_date" }
      );
    } catch (error) {
      console.error("Analytics Middleware Error:", error.message);
    }
  }

  return res;
}

// config ნაწილი უცვლელია
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
