import { useState } from "react";
import styles from "@/pages/admin94/admin.module.css";

export default function Admin({ initialValues = {} }) {
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

  const [message, setMessage] = useState({ text: "", type: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues2((prev) => ({ ...prev, [name]: value })); // Update values2 instead of values
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
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();

      if (data.error) {
        setMessage({
          text: "შეცდომა მონაცემების შენახვისას: " + data.error,
          type: "error",
        });
      } else {
        setMessage({
          text: "მონაცემები წარმატებით შეინახა!",
          type: "success",
        });
        setTimeout(() => setMessage({ text: "", type: "" }), 5000);
      }
    } catch (error) {
      setMessage({
        text: "შეცდომა მონაცემების შენახვისას: " + error.message,
        type: "error",
      });
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
                value={values2[day.id]} // Use values2 instead of values
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
              value={values2.auditoriumTitle} // Use values2
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
              value={values2.auditoriumDesc} // Use values2
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
              value={values2.video1Link} // Use values2
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
              value={values2.video1Desc} // Use values2
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
              value={values2.video2Link} // Use values2
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
              value={values2.video2Desc} // Use values2
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
              value={values2.video3Link} // Use values2
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
              value={values2.video3Desc} // Use values2
              onChange={handleChange}
              placeholder="შეიყვანეთ ვიდეოს აღწერა..."
            />
          </div>

          <div className={`${styles.input_field} ${styles.input_btn}`}>
            <input type="submit" value="დამახსოვრება" className={styles.btn} />
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
            videoData: [], // Default empty array for videoData
          },
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
      videoData: data.videoData || [], // Include videoData
    };

    return {
      props: {
        initialValues,
      },
    };
  } catch (error) {
    console.error("Error in getServerSideProps:", error);
    return {
      props: {
        initialValues: {
          weekData: {},
          auditoriumData: {},
          videoData: [], // Default empty array for videoData
        },
      },
    };
  }
}
