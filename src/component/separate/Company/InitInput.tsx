import { doc, updateDoc } from "firebase/firestore";
import type { VFC } from "react";
import { useContext, useState } from "react";
import type { FieldError, SubmitHandler } from "react-hook-form";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Select from "react-select";
import { Button } from "src/component/shared/Button";
import { Input } from "src/component/shared/Input";
import { industryOptions } from "src/constants/options/industry";
import { occupationOptions } from "src/constants/options/occupation";
import type { CompanyInit as Inputs } from "src/constants/types";
import { db } from "src/firebase";
import { AuthContext } from "src/firebase/Auth";
import { filterValue } from "src/libs/util";

export const InitInput: VFC = () => {
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<Inputs>();
  const [isLoading, setIsLoading] = useState(false);

  const submit: SubmitHandler<Inputs> = async (data) => {
    if (confirm("企業情報を登録します。よろしいですか？")) {
      setIsLoading(true);
      if (currentUser) {
        const ref = doc(db, "companies", currentUser.companyId);
        await updateDoc(ref, {
          industry: data.industry.value,
          occupations: filterValue(data.occupations),
          corporateUrl: data.corporateUrl,
          recruitUrl: data.recruitUrl,
          condition: "normal",
        }).then(() => {
          setCurrentUser({
            ...currentUser,
            industry: data.industry.value,
            occupations: filterValue(data.occupations),
            corporateUrl: data.corporateUrl,
            recruitUrl: data.recruitUrl,
            condition: "normal",
          });
          toast.success("入力が完了しました");
          setIsLoading(false);
        });
      }
    }
  };

  const industryError = errors.industry as unknown as FieldError;
  const occupationsError = errors.occupations as unknown as FieldError;

  return (
    <div className="">
      <form onSubmit={handleSubmit(submit)}>
        <div className="p-2 mb-2 bg-white rounded">
          <p className="text-lg font-bold">{currentUser?.name} 様</p>
          <div className="pt-1" />
          <p className="text-sm">利用開始前に、スカウト時に学生に送る企業情報を登録してください。</p>
        </div>
        <p className="p-2 text-sm font-bold bg-gray-200">業界</p>
        <div className="py-2 px-4 bg-white border border-gray-200">
          <Controller
            name="industry"
            rules={{
              required: "業界種別は入力必須です",
            }}
            control={control}
            render={({ field }) => (
              <Select
                id="industry"
                instanceId={"industry"}
                inputId={"industry"}
                {...field}
                placeholder="業界種別を選択してください"
                options={industryOptions}
              />
            )}
          />
          <p className="text-sm text-red-500">{industryError?.message}</p>
        </div>
        <p className="p-2 mt-2 text-sm font-bold bg-gray-200">募集している職種</p>
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
        <Input
          label="企業サイト"
          placeholder="企業サイトのURLを入力してください"
          {...register("corporateUrl", {
            required: "企業サイトのURLは必須です",
          })}
          error={errors.corporateUrl?.message}
        />
        <Input
          label="採用サイト"
          placeholder="採用サイトのURLを記入してください"
          {...register("recruitUrl", {
            required: "採用サイトのURLは必須です",
          })}
          error={errors.recruitUrl?.message}
        />
        <div className="py-1" />
        <Button className="w-full shadow-md" isDisabled={isLoading} onClick={handleSubmit(submit)}>
          {isLoading ? "登録処理中" : "入力を完了し、学生閲覧を開始する"}
        </Button>
      </form>
    </div>
  );
};
