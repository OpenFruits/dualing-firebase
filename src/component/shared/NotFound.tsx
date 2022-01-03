import { useRouter } from "next/router";
import type { VFC } from "react";
import { useContext } from "react";
import { Button } from "src/component/shared/Button";
import { Footer } from "src/component/shared/Footer";
import { Header } from "src/component/shared/Header";
import { auth } from "src/firebase";
import { AuthContext } from "src/firebase/Auth";

export const NotFound: VFC = () => {
  const router = useRouter();
  const { setCurrentUser } = useContext(AuthContext);

  const logout = () => {
    if (auth.currentUser) {
      auth.signOut().then(() => {
        setCurrentUser(undefined);
      });
    }
  };

  const studentSignin = () => {
    logout();
    router.push("/signin");
  };

  const companySignin = () => {
    logout();
    router.push("/company/signin");
  };

  return (
    <div>
      <Header pageTitle="" href="/" />
      <div className="grid place-items-center w-screen h-[calc(100vh-128px)] bg-cover bg-first-view">
        <div className="p-8 text-gray-600 bg-white rounded-lg">
          <p className="text-lg">ページが見つかりません。</p>
          <p className="text-lg">
            ページを更新しても表示が変わらない場合、
            <br />
            URLが間違っている可能性があります。お確かめください。
          </p>
          <div className="my-1.5 border-t" />
          <p>
            ログインは済んでいますか？
            <br />
            ログイン状態でなければアクセスできないページの可能性があります。
          </p>
          <div className="flex mt-2 space-x-4">
            <Button onClick={studentSignin} className="text-sm rounded shadow-md">
              学生ログイン画面へ
            </Button>
            <Button onClick={companySignin} className="text-sm rounded shadow-md">
              企業ログイン画面へ
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
