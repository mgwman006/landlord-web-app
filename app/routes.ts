import Home from "./components/Home";
import HomePage from "./components/HomePage";
import RentalProfilePage from "./components/rentalprofile/RentalProfilePage";
import LeaseDashboard from "./components/lease/LeasesDashboard";
import LeaseList from "./components/lease/LeaseList";
import LeaseDetails from "./components/lease/LeaseDetails";
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
            Component: LeaseDashboard,
            children: [
              {
                path:"",
                Component:LeaseList
              },
              {
                path:"leases/:leaseIdParam",
                Component:LeaseDetails
              }
            ]
          }
        ]
      }
    ]
  }
];

export default routes;
