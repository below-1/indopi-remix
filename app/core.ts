import { z, ZodError } from "zod";
import { match } from 'ts-pattern'

export type BaseErr<code> = {
  code: code;
  message: string;
  fields?: Record<string, any>;
  fieldErrors?: Record<string, string[]>;
}

export type ValidationErr = BaseErr<'validation_err'>;
export type NotFound = BaseErr<'not_found'>;
export type PasswordMismatch = BaseErr<'password_mismatch'>;
export type DbErr = BaseErr<'db_err'>;
export type UnknownErr = BaseErr<'unknown_err'>;

export type AppErr = ValidationErr | NotFound | PasswordMismatch | DbErr | UnknownErr;

export type Ok<T> = { ok: true; data: T };
export type Err<E> = { ok: false; error: E };
export type Result<T, E = unknown> = Ok<T> | Err<E>;

export async function wrap<T, E = unknown>(prom: Promise<T>): Promise<Result<T, E>> {
  try {
    const result = await prom;
    return { ok: true, data: result }
  } catch (err) {
    return { ok: false, error: err as E };
  }
}

export function ok<T>(data: T): Ok<T> {
  return {
    ok: true,
    data
  };
}

export function err<E extends AppErr>(e: E): Err<E> {
  return {
    ok: false,
    error: e
  };
}

export function from_zod<T>(
  z: ZodError<T>,
  v: Record<string, any>,
  message: string
): ValidationErr {
  const err = z.flatten()
  const {
    fieldErrors
  } = err;
  return {
    code: 'validation_err',
    message,
    fields: v,
    fieldErrors: fieldErrors as Record<string, string[]>
  }
}

export function useErrContext<T>(result: Result<T, AppErr> | undefined) {
  return match(result)
    .with({ ok: false }, d => ({ 
      fieldErrors: d.error.fieldErrors,
      fields: d.error.fields,
      message: d.error.message
    }))
    .otherwise(() => ({
      fields: undefined,
      fieldErrors: undefined,
      message: undefined
    }));
}

export type LoadMode = 'reload' | 'append'

export function debounce<T extends Function>(cb: T, wait = 20) {
  let h: any = 0;
  let callable = (...args: any) => {
      clearTimeout(h);
      h = setTimeout(() => cb(...args), wait);
  };
  return <T>(<any>callable);
}
