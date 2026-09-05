import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useAccount } from "../../store/account/AccountContext";
import { Button, Card, Col, Row, Space,notification } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Typography } from "antd";
import { RentalProfileDetailsDTO } from "../../models/rentalprofile";
import { rentalProfileApi } from "../../api/api";


export default function RentalProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { accountState } = useAccount();
  const [notificationApi, contextHolder] = notification.useNotification();
  const [profile, setProfile] = useState<RentalProfileDetailsDTO | null>(null);
  const [token, setToken] = useState<string | null>(accountState.accountDetails?.token ?? null);


  const rentalProfileId = id ? parseInt(id, 10) : NaN;

  if (isNaN(rentalProfileId)) {
    return <div>Invalid rental profile id</div>;
  }

  const loadProfile = async () => 
    {
    if (!token) {
      notificationApi.error({
        message: "Authentication Required",
        description: "Please sign in again to load rental profile details.",
      });
      return;
    }

    try {
      const data = await rentalProfileApi.getRentalProfileDetails(rentalProfileId, token);
      setProfile(data);
    } catch (error: any) {
      notificationApi.error({
        message: "Failed to load profile",
        description: error?.message ?? "Unable to fetch rental profile details.",
      });
    } finally {
    }
  };

  useEffect(() => {
    loadProfile();
  }, [rentalProfileId, token]);

  return (
    <div style={{ padding: 24 }}>
      {contextHolder}
      <Card>
        <Row justify="space-between" align="middle">
          <Col>
            <Space>
              <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} />
              <Typography.Title level={4} style={{ margin: 0 }}>
                {profile ? `${profile.name}` : "No Profile Name"}
              </Typography.Title>
            </Space>
          </Col>
        </Row>
      </Card>

      <Outlet context={{ rentalProfileId }} />
    </div>
  );
    
}
