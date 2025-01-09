import React, { useState } from "react";
import Swal from "sweetalert2";
import { db } from "../../config/firestore";
import { addDoc, collection } from "firebase/firestore";
import { Form, Input, Button, Row, Col, DatePicker } from "antd";

const Add = ({ employees, setEmployees, setIsAdding, getEmployees }) => {
  const [formData, setFormData] = useState({
    employeeID: "",
    firstName: "",
    lastName: "",
    gender: "",
    insuranceID: "",
    academicQualifications: "",
    joiningDate: "",
    confirmationDate: "",
    servicePeriod: "",
    retirementDate: "",
    dateOfBirth: "",
    bloodGroup: "",
    contactNumber: "",
    emergencyContact: "",
    email: "",
    presentAddress: "",
    permanentAddress: "",
    nid: "",
    employeeStatus: "",
    employeeGrade: "",
    designation: "",
    department: "",
    itNonIt: "",
    certificateVerification: "",
    disciplinaryAction: "",
    eTIN: "",
    salaryAccountNumber: "",
    employeeType: "",
    jobLocation: "",
    basicSalary: "",
    houseRent: "",
    medicalAllowance: "",
    conveyance: "",
    carAllowance: "",
    grossSalaryWithCar: "",
    grossSalaryWithoutCar: "",
    providentFundContribution: "",
    totalPF2022: "",
    lengthOfService: "",
    estimatedGratuity: "",
    loanHistory: "",
    arrearSalary: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (name, date) => {
    setFormData({ ...formData, [name]: date ? date.format("YYYY-MM-DD") : "" });
  };

  const handleAdd = async () => {
    const isEmptyField = Object.values(formData).some((field) => field === "");

    if (isEmptyField) {
      return Swal.fire({
        icon: "error",
        title: "Error!",
        text: "All fields are required.",
        showConfirmButton: true,
      });
    }

    try {
      await addDoc(collection(db, "employees"), { ...formData });
      employees.push(formData);
      setEmployees(employees);
      setIsAdding(false);
      getEmployees();

      Swal.fire({
        icon: "success",
        title: "Added!",
        text: `${formData.firstName} ${formData.lastName}'s data has been Added.`,
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "An error occurred while adding the employee.",
        showConfirmButton: true,
      });
    }
  };

  return (
    <div className="medium-container">
      <Row
        justify="space-between"
        align="middle"
        style={{ marginBottom: "16px" }}
      >
        <Col>
          <h1>Add Employee</h1>
        </Col>
        <Col>
          <Button type="primary" htmlType="submit" onClick={handleAdd}>
            Save Employee
          </Button>
        </Col>
      </Row>

      <Form layout="vertical">
        <Row gutter={[16, 16]}>
          {Object.keys(formData).map((key) => (
            <Col span={8} key={key}>
              {key.toLowerCase().includes("date") ? (
                <Form.Item
                  label={key.replace(/([A-Z])/g, " $1").toUpperCase()}
                  name={key}
                  rules={[{ required: true, message: `Please select ${key}` }]}
                  style={{ width: "100%" }}
                >
                  <DatePicker
                    style={{ width: "100%", height: "47px" }}
                    format="YYYY-MM-DD"
                    onChange={(date) => handleDateChange(key, date)}
                  />
                </Form.Item>
              ) : (
                <Form.Item
                  label={key.replace(/([A-Z])/g, " $1").toUpperCase()}
                  name={key}
                  rules={[{ required: true, message: `Please enter ${key}` }]}
                  style={{ width: "100%" }}
                >
                  <Input
                    name={key}
                    value={formData[key]}
                    onChange={handleChange}
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              )}
            </Col>
          ))}
        </Row>
      </Form>
    </div>
  );
};

export default Add;
