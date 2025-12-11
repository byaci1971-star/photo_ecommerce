import { useCallback } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { CanvasState } from './useCanvasEditor';

export function usePdfExport() {
  const exportCanvasToPdf = useCallback(
    async (
      canvasRef: React.RefObject<HTMLCanvasElement>,
      canvasState: CanvasState,
      fileName: string = 'creation'
    ) => {
      if (!canvasRef.current) {
        throw new Error('Canvas reference not found');
      }

      try {
        // Get canvas dimensions
        const canvas = canvasRef.current;
        const width = canvasState.width;
        const height = canvasState.height;

        // Convert canvas to image
        const imgData = canvas.toDataURL('image/png', 1.0);

        // Calculate PDF dimensions (convert pixels to mm, assuming 96 DPI)
        const pxToMm = 0.264583;
        const pdfWidth = width * pxToMm;
        const pdfHeight = height * pxToMm;

        // Create PDF
        const pdf = new jsPDF({
          orientation: pdfWidth > pdfHeight ? 'landscape' : 'portrait',
          unit: 'mm',
          format: [pdfWidth, pdfHeight],
        });

        // Add image to PDF
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

        // Save PDF
        pdf.save(`${fileName}.pdf`);

        return true;
      } catch (error) {
        console.error('Error exporting to PDF:', error);
        throw error;
      }
    },
    []
  );

  const exportCanvasToHighResolutionPdf = useCallback(
    async (
      canvasRef: React.RefObject<HTMLCanvasElement>,
      canvasState: CanvasState,
      fileName: string = 'creation',
      dpi: number = 300
    ) => {
      if (!canvasRef.current) {
        throw new Error('Canvas reference not found');
      }

      try {
        const canvas = canvasRef.current;

        // Create a high-resolution canvas
        const scale = dpi / 96; // Standard screen DPI is 96
        const highResCanvas = document.createElement('canvas');
        highResCanvas.width = canvas.width * scale;
        highResCanvas.height = canvas.height * scale;

        const ctx = highResCanvas.getContext('2d');
        if (!ctx) throw new Error('Could not get canvas context');

        // Scale and draw
        ctx.scale(scale, scale);
        ctx.drawImage(canvas, 0, 0);

        // Convert to image
        const imgData = highResCanvas.toDataURL('image/png', 1.0);

        // Calculate PDF dimensions
        const pxToMm = 0.264583;
        const pdfWidth = (canvas.width * pxToMm) / scale;
        const pdfHeight = (canvas.height * pxToMm) / scale;

        // Create PDF
        const pdf = new jsPDF({
          orientation: pdfWidth > pdfHeight ? 'landscape' : 'portrait',
          unit: 'mm',
          format: [pdfWidth, pdfHeight],
        });

        // Add image to PDF
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

        // Save PDF
        pdf.save(`${fileName}-hires.pdf`);

        return true;
      } catch (error) {
        console.error('Error exporting high-resolution PDF:', error);
        throw error;
      }
    },
    []
  );

  const exportHtmlElementToPdf = useCallback(
    async (
      element: HTMLElement,
      fileName: string = 'creation'
    ) => {
      try {
        // Convert HTML element to canvas
        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
        });

        const imgData = canvas.toDataURL('image/png');

        // Calculate PDF dimensions
        const pxToMm = 0.264583;
        const pdfWidth = canvas.width * pxToMm;
        const pdfHeight = canvas.height * pxToMm;

        // Create PDF
        const pdf = new jsPDF({
          orientation: pdfWidth > pdfHeight ? 'landscape' : 'portrait',
          unit: 'mm',
          format: [pdfWidth, pdfHeight],
        });

        // Add image to PDF
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

        // Save PDF
        pdf.save(`${fileName}.pdf`);

        return true;
      } catch (error) {
        console.error('Error exporting HTML to PDF:', error);
        throw error;
      }
    },
    []
  );

  return {
    exportCanvasToPdf,
    exportCanvasToHighResolutionPdf,
    exportHtmlElementToPdf,
  };
}
