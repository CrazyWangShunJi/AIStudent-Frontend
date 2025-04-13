declare module 'resolve' {
  export function sync(id: string, opts: { basedir: string }): string;
}