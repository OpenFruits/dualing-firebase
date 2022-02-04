import { ExternalLinkIcon } from "@heroicons/react/solid";
import Link from "next/link";
import type { VFC } from "react";
import { useContext } from "react";
import { AuthContext } from "src/firebase/Auth";

export const OpeningMessage: VFC = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="my-4 mx-2 font-bold">
      <p className="mb-4">{currentUser?.firstName}さん、はじめまして。</p>
      <p className="mb-4">
        Dualingは、あなたの部活と就活の両立を
        <br />
        全力でサポートさせていただきます。
      </p>
      <p className="mb-4">
        企業とマッチングするためには、
        <br />
        あなたの自己PR動画が必要です。
        <div className="flex">
          ビデオ通話サービス「
          <Link href="https://zoom.us/">
            <a target="_blank" className="flex text-blue-700">
              <p>{` ZOOM `}</p>
              <ExternalLinkIcon className="w-5 h-5 translate-y-0.5" />
            </a>
          </Link>
          」を使い、
        </div>
        自己PRのブラッシュアップと
        <br />
        印象の良い動画を撮影します。
      </p>
      <p>
        以下のフォームから
        <br />
        ZOOM希望日時の選択をお願いいたします。
        <br />
        （面談は60分程度の予定です。）
      </p>
    </div>
  );
};
