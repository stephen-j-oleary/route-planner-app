export type Pojo<TObject extends object> = {
  [Key in keyof TObject]: string | number extends TObject[Key]
    ? TObject[Key]
    : TObject[Key] extends object
    ? Pojo<TObject[Key]>
    : never;
}

export default function pojo<TObject extends object>(obj: TObject): Pojo<TObject> {
  return JSON.parse(JSON.stringify(obj));
}