import Link from "next/link";
import router from "next/router";
import type { VFC } from "react";
import { useContext } from "react";
import toast from "react-hot-toast";
import { corporateURL, googleFormUrl } from "src/constants/externalLink";
import { auth } from "src/firebase";
import { AuthContext } from "src/firebase/Auth";

export const Footer: VFC = () => {
  const { setCurrentUser } = useContext(AuthContext);

  const logout = () => {
    if (confirm("ログアウトします。よろしいですか？")) {
      auth.signOut().then(() => {
        setCurrentUser(undefined);
        router.push("/company/signin");
        toast.success("ログアウトしました");
      });
    }
  };

  return (
    <footer className="fixed bottom-0 py-3 w-full font-bold text-white bg-theme-dark">
      <ul className="flex justify-center space-x-6 text-sm">
        <li>
          <Link href={googleFormUrl}>
            <a>お問い合わせ</a>
          </Link>
        </li>
        <li className="cursor-pointer" onClick={logout}>
          ログアウト
        </li>
        <li>
          <Link href="/support/terms">
            <a>利用規約</a>
          </Link>
        </li>
        <li>
          <Link href="/support/privacy-policy">
            <a>プライバシーポリシー</a>
          </Link>
        </li>
        <li>
          <Link href={corporateURL}>
            <a>運営会社</a>
          </Link>
        </li>
      </ul>
    </footer>
  );
};
