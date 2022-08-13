import { z } from 'zod'

export const user_schema = z.object({
  username: z.string(),
  password: z.string(),
  role: z.enum(['superuser', 'siswa'])
})

export type User = z.infer<typeof user_schema>;
