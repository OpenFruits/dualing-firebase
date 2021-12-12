import cc from "classcat";
import { collection, doc, getDoc, getDocs, orderBy, query, where } from "firebase/firestore";
import type { VFC } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { db } from "src/firebase";
import { FromTimeStampToDate } from "src/libs/util";

type Chat = {
  id: string;
  companyId: string;
  studentId: string;
};

type Props = {
  chat: Chat;
};

type Message = {
  role: string;
  message: string;
  timestamp: any;
};

export const Chat: VFC<Props> = (props) => {
  const [companyName, setCompanyName] = useState("");
  const [studentName, setStudentName] = useState("");
  const [relationId, setRelationId] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [latest, setLatest] = useState("");
  const [isSelected, setIsSelected] = useState(false);

  const getCompanyName = async () => {
    const ref = doc(db, "companies", props.chat.companyId);
    const snapShot = await getDoc(ref);
    snapShot.exists() && setCompanyName(snapShot.data().name);
  };

  const getStudentName = async () => {
    const ref = doc(db, "users", props.chat.studentId);
    const snapShot = await getDoc(ref);
    snapShot.exists() && setStudentName(`${snapShot.data().firstName} ${snapShot.data().lastName}`);
  };

  const getRelation = async () => {
    const ref = collection(db, "relations");
    const q = query(
      ref,
      where("studentId", "==", props.chat.studentId),
      where("companyId", "==", props.chat.companyId),
      where("condition", "==", "matching")
    );
    const snapShot = await getDocs(q);
    setRelationId(snapShot.docs[0].id);
  };

  useEffect(() => {
    getCompanyName();
    getStudentName();
    getRelation();
  }, []);

  const getChatData = async () => {
    if (relationId !== "") {
      const ref = collection(db, "relations", relationId, "messages");
      const q = query(ref, orderBy("timestamp"));
      const snapShot = await getDocs(q);
      const _messages = snapShot.docs.map((doc) => {
        return {
          role: doc.get("role"),
          message: doc.get("message"),
          timestamp: doc.get("timestamp"),
        };
      });
      setMessages(_messages);
    }
  };

  useEffect(() => {
    getChatData();
  }, [relationId]);

  useEffect(() => {
    if (messages.length > 0) {
      setLatest(FromTimeStampToDate(messages[messages.length - 1]?.timestamp));
    }
  }, [messages]);

  // 自動スクロール
  const messageEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottomOfList = useCallback(() => {
    messageEndRef?.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messageEndRef]);

  useEffect(() => {
    scrollToBottomOfList();
  }, [messages]);

  return (
    <div className="my-1 border">
      <div
        onClick={() => setIsSelected(!isSelected)}
        className={
          isSelected
            ? `flex justify-start space-x-2 h-10 items-center hover:bg-gray-200 cursor-pointer bg-gray-200`
            : `flex justify-start space-x-2 h-10 items-center hover:bg-gray-200 cursor-pointer`
        }
      >
        <p className="pl-3 w-2/5 text-sm truncate">{companyName}</p>
        <p className="pl-3 w-1/5">{studentName}</p>
        <p className="pl-3 w-2/5 text-sm">{latest}</p>
      </div>
      {isSelected && (
        <div className="overflow-y-scroll m-2 h-80 bg-gray-100 w-[calc(100%- 8px)]" id="chat">
          {messages.length === 0 && <p className="p-4 m-2 bg-white rounded">メッセージがありません</p>}
          {messages.map((item) => (
            <div
              key={item.timestamp}
              className={cc([
                {
                  ["text-left"]: item.role === "company",
                  ["text-right"]: item.role === "student",
                },
              ])}
            >
              <div className="inline-block m-2 text-left">
                <div>
                  <small className="text-gray-500">{FromTimeStampToDate(item.timestamp)}</small>
                  <p className="text-xs">{item.role === "company" ? companyName : studentName}</p>
                </div>
                <p
                  className={cc([
                    "text-sm bg-white inline-block p-2 border rounded-2xl whitespace-pre-wrap",
                    {
                      ["border-theme-dark"]: item.role === "company",
                      ["border-theme"]: item.role === "student",
                    },
                  ])}
                >
                  {item.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
      <div ref={messageEndRef} />
    </div>
  );
};
