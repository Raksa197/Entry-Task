import React, { useState } from "react";
import MyForm from "./MyForm";
import MyTable from "./MyTable";
import MyMenu from "./MyMenu";
import { Breadcrumb, Layout, theme, Avatar, Popover } from "antd";
import { MenuOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import "./App.css";

const { Header, Content, Sider } = Layout;
const Dashboard = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const [formData, setFormData] = useState(null);

  const handleFormSubmit = (values) => {
    setFormData(values);
  };

  const content = (
    <div style={{ width: 200 }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Avatar size={64} icon={<UserOutlined />} />

        <div>
          <p style={{ fontSize: "18px", marginBottom: 0 }}>My name</p>
          <p style={{ fontSize: "15px", color: "gray", marginTop: 0 }}>
            test@mpb.com
          </p>
        </div>
      </div>
      <hr />
      <div
        style={{
          fontSize: "18px",
          margin: "5px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <LogoutOutlined style={{ marginRight: "7px" }} /> Log Out
      </div>
    </div>
  );

  return (
    <Layout>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "blue",
          color: "white",
          fontSize: "1.5em",
        }}
      >
        <MenuOutlined className="menu-icon" />
        <span style={{ marginRight: "auto" }}>Property Management System</span>

        <Popover content={content} placement="bottomLeft">
          <Avatar style={{ backgroundColor: "white", color: "blue" }}>J</Avatar>
        </Popover>
      </Header>

      <Layout>
        <Sider
          width={270}
          style={{
            background: colorBgContainer,
          }}
        >
          <MyMenu />
        </Sider>
        <Content
          style={{
            padding: 24,
            margin: 0,
            minHeight: 280,
            background: colorBgContainer,
          }}
        >
          <Breadcrumb className="breadCrumb">
            <Breadcrumb.Item>System Management</Breadcrumb.Item>
            <Breadcrumb.Item>Table Page</Breadcrumb.Item>
          </Breadcrumb>
          <div>
            <p>Property Listing</p>
            <MyForm onFormSubmit={handleFormSubmit} />
          </div>
          <div>
            <MyTable formData={formData} />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};
export default Dashboard;
