import { X, MapPin } from 'lucide-react';
import { useBenchStore } from '../../store/useBenchStore';
import { BENCH_TAGS, ENVIRONMENT_TYPES, TAG_ICONS, TAG_COLORS } from '../../types/bench';
import type { BenchTag, EnvironmentType } from '../../types/bench';

export default function FilterPanel() {
  const {
    isFilterOpen,
    setFilterOpen,
    filters,
    toggleTagFilter,
    setCityFilter,
    setEnvironmentFilter,
    clearFilters,
    getCities,
    getFilteredBenches,
    benches,
  } = useBenchStore();

  const cities = getCities();
  const filteredCount = getFilteredBenches().length;
  const hasActiveFilters =
    filters.tags.length > 0 ||
    filters.city !== '' ||
    filters.environmentType !== null;

  return (
    <>
      {isFilterOpen && (
        <div
          className="fixed inset-0 bg-stone-900/30 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setFilterOpen(false)}
        />
      )}

      <aside
        className={`fixed top-16 right-0 bottom-0 z-50 w-full sm:w-80 bg-gradient-to-b from-amber-50/98 to-orange-50/98 backdrop-blur-md border-l border-amber-200/50 shadow-2xl transform transition-transform duration-300 ease-out lg:translate-x-0 ${
          isFilterOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-amber-200/50">
            <h3
              className="text-lg font-bold text-stone-800"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              筛选条件
            </h3>
            <button
              onClick={() => setFilterOpen(false)}
              className="p-2 rounded-xl hover:bg-white/60 text-stone-500 hover:text-stone-700 transition-all lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
            {hasActiveFilters && (
              <div className="p-3 bg-amber-100/50 rounded-xl border border-amber-200/50">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-amber-800" style={{ fontFamily: "'Lora', serif" }}>
                    显示 {filteredCount} / {benches.length} 张长椅
                  </span>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-amber-600 hover:text-amber-800 font-medium"
                    style={{ fontFamily: "'Lora', serif" }}
                  >
                    清除筛选
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <label className="block text-sm font-medium text-stone-700" style={{ fontFamily: "'Lora', serif" }}>
                按标签筛选
              </label>
              <div className="flex flex-wrap gap-2">
                {BENCH_TAGS.map((tag: BenchTag) => {
                  const isSelected = filters.tags.includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => toggleTagFilter(tag)}
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

            <div className="space-y-3">
              <label className="block text-sm font-medium text-stone-700" style={{ fontFamily: "'Lora', serif" }}>
                按城市筛选
              </label>
              {cities.length > 0 ? (
                <div className="space-y-2">
                  <button
                    onClick={() => setCityFilter('')}
                    className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all flex items-center gap-2 ${
                      filters.city === ''
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-white/60 text-stone-600 hover:bg-white'
                    }`}
                    style={{ fontFamily: "'Lora', serif" }}
                  >
                    <MapPin className="w-4 h-4" />
                    全部城市
                  </button>
                  {cities.map((city) => (
                    <button
                      key={city}
                      onClick={() => setCityFilter(city)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all flex items-center gap-2 ${
                        filters.city === city
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-white/60 text-stone-600 hover:bg-white'
                      }`}
                      style={{ fontFamily: "'Lora', serif" }}
                    >
                      <MapPin className="w-4 h-4" />
                      {city}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-stone-400" style={{ fontFamily: "'Lora', serif" }}>
                  暂无城市数据
                </p>
              )}
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-stone-700" style={{ fontFamily: "'Lora', serif" }}>
                按环境类型筛选
              </label>
              <div className="space-y-2">
                <button
                  onClick={() => setEnvironmentFilter(null)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all ${
                    filters.environmentType === null
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-white/60 text-stone-600 hover:bg-white'
                  }`}
                  style={{ fontFamily: "'Lora', serif" }}
                >
                  全部类型
                </button>
                {ENVIRONMENT_TYPES.map((type: EnvironmentType) => (
                  <button
                    key={type}
                    onClick={() => setEnvironmentFilter(type)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all ${
                      filters.environmentType === type
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-white/60 text-stone-600 hover:bg-white'
                    }`}
                    style={{ fontFamily: "'Lora', serif" }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-amber-200/50">
            <div className="text-center text-sm text-stone-500" style={{ fontFamily: "'Lora', serif" }}>
              共 {benches.length} 张长椅 · 显示 {filteredCount} 张
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
