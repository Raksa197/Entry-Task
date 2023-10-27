import React, { useContext, useEffect, useRef, useState } from "react";
import type { InputRef } from "antd";
import { Form, Input, Popconfirm, Table } from "antd";
import type { FormInstance } from "antd/es/form";
import type { PaginationProps } from "antd";
import {
  Button,
  Modal,
  Select,
  DatePicker,
  Upload,
  Menu,
  Pagination,
  Spin,
  Row,
  Col,
  Alert,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import "./MyForm.css"; // Import CSS file for styling
import moment from "moment";

const { RangePicker } = DatePicker;

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
  key: string;
  name: string;
  portfolio: string;
  purchaseDate: string;
}

interface EditableRowProps {
  index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof Item;
  record: Item;
  handleSave: (record: Item) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing) {
      inputRef.current!.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();

      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 24 }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

type EditableTableProps = Parameters<typeof Table>[0];

interface DataType {
  key: React.Key;
  name: string;
  portfolio: string;
  purchaseDate: string;
}

type ColumnTypes = Exclude<EditableTableProps["columns"], undefined>;

const MyTable: React.FC = () => {
  const [dataSource, setDataSource] = useState<DataType[]>([
    {
      key: "0",
      name: "Sunsetway",
      portfolio: "UOL Group Limited",
      purchaseDate: moment("1995", "YYYY"),
    },
    {
      key: "1",
      name: "Claymore",
      portfolio: "CapitaLand",
      purchaseDate: moment("2001", "YYYY"),
    },
    {
      key: "2",
      name: "Claymore",
      portfolio: "CapitaLand",
      purchaseDate: "2001",
    },
    {
      key: "3",
      name: "Claymore",
      portfolio: "CapitaLand",
      purchaseDate: "2001",
    },
    {
      key: "4",
      name: "Claymore",
      portfolio: "CapitaLand",
      purchaseDate: "2001",
    },
    {
      key: "5",
      name: "Claymore",
      portfolio: "CapitaLand",
      purchaseDate: "2001",
    },
  ]);

  const handleDelete = (key: React.Key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
  };

  const defaultColumns: (ColumnTypes[number] & {
    editable?: boolean;
    dataIndex: string;
  })[] = [
    {
      title: "Name",
      dataIndex: "name",
      width: "30%",
      editable: true,
    },
    {
      title: "Portfolio",
      dataIndex: "portfolio",
    },
    {
      title: "Purchase Date",
      dataIndex: "purchaseDate",
      render: (_, record) => {
        const purchaseDate = new Date(record.purchaseDate);
        return purchaseDate.getFullYear();
      },
    },
    {
      title: "Action",
      dataIndex: "Action",
      render: (_, record: { key: React.Key }) =>
        dataSource.length >= 1 ? (
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => handleDelete(record.key)}
          >
            <a>Delete</a>
          </Popconfirm>
        ) : null,
    },
  ];

  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(false);
  const [currentMenu, setCurrentMenu] = useState("single");
  const [form] = Form.useForm();

  const showModal = () => {
    setVisible(true);
  };

  const handleOk = () => {
    setVisible(false);
    form.validateFields().then((values) => {
      const { name, portfolio, purchaseDate } = values;
      const newPerson = { key: count, name, portfolio, purchaseDate };

      let hasFilledField = false;
      for (const value of Object.values(newPerson)) {
        if (value === undefined || value === "") {
          hasFilledField = true;
          break;
        }
      }

      if (hasFilledField) {
        // If no field is filled, display the error message
        message.error("At least 1 field needs to be filled");
        return;
      }

      const currentDate = new Date();
      const entryDate = new Date(newPerson.purchaseDate);
      const diffYears = currentDate.getFullYear() - entryDate.getFullYear();

      if (diffYears > 50) {
        message.error("Entry Date shouldn't be longer than 50 years");
        return;
      }

      form.resetFields();
      setDataSource([...dataSource, newPerson]);
      setCount(count + 1);
      setVisible(false);
      message.success("Create Success");
    });
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleClick = (e) => {
    setCurrentMenu(e.key);
  };

  const handleSave = (row: DataType) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async (pageNumber) => {
    const response = await fetch(
      `https://your-api-url.com/data?page=${pageNumber}`,
    );
    const data = await response.json();
    return data;
  };

  const onChange = async (pageNumber: number) => {
    setIsLoading(true);
    setCurrentPage(pageNumber);

    // Fetch the data for the new page here
    try {
      const newData = await fetchData(pageNumber); // replace this with your actual data fetching function
      setDataSource(newData);
    } catch (error) {
      console.error(error);
      // handle error appropriately
    }

    setIsLoading(false);
  };

  const [isFiltering, setIsFiltering] = useState(false); // Store the filter state
  const [filteredData, setFilteredData] = useState(dataSource); // Store the filtered data
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const onFinish = (values) => {
    const { name, portfolio, purchaseDate } = values;

    const filtered = dataSource.filter((item) => {
      const nameMatch =
        !name || item.name.toLowerCase().includes(name.toLowerCase());
      const portfolioMatch =
        !portfolio ||
        item.portfolio.toLowerCase().includes(portfolio.toLowerCase());
      const purchaseDateMatch =
        !purchaseDate ||
        (item.purchaseDate >= startDate && item.purchaseDate <= endDate);

      return nameMatch && portfolioMatch && purchaseDateMatch;
    });

    setCurrentPage(1); // Reset the current page to 1
    setFilteredData(filtered); // Update the filtered data state
    setIsFiltering(true); // Set isFiltering to true to display the filtered data
  };

  const handleReset = () => {
    form.resetFields(); // Reset the form fields
    setCurrentPage(1); // Reset the current page to 1
    setFilteredData(dataSource); // Show the normal data before filtering
    setIsFiltering(false); // Set isFiltering to false to display the original data
  };

  return (
    <div>
      <div>
        <Form
          name="website_form"
          onFinish={onFinish}
          onReset={handleReset}
          className="custom-form"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Name"
                className="hide-required-mark"
              >
                <Input className="custom-input" placeholder="Text Only" />
              </Form.Item>

              <Form.Item name="purchaseDate" label="Purchase Date">
                <RangePicker
                  className="custom-date-picker"
                  onChange={(dates) => {
                    setStartDate(dates[0]);
                    setEndDate(dates[1]);
                  }}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name="portfolio" label="Portfolio">
                <Select className="custom-select" placeholder="Select">
                  <Select.Option value="UOL">UOL Group Limited</Select.Option>
                  <Select.Option value="Cap">CapitaLand</Select.Option>
                  <Select.Option value="City">
                    City Developments Limited
                  </Select.Option>
                  <Select.Option value="Far">
                    Far East Organization
                  </Select.Option>
                  <Select.Option value="Keppel">
                    Keppel Land Limited
                  </Select.Option>
                  <Select.Option value="Bukit">
                    Bukit Sembawang Estates Limited
                  </Select.Option>
                </Select>
              </Form.Item>

              <Form.Item>
                <Button htmlType="reset" className="custom-button">
                  Reset
                </Button>
                <Button htmlType="reset" className="custom-button">
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="custom-button"
                >
                  Submit
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
      <div>
        <Button
          type="primary"
          className="create-button"
          onClick={() => {
            setIsFiltering(false); // Set isFiltering to false when creating a new row
            showModal();
          }}
        >
          Create
        </Button>
        <br />
        <br />

        <Modal
          title="Create Person"
          visible={visible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <Menu
            onClick={handleClick}
            selectedKeys={[currentMenu]}
            mode="horizontal"
          >
            <Menu.Item key="single">Single Create</Menu.Item>
            <Menu.Item key="mass">Mass Create</Menu.Item>
          </Menu>
          {currentMenu === "single" && (
            <Form form={form} layout="vertical" style={{ marginLeft: 15 }}>
              <Form.Item
                name="name"
                label="Name"
                className="single-create"
                style={{ marginTop: 10 }}
              >
                <Input placeholder="String Only" />
              </Form.Item>
              <Form.Item name="portfolio" label="Portfolio">
                <Select placeholder="Select">
                  <Select.Option value="UOL Group Limited">
                    UOL Group Limited
                  </Select.Option>
                  <Select.Option value="CapitaLand">CapitaLand</Select.Option>
                  <Select.Option value="City Developments Limited">
                    City Developments Limited
                  </Select.Option>
                  <Select.Option value="Far East Organization">
                    Far East Organization
                  </Select.Option>
                  <Select.Option value="Keppel Land Limited">
                    Keppel Land Limited
                  </Select.Option>
                  <Select.Option value="Bukit Sembawang Estates Limited">
                    Bukit Sembawang Estates Limited
                  </Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="purchaseDate" label="Purchase Date">
                <DatePicker placeholder="Date" />
              </Form.Item>
            </Form>
          )}
          {currentMenu === "mass" && (
            <Upload.Dragger
              name="file"
              style={{ marginTop: "20px", marginBottom: "16px" }}
            >
              <p className="ant-upload-drag-icon">
                <UploadOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drop files here to upload
              </p>
            </Upload.Dragger>
          )}
        </Modal>

        <Spin spinning={isLoading} delay={5} size="large">
          <Table
            components={components}
            rowClassName={() => "editable-row"}
            dataSource={isFiltering ? filteredData : dataSource} // Use filteredData only when isFiltering is true
            columns={columns as ColumnTypes}
            loading={isLoading}
            pagination={
              {
                currentPage,
                total: filteredData.length,
                pageSize: 4,
                showSizeChanger: true,
                pageSizeOptions: ["4", "8"],
                showQuickJumper: true,
                onChange,
              } as PaginationProps
            }
          />
        </Spin>
      </div>
    </div>
  );
};

export default MyTable;
