import type { VFC } from "react";
import { useContext } from "react";
import { Terms as TermsComponent } from "src/component/separate/support/Terms";
import { AuthContext } from "src/firebase/Auth";
import { Header } from "src/layout/application/Header";

const Terms: VFC = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <>
      {<Header href={currentUser ? `/${currentUser?.uid}` : "/"} pageTitle="" />}
      <TermsComponent />
    </>
  );
};

export default Terms;
