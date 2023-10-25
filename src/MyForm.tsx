import {
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  Row,
  Col,
  message,
} from "antd";
import "./MyForm.css";

const { RangePicker } = DatePicker;

const MyForm = () => {
  const onFinish = (values: any) => {
    if (!values.name && !values.purchaseDate && !values.portfolio) {
      message.error("At least 1 field needs to be filled!");
      return;
    }

    console.log("Received values of form: ", values);
  };

  return (
    <Form name="website_form" onFinish={onFinish} className="custom-form">
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please input your Name!" }]}
            className="hide-required-mark"
          >
            <Input className="custom-input" placeholder="Text Only" />
          </Form.Item>

          <Form.Item
            name="purchaseDate"
            label="Purchase Date"
            rules={[
              { required: true, message: "Please select the Purchase Date!" },
            ]}
          >
            <RangePicker className="custom-date-picker" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            name="portfolio"
            label="Portfolio"
            rules={[
              { required: true, message: "Please select your Portfolio!" },
            ]}
          >
            <Select className="custom-select" placeholder="Select">
              <Select.Option value="UOL">UOL Group Limited</Select.Option>
              <Select.Option value="Cap">CapitaLand</Select.Option>
              <Select.Option value="City">
                City Developments Limited
              </Select.Option>
              <Select.Option value="Far">Far East Organization</Select.Option>
              <Select.Option value="Keppel">Keppel Land Limited</Select.Option>
              <Select.Option value="Bukit">
                Bukit Sembawang Estates Limited
              </Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button htmlType="reset" className="custom-button">
              Reset
            </Button>
            <Button type="primary" htmlType="submit" className="custom-button">
              Submit
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default MyForm;
