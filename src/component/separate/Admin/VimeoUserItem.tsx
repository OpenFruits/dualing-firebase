/* eslint-disable @typescript-eslint/naming-convention */
import { collection, doc, getDoc, setDoc, updateDoc } from "@firebase/firestore";
import { Dialog, Transition } from "@headlessui/react";
import { FilmIcon, VideoCameraIcon } from "@heroicons/react/outline";
import Vimeo from "@u-wave/react-vimeo";
import { Timestamp } from "firebase/firestore";
import type { VFC } from "react";
import { Fragment, useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getVimeoUserList } from "src/component/separate/Admin/fetch/getVimeoUserList";
import { Button } from "src/component/shared/Button";
import type { VimeoUser } from "src/constants/types";
import { db } from "src/firebase";
import { sendMail } from "src/libs/sendMail";

type Props = {
  vimeoUser: VimeoUser;
  setVimeoUsers: React.Dispatch<React.SetStateAction<VimeoUser[]>>;
};

export const VimeoUserItem: VFC<Props> = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const onOpen = () => setIsOpen(true);
  const isShooting = props.vimeoUser.condition === "shooting"; // URL送信~ZOOM完了
  const isWaiting = props.vimeoUser.condition === "waiting"; // ZOOM完了~Vimeo登録
  const [vimeoUrl, setVimeoUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [toEmail, setToEmail] = useState("");
  const userRef = doc(db, "users", props.vimeoUser.studentId);

  const fetchVimeoUserList = async () => {
    const data = await getVimeoUserList();
    props.setVimeoUsers(data);
  };

  const setEmail = async () => {
    const docRef = doc(db, "users", props.vimeoUser.studentId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setToEmail(docSnap.data().email);
    }
  };

  useEffect(() => {
    setEmail();
  }, []);

  const noticeBody = `
    <p>動画が完成しました。ご確認ください。</p>
    <p>企業があなたの動画を閲覧可能になりました。</p>
    <p>スカウトをお待ちください。</p>  
  `;

  const templateParams = {
    to_email: toEmail,
    title: "マイページに新着メッセージが届いています",
    to_name: props.vimeoUser.studentName,
    message:
      "自己PR動画の準備が完了しました。マイページよりご確認できます。また、企業があなたの動画を閲覧可能になりました。企業からのスカウトをお待ちください。",
  };

  const inputVimeoUrl = useCallback(
    (event) => {
      setVimeoUrl(event.target.value);
    },
    [setVimeoUrl]
  );

  const inputThumbnailUrl = useCallback(
    (event) => {
      setThumbnailUrl(event.target.value);
    },
    [setThumbnailUrl]
  );

  const completed = async () => {
    if (confirm("収録完了します。よろしいですか？")) {
      await updateDoc(userRef, { condition: "waiting" }).then(() => {
        toast.success(`${props.vimeoUser.studentName}さんの収録を完了しました。`);
      });
      fetchVimeoUserList();
      onClose();
    }
  };

  const setVimeo = async () => {
    if (confirm("自己PR動画を登録します。学生に通知を送信し、企業が学生を閲覧及びスカウトできるようになります。")) {
      // 1. VIMEOデータ追加＋normalに変更: 学生マイページが通常版になる & 動画処理リストから削除
      const updateData = {
        condition: "normal",
        vimeoUrl: vimeoUrl,
        thumbnailUrl: thumbnailUrl,
      };
      await updateDoc(userRef, updateData);
      // 2. 通知+メール送信
      const newNoticeRef = collection(db, "users", props.vimeoUser.studentId, "notices");
      await setDoc(doc(newNoticeRef), {
        created_at: Timestamp.now(),
        title: "動画登録完了のお知らせ",
        body: noticeBody,
        isRead: false,
      }).then(() => {
        sendMail(templateParams);
        toast.success(`企業が${props.vimeoUser.studentName}さんを閲覧可能になりました！`);
      });
    }
    fetchVimeoUserList();
    onClose();
  };

  return (
    <div>
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
                  {`動画処理中：${props.vimeoUser.studentName}`}
                </Dialog.Title>
                <div>
                  {isShooting && (
                    <div className="my-2 space-y-2">
                      <p>問題なくZOOM面談＆収録が完了したら、</p>
                      <p>「収録完了」ボタンを押してください。</p>
                      <p>学生マイページが「動画準備中」画面に切り替わります。</p>
                    </div>
                  )}
                  {isWaiting && (
                    <div className="mx-auto w-[300px]">
                      <div>
                        <p className="p-2 text-xs font-bold bg-gray-200">VimeoURL</p>
                        <div className="bg-white border border-gray-200">
                          <div className="m-2">
                            <input
                              type="text"
                              id="vimeoId"
                              value={vimeoUrl}
                              placeholder="https://vimeo.com/"
                              className="p-1 w-full h-8 text-xs bg-white rounded border border-gray-300"
                              onChange={inputVimeoUrl}
                            />
                          </div>
                        </div>
                        {vimeoUrl.length ? (
                          <Vimeo video={vimeoUrl} responsive />
                        ) : (
                          <div className="w-full h-[169px] bg-gray-300" />
                        )}
                      </div>

                      <div>
                        <p className="p-2 mt-2 text-xs font-bold bg-gray-200">サムネイルURL</p>
                        <div className="bg-white border border-gray-200">
                          <div className="m-2">
                            <input
                              type="text"
                              id="thumbnailId"
                              value={thumbnailUrl}
                              placeholder="https://i.vimeocdn.com/video/"
                              className="p-1 w-full h-8 text-xs bg-white rounded border border-gray-300"
                              onChange={inputThumbnailUrl}
                            />
                          </div>
                        </div>
                        {thumbnailUrl.length ? (
                          <div
                            className="w-full h-[169px] bg-cover"
                            style={{ backgroundImage: `url(${thumbnailUrl})` }}
                          ></div>
                        ) : (
                          <div className="w-full h-[189px] bg-gray-300" />
                        )}
                      </div>
                    </div>
                  )}
                  <div className="flex justify-end my-3 space-x-3 sm:space-x-4">
                    {isShooting && (
                      <Button variant="solid-blue" className="rounded-lg" onClick={completed}>
                        収録完了
                      </Button>
                    )}
                    {isWaiting && (
                      <Button variant="solid-blue" className="rounded-lg" onClick={setVimeo}>
                        動画を登録
                      </Button>
                    )}
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
      <div onClick={onOpen} className="flex p-2 my-2 bg-white hover:bg-gray-100 cursor-pointer">
        {isShooting && <VideoCameraIcon className="mr-2 w-6 h-6" />}
        {isWaiting && <FilmIcon className="mr-2 w-6 h-6" />}
        <p>{props.vimeoUser.studentName}</p>
        {isShooting && <p>：ZOOM面談中</p>}
        {isWaiting && <p>：Vimeo登録待ち</p>}
      </div>
    </div>
  );
};
