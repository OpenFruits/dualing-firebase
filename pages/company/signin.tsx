import { signInWithEmailAndPassword } from "@firebase/auth";
import Link from "next/link";
import { useRouter } from "next/router";
import type { VFC } from "react";
import { useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { Button } from "src/component/shared/Button";
import { Input } from "src/component/shared/Input";
import { googleFormUrl } from "src/constants/externalLink";
import { auth } from "src/firebase";
import { Footer } from "src/layout/application/Footer";
import { Header } from "src/layout/application/Header";

type Inputs = {
  email: string;
  password: string;
};

const SignIn: VFC = () => {
  const router = useRouter();
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
        const company = userCredential.user;
        router.push(`/company/${company.uid}`).then(() => setIsLoading(false));
      })
      .catch(() => {
        alert("メールアドレスまたはパスワードが間違っています");
        setIsLoading(false);
      });
  };

  return (
    <div className="py-14 w-screen h-screen bg-cover bg-first-view">
      <Header href="/" pageTitle="企業ログインページ" />
      <div className="p-4 m-auto my-20 w-96 bg-white">
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
            <Button className="m-auto w-2/3 shadow-md" disabled={isLoading} onClick={handleSubmit(signIn)}>
              {isLoading ? "ログイン中" : "ログイン"}
            </Button>
            <div className="py-1" />
            <Link href={googleFormUrl}>
              <a>
                <span className="m-auto text-xs border-b border-black lg:mx-4 lg:mb-0">
                  パスワードをお忘れの場合はお問い合わせください
                </span>
              </a>
            </Link>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default SignIn;
