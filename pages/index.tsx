import type { NextPage } from "next";
import { FAQ } from "src/component/LP/FAQ";
import { FirstView } from "src/component/LP/FirstView";
import { Flow } from "src/component/LP/Flow";
import { Footer } from "src/component/LP/Footer";
import { Header } from "src/component/LP/Header";
import { Merit } from "src/component/LP/Merit";
import { Whatis } from "src/component/LP/Whatis";

const Home: NextPage = () => {
  return (
    <>
      <main className="font-sans">
        <Header />
        <FirstView />
        <Whatis />
        <Merit />
        <Flow />
        <FAQ />
        <Footer />
      </main>
    </>
  );
};

export default Home;
