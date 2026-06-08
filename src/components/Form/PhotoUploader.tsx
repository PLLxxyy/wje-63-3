import { useCallback, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface PhotoUploaderProps {
  photos: string[];
  onChange: (photos: string[]) => void;
  maxPhotos?: number;
  maxSizeMB?: number;
}

export default function PhotoUploader({
  photos,
  onChange,
  maxPhotos = 3,
  maxSizeMB = 2,
}: PhotoUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;

      const remainingSlots = maxPhotos - photos.length;
      const filesToProcess = Array.from(files).slice(0, remainingSlots);

      filesToProcess.forEach((file) => {
        if (file.size > maxSizeMB * 1024 * 1024) {
          alert(`图片 ${file.name} 超过 ${maxSizeMB}MB 限制`);
          return;
        }

        if (!file.type.startsWith('image/')) {
          alert(`文件 ${file.name} 不是图片格式`);
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          onChange([...photos, result]);
        };
        reader.readAsDataURL(file);
      });
    },
    [photos, onChange, maxPhotos, maxSizeMB]
  );

  const removePhoto = (index: number) => {
    onChange(photos.filter((_, i) => i !== index));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-stone-700" style={{ fontFamily: "'Lora', serif" }}>
        现场照片 ({photos.length}/{maxPhotos})
      </label>

      <div className="grid grid-cols-3 gap-3">
        {photos.map((photo, index) => (
          <div
            key={index}
            className="relative aspect-square rounded-2xl overflow-hidden bg-stone-100 group shadow-md"
            style={{
              transform: `rotate(${(index - 1) * 2}deg)`,
              transition: 'transform 0.3s ease',
            }}
          >
            <img
              src={photo}
              alt={`照片 ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => removePhoto(index)}
              className="absolute top-1 right-1 p-1.5 bg-red-500/90 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
            >
              <X className="w-3 h-3" />
            </button>
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}

        {photos.length < maxPhotos && (
          <div
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="aspect-square rounded-2xl border-2 border-dashed border-amber-300 bg-white/50 flex flex-col items-center justify-center cursor-pointer hover:border-amber-400 hover:bg-amber-50/50 transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Upload className="w-5 h-5 text-amber-600" />
            </div>
            <span className="text-xs text-stone-500" style={{ fontFamily: "'Lora', serif" }}>
              点击或拖拽上传
            </span>
          </div>
        )}

        {photos.length === 0 && maxPhotos > 1 && (
          <>
            {Array.from({ length: Math.min(2, maxPhotos - 1) }).map((_, i) => (
              <div
                key={`placeholder-${i}`}
                className="aspect-square rounded-2xl border-2 border-dashed border-stone-200 bg-stone-50/30 flex items-center justify-center"
              >
                <ImageIcon className="w-6 h-6 text-stone-300" />
              </div>
            ))}
          </>
        )}
      </div>

      <p className="text-xs text-stone-400" style={{ fontFamily: "'Lora', serif" }}>
        支持 JPG、PNG 格式，单张不超过 {maxSizeMB}MB
      </p>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
