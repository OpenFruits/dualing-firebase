import Image from "next/image";
import Link from "next/link";
import type { VFC } from "react";
import { Button } from "src/component/shared/Button";
import { ContentTitle } from "src/component/shared/ContentTitle";

export const Whatis: VFC = () => {
  return (
    <div id="whatis">
      <div className="w-full h-20 bg-white transform -translate-y-16 -skew-y-3 sm:-skew-y-3">
        <div className="transform translate-y-10 skew-y-3 sm:skew-y-3">
          <ContentTitle title="Dualingとは？" enTitle="What is" />
        </div>
      </div>
      <div className="flex flex-col px-4 tracking-wider sm:mx-auto sm:max-w-3xl">
        <p className="m-auto text-lg">
          Dualingは、企業が興味をもった体育会学生にスカウトを送る
          <br />
          就活支援サービスです。
          <br />
          学生は体育会出身のアドバイザーとともに自己PR動画を作成し、
          <br />
          企業が気に入った学生に対してスカウトを送ります。
          <br />
          学生と企業がマッチングすると、選考が始まります。
        </p>
        <div className="mt-6 border border-gray-300">
          <Image src="/scout.png" alt="スカウト" width={770} height={300} />
        </div>
        <Link href="/signup">
          <a className="m-auto">
            <Button className="mt-4 mb-2 rounded-full shadow-md sm:mx-auto sm:w-60 sm:font-bold">
              登録して利用開始する
            </Button>
          </a>
        </Link>
      </div>
    </div>
  );
};
