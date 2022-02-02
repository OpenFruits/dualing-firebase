import { Dialog, Transition } from "@headlessui/react";
import { signInWithEmailAndPassword } from "firebase/auth";
import type { NextPage } from "next";
import { Fragment, useCallback, useContext, useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { TopMenu } from "src/component/separate/Admin/TopMenu";
import { UserFlow } from "src/component/separate/Admin/UserFlow";
import { ResetPasswordForm } from "src/component/separate/Student/ResetPasswordForm";
import { Button } from "src/component/shared/Button";
import { Footer } from "src/component/shared/Footer";
import { Header } from "src/component/shared/Header";
import { Input } from "src/component/shared/Input";
import { Loading } from "src/component/shared/Loading";
import { NotFound } from "src/component/shared/NotFound";
import { auth } from "src/firebase";
import { AuthContext } from "src/firebase/Auth";

type Inputs = {
  email: string;
  password: string;
};

const Admin: NextPage = () => {
  const { currentUser } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const inputPassword = useCallback((e) => setPassword(e.target.value), [setPassword]);

  const submit = () => {
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setIsAdmin(true);
      toast.success("認証完了");
    } else {
      setPassword("");
      toast.error("認証失敗");
    }
  };

  const adminSignin: SubmitHandler<Inputs> = (data) => {
    setIsLoading(true);
    signInWithEmailAndPassword(auth, data.email, data.password)
      .then(() => setIsLoading(false))
      .catch(() => {
        alert("メールアドレスまたはパスワードが間違っています");
        setIsLoading(false);
      });
  };

  if (currentUser?.uid || currentUser?.companyId) return <NotFound />;

  if (!auth.currentUser && !isAdmin)
    return (
      <div className="m-4">
        <label htmlFor="password">パスワード</label>
        <br />
        <input
          type="password"
          id="password"
          value={password}
          className="p-1 w-[200px] h-8 text-xs bg-white rounded border border-gray-300"
          onChange={inputPassword}
        />
        <Button variant="solid-gray" onClick={submit} className="m-2 rounded-3xl">
          認証
        </Button>
      </div>
    );

  if (!auth.currentUser) {
    return (
      <div className="py-14 w-screen h-screen bg-cover bg-first-view">
        <Header href="/administrator" pageTitle="管理者ログインページ" />
        <div className="p-4 m-auto my-20 w-96 bg-white">
          <form onSubmit={handleSubmit(adminSignin)}>
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
            <div className="text-center">
              <Button className="m-auto w-2/3 shadow-md" onClick={handleSubmit(adminSignin)} isDisabled={isLoading}>
                {isLoading ? "ログイン中" : "ログイン"}
              </Button>
              <div className="py-1" />
              <span
                onClick={onOpen}
                className="m-auto text-xs hover:text-gray-500 border-b border-black cursor-pointer lg:mx-4 lg:mb-0"
              >
                パスワードをお忘れの場合
              </span>
            </div>
          </form>
        </div>
        <Footer />
        <Transition appear show={isOpen} as={Fragment}>
          <Dialog as="div" className="overflow-y-auto fixed inset-0 z-10" onClose={onClose}>
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
                <div className="inline-block overflow-hidden px-6 my-20 w-full max-w-sm text-left align-middle bg-white rounded-2xl shadow-xl transition-all transform">
                  <Dialog.Title as="h3" className="py-4 text-lg font-bold leading-6 text-gray-900">
                    パスワード再設定
                  </Dialog.Title>
                  {<ResetPasswordForm onClose={onClose} />}
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
      </div>
    );
  }

  if (auth.currentUser && !currentUser && isAdmin) return <Loading />;

  return (
    <>
      <Header pageTitle="管理者用ページ" href="/" />
      <TopMenu />
      <UserFlow />
    </>
  );
};

export default Admin;
