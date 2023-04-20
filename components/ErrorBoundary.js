import { withRouter } from "next/router";
import React from "react";

import { Button } from "@mui/material";

import ViewError from "@/components/ViewError";


class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    const { hasError } = this.state;
    const {
      resetApproach = "subtreeReload",
      onReset = () => {},
      children,
      router,
    } = this.props;

    const handleReset = {
      fullReload: () => router.reload(),
      goBack: () => router.back(),
      subtreeReload: () => this.forceUpdate(),
    };

    const handleResetText = {
      fullReload: "Reload Page",
      goBack: "Go Back",
      subtreeReload: "Reload",
    };

    return hasError
      ? (
        <ViewError
          primary="An error occurred"
          action={
            <Button
              variant="contained"
              size="medium"
              onClick={handleReset[resetApproach] || onReset}
            >
              {handleResetText[resetApproach]}
            </Button>
          }
        />
      )
      : children;
  }
}

export default withRouter(ErrorBoundary);