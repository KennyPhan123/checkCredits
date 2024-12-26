const fetch = require('node-fetch');

exports.handler = async function(event) {
  try {
    let apiKey = event.queryStringParameters.key;
    
    // Clean the API key and handle special characters
    apiKey = decodeURIComponent(apiKey);
    
    // Make sure Bearer is properly formatted
    const authHeader = apiKey.startsWith('Bearer ') 
      ? apiKey 
      : `Bearer ${apiKey}`;

    console.log('Making request...'); // For debugging

    const response = await fetch('https://api.unify.ai/v0/credits', {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'Credits-Checker/1.0'
      }
    });

    const data = await response.json();

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
        details: data
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
