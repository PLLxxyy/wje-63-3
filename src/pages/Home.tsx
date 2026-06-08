import { Plus } from 'lucide-react';
import Header from '@/components/Layout/Header';
import BenchMap from '@/components/Map/BenchMap';
import FilterPanel from '@/components/Filter/FilterPanel';
import PostcardCard from '@/components/Card/PostcardCard';
import Modal from '@/components/Layout/Modal';
import AddBenchForm from '@/components/Form/AddBenchForm';
import { useBenchStore } from '@/store/useBenchStore';

export default function Home() {
  const {
    selectedBench,
    selectBench,
    isAdding,
    setAdding,
    isFilterOpen,
  } = useBenchStore();

  return (
    <div className="w-full h-full flex flex-col bg-amber-50">
      <Header />

      <main className="flex-1 relative mt-16">
        <div
          className={`h-full transition-all duration-300 ${
            isFilterOpen ? 'lg:mr-80' : 'lg:mr-0'
          }`}
        >
          <BenchMap />
        </div>

        <FilterPanel />

        <button
          onClick={() => setAdding(!isAdding)}
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[1000] flex items-center gap-2 px-6 py-3 rounded-full shadow-lg transition-all duration-300 ${
            isAdding
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-xl hover:scale-105'
          }`}
        >
          <Plus className={`w-5 h-5 transition-transform ${isAdding ? 'rotate-45' : ''}`} />
          <span className="font-medium" style={{ fontFamily: "'Lora', serif" }}>
            {isAdding ? '取消添加' : '添加长椅'}
          </span>
        </button>
      </main>

      {isAdding && (
        <Modal
          isOpen={true}
          onClose={() => setAdding(false)}
          title="添加新长椅"
          maxWidth="max-w-2xl"
        >
          <AddBenchForm onClose={() => setAdding(false)} />
        </Modal>
      )}

      {selectedBench && (
        <PostcardCard
          bench={selectedBench}
          onClose={() => selectBench(null)}
        />
      )}
    </div>
  );
}