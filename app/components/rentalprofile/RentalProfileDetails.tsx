import { useEffect, useState } from "react";
import { Avatar, Button, Card, Col, Row, Space, Spin, Typography, notification, Modal, Form, Input, InputNumber, Select, Tag } from "antd";
const { Meta } = Card;
import { ArrowLeftOutlined, RightOutlined } from "@ant-design/icons";
import { RentalProfileDetailsDTO, RentalUnitDetailsDTO } from "../../models/rentalprofile";
import { leaseApi, rentalProfileApi } from "../../api/api";
import { LeaseDTO, CreateLeaseDTO } from "../../models/lease";
import Ribbon from "antd/es/badge/Ribbon";

const { Title, Text } = Typography;

type RentalProfileDetailsProps = {
  rentalProfileId: number;
  token: string | null;
  onBack: () => void;
};

export default function RentalProfileDetails({ rentalProfileId, token, onBack }: RentalProfileDetailsProps) {
  const [profile, setProfile] = useState<RentalProfileDetailsDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [leases, setLeases] = useState<LeaseDTO[]>([]);
  const [leasesLoading, setLeasesLoading] = useState(false);
  const [createVisible, setCreateVisible] = useState(false);
  const [displayCount, setDisplayCount] = useState<number>(5);
  const [leaseForm] = Form.useForm<CreateLeaseDTO>();
  const [notificationApi, contextHolder] = notification.useNotification();

  const loadProfile = async () => 
    {
    if (!token) {
      notificationApi.error({
        message: "Authentication Required",
        description: "Please sign in again to load rental profile details.",
      });
      return;
    }

    setLoading(true);
    try {
      const data = await rentalProfileApi.getRentalProfileDetails(rentalProfileId, token);
      setProfile(data);
    } catch (error: any) {
      notificationApi.error({
        message: "Failed to load profile",
        description: error?.message ?? "Unable to fetch rental profile details.",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadLeases = async () => {
    if (!token) {
      return;
    }

    setLeasesLoading(true);
    try {
      const data = await leaseApi.getLeasesByRentalProfile(rentalProfileId, token);
      setLeases(data);
    } catch (error: any) {
      notificationApi.error({ message: "Failed to load leases", description: error?.message ?? "" });
    } finally {
      setLeasesLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
    loadLeases();
  }, [rentalProfileId, token]);

  const loadMore = () => setDisplayCount((c) => c + 5);



  const handleCreateLease = async (values: CreateLeaseDTO) => 
  {
    if (!token) {
      notificationApi.error({
        message: "Authentication Required",
        description: "Please sign in again to create a lease.",
      });
      return;
    }

    try 
    {
      const newLease: CreateLeaseDTO = {
        ...values,
        rentalProfileId: rentalProfileId,
      };

      const response = await leaseApi.createLease(newLease, token);

      notificationApi.success({
        message: "Lease Created",
        description: "The lease has been successfully created.",
      });
      setCreateVisible(false);
      loadLeases(); // Refresh the leases list
    } catch (error: any) {
      notificationApi.error({
        message: "Failed to create lease",
        description: error?.message ?? "Unable to create lease.",
      });
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", paddingTop: 50 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={{ textAlign: "center", paddingTop: 50 }}>
        <Text type="danger">Failed to load rental profile details.</Text>
      </div>
    );
  }


  return (
    <div style={{ padding: 24 }}>
      {contextHolder}
      <Card>
        <Row justify="space-between" align="middle">
          <Col>
            <Space>
              <Button icon={<ArrowLeftOutlined />} onClick={onBack} />
              <Title level={4} style={{ margin: 0 }}>
                {profile ? `${profile.name}` : "No Profile Name"} {profile ? (profile.email) : ""}
              </Title>
            </Space>
          </Col>
        </Row>
      </Card>

      <Card style={{ marginTop: 24 }}>
          <Row justify="space-between" align="middle">
              <Col>
                  <Title level={5}>Leases</Title>
              </Col>
              <Col>
                  <Button type="primary" onClick={() => setCreateVisible(true)}>Create Lease</Button>
              </Col>
          </Row>

          <div style={{ marginTop: 16 }}>
            {leasesLoading ? (
              <div style={{ textAlign: 'center', padding: 24 }}>
                <Spin />
              </div>
            ) : (
              <Row gutter={[16, 16]}>
                {leases.slice(0, displayCount).map((lease) => (
                  <Col xs={24} sm={12} md={8} lg={8} xl={8} key={lease.id}>
                    <Card
                      title={lease.referenceNumber}
                      style={{ height: '100%' }}
                      actions={[
                        <Button key="edit-lease" type="link" onClick={() => {}}>
                          View
                        </Button>,
                        <Button color="primary" key="view-lease" type="link" onClick={() => {}}>
                          Send Invite <RightOutlined />
                        </Button>
                      ]}
                      extra={<Tag color={lease.status === "ACTIVE" ? "success" : "warning"}>{lease.status}</Tag>}
                    >
                      <Meta
                        avatar={
                          <Avatar
                            size="large"
                            style={{ backgroundColor: '#1890ff' }}
                          >
                            {(lease.tenant?.name ?? lease.tenantName ?? `Lease`).charAt(0).toUpperCase()}
                          </Avatar>
                        }
                        title={<Text strong>{lease.tenant?.name ?? lease.tenantName ?? lease.referenceNumber}</Text>}
                        description={<Text type="secondary">{lease.startDate} → {lease.endDate}</Text>}
                      />
                    </Card>
                  </Col>
                ))}
              </Row>
            )}

            {displayCount < leases.length && (
              <div style={{ textAlign: 'center', marginTop: 12 }}>
                <Button onClick={loadMore}>Load more</Button>
              </div>
            )}
          </div>
      </Card>

      {/* Create Lease Modal */}
      <Modal
        title="Create Lease"
        visible={createVisible}
        onCancel={() => setCreateVisible(false)}
        footer={null}
      >
        <Form
          form={leaseForm}
          layout="vertical"
          onFinish={async (values) => {handleCreateLease(values);}}
        >
          <Form.Item
            hidden={true}
            name="rentalProfileId"
            label="Rental Profile ID"
            rules={[{ required: false, message: "Please enter the rental profile ID" }]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            hidden={true}
            name="unitId"
            label="Unit ID"
            rules={[{ required: false, message: "Please enter the unit ID" }]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            hidden={true}
            name="tenantId"
            label="Tenant ID"
            rules={[{ required: false, message: "Please enter the tenant ID" }]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="tenantFirstName"
            label="Tenant First Name"
            rules={[{ required: true, message: "Please enter the tenant's first name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="tenantLastName"
            label="Tenant Last Name"
            rules={[{ required: true, message: "Please enter the tenant's last name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="tenantPhoneNumber"
            label="Tenant Phone Number"
            rules={[{ required: true, message: "Please enter the tenant's phone number" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="startDate"
            label="Start Date"
            rules={[{ required: true, message: "Please enter the lease start date" }]}
          >
            <Input type="date"/>
          </Form.Item>

          <Form.Item
            name="endDate"
            label="End Date"
            rules={[{ required: true, message: "Please enter the lease end date" }]}
          >
            <Input type="date" />
          </Form.Item>

          <Form.Item
            name="rentAmount"
            label="Rent Amount"
            rules={[{ required: true, message: "Please enter the rent amount" }]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="currency"
            label="Currency"
            rules={[{ required: true, message: "Please enter the currency" }]}
          >
            <Select
              options={[
                { value: "TZS", label: "TZS" },
                // { value: "USD", label: "USD" },
                // { value: "EUR", label: "EUR" },
                // Add more currencies as needed
              ]}
            />
          </Form.Item>

          <Form.Item
            name="rentPeriod"
            label="Rent Period"
            rules={[{ required: true, message: "Please select the rent period" }]}
          >
            <Select
              options={[
                { value: "DAILY", label: "Daily" },
                { value: "WEEKLY", label: "Weekly" },
                { value: "MONTHLY", label: "Monthly" },
                { value: "YEARLY", label: "Yearly" },
              ]}
            />
          </Form.Item>

          <Form.Item
          >
            <Button type="primary" htmlType="submit">
              Create Lease <RightOutlined />
            </Button>
          </Form.Item>
  
        </Form>
      </Modal>
  
      
    </div>
  );
}
