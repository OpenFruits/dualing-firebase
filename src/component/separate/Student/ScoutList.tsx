import { Disclosure } from "@headlessui/react";
import { MinusIcon, PlusIcon } from "@heroicons/react/solid";
import { collection, getDocs, query, where } from "firebase/firestore";
import type { VFC } from "react";
import { useContext, useEffect, useState } from "react";
import { ScoutedCompany } from "src/component/separate/Student/ScoutedCompany";
import type { Company } from "src/constants/types";
import { db } from "src/firebase";
import { AuthContext } from "src/firebase/Auth";

export const ScoutList: VFC = () => {
  const { currentUser } = useContext(AuthContext);
  const [companyIDs, setCompanyIDs] = useState<string[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);

  const getCompanyIdList = async () => {
    const ref = collection(db, "relations");
    const q = query(ref, where("studentId", "==", currentUser?.uid), where("condition", "==", "scout"));
    const snapShot = await getDocs(q);
    const _companyIDs = snapShot.docs.map((s) => s.get("companyId"));
    setCompanyIDs(_companyIDs);
  };

  const getCompanyList = async () => {
    const ref = collection(db, "companies");
    const q = query(ref, where("companyId", "in", companyIDs));
    const snapShot = await getDocs(q);
    const _companies = snapShot.docs.map((s) => {
      return {
        name: s.get("name"),
        industry: s.get("industry"),
        occupations: s.get("occupations"),
        corporateUrl: s.get("corporateUrl"),
        recruitUrl: s.get("recruitUrl"),
        email: s.get("email"),
        id: s.id,
      };
    });
    setCompanies(_companies);
  };

  useEffect(() => {
    getCompanyIdList();
  }, [currentUser]);

  useEffect(() => {
    if (companyIDs.length === 0) setCompanies([]);
    if (companyIDs.length) {
      getCompanyList();
    }
  }, [companyIDs]);

  return (
    <div className="my-2 mx-1">
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex justify-between p-3 w-full text-lg font-bold text-left text-theme-dark bg-gray-100 hover:bg-gray-200 rounded-lg focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75 focus:outline-none">
              <span>スカウト一覧</span>
              {!open && <PlusIcon className="w-6 h-6 text-theme-dark" />}
              {open && <MinusIcon className="w-6 h-6 text-theme-dark" />}
            </Disclosure.Button>
            <Disclosure.Panel className="py-2 px-1 text-sm text-theme-dark">
              {companies.length ? (
                companies.map((company) => (
                  <div key={company.id} className="py-1 border-t">
                    <ScoutedCompany company={company} />
                  </div>
                ))
              ) : (
                <div>スカウトがありません</div>
              )}
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
};
