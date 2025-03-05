import { jsPDF } from 'jspdf';


const generatePDF = async (appointment_id, formData, doctors) => {
    // console.log(appointment_idd);
    // const uid = new ShortUniqueId({
    //   dictionary: [
    //     '0', '1', '2', '3',
    //     '4', '5', '6', '7',
    //     '8', '9'
    //   ],
    // });

    // const appointment_id = uid.randomUUID(6);
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
    
    const patientData = [
        ["Name", formData.name || "N/A"],
        ["Age", formData.age || "N/A"],
        ["Gender", formData.gender || "N/A"],
        ["Phone", formData.phone || "N/A"],
        ["Address", formData.address || "N/A"],
        ["Aadhar No.", formData.aadharNo || "N/A"],
    ];
    doc.setFontSize(11);
    let currentY = marginTop + 70;
    patientData.forEach(([label, value], index) => {
        const xPos = marginLeft + (index % 2) * 90;
        const yPos = currentY + Math.floor(index / 2) * 12;
        doc.setFont("helvetica", "bold");
        doc.text(`${label}:`, xPos, yPos);
        doc.setFont("helvetica", "normal");
        const textLines = doc.splitTextToSize(value, 65);
        doc.text(textLines, xPos + 25, yPos);
        if (textLines.length > 1 && index % 2 === 1) {
        currentY += (textLines.length - 1) * 5;
        }
    });
    currentY += Math.ceil(patientData.length / 2) * 12 + 10;
    
    if (formData.photo) {
        let photoData;
    if (typeof formData.photo === 'string') {
      // If photo is already a base64 string (from Appointments)
      photoData = formData.photo;
    } else {
      // If photo is a File object (from AppointmentPage)
      photoData = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve(event.target.result);
        reader.readAsDataURL(formData.photo);
      });
    }
        const photoX = pageWidth - 50;
        const photoY = marginTop + 65; 
        doc.addImage(photoData, "JPEG", photoX, photoY, 40, 48);
    }
    
    const appointmentData = [
        ["Doctor", doctors.find((d) => d?._id === formData.doctorId)?.name || "N/A"],
        ["Time Slot", new Date(formData.appointmentDate).toLocaleString('en-GB', {hour12: true})],
        ["Issue", formData.issue || "Not specified"],
        ["Generated At", new Date().toLocaleString('en-GB', {hour12: true})]
    ];
    doc.setFillColor(240, 240, 240);
    doc.rect(marginLeft, currentY, pageWidth - 20, 50, "F");
    doc.setFontSize(12);
    appointmentData.forEach(([label, value], index) => {
        doc.setFont("helvetica", "bold");
        doc.text(`${label}:`, marginLeft + 5, currentY + 10 + index * 10);
        doc.setFont("helvetica", "normal");
        doc.text(value, marginLeft + 35, currentY + 10 + index * 10, { maxWidth: 140 });
    });
    currentY += 60;
    
    const footerY = pageHeight - 15;
    doc.setLineWidth(0.3);
    doc.line(marginLeft, footerY - 5, pageWidth - marginLeft, footerY - 5);
    doc.setFontSize(10);
    doc.text("www.jigisha.org", pageWidth / 2, footerY, { align: "center" });
    
    doc.save(`appointment_${appointment_id}.pdf`);
};

export default generatePDF;