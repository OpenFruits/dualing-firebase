import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db, FirebaseTimestamp } from "src/firebase";

export const getReservationList = async () => {
  const reservationsRef = collection(db, "reservations");
  const reservationsQuery = query(reservationsRef, orderBy("created_at"));
  const snapShot = await getDocs(reservationsQuery);
  const reservations = snapShot.docs.map((s) => {
    return {
      studentId: s.id,
      studentName: s.get("username"),
      firstChoice: s.get("firstChoice"),
      secondChoice: s.get("secondChoice"),
      thirdChoice: s.get("thirdChoice"),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      created_at: FirebaseTimestamp,
    };
  });
  return reservations;
};
