
import {
  Button,
  Card,
  Col,
  Row,
  Timeline,
  Typography,
  Badge,
  Tag,
  notification,
  Modal,
  Form,
  Input,
  Select,
} from "antd";
import {
  ArrowRightOutlined,
  HomeOutlined,
  DollarOutlined,
  TeamOutlined,
  BarChartOutlined,
  PlayCircleOutlined,
  CheckCircleFilled,
  ThunderboltFilled,
  SafetyCertificateFilled,
  MobileFilled,
  RightCircleFilled,
} from "@ant-design/icons";
import { useSearchParams } from "react-router-dom";
import { AccountState, MembershipDetailsDTO } from "../models/user";
import { useAccount } from "../store/account/AccountContext";
import { useEffect, useState } from "react";
import { membershipApi, rentalProfileApi } from "../api/api";
import { handleApiError } from "../utilities/error-handler";
import { CreateRentalProfileDTO } from "../models/rentalprofile";
import CreateRentalProfile from "./rentalprofile/CreateRentalProfile";

const { Title, Paragraph, Text } = Typography;

// ─── Brand tokens ───────────────────────────────────────────
const NAVY = "#0F172A";
const TEAL = "#0F766E";
const TEAL_L = "#14B8A6";
const AMBER = "#D4A017";
const MUTED = "#64748B";
const BORDER = "#E2E8F0";
const OFF = "#F8FAFC";

const authUrl = import.meta.env.VITE_AUTH_URL?.trim();

function isTokenExpired(token?: string): boolean {
  if (!token) {
    return true;
  }

  try {
    const parts = token.split(".");
    if (parts.length < 2) {
      return true;
    }

    const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
    const exp = payload?.exp;

    if (typeof exp !== "number") {
      return true;
    }

    return Date.now() >= exp * 1000;
  } catch (error) {
    console.error("Failed to decode JWT", error);
    return true;
  }
}

export default function HomePage() 
{
  const [searchParams] = useSearchParams();
  const accountStateString = searchParams.get("state");
  const [notificationApi, contextHolder] = notification.useNotification();
  const { accountState, dispatchAccountState } = useAccount();
  const [memberships, setMemberships] = useState<MembershipDetailsDTO[]>([]);
  const [form] = Form.useForm();


   const getMembershipStatus = async (userId: number, token?: string) => {
    try 
    {
      if (!token) {
        console.warn("No token available for membership request, skipping call.");
        return;
      }
      const response : MembershipDetailsDTO[] = await membershipApi.getAllMemberships(userId,token);
      setMemberships(response);
      console.log("Memberships:", response);
    } 
    catch (error:any) 
    {
        handleApiError(error,notificationApi);
    }
  }


  useEffect(() => {
    if (!accountStateString) {
      return;
    }

    try {
      const receivedAccountState: AccountState = JSON.parse(accountStateString);
      const details = receivedAccountState.accountDetails;
      if (!details) {
        console.error("Account state payload is missing accountDetails");
        return;
      }

      if (isTokenExpired(details.token)) {
        notificationApi.error({
          message: "Session expired",
          description: "Your sign-in session has expired. Please sign in again.",
        });
        dispatchAccountState({ type: "LOGOUT" });
        return;
      }

      if (!accountState.accountDetails || accountState.accountDetails.token !== details.token) {
        dispatchAccountState({ type: "FETCH_SUCCESS", payload: details });
      }

      getMembershipStatus(
        details.userDetails?.id as number,
        details.token
      );
      form.setFieldsValue({
        phoneNumber: details.userDetails?.phoneNumber,
      });
    } catch (error) {
      console.error("Failed to parse account state from URL", error);
    }
  }, []);

 

  

  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {contextHolder}

      {
        memberships.length > 0 ? (
          <Card style={{ margin: "20px" }}>
            <Title level={4}>Select Rental Profiles to Proceed</Title>
            {memberships.map((membership) => (
              <Card key={membership.id} style={{ marginBottom: "10px" }}>
                <Row gutter={16}>
                  <Col span={12}>
                    {membership.rentalProfileName} <ArrowRightOutlined style={{ color: TEAL_L, marginLeft: 8 }} />
                  </Col>
                </Row>
              </Card>
            ))}
          </Card>
        )   
       : (
        <CreateRentalProfile token={accountState.accountDetails?.token ?? null} />
      )
     }
    </div>

  );
}
