import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { alertaSucesso, alertaErro } from '@/lib/sweetalert'
import { toast } from 'sonner'

interface Banda {
  id: string
  nome: string
  genero?: string
}

interface Show {
  id?: string
  banda_id: string
  data: string
  local: string
  contato: string
  telefone_contato: string
  status: string
  cache_bruto: string
  observacoes: string
}

interface ShowFormProps {
  initialData?: Show
  isEditing?: boolean
}

export function ShowForm({ initialData, isEditing = false }: ShowFormProps) {
  const router = useRouter()
  const [bandas, setBandas] = useState<Banda[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingBandas, setIsLoadingBandas] = useState(true)
  const [formData, setFormData] = useState<Show>(
    initialData || {
      banda_id: "",
      data: format(new Date(), "yyyy-MM-dd"),
      local: "",
      contato: "",
      telefone_contato: "",
      status: "Negociação",
      cache_bruto: "",
      observacoes: ""
    }
  )

  // Buscar bandas
  useEffect(() => {
    const fetchBandas = async () => {
      try {
        setIsLoadingBandas(true)
        const response = await fetch('/api/bandas')
        if (!response.ok) throw new Error('Erro ao buscar bandas')
        const responseData = await response.json()
        
        // Verificar se a resposta tem o formato esperado
        let bandasArray: Banda[] = []
        
        if (responseData.data && Array.isArray(responseData.data)) {
          // Formato: { data: [...bandas] }
          bandasArray = responseData.data
        } else if (Array.isArray(responseData)) {
          // Formato: [...bandas]
          bandasArray = responseData
        } else if (responseData.bandas && Array.isArray(responseData.bandas)) {
          // Formato { bandas: [...bandas] }
          bandasArray = responseData.bandas
        } else {
          console.error('Formato da resposta não reconhecido:', responseData)
          bandasArray = []
        }
        
        setBandas(bandasArray)
      } catch (error) {
        console.error('Erro ao buscar bandas:', error)
        toast.error('Erro ao carregar bandas')
        setBandas([])
      } finally {
        setIsLoadingBandas(false)
      }
    }

    fetchBandas()
  }, [])

  // Função para atualizar o estado do formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Função para atualizar campos de select
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Função para atualizar a data
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData(prev => ({ ...prev, data: format(date, "yyyy-MM-dd") }))
    }
  }

  // Função para submeter o formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validar campos obrigatórios
      if (!formData.banda_id) {
        toast.error('Selecione uma banda')
        setIsLoading(false)
        return
      }

      if (!formData.data) {
        toast.error('Selecione uma data')
        setIsLoading(false)
        return
      }

      if (!formData.status) {
        toast.error('Selecione um status')
        setIsLoading(false)
        return
      }

      // Criar ou atualizar o show
      const endpoint = isEditing 
        ? `/api/eventos/shows/${initialData?.id}` 
        : '/api/eventos/shows'
      
      const method = isEditing ? 'PUT' : 'POST'

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Erro ao salvar show')
      }

      alertaSucesso(isEditing ? 'Show atualizado com sucesso!' : 'Show adicionado com sucesso!')
      router.push('/eventos/shows')
    } catch (error) {
      console.error('Erro ao salvar show:', error)
      alertaErro('Erro ao salvar show')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Banda */}
        <div className="space-y-2">
          <Label htmlFor="banda_id">Banda <span className="text-red-500">*</span></Label>
          <Select 
            value={formData.banda_id} 
            onValueChange={(value) => handleSelectChange('banda_id', value)}
            disabled={isLoadingBandas}
          >
            <SelectTrigger id="banda_id" className="w-full bg-gray-900 border-gray-600 text-white">
              <SelectValue placeholder={isLoadingBandas ? "Carregando bandas..." : "Selecione uma banda"} />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-600">
              {isLoadingBandas ? (
                <SelectItem value="loading" disabled className="text-white">
                  Carregando bandas...
                </SelectItem>
              ) : bandas && bandas.length > 0 ? (
                bandas.map((banda) => (
                  <SelectItem key={banda.id} value={banda.id} className="text-white hover:bg-gray-800">
                    {banda.nome}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="empty" disabled className="text-white">
                  Nenhuma banda encontrada
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Data */}
        <div className="space-y-2">
          <Label htmlFor="data">Data <span className="text-red-500">*</span></Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal bg-gray-900 border-gray-600 text-white hover:bg-gray-800"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.data
                  ? format(new Date(formData.data), "PPP", { locale: ptBR })
                  : "Selecione uma data"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-gray-900 border-gray-600">
              <Calendar
                mode="single"
                selected={formData.data ? new Date(formData.data) : undefined}
                onSelect={handleDateChange}
                initialFocus
                locale={ptBR}
                className="bg-gray-900 text-white"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Local */}
        <div className="space-y-2">
          <Label htmlFor="local">Local</Label>
          <Input
            id="local"
            name="local"
            className="bg-gray-900 border-gray-600 text-white"
            value={formData.local}
            onChange={handleChange}
          />
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label htmlFor="status">Status <span className="text-red-500">*</span></Label>
          <Select 
            value={formData.status} 
            onValueChange={(value) => handleSelectChange('status', value)}
          >
            <SelectTrigger id="status" className="w-full bg-gray-900 border-gray-600 text-white">
              <SelectValue placeholder="Selecione um status" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-600">
              {["Confirmado", "Negociação", "Reservado", "Cancelado"].map((status) => (
                <SelectItem key={status} value={status} className="text-white hover:bg-gray-800">
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Contato */}
        <div className="space-y-2">
          <Label htmlFor="contato">Contato</Label>
          <Input
            id="contato"
            name="contato"
            className="bg-gray-900 border-gray-600 text-white"
            value={formData.contato}
            onChange={handleChange}
          />
        </div>

        {/* Telefone Contato */}
        <div className="space-y-2">
          <Label htmlFor="telefone_contato">Telefone</Label>
          <Input
            id="telefone_contato"
            name="telefone_contato"
            className="bg-gray-900 border-gray-600 text-white"
            value={formData.telefone_contato}
            onChange={handleChange}
          />
        </div>

        {/* Cachê Bruto */}
        <div className="space-y-2">
          <Label htmlFor="cache_bruto">Cachê Bruto (R$)</Label>
          <Input
            id="cache_bruto"
            name="cache_bruto"
            type="number"
            step="0.01"
            min="0"
            className="bg-gray-900 border-gray-600 text-white"
            value={formData.cache_bruto}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Observações */}
      <div className="space-y-2">
        <Label htmlFor="observacoes">Observações</Label>
        <Textarea
          id="observacoes"
          name="observacoes"
          rows={4}
          className="bg-gray-900 border-gray-600 text-white"
          value={formData.observacoes}
          onChange={handleChange}
        />
      </div>

      <div className="flex justify-end space-x-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => router.push('/eventos/shows')}
          className="border-gray-600 text-white hover:bg-gray-800"
        >
          Cancelar
        </Button>
        <Button 
          type="submit"
          disabled={isLoading || isLoadingBandas}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isLoading ? (
            <>
              <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              Salvando...
            </>
          ) : (
            isEditing ? 'Atualizar Show' : 'Adicionar Show'
          )}
        </Button>
      </div>
    </form>
  )
} 