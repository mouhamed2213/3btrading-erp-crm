import { useRef, useState } from 'react';
import { ImagePlus, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';

type ImageGalleryFieldProps = {
  value: string[];
  onChange: (value: string[]) => void;
  maxImages?: number;
};

const readAsBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result ?? '');
      resolve(result.split(',')[1] ?? '');
    };
    reader.onerror = () => reject(reader.error ?? new Error('Lecture de l’image impossible.'));
    reader.readAsDataURL(file);
  });

export function ImageGalleryField({ value, onChange, maxImages = 6 }: ImageGalleryFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const uploadImage = trpc.catalogue.uploadImage.useMutation();

  const handleFiles = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []).slice(0, maxImages - value.length);
    if (!files.length) return;

    setIsUploading(true);
    try {
      const uploaded: string[] = [];
      for (const file of files) {
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
          throw new Error('Formats acceptés : JPG, PNG ou WebP.');
        }
        if (file.size > 8 * 1024 * 1024) {
          throw new Error('Chaque image doit faire 8 Mo maximum.');
        }
        const dataBase64 = await readAsBase64(file);
        const result = await uploadImage.mutateAsync({
          fileName: file.name,
          contentType: file.type,
          dataBase64,
        });
        uploaded.push(result.url);
      }
      onChange([...value, ...uploaded]);
      toast.success(`${uploaded.length} image(s) ajoutée(s) à la fiche.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Impossible d’ajouter l’image.');
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3 rounded-xl border border-dashed border-slate-300 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">Photos de la publication</p>
          <p className="text-xs text-slate-500">JPG, PNG ou WebP · 8 Mo maximum par image · {value.length}/{maxImages}</p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isUploading || value.length >= maxImages}
          onClick={() => inputRef.current?.click()}
        >
          {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ImagePlus className="mr-2 h-4 w-4" />}
          Ajouter des photos
        </Button>
        <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden" onChange={handleFiles} />
      </div>

      {value.length ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {value.map((url, index) => (
            <div key={`${url}-${index}`} className="relative aspect-[4/3] overflow-hidden rounded-lg bg-slate-100">
              <img src={url} alt={`Photo ${index + 1}`} className="h-full w-full object-cover" />
              {index === 0 && <span className="absolute left-2 bottom-2 rounded bg-slate-950/80 px-2 py-1 text-[10px] font-bold text-white">Photo principale</span>}
              <button
                type="button"
                className="absolute right-2 top-2 rounded-full bg-white/90 p-1 text-slate-700 shadow hover:bg-white"
                aria-label={`Supprimer la photo ${index + 1}`}
                onClick={() => onChange(value.filter((_, itemIndex) => itemIndex !== index))}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex min-h-24 items-center justify-center rounded-lg bg-slate-50 text-center text-sm text-slate-500">
          Ajoutez au moins une photo pour renforcer la publication vitrine.
        </div>
      )}
    </div>
  );
}
