'use client';

import React from 'react';

interface BasicInfoFormProps {
  formData: {
    nome: string;
    artista: string;
    tom: string;
    bpm: string;
    genero: string;
    observacoes: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

const TONALIDADES = [
  'C', 'C#/Db', 'D', 'D#/Eb', 'E', 'F', 
  'F#/Gb', 'G', 'G#/Ab', 'A', 'A#/Bb', 'B',
  'Cm', 'C#m/Dbm', 'Dm', 'D#m/Ebm', 'Em', 'Fm', 
  'F#m/Gbm', 'Gm', 'G#m/Abm', 'Am', 'A#m/Bbm', 'Bm'
];

const GENEROS = [
  'Rock', 'Pop', 'Jazz', 'Blues', 'Folk', 'Country',
  'R&B', 'Soul', 'Funk', 'Disco', 'Eletrônica', 'Clássica',
  'Hip Hop', 'Rap', 'Reggae', 'Metal', 'Punk', 'Gospel',
  'MPB', 'Samba', 'Bossa Nova', 'Forró', 'Sertanejo', 'Outro'
];

export default function BasicInfoForm({ formData, handleChange }: BasicInfoFormProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-white">Informações Básicas</h3>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Nome da música */}
        <div>
          <label htmlFor="nome" className="block text-sm font-medium text-gray-300">
            Nome da Música
          </label>
          <input
            type="text"
            name="nome"
            id="nome"
            value={formData.nome}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-700 bg-gray-900 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm text-white"
            placeholder="ex: Wonderwall"
          />
        </div>

        {/* Artista */}
        <div>
          <label htmlFor="artista" className="block text-sm font-medium text-gray-300">
            Artista
          </label>
          <input
            type="text"
            name="artista"
            id="artista"
            value={formData.artista}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-700 bg-gray-900 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm text-white"
            placeholder="ex: Oasis"
          />
        </div>

        {/* Tom */}
        <div>
          <label htmlFor="tom" className="block text-sm font-medium text-gray-300">
            Tom
          </label>
          <select
            id="tom"
            name="tom"
            value={formData.tom}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-700 bg-gray-900 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm text-white"
          >
            <option value="">Selecione um tom</option>
            {TONALIDADES.map((tom) => (
              <option key={tom} value={tom}>
                {tom}
              </option>
            ))}
          </select>
        </div>

        {/* BPM */}
        <div>
          <label htmlFor="bpm" className="block text-sm font-medium text-gray-300">
            BPM
          </label>
          <input
            type="number"
            name="bpm"
            id="bpm"
            value={formData.bpm}
            onChange={handleChange}
            min="40"
            max="220"
            className="mt-1 block w-full rounded-md border-gray-700 bg-gray-900 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm text-white"
            placeholder="ex: 120"
          />
        </div>

        {/* Gênero */}
        <div>
          <label htmlFor="genero" className="block text-sm font-medium text-gray-300">
            Gênero
          </label>
          <select
            id="genero"
            name="genero"
            value={formData.genero}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-700 bg-gray-900 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm text-white"
          >
            <option value="">Selecione um gênero</option>
            {GENEROS.map((genero) => (
              <option key={genero} value={genero}>
                {genero}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Observações */}
      <div>
        <label htmlFor="observacoes" className="block text-sm font-medium text-gray-300">
          Observações
        </label>
        <textarea
          id="observacoes"
          name="observacoes"
          rows={3}
          value={formData.observacoes}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-700 bg-gray-900 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm text-white"
          placeholder="Digite suas observações sobre a música aqui..."
        />
      </div>
    </div>
  );
} 