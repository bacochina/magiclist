import { Eye, FileEdit, Trash2 } from 'lucide-react';

interface Column {
  key: string;
  label: string;
  render?: (value: any, item: any) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function DataTable({
  columns,
  data,
  onView,
  onEdit,
  onDelete
}: DataTableProps) {
  return (
    <div className="bg-card border-border rounded-lg border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-card/40">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                >
                  {column.label}
                </th>
              ))}
              {(onView || onEdit || onDelete) && (
                <th className="px-6 py-4 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Ações
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-card/20">
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-card/40 transition-colors">
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                    {column.render ? column.render(item[column.key], item) : item[column.key]}
                  </td>
                ))}
                {(onView || onEdit || onDelete) && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm space-x-3">
                    {onView && (
                      <button
                        onClick={() => onView(item.id)}
                        className="text-muted-foreground hover:text-info transition-colors"
                      >
                        <Eye size={18} />
                      </button>
                    )}
                    {onEdit && (
                      <button
                        onClick={() => onEdit(item.id)}
                        className="text-muted-foreground hover:text-warning transition-colors"
                      >
                        <FileEdit size={18} />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(item.id)}
                        className="text-muted-foreground hover:text-danger transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className="px-6 py-4 text-center">
                  <div className="text-muted-foreground">Nenhum registro encontrado</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 