import Head from "next/head";
import { useState } from "react";
import { Inter } from "next/font/google";
import styles from "./Login.module.scss";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useRouter } from "next/router";

const inter = Inter({ subsets: ["latin"] });

const userData = [
  {
    email: "test@test.test",
    password: "123test123",
  },
  {
    email: "test1@test.test",
    password: "321test321",
  },
];

export default function Login() {
  const router = useRouter();
  const [error, setError] = useState("");

  const handleClick = () => {
    const emailInput = document.getElementById(
      "email-input"
    ) as HTMLInputElement;
    const passwordInput = document.getElementById(
      "password-input"
    ) as HTMLInputElement;

    if (emailInput && passwordInput) {
      const email = emailInput.value;
      const password = passwordInput.value;

      if (email === "" ?? password === "") {
        setError("Fields should not be empty");
      } else {
        const user = userData.find((userData) => userData.email === email);

        if (user) {
          if (user.password === password) {
            localStorage.setItem("authorized", "true");
            localStorage.setItem("user", user.email);
            router.push("/home");
          } else {
            setError("Invalid credentials");
          }
        } else {
          setError("Invalid credentials");
        }
      }
    }
  };

  const handleInputChange = () => {
    setError("");
  };

  return (
    <>
      <Head>
        <title>Log In</title>
        <meta name="description" content="Log in" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        {/* //TODO: Add favicon */}
      </Head>
      <main className={`${styles.login} ${inter.className}`}>
        <div className={styles.loginWrapper}>
          <h1 className={styles.loginTitle}>Log In</h1>
          <div className={styles.inputs}>
            <TextField
              className={styles.input}
              id="email-input"
              label="Email"
              variant="outlined"
              onChange={handleInputChange}
            />
            <TextField
              className={styles.input}
              id="password-input"
              label="Password"
              variant="outlined"
              onChange={handleInputChange}
            />
          </div>
          <Button
            onClick={handleClick}
            className={styles.button}
            variant="contained"
          >
            Log in
          </Button>

          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.description}>
            <div className={styles.descriptionTitle}>
              To log in, use the following data:
            </div>
            <div>1 user - Email: test@test.test, Password: 123test123</div>
            <div>2 user - Email: test1@test.test, Password: 321test321</div>
          </div>
        </div>
      </main>
    </>
  );
}
