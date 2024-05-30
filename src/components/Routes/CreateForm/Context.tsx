"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";

import { CreateRouteFormFields } from "./useLogic";


export interface ICreateRouteFormContext {
  defaultValues?: CreateRouteFormFields | (() => Promise<CreateRouteFormFields>),
  form?: UseFormReturn<CreateRouteFormFields>,
  setForm?: React.Dispatch<React.SetStateAction<UseFormReturn<CreateRouteFormFields> | undefined>>,
}

export const CreateRouteFormContext = React.createContext<ICreateRouteFormContext>({});

export type CreateRouteFormContextProviderProps = {
  defaultValues?: ICreateRouteFormContext["defaultValues"],
  children: React.ReactNode,
}

export default function CreateRouteFormContextProvider({
  defaultValues,
  ...props
}: CreateRouteFormContextProviderProps) {
  const [form, setForm] = React.useState<ICreateRouteFormContext["form"]>(undefined);

  return (
    <CreateRouteFormContext.Provider
      value={{
        defaultValues,
        form,
        setForm,
      }}
      {...props}
    />
  );
}