import { createBrowserRouter } from "react-router";
import Home from "./Home/home.tsx";
import Story from "./Story/story.tsx";
import { loader } from "./Story/loader.ts";
import { action } from "./Story/action.ts";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/story",
    Component: Story,
    loader: loader,
    action: action,
  },
]); 