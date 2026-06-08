import { Download, Filter, MapPin } from 'lucide-react';
import { useBenchStore } from '../../store/useBenchStore';

export default function Header() {
  const { exportData, setFilterOpen, isFilterOpen, benches } = useBenchStore();

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.geojson,application/geo+json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const content = event.target?.result as string;
            useBenchStore.getState().importData(content);
            alert('数据导入成功！');
          } catch {
            alert('导入失败，请检查文件格式');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-amber-50/95 via-orange-50/95 to-rose-50/95 backdrop-blur-md border-b border-amber-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-200">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-stone-800 tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>
                城市长椅地图
              </h1>
              <p className="text-xs text-stone-500" style={{ fontFamily: "'Lora', serif" }}>
                发现城市里的静谧角落
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/60 rounded-full border border-amber-200/50">
              <MapPin className="w-4 h-4 text-amber-600" />
              <span className="text-sm text-stone-600" style={{ fontFamily: "'Lora', serif" }}>
                已标记 {benches.length} 张长椅
              </span>
            </div>

            <button
              onClick={() => setFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                isFilterOpen
                  ? 'bg-amber-500 text-white shadow-lg shadow-amber-200'
                  : 'bg-white/80 text-stone-700 hover:bg-white hover:shadow-md border border-amber-200/50'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium hidden sm:inline" style={{ fontFamily: "'Lora', serif" }}>
                筛选
              </span>
            </button>

            <button
              onClick={handleImport}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 text-stone-700 hover:bg-white hover:shadow-md border border-amber-200/50 transition-all duration-300"
            >
              <Download className="w-4 h-4 rotate-180" />
              <span className="text-sm font-medium" style={{ fontFamily: "'Lora', serif" }}>
                导入
              </span>
            </button>

            <button
              onClick={exportData}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-lg hover:shadow-emerald-200 transition-all duration-300"
            >
              <Download className="w-4 h-4" />
              <span className="text-sm font-medium hidden sm:inline" style={{ fontFamily: "'Lora', serif" }}>
                导出
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
