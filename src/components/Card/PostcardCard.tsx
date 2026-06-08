import { useState } from 'react';
import { MapPin, Calendar, Edit2, Trash2, X, Share2 } from 'lucide-react';
import type { Bench } from '../../types/bench';
import { TAG_ICONS, TAG_COLORS } from '../../types/bench';
import { useBenchStore } from '../../store/useBenchStore';
import PhotoCarousel from './PhotoCarousel';
import Modal from '../Layout/Modal';
import AddBenchForm from '../Form/AddBenchForm';

interface PostcardCardProps {
  bench: Bench;
  onClose: () => void;
}

export default function PostcardCard({ bench, onClose }: PostcardCardProps) {
  const { deleteBench } = useBenchStore();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleDelete = () => {
    deleteBench(bench.id);
    onClose();
  };

  if (isEditing) {
    return (
      <Modal
        isOpen={true}
        onClose={() => setIsEditing(false)}
        title="编辑长椅信息"
        maxWidth="max-w-2xl"
      >
        <AddBenchForm
          onClose={() => setIsEditing(false)}
          editingBench={bench}
        />
      </Modal>
    );
  }

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
        onClick={onClose}
        style={{ animation: 'fadeIn 0.2s ease-out' }}
      />

      <div
        className="relative w-full max-w-3xl"
        style={{ animation: 'scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
      >
        <div className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 rounded-3xl shadow-2xl overflow-hidden border-2 border-amber-200">
          <div
            className="absolute top-0 left-0 right-0 h-3"
            style={{
              background:
                'repeating-linear-gradient(90deg, #F5F0E8, #F5F0E8 10px, #E8DCC8 10px, #E8DCC8 20px)',
            }}
          />
          <div
            className="absolute bottom-0 left-0 right-0 h-3"
            style={{
              background:
                'repeating-linear-gradient(90deg, #F5F0E8, #F5F0E8 10px, #E8DCC8 10px, #E8DCC8 20px)',
            }}
          />

          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-10 p-2 bg-white/80 hover:bg-white rounded-full shadow-lg transition-all hover:scale-110"
          >
            <X className="w-5 h-5 text-stone-600" />
          </button>

          <div className="relative p-8 pt-12">
            <div className="absolute top-8 right-16 w-20 h-20 opacity-20 pointer-events-none">
              <div className="w-full h-full rounded-full border-4 border-amber-600 flex items-center justify-center rotate-12">
                <div className="text-center text-amber-700 font-bold text-xs leading-tight">
                  <div>CITY</div>
                  <div>BENCH</div>
                  <div>MAP</div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="order-2 md:order-1 space-y-6">
                <div>
                  <h2
                    className="text-3xl font-bold text-stone-800 mb-2"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {bench.name}
                  </h2>
                  <div className="flex items-center gap-2 text-stone-500">
                    <MapPin className="w-4 h-4 text-amber-600" />
                    <span style={{ fontFamily: "'Lora', serif" }}>
                      {bench.location}
                      {bench.city && <span className="text-amber-700"> · {bench.city}</span>}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-stone-100 text-stone-600 rounded-full text-sm border border-stone-200" style={{ fontFamily: "'Lora', serif" }}>
                    {bench.environmentType}
                  </span>
                  {bench.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${TAG_COLORS[tag]}`}
                      style={{ fontFamily: "'Lora', serif" }}
                    >
                      <span>{TAG_ICONS[tag]}</span>
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="relative">
                  <div
                    className="text-stone-700 leading-relaxed pl-4 border-l-4 border-amber-300"
                    style={{ fontFamily: "'Lora', serif" }}
                  >
                    {bench.description || '暂无描述'}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-stone-400">
                  <Calendar className="w-4 h-4" />
                  <span style={{ fontFamily: "'Lora', serif" }}>
                    记录于 {formatDate(bench.createdAt)}
                  </span>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/80 text-stone-600 border border-stone-200 hover:bg-white hover:shadow-md transition-all font-medium"
                    style={{ fontFamily: "'Lora', serif" }}
                  >
                    <Edit2 className="w-4 h-4" />
                    编辑
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 hover:shadow-md transition-all font-medium"
                    style={{ fontFamily: "'Lora', serif" }}
                  >
                    <Trash2 className="w-4 h-4" />
                    删除
                  </button>
                  <button
                    onClick={() => {
                      const text = `${bench.name} - ${bench.location}\n${bench.description}\n标签: ${bench.tags.join(', ')}`;
                      navigator.clipboard.writeText(text);
                      alert('信息已复制到剪贴板！');
                    }}
                    className="p-2.5 rounded-xl bg-white/80 text-stone-600 border border-stone-200 hover:bg-white hover:shadow-md transition-all"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="order-1 md:order-2">
                <div
                  className="p-3 bg-white rounded-2xl shadow-lg rotate-1 hover:rotate-0 transition-transform duration-300"
                  style={{
                    boxShadow:
                      '0 10px 40px -10px rgba(0,0,0,0.2), 0 4px 10px -5px rgba(0,0,0,0.1)',
                  }}
                >
                  <PhotoCarousel photos={bench.photos} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <Modal
          isOpen={true}
          onClose={() => setShowDeleteConfirm(false)}
          title="确认删除"
          maxWidth="max-w-md"
        >
          <div className="space-y-6">
            <p className="text-stone-600" style={{ fontFamily: "'Lora', serif" }}>
              确定要删除「{bench.name}」吗？此操作无法撤销。
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-white/80 text-stone-600 border border-stone-200 hover:bg-white transition-all font-medium"
                style={{ fontFamily: "'Lora', serif" }}
              >
                取消
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-all font-medium"
                style={{ fontFamily: "'Lora', serif" }}
              >
                确认删除
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
