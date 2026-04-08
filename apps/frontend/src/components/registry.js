import { lazy } from "react";

export const componentRegistry = {
  Card: lazy(() => import("./Card")),
  Modal: lazy(() => import("./Modal")),
  InfoPanel: lazy(() => import("./InfoPanel")),
};
