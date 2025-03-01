import "client-only";

import { ReactNode, useEffect, useState } from "react";

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, useMediaQuery } from "@mui/material";


interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}


export default function Install({
  renderTrigger,
}: {
  renderTrigger: (params: { onClick: () => void }) => ReactNode,
}) {
  const isStandalone = useMediaQuery("@media (display-mode: standalone), (display-mode: minimal-ui)");

  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(
    () => {
      const handleInstallEvent = (e: BeforeInstallPromptEvent) => {
        e.preventDefault();
        setInstallPrompt(e);
      };

      window.addEventListener("beforeinstallprompt", handleInstallEvent);

      return () => {
        window.removeEventListener("beforeinstallprompt", handleInstallEvent);
      };
    },
    []
  );

  const handleClick = () => {
    if (installPrompt) installPrompt.prompt();
    else setShowInstructions(true);
  };

  return !isStandalone && (
    <>
      {renderTrigger({ onClick: handleClick })}

      <Dialog
        open={showInstructions}
        onClose={() => setShowInstructions(false)}
      >
        <DialogTitle>Install Loop Mapping</DialogTitle>

        <DialogContent>
          <Typography variant="body1">
            To install the Loop Mapping web app, follow these steps:
          </Typography>

          <ul>
            <Typography variant="body1" component="li">
              <strong>On iOS:</strong> Tap the Share icon and select &quot;Add to Home Screen&quot;.
            </Typography>

            <Typography variant="body1" component="li">
              <strong>On Android:</strong> Tap the Menu button and select &quot;Add to Home Screen&quot;.
            </Typography>
          </ul>
        </DialogContent>

        <DialogActions>
          <Button
            size="medium"
            variant="text"
            onClick={() => setShowInstructions(false)}
          >
            Okay
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}