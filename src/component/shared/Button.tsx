import cc from "classcat";
import { forwardRef, useMemo } from "react";

type Common = {
  children: React.ReactNode;
  className?: string;
  variant?: ButtonVariant;
  isDisabled?: boolean;
};

type ButtonVariant = "outline" | "ghost" | "solid-blue" | "solid-red" | "solid-gray" | "solid-white" | "solid-black";

type ButtonType = React.ButtonHTMLAttributes<HTMLButtonElement> & Common;

const useButtonClass = (className?: string, variant?: ButtonVariant, isDisabled?: boolean) => {
  const classes = useMemo(() => {
    return cc([
      "grid place-items-center px-4 py-2 font-bold tracking-wider focus-visible:ring-2 transition duration-200 ease-in-out focus:outline-none cursor-pointer",
      {
        "bg-gray-400 hover:bg-gray-400 cursor-default text-white": isDisabled,
        "border dark:border-gray-500 focus:ring-2 focus:ring-blue-400": variant === "outline" && !isDisabled,
        "hover:text-blue-400 focus-visible:text-blue-400 hover:bg-blue-50 focus-visible:bg-blue-50 dark:hover:bg-opacity-10 dark:focus-visible:bg-opacity-10 focus-visible:ring-blue-400":
          variant === "ghost" && !isDisabled,
        "text-white bg-blue-500 hover:bg-blue-600 focus-visible:bg-blue-600 focus-visible:ring-blue-400":
          variant === "solid-blue" && !isDisabled,
        "text-white bg-red-500 hover:bg-red-600 focus-visible:bg-red-600 focus-visible:ring-red-400":
          variant === "solid-red" && !isDisabled,
        "bg-gray-100 hover:bg-gray-200 focus-visible:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus-visible:bg-gray-600 focus-visible:ring-blue-400":
          variant === "solid-gray" && !isDisabled,
        "dark:text-black bg-white hover:bg-gray-100 focus:bg-gray-100 dark:hover:bg-gray-200 dark:focus:bg-gray-200":
          variant === "solid-white" && !isDisabled,
        "text-white bg-black hover:bg-gray-800 focus:bg-gray-800 dark:hover:bg-gray-900 dark:focus:bg-gray-900":
          variant === "solid-black" && !isDisabled,
      },
      className,
    ]);
  }, [className, variant, isDisabled]);

  return classes;
};

export const Button = forwardRef<HTMLButtonElement, ButtonType>((props, ref) => {
  const { children, className, variant = "solid-blue", isDisabled, ...rest } = props;
  const classes = useButtonClass(className, variant, isDisabled);
  return (
    <button type="button" disabled={isDisabled} ref={ref} {...rest} className={classes}>
      {children}
    </button>
  );
});

Button.displayName === "Button";
