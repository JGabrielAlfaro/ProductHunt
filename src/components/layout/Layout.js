import Link from "next/link";
import Header from "./Header";
import Head from "next/head";
import "../../css/index";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>Product Hunt Firebase y Next.js</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <ToastContainer />
      <Header />
      <main>{children}</main>
    </>
  );
}
