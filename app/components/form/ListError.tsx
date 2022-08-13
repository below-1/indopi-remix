import { FC } from "react"

export type IListErrorProps = {
  errors?: Array<string>;
}

const ListError: FC<IListErrorProps> = ({ errors }) => {
  return (
    <div className="flex flex-col">
      {
        errors
          ? (errors.map((err, index) => (
              <p 
                key={index} 
                className="text-red-500 text-xs"
              >{err}</p>
            ))
          ) : null
      }
    </div>
  )
}

export default ListError;
