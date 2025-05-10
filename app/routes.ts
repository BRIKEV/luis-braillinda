import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("story", "routes/story.tsx"),
] satisfies RouteConfig;
