import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

interface PageHeaderProps {
  title: string
  description: string
  showBackButton?: boolean
}

export function PageHeader({ title, description, showBackButton = true }: PageHeaderProps) {
  const router = useRouter()

  return (
    <div className="mb-8">
      {showBackButton && (
        <button 
          onClick={() => router.back()}
          className="text-muted-foreground hover:text-primary flex items-center mb-4 transition-colors duration-200"
        >
          <ArrowLeft className="mr-2" size={16} />
          Voltar
        </button>
      )}
      <h1 className="text-3xl font-bold text-foreground mb-2">{title}</h1>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
} 