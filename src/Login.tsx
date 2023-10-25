import React, { useState } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input } from "antd";
import "./Login.css";

interface LoginProps {
  onAuthentication: () => void; // Callback function to handle authentication
}

const Login: React.FC<LoginProps> = ({ onAuthentication }) => {
  const [error, setError] = useState<string | null>(null);

  const onFinish = (values: any) => {
    const { username, password } = values;

    // Perform simple mockup authentication
    if (username === "admin" && password === "password") {
      // Authentication successful
      setError(null);
      onAuthentication();
    } else {
      // Authentication failed
      setError("Invalid username or password");
    }
  };

  return (
    <div className="background-image">
      <div className="center-container">
        <div className="card">
          <h1 className="title">Login</h1>
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: "Please input your Username!" },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Username"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your Password!" },
              ]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>
            {error && <p className="error-message">{error}</p>}
            <Form.Item>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>

              <a className="login-form-forgot" href="">
                Forgot password
              </a>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
                Log in
              </Button>
              Or <a href="">register now!</a>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
