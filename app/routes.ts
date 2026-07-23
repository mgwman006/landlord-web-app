import Home from "./components/Home";
import HomePage from "./components/HomePage";
import RentalProfilePage from "./components/rentalprofile/RentalProfilePage";

const routes = [
  {
    path: "/",
    Component: Home,
    children: [
      {
        path:"",
        Component: HomePage
      }
      ,
      {
        path: "rental-profile/:id",
        Component: RentalProfilePage
      }
    ]
  }
];

export default routes;
