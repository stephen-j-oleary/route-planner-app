import { array, InferType, number, object, string, tuple } from "yup";
import { minimumStopCount } from "./constants";


export const RouteFormSchema = object({
  stops: array()
    .transform((arr: Record<string, string>[]) => arr.filter(item => item.fullText))
    .min(minimumStopCount, `Please add at least ${minimumStopCount} stops`)
    .required(`Please add at least ${minimumStopCount} stops`)
    .of(
      object({
        fullText: string().required("Please enter an address"),
        mainText: string().optional(),
        coordinates: tuple([number().required(), number().required()])
          .optional()
          .default(undefined),
        duration: number().optional(),
      })
    ),
  origin: number()
    .required("Please select an origin")
    .min(0, "This stop could not be found")
    .test(
      "max",
      "This stop could not be found",
      (value, ctx) => value < ctx.parent.stops.length,
    ),
  destination: number()
    .required("Please select a destination")
    .min(0, "This stop could not be found")
    .test(
      "max",
      "This stop could not be found",
      (value, ctx) => value < ctx.parent.stops.length,
    ),
  stopTime: number()
    .required("Please enter a stop time")
    .min(0, "Please enter a value that is above zero")
    .max(60, "The maximum value is 60 minutes"),
});

export type RouteFormFields = InferType<typeof RouteFormSchema>;