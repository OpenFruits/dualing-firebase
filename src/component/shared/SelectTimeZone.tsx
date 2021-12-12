import { RadioGroup } from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/solid";
import type { VFC } from "react";
import { useEffect, useState } from "react";
import type { Reservations } from "src/component/separate/Student/ReservationForm";

type Props = {
  reservations: Reservations;
  setReservations: React.Dispatch<React.SetStateAction<Reservations>>;
};

export const SelectTimeZone: VFC<Props> = (props) => {
  const [value, setValue] = useState("午前");
  useEffect(() => {
    props.setReservations({ ...props.reservations, timeZone: value });
  }, [value]);

  return (
    <RadioGroup value={value} onChange={setValue} className="flex gap-4">
      <RadioGroup.Option value="午前">
        {({ checked }) => (
          <div className="flex cursor-pointer">
            {checked && <CheckCircleIcon className="w-6 h-6 text-blue-500" />}
            {!checked && <CheckCircleIcon className="w-6 h-6 text-gray-300" />}
            <span>午前</span>
          </div>
        )}
      </RadioGroup.Option>
      <RadioGroup.Option value="午後">
        {({ checked }) => (
          <div className="flex cursor-pointer">
            {checked && <CheckCircleIcon className="w-6 h-6 text-blue-500" />}
            {!checked && <CheckCircleIcon className="w-6 h-6 text-gray-300" />}
            <span>午後</span>
          </div>
        )}
      </RadioGroup.Option>
    </RadioGroup>
  );
};
