import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.css";
import auditoriumIMG from "../images/auditorium.jpeg";
import headerIMG from "../images/headercr_img.jpg";
import interior1 from "../images/interior1.jpeg";
import interior2 from "../images/interior2.jpeg";
import mapSameba from "../images/map_sameba.jpg";
import iconByz from "../images/icon_byz.png";
import { useState, useEffect } from "react";

function formatTextWithRedTime(text) {
  if (!text) return text;

  // This regex looks for time patterns like "8:00" or "19:00"
  const timeRegex = /(\d{1,2}):(\d{2})/g;

  // Replace time patterns with spans that have red color
  const formattedText = text.replace(
    timeRegex,
    '<span style="color: red; font-weight: 600;">$1:$2</span>'
  );

  return (
    <span
      style={{ display: "inline-block", whiteSpace: "normal", width: "100%" }}
      dangerouslySetInnerHTML={{ __html: formattedText }}
    />
  );
}

export default function Home({ data = {} }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const images = [headerIMG, interior1, interior2];
  const {
    weekData = [],
    auditoriumData = [],
    videoData = [],
    blogData = [],
  } = data;
  const safeVideoData = Array.isArray(videoData) ? videoData : [];
  const safeWeekData = Array.isArray(weekData) ? weekData : [];
  const safeBlogData = Array.isArray(blogData) ? blogData : [];
  const weekDays = safeWeekData[0] || {
    wk1: "",
    wk2: "",
    wk3: "",
    wk4: "",
    wk5: "",
    wk6: "",
    wk7: "",
  };
  const safeAuditoriumData = Array.isArray(auditoriumData)
    ? auditoriumData
    : [];
  const auditoriumInfo = safeAuditoriumData[0] || {
    title: "სასწავლო აუდიტორია",
    desc: "აუდიტორია გამოიყენება სხვადასხვა სახის შეხვედრებისთვის და ღონისძიებებისთვის.",
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

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % images.length);
    }, 8000);

    return () => clearInterval(timer);
  }, [images.length]);

  // Navigation functions
  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prevSlide) => (prevSlide - 1 + images.length) % images.length
    );
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

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
          <div className={styles.slideshow}>
            {images.map((image, index) => (
              <div
                key={index}
                className={`${styles.slide} ${
                  index === currentSlide ? styles.active : ""
                }`}
              >
                <Image
                  src={image}
                  alt={`header slide ${index + 1}`}
                  className={styles.centeredImage}
                  width={1200}
                  height={600}
                  priority={index === 0}
                  quality={75}
                />
              </div>
            ))}

            <div className={styles.dotsContainer}>
              {images.map((_, index) => (
                <div
                  key={index}
                  className={`${styles.dot} ${
                    index === currentSlide ? styles.active : ""
                  }`}
                  onClick={() => goToSlide(index)}
                ></div>
              ))}
            </div>
          </div>
          <div className={styles.week_calendar}>
            <div className={styles.week_calendar_inner}>
              {dayNames.map((day, index) => (
                <div key={index} className={styles.week_day}>
                  <h1>{day}</h1>
                  <p>{formatTextWithRedTime(weekDays[`wk${index + 1}`])}</p>
                </div>
              ))}
            </div>
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
              <h1>{auditoriumInfo.title}</h1>
              <p>{auditoriumInfo.desc}</p>
            </div>
          </div>
          <div className={styles.ornamentContainer}>
            <Image
              src={iconByz}
              alt="Byzantine ornament"
              width={150} // Adjust size as needed
              height={150} // Adjust size as needed
              className={styles.ornamentImage}
            />
          </div>

          {/* New Sermon Section */}
          <div className={styles.sermonContainer}>
            {safeBlogData.length > 0 && (
              <div className={styles.sermonBlock}>
                <h1>{safeBlogData[0].title_post}</h1>
                <p>
                  {safeBlogData[0].sermon_text
                    .split(" ")
                    .slice(0, 100)
                    .join(" ")}
                  {safeBlogData[0].sermon_text.split(" ").length > 100 && (
                    <>
                      {" ... "}
                      <a
                        href={`/sermon/${safeBlogData[0].id}`}
                        className={styles.readMore}
                      >
                        კითხვის გაგრძელება
                      </a>
                    </>
                  )}
                </p>
              </div>
            )}
          </div>
          <div className={styles.videoContainer}>
            {safeVideoData.map((video, index) => (
              <div key={index} className={styles.videoBlock}>
                <iframe
                  className={styles.videoFrame}
                  src={video.link_txt}
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
                <p className={styles.videoDescription}>{video.desc_txt}</p>
              </div>
            ))}
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
                  <span className={styles.contact_label}>
                    საკონტაკტო პირი: დეკანოზი გიორგი კალანდია:
                  </span>
                  <div className={styles.phone_number}>
                    <svg
                      className={styles.phone_icon}
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                    <span className={styles.contact_value}>555-725-709</span>
                  </div>
                </div>
                <div className={styles.contact_info_item}>
                  <span className={styles.contact_label}>მისამართი:</span>
                  <div className={styles.address_value}>
                    თბილისი, ავლაბარი, სამრეკლოს ქუჩა, ყოვლადწმინდა სამების
                    ლავრის ივერიის ღვთისმშობლის ტაძარი.
                  </div>
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
                    href="https://www.facebook.com/deafparish"
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
    const response = await fetch(`${baseUrl}/api/main_database`);
    const result = await response.json();
    console.log("API response in Home:", result); // Add this
    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }

    return {
      props: {
        data: {
          weekData: result.data?.weekData || [],
          auditoriumData: result.data?.auditoriumData || [],
          videoData: result.data?.videoData || [],
          blogData: result.data?.blogData || [],
        },
      },
    };
  } catch (error) {
    console.error("Error in getServerSideProps:", error);
    return {
      props: {
        data: {
          weekData: [],
          auditoriumData: [],
          videoData: [],
          blogData: [],
        },
      },
    };
  }
}
