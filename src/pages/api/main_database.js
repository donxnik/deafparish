import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://dhltebqfqcfkzqxbeaju.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRobHRlYnFmcWNma3pxeGJlYWp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA1MTkwNzUsImV4cCI6MjA1NjA5NTA3NX0.ECpXxxjW-jLgv7GfMbiXxRn5SJGKafQIXOUuj173hc0";
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      return await handleGet(req, res);
    case "POST":
      return await handlePost(req, res);
    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
}

// GET handler - Retrieve all week days data
async function handleGet(req, res) {
  try {
    const { data, error } = await supabase
      .from("week_text")
      .select("id, wk1, wk2, wk3, wk4, wk5, wk6, wk7");

    if (error) {
      console.error("Error fetching data:", error);
      return res.status(500).json({
        error: `Error fetching data: ${error.message}`,
        details: error,
      });
    }

    return res.status(200).json({
      message: "Week data retrieved successfully",
      data: data,
      count: data ? data.length : 0,
    });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({
      error: `Server error: ${error.message}`,
      stack: error.stack,
    });
  }
}

// POST handler - Update or insert week days data
async function handlePost(req, res) {
  if (!req.body) {
    return res.status(400).json({ error: "Missing request body" });
  }

  const {
    id,
    wk1 = "",
    wk2 = "",
    wk3 = "",
    wk4 = "",
    wk5 = "",
    wk6 = "",
    wk7 = "",
  } = req.body;

  try {
    // Check if record exists
    const { data: existingData, error: checkError } = await supabase
      .from("week_text")
      .select("id, wk1, wk2, wk3, wk4, wk5, wk6, wk7")
      .eq("id", id)
      .maybeSingle();

    if (checkError) {
      console.error("Error checking existing data:", checkError);
      return res.status(500).json({
        error: `Error checking data: ${checkError.message}`,
        details: checkError,
      });
    }

    let result;
    const weekData = { wk1, wk2, wk3, wk4, wk5, wk6, wk7 };

    if (existingData) {
      // Update existing record
      result = await supabase.from("week_text").update(weekData).eq("id", id);
    } else {
      // Insert new record
      result = await supabase.from("week_text").insert({ id, ...weekData });
    }

    if (result.error) {
      console.error("Error updating/inserting data:", result.error);
      return res.status(500).json({
        error: `Error updating/inserting data: ${result.error.message}`,
        details: result.error,
      });
    }

    return res.status(200).json({
      message: existingData
        ? "Week data updated successfully"
        : "Week data inserted successfully",
      data: { id, ...weekData },
    });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({
      error: `Server error: ${error.message}`,
      stack: error.stack,
    });
  }
}
