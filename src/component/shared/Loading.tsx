import { DotsHorizontalIcon } from "@heroicons/react/solid";
import type { VFC } from "react";

export const Loading: VFC = () => {
  return (
    <div className="grid place-items-center w-screen h-screen">
      <div className="relative text-center">
        <DotsHorizontalIcon className="w-36 h-36 text-theme animate-pulse" />
        <p className="absolute top-24 w-36 text-gray-400">Loading</p>
      </div>
    </div>
  );
};
