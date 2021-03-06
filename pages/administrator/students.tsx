import { getDocs } from "@firebase/firestore";
import Vimeo from "@u-wave/react-vimeo";
import { collection, orderBy, query } from "firebase/firestore";
import { useRouter } from "next/router";
import type { VFC } from "react";
import { useContext, useEffect, useState } from "react";
import { Button } from "src/component/shared/Button";
import { Header } from "src/component/shared/Header";
import { Layout } from "src/component/shared/Layout";
import { Loading } from "src/component/shared/Loading";
import { NotFound } from "src/component/shared/NotFound";
import type { AdminStudent } from "src/constants/types";
import { auth, db } from "src/firebase";
import { AuthContext } from "src/firebase/Auth";
import { FromTimeStampToDate } from "src/libs/util";

const Students: VFC = () => {
  const router = useRouter();
  const { currentUser } = useContext(AuthContext);
  const [students, setStudents] = useState<AdminStudent[]>([]);
  const [showID, setShowID] = useState("");

  const getStudentList = async () => {
    const ref = collection(db, "users");
    const q = query(ref, orderBy("created_at", "desc"));
    const snapShot = await getDocs(q);
    const students = snapShot.docs.map((doc) => {
      return {
        uid: doc.id,
        firstName: doc.get("firstName"),
        firstKana: doc.get("firstKana"),
        lastName: doc.get("lastName"),
        lastKana: doc.get("lastKana"),
        email: doc.get("email"),
        phoneNumber: doc.get("phoneNumber"),
        university: doc.get("university"),
        department: doc.get("department"),
        club: doc.get("club"),
        important: doc.get("important"),
        industries: doc.get("industries"),
        occupations: doc.get("occupations"),
        locations: doc.get("locations"),
        advantages: doc.get("advantages"),
        comment: doc.get("comment"),
        condition: doc.get("condition"),
        vimeoUrl: doc.get("vimeoUrl"),
        thumbnailUrl: doc.get("thumbnailUrl"),
        created_at: doc.get("created_at"),
      };
    });
    setStudents(students);
  };

  useEffect(() => {
    getStudentList();
  }, []);

  const conditionToStatus = (condition: string): string => {
    if (condition === "init") return "????????????";
    if (condition === "reserved") return "ZOOM??????";
    if (condition === "waiting") return "??????????????????";
    if (condition === "normal") return "??????";
    if (condition === "unsubscribed") return "????????????";
    return "";
  };

  if (students.length === 0 || (auth.currentUser && !currentUser)) return <Loading />;

  if (!currentUser?.administratorId) return <NotFound />;

  return (
    <>
      <Header pageTitle="?????????????????????" href="/administrator" />
      <div className="m-auto sm:w-2/3">
        <Layout>
          <Button className="shadow-md" onClick={() => router.push("/administrator")}>
            ??????????????????TOP?????????
          </Button>
          <div className="py-4">
            <p className="py-2 text-xl font-bold">????????????</p>
            <div className="flex py-2 space-x-2 w-full bg-gray-100">
              <p className="w-1/4">ID</p>
              <p className="pl-3 w-1/4">??????</p>
              <p className="w-1/4">???????????????</p>
              <p className="w-1/4">????????????</p>
            </div>
            {students?.map((student) => (
              <div key={student.uid}>
                <div
                  onClick={() => setShowID(showID === student.uid ? "" : student.uid)}
                  className={
                    showID === student.uid
                      ? `flex justify-start space-x-2 h-10 items-center hover:bg-gray-200 cursor-pointer bg-gray-200`
                      : `flex justify-start space-x-2 h-10 items-center hover:bg-gray-200 cursor-pointer`
                  }
                >
                  <p className="w-1/4 text-xs truncate">{student.uid}</p>
                  <p
                    className={showID === student.uid ? `w-1/4 pl-3 bg-gray-200` : `w-1/4 pl-3`}
                  >{`${student.firstName} ${student.lastName}`}</p>
                  <p className="w-1/4">{conditionToStatus(student.condition)}</p>
                  <p className="text-sm">{FromTimeStampToDate(student.created_at)}</p>
                </div>
                {showID === student.uid && (
                  <div className="p-2 space-y-2 border">
                    {[
                      { label: "?????????????????????", text: `${student.email}` },
                      { label: "????????????", text: `${student.phoneNumber}` },
                      { label: "???????????????", text: `${`${student.university} ${student.department}`}` },
                      { label: "??????", text: `${student.club}` },
                      { label: "??????????????????", text: `${student.important.join(", ")}` },
                      { label: "?????????????????????", text: `${student.industries.join(", ")}` },
                      { label: "?????????????????????", text: `${student.occupations.join(", ")}` },
                      { label: "???????????????", text: `${student.locations.join(", ")}` },
                      { label: "???????????????", text: `${student.advantages.join(", ")}` },
                    ].map((item) => (
                      <div key={item.label} className="flex text-xs border border-gray-300">
                        <p className="py-1 px-2 w-1/4 bg-gray-100">{item.label}</p>
                        <p className="py-1 px-2 whitespace-pre-wrap">{item.text}</p>
                      </div>
                    ))}
                    <div className="text-xs border border-gray-300">
                      <p className="py-1 px-2 bg-gray-100">????????????????????????</p>
                      <p className="py-1 px-2 whitespace-pre-wrap">{student.comment}</p>
                    </div>
                    <div className="flex">
                      <div
                        className="my-1 mx-2 w-1/2 bg-cover"
                        style={{
                          backgroundImage: `url(${student.thumbnailUrl})`,
                        }}
                      />
                      <div className="my-1 mx-2 w-1/2">
                        {student.vimeoUrl && <Vimeo video={student.vimeoUrl} responsive />}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Layout>
      </div>
    </>
  );
};

export default Students;
