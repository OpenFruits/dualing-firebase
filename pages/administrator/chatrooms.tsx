import { collection, getDocs, query, where } from "firebase/firestore";
import { useRouter } from "next/router";
import type { VFC } from "react";
import { useContext, useEffect, useState } from "react";
import { Chat } from "src/component/separate/Admin/Chat";
import { Button } from "src/component/shared/Button";
import { Header } from "src/component/shared/Header";
import { Layout } from "src/component/shared/Layout";
import { Loading } from "src/component/shared/Loading";
import { NotFound } from "src/component/shared/NotFound";
import { auth, db } from "src/firebase";
import { AuthContext } from "src/firebase/Auth";

type Chat = {
  id: string;
  companyId: string;
  studentId: string;
};

const Chatrooms: VFC = () => {
  const router = useRouter();
  const { currentUser } = useContext(AuthContext);
  const [chatrooms, setChatrooms] = useState<Chat[]>([]);

  const getChatList = async () => {
    const ref = collection(db, "relations");
    const q = query(ref, where("condition", "==", "matching"));
    const snapShot = await getDocs(q);
    const chatrooms = snapShot.docs.map((doc) => {
      const companyId = doc.get("companyId");
      const studentId = doc.get("studentId");
      return {
        id: doc.id,
        companyId: companyId,
        studentId: studentId,
      };
    });
    setChatrooms(chatrooms);
  };

  useEffect(() => {
    getChatList();
  }, []);

  if (!currentUser?.administratorId) return <NotFound />;

  if (chatrooms.length === 0) return <Loading />;

  if (auth.currentUser && !currentUser) return <Loading />;

  return (
    <>
      <Header pageTitle="管理者用ページ" href="/administrator" />
      <div className="m-auto sm:w-2/3">
        <Layout>
          <Button className="shadow-md" onClick={() => router.push("/administrator")}>
            管理者ページTOPに戻る
          </Button>
          <div className="py-4">
            <p className="py-2 text-xl font-bold">チャットルーム一覧</p>
            <div className="flex py-2 space-x-2 w-full bg-gray-100">
              <p className="pl-3 w-2/5">企業</p>
              <p className="pl-3 w-1/5">学生</p>
              <p className="pl-3 w-2/5">最新メッセージ</p>
            </div>
            {chatrooms.map((chat) => (
              <div key={chat.id}>
                <Chat chat={chat} />
              </div>
            ))}
          </div>
        </Layout>
      </div>
    </>
  );
};
export default Chatrooms;
