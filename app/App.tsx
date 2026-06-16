import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import routes from "./routes";

type RouteConfig = {
  path: string;
  Component?: React.ComponentType<any>;
  children?: RouteConfig[];
};

function renderRoutes(routes: RouteConfig[]) {
  return routes.map(({ path, Component, children }) => {
    const RouteComponent = Component ?? React.Fragment;
    return (
      <Route key={path} path={path} Component={RouteComponent}>
        {children && renderRoutes(children)}
      </Route>
    );
  });
}


export default function App() {
return (
<BrowserRouter>
 <Routes>{renderRoutes(routes)}</Routes>
</BrowserRouter>
 );
}
