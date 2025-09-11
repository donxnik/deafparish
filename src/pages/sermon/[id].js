import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link"; // Add this for navigation links

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Sermon({ sermon, allSermons }) {
  return (
    <>
      <Head>
        <title>{sermon?.title_post || "Sermon"} - ლავრა</title>
        <meta name="description" content="Full sermon text" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.contentWrapper}>
          <div className={styles.sermonPageContainer}>
            <div className={styles.sermonContent}>
              <div className={styles.sermonBlock}>
                <h1>{sermon?.title_post}</h1>
                <p>{sermon?.sermon_text}</p>
                <Link href="/" className={styles.readMore}>
                  უკან დაბრუნება
                </Link>
              </div>
            </div>
            <div className={styles.sermonSidebar}>
              <h2>სხვა ქადაგებები</h2>
              <ul>
                {allSermons
                  .filter((s) => s.id !== sermon?.id) // Exclude the current sermon
                  .map((sermonItem) => (
                    <li key={sermonItem.id}>
                      <Link
                        href={`/sermon/${sermonItem.id}`}
                        className={styles.sermonLink}
                      >
                        {sermonItem.title_post}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export async function getServerSideProps(context) {
  const { id } = context.params;

  try {
    // Fetch the current sermon
    const { data: sermon, error: sermonError } = await supabase
      .from("blog_post")
      .select("id, title_post, sermon_text")
      .eq("id", id)
      .single();

    if (sermonError) throw sermonError;

    // Fetch all sermons for the sidebar
    const { data: allSermons, error: allSermonsError } = await supabase
      .from("blog_post")
      .select("id, title_post")
      .order("id", { ascending: false }); // Newest first

    if (allSermonsError) throw allSermonsError;

    return {
      props: {
        sermon: sermon || null,
        allSermons: allSermons || [],
      },
    };
  } catch (error) {
    console.error("Error fetching sermon data:", error);
    return {
      props: {
        sermon: null,
        allSermons: [],
      },
    };
  }
}
