import { Dialog, Transition } from "@headlessui/react";
import { BookmarkIcon } from "@heroicons/react/solid";
import Vimeo from "@u-wave/react-vimeo";
import { onAuthStateChanged } from "firebase/auth";
import { collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, Timestamp, where } from "firebase/firestore";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Chat } from "src/component/separate/Company/Chat";
import { Button } from "src/component/shared/Button";
import { Header } from "src/component/shared/Header";
import { Loading } from "src/component/shared/Loading";
import { NotFound } from "src/component/shared/NotFound";
import type { Student } from "src/constants/types";
import { auth, db } from "src/firebase";
import { AuthContext } from "src/firebase/Auth";
import { sendMail } from "src/libs/sendMail";

const StudentId: NextPage = () => {
  const router = useRouter();
  const studentId = router.query.studentId;
  const { currentUser } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const onOpen = () => setIsOpen(true);

  const [student, setStudent] = useState<Student>();
  const [relation, setRelation] = useState<string | undefined>(undefined);
  const [relationId, setRelationId] = useState<string | undefined>(undefined);
  const [isBookmark, setIsBookmark] = useState(false);
  const [toEmail, setToEmail] = useState("");
  const [isNotFound, setIsNotFound] = useState(false);

  const getUserData = async () => {
    if (typeof studentId === "string") {
      const snapShot = await getDoc(doc(db, "users", studentId));
      if (!snapShot.exists()) return setIsNotFound(true);
      setStudent({
        uid: studentId,
        firstName: snapShot.data().firstName,
        lastName: snapShot.data().lastName,
        firstKana: snapShot.data().firstKana,
        lastKana: snapShot.data().lastKana,
        university: snapShot.data().university,
        department: snapShot.data().department,
        club: snapShot.data().club,
        important: snapShot.data().important,
        industries: snapShot.data().industries,
        occupations: snapShot.data().occupations,
        locations: snapShot.data().locations,
        advantages: snapShot.data().advantages,
        comment: snapShot.data().comment,
        vimeoUrl: snapShot.data().vimeoUrl,
        thumbnailUrl: snapShot.data().thumbnailUrl,
      });
      setToEmail(snapShot.data().email);
    }
  };

  useEffect(() => {
    getUserData();
  }, [studentId]);

  const getRelationData = async () => {
    if (currentUser && student) {
      const ref = collection(db, "relations");
      const q = query(ref, where("companyId", "==", currentUser.companyId), where("studentId", "==", student.uid));
      const snapShot = await getDocs(q);
      if (snapShot.docs.length === 1) {
        setRelation(snapShot.docs[0].data().condition);
        setRelationId(snapShot.docs[0].id);
      } else {
        setRelation("no");
      }
    }
  };

  const checkBookmark = async () => {
    if (currentUser) {
      const ref = doc(db, "companies", currentUser?.companyId, "bookmarks", studentId as string);
      const bookmarkSnap = await getDoc(ref);
      if (bookmarkSnap.exists()) {
        setIsBookmark(true);
      }
    }
  };

  useEffect(() => {
    getRelationData();
    checkBookmark();
  }, [currentUser, student]);

  const noticeBody = `
    <p>${currentUser?.name}からスカウトが届いています。</p>
    <p>スカウト一覧から詳細を確認し、</p>
    <p>「マッチング」または「見送る」を選択してください。</p>
  `;

  const templateParams = {
    to_email: toEmail,
    title: "マイページに新着メッセージが届いています",
    to_name: `${student?.firstName} ${student?.lastName}`,
    message: "企業からスカウトされました。マイページより詳細をご確認ください。",
  };

  const scout = async () => {
    onClose();
    if (currentUser && student) {
      const relaitonsRef = collection(db, "relations");
      const noticesRef = collection(db, "users", student.uid, "notices");
      await setDoc(doc(relaitonsRef), {
        studentId: student.uid,
        companyId: currentUser.companyId,
        condition: "scout",
      });
      await setDoc(doc(noticesRef), {
        created_at: Timestamp.now(),
        title: "企業からスカウトされました",
        body: noticeBody,
        isRead: false,
      }).then(() => {
        toast.success("スカウトを送信しました");
        sendMail(templateParams);
      });
    }
  };

  const deleteScout = async () => {
    onClose();
    setRelation("no");
    const ref = doc(db, "relations", relationId as string);
    await deleteDoc(ref).then(() => {
      toast.success("スカウトを取り消しました");
      setRelationId(undefined);
    });
  };

  const bookmark = async () => {
    if (currentUser && student) {
      const ref = doc(db, "companies", currentUser?.companyId, "bookmarks", studentId as string);
      isBookmark
        ? deleteDoc(ref)
        : setDoc(ref, {
            studentId: student.uid,
            created_at: Timestamp.now(),
          });
    }
    setIsBookmark(!isBookmark);
    if (!isBookmark) toast.success("保存しました");
    if (isBookmark) toast.success("保存済みから削除しました");
  };

  useEffect(() => {
    relation === "block" && setIsNotFound(true);
  }, [relation]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) router.push("/company/signin");
    });
  }, []);

  if (!currentUser || !relation) return <Loading />;

  if (currentUser?.companyId !== router.query.companyId || isNotFound) {
    return <NotFound />;
  }

  return (
    <>
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
                  {relation === "scout"
                    ? `${student?.firstName}${student?.lastName}さんへのスカウトは送信済みです。`
                    : `${student?.firstName}${student?.lastName}さんにスカウトを送信します。`}
                </Dialog.Title>
                {relation === "scout" ? (
                  <div>
                    学生がスカウトを「承認」した場合、チャットが可能となり、
                    「見送り」した場合その学生が一覧に表示されなくなります。
                    <div className="py-2" />
                    スカウトを取り消したい場合は、以下のボタンで取消を行います。
                    <div className="flex justify-end my-4 space-x-3 sm:space-x-4">
                      <Button variant="solid-blue" className="rounded-lg" onClick={deleteScout}>
                        スカウト取消
                      </Button>
                      <Button variant="solid-gray" className="rounded-lg" onClick={onClose}>
                        閉じる
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    学生がスカウトを「承認」した場合、チャットが可能となり、
                    「見送り」した場合その学生が一覧に表示されなくなります。
                    <div className="py-2" />
                    以下のボタンからスカウトを送信してください。
                    <div className="flex justify-end my-4 space-x-3 sm:space-x-4">
                      <Button variant="solid-blue" className="rounded-lg" onClick={scout}>
                        スカウト送信
                      </Button>
                      <Button variant="solid-gray" className="rounded-lg" onClick={onClose}>
                        キャンセル
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
      <Header href={`/company/${currentUser?.companyId}`} pageTitle="学生詳細ページ" />
      <div className="flex">
        <aside className="fixed top-14 left-0 p-4 w-72 h-screen border-r">
          {currentUser ? (
            <h2 className="pb-2 mb-4 text-2xl border-b">{`${currentUser?.name} 様`}</h2>
          ) : (
            <h2 className="pb-2 mb-4 text-2xl text-white border-b">{` - `}</h2>
          )}
          <Link href={`/company/${currentUser?.companyId}`}>
            <a>
              <button className="p-2 m-auto text-sm font-bold tracking-wider text-center text-white bg-blue-500 hover:bg-blue-400 rounded cursor-pointer focus:outline-none lg:mx-0 lg:text-md">
                一覧に戻る
              </button>
            </a>
          </Link>
        </aside>
        <main className="ml-72 w-screen bg-theme-light">
          <div className="py-10 px-14 divide-y divide-gray-500">
            <h1 className="mb-4 text-3xl font-bold">学生詳細</h1>
            <div className="py-10 w-[600px] xl:w-[800px]">
              <div className="flex justify-between items-center">
                <div>
                  {student ? (
                    <div>
                      <p className="text-sm">{`${student.firstKana} ${student.lastKana}`}</p>
                      <h2 className="mb-2 text-2xl font-bold">{`${student.firstName} ${student.lastName}`}</h2>
                      <h2 className="mb-4 text-2xl font-bold">{`(${student.university} ${student.department})`}</h2>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm text-theme-light">{` - `}</p>
                      <h2 className="mb-4 text-2xl font-bold text-theme-light">{` - `}</h2>
                    </div>
                  )}
                </div>
                <div className="flex flex-col">
                  {relation === "scout" && (
                    <button
                      onClick={onOpen}
                      className="p-2 my-1 ml-2 w-44 h-10 text-sm font-bold tracking-wider text-center text-white bg-gray-500 hover:bg-gray-300 rounded cursor-pointer focus:outline-none lg:text-md"
                    >
                      スカウト済み
                    </button>
                  )}
                  {relation === "no" && (
                    <button
                      onClick={onOpen}
                      className="p-2 my-1 ml-2 w-44 h-10 text-sm font-bold tracking-wider text-center text-white bg-blue-500 hover:bg-blue-400 rounded cursor-pointer focus:outline-none lg:text-md"
                    >
                      スカウトを送る
                    </button>
                  )}
                  <button
                    onClick={bookmark}
                    className="flex justify-center items-center p-2 my-1 ml-2 w-44 h-10 text-sm font-bold tracking-wider text-white bg-blue-500 hover:bg-blue-400 rounded cursor-pointer focus:outline-none lg:text-md"
                  >
                    <BookmarkIcon className="m-1 w-6 h-6" />
                    {isBookmark ? <p className="py-2 mr-4">保存済み</p> : <p className="py-2 mr-2">保存して後で見る</p>}
                  </button>
                </div>
              </div>
              {relation === "matching" && (
                <Chat studentId={studentId as string} studentName={`${student?.firstName} ${student?.lastName}`} />
              )}
              {student && <Vimeo video={student.vimeoUrl} responsive className="my-4" />}
              <table className="my-4 w-[600px] text-sm bg-white border border-gray-300 xl:w-[800px] xl:text-lg">
                <tbody>
                  <tr className="border border-gray-300">
                    <td className="p-3 w-1/4 bg-gray-100">強み、長所</td>
                    <td className="p-3">{student?.advantages.join(", ")}</td>
                  </tr>
                  <tr className="border border-gray-300">
                    <td className="p-3 bg-gray-100">企業選びの軸</td>
                    <td className="p-3">{student?.important.join(", ")}</td>
                  </tr>
                  <tr className="border border-gray-300">
                    <td className="p-3 bg-gray-100">部活、サークル</td>
                    <td className="p-3">{student?.club}</td>
                  </tr>
                  <tr className="border border-gray-300">
                    <td className="p-3 bg-gray-100">興味のある業界</td>
                    <td className="p-3">{student?.industries.join(", ")}</td>
                  </tr>
                  <tr className="border border-gray-300">
                    <td className="p-3 bg-gray-100">興味のある職種</td>
                    <td className="p-3">{student?.occupations.join(", ")}</td>
                  </tr>
                  <tr className="border border-gray-300">
                    <td className="p-3 bg-gray-100">希望勤務地</td>
                    <td className="p-3">{student?.locations?.join(", ")}</td>
                  </tr>
                  <tr className="border border-gray-300">
                    <td className="p-3 bg-gray-100">ひとことPR</td>
                    <td className="p-3 whitespace-pre-wrap">{student?.comment}</td>
                  </tr>
                </tbody>
              </table>
              <Link href={`/company/${currentUser?.companyId}`}>
                <a>
                  <button className="p-2 m-auto text-sm font-bold tracking-wider text-center text-white bg-blue-500 hover:bg-blue-400 rounded cursor-pointer focus:outline-none lg:mx-0 lg:text-md">
                    一覧に戻る
                  </button>
                </a>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default StudentId;
