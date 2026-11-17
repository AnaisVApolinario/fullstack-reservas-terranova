import clsx from "clsx";
import { useId } from "react";
/* eslint-disable react/prop-types */
export const InputField = ({
  label,
  className,
  type,
  autoComplete,
  ...props
}) => {
  const id = useId();
  return (
    <div className={clsx("flex flex-col", className)}>
      <label htmlFor={id} className="field-label">{label}</label>
      <input
        {...props}
        id={id}
        type={type}
        autoComplete={autoComplete}
        className={clsx("field", props.className)}
      />
    </div>
  );
};
