import { useState } from "react";
import styles from "@/pages/admin94/admin.module.css";

// კვირის დღეების სრული სია, რათა ფორმა ყოველთვის სრულად გამოჩნდეს
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
      const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
      const res = await fetch(`${baseUrl}/api/main_database`, {
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
    const { title_post, sermon_text, id } = sermonValues;
    if (!title_post || !sermon_text) {
      setMessage({ text: "გთხოვთ შეავსოთ ყველა ველი", type: "error" });
      return;
    }

    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
      const method = id ? "PUT" : "POST";
      const url = `${baseUrl}/api/main_database`;
      const requestBody = id
        ? { id, title_post, sermon_text }
        : { newSermon: { title_post, sermon_text } };

      const res = await fetch(url, {
        method,
        body: JSON.stringify(requestBody),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setMessage({
        text: id ? "ქადაგება განახლდა!" : "ქადაგება დაემატა!",
        type: "success",
      });
      setSermonValues({ title_post: "", sermon_text: "", id: null });

      if (id) {
        setSermons(sermons.map((s) => (s.id === id ? data.data : s)));
      } else {
        setSermons([data.data, ...sermons]);
      }
    } catch (error) {
      setMessage({ text: "შეცდომა: " + error.message, type: "error" });
    }
  };

  const handleEditSermon = (sermon) => {
    setSermonValues({
      title_post: sermon.title_post,
      sermon_text: sermon.sermon_text,
      id: sermon.id,
    });
  };

  const handleDeleteSermon = async (id) => {
    if (!confirm("დარწმუნებული ხართ, რომ გსურთ წაშლა?")) return;
    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
      const res = await fetch(`${baseUrl}/api/main_database`, {
        method: "DELETE",
        body: JSON.stringify({ id }),
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      setMessage({ text: "ქადაგება წაიშალა!", type: "success" });
      setSermons(sermons.filter((s) => s.id !== id));
    } catch (error) {
      setMessage({ text: "შეცდომა: " + error.message, type: "error" });
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

        <form className={styles.form} onSubmit={handleSubmit}>
          <h2>კვირის განრიგი</h2>
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
                className={styles.textarea}
                style={{ marginTop: "8px" }}
                name="event_time"
                value={day.event_time || ""}
                onChange={(e) => handleScheduleChange(e, day.id)}
                placeholder="დრო(ები), მაგ: 10:00, 18:00"
              />
            </div>
          ))}

          {/* ... დანარჩენი ფორმა იგივეა ... */}
          <h2>აუდიტორიის აღწერა</h2>
          <div className={styles.input_field}>
            <label className={styles.day_label}>
              <span>სათაური</span>
            </label>
            <input
              type="text"
              className={styles.textarea}
              name="auditoriumTitle"
              value={otherValues.auditoriumTitle}
              onChange={handleOtherChange}
            />
          </div>
          <div className={styles.input_field}>
            <label className={styles.day_label}>
              <span>აღწერა</span>
            </label>
            <textarea
              className={styles.textarea}
              name="auditoriumDesc"
              value={otherValues.auditoriumDesc}
              onChange={handleOtherChange}
            />
          </div>

          <h2>ვიდეო სექცია</h2>
          {[1, 2, 3].map((num) => (
            <div key={num}>
              <div className={styles.input_field}>
                <label className={styles.day_label}>
                  <span>ვიდეო {num} - ლინკი</span>
                </label>
                <input
                  type="text"
                  className={styles.textarea}
                  name={`video${num}Link`}
                  value={otherValues[`video${num}Link`]}
                  onChange={handleOtherChange}
                  placeholder="შეიყვანეთ YouTube ლინკი"
                />
              </div>
              <div className={styles.input_field}>
                <label className={styles.day_label}>
                  <span>ვიდეო {num} - აღწერა</span>
                </label>
                <textarea
                  className={styles.textarea}
                  name={`video${num}Desc`}
                  value={otherValues[`video${num}Desc`]}
                  onChange={handleOtherChange}
                  placeholder="შეიყვანეთ ვიდეოს აღწერა..."
                />
              </div>
            </div>
          ))}
          <div className={`${styles.input_field} ${styles.input_btn}`}>
            <input
              type="submit"
              value="ყველაფრის დამახსოვრება"
              className={styles.btn}
            />
          </div>
        </form>

        <h2>ქადაგებების მართვა</h2>
        <form className={styles.form} onSubmit={handleSermonSubmit}>
          <div className={styles.input_field}>
            <label className={styles.day_label}>
              <span>ქადაგების სათაური</span>
            </label>
            <input
              type="text"
              className={styles.input}
              name="title_post"
              value={sermonValues.title_post}
              onChange={handleSermonChange}
            />
          </div>
          <div className={styles.input_field}>
            <label className={styles.day_label}>
              <span>ქადაგების ტექსტი</span>
            </label>
            <textarea
              className={styles.textarea}
              name="sermon_text"
              value={sermonValues.sermon_text}
              onChange={handleSermonChange}
            />
          </div>
          <div className={`${styles.input_field} ${styles.input_btn}`}>
            <input
              type="submit"
              value={sermonValues.id ? "განახლება" : "დამატება"}
              className={styles.btn}
            />
            <button
              type="button"
              onClick={() =>
                setSermonValues({ title_post: "", sermon_text: "", id: null })
              }
              className={`${styles.btn} ${styles.resetBtn}`}
            >
              გასუფთავება
            </button>
          </div>
          <div className={styles.sermonList}>
            <h3>არსებული ქადაგებები</h3>
            {sermons.length > 0 ? (
              <ul>
                {sermons.map((sermon) => (
                  <li key={sermon.id} className={styles.sermonItem}>
                    <span
                      onClick={() => handleEditSermon(sermon)}
                      className={styles.sermonTitle}
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
            ) : (
              <p>ქადაგებები არ არის დამატებული.</p>
            )}
          </div>
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
      throw new Error(
        result.error || `Failed to fetch data with status: ${response.status}`
      );
    }

    const { data } = result;

    // ვქმნით სრულ 7-დღიან მასივს, რათა ფორმა ყოველთვის სწორად გამოჩნდეს
    const fullSchedule = ALL_WEEK_DAYS.map((dayName, index) => {
      const existingDay = data.scheduleData?.find(
        (d) => d.day_name === dayName
      );
      return (
        existingDay || {
          id: index + 1,
          day_name: dayName,
          event_description: "",
          event_time: "",
        }
      );
    });

    const initialValues = {
      scheduleData: fullSchedule,
      auditoriumData: data.auditoriumData?.[0] || {},
      videoData: data.videoData || [],
    };

    return {
      props: {
        initialValues,
        initialSermons: data.blogData || [],
      },
    };
  } catch (error) {
    console.error("Error in Admin getServerSideProps:", error.message);
    // შეცდომის შემთხვევაშიც ვაბრუნებთ ცარიელ, მაგრამ სრულ სტრუქტურას
    const fallbackSchedule = ALL_WEEK_DAYS.map((dayName, index) => ({
      id: index + 1,
      day_name: dayName,
      event_description: "",
      event_time: "",
    }));

    return {
      props: {
        initialValues: {
          scheduleData: fallbackSchedule,
          auditoriumData: {},
          videoData: [],
        },
        initialSermons: [],
      },
    };
  }
}
