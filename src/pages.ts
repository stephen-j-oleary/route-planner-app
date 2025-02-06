const pages = {
  root: "/",
  login: "/login",
  login_email: "/login/email",
  login_existing: "/login/existing",
  login_new: "/login/new",
  register: "/register",
  verify: "/verify",
  account: {
    root: "/account",
    editProfile: "/account/edit-profile",
    changePassword: "/account/change-password",
  },
  plans: "/plans",
  subscribe: "/subscribe",
  routes: {
    root: "/routes",
    id: "/routes/",
    new: "/routes/new",
    saved: "/routes/saved",
  },
  enableLocation: "/enable-location",
  cookies: "/cookies",
  privacy: "/privacy",
  sitemap: "/sitemap",
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

export const navigation = [
  ["Home", pages.root],
  ["Pricing", pages.plans],
  ["Route", pages.routes.new],
];

export const user = [
  ["Saved routes", pages.routes.saved],
  ["Country", pages.account.editProfile],
  ["Settings", pages.account.root],
  ["Sign out", "#"],
];

export default pages;