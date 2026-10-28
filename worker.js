
const ALLOWED_FOLDERS = new Set([
  '1cnQyN_nfIiT0LbQeUUU_NdLuzsC0YOpL',
  '1z2WQtbSArhmz9Cj3pkQvwTCYGCwogHt8',
]);

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Cache-Control': 'public, max-age=3600',
    'Vary': 'Origin',
    'X-Content-Type-Options': 'nosniff',
  };
}

export default {
  async fetch(request, env) {
    const requestUrl = new URL(request.url);
    const origin = request.headers.get('Origin') || '*';
    const headers = corsHeaders(origin);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers });
    }

    if (request.method !== 'GET') {
      return new Response('Method not allowed', {
        status: 405,
        headers,
      });
    }

    const fileId = requestUrl.searchParams.get('id');
    const resourceKey = requestUrl.searchParams.get('resourceKey');

    if (!fileId || !/^[a-zA-Z0-9_-]+$/.test(fileId)) {
      return new Response('Missing or invalid image ID', {
        status: 400,
        headers,
      });
    }

    if (!env.GOOGLE_DRIVE_API_KEY) {
      return new Response('Worker is missing GOOGLE_DRIVE_API_KEY', {
        status: 500,
        headers,
      });
    }

    const resourceHeaders = new Headers();

    if (resourceKey) {
      resourceHeaders.set(
        'X-Goog-Drive-Resource-Keys',
        `${fileId}/${resourceKey}`,
      );
    }

    const metadataUrl = new URL(
      `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}`,
    );

    metadataUrl.searchParams.set('key', env.GOOGLE_DRIVE_API_KEY);
    metadataUrl.searchParams.set('fields', 'id,mimeType,parents,capabilities(canDownload)');

    let metadataResponse;

    try {
      metadataResponse = await fetch(metadataUrl.toString(), {
        headers: resourceHeaders,
      });
    } catch {
      return new Response('Could not reach Google Drive', {
        status: 502,
        headers,
      });
    }

    if (!metadataResponse.ok) {
      return new Response(
        `Google Drive metadata request failed (${metadataResponse.status})`,
        { status: 502, headers },
      );
    }

    const metadata = await metadataResponse.json();

    if (
      !metadata.parents ||
      !metadata.parents.some((parent) => ALLOWED_FOLDERS.has(parent))
    ) {
      return new Response('This file is not in an allowed gallery folder', {
        status: 403,
        headers,
      });
    }

    if (!metadata.mimeType || !metadata.mimeType.startsWith('image/')) {
      return new Response('The requested file is not an image', {
        status: 415,
        headers,
      });
    }

    if (metadata.capabilities?.canDownload === false) {
      return new Response('Google Drive does not allow this file to be downloaded', {
        status: 403,
        headers,
      });
    }

    const mediaUrl = new URL(
      `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}`,
    );

    mediaUrl.searchParams.set('alt', 'media');
    mediaUrl.searchParams.set('key', env.GOOGLE_DRIVE_API_KEY);

    let mediaResponse;

    try {
      mediaResponse = await fetch(mediaUrl.toString(), {
        headers: resourceHeaders,
      });
    } catch {
      return new Response('Could not retrieve image data from Google Drive', {
        status: 502,
        headers,
      });
    }

    if (!mediaResponse.ok) {
      return new Response(
        `Google Drive image request failed (${mediaResponse.status})`,
        { status: 502, headers },
      );
    }

    const contentType = mediaResponse.headers.get('Content-Type') || metadata.mimeType;

    if (!contentType.startsWith('image/')) {
      return new Response('Google Drive did not return image data', {
        status: 502,
        headers,
      });
    }

    const responseHeaders = new Headers(headers);
    responseHeaders.set('Content-Type', contentType);

    const length = mediaResponse.headers.get('Content-Length');
    if (length) responseHeaders.set('Content-Length', length);

    return new Response(mediaResponse.body, {
      status: 200,
      headers: responseHeaders,
    });
  },
};
