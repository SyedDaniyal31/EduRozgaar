import { useState } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Button } from '../../components/common/Button';

export function ResumeDownload({ previewRef, fileName = 'EduRozgaar-Resume' }) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    const el = previewRef?.current;
    if (!el) {
      window.alert('Preview not ready. Please wait a moment and try again.');
      return;
    }
    const target = el.querySelector('.resume-preview') || el;
    setDownloading(true);
    try {
      const canvas = await html2canvas(target, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const w = pdf.internal.pageSize.getWidth();
      const h = pdf.internal.pageSize.getHeight();
      const ratio = canvas.width / canvas.height;
      const imgH = ratio > w / h ? h : w / ratio;
      const imgW = ratio > w / h ? w * ratio : w;
      pdf.addImage(imgData, 'JPEG', 0, 0, imgW, imgH);
      pdf.save(`${fileName.replace(/[^a-zA-Z0-9-_]/g, '-')}.pdf`);
    } catch (err) {
      console.error(err);
      window.alert('PDF download failed. Try again or use Print (Ctrl+P) from the preview.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Button onClick={handleDownload} disabled={downloading} className="w-full sm:w-auto">
      {downloading ? 'Generating PDF…' : 'Download Resume (PDF)'}
    </Button>
  );
}
