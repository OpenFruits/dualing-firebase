import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import type { VFC } from "react";
import { useContext, useEffect, useState } from "react";
import { Layout } from "src/component/shared/Layout";
import { googleFormUrl } from "src/constants/externalLink";
import { db } from "src/firebase";
import { AuthContext } from "src/firebase/Auth";

export const Booking: VFC = () => {
  const { currentUser } = useContext(AuthContext);
  const [hasSchedule, setHasSchedule] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [staff, setStaff] = useState("");

  const setScheduleTrue = async () => {
    if (currentUser) {
      const docRef = doc(db, "schedules", currentUser.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setHasSchedule(true);
        setStartTime(docSnap.data().startTime);
        setStaff(docSnap.data().staff);
      } else {
        // eslint-disable-next-line no-console
        console.log("No such document!");
      }
    }
  };

  useEffect(() => {
    setScheduleTrue();
  }, [currentUser]);

  return (
    <Layout option="p-2 bg-gray-200">
      <p>ZOOM予約日時</p>
      <p className="text-2xl font-bold">
        {hasSchedule ? `${startTime}（担当者：${staff}）` : "確定次第通知いたします"}
      </p>
      <ul className="py-2 space-y-4">
        <li>・60分程度を予定しております</li>
        <li>・開始5分前を目安に、マイページ及びご登録のメールアドレス宛にZOOMのURLをお送りいたします</li>
        <li>
          ・日程変更をご希望の場合、２日前までに
          <Link href={googleFormUrl}>
            <a>
              <span className="mx-1 border-b border-black">こちらから</span>
            </a>
          </Link>
          お問い合わせください
        </li>
      </ul>
    </Layout>
  );
};
