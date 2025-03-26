import { Eye, FileEdit, Trash2 } from 'lucide-react';
import Image from 'next/image';

interface CardField {
  key: string;
  label?: string;
  render?: (value: any, item: any) => React.ReactNode;
  isTitle?: boolean;
  isSubtitle?: boolean;
  isBadge?: boolean;
}

interface DataCardsProps {
  fields: CardField[];
  data: any[];
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  titleField: string;
  imageField?: string;
  descriptionFields?: CardField[];
}

export function DataCards({
  fields,
  data,
  onView,
  onEdit,
  onDelete,
  titleField,
  imageField,
  descriptionFields
}: DataCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map((item) => (
        <div key={item.id} className="bg-card/20 rounded-lg border border-border overflow-hidden hover:bg-card/40 transition-colors">
          <div className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {item[titleField]}
                </h3>
                {fields.map((field) => (
                  <p key={field.key} className="text-muted-foreground text-sm">
                    <span className="font-medium">{field.label}:</span>{" "}
                    {field.render ? field.render(item[field.key], item) : item[field.key]}
                  </p>
                ))}
              </div>
              {imageField && (
                <div className="flex-shrink-0">
                  <Image
                    src={item[imageField]}
                    alt={item[titleField]}
                    width={64}
                    height={64}
                    className="rounded-lg"
                  />
                </div>
              )}
            </div>

            {descriptionFields && (
              <div className="mt-4">
                {descriptionFields.map((field) => (
                  <p key={field.key} className="mt-3 text-muted-foreground text-sm line-clamp-2">
                    <span className="font-medium">{field.label}:</span>{" "}
                    {field.render ? field.render(item[field.key], item) : item[field.key]}
                  </p>
                ))}
              </div>
            )}
          </div>

          {(onView || onEdit || onDelete) && (
            <div className="bg-card/40 px-4 py-3 flex justify-end space-x-2 border-t border-border">
              {onView && (
                <button
                  onClick={() => onView(item)}
                  className="text-muted-foreground hover:text-info transition-colors"
                >
                  <Eye size={18} />
                </button>
              )}
              {onEdit && (
                <button
                  onClick={() => onEdit(item)}
                  className="text-muted-foreground hover:text-warning transition-colors"
                >
                  <FileEdit size={18} />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(item)}
                  className="text-muted-foreground hover:text-danger transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          )}
        </div>
      ))}

      {data.length === 0 && (
        <div className="col-span-full bg-card/20 rounded-lg p-6 text-center border border-border">
          <p className="text-muted-foreground">Nenhum registro encontrado</p>
        </div>
      )}
    </div>
  );
} 