import nanoid from 'nanoid/async'
import { createCookieSessionStorage, redirect } from '@remix-run/node';
import { getRedis } from './redis.server';
import { z } from 'zod';
import type { Siswa } from '~/model/siswa';
import { jenis_kelamin_schema } from '~/model/siswa'
import { int_string } from './model/common';
import type { User } from '~/model/user';
import { getByUsername } from './serv/siswa';
import { getSql } from './db.server';
import { err } from './core';

const COOKIE_SESS_KEY = "pip.session.uuid"

const defaultSecret = 'kjdsdkshdshdshd';
const sessionSecret = process.env.SESSION_SECRET 
? process.env.SESSION_SECRET
: defaultSecret;
const storage = createCookieSessionStorage({
  cookie: {
    name: "pip_session",
    secure: process.env.NODE_ENV == 'production',
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true
  }
})

export async function createSession(user: User, redirectTo: string) {
  let siswa: Siswa | undefined;
  if (user.role == 'siswa') {
    const sql = getSql()
    const findResult = await getByUsername(sql, user.username)
    if (!findResult.ok) {
      return err(findResult.error)
    }
    siswa = findResult.data
  }
  const token = await nanoid.nanoid()
  await setSessionData(token, { user, siswa })
  const session = await storage.getSession();
  session.set(COOKIE_SESS_KEY, token);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session)
    }
  })
}

function getUserSession(request: Request) {
  return storage.getSession(request.headers.get("Cookie"));
}

export async function requireAuthToken(request: Request, redirectTo: string = new URL(request.url).pathname) {
  const session = await getUserSession(request);
  const token = session.get(COOKIE_SESS_KEY);
  if (!token || typeof token !== 'string') {
    const searchParams = new URLSearchParams([
      ["redirectTo", redirectTo],
    ]);
    throw redirect(`/login?${searchParams}`)
  }
  return token
}

const SessionDataSchema = z.object({
  user: z.object({
    username: z.string(),
    role: z.enum(['superuser', 'siswa'])
  }),
  siswa: z.object({
    nama: z.string(),
    nisn: z.string(),
    jenis_kelamin: jenis_kelamin_schema,
    kelas: int_string,
    sub_kelas: int_string,
  }).nullish()
})
export type SessionData = z.infer<typeof SessionDataSchema>;

export async function getSessionData(token: string) {
  const key = `pip:${token}`
  const redis = getRedis()
  const raw_data = await redis.get(key)
  if (!raw_data) {
    return;
  }
  let obj = JSON.parse(raw_data);
  const result = await SessionDataSchema.parseAsync(obj);
  return result;
}

export async function setSessionData(token: string, data: { user: User, siswa?: Siswa }) {
  const { user, siswa } = data;
  const sess_data = {
    user: {
      username: user.username,
      role: user.role
    },
    siswa: siswa ? ({
      nama: siswa.nama,
      nisn: siswa.nisn,
      jenis_kelamin: siswa.jenis_kelamin,
      kelas: siswa.kelas,
      sub_kelas: siswa.sub_kelas
    }) : undefined
  }
  const redis = getRedis()
  const key = `pip:${token}`
  await redis.setex(key, 60 * 60 * 24, JSON.stringify(sess_data))
}

