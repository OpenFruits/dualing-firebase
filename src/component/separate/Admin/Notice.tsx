import type { VFC } from "react";
import { useCallback, useState } from "react";

export const Notice: VFC = () => {
  const [address, setAddress] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const inputAddress = useCallback(
    (event) => {
      setAddress(event.target.value);
    },
    [setAddress]
  );
  const inputTitle = useCallback(
    (event) => {
      setTitle(event.target.value);
    },
    [setTitle]
  );
  const inputBody = useCallback(
    (event) => {
      setBody(event.target.value);
    },
    [setBody]
  );

  return (
    <div>
      <input
        type="text"
        id="address"
        value={address}
        placeholder="宛先"
        className="p-1 my-1 w-60 h-12 bg-white rounded border border-gray-300"
        onChange={inputAddress}
      />
      <input
        type="text"
        id="title"
        value={title}
        placeholder="題名"
        className="p-1 my-1 w-60 h-12 bg-white rounded border border-gray-300"
        onChange={inputTitle}
      />
      <input
        type="text"
        id="body"
        value={body}
        placeholder="本文"
        className="p-1 my-1 w-60 h-12 bg-white rounded border border-gray-300"
        onChange={inputBody}
      />
    </div>
  );
};
