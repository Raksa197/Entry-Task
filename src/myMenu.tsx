import { PushpinOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Menu } from "antd";

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group",
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem(
    "Property Management",
    "sub1",
    <PushpinOutlined style={{ transform: "scaleX(-1)" }} />,
    [getItem("Property Listing", "1"), getItem("Lease Listing", "2")],
  ),
];

const MyMenu: React.FC = () => {
  return <Menu mode="inline" items={items} />;
};

export default MyMenu;
