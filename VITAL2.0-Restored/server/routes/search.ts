import express from 'express';
import SearchManager from '../search-manager.js';

const router = express.Router();
const searchManager = SearchManager.getInstance();

// Medical search endpoint
router.post('/medical', async (req, res) => {
  try {
    const searchRequest = req.body;
    
    // Validate request
    if (!searchRequest.query || typeof searchRequest.query !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Query parameter is required and must be a string'
      });
    }

    const searchResponse = await searchManager.performSearch(searchRequest);
    
    res.json({
      success: true,
      data: searchResponse
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      error: 'Error performing search'
    });
  }
});

// Get search suggestions
router.get('/suggestions', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || typeof q !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Query parameter "q" is required'
      });
    }

    const suggestions = await searchManager.getSearchSuggestions(q);
    
    res.json({
      success: true,
      data: suggestions
    });
  } catch (error) {
    console.error('Suggestions error:', error);
    res.status(500).json({
      success: false,
      error: 'Error getting suggestions'
    });
  }
});

// Export search results
router.post('/export', async (req, res) => {
  try {
    const { searchRequest, format = 'pdf' } = req.body;
    
    if (!searchRequest) {
      return res.status(400).json({
        success: false,
        error: 'Search request is required for export'
      });
    }

    // Perform search to get results
    const searchResponse = await searchManager.performSearch(searchRequest);
    
    // Generate export data based on format
    let exportData;
    let contentType;
    let filename;
    
    switch (format) {
      case 'csv':
        exportData = generateCSV(searchResponse.results);
        contentType = 'text/csv';
        filename = `search_results_${Date.now()}.csv`;
        break;
      case 'excel':
        // In a real implementation, you'd use a library like xlsx
        exportData = generateCSV(searchResponse.results); // Fallback to CSV
        contentType = 'application/vnd.ms-excel';
        filename = `search_results_${Date.now()}.csv`;
        break;
      case 'pdf':
      default:
        exportData = generatePDF(searchResponse.results);
        contentType = 'application/pdf';
        filename = `search_results_${Date.now()}.pdf`;
        break;
    }
    
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(exportData);
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({
      success: false,
      error: 'Error exporting search results'
    });
  }
});

// Helper function to generate CSV
function generateCSV(results: any[]): string {
  if (results.length === 0) {
    return 'No results found';
  }
  
  const headers = ['Tipo', 'Título', 'Subtítulo', 'Relevancia', 'Metadata'];
  const rows = results.map(result => [
    result.type,
    `"${result.title}"`,
    `"${result.subtitle}"`,
    result.relevance,
    `"${JSON.stringify(result.metadata)}"`
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  return csvContent;
}

// Helper function to generate PDF (simplified)
function generatePDF(results: any[]): string {
  // In a real implementation, you'd use a library like pdfkit or puppeteer
  let pdfContent = `REPORTE DE BÚSQUEDA MÉDICA\n`;
  pdfContent += `Generado: ${new Date().toLocaleString('es-ES')}\n\n`;
  pdfContent += `Total de resultados: ${results.length}\n\n`;
  
  results.forEach((result, index) => {
    pdfContent += `${index + 1}. ${result.title}\n`;
    pdfContent += `   Tipo: ${result.type}\n`;
    pdfContent += `   ${result.subtitle}\n`;
    pdfContent += `   Relevancia: ${result.relevance}\n\n`;
  });
  
  return pdfContent;
}

export default router;