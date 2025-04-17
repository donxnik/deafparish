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
    case "PUT": // For updating existing sermons
      return await handlePut(req, res);
    case "DELETE": // For deleting sermons
      return await handleDelete(req, res);
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
    // Fetch video section data
    const { data: videoData, error: videoError } = await supabase
      .from("video_section")
      .select("id, link_txt, desc_txt")
      .order("id", { ascending: true }); // Ensures consistent order of the 3 rows
    console.log("Video data from Supabase:", videoData, "Error:", videoError);

    if (videoError) {
      console.error("Error fetching video data:", videoError);
      return res.status(500).json({
        error: `Error fetching video data: ${videoError.message}`,
        details: videoError,
      });
    }

    // after fetching blogpost
    const { data: blogData, error: blogError } = await supabase
      .from("blog_post")
      .select("id, title_post, sermon_text")
      .order("id", { ascending: false }); // Newest first
    console.log("Blog data from Supabase:", blogData, "Error:", blogError);

    if (blogError) {
      console.error("Error fetching blog data:", blogError);
      return res.status(500).json({
        error: `Error fetching blog data: ${blogError.message}`,
        details: blogError,
      });
    }

    return res.status(200).json({
      message: "Data retrieved successfully",
      data: {
        weekData: weekData || [],
        auditoriumData: auditoriumData || [],
        videoData: videoData || [],
        blogData: blogData || [],
      },
      count: {
        week: weekData ? weekData.length : 0,
        auditorium: auditoriumData ? auditoriumData.length : 0,
        video: videoData ? videoData.length : 0,
        blog: blogData ? blogData.length : 0,
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

  const {
    id,
    wk1,
    wk2,
    wk3,
    wk4,
    wk5,
    wk6,
    wk7,
    title,
    desc,
    title_post,
    sermon_text,
    videoData,
  } = req.body;

  try {
    // Handle video_section
    if (videoData) {
      const videoDataArray = req.body.videoData;
      for (const video of videoDataArray) {
        const { id, link_txt, desc_txt } = video;

        let embedLink = link_txt;
        if (link_txt.includes("youtube.com/watch?v=")) {
          const videoId = new URL(link_txt).searchParams.get("v");
          embedLink = `https://www.youtube-nocookie.com/embed/${videoId}`;
        } else if (link_txt.includes("youtu.be/")) {
          const videoId = link_txt.split("/").pop().split("?")[0];
          embedLink = `https://www.youtube-nocookie.com/embed/${videoId}`;
        } else if (!link_txt.includes("/embed/")) {
          // If it's neither a standard YouTube link nor already an embed link
          embedLink = link_txt;
        }

        const { data: existingVideoData, error: checkVideoError } =
          await supabase
            .from("video_section")
            .select("id")
            .eq("id", id)
            .maybeSingle();

        if (checkVideoError) throw checkVideoError;

        const videoData = { link_txt: embedLink, desc_txt };
        let videoResult;

        if (existingVideoData) {
          videoResult = await supabase
            .from("video_section")
            .update(videoData)
            .eq("id", id)
            .select()
            .single();
        } else {
          videoResult = await supabase
            .from("video_section")
            .insert({ id, ...videoData })
            .select()
            .single();
        }

        if (videoResult.error) throw videoResult.error;
      }
    }

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
          .single();
      }

      if (auditoriumResult.error) throw auditoriumResult.error;
    }

    // Handle blog_post (new sermon)
    if (title_post && sermon_text) {
      const { data, error } = await supabase
        .from("blog_post")
        .insert({ title_post, sermon_text }) // Do not include id here
        .select()
        .single();

      if (error) throw error;

      return res.status(200).json({
        message: "Sermon added successfully",
        data: { id: data.id, title_post, sermon_text },
      });
    }

    return res.status(200).json({
      message: "Data saved successfully",
      data: { id, wk1, wk2, wk3, wk4, wk5, wk6, wk7, title, desc, videoData },
    });
  } catch (error) {
    console.error("Error updating/inserting data:", error);
    return res.status(500).json({
      error: `Error updating/inserting data: ${error.message}`,
      details: error,
    });
  }
}
async function handlePut(req, res) {
  const { id, title_post, sermon_text } = req.body;

  if (!id || !title_post || !sermon_text) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const { data, error } = await supabase
      .from("blog_post")
      .update({ title_post, sermon_text })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return res.status(200).json({
      message: "Sermon updated successfully",
      data,
    });
  } catch (error) {
    console.error("Error updating sermon:", error);
    return res.status(500).json({
      error: `Error updating sermon: ${error.message}`,
      details: error,
    });
  }
}

async function handleDelete(req, res) {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Missing sermon ID" });
  }

  try {
    const { error } = await supabase.from("blog_post").delete().eq("id", id);

    if (error) throw error;

    return res.status(200).json({
      message: "Sermon deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting sermon:", error);
    return res.status(500).json({
      error: `Error deleting sermon: ${error.message}`,
      details: error,
    });
  }
}
