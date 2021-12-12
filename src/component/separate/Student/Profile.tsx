import { Dialog, Transition } from "@headlessui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import type { VFC } from "react";
import { Fragment } from "react";
import { useContext, useState } from "react";
import { Button } from "src/component/shared/Button";
import { Layout } from "src/component/shared/Layout";
import { AuthContext } from "src/firebase/Auth";

export const Profile: VFC = () => {
  const router = useRouter();
  const { currentUser } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const onOpen = () => setIsOpen(true);

  const profileItems: { head: string; data: string }[] = [
    {
      head: "大学・学部",
      data: `${currentUser?.university} ${currentUser?.department}`,
    },
    { head: "部活", data: currentUser?.club },
    { head: "企業選びの軸", data: currentUser?.important.join(", ") },
    { head: "興味のある業界", data: currentUser?.industries.join(", ") },
    { head: "興味のある職種", data: currentUser?.occupations.join(", ") },
    { head: "希望勤務地", data: currentUser?.locations?.join(", ") },
    { head: "強み、長所", data: currentUser?.advantages.join(", ") },
    { head: "ひとことアピール", data: currentUser?.comment },
  ];

  return (
    <Layout>
      <div className="flex justify-between items-center">
        {currentUser && (
          <div>
            <p className="text-sm">{`${currentUser?.firstKana} ${currentUser?.lastKana}`}</p>
            <h2 className="pb-2 text-3xl font-bold">{`${currentUser?.firstName} ${currentUser?.lastName}`}</h2>
            <p>{`${currentUser?.university} ${currentUser?.department}`}</p>
          </div>
        )}
        <div className="m-2 space-y-2">
          <div>
            <button
              onClick={onOpen}
              className="p-2 m-auto w-40 text-base font-bold tracking-wider text-center text-white bg-blue-500 hover:bg-blue-400 rounded cursor-pointer focus:outline-none lg:mx-0"
            >
              プレビュー表示
            </button>
          </div>
          <div>
            <Link href={`/${currentUser?.uid}/edit`}>
              <a>
                <button className="p-2 m-auto w-40 text-base font-bold tracking-wider text-center text-white bg-blue-500 hover:bg-blue-400 rounded cursor-pointer focus:outline-none lg:mx-0">
                  プロフィール編集
                </button>
              </a>
            </Link>
          </div>
        </div>
      </div>
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
              <div className="inline-block overflow-hidden px-6 my-20 w-full max-w-sm text-left align-middle bg-white rounded-2xl transition-all transform shadow-xl">
                <Dialog.Title as="h3" className="py-4 text-lg font-bold leading-6 text-gray-900">
                  プロフィール
                </Dialog.Title>
                <div>
                  <div className="space-y-2 text-sm">
                    {profileItems.map((item) => (
                      <div key={item.head} className="border border-gray-300">
                        <p className="py-1 px-2 bg-gray-100">{item.head}</p>
                        <p className="py-1 px-2 whitespace-pre-wrap">{item.data}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end my-4 space-x-3 sm:space-x-4">
                    <Button
                      variant="solid-blue"
                      className="rounded-lg"
                      onClick={() => router.push(`/${currentUser?.uid}/edit`)}
                    >
                      編集する
                    </Button>
                    <Button variant="solid-gray" className="rounded-lg" onClick={onClose}>
                      閉じる
                    </Button>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </Layout>
  );
};
