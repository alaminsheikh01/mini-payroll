import React from 'react';
import { jsPDF } from 'jspdf';
import generatePayslipPDF from '../common/PDF';

const Table = ({ employees, handleEdit, handleDelete }) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: null,
  });

  const generatePDF = (employee) => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text(`Employee Details`, 20, 20);
    doc.text(`ID: ${employee.id}`, 20, 30);
    doc.text(`First Name: ${employee.firstName}`, 20, 40);
    doc.text(`Last Name: ${employee.lastName}`, 20, 50);
    doc.text(`Email: ${employee.email}`, 20, 60);
    doc.text(`Salary: ${formatter.format(employee.salary)}`, 20, 70);
    doc.text(`Date: ${employee.date}`, 20, 80);

    doc.save(`Employee_${employee.firstName}.pdf`);
  };

  return (
    <div className="contain-table">
      <table className="striped-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Salary</th>
            <th>Date</th>
            <th colSpan={3} className="text-center">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {employees.length > 0 ? (
            employees.map((employee) => (
              <tr key={employee.id}>
                <td>{employee.id}</td>
                <td>{employee.firstName}</td>
                <td>{employee.lastName}</td>
                <td>{employee.email}</td>
                <td>{formatter.format(employee.salary)}</td>
                <td>{employee.date}</td>
                <td className="text-right">
                  <button
                    onClick={() => handleEdit(employee.id)}
                    className="button muted-button"
                  >
                    Edit
                  </button>
                </td>
                <td className="text-left">
                  <button
                    onClick={() => handleDelete(employee.id)}
                    className="button muted-button"
                  >
                    Delete
                  </button>
                </td>
                <td className="text-left">
                  <button
                    onClick={() => generatePayslipPDF(employee)}
                    className="button muted-button"
                  >
                    PDF
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8}>No Employees</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
