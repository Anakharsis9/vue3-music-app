export async function getFileHash(file: File) {
  const operations = window.crypto.subtle;
  const ALGO_NAME = 'SHA-256';

  const fileBuffer = await getArrayBuffer(file);
  const hashBuffer = await operations.digest(ALGO_NAME, fileBuffer);

  return bufferToHex(hashBuffer);
}

function getArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = (error) => reject(error);
  });
}

function bufferToHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}
