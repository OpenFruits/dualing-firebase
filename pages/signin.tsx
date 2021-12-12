import { signInWithEmailAndPassword } from "@firebase/auth";
import { Dialog, Transition } from "@headlessui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import type { VFC } from "react";
import { Fragment, useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { ResetPasswordForm } from "src/component/separate/Student/ResetPasswordForm";
import { Button } from "src/component/shared/Button";
import { Input } from "src/component/shared/Input";
import { auth } from "src/firebase";
import { Header } from "src/layout/application/Header";

type Inputs = {
  email: string;
  password: string;
};

const SignIn: VFC = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const [isLoading, setIsLoading] = useState(false);

  const signIn: SubmitHandler<Inputs> = (data) => {
    setIsLoading(true);
    signInWithEmailAndPassword(auth, data.email, data.password)
      .then((userCredential) => {
        const user = userCredential.user;
        router.push(`/${user.uid}`).then(() => setIsLoading(false));
      })
      .catch(() => {
        alert("メールアドレスまたはパスワードが間違っています");
        setIsLoading(false);
      });
  };

  return (
    <div className="w-screen h-screen bg-cover bg-first-view">
      <Header href="/" pageTitle="学生ログインページ" />
      <div className="p-4 m-auto my-20 sm:w-2/3">
        <form onSubmit={handleSubmit(signIn)}>
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
            <Button
              className="m-auto my-4 w-2/3 shadow-md sm:w-full"
              disabled={isLoading}
              onClick={handleSubmit(signIn)}
            >
              {isLoading ? "ログイン中" : "ログイン"}
            </Button>
            <div className="py-1" />
            <Link href="/signup">
              <a>
                <span className="m-auto text-sm border-b border-black lg:mx-4 lg:mb-0">学生アカウント作成はこちら</span>
              </a>
            </Link>
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
              <div className="inline-block overflow-hidden px-6 my-20 w-full max-w-sm text-left align-middle bg-white rounded-2xl transition-all transform shadow-xl">
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
};

export default SignIn;
