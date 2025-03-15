import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.css";
import auditoriumIMG from "../images/auditorium.jpeg";
import headerIMG from "../images/header_img.jpg";
import mapSameba from "../images/map_sameba.jpg";

function formatTextWithRedTime(text) {
  if (!text) return text;

  const timeRegex = /(\d{1,2}):(\d{2})/g;
  const formattedText = text.replace(
    timeRegex,
    '<span style="color: red">$1</span>:<span style="color: red">$2</span>'
  );

  return <span dangerouslySetInnerHTML={{ __html: formattedText }} />;
}

export default function Home({ weekData = [] }) {
  // Ensure weekData is an array and provide fallback if empty or invalid
  const safeWeekData = Array.isArray(weekData) ? weekData : [];
  const weekDays = safeWeekData[0] || {
    wk1: "",
    wk2: "",
    wk3: "",
    wk4: "",
    wk5: "",
    wk6: "",
    wk7: "",
  };

  const dayNames = [
    "ორშაბათი",
    "სამშაბათი",
    "ოთხშაბათი",
    "ხუთშაბათი",
    "პარასკევი",
    "შაბათი",
    "კვირა",
  ];

  return (
    <>
      <Head>
        <title>ლავრა</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        {/* Angel overlay - will be above everything */}
        <div className={styles.angelOverlay}>
          <div className={styles.leftAngel}></div>
          <div className={styles.rightAngel}></div>
        </div>
        <div className={styles.contentWrapper}>
          <div className={styles.headerTitle}>ივერიის ღვთისმშობლის ლავრა</div>
          <div className={styles.headerImg}>
            <Image
              src={headerIMG}
              alt="header"
              layout="responsive"
              priority
              className={styles.centeredImage}
            />
          </div>
          <div className={styles.week_calendar}>
            {dayNames.map((day, index) => (
              <div key={index} className={styles.week_day}>
                <h1>{day}</h1>
                <p>{formatTextWithRedTime(weekDays[`wk${index + 1}`])}</p>
              </div>
            ))}
          </div>
          <div className={styles.auditorium}>
            <div className={styles.auditorium_image}>
              <Image
                src={auditoriumIMG}
                alt="auditorium"
                width={580}
                height={585}
                loading="lazy"
                className={styles.rounded_image}
              />
            </div>
            <div className={styles.auditorium_desc}>
              <h1>სასწავლო აუდიტორია</h1>
              <p>
                აუდიტორია გამოიყენება სხვადასხვა სახის შეხვედრებისთვის და
                ღონისძიებებისთვის.
              </p>
            </div>
          </div>

          {/* Add this code between "auditorium" and "contact_container" */}
          <div className={styles.videoContainer}>
            <div className={styles.videoBlock}>
              <iframe
                className={styles.videoFrame}
                src="https://www.youtube.com/embed/4P4-LkAaNQE"
                frameBorder="0"
                allowFullScreen
              ></iframe>
              <p className={styles.videoDescription}>
                საეკლესიო გალობა - ტრადიციული გუნდური შესრულება
              </p>
            </div>
            <div className={styles.videoBlock}>
              <iframe
                className={styles.videoFrame}
                src="https://www.youtube.com/embed/4P4-LkAaNQE"
                frameBorder="0"
                allowFullScreen
              ></iframe>
              <p className={styles.videoDescription}>
                წირვის მსვლელობა - საკვირაო ლიტურგია
              </p>
            </div>
            <div className={styles.videoBlock}>
              <iframe
                className={styles.videoFrame}
                src="https://www.youtube.com/embed/4P4-LkAaNQE"
                frameBorder="0"
                allowFullScreen
              ></iframe>
              <p className={styles.videoDescription}>
                მონასტრის ისტორია - მოკლე მიმოხილვა
              </p>
            </div>
          </div>

          <div className={styles.contact_container}>
            <div className={styles.contact_title}>
              <h1>საკონტაქტო ინფორმაცია</h1>
              <p>სატელეფონო კონტაქტი და ადგილმდებარეობა</p>
            </div>

            <div className={styles.sub_contact_container}>
              <div className={styles.sub_contact_img}>
                <Image
                  src={mapSameba} // You'll need to import a map or church image
                  alt="location map"
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className={styles.sub_contact_desc}>
                <div className={styles.contact_info_item}>
                  <span className={styles.contact_label}>ტელეფონი:</span>
                  <span className={styles.contact_value}>599 47 47 58</span>
                </div>
                <div className={styles.contact_info_item}>
                  <span className={styles.contact_label}>მისამართი:</span>
                  <span className={styles.contact_value}>უბანი ნომერი #3</span>
                </div>
                <div className={styles.sub_desc}>
                  <a
                    className={styles.btn_maps}
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://maps.app.goo.gl/bpTrjstmHAvTCNxx8"
                  >
                    <span className={styles.google_G}>G</span>
                    <span className={styles.google_O1}>O</span>
                    <span className={styles.google_O2}>O</span>
                    <span className={styles.google_G}>G</span>
                    <span className={styles.google_L}>L</span>
                    <span className={styles.google_E}>E</span>
                    &nbsp;
                    <span className={styles.maps_M}>M</span>
                    <span className={styles.maps_A}>A</span>
                    <span className={styles.maps_P}>P</span>
                    <span className={styles.maps_S}>S</span>
                  </a>
                  <a
                    className={styles.btn_facebook}
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    FACEBOOK
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export async function getServerSideProps() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    console.log("Fetching from URL:", `${baseUrl}/api/main_database`);

    const response = await fetch(`${baseUrl}/api/main_database`);
    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }

    const result = await response.json();
    const weekData = Array.isArray(result.data) ? result.data : [];

    console.log("Data fetched in getServerSideProps:", { weekData });

    return {
      props: {
        weekData,
      },
    };
  } catch (error) {
    console.error("Error in getServerSideProps:", error);
    return {
      props: {
        weekData: [], // Fallback to empty array
      },
    };
  }
}
