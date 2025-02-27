import { array, InferType, number, object, string } from "yup";

import { COORDINATE_PATTERN } from "@/utils/coords";


export const minStopCount = 3;
export const minStopTime = 0;
export const maxStopTime = 60;


export const RouteFormSchema = object({
  stops: array()
    .transform((arr: Record<string, string>[]) => arr.filter(item => item.fullText))
    .min(minStopCount, `Please add at least ${minStopCount} stops`)
    .required(`Please add at least ${minStopCount} stops`)
    .of(
      object({
        fullText: string().required("Please enter an address"),
        mainText: string().optional(),
        coordinates: string().transform(v => v || undefined).required("Missing coordinates").matches(COORDINATE_PATTERN, "Invalid coordinates"),
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
    .min(minStopTime, `${minStopTime} minutes is the minimum stop time`)
    .max(maxStopTime, `${maxStopTime} minutes is the maximum stop time`),
});

export type RouteFormFields = InferType<typeof RouteFormSchema>;