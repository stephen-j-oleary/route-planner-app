import React from "react";

import ViewError from "@/components/ui/ViewError";


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