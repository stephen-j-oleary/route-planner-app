import { GetServerSidePropsContext } from "next";


export default function createGetServerSidePropsContext(props: Partial<GetServerSidePropsContext>): GetServerSidePropsContext {
  return {
    ...props,
    req: props.req,
    res: props.res,
    query: props.query,
    resolvedUrl: props.resolvedUrl,
  };
}