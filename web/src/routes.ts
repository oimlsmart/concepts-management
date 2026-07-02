import type { RouteRecordRaw } from "vue-router";

const Index = () => import("./pages/index.vue");
const TermsIndex = () => import("./pages/terms/index.vue");
const TermPage = () => import("./pages/terms/[slug].vue");
const Editions = () => import("./pages/editions.vue");
const Harmonization = () => import("./pages/harmonization.vue");
const Conflicts = () => import("./pages/conflicts.vue");
const Leaderboard = () => import("./pages/leaderboard.vue");
const PublicationsIndex = () => import("./pages/publications/index.vue");
const PublicationPage = () => import("./pages/publications/[slug].vue");
const TcIndex = () => import("./pages/tc/index.vue");
const TcPage = () => import("./pages/tc/[slug].vue");

export const routes: RouteRecordRaw[] = [
  { path: "/", component: Index },
  { path: "/terms/", component: TermsIndex },
  { path: "/terms/:slug/", component: TermPage, props: true },
  { path: "/publications/", component: PublicationsIndex },
  { path: "/publications/:slug/", component: PublicationPage, props: true },
  { path: "/tc/", component: TcIndex },
  { path: "/tc/:slug/", component: TcPage, props: true },
  { path: "/editions/", component: Editions },
  { path: "/harmonization/", component: Harmonization },
  { path: "/conflicts/", component: Conflicts },
  { path: "/leaderboard/", component: Leaderboard },
];
