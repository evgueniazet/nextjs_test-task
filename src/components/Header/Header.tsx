import styles from "./Header.module.scss";
import Button from "@mui/material/Button";
import { useRouter } from "next/router";

export default function Header() {
  const router = useRouter();

  return (
    <header className={styles.header}>
      <Button
        variant="outlined"
        onClick={() => {
          router.push(`/favorites`);
        }}
      >
        Favorites
      </Button>
      <Button
        variant="contained"
        onClick={() => {
          localStorage.setItem("authorized", JSON.stringify(false));
          localStorage.removeItem("user");
          router.push(`/`);
        }}
      >
        Log Out
      </Button>
    </header>
  );
}
