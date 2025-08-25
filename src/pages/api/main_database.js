import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://dhltebqfqcfkzqxbeaju.supabase.co";
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      return await handleGet(req, res);
    case "POST":
      return await handlePost(req, res);
    case "PUT":
      return await handlePut(req, res);
    case "DELETE":
      return await handleDelete(req, res);
    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
}

async function handleGet(req, res) {
  try {
    // ვიძახებთ ყველა ცხრილის მონაცემს პარალელურად
    const [scheduleRes, auditoriumRes, videoRes, blogRes] = await Promise.all([
      supabase
        .from("schedule_days")
        .select("id, day_name, event_description, event_time, updated_at")
        .order("id", { ascending: true }),
      supabase.from("auditoria_text").select("id, title, desc"),
      supabase
        .from("video_section")
        .select("id, link_txt, desc_txt")
        .order("id", { ascending: true }),
      supabase
        .from("blog_post")
        .select("id, title_post, sermon_text")
        .order("id", { ascending: false }),
    ]);

    // ვამოწმებთ თითოეულ პასუხს შეცდომაზე
    if (scheduleRes.error) throw scheduleRes.error;
    if (auditoriumRes.error) throw auditoriumRes.error;
    if (videoRes.error) throw videoRes.error;
    if (blogRes.error) throw blogRes.error;

    return res.status(200).json({
      message: "Data retrieved successfully",
      data: {
        scheduleData: scheduleRes.data || [],
        auditoriumData: auditoriumRes.data || [],
        videoData: videoRes.data || [],
        blogData: blogRes.data || [],
      },
    });
  } catch (error) {
    console.error("Server error during GET:", error);
    return res.status(500).json({ error: `Server error: ${error.message}` });
  }
}

async function handlePost(req, res) {
  if (!req.body) {
    return res.status(400).json({ error: "Missing request body" });
  }

  const { scheduleData, auditoriumData, videoData, newSermon } = req.body;

  try {
    if (scheduleData) {
      const { error } = await supabase
        .from("schedule_days")
        .upsert(scheduleData, { onConflict: "id" });
      if (error) throw error;
    }

    if (auditoriumData) {
      const { error } = await supabase
        .from("auditoria_text")
        .update({ title: auditoriumData.title, desc: auditoriumData.desc })
        .eq("id", auditoriumData.id);
      if (error) throw error;
    }

    if (videoData) {
      for (const video of videoData) {
        let embedLink = video.link_txt;
        if (embedLink && embedLink.includes("youtube.com/watch?v=")) {
          const videoId = new URL(embedLink).searchParams.get("v");
          embedLink = `https://www.youtube-nocookie.com/embed/${videoId}`;
        } else if (embedLink && embedLink.includes("youtu.be/")) {
          const videoId = embedLink.split("/").pop().split("?")[0];
          embedLink = `https://www.youtube-nocookie.com/embed/${videoId}`;
        }
        const { error } = await supabase
          .from("video_section")
          .update({ link_txt: embedLink, desc_txt: video.desc_txt })
          .eq("id", video.id);
        if (error) throw error;
      }
    }

    // ვამატებთ ახალი ქადაგების ლოგიკას
    if (newSermon) {
      const { data, error } = await supabase
        .from("blog_post")
        .insert(newSermon)
        .select()
        .single();
      if (error) throw error;
      // ახალი ქადაგების შემთხვევაში ვაბრუნებთ დამატებულ ობიექტს, რომ ფრონტზე დაემატოს
      return res
        .status(200)
        .json({ message: "Sermon added successfully", data });
    }

    return res.status(200).json({ message: "Data saved successfully" });
  } catch (error) {
    console.error("Error updating/inserting data:", error);
    return res
      .status(500)
      .json({ error: `Error updating/inserting data: ${error.message}` });
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
    return res
      .status(200)
      .json({ message: "Sermon updated successfully", data });
  } catch (error) {
    console.error("Error updating sermon:", error);
    return res
      .status(500)
      .json({ error: `Error updating sermon: ${error.message}` });
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
    return res.status(200).json({ message: "Sermon deleted successfully" });
  } catch (error) {
    console.error("Error deleting sermon:", error);
    return res
      .status(500)
      .json({ error: `Error deleting sermon: ${error.message}` });
  }
}
