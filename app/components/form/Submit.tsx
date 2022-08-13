type SubmitProps = {
  label: string;
}

export default function Submit({ label }: SubmitProps) {
  return (
    <button 
      type="submit"
      className="bg-blue-600 text-white font-bold px-6 py-2 rounded overflow-hidden"
    >
      {label}
    </button>
  )
}
