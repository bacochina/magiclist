// Som de metrônomo antigo, codificado em base64 para uso direto sem necessidade de arquivo externo

// Som de "tick" (tempo normal)
export const TICK_SOUND_BASE64 = "SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tAwAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAAElgCFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWF//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAWFAAAAAAAABJYSsrwoAAAAAAD/+xDEAAAKIAFp9BAAJHAGL3wAgAQiYgAAkA+ADAACAIAhUzM5i9JnldKcygN2Pk7pXdwuBwOB3S7vBPg+8HD5P8oCA5/KAgIcCAfB8/8PvU/5QEOBDg+/B8Hwf//xwYQhCEYQhOleCg6btsDZtALKgSBKFSASyBKEgSBQLAGUvwKB4EgWQJQsCwEguBv//hQMBYCQXA38HwfB//////wfB8HwfB8HwfB8HwfB8HwfB8HwfB8H";

// Som de "tock" (primeiro tempo/acento)
export const TOCK_SOUND_BASE64 = "SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tAwAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAAElgCFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWF//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAWjAAAAAAAABJYlFyjIAAAAAAD/+xDEAAAJTAFn9AAAJKoALX6CAASHF3ve973ve9QIOFBQgILvCgoe8OChYQILCB4QEDwUP/Cg4eEBA9//hQcP///Cg4QEDwgIHvCggQdFDgoQED3hQUP//8KHgoQPCB4KChA8+FAAAAAAAGfAwEAgEBAIGfAwEAgYCAQM+DgYGAgYCAQCAQCAQM+BgIBAwEBAIBAIGAgZ8HAwEAgYCAQCAQCBn//wMBAIGAgIBAwEAgEDPgYCBgIGAgEDAQM////+BgIGAgEDAQCAQM+BgIBAwEBAIGAgZ8DPg4GAgEDAQCAQCBn//4GfAwEDPgYCAQM+BgIGfAwEAgYCBgIGfA=";

// Carregar um som a partir da string base64
export function loadSoundFromBase64(base64String) {
  // Criar buffer de áudio a partir da string base64
  const byteString = atob(base64String);
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const intArray = new Uint8Array(arrayBuffer);
  
  for (let i = 0; i < byteString.length; i++) {
    intArray[i] = byteString.charCodeAt(i);
  }
  
  return arrayBuffer;
} 