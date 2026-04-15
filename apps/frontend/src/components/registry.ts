import { lazy } from "react";
import type React from "react";

export const componentRegistry: Record<
  string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  React.LazyExoticComponent<React.ComponentType<any>>
> = {
  Card: lazy(() => import("./Card")),
  Modal: lazy(() => import("./Modal")),
  InfoPanel: lazy(() => import("./InfoPanel")),

  NavBar: lazy(() => import("./NavBar")),
  HeroLeft: lazy(() => import("./HeroLeft")),
  HeroRight: lazy(() => import("./HeroRight")),
  ProfileCard: lazy(() => import("./ProfileCard")),
  FunFacts: lazy(() => import("./FunFacts")),

  WorkWithMeCTA: lazy(() => import("./HelpMeFreeCTA")),
  DeliverProjectModal: lazy(() => import("./modals/DeliverProjectModal")),
  MentorMeModal: lazy(() => import("./modals/MentorMeModal")),
  CoffeeWithMeModal: lazy(() => import("./modals/CoffeeWithMeModal")),

  HelpMeFreeCTA: lazy(() => import("./HelpMeFreeCTA")),

  PageViewsPanel: lazy(() => import("./widgets/PageViewsPanel")),
  ModalOpensPanel: lazy(() => import("./widgets/ModalOpensPanel")),

  CTAClickPanel: lazy(() => import("./widgets/CTAClickPanel")),

  Footer: lazy(() => import("./Footer")),
};
