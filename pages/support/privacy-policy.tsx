import type { VFC } from "react";
import { useContext } from "react";
import { PrivacyPolicy as PrivacyPolisyComponent } from "src/component/separate/support/PrivacyPolicy";
import { AuthContext } from "src/firebase/Auth";
import { Header } from "src/layout/application/Header";

const PrivacyPolicy: VFC = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <>
      {<Header href={currentUser ? `/${currentUser?.uid}` : "/"} pageTitle="" />}
      <PrivacyPolisyComponent />
    </>
  );
};

export default PrivacyPolicy;
