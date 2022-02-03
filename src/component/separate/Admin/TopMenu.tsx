import { Dialog, Transition } from "@headlessui/react";
import { useRouter } from "next/router";
import type { VFC } from "react";
import { Fragment, useContext, useState } from "react";
import toast from "react-hot-toast";
import { CompanySignup } from "src/component/separate/Admin/CompanySignup";
import { Button } from "src/component/shared/Button";
import { Layout } from "src/component/shared/Layout";
import { auth } from "src/firebase";
import { AuthContext } from "src/firebase/Auth";

export const TopMenu: VFC = () => {
  const router = useRouter();
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const onOpen = () => setIsOpen(true);
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const testFunction = () => {};

  const logout = () => {
    if (confirm("ログアウトします。よろしいですか？")) {
      auth.signOut().then(() => {
        setCurrentUser(undefined);
        toast.success("ログアウトしました");
      });
    }
  };

  return (
    <Layout>
      ログイン中の管理者：{currentUser.name}
      <div className="flex my-4 space-x-3 sm:space-x-4">
        <Button variant="ghost" className="shadow-md" onClick={() => router.push("/administrator/students")}>
          学生一覧
        </Button>
        <Button variant="ghost" className="shadow-md" onClick={() => router.push("/administrator/companies")}>
          企業一覧
        </Button>
        <Button variant="ghost" className="shadow-md" onClick={() => router.push("/administrator/chatrooms")}>
          チャットルーム一覧
        </Button>
      </div>
      <div className="flex my-4 space-x-3 sm:space-x-4">
        <Button className="shadow-md" onClick={() => router.push("/administrator/newevent")}>
          イベント作成
        </Button>
        <Button className="shadow-md" onClick={onOpen}>
          企業アカウント登録
        </Button>
        <Button variant="solid-blue" className="shadow-md" isDisabled onClick={testFunction}>
          機能テスト実行
        </Button>
        <Button variant="solid-blue" className="shadow-md" onClick={logout}>
          管理者ログアウト
        </Button>
      </div>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="overflow-y-auto fixed inset-0 z-50" onClose={onClose}>
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
                  企業アカウント登録
                </Dialog.Title>
                <CompanySignup onClose={onClose} />
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </Layout>
  );
};
