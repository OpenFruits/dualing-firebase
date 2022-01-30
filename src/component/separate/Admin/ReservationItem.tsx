/* eslint-disable @typescript-eslint/naming-convention */
import { Dialog, Transition } from "@headlessui/react";
import { collection, deleteDoc, doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import type { VFC } from "react";
import { Fragment } from "react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getReservationList } from "src/component/separate/Admin/fetch/getReservationList";
import { getScheduleList } from "src/component/separate/Admin/fetch/getScheduleList";
import type { Reservations } from "src/component/separate/Student/ReservationForm";
import { Button } from "src/component/shared/Button";
import { DatePicker } from "src/component/shared/DatePicker";
import { startTimeOptions } from "src/constants/options/startTime";
import type { Reservation, Schedule } from "src/constants/types";
import { db } from "src/firebase";
import { sendMail } from "src/libs/sendMail";
import { resetDate } from "src/libs/util";

type Props = {
  reservation: Reservation;
  setReservations: React.Dispatch<React.SetStateAction<Reservation[]>>;
  setSchedules: React.Dispatch<React.SetStateAction<Schedule[]>>;
};

const strToDate = (date: string, time: string): Date => {
  const indexYaer = date.indexOf("年");
  const indexMonth = date.indexOf("月");
  const indexDay = date.indexOf("日");
  const year = date.slice(0, indexYaer);
  const month = date.slice(indexYaer + 1, indexMonth);
  const day = date.slice(indexMonth + 1, indexDay);
  const newdate = new Date(`${year}/${month}/${day} ${time}`);
  return newdate;
};

export const ReservationItem: VFC<Props> = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const onOpen = () => setIsOpen(true);
  const [reservation, setReservation] = useState<Reservations>({
    date: "",
    timeZone: "8:00",
  });
  const [staff, setStaff] = useState("川北");
  const [toEmail, setToEmail] = useState("");

  const fetchReservationList = async () => {
    const data = await getReservationList();
    props.setReservations(data);
  };

  const fetchScheduleList = async () => {
    const data = await getScheduleList();
    props.setSchedules(data);
  };

  const inputTimeZone = (event: any) => {
    setReservation({ ...reservation, timeZone: event.target.value });
  };

  const inputStaff = (event: any) => {
    setStaff(event.target.value);
  };

  const setEmail = async () => {
    const docRef = doc(db, "users", props.reservation.studentId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setToEmail(docSnap.data().email);
    }
  };

  useEffect(() => {
    setEmail();
  }, []);

  const noticeBody = `
    <h4>ZOOM面談は以下の日程で行います。</h4>
    <div class="border border-gray-400 p-2">
    日時：${reservation.date} ${reservation.timeZone}
    <br />
    担当者：${staff}
    </div>
    <p>開始5分前を目安に、マイページ及びご登録のメールアドレス宛にZOOMのURLをお送りいたします</p>
    <p>日程変更をご希望の場合、２日前までにお問い合わせください</p>
  `;

  const templateParams = {
    to_email: toEmail,
    title: "Zoom面談の日時をお知らせします",
    to_name: props.reservation.studentName,
    message: `${reservation.date} ${reservation.timeZone} に面談を行います。開始5分前を目安に運営からZoomの招待リンクをお送りいたします。`,
  };

  const confirmReservation = async () => {
    if (confirm("日程を確定し、学生に通知します。よろしいですか？")) {
      const docId = props.reservation.studentId;
      const date = strToDate(reservation.date, reservation.timeZone);
      // 1. ZOOM日程調整リストから削除
      await deleteDoc(doc(db, "reservations", docId));
      // 2. ZOOMスケジュールリストに追加
      const newScheduleRef = collection(db, "schedules");
      await setDoc(doc(newScheduleRef, docId), {
        username: props.reservation.studentName,
        date: Timestamp.fromDate(date),
        startTime: `${reservation.date} ${reservation.timeZone}~`,
        staff: staff,
      });
      // 3. 学生に通知+メール送信
      const newNoticeRef = collection(db, "users", docId, "notices");
      await setDoc(doc(newNoticeRef), {
        created_at: Timestamp.now(),
        title: "ZOOM面談の日程をお送りします",
        body: noticeBody,
        isRead: false,
      }).then(() => {
        sendMail(templateParams);
        toast.success(`${props.reservation.studentName}さんにZOOM日程を送信しました。`);
      });
      fetchReservationList();
      fetchScheduleList();
      onClose();
    }
  };

  const today = new Date(); // 本日の日付
  const created_at: Date = props.reservation.created_at.toDate(); // 予約送信日をDateに変換
  const deadline = 1; // 予約送信から予約確定までに要する日数
  const daysLeft = deadline + (resetDate(created_at).getTime() - resetDate(today).getTime()) / 86400000; // 残日数

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
              <div className="inline-block overflow-hidden px-6 my-20 w-full max-w-sm text-left align-middle bg-white rounded-2xl shadow-xl transition-all transform">
                <Dialog.Title as="h3" className="py-4 text-lg font-bold leading-6 text-gray-900">
                  {`ZOOM日程確定：${props.reservation.studentName}`}
                </Dialog.Title>
                <div>
                  <div className="space-y-3">
                    <div>
                      <p className="pb-1">＜ 日程・担当者を選択 ＞</p>
                      <DatePicker reservations={reservation} setReservations={setReservation} isAdmin />
                      <select
                        value={reservation.timeZone}
                        onChange={inputTimeZone}
                        className="py-2 px-4 mr-2 rounded-md border border-gray-700"
                      >
                        {startTimeOptions.map((item) => (
                          <option key={item.value} value={item.value}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                      <select
                        value={staff}
                        onChange={inputStaff}
                        className="py-2 px-4 rounded-md border border-gray-700"
                      >
                        {["川北", "溝口"].map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                      <p className="pt-2">{`→ 開始時間：${reservation?.date} ${reservation?.timeZone}`}</p>
                      <p className="pt-1">{`→ 担当者：${staff}`}</p>
                    </div>
                  </div>
                  <div className="my-2 border-b border-gray-400" />
                  <div>
                    <p className="pb-1">＜ 本人希望 ＞</p>
                    <table>
                      <tbody>
                        <tr>
                          <th className="p-3 border border-gray-300">第１希望</th>
                          <td className="p-3 bg-gray-50 border">{props.reservation.firstChoice}</td>
                        </tr>
                        <tr>
                          <th className="p-3 border border-gray-300">第２希望</th>
                          <td className="p-3 bg-gray-50 border">{props.reservation.secondChoice}</td>
                        </tr>
                        <tr>
                          <th className="p-3 border border-gray-300">第３希望</th>
                          <td className="p-3 bg-gray-50 border">{props.reservation.thirdChoice}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="flex justify-end my-4 space-x-3 sm:space-x-4">
                    <Button variant="solid-blue" className="rounded-lg" onClick={confirmReservation}>
                      予約確定・通知
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
      <div onClick={onOpen} className="flex justify-between p-2 my-2 bg-white hover:bg-gray-100 cursor-pointer">
        <p>{props.reservation.studentName}</p>
        {daysLeft === 0 ? (
          <p className="py-1 px-2 text-xs font-bold text-white bg-red-700 rounded-full">本日中！</p>
        ) : (
          <p className="py-1 px-2 text-xs font-bold text-white bg-yellow-500 rounded-full">{`あと ${daysLeft} 日`}</p>
        )}
      </div>
    </div>
  );
};
