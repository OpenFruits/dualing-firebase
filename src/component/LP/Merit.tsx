import type { VFC } from "react";
import { ContentTitle } from "src/component/shared/ContentTitle";

export const Merit: VFC = () => {
  const ITMES = [
    {
      title: "自分らしさを伝える",
      text: "書類では伝わりにくい「自分らしさ」を動画で企業に伝えることができます",
    },
    {
      title: "スカウトが来る",
      text: "学生は。企業からのスカウトをもとに選考に進みたい企業を選びます。",
    },
    {
      title: "ブラッシュアップ",
      text: "体育会出身のアドバイザーが、あなたの「ガクチカ」をブラッシュアップします。",
    },
  ];

  return (
    <div id="merit">
      <div className="w-full h-20 bg-theme-light transform skew-y-3">
        <div className="bg-theme-light transform translate-y-10 -skew-y-3">
          <ContentTitle title="Dualingの３つの強み" enTitle="merit" />
        </div>
      </div>
      <div className="px-4 pt-8 pb-10 tracking-wider text-center bg-theme-light lg:pb-20">
        <div className="sm:flex sm:justify-center lg:mx-auto lg:max-w-3xl">
          {ITMES.map((item, index) => {
            return (
              <div
                key={item.title}
                className="flex flex-col items-center p-5 my-5 mx-auto w-60 bg-white border border-gray-300 sm:mx-2"
              >
                <div className="flex justify-center items-center w-12 h-12 text-3xl font-semibold text-white bg-theme-dark rounded-full">
                  {index + 1}
                </div>
                <h1 className="my-4 font-bold">{item.title}</h1>
                <p className="px-4 text-xs text-left">{item.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
