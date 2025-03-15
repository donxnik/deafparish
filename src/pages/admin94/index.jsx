import { useState } from "react";
import styles from "@/pages/admin94/admin.module.css";

export default function Admin({ initialValues = {} }) {
  const [values, setValues] = useState({
    wk1: initialValues.wk1 || "",
    wk2: initialValues.wk2 || "",
    wk3: initialValues.wk3 || "",
    wk4: initialValues.wk4 || "",
    wk5: initialValues.wk5 || "",
    wk6: initialValues.wk6 || "",
    wk7: initialValues.wk7 || "",
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
    };

    console.log("Submitting week data:", formData);

    try {
      const baseUrl = "deafparish.ge";
      const res = await fetch(`deafparish.ge/api/main_database`, {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      if (data.error) {
        console.error(data.error);
        setMessage({
          text: "შეცდომა მონაცემების შენახვისას: " + data.error,
          type: "error",
        });
      } else {
        console.log(data.message);
        setMessage({
          text: "კვირის მონაცემები წარმატებით შეინახა!",
          type: "success",
        });

        // Clear message after 5 seconds
        setTimeout(() => {
          setMessage({ text: "", type: "" });
        }, 5000);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
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
        <h1 className={styles.title}>კვირის განრიგის სამართავი პანელი</h1>
        <p className={styles.form_subtitle}>
          შეიყვანეთ თითოეული დღის განრიგის დეტალები
        </p>

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
    const baseUrl = "deafparish.ge";
    console.log("Fetching from URL:", `deafparish.ge/api/main_database`);

    const response = await fetch(`deafparish.ge/api/main_database`);
    const { data, error } = await response.json();

    if (!response.ok || error) {
      console.error("Error fetching week data:", error || response.statusText);
      return {
        props: {
          initialValues: {},
        },
      };
    }

    const initialValues = data && data.length > 0 ? data[0] : {};
    console.log("Initial values fetched:", initialValues);

    return {
      props: {
        initialValues,
      },
    };
  } catch (error) {
    console.error("Error in getServerSideProps:", error);
    return {
      props: {
        initialValues: {},
      },
    };
  }
}
