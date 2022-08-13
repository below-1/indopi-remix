import { FC, SelectHTMLAttributes, OptionHTMLAttributes } from "react";

interface IOptionProps extends OptionHTMLAttributes<HTMLOptionElement> {
}

interface ISelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: Array<IOptionProps>;
  errors?: string[];
}

const Select: FC<ISelectProps> = (props) => {
  const { options, errors, ...rest } = props;
  const Options = options.map((optionProps, index) => 
    (<option key={index} {...optionProps}></option>))
  return (
    <select 
      {...rest}
      className={`
        ${errors 
            ? 'border-red-600 outline-red-400 focus:outline-red-500'
            : 'focus:outline-primary-100'
        } 
        outline-none bg-gray-50 rounded-lg px-2 py-2
        focus:outline focus:outline-2
        border border-gray-200
      `}
    >
      {Options}
    </select>
  )
}

export default Select;