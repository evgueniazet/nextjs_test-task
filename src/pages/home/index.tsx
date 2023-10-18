import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Inter } from "next/font/google";
import styles from "./Home.module.scss";
import { createApi } from "unsplash-js";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import Button from "@mui/material/Button";
import { SelectChangeEvent } from "@mui/material/Select";
import CircularProgress from "@mui/material/CircularProgress";
import StarOutlinedIcon from "@mui/icons-material/StarOutlined";

const inter = Inter({ subsets: ["latin"] });

const api = createApi({
  accessKey: "EhjvvcJgvqyWAcLKATC7VL5yXnP8lG_1gaaRfp5PNX8",
});

enum ESortDirection {
  ASC = "asc",
  DESC = "desc",
}

type TPhoto = {
  alt_description: string;
  created_at: string;
  description: string;
  id: string;
  likes: number;
  url: string;
};

export default function Home() {
  const router = useRouter();
  const [isLoading, setLoading] = useState(true);
  const [images, setImages] = useState<TPhoto[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [dateSort, setDateSort] = useState<ESortDirection>(ESortDirection.ASC);
  const [likesSort, setLikesSort] = useState<ESortDirection>(
    ESortDirection.ASC
  );
  const [page, setPage] = useState(1);
  const [like, setLike] = useState(false);
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
    setPage(Number(router.query.page) || 1);
    setSelectedCategory((router.query.category as string) || "all");
  }, [router.query]);

  useEffect(() => {
    setLoading(true);
    if (selectedCategory === "all") {
      api.search
        .getPhotos({ query: "all", orientation: "landscape", page })
        .then((result) => {
          console.log("result", result);

          const photos: TPhoto[] =
            result.response?.results.map((item) => ({
              alt_description: item.alt_description || "",
              created_at: item.created_at,
              description: item.description || "",
              id: item.id,
              likes: item.likes,
              url: item.urls.regular,
            })) || [];

          setImages(photos);
          setLoading(false);
        })
        .catch(() => {
          console.log("something went wrong!");
        });
    } else {
      api.collections
        .getPhotos({ collectionId: selectedCategory, page })
        .then((result) => {
          console.log("result", result);
          const photos: TPhoto[] =
            result.response?.results.map((item) => ({
              alt_description: item.alt_description || "",
              created_at: item.created_at,
              description: item.description || "",
              id: item.id,
              likes: item.likes,
              url: item.urls.regular,
            })) || [];

          setImages(photos);
          setLoading(false);
        })
        .catch(() => {
          console.log("something went wrong!");
        });
    }
  }, [selectedCategory, page]);

  useEffect(() => {
    const sortedImages = [...images].sort((a, b) => {
      if (dateSort === ESortDirection.ASC) {
        return (
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      } else {
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      }
    });

    setImages(sortedImages);
  }, [dateSort]);

  useEffect(() => {
    const sortedImages = [...images].sort((a, b) => {
      if (likesSort === ESortDirection.ASC) {
        return a.likes - b.likes;
      } else {
        return b.likes - a.likes;
      }
    });

    setImages(sortedImages);
  }, [likesSort]);

  const handleChangeCategory = (event: SelectChangeEvent<string>) => {
    router.push(`/home?page=1&category=${event.target.value}`);
  };

  const handleDateSort = (event: SelectChangeEvent<ESortDirection>) => {
    setDateSort(event.target.value as ESortDirection);
  };

  const handleLikesSort = (event: SelectChangeEvent<ESortDirection>) => {
    setLikesSort(event.target.value as ESortDirection);
  };

  const handleLikeClick = (itemId: string) => {
    if (activeUserEmail) {
      const userFavorites = localStorage.getItem(activeUserEmail);
      const userFavoritesParsed = userFavorites
        ? JSON.parse(userFavorites)
        : [];

      const isFavoritesExist = userFavoritesParsed.some(
        (item: string) => item === itemId
      );

      if (isFavoritesExist) {
        const filteredFavorites = userFavoritesParsed.filter(
          (item: string) => item !== itemId
        );
        localStorage.setItem(
          activeUserEmail,
          JSON.stringify(filteredFavorites)
        );
      } else {
        userFavoritesParsed.push(itemId);
        localStorage.setItem(
          activeUserEmail,
          JSON.stringify(userFavoritesParsed)
        );
      }
      const isFavoritesExistInState = likes.some((item) => item === itemId);
      if (isFavoritesExistInState) {
        const isFavoritesExistInStateFiltered = likes.filter(
          (item: string) => item !== itemId
        );
        console.log(
          "isFavoritesExistInStateFiltered",
          isFavoritesExistInStateFiltered
        );

        setLikes(isFavoritesExistInStateFiltered);
      } else {
        // setLikes([...likes].push(String(itemId)));

        const likesCopy = [...likes];
        console.log("likesCopy", likesCopy);
        likesCopy.push(itemId);
        console.log("likesCopy2", likesCopy);
        console.log("itemId2", itemId);
      }
    }
  };

  console.log("likes", likes);

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
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

        <section className={styles.filters}>
          <div className={styles.selectWrapper}>
            <InputLabel id="category-select-label">Category:</InputLabel>
            <Select
              size="small"
              labelId="category-select-label"
              className={styles.form}
              id="category-select"
              value={selectedCategory}
              onChange={handleChangeCategory}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="864008">Sea</MenuItem>
              <MenuItem value="401930">Mountains</MenuItem>
              <MenuItem value="254504">Desert</MenuItem>
            </Select>
          </div>

          <div className={styles.sorters}>
            <div className={styles.selectWrapper}>
              <InputLabel id="date-sort-select-label">Sort by date:</InputLabel>
              <Select
                labelId="date-sort-select-label"
                size="small"
                className={styles.form}
                id="date-sort"
                value={dateSort}
                onChange={handleDateSort}
              >
                <MenuItem value={ESortDirection.ASC}>Asc</MenuItem>
                <MenuItem value={ESortDirection.DESC}>Desc</MenuItem>
              </Select>
            </div>
            <div className={styles.selectWrapper}>
              <InputLabel id="likes-sort-select-label">
                Sort by likes:
              </InputLabel>
              <Select
                size="small"
                labelId="likes-sort-select-label"
                className={styles.form}
                id="likes-sort"
                value={likesSort}
                onChange={handleLikesSort}
              >
                <MenuItem value={ESortDirection.ASC}>Asc</MenuItem>
                <MenuItem value={ESortDirection.DESC}>Desc</MenuItem>
              </Select>
            </div>
          </div>
        </section>

        <section className={styles.gallery}>
          {images?.map((item) => (
            <div key={item.id} className={styles.imgContainer}>
              <StarOutlinedIcon
                onClick={() => handleLikeClick(item.id)}
                className={
                  likes?.some((likeItem) => likeItem === item.id)
                    ? styles.imgLikeActive
                    : styles.imgLike
                }
              />
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

        <section className={styles.pagination}>
          <Button
            variant="contained"
            disabled={page === 1}
            onClick={() =>
              router.push(`/home?page=${page - 1}&category=${selectedCategory}`)
            }
          >
            Previous
          </Button>
          <Button
            variant="contained"
            onClick={() =>
              router.push(`/home?page=${page + 1}&category=${selectedCategory}`)
            }
          >
            Next
          </Button>
        </section>
      </main>
    </div>
  );
}
