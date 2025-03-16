import { useState } from "react";
import styles from "@/pages/admin94/admin.module.css";

export default function Admin({ initialValues = {} }) {
  const [values, setValues] = useState({
    wk1: initialValues.weekData?.wk1 || "",
    wk2: initialValues.weekData?.wk2 || "",
    wk3: initialValues.weekData?.wk3 || "",
    wk4: initialValues.weekData?.wk4 || "",
    wk5: initialValues.weekData?.wk5 || "",
    wk6: initialValues.weekData?.wk6 || "",
    wk7: initialValues.weekData?.wk7 || "",
    auditoriumTitle: initialValues.auditoriumData?.title || "",
    auditoriumDesc: initialValues.auditoriumData?.desc || "",
  });

  const [message, setMessage] = useState({ text: "", type: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = {
      id: 1,
      wk1: values.wk1 || "",
      wk2: values.wk2 || "",
      wk3: values.wk3 || "",
      wk4: values.wk4 || "",
      wk5: values.wk5 || "",
      wk6: values.wk6 || "",
      wk7: values.wk7 || "",
      title: values.auditoriumTitle || "",
      desc: values.auditoriumDesc || "",
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
                value={values[day.id]}
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
              value={values.auditoriumTitle}
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
              value={values.auditoriumDesc}
              onChange={handleChange}
              placeholder="შეიყვანეთ აუდიტორიის აღწერა..."
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
    console.log("API response in Admin:", data, "Error:", error); // Add this
    if (!response.ok || error) {
      return {
        props: {
          initialValues: {
            weekData: {},
            auditoriumData: {},
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
        },
      },
    };
  }
}
