import type { NextPage } from "next";
import Link from "next/link";
import { Button } from "src/component/shared/Button";
import { Footer } from "src/layout/application/Footer";
import { Header } from "src/layout/application/Header";

const Thanks: NextPage = () => {
  return (
    <>
      <Header pageTitle="" href="/" />
      <div className="grid place-items-center w-screen h-[calc(100vh-128px)] bg-cover bg-first-view">
        <div className="p-8 text-gray-600 bg-white rounded-lg">
          <p className="text-lg">ご利用ありがとうございました。</p>
          <p className="text-lg">再入会の際は、改めて会員登録をしていただく必要があります。</p>
          <div className="flex justify-end mt-4">
            <Link href="/">
              <a>
                <Button className="text-sm rounded shadow-md">トップページへ</Button>
              </a>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Thanks;
