import React, { useRef } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { LiaDownloadSolid } from "react-icons/lia";

function SalarySlip({ salaryData }) {
  const slipRef = useRef(); // Reference for the payslip content

  const staticData = {
    companyDetails: {
      logo: "/chardham_logo.png",
      address: "Gurugram, Haryana",
    },
    hrDetails: {
      name: "Geeta Sharma",
      designation: "HR Manager",
      signature: "/hr_signature.png",
    },
  };

  const { companyDetails, hrDetails } = staticData;
  const { employeeDetails, salaryDetails, earnings, deductions } = salaryData;

  // Function to download the payslip as PDF
  const downloadPDF = async () => {
    const element = slipRef.current; // Reference to the payslip content
    const canvas = await html2canvas(element, {
      scale: 2, // High resolution for better PDF quality
      useCORS: true, // Enable cross-origin for images
    });
    const imgData = canvas.toDataURL("image/png"); // Convert to image
    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width; // Maintain aspect ratio

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("salary-slip.pdf");
  };

  return (
    <div>
      {/* Button to download the PDF */}
      <div className="flex justify-end items-center font-semibold">
        <button
          onClick={downloadPDF}
          className="flex justify-end items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
        <LiaDownloadSolid />
          Download PDF
        </button>
      </div>

      {/* Payslip content */}
      <div
        ref={slipRef} // Reference for the payslip content
        className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg mt-4 border border-gray-300"
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-5 text-center">
          Payslip
        </h1>

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <img
              src={companyDetails.logo}
              alt="Company Logo"
              className="w-28 object-contain"
            />
            <p className="text-xs text-gray-600">{companyDetails.address}</p>
          </div>
        </div>

        {/* Employee Details */}
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Employee Details
        </h2>
        <table className="w-full table-auto border-collapse border border-gray-300 mb-6">
          <tbody>
            {Object.entries(employeeDetails).map(([key, value]) => (
              <tr key={key} className="border border-gray-300">
                <td className="px-4 py-2 capitalize font-semibold text-gray-700 mb-4">
                  {key.replace(/([A-Z])/g, " $1")}
                </td>
                <td className="px-4 py-2 text-gray-800">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Salary Details */}
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Salary Details
        </h2>
        <table className="w-full table-auto border-collapse border border-gray-300 mb-6">
          <tbody>
            {Object.entries(salaryDetails).map(([key, value]) => (
              <tr key={key} className="border border-gray-300">
                <td className="px-4 py-2 capitalize font-semibold text-gray-700 mb-4">
                  {key.replace(/([A-Z])/g, " $1")}
                </td>
                <td className="px-4 py-2 text-gray-800">
                  {typeof value === "number" ? `₹${value}` : value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Earnings and Deductions */}
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Earnings
            </h2>
            <table className="w-full table-auto border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100 border border-gray-300">
                  <th className="px-4 py-2 capitalize font-semibold text-gray-700 mb-4">
                    Name
                  </th>
                  <th className="px-4 py-2 capitalize font-semibold text-gray-700 mb-4">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {earnings.map((item, index) => (
                  <tr key={index} className="border border-gray-300">
                    <td className="px-4 py-2 text-gray-800">{item.name}</td>
                    <td className="px-4 py-2 text-right text-gray-800">
                      ₹{item.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Deductions
            </h2>
            <table className="w-full table-auto border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100 border border-gray-300">
                  <th className="px-4 py-2 capitalize font-semibold text-gray-700 mb-4">
                    Name
                  </th>
                  <th className="px-4 py-2 capitalize font-semibold text-gray-700 mb-4">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {deductions.map((item, index) => (
                  <tr key={index} className="border border-gray-300">
                    <td className="px-4 py-2 text-gray-800">{item.name}</td>
                    <td className="px-4 py-2 text-right text-gray-800">
                      ₹{item.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* HR Signature */}
        <div className="flex justify-between items-center p-6 mt-6">
          <div>
            <p className="font-medium text-gray-700">HR Signature:</p>
            <p className="text-sm text-gray-600">{hrDetails.name}</p>
            <p className="text-sm text-gray-600">{hrDetails.designation}</p>
          </div>
          <img
            src={hrDetails.signature}
            alt="HR Signature"
            className="h-16 w-auto object-contain"
          />
        </div>

        <div>
          <p className="text-center my-5">
            <span>--</span> This is a system-generated payslip <span>--</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SalarySlip;
