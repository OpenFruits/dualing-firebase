import type { VFC } from "react";

export const GrayBox: VFC = () => {
  return (
    <div className="grid items-center place-items-center my-2 mx-auto w-11/12 h-52 bg-gray-400 rounded">
      <p className="text-xl tracking-wider leading-relaxed text-center">
        動画登録中
        <br />
        少々お待ちください
      </p>
    </div>
  );
};
