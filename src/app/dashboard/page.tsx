"use client";

import React from "react";
import { Button, Card, Row, Col, Statistic } from "antd";
import {
  LogoutOutlined,
  UserOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    router.push("/login");
  };

  return (
    <div style={{ padding: "40px" }}>
      <div
        style={{
          marginBottom: "40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>نظام الإدارة الحديث | Modern Admin System</h1>
        <Button
          type="primary"
          danger
          icon={<LogoutOutlined />}
          onClick={handleLogout}
        >
          تسجيل الخروج | Logout
        </Button>
      </div>

      <Card>
        <Row gutter={16}>
          <Col xs={24} sm={12} lg={6}>
            <Statistic
              title="المستخدمين | Users"
              value={1234}
              prefix={<UserOutlined />}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Statistic
              title="الطلبات | Requests"
              value={5678}
              prefix={<DashboardOutlined />}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Statistic
              title="الإيرادات | Revenue"
              value={93124}
              prefix="$"
              valueStyle={{ color: "#00AA64" }}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Statistic
              title="النمو | Growth"
              value={28}
              suffix="%"
              valueStyle={{ color: "#00AA64" }}
            />
          </Col>
        </Row>
      </Card>

      <Card style={{ marginTop: "20px" }}>
        <p>صفحة لوحة المعلومات قيد التطوير...</p>
        <p>Dashboard page under development...</p>
      </Card>
    </div>
  );
}
