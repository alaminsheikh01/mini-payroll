import React, { useState, useEffect } from "react";
import { Layout, Menu } from "antd";
import {
  UserAddOutlined,
  TableOutlined,
  LogoutOutlined,
  AppstoreAddOutlined,
} from "@ant-design/icons";
import Swal from "sweetalert2";

import Table from "./Table";
import Add from "./Add";
import BulkAdd from "./BulkAdd";
import Edit from "./Edit";
import { db } from "../../config/firestore";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";

const { Sider, Content } = Layout;

const Dashboard = ({ setIsAuthenticated }) => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [activeTab, setActiveTab] = useState("table");
  const [isEditing, setIsEditing] = useState(false);

  const getEmployees = async () => {
    const querySnapshot = await getDocs(collection(db, "employees"));
    const employees = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setEmployees(employees);
  };

  useEffect(() => {
    getEmployees();
  }, []);

  const handleEdit = (id) => {
    const [employee] = employees.filter((employee) => employee.id === id);
    setSelectedEmployee(employee);
    setActiveTab("edit"); // Change to "edit" tab for rendering the Edit component
  };

  const handleDelete = (id) => {
    Swal.fire({
      icon: "warning",
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      customClass: {
        confirmButton: "swal-confirm-button",
        cancelButton: "swal-cancel-button",
      },
    }).then((result) => {
      if (result.value) {
        const [employee] = employees.filter((employee) => employee.id === id);

        deleteDoc(doc(db, "employees", id));

        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: `${employee.firstName} ${employee.lastName}'s data has been deleted.`,
          showConfirmButton: false,
          timer: 1500,
        });

        const employeesCopy = employees.filter(
          (employee) => employee.id !== id
        );
        setEmployees(employeesCopy);
      }
    });
  };

  const handleLogout = () => {
    Swal.fire({
      icon: "warning",
      title: "Are you sure you want to logout?",
      showCancelButton: true,
      confirmButtonText: "Yes, logout!",
      cancelButtonText: "No, cancel!",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      customClass: {
        confirmButton: "swal-confirm-button",
        cancelButton: "swal-cancel-button",
      },
    }).then((result) => {
      if (result.value) {
        setIsAuthenticated(false);
        Swal.fire({
          icon: "success",
          title: "Logged out!",
          text: "You have been logged out successfully.",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  };

  return (
    <Layout style={{ height: "100vh", overflow: "hidden" }}>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        style={{
          backgroundColor: "#001529",
          position: "fixed",
          height: "100vh",
          left: 0,
        }}
      >
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["table"]}
          onClick={({ key }) => {
            setActiveTab(key);
            if (key === "add") setIsAdding(true);
          }}
        >
          <Menu.Item key="table" icon={<TableOutlined />}>
            Employee Table
          </Menu.Item>
          <Menu.Item key="add" icon={<UserAddOutlined />}>
            Add Employee
          </Menu.Item>
          <Menu.Item key="bulkAdd" icon={<AppstoreAddOutlined />}>
            Bulk Add
          </Menu.Item>
          <Menu.Item
            key="logout"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
          >
            Logout
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout style={{ marginLeft: 200, height: "100vh", overflow: "auto" }}>
        <Content
          style={{ margin: "24px 16px", padding: 24}}
        >
          {activeTab === "table" && (
            <Table
              employees={employees}
              handleDelete={handleDelete}
              handleEdit={handleEdit}
            />
          )}
          {activeTab === "add" && isAdding && (
            <Add
              employees={employees}
              setEmployees={setEmployees}
              setIsAdding={setIsAdding}
              getEmployees={getEmployees}
            />
          )}
          {activeTab === "edit" && selectedEmployee && (
            <Edit
              employees={employees}
              selectedEmployee={selectedEmployee}
              setEmployees={setEmployees}
              setIsEditing={setIsEditing}
              getEmployees={getEmployees}
              setActiveTab={setActiveTab} // Pass this function
            />
          )}

          {activeTab === "bulkAdd" && (
            <BulkAdd
              employees={employees}
              setEmployees={setEmployees}
              getEmployees={getEmployees}
            />
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
