import { getProductById } from "./actions";


export type ApiGetProductByIdResponse = Awaited<ReturnType<typeof getProductById>>;