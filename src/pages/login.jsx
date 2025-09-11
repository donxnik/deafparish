// pages/login.jsx
import { useState } from "react";
import { useRouter } from "next/router";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import styles from "../styles/Login.module.css";

export default function LoginPage() {
  const [supabase] = useState(() => createPagesBrowserClient());
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("ელ.ფოსტა ან პაროლი არასწორია.");
      setLoading(false); // <-- setLoading(false) ახლა მხოლოდ შეცდომის დროს სრულდება
    } else {
      // წარმატების შემთხვევაში setLoading(false) აღარ გვჭირდება,
      // რადგან router.push გადაიყვანს ახალ გვერდზე და ეს კომპონენტი მაინც გაქრება.
      router.push("/admin94");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <h1 className={styles.title}>ავტორიზაცია</h1>
        <form onSubmit={handleLogin}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">ელ. ფოსტა</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">პაროლი</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? "იტვირთება..." : "შესვლა"}
          </button>
        </form>
      </div>
    </div>
  );
}
