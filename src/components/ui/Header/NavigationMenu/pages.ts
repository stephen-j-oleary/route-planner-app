import pages from "@/pages";


export type TPage = {
  name: string,
  path: string,
  pages?: TPage[],
};

const navigationPages: TPage[] = [
  { name: "Home", path: pages.root },
  { name: "Pricing", path: pages.plans },
  {
    name: "Route",
    path: pages.routes.new,
    pages: [
      { name: "Create a Route", path: pages.routes.new },
      { name: "My Routes", path: pages.routes.saved },
    ]
  },
];


export default navigationPages;