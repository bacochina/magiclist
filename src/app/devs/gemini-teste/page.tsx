"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

export default function GeminiTestePage() {
  const [apiKey, setApiKey] = useState("");
  const [savedApiKey, setSavedApiKey] = useState("");
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [testStatus, setTestStatus] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => {
    // Tenta recuperar a chave da API do localStorage ao carregar a página
    const storedApiKey = localStorage.getItem("gemini_api_key");
    if (storedApiKey) {
      setApiKey(storedApiKey);
      setSavedApiKey(storedApiKey);
    }
  }, []);

  const saveApiKey = () => {
    localStorage.setItem("gemini_api_key", apiKey);
    setSavedApiKey(apiKey);
    setTestStatus("idle");
    setError("");
  };

  const testApiKey = async () => {
    setLoading(true);
    setError("");
    setResponse("");
    setTestStatus("idle");
    
    try {
      const result = await fetch("https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: "Responda apenas com a palavra 'OK' para testar a conectividade."
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topP: 0.8,
            topK: 40,
            maxOutputTokens: 10
          }
        })
      });

      const data = await result.json();
      
      if (!result.ok) {
        throw new Error(data.error?.message || "Erro na API do Gemini");
      }
      
      if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        setTestStatus("success");
      } else {
        throw new Error("Formato de resposta inválido");
      }
    } catch (err) {
      console.error("Erro ao testar API:", err);
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      setTestStatus("error");
    } finally {
      setLoading(false);
    }
  };

  const sendPrompt = async () => {
    if (!prompt.trim()) {
      setError("Por favor, digite um prompt");
      return;
    }

    setLoading(true);
    setResponse("");
    setError("");
    
    try {
      const result = await fetch("https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": savedApiKey
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topP: 0.8,
            topK: 40,
            maxOutputTokens: 2048
          }
        })
      });

      const data = await result.json();
      
      if (!result.ok) {
        throw new Error(data.error?.message || "Erro na API do Gemini");
      }
      
      if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        setResponse(data.candidates[0].content.parts[0].text);
      } else {
        throw new Error("Formato de resposta inválido");
      }
    } catch (err) {
      console.error("Erro ao enviar prompt:", err);
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Teste da API Gemini</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Configuração da API</CardTitle>
            <CardDescription>Configure sua chave de API do Gemini para realizar testes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div>
                <Label htmlFor="api-key">Chave de API do Gemini</Label>
                <div className="flex gap-2 mt-1">
                  <Input 
                    id="api-key"
                    type="text" 
                    placeholder="Insira sua chave de API do Gemini"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)} 
                  />
                  <Button onClick={saveApiKey}>Salvar</Button>
                  <Button 
                    variant="outline" 
                    onClick={testApiKey}
                    disabled={!savedApiKey || loading}
                  >
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Testar
                  </Button>
                </div>
              </div>

              {testStatus === "success" && (
                <Alert className="bg-green-50 border-green-200">
                  <AlertTitle className="text-green-800">Conectado com sucesso!</AlertTitle>
                  <AlertDescription className="text-green-700">
                    Sua chave de API do Gemini está funcionando corretamente.
                  </AlertDescription>
                </Alert>
              )}

              {testStatus === "error" && (
                <Alert variant="destructive">
                  <AlertTitle>Falha na conexão</AlertTitle>
                  <AlertDescription>
                    {error || "Não foi possível conectar à API do Gemini. Verifique sua chave e tente novamente."}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Enviar Prompt</CardTitle>
            <CardDescription>Teste a API enviando um prompt personalizado</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div>
                <Label htmlFor="prompt">Prompt</Label>
                <Textarea 
                  id="prompt"
                  placeholder="Digite seu prompt aqui" 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="h-24"
                />
              </div>
              
              {error && (
                <Alert variant="destructive">
                  <AlertTitle>Erro</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {response && (
                <div className="mt-4">
                  <Label>Resposta:</Label>
                  <div className="bg-gray-50 p-4 rounded-md border mt-1 whitespace-pre-wrap">
                    {response}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={sendPrompt}
              disabled={!savedApiKey || loading}
              className="w-full"
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Enviar Prompt
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 