import "react-modern-drawer/dist/index.css";

import { MenuIcon, XIcon } from "@heroicons/react/solid";
import Image from "next/image";
import Link from "next/link";
import Router from "next/router";
import type { VFC } from "react";
import { useContext, useState } from "react";
import AnchorLink from "react-anchor-link-smooth-scroll";
import Drawer from "react-modern-drawer";
import { Button } from "src/component/shared/Button";
import { googleFormUrl } from "src/constants/externalLink";
import { AuthContext } from "src/firebase/Auth";

export const Header: VFC = () => {
  const { currentUser } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };

  const MENU = [
    { title: "Dualingとは", href: "#whatis", offset: 100 },
    { title: "Dualingの強み", href: "#merit", offset: 40 },
    { title: "サービスの流れ", href: "#flow", offset: 100 },
    { title: "よくある質問", href: "#faq", offset: 0 },
  ];

  return (
    <div className="fixed top-0 z-30 w-full h-14 bg-white">
      <header className="px-2 border-b md:pr-0">
        <div className="flex justify-between items-center">
          <Image
            src="/dualing_logo.webp"
            alt="logo"
            loading="eager"
            width={185}
            height={56}
            onClick={() => Router.push("/")}
            className="cursor-pointer"
          />
          {currentUser ? null : (
            <MenuIcon className="w-12 h-12 text-black cursor-pointer lg:invisible" onClick={toggleDrawer} />
          )}
          <nav className="hidden font-sans text-base font-bold lg:flex">
            <ul className="flex items-center pr-3">
              {MENU.map((menu) => (
                <li key={menu.title} className="pr-3 text-gray-500 hover:text-black cursor-pointer">
                  <AnchorLink offset={menu.offset} href={menu.href}>
                    {menu.title}
                  </AnchorLink>
                </li>
              ))}
              <li className="pr-3 text-gray-500 hover:text-black cursor-pointer">
                <Link href={googleFormUrl}>
                  <a>お問い合わせ</a>
                </Link>
              </li>
            </ul>
            <div className="w-48 border-l border-gray-200">
              <Link href="/signin">
                <a>
                  <Button variant="solid-white" className="px-2 pt-1 w-full h-[28px] text-sm">
                    学生ログイン(新規登録)
                  </Button>
                </a>
              </Link>
              <Link href="/company/signin">
                <a>
                  <Button className="px-2 pt-1 w-full h-[28px] text-sm">採用担当者様はこちら</Button>
                </a>
              </Link>
            </div>
          </nav>
        </div>
        <Drawer open={isOpen} onClose={toggleDrawer} direction="right" size={384}>
          <div className="flex justify-between">
            <h3 className="py-2 px-4 text-2xl font-bold">メニュー</h3>
            <XIcon className="w-12 h-12 text-black cursor-pointer" onClick={toggleDrawer} />
          </div>
          {MENU.map((menu) => {
            return (
              <div key={menu.title} onClick={toggleDrawer} className="py-3 px-4 text-xl font-bold">
                <AnchorLink href={menu.href} offset={menu.offset}>{`→ ${menu.title}`}</AnchorLink>
              </div>
            );
          })}
          <div className="flex flex-col m-4 space-y-4">
            <Link href="/signin">
              <a className="flex flex-col">
                <Button variant="solid-red" className="rounded">
                  ログイン・会員登録（学生）
                </Button>
              </a>
            </Link>
            <Link href={googleFormUrl}>
              <a className="flex flex-col">
                <Button variant="solid-gray" className="rounded">
                  お問い合わせはこちら
                </Button>
              </a>
            </Link>
            <Link href="/company/signin">
              <a className="flex flex-col">
                <Button className="rounded">採用担当企業の方はこちら</Button>
              </a>
            </Link>
          </div>
        </Drawer>
      </header>
    </div>
  );
};
