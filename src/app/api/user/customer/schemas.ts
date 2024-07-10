import { deleteUserCustomer, getUserCustomer } from "./actions";


export type ApiGetUserCustomerResponse = Awaited<ReturnType<typeof getUserCustomer>>;


export type ApiDeleteUserCustomerRepsonse = Awaited<ReturnType<typeof deleteUserCustomer>>;