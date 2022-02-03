import Link from "next/link";
import type { VFC } from "react";
import { Button } from "src/component/shared/Button";

export const FirstView: VFC = () => {
  return (
    <div className="pt-14 bg-cover bg-first-view lg:flex lg:justify-center lg:pb-10">
      <div className="flex flex-col px-4 pt-20 font-bold tracking-wider text-center lg:pb-12 lg:pl-20 lg:w-1/2 lg:max-w-lg lg:text-left">
        <div className="items-center lg:flex">
          <h2 className="text-2xl tracking-wider">体育会の就活は</h2>
          <div>
            <h1 className="text-6xl">Dualing</h1>
            <p className="text-xs tracking-wider text-center">- デュアリング -</p>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row lg:items-end">
          <Link href="/signin">
            <a className="mt-6 mb-2 sm:mx-auto lg:mx-0 lg:mb-0">
              <Button variant="solid-white" className="w-full text-lg font-bold rounded-full shadow-md sm:w-40">
                学生ログイン
              </Button>
            </a>
          </Link>
          <Link href="/signup">
            <a className="m-auto lg:mx-4 lg:mb-0">
              <span className="m-auto text-sm hover:text-gray-600 border-b border-black">
                学生アカウント作成はこちら
              </span>
            </a>
          </Link>
        </div>
        <Link href="/company/signin">
          <a className="m-auto my-8 lg:my-4 lg:mx-0">
            <Button className="text-xs rounded-full shadow-md lg:w-60 lg:text-lg">採用担当者様はこちら</Button>
          </a>
        </Link>
        <div className="mx-6 sm:mx-20 lg:mt-4 lg:mr-8 lg:ml-0">
          体育会の学生が
          <div className="py-1" />
          部活動に全力で取り組みながら
          <div className="py-1" />
          満足のいく就職活動を行えるように。
          <div className="py-1" />
          そんな想いを込めて「Dualing」は生まれました。
          <div className="py-1" />
          時間と場所に縛られない、新しい採用方式で
          <div className="py-1" />
          企業と学生のベストマッチをサポートします。
        </div>
      </div>
      <div className="pt-24 pr-8 pb-8 w-1/2 lg:max-w-lg">
        <div className="hidden w-5/6 h-full bg-cover bg-persons lg:block"></div>
      </div>
    </div>
  );
};
