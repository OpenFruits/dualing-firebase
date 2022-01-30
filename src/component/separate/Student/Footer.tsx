/* eslint-disable @typescript-eslint/naming-convention */
import { Dialog, Transition } from "@headlessui/react";
import { deleteUser } from "firebase/auth";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import Link from "next/link";
import router from "next/router";
import type { VFC } from "react";
import { Fragment } from "react";
import { useCallback, useContext, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "src/component/shared/Button";
import { corporateURL, googleFormUrl } from "src/constants/externalLink";
import { auth, db } from "src/firebase";
import { AuthContext } from "src/firebase/Auth";
import { sendMail } from "src/libs/sendMail";

export const Footer: VFC = () => {
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);
  const logout = () => {
    if (confirm("ログアウトします。よろしいですか？")) {
      auth.signOut().then(() => {
        setCurrentUser(undefined);
        router.push("/signin");
        toast.success("ログアウトしました");
      });
    }
  };

  const deleteAccount = () => {
    if (confirm("退会し会員情報を削除します。よろしいですか？")) {
      // auth情報の削除
      auth.currentUser &&
        deleteUser(auth.currentUser)
          .then(async () => {
            const ref = doc(db, "users", currentUser.uid);
            await updateDoc(ref, { condition: "unsubscribed" });
            // 紐づいている予約情報の削除
            await deleteDoc(doc(db, "reservations", currentUser.uid));
            await deleteDoc(doc(db, "schedules", currentUser.uid));
            router.push("/thanks");
            sendMail({
              to_email: process.env.NEXT_PUBLIC_DEVELOPER_EMAIL || "",
              title: "ユーザーが退会しました",
              to_name: "ーー",
              message: `退会ユーザーID：${currentUser.uid}`,
            });
          })
          .catch((error) => {
            if (error.code === "auth/requires-recent-login") {
              alert("もう一度ログインする必要があります。ログアウトして再度ログインしてからお試しください。");
            } else {
              alert("退会処理に失敗しました。お問い合わせください。");
            }
          });
    }
  };

  const ConfirmModalBody: VFC = () => {
    const [email, setEmail] = useState("");

    const inputEmail = useCallback(
      (event) => {
        setEmail(event.target.value);
      },
      [setEmail]
    );

    return (
      <div className="pb-2">
        <p className="font-bold">⚠️ 以下の処理を行います</p>
        <ul>
          <li>・アカウントの削除</li>
          <li>・ログイン機能の停止</li>
        </ul>
        <p className="py-1">再入会を希望の際は再度新規登録を行う必要があります</p>
        <div className="my-2 border border-gray-300">
          <p className="px-2 pt-2 text-xs">ご登録のメールアドレスを入力し、退会処理を続行してください。</p>
          <div className="m-2">
            <input
              type="text"
              id="email"
              value={email}
              className="p-1 w-full h-8 text-xs bg-white rounded border border-gray-300"
              onChange={inputEmail}
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            variant="solid-red"
            className="mt-2 text-sm rounded"
            isDisabled={email !== currentUser.email}
            onClick={deleteAccount}
          >
            退会処理を続行
          </Button>
        </div>
      </div>
    );
  };

  return (
    <footer className="flex absolute bottom-0 justify-around py-3 w-full font-bold text-white bg-theme-dark sm:justify-end">
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="overflow-y-auto fixed inset-0 z-10" onClose={onClose}>
          <div className="px-4 min-h-screen text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
            </Transition.Child>

            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block overflow-hidden px-6 my-20 w-full max-w-sm text-left align-middle bg-white rounded-2xl shadow-xl transition-all transform">
                <Dialog.Title as="h3" className="py-4 text-lg font-bold leading-6 text-gray-900">
                  退会処理
                </Dialog.Title>
                {<ConfirmModalBody />}
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
      <ul className="text-sm">
        <li className="mb-1 sm:mx-3">
          <Link href={googleFormUrl}>
            <a>お問い合わせ</a>
          </Link>
        </li>
        <li className="mb-1 cursor-pointer sm:mx-3" onClick={logout}>
          ログアウト
        </li>
        <li className="mb-1 cursor-pointer sm:mx-3" onClick={onOpen}>
          退会
        </li>
      </ul>
      <ul className="text-sm">
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
      </ul>
    </footer>
  );
};
