import { Button, Card, Col, Descriptions, Drawer, Row, Space, Spin, Typography, notification, Modal, Form, Input, InputNumber, Select, Tag, Flex, Listy } from "antd";
const { Meta } = Card;
import { Outlet, useOutletContext } from "react-router-dom";



export default function LeasesDashboard() {
  

  const { rentalProfileId } = useOutletContext<{ rentalProfileId: number }>();

  return (
    <div style={{ padding: 24 }}>
      <Outlet context={{ rentalProfileId }} />
    </div>
  );
}
