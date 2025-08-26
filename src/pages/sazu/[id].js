import Head from "next/head";
import Image from "next/image"; // ვამატებთ Image კომპონენტს
import Link from "next/link"; // ვამატებთ Link კომპონენტს
import styles from "@/styles/Home.module.css";
import sazuStyles from "@/styles/SazuPost.module.css";

// თარიღის ფორმატირების ფუნქცია
function formatDate(dateString) {
  if (!dateString) return "";
  // ფორმატიდან "2025\/07\/03" ვიღებთ "2025.07.03"-ს
  return dateString.replace(/\//g, ".");
}

export default function SazuPostPage({ post }) {
  // თუ რაიმე მიზეზით პოსტი ვერ ჩაიტვირთა, ვაჩვენებთ შეტყობინებას
  if (!post) {
    return (
      <main className={styles.main}>
        <div className={styles.contentWrapper}>
          <div className={sazuStyles.postContainer}>
            <h1>პოსტი ვერ მოიძებნა</h1>
            <p>სამწუხაროდ, მოთხოვნილი პოსტი არ არსებობს ან წაშლილია.</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      <Head>
        {/* გვერდის სათაურს ვაყენებთ პოსტის სათაურის მიხედვით SEO-სთვის */}
        <title>{post.name}</title>
        <meta name="description" content={post.name} />
      </Head>
      <main className={styles.main}>
        <div className={styles.contentWrapper}>
          <div className={sazuStyles.postContainer}>
            <h1>{post.name}</h1>
            <p className={sazuStyles.postDate}>{formatDate(post.date)}</p>

            {/* --- დამატებულია მთავარი სურათი --- */}
            <div className={sazuStyles.mainImageContainer}>
              <Image
                src={post.photo}
                alt={post.name}
                width={1600}
                height={900}
                layout="responsive"
                objectFit="cover"
                priority
              />
            </div>

            {/* აქ ვაჩვენებთ სრულ HTML შიგთავსს, ვიდეოებიანად */}
            <div dangerouslySetInnerHTML={{ __html: post.text }} />

            {/* --- დამატებულია მთავარ გვერდზე დაბრუნების ღილაკი --- */}
            <div className={sazuStyles.backButtonContainer}>
              <Link href="/" className={sazuStyles.backButton}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
                <span>მთავარ გვერდზე დაბრუნება</span>
              </Link>
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
    const response = await fetch(`https://sazu.ge/api/posts/36`);
    if (!response.ok) {
      return { notFound: true };
    }
    const data = await response.json();
    const post = data.find((p) => p.id === id);

    if (!post) {
      return { notFound: true };
    }

    return {
      props: {
        post,
      },
    };
  } catch (error) {
    console.error("Failed to fetch and find post:", error);
    return { notFound: true };
  }
}
