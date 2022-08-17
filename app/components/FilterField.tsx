import { InputHTMLAttributes } from 'react'

type FilterFieldProps = {
  label: string;
  onSet: (v: number) => void;
} & InputHTMLAttributes<HTMLInputElement>;

export default function FilterField({ 
    label, 
    value,
    onSet
  }: FilterFieldProps) {
  return (
    <div className="flex border overflow-hidden bg-white rounded">
      <div className="py-2 px-4 flex items-center justify-center font-bold text-sm border-r">{label}</div>
      <input
        type="number"
        className="px-2 py-2 bg-gray-50 focus:bg-blue-50 focus:font-bold"
        value={value}
        onChange={e => {
          const v = parseInt(e.target.value)
          if (isNaN(v)) {
            return;
          }
          onSet(v);
        }}
      />
    </div>
  )
}
