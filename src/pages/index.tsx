import Head from "next/head";
import { useEffect, useState } from "react";
import { Inter } from "next/font/google";
import styles from "./Login.module.scss";
import Button from "@mui/material/Button";
import data from "../data.json";
import { createApi } from "unsplash-js";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { SelectChangeEvent } from "@mui/material/Select";
import CircularProgress from "@mui/material/CircularProgress";

const inter = Inter({ subsets: ["latin"] });

export default function Login() {

  return (
    <>
      <Head>
        <title>Log In</title>
        <meta name="description" content="Log in" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        // TODO: Add favicon
      </Head>
      <main className={`${styles.main} ${inter.className}`}></main>
    </>
  );
}
