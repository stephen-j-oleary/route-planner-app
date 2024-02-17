import dynamic from "next/dynamic";
import React from "react";

const ViewError = dynamic(() => import("@/components/ui/ViewError").then(mod => mod.default));


export default class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    const { hasError } = this.state;
    const { children } = this.props;

    return hasError
      ? <ViewError primary="An error occurred" />
      : children;
  }
}