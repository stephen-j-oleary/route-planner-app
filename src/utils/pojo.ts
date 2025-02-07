/* eslint-disable @typescript-eslint/no-explicit-any */
export type Pojo<TObject extends object> = {
  [Key in keyof TObject]: TObject[Key] extends object
    ? Pojo<TObject[Key]>
    : TObject[Key] extends (...args: any[]) => any
    ? never
    : TObject[Key];
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export default function pojo<TObject extends object>(obj: TObject): Pojo<TObject> {
  return JSON.parse(JSON.stringify(obj));
}