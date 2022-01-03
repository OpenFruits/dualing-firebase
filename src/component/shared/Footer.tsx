import Link from "next/link";
import type { VFC } from "react";
import { corporateURL, googleFormUrl } from "src/constants/externalLink";

export const Footer: VFC = () => {
  return (
    <footer className="fixed bottom-0 py-3 w-full font-bold text-center text-white bg-theme-dark">
      <ul className="text-sm sm:flex sm:justify-center">
        <li className="mb-1 sm:mx-3">
          <Link href="/support/terms">
            <a>利用規約</a>
          </Link>
        </li>
        <li className="mb-1 sm:mx-3">
          <Link href="/support/privacy-policy">
            <a>プライバシーポリシー</a>
          </Link>
        </li>
        <li className="mb-1 sm:mx-3">
          <Link href={corporateURL}>
            <a>運営会社</a>
          </Link>
        </li>
        <li className="mb-1 sm:mx-3">
          <Link href={googleFormUrl}>
            <a>お問い合わせ</a>
          </Link>
        </li>
      </ul>
      <small>©︎ 2021 Dualing</small>
    </footer>
  );
};
