import Image from "next/image";
import Router from "next/router";
import type { VFC } from "react";

type Props = {
  pageTitle: string;
  href: string;
};

export const Header: VFC<Props> = (props) => {
  return (
    <div className="pb-14">
      <header className="fixed top-0 z-30 w-full h-14 bg-white border-b">
        <div className="flex justify-between items-center px-2">
          <Image
            src="/dualing_logo.webp"
            alt="logo"
            loading="eager"
            width={185}
            height={56}
            onClick={() => Router.push(props.href)}
            className="cursor-pointer"
          />
          <div className="mr-2 text-lg font-bold">{props.pageTitle}</div>
        </div>
      </header>
    </div>
  );
};
