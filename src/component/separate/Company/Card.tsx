import { BookmarkIcon } from "@heroicons/react/outline";
import { collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, Timestamp, where } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/router";
import type { VFC } from "react";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import type { Student } from "src/constants/types";
import { db } from "src/firebase";
import { AuthContext } from "src/firebase/Auth";

type Props = {
  student: Student;
};

export const Card: VFC<Props> = (props) => {
  const { currentUser } = useContext(AuthContext);
  const router = useRouter();
  const [relation, setRelation] = useState("no");
  const [isBookmark, setIsBookmark] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState("");

  // 学生と企業の関係性を判定する関数
  const checkRelation = async (condition: string) => {
    if (currentUser) {
      const ref = collection(db, "relations");
      const q = query(
        ref,
        where("companyId", "==", currentUser.companyId),
        where("studentId", "==", props.student.uid),
        where("condition", "==", condition)
      );
      const snapShot = await getDocs(q);
      snapShot.docs.length === 1 && setRelation(condition);
    }
  };

  const bookmarkRef = doc(db, "companies", currentUser?.companyId, "bookmarks", props.student.uid);

  // 保存されているかどうかチェック
  const checkBookmark = async () => {
    const docSnap = await getDoc(bookmarkRef);
    docSnap.data()?.studentId && setIsBookmark(true);
  };

  // サムネイルをセット
  const getThumbnail = async () => {
    const ref = doc(db, "users", props.student.uid);
    const docSnap = await getDoc(ref);
    setThumbnailUrl(docSnap.data()?.thumbnailUrl);
  };

  useEffect(() => {
    checkRelation("scout");
    checkRelation("matching");
    checkRelation("block");
    checkBookmark();
    getThumbnail();
  }, [currentUser]);

  // 保存or保存の削除
  const bookmark = async () => {
    if (currentUser) {
      isBookmark
        ? await deleteDoc(bookmarkRef)
        : await setDoc(bookmarkRef, {
            studentId: props.student.uid,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            created_at: Timestamp.now(),
          });
    }
    setIsBookmark(!isBookmark);
    if (!isBookmark) toast.success("保存しました");
    if (isBookmark) toast.success("保存済みから削除しました");
  };

  return relation === "block" ? null : ( // block関係にある学生は非表示
    <div className="overflow-hidden bg-white rounded border shadow-lg">
      <div
        className="relative w-full h-52 bg-cover cursor-pointer"
        style={{ backgroundImage: `url(${thumbnailUrl})` }}
        onClick={() => router.push(`/company/${currentUser?.companyId}/${props.student.uid}`)}
      >
        {relation === "scout" && (
          <div className="absolute top-0 right-0 p-2 m-2 text-sm font-bold text-white bg-green-500 rounded-full">
            スカウト中
          </div>
        )}
        {relation === "matching" && (
          <div className="absolute top-0 right-0 p-2 m-2 text-sm font-bold bg-yellow-300 rounded-full">マッチング</div>
        )}
        {relation === "matching" && (
          <div className="absolute top-0 left-0 p-2 m-2 text-sm font-bold bg-gray-200 rounded">
            {`${props.student.firstName} ${props.student.lastName}`}
          </div>
        )}
        <div className="absolute right-0 bottom-0 p-2 text-xl font-bold bg-white border-b">
          {`${props.student.university} ${props.student.department}`}
        </div>
      </div>
      <div className="py-1 px-2 border-b">
        <span className="text-xs font-bold">会社選びの軸：</span>
        {props.student.important.map((item: string, index: number) => (
          <span
            key={`important_${index}`}
            className="inline-block py-1 px-2 mr-2 text-xs font-semibold text-gray-700 bg-gray-200 rounded-full"
          >
            {`${item}`}
          </span>
        ))}
      </div>
      <div className="py-1 px-2 border-b">
        <span className="text-xs font-bold">業界：</span>
        {props.student.industries.map((item: string, index: number) => (
          <span
            key={`industry_${index}`}
            className="inline-block py-1 px-2 mr-2 text-xs font-semibold text-gray-700 bg-gray-200 rounded-full"
          >
            {`${item}`}
          </span>
        ))}
      </div>
      <div className="py-1 px-2 border-b">
        <span className="text-xs font-bold">職種：</span>
        {props.student.occupations.map((item: string, index: number) => (
          <span
            key={`occupation_${index}`}
            className="inline-block py-1 px-2 mr-2 text-xs font-semibold text-gray-700 bg-gray-200 rounded-full"
          >
            {`${item}`}
          </span>
        ))}
      </div>
      <div className="py-1 px-2 border-b">
        <span className="text-xs font-bold">希望勤務地：</span>
        {props.student.locations?.map((item: string, index: number) => (
          <span
            key={`occupation_${index}`}
            className="inline-block py-1 px-2 mr-2 text-xs font-semibold text-gray-700 bg-gray-200 rounded-full"
          >
            {`${item}`}
          </span>
        ))}
      </div>
      <div className="py-1 px-2 border-b">
        <span className="text-xs font-bold">強み：</span>
        {props.student.advantages.map((item: string, index: number) => (
          <span
            key={`advantage_${index}`}
            className="inline-block py-1 px-2 mr-2 text-xs font-semibold text-gray-700 bg-gray-200 rounded-full"
          >
            {`${item}`}
          </span>
        ))}
      </div>
      <div className="flex justify-start p-2">
        <Link href={`/company/${currentUser?.companyId}/${props.student.uid}`}>
          <a className="mr-2">
            {relation === "no" && (
              <button className="p-2 m-auto text-xs font-bold tracking-wider text-center text-white bg-blue-500 hover:bg-blue-400 rounded cursor-pointer focus:outline-none lg:mx-0 lg:text-md">
                詳細・スカウト画面へ
              </button>
            )}
            {relation === "scout" && (
              <button className="p-2 m-auto text-xs font-bold tracking-wider text-center text-white bg-blue-500 hover:bg-blue-400 rounded cursor-pointer focus:outline-none lg:mx-0 lg:text-md">
                詳細画面へ
              </button>
            )}
            {relation === "matching" && (
              <button className="p-2 m-auto text-xs font-bold tracking-wider text-center text-white bg-blue-500 hover:bg-blue-400 rounded cursor-pointer focus:outline-none lg:mx-0 lg:text-md">
                詳細・チャット画面へ
              </button>
            )}
          </a>
        </Link>
        <button
          onClick={bookmark}
          className="flex pr-2 m-auto text-xs font-bold tracking-wider text-center text-white bg-blue-500 hover:bg-blue-400 rounded cursor-pointer focus:outline-none lg:mx-0 lg:text-md"
        >
          <BookmarkIcon className="m-1 w-6 h-6" />
          {isBookmark ? <p className="py-2">保存済み</p> : <p className="py-2">保存して後で見る</p>}
        </button>
      </div>
    </div>
  );
};
