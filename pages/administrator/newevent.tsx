import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import { useRouter } from "next/router";
import type { VFC } from "react";
import { useCallback, useContext, useState } from "react";
import { toast } from "react-hot-toast";
import { Button } from "src/component/shared/Button";
import { InputSection } from "src/component/shared/InputSection";
import { Layout } from "src/component/shared/Layout";
import { TextInput } from "src/component/shared/TextInput";
import { auth, db, FirebaseTimestamp } from "src/firebase";
import { AuthContext } from "src/firebase/Auth";
import { Header } from "src/layout/application/Header";
import { Loading } from "src/layout/application/Loading";
import { NotFound } from "src/layout/application/NotFound";
import { sendMail } from "src/libs/sendMail";

const NewEvent: VFC = () => {
  const router = useRouter();
  const { currentUser } = useContext(AuthContext);
  const [title, setTitle] = useState("【運営】就活イベント開催のお知らせ");
  const [body, setBody] = useState("");

  const inputTitle = useCallback(
    (event) => {
      setTitle(event.target.value);
    },
    [setTitle]
  );

  const inputBody = useCallback(
    (event) => {
      setBody(event.target.value);
    },
    [setBody]
  );

  const AddElementButton: VFC<{ tag: string }> = (props) => {
    const addElement = (tag: string) => {
      setBody(`${body}<${tag}></${tag}>`);
    };

    return (
      <button onClick={() => addElement(props.tag)} className="px-1 m-1 bg-gray-200 hover:bg-gray-300 rounded">
        {`<${props.tag}>`}
      </button>
    );
  };

  const submitEvent = async () => {
    if (confirm("全学生に通知を送信します。")) {
      const ref = collection(db, "users");
      const q = query(ref, where("condition", "!=", "deleted"));
      const snapShot = await getDocs(q);
      snapShot.docs.map(async (s) => {
        const newNoticeRef = collection(db, "users", s.id, "Notice");
        await setDoc(doc(newNoticeRef), {
          created_at: FirebaseTimestamp,
          title: title,
          body: body,
          isRead: false,
        });
        const templateParams = {
          to_email: s.data().email,
          title: "マイページに新着メッセージが届いています",
          to_name: `${s.data().firstName} ${s.data().lastName}`,
          message: "運営から新着のメッセージが届いています。マイページより通知をご確認ください。",
        };
        sendMail(templateParams);
      });
      setTitle("【運営】就活イベント開催のお知らせ");
      setBody("");
      toast.success("学生全員に通知を送信しました");
    }
  };

  if (!currentUser?.administratorId) return <NotFound />;

  if (auth.currentUser && !currentUser) return <Loading />;

  return (
    <>
      <Header pageTitle="管理者用ページ" href="/administrator" />
      <Layout>
        <Button className="shadow-md" onClick={() => router.push("/administrator")}>
          管理者ページTOPに戻る
        </Button>
        <p className="pt-4 text-2xl font-bold">新規イベント作成</p>
        <div className="flex">
          <div className="p-4 w-1/2 max-w-[400px]">
            <h2 className="mb-2 text-lg font-bold">＜ エディタ ＞</h2>
            <InputSection title="タイトル">
              <TextInput type="text" value={title} inputValue={inputTitle} />
            </InputSection>
            <InputSection title="内容：HTML形式">
              {["h1", "h2", "h3", "h4", "ul", "ol", "li", "p"].map((tag, index) => (
                <span key={tag}>
                  {index === 4 && <br />}
                  <AddElementButton tag={tag} />
                </span>
              ))}
              <div className="py-1" />
              <textarea
                id="body"
                value={body}
                placeholder=""
                rows={20}
                className="p-1 w-full bg-white rounded border border-gray-300 resize-none"
                onChange={inputBody}
              />
            </InputSection>
          </div>
          <div className="p-4 w-1/2 max-w-[400px]">
            <h2 className="mb-2 text-lg font-bold">＜ プレビュー ＞</h2>
            <p className="text-xl">{title}</p>
            <article
              className="p-4 prose lg:prose-xl"
              dangerouslySetInnerHTML={{
                __html: `${body}`,
              }}
            />
            <Button className="my-4 shadow-md" onClick={submitEvent}>
              内容を確定して送信
            </Button>
          </div>
        </div>
      </Layout>
    </>
  );
};
export default NewEvent;
