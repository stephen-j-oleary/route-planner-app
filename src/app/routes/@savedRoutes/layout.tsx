import React from "react";

import { Card, CardContent, CardHeader } from "@mui/material";


export default function Layout({
  children,
}: {
  children: React.ReactNode,
}) {
  return (
    <Card>
      <CardHeader
        title="Saved Routes"
        titleTypographyProps={{ component: "h2" }}
      />
      <CardContent sx={{ paddingX: 0 }}>
        {children}
      </CardContent>
    </Card>
  );
}