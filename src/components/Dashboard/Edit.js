import React, { useState } from "react";
import Swal from "sweetalert2";
import { db } from "../../config/firestore";
import { doc, setDoc } from "firebase/firestore";
import { Spin } from "antd"; // Ant Design spinner

const Edit = ({
  employees,
  selectedEmployee,
  setEmployees,
  setIsEditing,
  getEmployees,
  setActiveTab,
}) => {
  const id = selectedEmployee.id;

  const [firstName, setFirstName] = useState(selectedEmployee.firstName);
  const [lastName, setLastName] = useState(selectedEmployee.lastName);
  const [email, setEmail] = useState(selectedEmployee.email);
  const [salary, setSalary] = useState(selectedEmployee.salary);
  const [date, setDate] = useState(selectedEmployee.date);
  const [loading, setLoading] = useState(false); // New loading state

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!firstName || !lastName || !email || !salary || !date) {
      return Swal.fire({
        icon: "error",
        title: "Error!",
        text: "All fields are required.",
        showConfirmButton: true,
      });
    }

    const employee = {
      id,
      firstName,
      lastName,
      email,
      salary,
      date,
    };

    setLoading(true); // Show spinner

    try {
      const employeeRef = doc(db, "employees", id);
      await setDoc(employeeRef, { ...employee });

      getEmployees();
      setActiveTab("table"); // Navigate back to the table view

      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: `${employee.firstName} ${employee.lastName}'s data has been updated.`,
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to update the employee data.",
        showConfirmButton: true,
      });
    } finally {
      setLoading(false); // Hide spinner
    }
  };

  return (
    <div className="small-container">
      <Spin spinning={loading}> {/* Wrap the form with Spin */}
        <form onSubmit={handleUpdate}>
          <h1>Edit Employee</h1>
          <label htmlFor="firstName">First Name</label>
          <input
            id="firstName"
            type="text"
            name="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <label htmlFor="lastName">Last Name</label>
          <input
            id="lastName"
            type="text"
            name="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="salary">Salary ($)</label>
          <input
            id="salary"
            type="number"
            name="salary"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
          />
          <label htmlFor="date">Date</label>
          <input
            id="date"
            type="date"
            name="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <div style={{ marginTop: "30px" }}>
            <input type="submit" value="Update" disabled={loading} />
            <input
              style={{ marginLeft: "12px" }}
              className="muted-button"
              type="button"
              value="Cancel"
              onClick={() => setActiveTab("table")}
              disabled={loading} // Disable cancel during loading
            />
          </div>
        </form>
      </Spin>
    </div>
  );
};

export default Edit;
