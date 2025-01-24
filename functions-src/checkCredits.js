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

    console.log('Making request with auth:', authHeader); // Debug log

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
    console.log('API Response:', data); // Debug log

    // Log the full response for debugging
    console.log('Response status:', response.status);
    console.log('Response data:', data);

    // If we get any kind of response with credits, consider it successful
    if (data && data.credits !== undefined) {
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

    // If we get here, something went wrong
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        error: true,
        debug: {
          status: response.status,
          data: data
        }
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
        error: true,
        debug: {
          message: error.message,
          stack: error.stack
        }
      })
    };
  }
};