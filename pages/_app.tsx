import "../src/style/index.css";

import type { AppProps } from "next/app";
import Head from "next/head";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "src/firebase/Auth";

const MyApp = (props: AppProps) => {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AuthProvider>
        <Toaster />
        <props.Component {...props.pageProps} />
      </AuthProvider>
    </>
  );
};

export default MyApp;
