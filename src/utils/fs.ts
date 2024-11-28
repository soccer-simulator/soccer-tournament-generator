export async function loadBinaryFile(url: string): Promise<Blob> {
  const response = await fetch(url);
  return response.blob();
}

export async function loadBinaryFileAsBase64(url: string): Promise<string> {
  const blob = await loadBinaryFile(url);
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(blob);
    fileReader.onloadend = () => {
      const { result } = fileReader;
      if (typeof result !== 'string') {
        reject(new Error('Unable to load file as base64 string'));
        return;
      }
      resolve(result);
    };
    fileReader.onerror = (error: unknown) => {
      reject(error);
    };
  });
}

type Base64 = {
  mimeType: string;
  data: string;
};

export function extractBinaryFileDataFromBase64(base64: string): Base64 {
  const match = base64.match(/^data:(.+);base64,(.+)$/);
  if (match === null) {
    throw new Error('Unable to extract base64 data from string');
  }
  const [, mimeType, data] = match;
  return { mimeType, data };
}
