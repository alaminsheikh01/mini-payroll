import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const generatePayslipPDF = async (employee, logoLeft, logoRight) => {
  const doc = new jsPDF();

  // Add Images
  if (logoLeft) {
    doc.addImage(logoLeft, "JPEG", 15, 10, 30, 30); // Left logo
  }
  if (logoRight) {
    doc.addImage(logoRight, "JPEG", 170, 10, 30, 30); // Right logo
  }

  // Header Section
  doc.setFontSize(12);
  doc.text("Central Depository Bangladesh Limited", 70, 20);
  doc.setFontSize(10);
  doc.text("Payslip", 95, 30);
  doc.text("For the Month of September-2022", 80, 40);

  // Employee Information
  doc.setFontSize(10);
  doc.text(`Emp. ID: ${employee.id}`, 20, 50);
  doc.text(`Name: ${employee.name}`, 20, 60);
  doc.text(`Designation: ${employee.designation}`, 20, 70);
  doc.text(`TIN: ${employee.tin}`, 20, 80);

  doc.text(`Emp. Type: ${employee.type}`, 120, 50);
  doc.text(`Date of Joining: ${employee.dateOfJoining}`, 120, 60);
  doc.text(`Bank A/c No.: ${employee.bankAccount}`, 120, 70);
  doc.text(`Bank Name: ${employee.bankName}`, 120, 80);

  // Table of Salary Details
  autoTable(doc, {
    startY: 90,
    head: [["Particulars", "Amount", "Deductions", "Amount"]],
    body: [
      ["Basic", "00.00", "Income Tax", "00.00"],
      ["House Rent Allowance", "00.00", "Lunch", "00.00"],
      ["Conveyance/Car Allowance", "00.00", "Loan Repayment", "00.00"],
      ["Medical Allowance", "00.00", "Advance Salary", "00.00"],
      ["Boishakhi Allowance", "00.00", "PF", "00.00"],
      ["Mobile Allowance", "00.00", "", ""],
    ],
    theme: "grid",
    styles: { fontSize: 10, cellPadding: 3 },
    headStyles: {
        fillColor: [150, 150, 150],
        textColor: [255, 255, 255], 
        halign: "center",
        fontStyle: "bold",
      },
  });

  // Total Section
  doc.text("Total Gross Salary: 00.00", 20, doc.lastAutoTable.finalY + 10);
  doc.text("Total Deduction: 00.00", 120, doc.lastAutoTable.finalY + 10);
  doc.text("Net Salary: 00.00", 20, doc.lastAutoTable.finalY + 20);
  doc.text(
    "In Words: Fifty Thousand Five Hundred Taka only",
    20,
    doc.lastAutoTable.finalY + 30
  );

  // Footer Section
  doc.text("Prepared By: __________________", 20, doc.lastAutoTable.finalY + 50);
  doc.text("Approved By: __________________", 120, doc.lastAutoTable.finalY + 50);

  // Save the PDF
  doc.save("payslip.pdf");
};

export default generatePayslipPDF;
