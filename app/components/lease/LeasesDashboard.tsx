import { useEffect, useState } from "react";
import { Button, Card, Col, Descriptions, Drawer, Row, Space, Spin, Typography, notification, Modal, Form, Input, InputNumber, Select, Tag, Flex } from "antd";
const { Meta } = Card;
import { CalendarOutlined, DollarOutlined, FieldTimeOutlined, MoreOutlined, PlusCircleFilled, PlusOutlined, RightOutlined, UserOutlined } from "@ant-design/icons";
import { useOutletContext } from "react-router-dom";
import { leaseApi } from "../../api/api";
import { LeaseCreateDTO, LeaseDetailsDTO, LeaseStatus } from "../../models/lease";
import { useAccount } from "../../store/account/AccountContext";

const { Title, Text } = Typography;



export default function LeasesDashboard() {
  const [loading, setLoading] = useState(false);
  const [leases, setLeases] = useState<LeaseDetailsDTO[]>([]);
  const [leasesLoading, setLeasesLoading] = useState(false);
  const [createVisible, setCreateVisible] = useState(false);
  const [displayCount, setDisplayCount] = useState<number>(5);
  const [selectedLease, setSelectedLease] = useState<LeaseDetailsDTO | null>(null);
  const [leaseForm] = Form.useForm<LeaseCreateDTO>();
  const [notificationApi, contextHolder] = notification.useNotification();
  const { accountState } = useAccount();
  const { rentalProfileId } = useOutletContext<{ rentalProfileId: number }>();
  const token = accountState.accountDetails?.token ?? "";

  const loadLeases = async () => {
    if (!token || Number.isNaN(rentalProfileId)) {
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
    loadLeases();
  }, [rentalProfileId, accountState.accountDetails?.token]);

  const loadMore = () => setDisplayCount((c) => c + 5);



  const handleCreateLease = async (values: LeaseCreateDTO) => 
  {
    if (!token || Number.isNaN(rentalProfileId)) {
      notificationApi.error({
        message: "Authentication Required",
        description: "Please sign in again to create a lease.",
      });
      return;
    }

    try 
    {
      const newLease: LeaseCreateDTO = {
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


  return (
    <div style={{ padding: 24 }}>
      {contextHolder}

      <Card style={{ marginTop: 24 }}>
          <Row justify="space-between" align="middle">
              <Col>
                  <Title level={5}>Leases</Title>
              </Col>
              <Col>
                  <Button type="primary" onClick={() => setCreateVisible(true)}><PlusOutlined /> Create Lease</Button>
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
                      title={
                          <Tag color={lease.status === LeaseStatus.ACTIVE ? "green" : lease.status === LeaseStatus.PENDING ? "orange" : lease.status === LeaseStatus.ENDED ? "blue" : lease.status === LeaseStatus.TERMINATED ? "red" : "default"}>
                            {lease.status}
                          </Tag>
                        }
                      style={{ height: '100%' }}
                      extra={<MoreOutlined onClick={() => setSelectedLease(lease)} />}
                    >
                      <Meta
                        title={<Text strong>{lease.tenant?.firstName && lease.tenant?.lastName ? `${lease.tenant.firstName} ${lease.tenant.lastName}` : "No Tenant Assigned"}</Text>}
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

      {/* Lease Details Drawer */}
      <Drawer
        title={selectedLease ? `Lease Details - ${selectedLease.referenceNumber ?? "No Reference"}` : "Lease Details"}
        placement="right"
        width={720}
        open={!!selectedLease}
        onClose={() => setSelectedLease(null)}
        extra={<Button onClick={() => setSelectedLease(null)}>Close</Button>}
      >
        {selectedLease && (
          <>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Card 
                  variant="borderless"
                  title="Tenant" 
                  style={{ marginBottom: 16 }}>
                  <Meta
                    avatar={<UserOutlined style={{ fontSize: '25px' }} />}
                    title={selectedLease.tenant?.firstName && selectedLease.tenant?.lastName ? `${selectedLease.tenant.firstName} ${selectedLease.tenant.lastName}` : "No Tenant Assigned"}
                    description={`${selectedLease.tenant?.email ?? "No Email Provided"} | ${selectedLease.tenant?.phoneNumber ?? "No Phone Provided"}`}
                  />
                </Card>
              </Col>

              {/* <Col span={24}>
                <Card size="small" title="Property" style={{ marginBottom: 16 }}>
                  <Descriptions column={1} size="small">
                    <Descriptions.Item label="Unit ID">{selectedLease.unitId ?? "Not assigned"}</Descriptions.Item>
                    <Descriptions.Item label="Property">{selectedLease.unitId ? `Unit ${selectedLease.unitId}` : "No property linked"}</Descriptions.Item>
                    <Descriptions.Item label="Rental Profile ID">{selectedLease.rentalProfileId ?? rentalProfileId}</Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col> */}

              <Col span={24}>
                <Card 
                    variant="borderless"
                    title="Lease Terms" 
                    style={{ marginBottom: 16 }}
                >
                  <Flex vertical gap={8}>

                    <Flex justify="space-between">
                      <Meta 
                        avatar={
                            <CalendarOutlined
                              style={{ color: '#14b8a6' }} 
                            />
                        }
                        title={<Text strong>Start Date:</Text>}
                      />
                  
                      <Text>{selectedLease.startDate}</Text>
                    </Flex>

                    <Flex justify="space-between">
                      <Meta 
                        avatar={
                            <CalendarOutlined
                              style={{ color: 'red' }} 
                            />
                        }
                        title={<Text strong>End Date:</Text>}
                      />
                      <Text>{selectedLease.endDate}</Text>
                    </Flex>

                    <Flex justify="space-between">
                      <Meta 
                        avatar={
                            <DollarOutlined
                              style={{ color: '#14b8a6' }} 
                            />
                        }
                        title={<Text strong>Rent Amount:</Text>}
                      />
                      <Text>{selectedLease.rentAmount} {selectedLease.currency}</Text>
                    </Flex>

                    <Flex justify="space-between">
                      <Meta 
                        avatar={
                            <FieldTimeOutlined
                              style={{ color: '#14b8a6' }} 
                            />
                        }
                        title={<Text strong>Rent Period:</Text>}
                      />
                      <Text>{selectedLease.rentPeriod ?? "Not specified"}</Text>
                    </Flex>

                  </Flex>
                </Card>
              </Col>

              <Col span={24}>
                <Card 
                    variant="borderless"
                    title="Financials Summary" 
                    style={{ marginBottom: 16 }}
                >
                  <Flex vertical gap={8}>
                    <Flex justify="space-between">
                      <Meta 
                        avatar={
                            <FieldTimeOutlined
                              style={{ color: '#14b8a6' }} 
                            />
                        }
                        title={<Text strong>Payment Period:</Text>}
                      />
                      <Text>{selectedLease.paymentPeriod ?? "Not specified"}</Text>
                    </Flex>

                    <Flex justify="space-between">
                      <Meta 
                        avatar={
                            <DollarOutlined
                              style={{ color: '#14b8a6' }} 
                            />
                        }
                        title={<Text strong>Amount To Pay:</Text>}
                      />
                      <Text>{selectedLease.paymentAmount} {selectedLease.currency}</Text>
                    </Flex>

                    <Flex justify="space-between">
                      <Meta 
                        avatar={
                            <DollarOutlined
                              style={{ color: '#14b8a6' }} 
                            />
                        }
                        title={<Text strong>Amount Paid:</Text>}
                      />
                      <Text>{selectedLease.amountPaid ?? 0} {selectedLease.currency}</Text>
                    </Flex>

                    <Flex justify="space-between">
                      <Meta 
                        avatar={
                            <DollarOutlined
                              style={{ color: 'red' }} 
                            />
                        }
                        title={<Text strong>Balance:</Text>}
                      />
                      <Text>{selectedLease.balance ?? selectedLease.rentAmount} {selectedLease.currency}</Text>
                    </Flex>

                  </Flex>
                </Card>
              </Col>

          
            </Row>
          </>
        )}
      </Drawer>

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
