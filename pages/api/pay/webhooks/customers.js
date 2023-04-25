import User from "@/shared/models/User";


export async function handleCustomerCreated(event) {
  const { object } = event.data;

  await User.findOneAndUpdate(
    { email: object.email },
    { $set: {
      customerId: object.id,
    } }
  ).exec();
}

export async function handleCustomerDeleted(event) {
  const { object } = event.data;

  await User.findOneAndUpdate(
    { email: object.email },
    { $unset: {
      customerId: "",
    } }
  ).exec();
}