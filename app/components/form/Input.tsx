import { Fragment, InputHTMLAttributes } from "react";
import ListError from './ListError';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  errors?: string[];
}

export default function Input(props: InputProps) {
  const { errors, ...rest } = props
  let className = "rounded border px-2 py-2 bg-gray-50 focus:bg-white focus:outline focus:outline-1"
  if (errors) {
    className += ' border-red-400'
  }
  return (
    <Fragment>
      <input
        {...rest}
        className={className}
      />
      <ListError errors={errors} />
    </Fragment>
  );
}