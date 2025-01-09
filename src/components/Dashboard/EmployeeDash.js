import React, { useState, useEffect } from "react";
import { Layout, Card, Row, Col, Typography, Spin } from "antd";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { UserOutlined, TeamOutlined } from "@ant-design/icons";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firestore";

const { Content } = Layout;
const { Title, Text } = Typography;

const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const EmployeeDash = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch employees from Firebase
  const fetchEmployees = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "employees"));
      const employeesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEmployees(employeesData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching employees: ", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Process data for the pie chart
  const processPieData = () => {
    const departmentCounts = employees.reduce((acc, employee) => {
      const department = employee.department || "Employees";
      acc[department] = (acc[department] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(departmentCounts).map(([name, value]) => ({
      name,
      value,
    }));
  };

  const pieData = processPieData();

  return (
    <Layout style={{ padding: "24px", backgroundColor: "#f0f2f5" }}>
      <Content>
        <Title level={3} style={{ marginBottom: "24px" }}>
          Employee Management Overview
        </Title>

        {loading ? (
          <Spin size="large" />
        ) : (
          <>
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Card>
                  <Row align="middle">
                    <Col span={6}>
                      <UserOutlined style={{ fontSize: "48px", color: "#1890ff" }} />
                    </Col>
                    <Col span={18}>
                      <Text>Total Employees</Text>
                      <Title level={2}>{employees.length}</Title>
                    </Col>
                  </Row>
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <Row align="middle">
                    <Col span={6}>
                      <TeamOutlined style={{ fontSize: "48px", color: "#52c41a" }} />
                    </Col>
                    <Col span={18}>
                      <Text>Departments</Text>
                      <Title level={2}>
                        {new Set(employees.map((e) => e.department || "Unknown")).size}
                      </Title>
                    </Col>
                  </Row>
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <Row align="middle">
                    <Col span={6}>
                      <UserOutlined style={{ fontSize: "48px", color: "#faad14" }} />
                    </Col>
                    <Col span={18}>
                      <Text>New Employees (Last Month)</Text>
                      <Title level={2}>
                        {
                          employees.filter((e) => {
                            const joiningDate = new Date(e.joiningDate);
                            const now = new Date();
                            return (
                              joiningDate.getMonth() === now.getMonth() - 1 &&
                              joiningDate.getFullYear() === now.getFullYear()
                            );
                          }).length
                        }
                      </Title>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>

            {/* Pie Chart Section */}
            <Card style={{ marginTop: "24px" }}>
              <Title level={4} style={{ textAlign: "center" }}>
                Employee Distribution by Department
              </Title>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </>
        )}
      </Content>
    </Layout>
  );
};

export default EmployeeDash;
