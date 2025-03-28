// Definindo tipos globais para o projeto

interface Window {
  OLLAMA_API_URL?: string;
  OLLAMA_MODEL?: string;
}

declare global {
  interface Window {
    OLLAMA_API_URL?: string;
    OLLAMA_MODEL?: string;
  }
} 