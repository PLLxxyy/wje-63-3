import { useState, useEffect } from 'react';
import { MapPin, Save, X, Loader2 } from 'lucide-react';
import { useBenchStore } from '../../store/useBenchStore';
import type { Bench, BenchTag, EnvironmentType } from '../../types/bench';
import { ENVIRONMENT_TYPES } from '../../types/bench';
import { reverseGeocode } from '../../utils/geocoding';
import PhotoUploader from './PhotoUploader';
import TagSelector from './TagSelector';

interface AddBenchFormProps {
  onClose: () => void;
  editingBench?: Bench | null;
}

export default function AddBenchForm({ onClose, editingBench }: AddBenchFormProps) {
  const { addBench, updateBench, pendingLocation } = useBenchStore();
  const [loading, setLoading] = useState(false);
  const [geocoding, setGeocoding] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    city: '',
    photos: [] as string[],
    tags: [] as BenchTag[],
    environmentType: '公园' as EnvironmentType,
    lat: 0,
    lng: 0,
  });

  useEffect(() => {
    if (editingBench) {
      setFormData({
        name: editingBench.name,
        location: editingBench.location,
        description: editingBench.description,
        city: editingBench.city,
        photos: editingBench.photos,
        tags: editingBench.tags,
        environmentType: editingBench.environmentType,
        lat: editingBench.lat,
        lng: editingBench.lng,
      });
    } else if (pendingLocation) {
      setFormData((prev) => ({
        ...prev,
        lat: pendingLocation.lat,
        lng: pendingLocation.lng,
      }));
      fetchCityName(pendingLocation.lat, pendingLocation.lng);
    }
  }, [editingBench, pendingLocation]);

  const fetchCityName = async (lat: number, lng: number) => {
    setGeocoding(true);
    try {
      const result = await reverseGeocode(lat, lng);
      setFormData((prev) => ({
        ...prev,
        city: result.city,
        location: result.address || prev.location,
      }));
    } finally {
      setGeocoding(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      if (editingBench) {
        updateBench(editingBench.id, formData);
      } else {
        addBench(formData);
      }
      setLoading(false);
      onClose();
    }, 500);
  };

  const isFormValid = formData.name.trim() && formData.location.trim();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 bg-gradient-to-r from-amber-100/50 to-orange-100/50 rounded-2xl border border-amber-200/50">
        <div className="flex items-center gap-2 text-stone-700">
          <MapPin className="w-4 h-4 text-amber-600" />
          <span className="text-sm" style={{ fontFamily: "'Lora', serif" }}>
            {geocoding ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                正在获取位置信息...
              </span>
            ) : (
              <>
                位置: {formData.lat.toFixed(4)}, {formData.lng.toFixed(4)}
                {formData.city && <span className="text-amber-700"> · {formData.city}</span>}
              </>
            )}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2" style={{ fontFamily: "'Lora', serif" }}>
            长椅名称 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="给这张长椅起个名字"
            className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white/80 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all text-stone-800"
            style={{ fontFamily: "'Lora', serif" }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2" style={{ fontFamily: "'Lora', serif" }}>
            所在公园或街区 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="例如：复兴公园西门、西湖苏堤入口"
            className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white/80 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all text-stone-800"
            style={{ fontFamily: "'Lora', serif" }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2" style={{ fontFamily: "'Lora', serif" }}>
            城市
          </label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            placeholder="所在城市"
            className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white/80 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all text-stone-800"
            style={{ fontFamily: "'Lora', serif" }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2" style={{ fontFamily: "'Lora', serif" }}>
            环境类型
          </label>
          <div className="flex flex-wrap gap-2">
            {ENVIRONMENT_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setFormData({ ...formData, environmentType: type })}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  formData.environmentType === type
                    ? 'bg-amber-500 text-white shadow-md'
                    : 'bg-white/60 text-stone-600 border border-stone-200 hover:border-amber-200'
                }`}
                style={{ fontFamily: "'Lora', serif" }}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2" style={{ fontFamily: "'Lora', serif" }}>
            环境描述
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="描述一下这里的环境、氛围、适合做什么..."
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white/80 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all resize-none text-stone-800"
            style={{ fontFamily: "'Lora', serif" }}
          />
        </div>

        <TagSelector
          selectedTags={formData.tags}
          onChange={(tags) => setFormData({ ...formData, tags })}
        />

        <PhotoUploader
          photos={formData.photos}
          onChange={(photos) => setFormData({ ...formData, photos })}
        />
      </div>

      <div className="flex gap-3 pt-4 border-t border-stone-200">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/60 text-stone-600 border border-stone-200 hover:bg-white transition-all font-medium"
          style={{ fontFamily: "'Lora', serif" }}
        >
          <X className="w-4 h-4" />
          取消
        </button>
        <button
          type="submit"
          disabled={!isFormValid || loading}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium hover:shadow-lg hover:shadow-orange-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ fontFamily: "'Lora', serif" }}
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {editingBench ? '保存修改' : '添加长椅'}
        </button>
      </div>
    </form>
  );
}
