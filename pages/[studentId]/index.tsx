import Vimeo from "@u-wave/react-vimeo";
import { onAuthStateChanged } from "firebase/auth";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { Booking } from "src/component/separate/Student/Booking";
import { Footer } from "src/component/separate/Student/Footer";
import { GrayBox } from "src/component/separate/Student/GrayBox";
import { Inform } from "src/component/separate/Student/Inform";
import { MatchingList } from "src/component/separate/Student/MatchingList";
import { Profile } from "src/component/separate/Student/Profile";
import { ReservationForm } from "src/component/separate/Student/ReservationForm";
import { ScoutList } from "src/component/separate/Student/ScoutList";
import { Header } from "src/component/shared/Header";
import { Loading } from "src/component/shared/Loading";
import { NotFound } from "src/component/shared/NotFound";
import { auth } from "src/firebase";
import { AuthContext } from "src/firebase/Auth";

const StudentId: NextPage = () => {
  const router = useRouter();
  const { currentUser } = useContext(AuthContext);
  const condition = currentUser?.condition;

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) router.push("/signin");
    });
  }, []);

  if (!currentUser) return <Loading />;

  if (currentUser?.uid !== router.query.studentId) return <NotFound />;

  return (
    <div className="box-border relative pb-[140px] min-h-screen">
      <Header pageTitle="マイページ" href={`/${router.query.studentId}`} />
      {condition === "init" ? (
        <ReservationForm />
      ) : (
        <div className="m-auto sm:w-2/3">
          <Inform />
          <Profile />
          {condition === "reserved" && <Booking />}
          {condition === "shooting" && <GrayBox />}
          {condition === "waiting" && <GrayBox />}
          {condition === "normal" && (
            <div>
              {currentUser.vimeoUrl && <Vimeo video={currentUser.vimeoUrl} responsive className="m-2" />}
              <ScoutList />
              <MatchingList />
            </div>
          )}
        </div>
      )}
      <Footer />
    </div>
  );
};

export default StudentId;
