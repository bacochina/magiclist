"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

type StyleProperty = {
  property: string;
  value: string;
  preview?: boolean;
};

type ComponentStyle = {
  name: string;
  styles: StyleProperty[];
};

type StyleGroup = {
  name: string;
  components: ComponentStyle[];
};

const styleGroups: StyleGroup[] = [
  {
    name: "Layout",
    components: [
      {
        name: "Container Principal",
        styles: [
          { property: "Background", value: "bg-slate-950" },
          { property: "Padding", value: "p-4 md:p-8" },
          { property: "Max Width", value: "max-w-7xl" },
          { property: "Margin", value: "mx-auto" },
          { property: "Min Height", value: "min-h-screen" },
        ],
      },
      {
        name: "Grid Layout",
        styles: [
          { property: "Display", value: "grid" },
          { property: "Gap", value: "gap-4 md:gap-6" },
          { property: "Columns (Desktop)", value: "md:grid-cols-2 lg:grid-cols-3" },
          { property: "Responsivo", value: "grid-cols-1" },
          { property: "Padding", value: "p-4" },
        ],
      },
      {
        name: "Flex Container",
        styles: [
          { property: "Display", value: "flex" },
          { property: "Direction", value: "flex-col md:flex-row" },
          { property: "Align", value: "items-center" },
          { property: "Justify", value: "justify-between" },
          { property: "Gap", value: "gap-4" },
          { property: "Padding", value: "p-4" },
        ],
      },
    ],
  },
  {
    name: "Formulários",
    components: [
      {
        name: "Input",
        styles: [
          { property: "Fonte", value: "font-sans" },
          { property: "Tamanho", value: "text-sm" },
          { property: "Altura", value: "h-10" },
          { property: "Padding", value: "px-3 py-2" },
          { property: "Borda", value: "border border-slate-700" },
          { property: "Borda (Foco)", value: "ring-2 ring-purple-500" },
          { property: "Background", value: "bg-slate-900" },
          { property: "Texto", value: "text-white" },
          { property: "Placeholder", value: "text-slate-400" },
          { property: "Arredondamento", value: "rounded-md" },
          { property: "Transição", value: "transition-all" },
          { property: "Shadow", value: "shadow-sm" },
        ],
      },
      {
        name: "Select",
        styles: [
          { property: "Fonte", value: "font-sans" },
          { property: "Tamanho", value: "text-sm" },
          { property: "Altura", value: "h-10" },
          { property: "Background", value: "bg-slate-900" },
          { property: "Borda", value: "border border-slate-700" },
          { property: "Dropdown BG", value: "bg-slate-800" },
          { property: "Padding", value: "px-3 py-2" },
          { property: "Arredondamento", value: "rounded-md" },
          { property: "Shadow", value: "shadow-sm" },
        ],
      },
      {
        name: "Label",
        styles: [
          { property: "Fonte", value: "font-sans" },
          { property: "Tamanho", value: "text-sm" },
          { property: "Cor", value: "text-slate-200" },
          { property: "Peso", value: "font-medium" },
          { property: "Margem", value: "mb-1.5" },
        ],
      },
    ],
  },
  {
    name: "Tipografia",
    components: [
      {
        name: "Título Principal",
        styles: [
          { property: "Fonte", value: "font-sans" },
          { property: "Peso", value: "font-bold" },
          { property: "Tamanho", value: "text-3xl md:text-4xl" },
          { property: "Espaçamento", value: "tracking-tight" },
          { property: "Cor", value: "text-white" },
          { property: "Margem", value: "mb-4" },
          { property: "Linha", value: "leading-tight" },
        ],
      },
      {
        name: "Subtítulo",
        styles: [
          { property: "Fonte", value: "font-sans" },
          { property: "Peso", value: "font-medium" },
          { property: "Tamanho", value: "text-lg" },
          { property: "Cor", value: "text-slate-200" },
          { property: "Margem", value: "mb-2" },
          { property: "Linha", value: "leading-relaxed" },
        ],
      },
      {
        name: "Texto",
        styles: [
          { property: "Fonte", value: "font-sans" },
          { property: "Tamanho", value: "text-sm md:text-base" },
          { property: "Cor", value: "text-slate-300" },
          { property: "Linha", value: "leading-relaxed" },
          { property: "Margem", value: "mb-4" },
        ],
      },
    ],
  },
  {
    name: "Componentes Interativos",
    components: [
      {
        name: "Botão Primário",
        styles: [
          { property: "Background", value: "bg-purple-600" },
          { property: "Hover", value: "hover:bg-purple-700" },
          { property: "Texto", value: "text-white" },
          { property: "Padding", value: "px-4 py-2" },
          { property: "Borda", value: "rounded-md" },
          { property: "Transição", value: "transition-colors" },
          { property: "Shadow", value: "shadow-sm" },
          { property: "Shadow Hover", value: "hover:shadow-md" },
          { property: "Escala Hover", value: "hover:scale-[1.02]" },
          { property: "Fonte", value: "font-medium" },
        ],
      },
      {
        name: "Card",
        styles: [
          { property: "Background", value: "bg-slate-950" },
          { property: "Borda", value: "border border-slate-800" },
          { property: "Arredondamento", value: "rounded-lg" },
          { property: "Sombra", value: "shadow-lg" },
          { property: "Padding", value: "p-6" },
          { property: "Backdrop", value: "backdrop-blur-sm" },
          { property: "Background Opacity", value: "bg-opacity-50" },
        ],
      },
      {
        name: "Badge",
        styles: [
          { property: "Background", value: "bg-slate-800" },
          { property: "Texto", value: "text-slate-200" },
          { property: "Tamanho", value: "text-xs" },
          { property: "Padding", value: "px-2 py-0.5" },
          { property: "Arredondamento", value: "rounded-full" },
          { property: "Fonte", value: "font-medium" },
        ],
      },
    ],
  },
  {
    name: "Tabelas",
    components: [
      {
        name: "Table Container",
        styles: [
          { property: "Width", value: "w-full" },
          { property: "Background", value: "bg-slate-900/50" },
          { property: "Borda", value: "border border-slate-800" },
          { property: "Arredondamento", value: "rounded-lg" },
          { property: "Overflow", value: "overflow-hidden" },
        ],
      },
      {
        name: "Table Header",
        styles: [
          { property: "Background", value: "bg-slate-900" },
          { property: "Texto", value: "text-slate-200" },
          { property: "Fonte", value: "font-medium" },
          { property: "Tamanho", value: "text-sm" },
          { property: "Padding", value: "px-4 py-3" },
          { property: "Borda", value: "border-b border-slate-800" },
        ],
      },
      {
        name: "Table Cell",
        styles: [
          { property: "Padding", value: "px-4 py-3" },
          { property: "Texto", value: "text-slate-300" },
          { property: "Tamanho", value: "text-sm" },
          { property: "Borda", value: "border-b border-slate-800" },
          { property: "Hover", value: "hover:bg-slate-900/50" },
        ],
      },
    ],
  },
  {
    name: "Efeitos e Animações",
    components: [
      {
        name: "Transições",
        styles: [
          { property: "Cores", value: "transition-colors duration-200" },
          { property: "Opacidade", value: "transition-opacity duration-200" },
          { property: "Transformação", value: "transition-transform duration-200" },
          { property: "Sombra", value: "transition-shadow duration-200" },
        ],
      },
      {
        name: "Hover Effects",
        styles: [
          { property: "Escala", value: "hover:scale-105" },
          { property: "Brilho", value: "hover:brightness-110" },
          { property: "Opacidade", value: "hover:opacity-90" },
          { property: "Ring", value: "hover:ring-2 hover:ring-purple-500" },
        ],
      },
      {
        name: "Loading States",
        styles: [
          { property: "Pulse", value: "animate-pulse" },
          { property: "Spin", value: "animate-spin" },
          { property: "Ping", value: "animate-ping" },
          { property: "Bounce", value: "animate-bounce" },
        ],
      },
    ],
  },
];

export function StylesTable() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-white">Estilos da Página</h3>
      <ScrollArea className="h-[400px] pr-4">
        <Accordion type="single" collapsible className="space-y-2">
          {styleGroups.map((group) => (
            <AccordionItem key={group.name} value={group.name} className="bg-slate-900/50 rounded-lg">
              <AccordionTrigger className="px-4 hover:no-underline hover:bg-slate-900">
                <div className="flex items-center gap-2">
                  <span>{group.name}</span>
                  <Badge variant="outline" className="ml-2">
                    {group.components.length}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="w-[200px]">Componente</TableHead>
                      <TableHead className="w-[150px]">Propriedade</TableHead>
                      <TableHead>Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {group.components.map((component) =>
                      component.styles.map((style, styleIndex) => (
                        <TableRow
                          key={`${component.name}-${style.property}`}
                          className="hover:bg-slate-900/50"
                        >
                          {styleIndex === 0 ? (
                            <TableCell
                              className="font-medium text-white"
                              rowSpan={component.styles.length}
                            >
                              {component.name}
                            </TableCell>
                          ) : null}
                          <TableCell className="text-slate-300">
                            {style.property}
                          </TableCell>
                          <TableCell className="font-mono text-sm text-slate-300">
                            {style.value}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </ScrollArea>
    </div>
  );
} 