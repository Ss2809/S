/* ==========================================================
   Smart Wari Connect — Admin Reports & Export Engine
   Supports: PDF (via jsPDF + autoTable), Excel (.xlsx via SheetJS), CSV
   ========================================================== */

function generatePdfDownload(title, headers, rows, fileName) {
  try {
    if (window.jspdf && window.jspdf.jsPDF) {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });

      // Saffron Header Bar
      doc.setFillColor(255, 140, 0);
      doc.rect(0, 0, doc.internal.pageSize.getWidth(), 45, 'F');

      // Header Text
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Smart Wari Connect — Admin Management System', 30, 28);

      // Report Title & Metadata
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.text(title, 30, 70);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      const generatedAt = new Date().toLocaleString('en-IN');
      doc.text(`Generated on: ${generatedAt}  |  Total Records: ${rows.length}`, 30, 86);

      // Table styling
      doc.autoTable({
        head: [headers],
        body: rows,
        startY: 98,
        theme: 'grid',
        styles: {
          fontSize: 8,
          cellPadding: 5,
          font: 'helvetica',
          lineColor: [226, 232, 240],
          lineWidth: 0.5,
          textColor: [30, 41, 59]
        },
        headStyles: {
          fillColor: [15, 23, 42],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 8.5
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252]
        },
        margin: { left: 30, right: 30, bottom: 30 }
      });

      doc.save(`${fileName}.pdf`);
      return;
    }
  } catch (e) {
    console.warn('jsPDF generation notice, falling back to print window:', e);
  }

  // Fallback printable view
  const printWin = window.open('', '_blank');
  if (printWin) {
    printWin.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${escapeHtml(title)}</title>
        <style>
          body { font-family: system-ui, sans-serif; padding: 24px; color: #1e293b; }
          .header { background: #ff8c00; color: white; padding: 12px 18px; border-radius: 8px; margin-bottom: 20px; }
          h2 { margin: 0 0 6px 0; }
          .meta { font-size: 12px; color: #64748b; margin-bottom: 16px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 11px; }
          th { background: #0f172a; color: white; padding: 8px 10px; text-align: left; }
          td { border: 1px solid #e2e8f0; padding: 7px 10px; }
          tr:nth-child(even) { background: #f8fafc; }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>Smart Wari Connect — Admin Management System</h2>
          <div style="font-size:13px;">${escapeHtml(title)}</div>
        </div>
        <div class="meta">Generated: ${new Date().toLocaleString('en-IN')} | Total: ${rows.length} records</div>
        <table>
          <thead><tr>${headers.map(h => `<th>${escapeHtml(h)}</th>`).join('')}</tr></thead>
          <tbody>${rows.map(r => `<tr>${r.map(c => `<td>${escapeHtml(c)}</td>`).join('')}</tr>`).join('')}</tbody>
        </table>
      </body>
      </html>
    `);
    printWin.document.close();
    printWin.focus();
    setTimeout(() => { printWin.print(); }, 500);
  }
}

function generateExcelDownload(title, headers, rows, fileName) {
  try {
    if (window.XLSX) {
      const data = [headers, ...rows];
      const ws = XLSX.utils.aoa_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Report");
      XLSX.writeFile(wb, `${fileName}.xlsx`);
      return;
    }
  } catch (e) {
    console.warn('XLSX generation notice, falling back to CSV:', e);
  }
  generateCsvDownload(headers, rows, fileName);
}

function generateCsvDownload(headers, rows, fileName) {
  const escapeCsv = (val) => {
    const s = String(val ?? '');
    if (s.includes(',') || s.includes('"') || s.includes('\n')) {
      return '"' + s.replace(/"/g, '""') + '"';
    }
    return s;
  };

  const csvContent = [
    headers.map(escapeCsv).join(','),
    ...rows.map(row => row.map(escapeCsv).join(','))
  ].join('\r\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${fileName}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

async function exportData(dataset, format) {
  if (typeof wariToast === 'function') {
    wariToast(`Exporting ${dataset.replace('-', ' ').toUpperCase()} as ${format.toUpperCase()}...`);
  }

  try {
    let title = 'Smart Wari Connect Report';
    let headers = [];
    let rows = [];

    if (dataset === 'users') {
      title = 'Smart Wari Connect — Warkari Users Report';
      const res = await fetch('http://localhost:5000/api/users?role=WARKARI');
      const json = await res.json();
      const items = json.data || [];
      headers = ['User ID', 'Name', 'Phone', 'District', 'Blood Group', 'Dindi', 'Digital ID', 'Status'];
      rows = items.map(u => [
        u.userId || u._id || '',
        u.name || '',
        u.phone || '',
        u.district || '',
        u.bloodGroup || '',
        u.dindiName || '',
        u.digitalId || 'Pending',
        u.status || 'Active'
      ]);
    } else if (dataset === 'volunteers') {
      title = 'Smart Wari Connect — Volunteers Report';
      const res = await fetch('http://localhost:5000/api/users?role=VOLUNTEER');
      const json = await res.json();
      const items = json.data || [];
      headers = ['Volunteer ID', 'Name', 'Phone', 'Assigned Area', 'Van Number', 'Availability', 'Rating', 'Completed'];
      rows = items.map(v => [
        v.userId || v._id || '',
        v.name || '',
        v.phone || '',
        v.assignedArea || 'Saswad Sector',
        v.vanNumber || 'AMB-001',
        v.availability || 'Available',
        v.rating ? v.rating.toString() : '4.8',
        v.requestsCompleted ? v.requestsCompleted.toString() : '0'
      ]);
    } else if (dataset === 'sos' || dataset === 'emergency-reports') {
      title = 'Smart Wari Connect — SOS Emergencies Report';
      const res = await fetch('http://localhost:5000/api/sos');
      const json = await res.json();
      const items = json.data || [];
      headers = ['SOS ID', 'Warkari Name', 'Emergency Type', 'Message', 'Coordinates', 'Volunteer', 'Status', 'Date/Time'];
      rows = items.map(s => [
        s._id || '',
        s.userName || 'Warkari',
        s.emergencyType || 'General Emergency',
        s.message || '',
        (s.latitude && s.longitude) ? `${Number(s.latitude).toFixed(4)}, ${Number(s.longitude).toFixed(4)}` : 'N/A',
        s.assignedVolunteerName || 'Unassigned',
        s.status || 'PENDING',
        s.createdAt ? new Date(s.createdAt).toLocaleString('en-IN') : 'Live'
      ]);
    } else if (dataset === 'missing-persons') {
      title = 'Smart Wari Connect — Missing Persons Report';
      const res = await fetch('http://localhost:5000/api/missing-persons');
      const json = await res.json();
      const items = json.data || [];
      headers = ['Report ID', 'Person Name', 'Age', 'Gender', 'Last Seen Stop', 'Contact Person', 'Phone', 'Status'];
      rows = items.map(m => [
        m._id || '',
        m.name || '',
        m.age ? m.age.toString() : '',
        m.gender || '',
        m.lastSeenLocation || m.stop || 'Saswad',
        m.contactName || '',
        m.contactPhone || '',
        m.status || 'Reported'
      ]);
    } else if (dataset === 'food-camps') {
      title = 'Smart Wari Connect — Food & Annachhatra Camps Report';
      const res = await fetch('http://localhost:5000/api/services?category=FOOD');
      const json = await res.json();
      const items = json.data || [];
      headers = ['Camp Name', 'Wari Stop / Location', 'Capacity', 'Timings', 'Contact Person', 'Status'];
      rows = items.map(f => [
        f.name || '',
        f.stop || f.location || 'Saswad',
        f.capacity ? f.capacity.toString() : '5,000/day',
        f.timings || '6:00 AM - 10:00 PM',
        f.contactPerson ? `${f.contactPerson} (${f.contactPhone || ''})` : 'Camp Incharge',
        f.status || 'Open'
      ]);
    } else if (dataset === 'medical-camps') {
      title = 'Smart Wari Connect — Medical Camps & Hospitals Report';
      const res = await fetch('http://localhost:5000/api/services?category=MEDICAL');
      const json = await res.json();
      const items = json.data || [];
      headers = ['Medical Camp / Hospital', 'Wari Stop / Location', 'Doctor In-Charge', 'Beds Available', 'Emergency Contact', 'Status'];
      rows = items.map(m => [
        m.name || '',
        m.stop || m.location || 'Saswad',
        m.doctorName || 'Dr. Deshmukh',
        m.beds ? m.beds.toString() : '20 Beds',
        m.contactPhone || '108',
        m.status || 'Open'
      ]);
    } else if (dataset === 'route-reports') {
      title = 'Smart Wari Connect — Route & Wari Stops Report';
      headers = ['Wari Stop', 'Distance From Start (KM)', 'Key Services Available', 'Assigned Volunteers', 'Emergency Medical Van', 'Status'];
      rows = [
        ['Alandi', '0 KM', 'Food Camp, Water Tankers, First Aid', '24 Volunteers', 'AMB-001', 'Active'],
        ['Pune', '22 KM', 'Medical Hub, 6 Annachhatra, Water Grid', '45 Volunteers', 'AMB-002', 'Active'],
        ['Saswad', '54 KM', 'Primary Health Center, Annachhatra, Police Chowki', '34 Volunteers', 'AMB-003', 'Current Halt'],
        ['Jejuri', '82 KM', 'Temple Annachhatra, PWD Wheelchairs, Ambulance Unit', '28 Volunteers', 'AMB-004', 'Upcoming'],
        ['Lonand', '118 KM', 'Water Point, Emergency Van, Rest Camp', '18 Volunteers', 'AMB-005', 'Upcoming'],
        ['Phaltan', '152 KM', 'Sub-District Hospital, Large Annachhatra', '22 Volunteers', 'AMB-006', 'Upcoming'],
        ['Malshiras', '194 KM', 'Medical Camp, Water Tanker Fleet', '16 Volunteers', 'AMB-007', 'Upcoming'],
        ['Wakhri', '228 KM', 'Major Assembly Camp, Full Medical Team', '40 Volunteers', 'AMB-008', 'Upcoming'],
        ['Pandharpur', '248 KM', 'Main Temple Center, 24/7 Multi-Speciality Camp', '85 Volunteers', 'AMB-009', 'Final Destination']
      ];
    }

    if (rows.length === 0) {
      if (typeof wariToast === 'function') wariToast(`No records found for ${dataset}`);
      return;
    }

    const timestamp = new Date().toISOString().slice(0, 10);
    const fileName = `Smart_Wari_${dataset}_${timestamp}`;

    if (format === 'pdf') {
      generatePdfDownload(title, headers, rows, fileName);
    } else if (format === 'excel') {
      generateExcelDownload(title, headers, rows, fileName);
    } else if (format === 'csv') {
      generateCsvDownload(headers, rows, fileName);
    }

    if (typeof wariToast === 'function') {
      wariToast(`✓ ${dataset.replace('-', ' ').toUpperCase()} downloaded as ${format.toUpperCase()}`);
    }
  } catch (err) {
    console.error('Export error:', err);
    alert('Export failed: ' + err.message);
  }
}

// Bind globally to window
window.exportData = exportData;
window.generatePdfDownload = generatePdfDownload;
window.generateExcelDownload = generateExcelDownload;
window.generateCsvDownload = generateCsvDownload;

// Event delegation for export buttons
document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-export-dataset]');
    if (btn) {
      e.preventDefault();
      const dataset = btn.getAttribute('data-export-dataset');
      const format = btn.getAttribute('data-export-format');
      if (dataset && format && typeof window.exportData === 'function') {
        window.exportData(dataset, format);
      }
    }
  });
});
