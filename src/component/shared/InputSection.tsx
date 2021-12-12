import type { VFC } from "react";

type Props = {
  title: string;
  children: React.ReactNode;
};

export const InputSection: VFC<Props> = (props) => {
  return (
    <div>
      <p className="p-3 text-sm font-bold bg-gray-200">{props.title}</p>
      <div className="p-4 border border-gray-200">{props.children}</div>
    </div>
  );
};
