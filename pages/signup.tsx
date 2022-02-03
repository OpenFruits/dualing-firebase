import { Dialog, Transition } from "@headlessui/react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, doc, setDoc, Timestamp } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/router";
import type { VFC } from "react";
import { Fragment, useEffect, useState } from "react";
import type { FieldError, SubmitHandler } from "react-hook-form";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import { PrivacyPolicy } from "src/component/separate/support/PrivacyPolicy";
import { Terms } from "src/component/separate/support/Terms";
import { Button } from "src/component/shared/Button";
import { Header } from "src/component/shared/Header";
import { Input } from "src/component/shared/Input";
import { advantageOptions } from "src/constants/options/advantage";
import { importantOptions } from "src/constants/options/important";
import { industryOptions } from "src/constants/options/industry";
import { locationOptions } from "src/constants/options/location";
import { occupationOptions } from "src/constants/options/occupation";
import type { SignUpForms as Inputs } from "src/constants/types";
import { auth, db } from "src/firebase";
import { arrayForSearch, filterValue } from "src/libs/util";

const SignUp: VFC = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    control,
  } = useForm<Inputs>();
  const [hasAgreement, setHasAgreement] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSupport, setSelectedSupport] = useState<"terms" | "privacy-policy">("terms");
  const [isOpen, setIsOpen] = useState(false);
  const closeModal = () => setIsOpen(false);
  const openModal = () => setIsOpen(true);

  const signup: SubmitHandler<Inputs> = (data) => {
    if (!hasAgreement) {
      alert("利用規約への同意が必要です。");
      return;
    }

    setIsLoading(true);

    const setUser = async (uid: string, userData: any) => {
      const usersRef = collection(db, "users");
      await setDoc(doc(usersRef, uid), userData);
    };

    createUserWithEmailAndPassword(auth, data.email, data.password)
      .then((userCredential) => {
        const user = userCredential.user;

        if (user) {
          const userInitialData = {
            created_at: Timestamp.now(),
            email: data.email,
            uid: user.uid,
            updated_at: Timestamp.now(),
            firstName: data.firstName,
            firstKana: data.firstKana,
            lastName: data.lastName,
            lastKana: data.lastKana,
            phoneNumber: data.phoneNumber,
            university: data.university,
            department: data.department,
            club: data.club,
            important: filterValue(data.important),
            importantForSearch: arrayForSearch(data.important),
            industries: filterValue(data.industries),
            industriesForSearch: arrayForSearch(data.industries),
            occupations: filterValue(data.occupations),
            occupationsForSearch: arrayForSearch(data.occupations),
            locations: filterValue(data.locations),
            locationsForSearch: arrayForSearch(data.locations),
            advantages: filterValue(data.advantages),
            advantagesForSearch: arrayForSearch(data.advantages),
            comment: data.comment,
            condition: "init",
            role: "student",
          };

          setUser(user.uid, userInitialData).then(() => router.push(`/${user.uid}`).then(() => setIsLoading(false)));
        }
      })
      .catch((error) => {
        if (error.code === "auth/email-already-in-use") {
          alert("メールアドレスがすでに使用されています");
        } else {
          // eslint-disable-next-line no-console
          console.log(error);

          alert("アカウント登録ができません。");
        }
        setIsLoading(false);
      });
  };

  const importantError = errors.important as unknown as FieldError;
  const industriesError = errors.industries as unknown as FieldError;
  const occupationsError = errors.occupations as unknown as FieldError;
  const locationsError = errors.locations as unknown as FieldError;
  const advantagesError = errors.advantages as unknown as FieldError;

  useEffect(() => {
    register("important");
  }, [register]);

  const openSupportModal = (selected: "terms" | "privacy-policy") => {
    setSelectedSupport(selected);
    openModal();
  };

  return (
    <div className="bg-fixed bg-cover bg-first-view">
      <Header pageTitle="学生新規登録ページ" />
      <div className="p-2 pb-10 m-auto sm:w-2/3">
        <p className="p-2 font-bold bg-white">
          アカウント情報を入力してください
          <br className="lg:hidden" />
          <Link href="/signin">
            <a>
              <span className="m-auto text-sm text-gray-700 border-b border-black lg:mx-4">
                すでにアカウントをお持ちの方はこちら
              </span>
            </a>
          </Link>
        </p>
        <form className="pt-2" onSubmit={handleSubmit(signup)}>
          <div className="space-y-3">
            <div>
              <p className="p-3 text-sm font-bold bg-gray-200">姓名</p>
              <div className="bg-white border border-gray-200">
                <div className="flex justify-center mx-4 sm: sm:justify-start">
                  <input
                    placeholder="姓"
                    className="p-1 mx-1 mt-2 w-40 h-10 bg-white rounded border border-gray-300"
                    {...register("firstName", { required: "姓名は必須です" })}
                  />
                  <input
                    placeholder="名"
                    className="p-1 mx-1 mt-2 w-40 h-10 bg-white rounded border border-gray-300"
                    {...register("lastName", { required: "姓名は必須です" })}
                  />
                </div>
                <p className="mb-2 ml-4 text-sm text-red-500">
                  {errors.firstName?.message ?? errors.lastName?.message ?? null}
                </p>
              </div>
            </div>
            <div>
              <p className="p-3 text-sm font-bold bg-gray-200">姓名（かな）</p>
              <div className="bg-white border border-gray-200">
                <div className="flex justify-center sm:justify-start sm:mx-4">
                  <input
                    placeholder="姓（かな）"
                    className="p-1 mx-1 mt-2 w-40 h-10 bg-white rounded border border-gray-300"
                    {...register("firstKana", {
                      required: "姓名（かな）は必須です",
                    })}
                  />
                  <input
                    placeholder="名（かな）"
                    className="p-1 mx-1 mt-2 w-40 h-10 bg-white rounded border border-gray-300"
                    {...register("lastKana", {
                      required: "姓名は必須です（かな）",
                    })}
                  />
                </div>
                <p className="mb-2 ml-4 text-sm text-red-500">
                  {errors.firstKana?.message ?? errors.lastKana?.message ?? null}
                </p>
              </div>
            </div>
            <Input
              label="メールアドレス"
              placeholder="sample@dualing.jp"
              {...register("email", {
                required: "メールアドレスは必須です",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "正しいメールアドレスを入力してください",
                },
              })}
              error={errors.email?.message}
            />
            <Input
              label="電話番号（ハイフン不要）"
              placeholder="09012345678"
              {...register("phoneNumber", {
                required: "電話番号は必須です",
                pattern: {
                  value: /^(0{1}\d{9,10})$/,
                  message: "正しい電話番号を入力してください",
                },
              })}
              error={errors.phoneNumber?.message}
            />
            <Input
              label="大学名"
              placeholder="〇〇大学"
              {...register("university", {
                required: "大学名は必須です",
              })}
              error={errors.university?.message}
            />
            <Input
              label="学部"
              placeholder="〇〇学部"
              {...register("department", {
                required: "学部は必須です",
              })}
              error={errors.department?.message}
            />
            <Input
              label="部活、サークル"
              placeholder="〇〇部"
              {...register("club", {
                required: "部活、サークルは必須です",
              })}
              error={errors.club?.message}
            />
            <div>
              <p className="p-3 text-sm font-bold bg-gray-200">企業選びの軸</p>
              <div className="py-2 px-4 bg-white border border-gray-200">
                <Controller
                  name="important"
                  rules={{
                    required: "１つ以上選択してください",
                    validate: (value) => value.length <= 3 || "３つまで選択可能です",
                  }}
                  control={control}
                  render={({ field }) => (
                    <Select
                      id="important"
                      instanceId={"important"}
                      inputId={"important"}
                      {...field}
                      placeholder="３つまで選択"
                      isMulti
                      options={importantOptions}
                    />
                  )}
                />
                <p className="text-sm text-red-500">{importantError?.message}</p>
              </div>
            </div>
            <div>
              <p className="p-3 text-sm font-bold bg-gray-200">興味のある業界</p>
              <div className="py-2 px-4 bg-white border border-gray-200">
                <Controller
                  name="industries"
                  rules={{
                    required: "１つ以上選択してください",
                    validate: (value) => value.length <= 3 || "３つまで選択可能です",
                  }}
                  control={control}
                  render={({ field }) => (
                    <Select
                      id="industries"
                      instanceId={"industries"}
                      inputId={"industries"}
                      {...field}
                      placeholder="３つまで選択"
                      isMulti
                      options={industryOptions}
                    />
                  )}
                />
                <p className="text-sm text-red-500">{industriesError?.message}</p>
              </div>
            </div>
            <div>
              <p className="p-3 text-sm font-bold bg-gray-200">興味のある職種</p>
              <div className="py-2 px-4 bg-white border border-gray-200">
                <Controller
                  name="occupations"
                  rules={{
                    required: "１つ以上選択してください",
                    validate: (value) => value.length <= 3 || "３つまで選択可能です",
                  }}
                  control={control}
                  render={({ field }) => (
                    <Select
                      id="occupations"
                      instanceId={"occupations"}
                      inputId={"occupations"}
                      {...field}
                      placeholder="３つまで選択"
                      isMulti
                      options={occupationOptions}
                    />
                  )}
                />
                <p className="text-sm text-red-500">{occupationsError?.message}</p>
              </div>
            </div>
            <div>
              <p className="p-3 text-sm font-bold bg-gray-200">希望勤務地</p>
              <div className="py-2 px-4 bg-white border border-gray-200">
                <Controller
                  name="locations"
                  rules={{
                    required: "１つ以上選択してください",
                    validate: (value) => value.length <= 3 || "３つまで選択可能です",
                  }}
                  control={control}
                  render={({ field }) => (
                    <Select
                      id="locations"
                      instanceId={"locations"}
                      inputId={"locations"}
                      {...field}
                      placeholder="３つまで選択"
                      isMulti
                      options={locationOptions}
                    />
                  )}
                />
                <p className="text-sm text-red-500">{locationsError?.message}</p>
              </div>
            </div>
            <div>
              <p className="p-3 text-sm font-bold bg-gray-200">強み</p>
              <div className="py-2 px-4 bg-white border border-gray-200">
                <Controller
                  name="advantages"
                  rules={{
                    required: "１つ以上選択してください",
                    validate: (value) => value.length <= 3 || "３つまで選択可能です",
                  }}
                  control={control}
                  render={({ field }) => (
                    <Select
                      id="advantages"
                      instanceId={"advantages"}
                      inputId={"advantages"}
                      {...field}
                      placeholder="３つまで選択"
                      isMulti
                      options={advantageOptions}
                    />
                  )}
                />
                <p className="text-sm text-red-500">{advantagesError?.message}</p>
              </div>
            </div>
            <div>
              <p className="p-3 text-sm font-bold bg-gray-200">ひとことアピール（任意）</p>
              <div className="py-2 px-4 bg-white border border-gray-200">
                <textarea
                  {...register("comment")}
                  defaultValue=""
                  placeholder="(例)誰にも負けない結果への執着心を営業職で発揮したいです。趣味は登山です。"
                  className="p-1 w-full h-14 leading-none rounded border border-gray-300 resize-none"
                />
              </div>
            </div>
            <Input
              label="パスワード"
              type="password"
              placeholder="半角英数字8文字以上"
              {...register("password", {
                required: "パスワードは必須です",
                pattern: {
                  value: /^[a-z\d]{8,50}$/i,
                  message: "半角英数字8文字以上で入力してください",
                },
                maxLength: {
                  value: 50,
                  message: "パスワードは50字以内で設定してください",
                },
              })}
              error={errors.password?.message}
            />
            <Input
              label="確認用パスワード"
              type="password"
              placeholder="確認用に再入力してください"
              {...register("confirmPassword", {
                required: "確認用パスワードは必須です",
                validate: (value) => value === getValues("password") || "パスワードが一致しません",
              })}
              error={errors.confirmPassword?.message}
            />
          </div>

          <div className="py-2 px-4 my-4 bg-white rounded-lg">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={hasAgreement}
                className="cursor-pointer"
                onChange={() => setHasAgreement(!hasAgreement)}
              />
              <p className="px-2 text-sm">規約を確認し同意する</p>
            </div>
            <p>
              （
              <span
                onClick={() => openSupportModal("terms")}
                className="mx-2 text-sm border-b border-gray-400 cursor-pointer"
              >
                利用規約を確認
              </span>
              /
              <span
                onClick={() => openSupportModal("privacy-policy")}
                className="mx-2 text-sm border-b border-gray-400 cursor-pointer"
              >
                プライバシーポリシーを確認
              </span>
              ）
            </p>
          </div>
          <Button className="w-full shadow-md" isDisabled={isLoading} onClick={handleSubmit(signup)}>
            {isLoading ? "作成中" : "アカウント作成"}
          </Button>
        </form>
      </div>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="overflow-y-auto fixed inset-0 z-50" onClose={closeModal}>
          <div className="px-4 min-h-screen text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
            </Transition.Child>

            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block overflow-hidden px-6 my-20 w-full max-w-3xl text-left align-middle bg-white rounded-2xl shadow-xl transition-all transform">
                {selectedSupport === "terms" ? <Terms /> : <PrivacyPolicy />}
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default SignUp;
