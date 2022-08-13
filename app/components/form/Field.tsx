interface IFieldProps {
  children: React.ReactNode;
  label: string;
  htmlFor?: string;
}

export default function Field(props : IFieldProps) {
  return (
    <div className="mb-4 flex flex-col flex-grow">
      <label 
        className="text-sm font-bold text-gray-600 mb-1"
        htmlFor={props.htmlFor}
      >{props.label}</label>
      {props.children}
    </div>
  )
}