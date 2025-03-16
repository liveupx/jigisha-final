import { jsPDF } from "jspdf";

const generatePDF = async (appointment_id, formData, doctors) => {
    const doc = new jsPDF();
    const marginLeft = 5;
    const marginTop = 1;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const logo = "../../logo.png";

    const loadImage = (src) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = src;
            img.onload = () => resolve(img);
            img.onerror = (err) => reject(err);
        });
    };

    try {
        const logoImg = await loadImage(logo);
        const logoWidth = 50; // Increase size slightly for balance
        const logoHeight = 45;
        const logoX = (pageWidth / 2) - (logoWidth / 2) - 5; // Move logo towards center
        const logoY = marginTop; // Adjust height slightly

        doc.addImage(logoImg, "PNG", logoX, logoY, logoWidth, logoHeight);
    } catch (err) {
        doc.setFontSize(10);
        doc.text("Logo Unavailable", marginLeft + 15, marginTop + 20);
        console.error("Error loading logo:", err);
    }

    // Adjusted Positioning for Company Info (moved more right)
    doc.setFontSize(10);
    const companyInfo = [
        "Email: help@jigisha.org",
        "Address: B-121, Shyam Kunj, Gali No. 10,",
        "Goyla Extension, Najafgarh, New Delhi, India",
    ];

    const textStartX = pageWidth / 2 + 30; // Push text further right
    let textStartY = marginTop + 15; // Align properly

    companyInfo.forEach((line, index) => {
        doc.text(line, textStartX, textStartY);
        textStartY += 6; // Maintain equal spacing
    });

    // writing regd. number
    doc.text("Reg. No: JGSH2025001", pageWidth / 6 - 15, marginTop + 18);


    // Separator Line Below Header
    doc.setLineWidth(0.5);
    doc.line(marginLeft, marginTop + 45, pageWidth - marginLeft, marginTop + 45);

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Appointment Receipt", pageWidth / 6 + 10, marginTop + 55);
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`: ${appointment_id}`, pageWidth / 3 + 40, marginTop + 55);
    
    const doctorData = [
        ["Doctor", doctors.find((d) => d?._id === formData.doctorId)?.name || "N/A"],
        ["District", formData.district || "N/A"],
        ["Time Slot", new Date(formData.appointmentDate).toLocaleString('en-GB', { hour12: true })],
        ["Issue", formData.issue || "Not specified"]
    ];
    
    const nameAgeGender = `${formData.name}/${formData.age}/${formData.gender === 'Male' ? 'M' : formData.gender === 'Female' ? 'F' : 'O'}`;
    const patientId = formData.idType && formData.idNumber ? `${formData.idType} - ${formData.idNumber}` : "N/A";
    const patientData = [
        ["Name", nameAgeGender || "N/A"],
        ["Phone", formData.phone || "N/A"],
        ["Id", patientId || "N/A"],
        ["Address", formData.address || "N/A"],
    ];
    
    let currentY = marginTop + 65;
    doc.setFontSize(12);
    
    // Left Panel - Doctor Details
    let leftX = marginLeft;
    doctorData.forEach(([label, value]) => {
        doc.setFont("helvetica", "bold");
        doc.text(`${label}:`, leftX, currentY);
        doc.setFont("helvetica", "normal");
        doc.text(value, leftX + 30, currentY);
        currentY += 7;
    });
    
    // Reset Y for patient details
    currentY = marginTop + 65;
    let rightX = pageWidth / 2 + 10;
    
    // Right Panel - Patient Details
    patientData.forEach(([label, value]) => {
        doc.setFont("helvetica", "bold");
        doc.text(`${label}:`, rightX, currentY);
        doc.setFont("helvetica", "normal");
        doc.text(value, rightX + 30, currentY);
        currentY += 7;
    });
    
    const footerY = pageHeight - 15;
    doc.setLineWidth(0.3);
    doc.line(marginLeft, footerY - 5, pageWidth - marginLeft, footerY - 5);
    doc.setFontSize(10);
    doc.text(`Patients are requested to bring their identification (ID) with them.`, pageWidth / 2, footerY, { align: "center" });
    
    doc.save(`appointment_${appointment_id}.pdf`);
};

export default generatePDF;