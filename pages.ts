const pages = {
  root: "/",
  login: "/login",
  verify: "/verify",
  account: "/account",
  plans: "/plans",
  payments: {
    setup: "/pay/setup",
  },
  routes: {
    root: "/routes",
    new: "/routes/new",
  },
  api: {
    accounts: "/api/accounts",
    autocomplete: "/api/autocomplete",
    geocode: "/api/geocode",
    prices: "/api/prices",
    products: "/api/products",
    route: "/api/route",
    session: "/api/session",
    signin: "/api/signin",
    user: "/api/user",
    userAccounts: "/api/user/accounts",
    userCheckoutSession: "/api/user/checkoutSession",
    userCustomer: "/api/user/customer",
    userInvoices: "/api/user/invoices",
    userUpcomingInvoices: "/api/user/invoices/upcoming",
    userPaymentMethods: "/api/user/paymentMethods",
    userRoutes: "/api/user/routes",
    userSubscriptions: "/api/user/subscriptions",
    userVerify: "/api/user/verify",
    userVerifySend: "/api/user/verify/send",
    users: "/api/users",
    webhooks: {
      usage: "/api/webhooks/usage",
    },
  },
};

export default pages;