import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import RentalProfileDetails from "./RentalProfileDetails";
import { useAccount } from "../../store/account/AccountContext";

export default function RentalProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { accountState } = useAccount();

  const rentalProfileId = id ? parseInt(id, 10) : NaN;

  if (isNaN(rentalProfileId)) {
    return <div>Invalid rental profile id</div>;
  }

  return (
    <RentalProfileDetails
      rentalProfileId={rentalProfileId}
      token={accountState.accountDetails?.token ?? null}
      onBack={() => navigate(-1)}
    />
  );
}
