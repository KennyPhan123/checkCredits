const fetch = require('node-fetch');

exports.handler = async function(event) {
  try {
    const apiKey = event.queryStringParameters.key;
    
    // Clean the API key (remove any spaces, quotes, etc.)
    const cleanApiKey = apiKey.trim().replace(/^["']|["']$/g, '');
    
    // Make sure Bearer is properly formatted
    const authHeader = cleanApiKey.startsWith('Bearer ') 
      ? cleanApiKey 
      : `Bearer ${cleanApiKey}`;

    console.log('Making request with auth header:', authHeader); // For debugging

    const response = await fetch('https://api.unify.ai/v0/credits', {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    const data = await response.json();
    console.log('API Response:', data); // For debugging

    // If response is successful and has credits data
    if (response.ok && data && (data.credits !== undefined)) {
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          credits: data.credits
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
        status: response.status,
        usedHeader: authHeader // For debugging
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
