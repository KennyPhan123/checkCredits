const fetch = require('node-fetch');

exports.handler = async function(event) {
  try {
    const apiKey = event.queryStringParameters.key;
    
    const response = await fetch('https://api.unify.ai/v0/credits', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });

    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: 'Failed to check credits' })
    };
  }
};
