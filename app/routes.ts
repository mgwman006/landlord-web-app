import Home from "./components/Home";
import HomePage from "./components/HomePage";

const routes = [
  {
    path: "/",
    Component: Home,
    children: [
      {
        path:"",
        Component: HomePage
      }
    ]
  }
];

export default routes;
