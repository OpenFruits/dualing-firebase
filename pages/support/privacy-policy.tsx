import type { VFC } from "react";
import { useContext } from "react";
import { PrivacyPolicy as PrivacyPolisyComponent } from "src/component/separate/support/PrivacyPolicy";
import { Header } from "src/component/shared/Header";
import { AuthContext } from "src/firebase/Auth";

const PrivacyPolicy: VFC = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <>
      {<Header href={currentUser ? `/${currentUser?.uid}` : "/"} />}
      <PrivacyPolisyComponent />
    </>
  );
};

export default PrivacyPolicy;
