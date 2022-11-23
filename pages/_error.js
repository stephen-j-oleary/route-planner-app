
import * as Sentry from "@sentry/nextjs";
import NextErrorComponent from "next/error";

function CustomErrorComponent(props) {
  return <NextErrorComponent statusCode={props.statusCode} />;
}

CustomErrorComponent.getInitialProps = async contextData => {
  await Sentry.captureUnderscoreErrorException(contextData);

  return NextErrorComponent.getInitialProps(contextData);
}

export default CustomErrorComponent;
