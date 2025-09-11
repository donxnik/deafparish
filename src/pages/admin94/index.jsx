import { useState } from "react";
import { useRouter } from "next/router";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
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
  // --- ავთენტიფიკაციისთვის საჭირო Hook-ები ---
  const router = useRouter();
  const [supabase] = useState(() => createPagesBrowserClient());

  // --- მდგომარეობები (States) ---
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
  const [galleryImageFiles, setGalleryImageFiles] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [galleryImages, setGalleryImages] = useState(
    initialValues.galleryImages || []
  );

  // --- ფუნქციები ---

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

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

  const handleFileChange = (event) => {
    setGalleryImageFiles(event.target.files);
  };

  const showAndHideMessage = (text, type, duration = 5000) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), duration);
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
      showAndHideMessage("მონაცემები წარმატებით შეინახა!", "success");
    } catch (error) {
      showAndHideMessage(`შეცდომა შენახვისას: ${error.message}`, "error");
    }
  };

  const handleSermonSubmit = async (event) => {
    event.preventDefault();
    const method = sermonValues.id ? "PUT" : "POST";
    const body = sermonValues.id
      ? { ...sermonValues }
      : {
          newSermon: {
            title_post: sermonValues.title_post,
            sermon_text: sermonValues.sermon_text,
          },
        };

    try {
      const res = await fetch("/api/main_database", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);

      if (sermonValues.id) {
        setSermons(
          sermons.map((s) => (s.id === sermonValues.id ? result.data : s))
        );
        showAndHideMessage("ქადაგება განახლდა!", "success");
      } else {
        setSermons([result.data, ...sermons]);
        showAndHideMessage("ქადაგება დაემატა!", "success");
      }
      setSermonValues({ title_post: "", sermon_text: "", id: null });
    } catch (error) {
      showAndHideMessage(`შეცდომა: ${error.message}`, "error");
    }
  };

  const handleEditSermon = (sermon) => {
    setSermonValues({
      id: sermon.id,
      title_post: sermon.title_post,
      sermon_text: sermon.sermon_text,
    });
  };

  const handleDeleteSermon = async (id) => {
    if (!confirm("დარწმუნებული ხართ, რომ გსურთ ქადაგების წაშლა?")) return;
    try {
      const res = await fetch("/api/main_database", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sermonId: id }),
      });
      if (!res.ok) throw new Error("წაშლა ვერ მოხერხდა");
      setSermons(sermons.filter((s) => s.id !== id));
      showAndHideMessage("ქადაგება წაიშალა!", "success");
    } catch (error) {
      showAndHideMessage(`შეცდომა: ${error.message}`, "error");
    }
  };

  const handleGalleryUpload = async () => {
    if (!galleryImageFiles || galleryImageFiles.length === 0) {
      return showAndHideMessage("გთხოვთ, აირჩიოთ სურათი(ები)", "error");
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
      showAndHideMessage("ყველა სურათი წარმატებით აიტვირთა!", "success");
    } catch (error) {
      showAndHideMessage(`შეცდომა: ${error.message}`, "error");
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
      showAndHideMessage("სურათი წაიშალა!", "success");
    } catch (error) {
      showAndHideMessage(`შეცდომა: ${error.message}`, "error");
    }
  };

  return (
    <div className={styles.bodyForm}>
      <div className={styles.wrapper}>
        <h1 className={styles.title}>ადმინისტრაციული პანელი</h1>
        <div style={{ textAlign: "right", marginBottom: "20px" }}>
          <button
            onClick={handleLogout}
            className={`${styles.btn} ${styles.deleteBtn}`}
            style={{ width: "auto" }}
          >
            გასვლა
          </button>
        </div>

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

        {/* --- გალერეის სექცია --- */}
        <div className={styles.form}>
          <h2>მთავარი გვერდის გალერეა</h2>
          <div className={styles.galleryPreview}>
            {galleryImages.length > 0 ? (
              galleryImages.map((image) => (
                <div key={image.id} className={styles.galleryPreviewItem}>
                  <img src={image.image_url} alt="Gallery item" />
                  <button
                    onClick={() => handleDeleteGalleryImage(image.id)}
                    className={styles.galleryDeleteBtn}
                  >
                    &times;
                  </button>
                </div>
              ))
            ) : (
              <p>გალერეა ცარიელია.</p>
            )}
          </div>
          <div className={styles.input_field}>
            <label>აირჩიეთ ახალი სურათ(ებ)ი</label>
            <input
              id="gallery-file-input"
              type="file"
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
        <hr className={styles.hr} />

        {/* --- განრიგის, აუდიტორიის და ვიდეოების სექცია --- */}
        <form className={styles.form} onSubmit={handleSubmit}>
          <h2>კვირის განრიგი, აუდიტორია და ვიდეოები</h2>
          {schedule.map((day) => (
            <div key={day.id} className={styles.input_field}>
              <label>{day.day_name}</label>
              <textarea
                className={styles.textarea}
                name="event_description"
                value={day.event_description || ""}
                onChange={(e) => handleScheduleChange(e, day.id)}
              />
              <input
                type="text"
                className={styles.input}
                style={{ marginTop: "8px" }}
                name="event_time"
                value={day.event_time || ""}
                onChange={(e) => handleScheduleChange(e, day.id)}
              />
            </div>
          ))}
          <div className={styles.input_field}>
            <label>აუდიტორიის სათაური</label>
            <input
              type="text"
              name="auditoriumTitle"
              value={otherValues.auditoriumTitle}
              onChange={handleOtherChange}
              className={styles.input}
            />
          </div>
          <div className={styles.input_field}>
            <label>აუდიტორიის ტექსტი</label>
            <textarea
              name="auditoriumDesc"
              value={otherValues.auditoriumDesc}
              onChange={handleOtherChange}
              className={styles.textarea}
            ></textarea>
          </div>
          {[1, 2, 3].map((num) => (
            <div key={num}>
              <div className={styles.input_field}>
                <label>ვიდეო {num} - Embed ლინკი</label>
                <input
                  type="text"
                  name={`video${num}Link`}
                  value={otherValues[`video${num}Link`]}
                  onChange={handleOtherChange}
                  className={styles.input}
                />
              </div>
              <div className={styles.input_field}>
                <label>ვიდეო {num} - აღწერა</label>
                <input
                  type="text"
                  name={`video${num}Desc`}
                  value={otherValues[`video${num}Desc`]}
                  onChange={handleOtherChange}
                  className={styles.input}
                />
              </div>
            </div>
          ))}
          <div className={`${styles.input_field} ${styles.input_btn}`}>
            <input
              type="submit"
              value="განრიგის, აუდიტორიის და ვიდეოების შენახვა"
              className={styles.btn}
            />
          </div>
        </form>
        <hr className={styles.hr} />

        {/* --- ქადაგებების სექცია --- */}
        <form className={styles.form} onSubmit={handleSermonSubmit}>
          <h2>
            {sermonValues.id
              ? "ქადაგების რედაქტირება"
              : "ახალი ქადაგების დამატება"}
          </h2>
          <div className={styles.input_field}>
            <label>სათაური</label>
            <input
              type="text"
              name="title_post"
              value={sermonValues.title_post}
              onChange={handleSermonChange}
              className={styles.input}
            />
          </div>
          <div className={styles.input_field}>
            <label>ქადაგების ტექსტი</label>
            <textarea
              name="sermon_text"
              value={sermonValues.sermon_text}
              onChange={handleSermonChange}
              className={styles.textarea}
            ></textarea>
          </div>
          <div className={`${styles.input_field} ${styles.input_btn}`}>
            <input
              type="submit"
              value={sermonValues.id ? "განახლება" : "დამატება"}
              className={styles.btn}
            />
            {sermonValues.id && (
              <button
                type="button"
                onClick={() =>
                  setSermonValues({ id: null, title_post: "", sermon_text: "" })
                }
                className={`${styles.btn} ${styles.resetBtn}`}
              >
                გასუფთავება
              </button>
            )}
          </div>
        </form>

        <div className={styles.sermonList}>
          <h3>არსებული ქადაგებები</h3>
          <ul>
            {sermons.map((sermon) => (
              <li key={sermon.id} className={styles.sermonItem}>
                <span
                  className={styles.sermonTitle}
                  onClick={() => handleEditSermon(sermon)}
                >
                  {sermon.title_post}
                </span>
                <button
                  onClick={() => handleDeleteSermon(sermon.id)}
                  className={styles.deleteBtn}
                >
                  წაშლა
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// getServerSideProps რჩება იგივე, რაც ბოლო ვერსიაში გვქონდა
export async function getServerSideProps() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/main_database`);
    const result = await response.json();

    if (!response.ok || result.error) {
      throw new Error(result.error || `Failed to fetch data`);
    }

    const { data } = result;

    const fullSchedule = ALL_WEEK_DAYS.map((dayName, index) => {
      const dayData = data.scheduleData?.find((d) => d.day_name === dayName);
      return {
        id: dayData?.id || index + 1,
        day_name: dayName,
        event_description: dayData?.event_description || "",
        event_time: dayData?.event_time || "",
      };
    });

    const fullVideoData = [0, 1, 2].map((index) => {
      const videoItem = data.videoData?.[index];
      return {
        id: videoItem?.id || index + 1,
        link_txt: videoItem?.link_txt || "",
        desc_txt: videoItem?.desc_txt || "",
      };
    });

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
          videoData: [{}, {}, {}],
          galleryImages: [],
        },
        initialSermons: [],
      },
    };
  }
}
