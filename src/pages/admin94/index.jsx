import { useState } from "react";
import styles from "@/pages/admin94/admin.module.css";

const ALL_WEEK_DAYS = [
  "ორშაბათი",
  "სამშაბათი",
  "ოთხშაბათი",
  "ხუთშაბათი",
  "პარასკევი",
  "შაბათი",
  "კვირა",
];

export default function Admin({ initialValues = {}, initialSermons = [] }) {
  const [schedule, setSchedule] = useState(initialValues.scheduleData || []);
  const [otherValues, setOtherValues] = useState({
    auditoriumTitle: initialValues.auditoriumData?.title || "",
    auditoriumDesc: initialValues.auditoriumData?.desc || "",
    video1Link: initialValues.videoData?.[0]?.link_txt || "",
    video1Desc: initialValues.videoData?.[0]?.desc_txt || "",
    video2Link: initialValues.videoData?.[1]?.link_txt || "",
    video2Desc: initialValues.videoData?.[1]?.desc_txt || "",
    video3Link: initialValues.videoData?.[2]?.link_txt || "",
    video3Desc: initialValues.videoData?.[2]?.desc_txt || "",
  });
  const [sermonValues, setSermonValues] = useState({
    title_post: "",
    sermon_text: "",
    id: null,
  });
  const [sermons, setSermons] = useState(initialSermons);
  const [message, setMessage] = useState({ text: "", type: "" });

  // --- State-ები გალერეისთვის ---
  const [galleryImageFiles, setGalleryImageFiles] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [galleryImages, setGalleryImages] = useState(
    initialValues.galleryImages || []
  );

  const handleOtherChange = (e) => {
    const { name, value } = e.target;
    setOtherValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleScheduleChange = (e, dayId) => {
    const { name, value } = e.target;
    setSchedule((prevSchedule) =>
      prevSchedule.map((day) =>
        day.id === dayId ? { ...day, [name]: value } : day
      )
    );
  };

  const handleSermonChange = (e) => {
    const { name, value } = e.target;
    setSermonValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = {
      scheduleData: schedule,
      auditoriumData: {
        id: 1,
        title: otherValues.auditoriumTitle,
        desc: otherValues.auditoriumDesc,
      },
      videoData: [
        {
          id: 1,
          link_txt: otherValues.video1Link,
          desc_txt: otherValues.video1Desc,
        },
        {
          id: 2,
          link_txt: otherValues.video2Link,
          desc_txt: otherValues.video2Desc,
        },
        {
          id: 3,
          link_txt: otherValues.video3Link,
          desc_txt: otherValues.video3Desc,
        },
      ],
    };

    try {
      const res = await fetch(`/api/main_database`, {
        method: "POST",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      setMessage({ text: "მონაცემები წარმატებით შეინახა!", type: "success" });
      setTimeout(() => setMessage({ text: "", type: "" }), 5000);
    } catch (error) {
      setMessage({
        text: "შეცდომა შენახვისას: " + error.message,
        type: "error",
      });
    }
  };

  const handleSermonSubmit = async (event) => {
    event.preventDefault();
    // ...
  };

  const handleDeleteSermon = async (id) => {
    // ...
  };

  // --- გალერეის ფუნქციები ---
  const handleFileChange = (event) => {
    setGalleryImageFiles(event.target.files);
  };

  const handleGalleryUpload = async () => {
    if (!galleryImageFiles || galleryImageFiles.length === 0) {
      setMessage({ text: "გთხოვთ, აირჩიოთ სურათი(ები)", type: "error" });
      return;
    }

    setIsUploading(true);
    setMessage({
      text: `${galleryImageFiles.length} სურათი იტვირთება...`,
      type: "success",
    });

    try {
      const uploadPromises = Array.from(galleryImageFiles).map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append(
          "upload_preset",
          process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
        );

        const cloudinaryRes = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          { method: "POST", body: formData }
        );
        const cloudinaryData = await cloudinaryRes.json();
        if (cloudinaryData.error) throw new Error(cloudinaryData.error.message);

        const res = await fetch(`/api/main_database`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            newGalleryImageUrl: cloudinaryData.secure_url,
          }),
        });
        const saveData = await res.json();
        if (!res.ok) throw new Error("URL-ის შენახვა ვერ მოხერხდა");

        return saveData.data;
      });

      const uploadedImages = await Promise.all(uploadPromises);

      setGalleryImages((prev) => [...prev, ...uploadedImages]);

      document.getElementById("gallery-file-input").value = "";
      setGalleryImageFiles(null);
      setMessage({
        text: "ყველა სურათი წარმატებით აიტვირთა!",
        type: "success",
      });
    } catch (error) {
      setMessage({ text: `შეცდომა: ${error.message}`, type: "error" });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteGalleryImage = async (id) => {
    if (!confirm("დარწმუნებული ხართ, რომ გსურთ სურათის წაშლა?")) return;

    try {
      const res = await fetch("/api/main_database", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ galleryImageId: id }),
      });

      if (!res.ok) throw new Error("წაშლა ვერ მოხერხდა");

      setGalleryImages((prev) => prev.filter((img) => img.id !== id));
      setMessage({ text: "სურათი წაიშალა!", type: "success" });
    } catch (error) {
      setMessage({ text: `შეცდომა: ${error.message}`, type: "error" });
    }
  };

  return (
    <div className={styles.bodyForm}>
      <div className={styles.wrapper}>
        <h1 className={styles.title}>ადმინისტრაციული პანელი</h1>
        {message.text && (
          <div
            className={
              message.type === "success"
                ? styles.success_message
                : styles.error_message
            }
          >
            {message.text}
          </div>
        )}

        <div className={styles.form}>
          <h2>მთავარი გვერდის გალერეა</h2>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "15px",
              marginBottom: "20px",
              padding: "10px",
              background: "#f8f9fa",
              borderRadius: "8px",
            }}
          >
            {galleryImages.length > 0 ? (
              galleryImages.map((image) => (
                <div key={image.id} style={{ position: "relative" }}>
                  <img
                    src={image.image_url}
                    alt="Gallery item"
                    style={{
                      width: "120px",
                      height: "80px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                  <button
                    onClick={() => handleDeleteGalleryImage(image.id)}
                    style={{
                      position: "absolute",
                      top: "5px",
                      right: "5px",
                      background: "rgba(231, 76, 60, 0.8)",
                      color: "white",
                      border: "none",
                      borderRadius: "50%",
                      cursor: "pointer",
                      width: "24px",
                      height: "24px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "14px",
                      lineHeight: "1",
                    }}
                  >
                    &times;
                  </button>
                </div>
              ))
            ) : (
              <p>გალერეა ცარიელია. გთხოვთ, ატვირთოთ სურათები.</p>
            )}
          </div>

          <div className={styles.input_field}>
            <label className={styles.day_label}>
              <span>აირჩიეთ ახალი სურათ(ებ)ი</span>
            </label>
            <input
              id="gallery-file-input"
              type="file"
              accept="image/png, image/jpeg, image/webp"
              onChange={handleFileChange}
              className={styles.input}
              multiple
            />
          </div>
          <div className={`${styles.input_field} ${styles.input_btn}`}>
            <button
              type="button"
              onClick={handleGalleryUpload}
              disabled={isUploading || !galleryImageFiles}
              className={styles.btn}
            >
              {isUploading ? "იტვირთება..." : "სურათ(ებ)ის ატვირთვა"}
            </button>
          </div>
        </div>

        <hr style={{ margin: "40px 0" }} />

        <form className={styles.form} onSubmit={handleSubmit}>
          <h2>კვირის განრიგი, აუდიტორია და ვიდეოები</h2>
          {schedule.map((day) => (
            <div key={day.id} className={styles.input_field}>
              <label className={styles.day_label}>
                <span>{day.day_name}</span>
              </label>
              <textarea
                className={styles.textarea}
                name="event_description"
                value={day.event_description || ""}
                onChange={(e) => handleScheduleChange(e, day.id)}
                placeholder={`${day.day_name}ს მსახურების აღწერა...`}
              />
              <input
                type="text"
                className={styles.input}
                style={{ marginTop: "8px" }}
                name="event_time"
                value={day.event_time || ""}
                onChange={(e) => handleScheduleChange(e, day.id)}
                placeholder="დრო(ები), მაგ: 10:00, 18:00"
              />
            </div>
          ))}
          {/* ... Other form fields for auditorium and videos ... */}
          <div className={`${styles.input_field} ${styles.input_btn}`}>
            <input
              type="submit"
              value="ყველაფრის დამახსოვრება"
              className={styles.btn}
            />
          </div>
        </form>

        <form className={styles.form} onSubmit={handleSermonSubmit}>
          {/* Sermon management form */}
        </form>
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/main_database`);
    const result = await response.json();

    if (!response.ok || result.error) {
      throw new Error(result.error || `Failed to fetch data`);
    }

    const { data } = result;

    // --- შესწორებული ლოგიკა იწყება აქ ---
    // ვქმნით სრულ განრიგს, მაშინაც კი თუ ბაზიდან ცარიელი მონაცემი მოდის
    const fullSchedule = ALL_WEEK_DAYS.map((dayName, index) => {
      const dayData = data.scheduleData?.find((d) => d.day_name === dayName);
      return {
        id: dayData?.id || index + 1,
        day_name: dayName,
        event_description: dayData?.event_description || "",
        event_time: dayData?.event_time || "",
      };
    });

    // ვქმნით ვიდეოების სრულ სიას
    const fullVideoData = [0, 1, 2].map((index) => {
      const videoItem = data.videoData?.[index];
      return {
        id: videoItem?.id || index + 1,
        link_txt: videoItem?.link_txt || "",
        desc_txt: videoItem?.desc_txt || "",
      };
    });
    // --- შესწორებული ლოგიკა მთავრდება აქ ---

    const initialValues = {
      scheduleData: fullSchedule,
      auditoriumData: data.auditoriumData?.[0] || { title: "", desc: "" },
      videoData: fullVideoData,
      galleryImages: data.galleryImages || [],
    };

    return {
      props: { initialValues, initialSermons: data.blogData || [] },
    };
  } catch (error) {
    console.error("Error in Admin getServerSideProps:", error.message);
    // თუ რაიმე შეცდომა მოხდა, ვაბრუნებთ ცარიელ, მაგრამ ვალიდურ სტრუქტურას
    return {
      props: {
        initialValues: {
          scheduleData: ALL_WEEK_DAYS.map((dayName, index) => ({
            id: index + 1,
            day_name: dayName,
            event_description: "",
            event_time: "",
          })),
          auditoriumData: { title: "", desc: "" },
          videoData: [
            { id: 1, link_txt: "", desc_txt: "" },
            { id: 2, link_txt: "", desc_txt: "" },
            { id: 3, link_txt: "", desc_txt: "" },
          ],
          galleryImages: [],
        },
        initialSermons: [],
      },
    };
  }
}
