import { sendPasswordResetEmail } from "firebase/auth";
import type { VFC } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Button } from "src/component/shared/Button";
import { Input } from "src/component/shared/Input";
import { auth } from "src/firebase";

type Inputs = { email: string };

export const ResetPasswordForm: VFC<{ onClose: () => void }> = (props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const resetPassword: SubmitHandler<Inputs> = (data) => {
    if (confirm("パスワードを再設定します。よろしいですか？")) {
      sendPasswordResetEmail(auth, data.email)
        .then(() => {
          toast.success("メールをご確認ください");
          props.onClose();
        })
        .catch(() => {
          alert(`${data.email}は登録されていません`);
        });
    }
  };

  return (
    <div>
      <p className="py-1 text-sm">パスワード再設定用のメールを送信します。</p>
      <form onSubmit={handleSubmit(resetPassword)}>
        <Input
          label="ログイン用メールアドレスを入力してください"
          placeholder="sample@dualing.jp"
          {...register("email", {
            required: "メールアドレスを入力してください",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "正しいメールアドレスを入力してください",
            },
          })}
          error={errors.email?.message}
        />
        <Button className="my-4 w-full text-sm shadow-md" onClick={handleSubmit(resetPassword)}>
          パスワード再設定用メールを送信
        </Button>
      </form>
    </div>
  );
};
