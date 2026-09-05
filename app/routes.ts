import Home from "./components/Home";
import HomePage from "./components/HomePage";
import RentalProfilePage from "./components/rentalprofile/RentalProfilePage";
import LeaseDashboard from "./components/lease/LeasesDashboard";
const routes = [
  {
    path: "/",
    Component: Home,
    children: [
      {
        path:"",
        Component: HomePage
      },
      {
        path: "rental-profile/:id",
        Component: RentalProfilePage,
        children: [
          {
            path: "",
            Component: LeaseDashboard
          }
        ]
      }
    ]
  }
];

export default routes;
