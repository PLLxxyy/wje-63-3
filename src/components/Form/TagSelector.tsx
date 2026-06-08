import type { BenchTag } from '../../types/bench';
import { BENCH_TAGS, TAG_ICONS, TAG_COLORS } from '../../types/bench';

interface TagSelectorProps {
  selectedTags: BenchTag[];
  onChange: (tags: BenchTag[]) => void;
}

export default function TagSelector({ selectedTags, onChange }: TagSelectorProps) {
  const toggleTag = (tag: BenchTag) => {
    if (selectedTags.includes(tag)) {
      onChange(selectedTags.filter((t) => t !== tag));
    } else {
      onChange([...selectedTags, tag]);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-stone-700" style={{ fontFamily: "'Lora', serif" }}>
        标签
      </label>
      <div className="flex flex-wrap gap-2">
        {BENCH_TAGS.map((tag) => {
          const isSelected = selectedTags.includes(tag);
          return (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${
                isSelected
                  ? `${TAG_COLORS[tag]} shadow-md scale-105`
                  : 'bg-white/60 text-stone-600 border-stone-200 hover:bg-white hover:border-amber-200'
              }`}
              style={{ fontFamily: "'Lora', serif" }}
            >
              <span className="text-base">{TAG_ICONS[tag]}</span>
              <span>{tag}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
