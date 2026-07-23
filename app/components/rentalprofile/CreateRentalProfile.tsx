import { Button, Col, Form, Input, notification, Row, Select } from "antd";
import { useAccount } from "../../store/account/AccountContext";
import { CreateRentalProfileDTO, MobileMoneyProvider, PaymentMethod, RentalProfileType } from "../../models/rentalprofile";
import { rentalProfileApi } from "../../api/api";
import { handleApiError } from "../../utilities/error-handler";

type CreateRentalProfileProps = {
  token?: string | null;
};

export default function CreateRentalProfile({ token }: CreateRentalProfileProps) {
  const [form] = Form.useForm();
  const [notificationApi, contextHolder] = notification.useNotification();
  const { accountState } = useAccount();

  const handleOk = async (rentalProfileData: any) => {
    const currentToken = token?.trim() || accountState.accountDetails?.token?.trim();

    if (!currentToken) {
      notificationApi.error({
        message: "Authentication Required",
        description: "Please sign in again to create a rental profile.",
      });
      return;
    }

    const newRentalProfile: CreateRentalProfileDTO = {
      phoneNumber: accountState.accountDetails?.phoneNumber as string,
      adminUserId: accountState.accountDetails?.userDetails?.id as number,
      type: RentalProfileType.Individual,
      name: `${accountState.accountDetails?.userDetails?.firstName ?? ""} ${accountState.accountDetails?.userDetails?.lastName ?? ""}`.trim(),
      businessEmail: null,
      rentReceivingAccounts: {
        paymentMethod: PaymentMethod.MOBILE_MONEY,
        mobileMoneyProvider: rentalProfileData.mobileMoneyProvider,
        mobileMoneyNumber: rentalProfileData.mobileMoneyNumber,
        isDefault: true,
      },
    };

    try
    {
      const response = await rentalProfileApi.createRentalProfile(newRentalProfile, currentToken);

      if(response)
      {
        notificationApi.success({
          message: "Rental Profile Created",
          description: "Your rental profile has been successfully created.",
        });
        window.location.reload();
      }
    }
    catch (error:any)
    {
      handleApiError(error,notificationApi);
    }
  };

  return (
    <Row align="middle" justify="center" style={{ minHeight: "100vh" }}>
        {contextHolder}

        <Col sm={24} md={24} lg={6} xl={6}>
           <Form
                size="large"
                name="createRentalProfileForm"
                initialValues={{ remember: true }}
                autoComplete="off"
                validateTrigger="onBlur"
                form={form}
                layout="vertical"
                onFinish={handleOk}
            >
                <Form.Item
                    name="mobileMoneyProvider"
                    label="Mobile Money Provider"
                    rules={[{ required: true, message: 'Please select your mobile money provider' }]}
                    >
                    <Select>
                        <Select.Option value={MobileMoneyProvider.MIX_BY_YAS}>Mix by Yas</Select.Option>
                        <Select.Option value={MobileMoneyProvider.MPESA}>M-Pesa</Select.Option>
                        <Select.Option value={MobileMoneyProvider.AIRTEL_MONEY}>Airtel Money</Select.Option>
                        <Select.Option value={MobileMoneyProvider.HALOPESA}>HaloPesa</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="mobileMoneyNumber"
                    label="Mobile Money Number"
                    rules={[{ required: true, message: 'Please enter your mobile money number' }]}
                    >
                    <Input />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Create Rental Profile
                    </Button>
                </Form.Item>
            </Form>
        </Col>     
    </Row>
  );
}
      