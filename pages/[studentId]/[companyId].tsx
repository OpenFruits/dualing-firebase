import { ExternalLinkIcon } from "@heroicons/react/outline";
import { onAuthStateChanged } from "firebase/auth";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { Chat } from "src/component/separate/Student/Chat";
import { Button } from "src/component/shared/Button";
import { Header } from "src/component/shared/Header";
import { Layout } from "src/component/shared/Layout";
import { Loading } from "src/component/shared/Loading";
import { NotFound } from "src/component/shared/NotFound";
import type { Company } from "src/constants/types";
import { auth, db } from "src/firebase";
import { AuthContext } from "src/firebase/Auth";

const CompanyId: NextPage = () => {
  const router = useRouter();
  const companyId = router.query.companyId;
  const studentId = router.query.studentId;
  const { currentUser } = useContext(AuthContext);
  const [company, setCompany] = useState<Company>();
  const [isMatch, setIsMatch] = useState(true);

  // マッチしているかチェック
  const checkMatching = async () => {
    if (companyId && studentId) {
      const ref = collection(db, "relations");
      const q = query(
        ref,
        where("companyId", "==", companyId),
        where("studentId", "==", studentId),
        where("condition", "==", "matching")
      );
      const snapShot = await getDocs(q);
      snapShot.docs.length ? setIsMatch(true) : setIsMatch(false);
    }
  };

  useEffect(() => {
    checkMatching();
  }, [companyId, studentId]);

  // 企業データを取得
  const getCompanyData = async () => {
    if (typeof companyId === "string" && isMatch) {
      const ref = doc(db, "companies", companyId);
      const snapShot = await getDoc(ref);
      snapShot.exists() &&
        setCompany({
          id: companyId,
          name: snapShot.data().name,
          email: snapShot.data().email,
          industry: snapShot.data().industry,
          occupations: snapShot.data().occupations,
          corporateUrl: snapShot.data().corporateUrl,
          recruitUrl: snapShot.data().recruitUrl,
        });
    }
  };

  useEffect(() => {
    getCompanyData();
  }, [companyId, isMatch]);

  // 未ログイン
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) router.push("/signin");
    });
  }, []);

  // ローディング
  if (!currentUser || isMatch === undefined) {
    return <Loading />;
  }

  // ログインユーザーとrouter.queryの学生が異なる or 学生と企業がマッチしていない
  if (currentUser?.uid !== router.query.studentId || !isMatch) {
    return <NotFound />;
  }

  return (
    <>
      <Header pageTitle="" href={`/${currentUser?.uid}`} />
      <Layout>
        {company && (
          <div className="m-auto w-full sm:w-[600px] lg:w-[800px]">
            <div className="sm:flex sm:flex-row-reverse sm:justify-between">
              <div className="flex justify-end my-2 mx-2">
                <Button className="h-10 rounded sm:shadow-md" onClick={() => router.push(`/${currentUser?.uid}`)}>
                  戻る
                </Button>
              </div>
              <div>
                <h1 className="text-2xl font-bold">{company.name}</h1>
                <p className="text-sm font-normal">{company.industry}</p>
              </div>
            </div>
            <div className="py-2 my-2 border-t-2">
              <p>【求める職種】</p>
              <p>{company.occupations.join(", ")}</p>
              <div className="py-1.5" />
              <p>【企業サイト】</p>
              <div className="inline-block">
                <Link href={company.corporateUrl}>
                  <a className="flex items-center hover:text-gray-500">
                    <p className="mr-1">{company.corporateUrl}</p>
                    <ExternalLinkIcon className="w-5 h-5" />
                  </a>
                </Link>
              </div>
              <div className="py-1.5" />
              <p>【採用サイト】</p>
              <div className="inline-block">
                <Link href={company.recruitUrl}>
                  <a className="flex items-center hover:text-gray-500">
                    <p className="mr-1">{company.recruitUrl}</p>
                    <ExternalLinkIcon className="w-5 h-5" />
                  </a>
                </Link>
              </div>
            </div>
            <Chat companyId={companyId as string} companyName={company.name} />
          </div>
        )}
      </Layout>
    </>
  );
};

export default CompanyId;
