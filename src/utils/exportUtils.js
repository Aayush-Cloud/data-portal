export const convertToCSV = (data) => {
    const headers = ['Name', 'Type', 'Status', 'Availability', 'Performance', 'Quality', 'OEE'];
    const csvRows = [];
    
    // Add headers
    csvRows.push(headers.join(','));
    
    // Add data rows
    data.forEach(item => {
      const row = [
        item.name,
        item.type,
        item.healthStatus,
        item.availability,
        item.performance,
        item.quality,
        item.oee
      ];
      csvRows.push(row.join(','));
    });
    
    return csvRows.join('\n');
  };
  
  export const downloadCSV = (csvContent, filename) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };