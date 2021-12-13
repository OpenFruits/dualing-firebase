import "../src/style/index.css";

import type { AppProps } from "next/app";
import NextHeadSeo from "next-head-seo";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "src/firebase/Auth";

const MyApp = (props: AppProps) => {
  return (
    <>
      <NextHeadSeo
        title="Dualing"
        description="体育会の就活のDualing（デュアリング）"
        og={{
          image: "ogp.jpg",
        }}
        // twitter={{
        //   card: "summary",
        // }}
        customLinkTags={[
          {
            rel: "icon",
            href: "/favicon.ico",
          },
        ]}
      />
      <AuthProvider>
        <Toaster />
        <props.Component {...props.pageProps} />
      </AuthProvider>
    </>
  );
};

export default MyApp;
