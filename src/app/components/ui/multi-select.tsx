import { Button } from "@/components/ui/button"
import { ChevronsUpDown } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput } from "@/components/ui/command"
import { CommandItem } from "@/components/ui/command"
import { Check, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface MultiSelectProps {
  options: { value: string; label: string }[]
  selected: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  className?: string
}

export function MultiSelect({ 
  options, 
  selected, 
  onChange, 
  placeholder = "Selecione...", 
  className 
}: MultiSelectProps) {
  const title = selected.length > 0
    ? `${selected.length} selecionado${selected.length === 1 ? '' : 's'}`
    : placeholder;

  return (
    <div className="relative">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className={cn(
              "w-full justify-between rounded-xl bg-gray-800/50 border border-white/20 text-sm text-white",
              "focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-sm",
              "transition-all duration-200 ease-in-out px-3 py-2 h-9",
              !selected.length && "text-gray-400",
              className
            )}
          >
            {title}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 bg-gray-800/50 backdrop-blur-sm border border-white/20">
          <Command className="bg-transparent">
            <CommandInput 
              placeholder="Buscar banda..." 
              className="text-white placeholder-gray-400 focus:outline-none focus:ring-0 bg-transparent"
            />
            <CommandEmpty className="py-6 text-center text-sm text-gray-400">
              Nenhuma banda encontrada.
            </CommandEmpty>
            <CommandGroup className="max-h-60 overflow-auto">
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => {
                    onChange(
                      selected.includes(option.value)
                        ? selected.filter((item) => item !== option.value)
                        : [...selected, option.value]
                    )
                  }}
                  className={cn(
                    "aria-selected:bg-gray-700/50 text-white hover:bg-gray-700/50",
                    "focus:bg-gray-700/50 focus:outline-none cursor-pointer"
                  )}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selected.includes(option.value)
                        ? "opacity-100 text-indigo-500"
                        : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      <div className="flex gap-1 flex-wrap mt-1">
        {selected.map((value) => {
          const option = options.find((opt) => opt.value === value)
          return option ? (
            <Badge
              key={value}
              variant="secondary"
              className="bg-gray-700/50 text-white border border-white/10 hover:bg-gray-600/50"
            >
              {option.label}
              <button
                className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-indigo-500"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    onChange(selected.filter((s) => s !== value))
                  }
                }}
                onMouseDown={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
                onClick={() => onChange(selected.filter((s) => s !== value))}
              >
                <X className="h-3 w-3 text-gray-400 hover:text-white transition-colors" />
              </button>
            </Badge>
          ) : null
        })}
      </div>
    </div>
  )
}

export default MultiSelect 