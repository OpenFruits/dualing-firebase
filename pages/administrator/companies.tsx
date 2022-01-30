import { ExternalLinkIcon } from "@heroicons/react/outline";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/router";
import type { VFC } from "react";
import { useContext, useEffect, useState } from "react";
import { Button } from "src/component/shared/Button";
import { Header } from "src/component/shared/Header";
import { Layout } from "src/component/shared/Layout";
import { Loading } from "src/component/shared/Loading";
import { NotFound } from "src/component/shared/NotFound";
import type { AdminCompany } from "src/constants/types";
import { auth, db } from "src/firebase";
import { AuthContext } from "src/firebase/Auth";
import { FromTimeStampToDate } from "src/libs/util";

const Companies: VFC = () => {
  const router = useRouter();
  const { currentUser } = useContext(AuthContext);
  const [companies, setCompanies] = useState<AdminCompany[]>([]);
  const [showID, setShowID] = useState("");

  const getCompanyList = async () => {
    const ref = collection(db, "companies");
    const q = query(ref, orderBy("created_at", "desc"));
    const snapShot = await getDocs(q);
    const companies = snapShot.docs.map((doc) => {
      return {
        id: doc.id,
        email: doc.get("email"),
        password: doc.get("password"),
        name: doc.get("name"),
        industry: doc.get("industry"),
        occupations: doc.get("occupations"),
        corporateUrl: doc.get("corporateUrl"),
        recruitUrl: doc.get("recruitUrl"),
        condition: doc.get("condition"),
        created_at: doc.get("created_at"),
      };
    });
    setCompanies(companies);
  };

  useEffect(() => {
    getCompanyList();
  }, []);

  if (companies.length === 0 || (auth.currentUser && !currentUser)) return <Loading />;

  if (!currentUser?.administratorId) return <NotFound />;

  return (
    <>
      <Header pageTitle="管理者用ページ" href="/administrator" />
      <div className="m-auto sm:w-2/3">
        <Layout>
          <Button className="shadow-md" onClick={() => router.push("/administrator")}>
            管理者ページTOPに戻る
          </Button>
          <div className="py-4">
            <p className="py-2 text-xl font-bold">企業一覧</p>
            <div className="flex py-2 space-x-2 w-full bg-gray-100">
              <p className="w-1/4">ID</p>
              <p className="pl-3 w-2/4">企業名</p>
              <p className="w-1/4">登録日時</p>
            </div>
            {companies?.map((company) => (
              <div key={company.id}>
                <div
                  onClick={() => setShowID(showID === company.id ? "" : company.id)}
                  className={
                    showID === company.id
                      ? `flex justify-start space-x-2 h-10 items-center hover:bg-gray-200 cursor-pointer bg-gray-200`
                      : `flex justify-start space-x-2 h-10 items-center hover:bg-gray-200 cursor-pointer`
                  }
                >
                  <p className="w-1/4 text-xs truncate">{company.id}</p>
                  <p className={showID === company.id ? `w-2/4 pl-3 bg-gray-200` : `w-2/4 pl-3`}>{company.name}</p>
                  <p className="text-sm">{FromTimeStampToDate(company.created_at)}</p>
                </div>
                {showID === company.id && (
                  <div className="p-2 space-y-2 border">
                    <div className="flex text-xs border border-gray-300">
                      <p className="py-1 px-2 w-1/4 bg-gray-100">メールアドレス</p>
                      <p className="py-1 px-2 whitespace-pre-wrap">{company.email}</p>
                    </div>
                    <div className="flex text-xs border border-gray-300">
                      <p className="py-1 px-2 w-1/4 bg-gray-100">パスワード</p>
                      <p className="py-1 px-2 whitespace-pre-wrap">{company.password}</p>
                    </div>
                    <div className="flex text-xs border border-gray-300">
                      <p className="py-1 px-2 w-1/4 bg-gray-100">企業サイト</p>
                      {company.condition === "normal" && (
                        <div className="inline-block">
                          <Link href={company.corporateUrl}>
                            <a className="flex items-center py-1 px-2 hover:text-gray-500 whitespace-pre-wrap">
                              <p className="mr-1">{company.corporateUrl}</p>
                              <ExternalLinkIcon className="w-4 h-4" />
                            </a>
                          </Link>
                        </div>
                      )}
                    </div>
                    <div className="flex text-xs border border-gray-300">
                      <p className="py-1 px-2 w-1/4 bg-gray-100">採用サイト</p>
                      {company.condition === "normal" && (
                        <div className="inline-block">
                          <Link href={company.recruitUrl}>
                            <a className="flex items-center py-1 px-2 hover:text-gray-500 whitespace-pre-wrap">
                              <p className="mr-1">{company.recruitUrl}</p>
                              <ExternalLinkIcon className="w-4 h-4" />
                            </a>
                          </Link>
                        </div>
                      )}
                    </div>
                    <div className="flex text-xs border border-gray-300">
                      <p className="py-1 px-2 w-1/4 bg-gray-100">業界</p>
                      <p className="py-1 px-2 whitespace-pre-wrap">{company.industry}</p>
                    </div>
                    <div className="flex text-xs border border-gray-300">
                      <p className="py-1 px-2 w-1/4 bg-gray-100">求める職種</p>
                      <p className="py-1 px-2 whitespace-pre-wrap">{company.occupations?.join(", ")}</p>
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

export default Companies;
