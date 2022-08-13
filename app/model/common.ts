import { z } from 'zod'

export const date_string = z.string()
  .refine(s => {
    const d = new Date(s)
    const t = d.getTime()
    if (isNaN(t)) {
      return false;
    }
    return true
  })
  .transform(s => new Date(s))

export const int_string = z.string()
  .refine(s => {
    const x = parseInt(s)
    return !isNaN(x)
  })
  .transform(s => parseInt(s))

export const float_string = z.string()
  .refine(s => {
    const x = parseFloat(s)
    return !isNaN(x)
  })
  .transform(s => parseFloat(s))

export const nisn_schema = z.string()
  .min(10, 'harus 10 karakter')
  .max(10, 'harus 10 karakter')
  .regex(new RegExp('[0-9]{10,10}'), 'NISN tidak valid')
