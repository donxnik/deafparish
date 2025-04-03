import { useState } from "react";
import styles from "@/pages/admin94/admin.module.css";

export default function Admin({ initialValues = {}, initialSermons = [] }) {
  const [values2, setValues2] = useState({
    wk1: initialValues.weekData?.wk1 || "",
    wk2: initialValues.weekData?.wk2 || "",
    wk3: initialValues.weekData?.wk3 || "",
    wk4: initialValues.weekData?.wk4 || "",
    wk5: initialValues.weekData?.wk5 || "",
    wk6: initialValues.weekData?.wk6 || "",
    wk7: initialValues.weekData?.wk7 || "",
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
    id: null, // For editing
  });
  const [sermons, setSermons] = useState(initialSermons);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues2((prev) => ({ ...prev, [name]: value }));
  };

  const handleSermonChange = (e) => {
    const { name, value } = e.target;
    setSermonValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = {
      id: 1,
      wk1: values2.wk1 || "",
      wk2: values2.wk2 || "",
      wk3: values2.wk3 || "",
      wk4: values2.wk4 || "",
      wk5: values2.wk5 || "",
      wk6: values2.wk6 || "",
      wk7: values2.wk7 || "",
      title: values2.auditoriumTitle || "",
      desc: values2.auditoriumDesc || "",
      videoData: [
        {
          id: 1,
          link_txt: values2.video1Link || "",
          desc_txt: values2.video1Desc || "",
        },
        {
          id: 2,
          link_txt: values2.video2Link || "",
          desc_txt: values2.video2Desc || "",
        },
        {
          id: 3,
          link_txt: values2.video3Link || "",
          desc_txt: values2.video3Desc || "",
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

      const data = await res.json();

      if (data.error) {
        setMessage({
          text: "შეცდომა მონაცემების შენახვისას: " + data.error,
          type: "error",
        });
      } else {
        setMessage({ text: "მონაცემები წარმატებით შეინახა!", type: "success" });
        setTimeout(() => setMessage({ text: "", type: "" }), 5000);
      }
    } catch (error) {
      setMessage({
        text: "შეცდომა მონაცემების შენახვისას: " + error.message,
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

      // For POST, ensure id is null to avoid sending an old id
      const requestBody = id
        ? { id, title_post, sermon_text }
        : { title_post, sermon_text }; // Explicitly omit id for new sermons

      const res = await fetch(url, {
        method,
        body: JSON.stringify(requestBody),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();

      if (data.error) {
        setMessage({ text: "შეცდომა: " + data.error, type: "error" });
      } else {
        setMessage({
          text: id ? "ქადაგება განახლდა!" : "ქადაგება დაემატა!",
          type: "success",
        });
        setSermonValues({ title_post: "", sermon_text: "", id: null });
        const updatedSermons = id
          ? sermons.map((s) =>
              s.id === id ? { ...s, title_post, sermon_text } : s
            )
          : [{ id: data.data.id, title_post, sermon_text }, ...sermons];
        setSermons(updatedSermons);
        setTimeout(() => setMessage({ text: "", type: "" }), 5000);
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

      const data = await res.json();

      if (data.error) {
        setMessage({ text: "შეცდომა: " + data.error, type: "error" });
      } else {
        setMessage({ text: "ქადაგება წაიშალა!", type: "success" });
        setSermons(sermons.filter((s) => s.id !== id));
        setTimeout(() => setMessage({ text: "", type: "" }), 5000);
      }
    } catch (error) {
      setMessage({ text: "შეცდომა: " + error.message, type: "error" });
    }
  };

  const dayNames = [
    { id: "wk1", name: "ორშაბათი" },
    { id: "wk2", name: "სამშაბათი" },
    { id: "wk3", name: "ოთხშაბათი" },
    { id: "wk4", name: "ხუთშაბათი" },
    { id: "wk5", name: "პარასკევი" },
    { id: "wk6", name: "შაბათი" },
    { id: "wk7", name: "კვირა" },
  ];

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
          {dayNames.map((day) => (
            <div key={day.id} className={styles.input_field}>
              <label className={styles.day_label}>
                <span>{day.name}</span>
              </label>
              <textarea
                className={styles.textarea}
                name={day.id}
                value={values2[day.id]}
                onChange={handleChange}
                placeholder={`შეიყვანეთ ${day.name}ს განრიგი...`}
              />
              <p>შეიყვანეთ დროები ფორმატით xx:xx დროის წითლად გამოსაჩენად</p>
            </div>
          ))}

          <h2>აუდიტორიის აღწერა</h2>
          <div className={styles.input_field}>
            <label className={styles.day_label}>
              <span>სათაური</span>
            </label>
            <input
              type="text"
              className={styles.textarea}
              name="auditoriumTitle"
              value={values2.auditoriumTitle}
              onChange={handleChange}
              placeholder="შეიყვანეთ აუდიტორიის სათაური..."
            />
          </div>
          <div className={styles.input_field}>
            <label className={styles.day_label}>
              <span>აღწერა</span>
            </label>
            <textarea
              className={styles.textarea}
              name="auditoriumDesc"
              value={values2.auditoriumDesc}
              onChange={handleChange}
              placeholder="შეიყვანეთ აუდიტორიის აღწერა..."
            />
          </div>

          <h2>ვიდეო სექცია</h2>
          <div className={styles.input_field}>
            <label className={styles.day_label}>
              <span>ვიდეო 1 - ლინკი</span>
            </label>
            <input
              type="text"
              className={styles.textarea}
              name="video1Link"
              value={values2.video1Link}
              onChange={handleChange}
              placeholder="შეიყვანეთ YouTube ლინკი (მაგ: https://www.youtube.com/watch?v=...)"
            />
          </div>
          <div className={styles.input_field}>
            <label className={styles.day_label}>
              <span>ვიდეო 1 - აღწერა</span>
            </label>
            <textarea
              className={styles.textarea}
              name="video1Desc"
              value={values2.video1Desc}
              onChange={handleChange}
              placeholder="შეიყვანეთ ვიდეოს აღწერა..."
            />
          </div>

          <div className={styles.input_field}>
            <label className={styles.day_label}>
              <span>ვიდეო 2 - ლინკი</span>
            </label>
            <input
              type="text"
              className={styles.textarea}
              name="video2Link"
              value={values2.video2Link}
              onChange={handleChange}
              placeholder="შეიყვანეთ YouTube ლინკი (მაგ: https://www.youtube.com/watch?v=...)"
            />
          </div>
          <div className={styles.input_field}>
            <label className={styles.day_label}>
              <span>ვიდეო 2 - აღწერა</span>
            </label>
            <textarea
              className={styles.textarea}
              name="video2Desc"
              value={values2.video2Desc}
              onChange={handleChange}
              placeholder="შეიყვანეთ ვიდეოს აღწერა..."
            />
          </div>

          <div className={styles.input_field}>
            <label className={styles.day_label}>
              <span>ვიდეო 3 - ლინკი</span>
            </label>
            <input
              type="text"
              className={styles.textarea}
              name="video3Link"
              value={values2.video3Link}
              onChange={handleChange}
              placeholder="შეიყვანეთ YouTube ლინკი (მაგ: https://www.youtube.com/watch?v=...)"
            />
          </div>
          <div className={styles.input_field}>
            <label className={styles.day_label}>
              <span>ვიდეო 3 - აღწერა</span>
            </label>
            <textarea
              className={styles.textarea}
              name="video3Desc"
              value={values2.video3Desc}
              onChange={handleChange}
              placeholder="შეიყვანეთ ვიდეოს აღწერა..."
            />
          </div>

          <div className={`${styles.input_field} ${styles.input_btn}`}>
            <input type="submit" value="დამახსოვრება" className={styles.btn} />
          </div>
        </form>

        {/* Sermon Management Section */}
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
              placeholder="შეიყვანეთ ქადაგების სათაური..."
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
              placeholder="შეიყვანეთ ქადაგების ტექსტი..."
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
              className={`${styles.btn} ${styles.resetBtn}`} // Add resetBtn class
            >
              ახალი ქადაგება
            </button>
          </div>

          {/* Sermon List */}
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
    const { data, error } = await response.json();
    console.log("API response in Admin:", data, "Error:", error);
    if (!response.ok || error) {
      return {
        props: {
          initialValues: {
            weekData: {},
            auditoriumData: {},
            videoData: [],
          },
          initialSermons: [],
        },
      };
    }

    const initialValues = {
      weekData:
        data.weekData && data.weekData.length > 0 ? data.weekData[0] : {},
      auditoriumData:
        data.auditoriumData && data.auditoriumData.length > 0
          ? data.auditoriumData[0]
          : {},
      videoData: data.videoData || [],
    };

    return {
      props: {
        initialValues,
        initialSermons: data.blogData || [],
      },
    };
  } catch (error) {
    console.error("Error in getServerSideProps:", error);
    return {
      props: {
        initialValues: {
          weekData: {},
          auditoriumData: {},
          videoData: [],
        },
        initialSermons: [],
      },
    };
  }
}
