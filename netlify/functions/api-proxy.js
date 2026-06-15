const API_TARGET = 'https://ctd-learns-node-l42tx.ondigitalocean.app';

function cleanSetCookie(cookie) {
  return cookie
    .replace(/; *Secure/gi, '')
    .replace(/; *SameSite=None/gi, '')
    .replace(/; *Domain=[^;]+/gi, '');
}

exports.handler = async function handler(event) {
  const apiPath = event.path.replace('/.netlify/functions/api-proxy', '');
  const queryString = event.rawQuery ? `?${event.rawQuery}` : '';
  const targetUrl = `${API_TARGET}/api${apiPath}${queryString}`;

  const requestHeaders = { ...event.headers };

  delete requestHeaders.host;
  delete requestHeaders['content-length'];

  const fetchOptions = {
    method: event.httpMethod,
    headers: requestHeaders,
  };

  if (event.body && event.httpMethod !== 'GET' && event.httpMethod !== 'HEAD') {
    fetchOptions.body = event.isBase64Encoded
      ? Buffer.from(event.body, 'base64')
      : event.body;
  }

  try {
    const apiResponse = await fetch(targetUrl, fetchOptions);
    const responseBody = await apiResponse.text();

    const responseHeaders = {};

    apiResponse.headers.forEach((value, key) => {
      if (
        key.toLowerCase() !== 'set-cookie' &&
        key.toLowerCase() !== 'content-encoding' &&
        key.toLowerCase() !== 'content-length' &&
        key.toLowerCase() !== 'transfer-encoding'
      ) {
        responseHeaders[key] = value;
      }
    });

    const response = {
      statusCode: apiResponse.status,
      headers: responseHeaders,
      body: responseBody,
    };

    const cookies =
      typeof apiResponse.headers.getSetCookie === 'function'
        ? apiResponse.headers.getSetCookie()
        : apiResponse.headers.get('set-cookie')
          ? [apiResponse.headers.get('set-cookie')]
          : [];

    if (cookies.length > 0) {
      response.multiValueHeaders = {
        'Set-Cookie': cookies.map(cleanSetCookie),
      };
    }

    return response;
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Netlify API proxy error',
        error: error.message,
      }),
    };
  }
};