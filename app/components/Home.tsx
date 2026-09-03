import { Typography,Layout, Image, Grid, Drawer, Button, Card, Row, Divider, Col, Space, Tag, Flex } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { Outlet } from 'react-router-dom';
import { useState } from 'react';

const { Title, Text, Link } = Typography;

const { Header, Footer, Content } = Layout;
const { useBreakpoint } = Grid;

const navItems = [
  { key: 'home', label: 'Home', to: '#' },
  { key: 'properties', label: 'Properties', to: '#' },
  { key: 'tenants', label: 'Tenants', to: '#' },
  { key: 'payments', label: 'Payments', to: '#' },
];

export default function AppLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const screens = useBreakpoint();
  const isMobile = !screens.md; // <768px = mobile

  return (
    <Layout>
      <Header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          width: '100%',
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          background: '#0F172A',
          height: 64,
        }}
      >
        {/* LOGO */}
        <div style={{
          background: '#fff',
          height: 64,
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          flexShrink: 0,
        }}>
          <Image
            preview={false}
            src="/tante-logo.svg"
            width={96}          // fixed px — never grows
            height={29}         // keeps aspect ratio locked
            style={{ display: 'block' }}
          />
        </div>

        {/* DESKTOP NAV */}
        {!isMobile && (
          <nav style={{ display: 'flex', gap: 4, flex: 1, padding: '0 16px' }}>
            {navItems.map(item => (
              <Link
                key={item.key}
                href={item.to}
                style={{
                  padding: '7px 14px',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'rgba(255,255,255,0.6)',
                  textDecoration: 'none',
                  transition: 'all .15s',
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}

        {/* DESKTOP CTA BUTTONS */}
        {/* {!isMobile && (
          <div style={{ display: 'flex', gap: 8, padding: '0 24px', flexShrink: 0 }}>
            <Button ghost style={{ fontWeight: 700, fontSize: 13 }}>Log in</Button>
            <Button
              type="primary"
              style={{ background: '#0F766E', borderColor: '#0F766E', fontWeight: 700, fontSize: 13 }}
            >
              Get Started
            </Button>
          </div>
        )} */}

        {/* MOBILE HAMBURGER */}
        {isMobile && (
          <div style={{ marginLeft: 'auto', paddingRight: 16 }}>
            <Button
              type="text"
              icon={<MenuOutlined style={{ color: '#fff', fontSize: 18 }} />}
              onClick={() => setDrawerOpen(true)}
            />
          </div>
        )}
      </Header>

      {/* MOBILE DRAWER */}
      <Drawer
        title={
          <span style={{ fontWeight: 900, fontSize: 20 }}>
            <span style={{ color: '#14B8A6' }}>t</span>
            <span style={{ color: '#0F172A' }}>ante</span>
          </span>
        }
        placement="right"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        width={280}
        styles={{ body: { padding: 0 } }}
      >
        {navItems.map(item => (
          <Link
            key={item.key}
            href={item.to}
            onClick={() => setDrawerOpen(false)}
            style={{
              display: 'block',
              padding: '14px 24px',
              fontSize: 15,
              fontWeight: 600,
              color: '#0F172A',
              borderBottom: '1px solid #f1f5f9',
              textDecoration: 'none',
            }}
          >
            {item.label}
          </Link>
        ))}
        {/* <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Button block style={{ fontWeight: 700 }}>Log in</Button>
          <Button
            block
            type="primary"
            style={{ background: '#0F766E', borderColor: '#0F766E', fontWeight: 700 }}
          >
            Get Started Free →
          </Button>
        </div> */}
      </Drawer>

      <Content style={{ backgroundColor: '#fff' }}>
        <Outlet />
      </Content>

      <Footer style={{ backgroundColor: '#0F172A' }}>
       
          {/* Top Grid */}
          <Row gutter={[32, 32]}>
            {/* Brand */}
            <Col xs={24} sm={12} md={12} lg={6}>
              <Title level={2} style={{ margin: 0, color: "white" }}>
                <span style={{ color: "#14b8a6" }}>t</span>ante
              </Title>

              <Text style={{ color: "#94a3b8", display: "block", marginTop: 16 }}>
                Smart Real Estate. Better Future.
                <br />
                Built for Tanzanian property owners.
              </Text>
            </Col>

            {/* Product */}
            <Col xs={24} sm={12} md={12} lg={6}>
              <Flex vertical>
                <Text strong style={{ color: "#64748b" }}>
                  PRODUCT
                </Text>
                <Flex vertical style={{ marginTop: 10 }}>
                  <Link 
                    href="#"    
                    style={{
                      color: "#94a3b8",
                      marginTop:2
                    }}
                  >
                      Features
                  </Link>
                  <Link 
                    href="#"
                    style={{
                      color: "#94a3b8",
                      marginTop:2
                    }}
                  >
                    Pricing
                  </Link>
                  <Link 
                    href="#"
                    style={{
                      color: "#94a3b8",
                      marginTop:2
                    }}
                  >
                    Mobile App
                  </Link>
                  <Link 
                    href="#"
                    style={{
                      color: "#94a3b8",
                      marginTop:2
                    }}
                  >
                    Changelog
                  </Link>
                </Flex>
              </Flex>
            </Col>

            {/* Company */}
            <Col xs={24} sm={12} md={12} lg={6}>
              <Flex vertical>
                <Text strong style={{ color: "#64748b" }}>
                  COMPANY
                </Text>
                <Flex vertical style={{ marginTop: 10 }}>
                  <Link 
                    href="#"    
                    style={{
                      color: "#94a3b8",
                      marginTop:2
                    }}
                  >
                      Blog
                  </Link>
                  <Link 
                    href="#"
                    style={{
                      color: "#94a3b8",
                      marginTop:2
                    }}
                  >
                    Careers
                  </Link>
                  <Link 
                    href="#"
                    style={{
                      color: "#94a3b8",
                      marginTop:2
                    }}
                  >
                    Contact
                  </Link>
                </Flex>
              </Flex>
            </Col>

            {/* Legal */}
            <Col xs={24} sm={12} md={12} lg={6}>
              <Flex vertical>
                <Text strong style={{ color: "#64748b" }}>
                  LEGAL
                </Text>
                <Flex vertical style={{ marginTop: 10 }}>
                  <Link 
                    href="#"    
                    style={{
                      color: "#94a3b8",
                      marginTop:2
                    }}
                  >
                      Privacy Policy
                  </Link>
                  <Link 
                    href="#"
                    style={{
                      color: "#94a3b8",
                      marginTop:2
                    }}
                  >
                    Terms of Service
                  </Link>
                  
                </Flex>
              </Flex>
              
            </Col>
          </Row>

          {/* Bottom */}
          <Divider style={{ borderColor: "#1e293b", margin: "32px 0 24px" }} />

          <Row gutter={[16, 16]} justify="space-between" align="middle">
            <Col xs={24} md={12}>
              <Text style={{ color: "#64748b" }}>
                © 2026 tante Technologies (Pty) Ltd. All rights reserved.
              </Text>
            </Col>

            <Col xs={24} md={12}>
              <Space wrap style={{ justifyContent: "flex-end", width: "100%" }}>
                <Tag color="default">🇹🇿 Made in Tanzania</Tag>
                {/* <Tag color="cyan">POPIA Compliant</Tag> */}
              </Space>
            </Col>
          </Row>
      </Footer>
    </Layout>
  );
}