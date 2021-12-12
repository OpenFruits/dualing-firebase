import { Disclosure } from "@headlessui/react";
import { MinusIcon, PlusIcon } from "@heroicons/react/solid";
import Link from "next/link";
import type { VFC } from "react";
import { ContentTitle } from "src/component/shared/ContentTitle";
import { googleFormUrl } from "src/constants/externalLink";

export const FAQ: VFC = () => {
  const ITMES = [
    {
      question: "お金はかかりますか？",
      answer:
        "無料です。登録および全ての機能を無料でご利用できますのでお気軽にご登録ください。Dualingは「体育会学生のキャリアを豊かにする」ためのサービスです。そのため学生の皆さんから代金は頂かない方針です。",
    },
    {
      question: "他の学生に自分のプロフィールは見られませんか？",
      answer:
        "作成したプロフィールや動画は企業の方のみが参照できます。他の利用学生からプロフィールを見られることはありませんので、安心して自分をアピールしてください。",
    },
    {
      question: "大学を卒業してますが、利用できますか？",
      answer: "Dualingは新卒者専用のサービスです。新卒者の方以外（既卒者）のご登録をお断りしています。",
    },
    {
      question: "迷惑メールや一斉送信メールは来ますか？",
      answer:
        "企業からスカウトやメッセージを受信した時と、運営からイベント開催のお知らせがある場合にご登録のメールアドレス宛にメールを送信させていただきます。",
    },
  ];

  return (
    <div id="faq">
      <div className="w-full h-20 bg-theme-light transform translate-y-4 skew-y-3 lg:translate-y-0">
        <div className="bg-theme-light transform translate-y-6 -skew-y-3 lg:translate-y-10">
          <ContentTitle title="よくある質問" enTitle="FAQ" />
        </div>
      </div>
      <div className="py-10 px-4 pt-14 tracking-wider text-center bg-theme-light">
        {ITMES.map((item) => {
          return (
            <div key={item.question} className="py-2 lg:mx-auto lg:max-w-3xl">
              <Disclosure>
                {({ open }) => (
                  <>
                    <Disclosure.Button
                      className={
                        open
                          ? `flex justify-between w-full p-3 font-bold text-theme-dark text-left bg-white rounded-t-lg focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75`
                          : `flex justify-between w-full p-3 font-bold text-theme-dark text-left bg-white rounded-lg focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75`
                      }
                    >
                      <span>{`Q ${item.question}`}</span>
                      {!open && <PlusIcon className="w-6 h-6 text-theme-dark" />}
                      {open && <MinusIcon className="w-6 h-6 text-theme-dark" />}
                    </Disclosure.Button>
                    <Disclosure.Panel className="px-4 pb-2 text-xs text-left text-theme-dark bg-white rounded-b-lg">
                      {`${item.answer}`}
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            </div>
          );
        })}
        <p className="m-5 text-xs font-bold">
          その他ご不明点がございましたら、
          <Link href={googleFormUrl}>
            <a className="px-1 hover:text-gray-600 border-b border-gray-400">お問い合わせ</a>
          </Link>
          よりご連絡ください。
        </p>
      </div>
    </div>
  );
};
