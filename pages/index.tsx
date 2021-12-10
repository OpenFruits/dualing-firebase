import type { CustomNextPage } from "next";
import Head from "next/head";
import { Button } from "src/component/Button/Button";
import { FluidLayout } from "src/layout/FluidLayout";

const Home: CustomNextPage = () => {
  const handleClick = () => {
    alert("Hello World!");
  };

  return (
    <div>
      <Head>
        <title>Index Page</title>
      </Head>

      <div className="space-y-4">
        <h2>Index</h2>
        <Button variant="solid-blue" className="p-2 rounded" onClick={handleClick}>
          show alert!
        </Button>
      </div>
    </div>
  );
};

Home.getLayout = FluidLayout;

export default Home;
