import type { VFC } from "react";
import { useContext } from "react";
import { Terms as TermsComponent } from "src/component/separate/support/Terms";
import { Header } from "src/component/shared/Header";
import { AuthContext } from "src/firebase/Auth";

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
