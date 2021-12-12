import type { VFC } from "react";

type Props = {
  title: string;
  children: React.ReactNode;
};

export const Section: VFC<Props> = (props) => {
  return (
    <div className="py-4 px-8 m-2 w-[400px] bg-gray-200">
      <p>{`＜ ${props.title} ＞`}</p>
      {props.children}
    </div>
  );
};
