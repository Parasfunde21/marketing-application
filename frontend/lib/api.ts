const apiBase = import.meta.env.VITE_API_BASE_URL;

async function request(path: string, body: unknown) {
  const response = await fetch(`${apiBase}/functions/v1/${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}

export const generatePost = (payload: unknown) => request('generatePost', payload);
export const generateImage = (payload: unknown) => request('generateImage', payload);
export const generateVideo = (payload: unknown) => request('generateVideo', payload);
export const schedulePost = (payload: unknown) => request('schedulePost', payload);
export const optimizeCampaign = (payload: unknown) => request('optimizeCampaign', payload);
