import React, { useState } from "react";
import Swal from "sweetalert2";
import { db } from "../../config/firestore";
import { addDoc, collection } from "firebase/firestore";
import * as XLSX from "xlsx";

const BulkAdd = ({
  setActiveTab,
  getEmployees,
}) => {
  const [uploadedData, setUploadedData] = useState([]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet);

      const formattedData = parsedData.map((row) => {
        const date = new Date(row.Date * 86400000 + Date.parse("1899-12-30"));
        return {
          ...row,
          Date: date.toISOString().split("T")[0],
        };
      });

      setUploadedData(formattedData);
    };
    reader.readAsArrayBuffer(file);
  };


  const handleSave = async () => {
  
    if (uploadedData.length === 0) {
      return Swal.fire({
        icon: "error",
        title: "Error!",
        text: "No data to save. Please upload a valid Excel file.",
        showConfirmButton: true,
      });
    }
  
    try {
      const savePromises = uploadedData.map((employee) => {
        const transformedEmployee = {
          firstName: employee["First Name"],
          lastName: employee["Last Name"],
          email: employee["Email"],
          salary: employee["Salary"],
          date: employee["Date"],
        };
  
        console.log("transformedEmployee", transformedEmployee);
  
        return addDoc(collection(db, "employees"), transformedEmployee);
      });
  
      await Promise.all(savePromises);
  
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "All employee data has been saved successfully.",
        showConfirmButton: false,
        timer: 1500,
      });
  
      getEmployees();
      setActiveTab("table");
    } catch (error) {
      console.error("Error during save:", error.message);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: `An error occurred while saving the data: ${error.message}`,
        showConfirmButton: true,
      });
    }
  };
  
  

  return (
    <form>
      <h1>Bulk Employee Upload</h1>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      {uploadedData.length > 0 && (
        <>
          <button
            type="button"
            onClick={handleSave}
            style={{ marginTop: "20px", marginRight: "10px" }}
          >
            Save
          </button>
          <table>
            <thead>
              <tr>
                {Object.keys(uploadedData[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {uploadedData.map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((value, i) => (
                    <td key={i}>{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </form>
  );
};

export default BulkAdd;
