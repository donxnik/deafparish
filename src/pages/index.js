import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.css";
import auditoriumIMG from "../images/clasroom.jpg";
import e1 from "../images/e1.jpg";
import e2 from "../images/e2.jpg";
import e3 from "../images/e3.jpg";
import e4 from "../images/e4.jpg";
import e5 from "../images/e5.jpg";
import e6 from "../images/e6.jpg";
import e7 from "../images/e7.jpg";
import iveriaIMG from "../images/iveria.jpg";
import mapSameba from "../images/map_sameba.jpg";
import iconByz from "../images/icon_byz.png";
import { useState, useEffect } from "react";

function formatTextWithRedTime(text) {
  if (!text) return text;

  const timeRegex = /(\d{1,2}):(\d{2})/g;
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
  const [expandedDays, setExpandedDays] = useState([]);
  const images = [e1, e2, e3, e4, e5, e6, e7];
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

  const toggleExpand = (dayKey) => {
    setExpandedDays((prev) =>
      prev.includes(dayKey)
        ? prev.filter((key) => key !== dayKey)
        : [...prev, dayKey]
    );
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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % images.length);
    }, 8000);

    return () => clearInterval(timer);
  }, [images.length]);

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
        <title>ივერიის ღვთისმშობლის ტაძარი</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.angelOverlay}>
          <div className={styles.leftAngel}></div>
          <div className={styles.rightAngel}></div>
        </div>
        <div className={styles.contentWrapper}>
          <div className={styles.headerTitle}>ივერიის ღვთისმშობლის ტაძარი</div>
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
            <div className={styles.week_calendar_vineyard}></div>
            <div className={styles.week_calendar_inner}>
              <div className={`${styles.week_day} ${styles.leftColumn}`}>
                <div className={styles.week_day_item} data-day-order="1">
                  <h1 onClick={() => toggleExpand("wk1")}>{dayNames[0]}</h1>
                  <div
                    className={`${styles.week_day_text} ${
                      expandedDays.includes("wk1") ? styles.expanded : ""
                    }`}
                  >
                    <p>{formatTextWithRedTime(weekDays.wk1)}</p>
                  </div>
                </div>
                <div className={styles.week_day_item} data-day-order="3">
                  <h1 onClick={() => toggleExpand("wk3")}>{dayNames[2]}</h1>
                  <div
                    className={`${styles.week_day_text} ${
                      expandedDays.includes("wk3") ? styles.expanded : ""
                    }`}
                  >
                    <p>{formatTextWithRedTime(weekDays.wk3)}</p>
                  </div>
                </div>
                <div className={styles.week_day_item} data-day-order="6">
                  <h1 onClick={() => toggleExpand("wk5")}>{dayNames[4]}</h1>
                  <div
                    className={`${styles.week_day_text} ${
                      expandedDays.includes("wk5") ? styles.expanded : ""
                    }`}
                  >
                    <p>{formatTextWithRedTime(weekDays.wk5)}</p>
                  </div>
                </div>
              </div>

              <div className={styles.iveria_image} data-day-order="4">
                <Image
                  src={iveriaIMG}
                  alt="Iveria Icon"
                  width={200}
                  height={300}
                  loading="lazy"
                  className={styles.rounded_image}
                />
              </div>

              <div className={`${styles.week_day} ${styles.rightColumn}`}>
                <div className={styles.week_day_item} data-day-order="2">
                  <h1 onClick={() => toggleExpand("wk2")}>{dayNames[1]}</h1>
                  <div
                    className={`${styles.week_day_text} ${
                      expandedDays.includes("wk2") ? styles.expanded : ""
                    }`}
                  >
                    <p>{formatTextWithRedTime(weekDays.wk2)}</p>
                  </div>
                </div>
                <div className={styles.week_day_item} data-day-order="5">
                  <h1 onClick={() => toggleExpand("wk4")}>{dayNames[3]}</h1>
                  <div
                    className={`${styles.week_day_text} ${
                      expandedDays.includes("wk4") ? styles.expanded : ""
                    }`}
                  >
                    <p>{formatTextWithRedTime(weekDays.wk4)}</p>
                  </div>
                </div>
                <div className={styles.week_day_item} data-day-order="7">
                  <h1 onClick={() => toggleExpand("wk6")}>{dayNames[5]}</h1>
                  <div
                    className={`${styles.week_day_text} ${
                      expandedDays.includes("wk6") ? styles.expanded : ""
                    }`}
                  >
                    <p>{formatTextWithRedTime(weekDays.wk6)}</p>
                  </div>
                </div>
              </div>

              <div
                className={`${styles.week_day} ${styles.bottomRow}`}
                data-day-order="8"
              >
                <div className={styles.week_day_item}>
                  <h1 onClick={() => toggleExpand("wk7")}>{dayNames[6]}</h1>
                  <div
                    className={`${styles.week_day_text} ${
                      expandedDays.includes("wk7") ? styles.expanded : ""
                    }`}
                  >
                    <p>{formatTextWithRedTime(weekDays.wk7)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.auditorium}>
            <div className={styles.auditorium_vineyard}></div>
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
              width={150}
              height={150}
              className={styles.ornamentImage}
            />
          </div>

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
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
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
                  src={mapSameba}
                  alt="location map"
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className={styles.sub_contact_desc}>
                <div className={styles.contact_info_item}>
                  <span className={styles.contact_label}>
                    საკონტაქტო პირი: დეკანოზი გიორგი კალანდია:
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
    console.log("API response in Home:", result);
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
