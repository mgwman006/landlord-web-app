
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

const authUrl = import.meta.env.VITE_AUTH_URL;



export default function HomePage() 
{
  const [searchParams] = useSearchParams();
  const accountStateString = searchParams.get("state");
  const [notificationApi, contextHolder] = notification.useNotification();
  const { accountState, dispatchAccountState } = useAccount();
  const [memberships, setMemberships] = useState<MembershipDetailsDTO[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async (rentalProfileData: any) => {
    setIsModalOpen(false);
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

  const handleCancel = () => {
    setIsModalOpen(false);
  };


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
    }
  }, []);

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
        <Card style={{ margin: "20px", textAlign: "center" }}>
          <Title level={4}>No Rental Profiles Found</Title>
          <Paragraph>You currently do not have any rental profiles associated with your account.</Paragraph>
          <Button type="primary" onClick={showModal}>
            Create Rental Profile
          </Button>

          <Modal
            title="Create Rental Profile"
            closable={{ 'aria-label': 'Custom Close Button' }}
            open={isModalOpen}
            onCancel={handleCancel}
            footer={null}
          >
            <Form 
              layout="vertical"
              onFinish={(values) => {
                handleOk(values);
              }}
            >

              <Form.Item label="Category" name="category" rules={[{ required: true, message: 'Please select a category' }]}>
                <Select placeholder="Select category">
                  <Select.Option value="INDIVIDUAL">Individual</Select.Option>
                  <Select.Option value="BUSINESS">Business</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please enter the name' }]}>
                <Input placeholder="Enter Name" />
              </Form.Item>
              <Form.Item label="Business Email" name="businessEmail" rules={[{ required: true, message: 'Please enter the business email' }, { type: 'email', message: 'Please enter a valid email' }]}>
                <Input placeholder="Enter Business Email" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Form>
          
          </Modal>
        </Card>
      )
     }
    </div>

  );
}
