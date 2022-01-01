import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import { auth, db } from "src/firebase";

type ContextType = {
  currentUser: any;
  setCurrentUser: React.Dispatch<any>;
};

const AuthContext = createContext<ContextType>({
  currentUser: {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setCurrentUser: () => {},
});

const AuthProvider = (props: any) => {
  const [currentUser, setCurrentUser] = useState<any>(undefined);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        const companyRef = doc(db, "companies", user.uid);
        const companySnap = await getDoc(companyRef);
        const adminRef = doc(db, "administrators", user.uid);
        const adminSnap = await getDoc(adminRef);

        if (userSnap.exists()) {
          setCurrentUser({
            uid: user.uid,
            firstName: userSnap.data().firstName,
            lastName: userSnap.data().lastName,
            firstKana: userSnap.data().firstKana,
            lastKana: userSnap.data().lastKana,
            email: userSnap.data().email,
            phoneNumber: userSnap.data().phoneNumber,
            university: userSnap.data().university,
            department: userSnap.data().department,
            club: userSnap.data().club,
            important: userSnap.data().important,
            industries: userSnap.data().industries,
            occupations: userSnap.data().occupations,
            locations: userSnap.data().locations,
            advantages: userSnap.data().advantages,
            comment: userSnap.data().comment,
            condition: userSnap.data().condition,
            vimeoUrl: userSnap.data().vimeoUrl,
          });
        }

        if (companySnap.exists()) {
          setCurrentUser({
            companyId: user.uid,
            name: companySnap.data().name,
            condition: companySnap.data().condition,
          });
        }

        if (adminSnap.exists()) {
          setCurrentUser({
            administratorId: user.uid,
            name: adminSnap.data().name,
          });
        }
      } else {
        setCurrentUser(undefined);
      }
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser: currentUser,
        setCurrentUser: setCurrentUser,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
