import { KanbanEstudos } from './components/KanbanEstudos';

export default function EstudosPage() {
  return (
    <div className="min-h-screen relative">
      {/* Background específico para estudos */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M30 30h30v-2H30v2zm0-8h30v-2H30v2zm0-8h30v-2H30v2zm0-8h30V4H30v2zm0-8h30V-4H30v2zM0 30h30v-2H0v2zm0-8h30v-2H0v2zm0-8h30v-2H0v2zm0-8h30V4H0v2zm0-8h30V-4H0v2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Conteúdo da página */}
      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-xl">
            <h1 className="text-3xl font-bold text-white mb-6">Estudos</h1>
            <p className="mt-2 text-gray-600">Organize seus estudos e acompanhe seu progresso</p>
            <KanbanEstudos />
          </div>
        </div>
      </div>
    </div>
  );
} 