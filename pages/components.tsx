import type { CustomNextPage } from "next";
import Head from "next/head";
import type { VFC } from "react";
import { Button } from "src/component/Button/Button";
import type { ButtonVariant } from "src/component/Button/type";
import { FixedLayout } from "src/layout/FixedLayout";

const Btn: VFC<{ variant: ButtonVariant }> = (props) => {
  return (
    <Button variant={props.variant} className="p-2 rounded">
      {props.variant}
    </Button>
  );
};

const Components: CustomNextPage = () => {
  return (
    <div>
      <Head>
        <title>Components Page</title>
      </Head>

      <div>
        <h2>Component Collection</h2>
        <h3>Button</h3>
        <div className="flex space-x-2">
          <Btn variant="solid-blue" />
          <Btn variant="solid-red" />
          <Btn variant="solid-gray" />
          <Btn variant="solid-white" />
          <Btn variant="solid-black" />
          <Btn variant="outline" />
          <Btn variant="ghost" />
        </div>
      </div>
    </div>
  );
};

Components.getLayout = FixedLayout;

export default Components;
