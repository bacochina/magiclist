'use client';

// Componente de formulário simplificado para novas bandas
export default function NovaBandaPreview() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Nova Banda</h1>
      
      <div className="bg-slate-800 rounded-lg p-6 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Nome da Banda *</label>
          <input 
            type="text" 
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md"
            placeholder="Nome da banda"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Gênero *</label>
          <select className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md">
            <option value="">Selecione um gênero</option>
            <option value="rock">Rock</option>
            <option value="pop">Pop</option>
            <option value="jazz">Jazz</option>
            <option value="blues">Blues</option>
            <option value="metal">Metal</option>
            <option value="folk">Folk</option>
            <option value="reggae">Reggae</option>
            <option value="gospel">Gospel</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Descrição</label>
          <textarea 
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md min-h-[150px]"
            placeholder="Descreva a banda, sua história, estilo musical, etc."
          ></textarea>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Ano de Formação</label>
          <input 
            type="number" 
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md"
            placeholder="Ex: 2023"
            min="1900"
            max="2099"
          />
        </div>
        
        <div className="pt-4 flex justify-end space-x-3">
          <button className="px-4 py-2 rounded-md bg-slate-700 text-white">Cancelar</button>
          <button className="px-4 py-2 rounded-md bg-purple-600 text-white">Salvar</button>
        </div>
      </div>
    </div>
  );
} 