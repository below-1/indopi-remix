import { createContext, useContext } from "react";
import { SerializedSiswa } from "~/model/siswa";

const SiswaContext = createContext<() => SerializedSiswa>(() => {
  throw new Error('not_implemented')
})

export function useCurrentSiswa() {
  const getter = useContext(SiswaContext)
  const siswa = getter()
  return siswa
}

export default SiswaContext
