import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://dhltebqfqcfkzqxbeaju.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY;
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

async function handleGet(req, res) {
  try {
    // Fetch week data
    const { data: weekData, error: weekError } = await supabase
      .from("week_text")
      .select("id, wk1, wk2, wk3, wk4, wk5, wk6, wk7");
    console.log("Week data from Supabase:", weekData, "Error:", weekError);

    // Fetch auditorium data
    const { data: auditoriumData, error: auditoriumError } = await supabase
      .from("auditoria_text")
      .select("id, title, desc");
    console.log(
      "Auditorium data from Supabase:",
      auditoriumData,
      "Error:",
      auditoriumError
    );

    if (weekError || auditoriumError) {
      console.error("Error fetching data:", weekError || auditoriumError);
      return res.status(500).json({
        error: `Error fetching data: ${(weekError || auditoriumError).message}`,
        details: weekError || auditoriumError,
      });
    }

    return res.status(200).json({
      message: "Data retrieved successfully",
      data: {
        weekData: weekData || [],
        auditoriumData: auditoriumData || [],
      },
      count: {
        week: weekData ? weekData.length : 0,
        auditorium: auditoriumData ? auditoriumData.length : 0,
      },
    });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ error: `Server error: ${error.message}` });
  }
}

async function handlePost(req, res) {
  if (!req.body) {
    return res.status(400).json({ error: "Missing request body" });
  }

  const { id, wk1, wk2, wk3, wk4, wk5, wk6, wk7, title, desc } = req.body;

  try {
    // Handle week_text
    if (wk1 !== undefined) {
      const { data: existingWeekData, error: checkWeekError } = await supabase
        .from("week_text")
        .select("id")
        .eq("id", id)
        .maybeSingle();

      if (checkWeekError) throw checkWeekError;

      const weekData = { wk1, wk2, wk3, wk4, wk5, wk6, wk7 };
      let weekResult;

      if (existingWeekData) {
        weekResult = await supabase
          .from("week_text")
          .update(weekData)
          .eq("id", id)
          .select()
          .single();
      } else {
        weekResult = await supabase
          .from("week_text")
          .insert({ id, ...weekData });
      }

      if (weekResult.error) throw weekResult.error;
    }

    // Handle auditoria_text
    if (title !== undefined || desc !== undefined) {
      const { data: existingAuditoriumData, error: checkAuditoriumError } =
        await supabase
          .from("auditoria_text")
          .select("id")
          .eq("id", id)
          .maybeSingle();

      if (checkAuditoriumError) throw checkAuditoriumError;

      const auditoriumData = { title, desc };
      let auditoriumResult;

      if (existingAuditoriumData) {
        auditoriumResult = await supabase
          .from("auditoria_text")
          .update(auditoriumData)
          .eq("id", id);
      } else {
        auditoriumResult = await supabase
          .from("auditoria_text")
          .insert({ id, ...auditoriumData })
          .select()
          .single(); // Ensure single row is returned
      }

      if (auditoriumResult.error) throw auditoriumResult.error;
    }

    return res.status(200).json({
      message: "Data saved successfully",
      data: { id, wk1, wk2, wk3, wk4, wk5, wk6, wk7, title, desc },
    });
  } catch (error) {
    console.error("Error updating/inserting data:", error);
    return res.status(500).json({
      error: `Error updating/inserting data: ${error.message}`,
      details: error,
    });
  }
}
