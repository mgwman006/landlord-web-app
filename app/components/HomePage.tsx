
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
} from "@ant-design/icons";
import { useSearchParams } from "react-router-dom";
import { AccountState } from "../models/user";
import { useAccount } from "../store/account/AccountContext";
import { useEffect } from "react";
import { membershipApi } from "../api/api";
import { handleApiError } from "../utilities/error-handler";

const { Title, Paragraph, Text } = Typography;

// ─── Brand tokens ───────────────────────────────────────────
const NAVY = "#0F172A";
const TEAL = "#0F766E";
const TEAL_L = "#14B8A6";
const AMBER = "#D4A017";
const MUTED = "#64748B";
const BORDER = "#E2E8F0";
const OFF = "#F8FAFC";

const authUrl = import.meta.env.VITE_AUTH_URL;



export default function HomePage() 
{
  const [notificationApi, contextHolder] = notification.useNotification();
  const { accountState, dispatchAccountState } = useAccount();
  const [searchParams] = useSearchParams();
  const accountStateString = searchParams.get("state");

  useEffect(() => {
    if (!accountStateString) {
      if (!authUrl) {
        console.error("VITE_AUTH_URL is not set");
        return;
      }
      window.location.href = authUrl;
      return;
    } else {
      const receivedAccountState: AccountState = JSON.parse(accountStateString);
      console.log("Received account state:", receivedAccountState);
      dispatchAccountState({ type: "FETCH_SUCCESS", payload: receivedAccountState });
      getMembershipStatus(
        receivedAccountState.accountDetails?.userDetails?.id as number,
        receivedAccountState.accountDetails?.token as string
      );
    }
  }, []);

  const getMembershipStatus = async (userId: number, token?: string) => {
    try 
    {
      if (!token) {
        console.warn("No token available for membership request, skipping call.");
        return;
      }
      const response = await membershipApi.getAllMemberships(userId,token);
      console.log("Memberships:", response);
    } 
    catch (error:any) 
    {
        handleApiError(error,notificationApi);
    }
  }

  

  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {contextHolder}
      <p>Home page</p>

    </div>
  );
}
