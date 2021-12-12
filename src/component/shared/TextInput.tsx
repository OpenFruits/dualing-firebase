import cc from "classcat";
import type { VFC } from "react";

type Props = {
  value: any;
  type: "text" | "email" | "password";
  placeholder?: "";
  option?: "";
  inputValue: (event: any) => void;
};

export const TextInput: VFC<Props> = (props) => {
  return (
    <input
      type={props.type}
      value={props.value}
      placeholder={props.placeholder}
      className={cc([
        "bg-white rounded border border-gray-300 p-1 w-full h-12",
        {
          [`${props.option}`]: props.option,
        },
      ])}
      onChange={props.inputValue}
    />
  );
};
