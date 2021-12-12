import cc from "classcat";
import { forwardRef } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

type Props = UseFormRegisterReturn & {
  label: string;
  type?: string;
  error?: string;
  placeholder?: string;
  defaultValue?: string;
  option?: string;
};

export const Input = forwardRef<HTMLInputElement, Props>((props, ref) => {
  return (
    <div className="pb-2 my-2 bg-white border border-gray-200">
      <label className="block p-2 text-sm font-bold bg-gray-200" htmlFor={props.name}>
        {props.label}
      </label>
      <div className="mx-4 mt-2">
        <input
          ref={ref}
          type={props.type ?? "text"}
          placeholder={props.placeholder}
          defaultValue={props.defaultValue}
          className={cc([
            "border border-gray-200 rounded p-1 w-full h-10",
            {
              [`${props.option}`]: props.option,
            },
          ])}
          name={props.name}
          onChange={props.onChange}
          onBlur={props.onBlur}
        />
      </div>
      <p className="ml-4 text-sm text-red-500">{props.error ?? null}</p>
    </div>
  );
});

Input.displayName === "input";
