import { jsPDF } from 'jspdf';

const generatePDF = async (appointment_id, formData, doctors) => {
    const doc = new jsPDF();
    const marginLeft = 10;
    const marginTop = 10;
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
        doc.addImage(logoImg, "PNG", marginLeft, marginTop, 30, 30);
    } catch (err) {
        doc.setFontSize(10);
        doc.text("Logo Unavailable", marginLeft, marginTop + 5);
        console.error("Error loading logo:", err);
    }
    
    doc.setFontSize(10);
    const companyInfo = [
        "Email: help@jigisha.org",
        "Address: B-121, Shyam Kunj, Gali No. 10,",
        "Goyla Extension, Najafgarh, New Delhi, India",
    ];
    const companyX = pageWidth - marginLeft - 80;
    let headerY = marginTop + 5;
    companyInfo.forEach((line) => {
        doc.text(line, companyX, headerY, { maxWidth: 80, align: "right" });
        headerY += 5;
    });
    
    doc.setLineWidth(0.5);
    doc.line(marginLeft, marginTop + 35, pageWidth - marginLeft, marginTop + 35);
    
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Appointment Receipt", pageWidth / 2, marginTop + 50, { align: "center" });
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`ID: ${appointment_id}`, pageWidth / 2, marginTop + 58, { align: "center" });
    
    const doctorData = [
        ["Doctor", doctors.find((d) => d?._id === formData.doctorId)?.name || "N/A"],
        ["District", formData.district || "N/A"],
        ["Time Slot", new Date(formData.appointmentDate).toLocaleString('en-GB', { hour12: true })],
        ["Issue", formData.issue || "Not specified"],
        ["Generated At", new Date().toLocaleString('en-GB', { hour12: true })],
    ];
    
    const patientData = [
        ["Name", formData.name || "N/A"],
        ["Age", String(formData.age) || "N/A"],
        ["Gender", formData.gender || "N/A"],
        ["Phone", formData.phone || "N/A"],
        ["Aadhar No.", formData.aadharNo || "N/A"],
        ["Address", formData.address || "N/A"],
    ];
    
    let currentY = marginTop + 75;
    doc.setFontSize(12);
    
    // Left Panel - Doctor Details
    let leftX = marginLeft;
    doctorData.forEach(([label, value]) => {
        doc.setFont("helvetica", "bold");
        doc.text(`${label}:`, leftX, currentY);
        doc.setFont("helvetica", "normal");
        doc.text(value, leftX + 35, currentY);
        currentY += 10;
    });
    
    // Reset Y for patient details
    currentY = marginTop + 75;
    let rightX = pageWidth / 2 + 10;
    
    // Right Panel - Patient Details
    patientData.forEach(([label, value]) => {
        doc.setFont("helvetica", "bold");
        doc.text(`${label}:`, rightX, currentY);
        doc.setFont("helvetica", "normal");
        doc.text(value, rightX + 35, currentY);
        currentY += 10;
    });
    
    const footerY = pageHeight - 15;
    doc.setLineWidth(0.3);
    doc.line(marginLeft, footerY - 5, pageWidth - marginLeft, footerY - 5);
    doc.setFontSize(10);
    doc.text("www.jigisha.org", pageWidth / 2, footerY, { align: "center" });
    
    doc.save(`appointment_${appointment_id}.pdf`);
};

export default generatePDF;
