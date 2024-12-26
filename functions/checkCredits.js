const fetch = require('node-fetch');

exports.handler = async function(event) {
  try {
    const apiKey = event.queryStringParameters.key;
    
    const response = await fetch('https://api.unify.ai/v0/credits', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    
    // Log the response for debugging
    console.log('API Response:', data);

    // If response is successful and has any data
    if (response.ok && data) {
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          credits: data.credits || data.credit || 0,  // Try different possible field names
          rawResponse: data  // Include raw response for debugging
        })
      };
    }

    // If response indicates an error
    return {
      statusCode: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        error: 'API Error',
        details: data,
        status: response.status
      })
    };

  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        error: 'Failed to check credits', 
        message: error.message 
      })
    };
  }
};
