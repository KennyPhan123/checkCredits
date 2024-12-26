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

    // Check if the response contains credits
    if (data && data.credits !== undefined) {
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      };
    } else {
      // If credits is undefined but we got a response
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          error: 'Invalid API key or no credits information available',
          originalResponse: data 
        })
      };
    }

  } catch (error) {
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
