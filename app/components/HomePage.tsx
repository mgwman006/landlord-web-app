
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

export default function HomePage() 
{
  const [searchParams] = useSearchParams();
  const accountStateString = searchParams.get("state");
  const [notificationApi, contextHolder] = notification.useNotification();
  const { accountState, dispatchAccountState } = useAccount();
  const [memberships, setMemberships] = useState<MembershipDetailsDTO[]>([]);
  const [form] = Form.useForm();



  const handleOk = async (rentalProfileData: any) => {
    const newRentalProfile: CreateRentalProfileDTO = {
      adminUserId: accountState.accountDetails?.userDetails?.id as number,
      type: rentalProfileData.category,
      name: rentalProfileData.name,
      businessEmail: rentalProfileData.businessEmail
    };

    try
    {
      console.log("token:", accountState.accountDetails?.token);
      const response = await rentalProfileApi.createRentalProfile(newRentalProfile, accountState.accountDetails?.token as string);

      if(response)
      {
        getMembershipStatus(
          accountState.accountDetails?.userDetails?.id as number,
          accountState.accountDetails?.token as string
        );
        console.log("Rental Profile Created:", response);
        notificationApi.success({
          message: "Rental Profile Created",
          description: "Your rental profile has been successfully created.",
        });
      }
    }
    catch (error:any)
    {
      handleApiError(error,notificationApi);
    }
  };

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
    if (accountState.accountDetails) {
      return;
    }

    if (accountStateString) {
      try {
        const receivedAccountState: AccountState = JSON.parse(accountStateString);
        const details = receivedAccountState.accountDetails;
        if (!details) {
          console.error("Account state payload is missing accountDetails");
          return;
        }
        dispatchAccountState({ type: "FETCH_SUCCESS", payload: details });
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
      return;
    }

    if (!authUrl) {
      console.info("VITE_AUTH_URL is not set; skipping redirect.");
      return;
    }

    try {
      const targetUrl = new URL(authUrl, window.location.origin);
      if (targetUrl.origin === window.location.origin) {
        console.warn("Auth URL resolves to the current app origin; skipping redirect to avoid a refresh loop.");
        return;
      }
      window.location.href = authUrl;
    } catch (error) {
      console.error("Invalid auth URL", error);
    }
  }, [accountState.accountDetails, accountStateString, authUrl, dispatchAccountState, form]);

 

  

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
        <Row align="middle" justify="center" style={{ minHeight: "100vh" }}>
          <Col sm={24} md={24} lg={6} xl={6}>
            <Title level={4}>Confirm your Mobile money payment number</Title>
            <Form 
                size="large"
                form={form}
                layout="vertical"
                onFinish={(values) => {handleOk(values);}}
              >
                <Form.Item name="phoneNumber" rules={[{ required: true, message: 'Please enter the phone number' }]}>
                  <Input 
                    type="tel" 
                    placeholder="Enter Phone Number" 
                  />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Confirm <ArrowRightOutlined />
                  </Button>
                </Form.Item>
              </Form>
          </Col>
          
         
        </Row>
      )
     }
    </div>

  );
}
