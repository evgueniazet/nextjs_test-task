import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Inter } from "next/font/google";
import styles from "./Favorites.module.scss";
import { createApi } from "unsplash-js";
import CircularProgress from "@mui/material/CircularProgress";
import { TPhoto } from "@/types/TPhoto";
import Header from "@/components/Header/Header";
import { accessKey } from "../../../config";

const inter = Inter({ subsets: ["latin"] });

const api = createApi({
  accessKey: accessKey,
});

export default function Favorites() {
  const router = useRouter();
  const [isLoading, setLoading] = useState(true);
  const [images, setImages] = useState<TPhoto[]>([]);
  const [likes, setLikes] = useState<string[]>([]);
  const [activeUserEmail, setActiveUserEmail] = useState("");

  useEffect(() => {
    const isAuthorized = JSON.parse(
      localStorage.getItem("authorized") || "false"
    );

    if (!isAuthorized) {
      router.push(`/`);
    } else {
      const activeEmail = localStorage.getItem("user");
      if (activeEmail) {
        const favoritesImagesIds = localStorage.getItem(activeEmail);
        const favoritesImagesIdsParsed = favoritesImagesIds
          ? JSON.parse(favoritesImagesIds)
          : [];

        setActiveUserEmail(activeEmail);
        setLikes(favoritesImagesIdsParsed);
      }
    }
  }, []);

  useEffect(() => {
    const imagePromises = likes.map((item) => {
      return api.photos.get({ photoId: item });
    });
    Promise.all(imagePromises).then((result) => {
      const images = result.map((elem) => {
        const photo: TPhoto = {
          alt_description: elem.response?.alt_description || "",
          created_at: elem.response?.created_at || "",
          description: elem.response?.description || "",
          id: elem.response?.id || "",
          likes: elem.response?.likes || 0,
          url: elem.response?.urls.regular || "",
        };
        return photo;
      });
      setImages(images);
      setLoading(false);
    });
  }, [likes]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Favorites</title>
        <meta name="description" content="Favorites" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <Header />
        <section className={styles.gallery}>
          {images?.map((item) => (
            <div key={item.id} className={styles.imgContainer}>
              <img
                className={styles.img}
                src={item?.url}
                alt={item?.alt_description}
              />
              <div className={styles.info}>
                <span className={styles.infoText}>
                  {new Date(item.created_at).toLocaleString()}
                </span>
                <span className={styles.infoText}> Likes:{item.likes}</span>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className={styles.spinnerContainer}>
              <CircularProgress className={styles.spinner} />
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
