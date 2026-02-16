import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ScanResult, CANCER_CLASSES } from '@/types';
import { formatDate } from './utils';

export async function generatePDFReport(scanResult: ScanResult): Promise<void> {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  
  // Header
  pdf.setFillColor(100, 188, 244);
  pdf.rect(0, 0, pageWidth, 40, 'F');
  
  // Logo/Title
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Skin Health Center', pageWidth / 2, 20, { align: 'center' });
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text('AI-Powered Skin Cancer Detection Report', pageWidth / 2, 30, { align: 'center' });
  
  // Patient Information Section
  let yPos = 50;
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Patient Information', 15, yPos);
  
  yPos += 10;
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Name: ${scanResult.patientData.firstName}`, 15, yPos);
  pdf.text(`Patient ID: ${scanResult.patientData.patientId}`, 120, yPos);
  
  yPos += 7;
  pdf.text(`Age: ${scanResult.patientData.age}`, 15, yPos);
  pdf.text(`Gender: ${scanResult.patientData.gender}`, 120, yPos);
  
  yPos += 7;
  pdf.text(`Date: ${formatDate(scanResult.timestamp)}`, 15, yPos);
  
  // Divider
  yPos += 5;
  pdf.setDrawColor(200, 200, 200);
  pdf.line(15, yPos, pageWidth - 15, yPos);
  
  // Analysis Results Section
  yPos += 10;
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Analysis Results', 15, yPos);
  
  // Top Prediction
  yPos += 10;
  const topClass = CANCER_CLASSES[scanResult.topPrediction.classId];
  const confidence = (scanResult.topPrediction.probability * 100).toFixed(2);
  
  // Colored box for severity
  const severityColor = topClass.severity === 'high' ? [239, 68, 68] :
                       topClass.severity === 'medium' ? [245, 158, 11] :
                       [34, 197, 94];
  pdf.setFillColor(...severityColor);
  pdf.roundedRect(15, yPos, pageWidth - 30, 15, 2, 2, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`Primary Diagnosis: ${topClass.name}`, 20, yPos + 10);
  pdf.text(`Confidence: ${confidence}%`, pageWidth - 60, yPos + 10);
  
  // Description
  yPos += 22;
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  const descLines = pdf.splitTextToSize(`Description: ${topClass.description}`, pageWidth - 30);
  pdf.text(descLines, 15, yPos);
  yPos += descLines.length * 5;
  
  // Risk Assessment
  yPos += 5;
  pdf.setFont('helvetica', 'bold');
  pdf.text('Risk Assessment:', 15, yPos);
  yPos += 7;
  pdf.setFont('helvetica', 'normal');
  const riskText = topClass.severity === 'high' 
    ? 'HIGH RISK - Immediate medical consultation strongly recommended'
    : topClass.severity === 'medium'
    ? 'MODERATE RISK - Medical consultation recommended within 1-2 weeks'
    : 'LOW RISK - Monitor and follow up if changes occur';
  pdf.setTextColor(...severityColor);
  pdf.text(riskText, 15, yPos);
  pdf.setTextColor(0, 0, 0);
  
  // All Predictions Table
  yPos += 10;
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Detailed Analysis', 15, yPos);
  
  yPos += 8;
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Condition', 15, yPos);
  pdf.text('Probability', pageWidth - 50, yPos);
  
  yPos += 2;
  pdf.line(15, yPos, pageWidth - 15, yPos);
  
  yPos += 5;
  pdf.setFont('helvetica', 'normal');
  
  scanResult.predictions.slice(0, 7).forEach((pred) => {
    const classData = CANCER_CLASSES[pred.classId];
    const prob = (pred.probability * 100).toFixed(2);
    
    pdf.text(classData.name, 15, yPos);
    pdf.text(`${prob}%`, pageWidth - 50, yPos);
    
    // Progress bar
    const barWidth = 40;
    const filledWidth = (barWidth * pred.probability);
    pdf.setDrawColor(200, 200, 200);
    pdf.rect(pageWidth - 45, yPos - 3, barWidth, 4);
    pdf.setFillColor(...severityColor);
    pdf.rect(pageWidth - 45, yPos - 3, filledWidth, 4, 'F');
    
    yPos += 7;
  });
  
  // Image Section (if there's space)
  if (yPos < pageHeight - 80) {
    yPos += 10;
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Analyzed Image', 15, yPos);
    
    yPos += 5;
    try {
      // Add image
      const imgWidth = 60;
      const imgHeight = 60;
      pdf.addImage(scanResult.imageDataUrl, 'JPEG', 15, yPos, imgWidth, imgHeight);
    } catch (error) {
      console.error('Error adding image to PDF:', error);
    }
  }
  
  // Footer/Disclaimer (new page if needed)
  if (yPos > pageHeight - 50) {
    pdf.addPage();
    yPos = 20;
  } else {
    yPos = pageHeight - 45;
  }
  
  pdf.setFillColor(255, 243, 205);
  pdf.rect(15, yPos, pageWidth - 30, 35, 'F');
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Medical Disclaimer', 20, yPos + 7);
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  const disclaimer = 'This report is generated by an AI-powered diagnostic tool for educational and informational purposes only. It is NOT a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of a qualified healthcare provider with any questions regarding a medical condition. Never disregard professional medical advice or delay seeking it because of something you have read in this report.';
  const disclaimerLines = pdf.splitTextToSize(disclaimer, pageWidth - 40);
  pdf.text(disclaimerLines, 20, yPos + 12);
  
  // Save the PDF
  const fileName = `Skin_Analysis_${scanResult.patientData.patientId}_${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(fileName);
}

export async function generateBatchPDFReport(scanResults: ScanResult[]): Promise<void> {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  
  // Header
  pdf.setFillColor(100, 188, 244);
  pdf.rect(0, 0, pageWidth, 30, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Scan History Report', pageWidth / 2, 20, { align: 'center' });
  
  let yPos = 45;
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(12);
  pdf.text(`Total Scans: ${scanResults.length}`, 15, yPos);
  pdf.text(`Generated: ${formatDate(new Date())}`, pageWidth - 70, yPos);
  
  yPos += 10;
  
  scanResults.forEach((scan, index) => {
    if (yPos > 250) {
      pdf.addPage();
      yPos = 20;
    }
    
    const topClass = CANCER_CLASSES[scan.topPrediction.classId];
    const confidence = (scan.topPrediction.probability * 100).toFixed(2);
    
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Scan #${index + 1} - ${formatDate(scan.timestamp)}`, 15, yPos);
    
    yPos += 6;
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.text(`Patient: ${scan.patientData.firstName} (ID: ${scan.patientData.patientId})`, 15, yPos);
    pdf.text(`Diagnosis: ${topClass.name} (${confidence}%)`, 15, yPos + 5);
    
    yPos += 15;
    pdf.setDrawColor(220, 220, 220);
    pdf.line(15, yPos, pageWidth - 15, yPos);
    yPos += 5;
  });
  
  pdf.save(`Scan_History_${new Date().toISOString().split('T')[0]}.pdf`);
}

