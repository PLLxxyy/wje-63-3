export type BenchTag =
  | '适合阅读'
  | '适合午睡'
  | '有夕阳'
  | '人少'
  | '有树荫';

export type EnvironmentType =
  | '公园'
  | '江边'
  | '街角'
  | '校园'
  | '其他';

export interface Bench {
  id: string;
  name: string;
  location: string;
  description: string;
  city: string;
  lat: number;
  lng: number;
  photos: string[];
  tags: BenchTag[];
  environmentType: EnvironmentType;
  createdAt: string;
  updatedAt: string;
}

export interface FilterState {
  tags: BenchTag[];
  city: string;
  environmentType: EnvironmentType | null;
}

export const BENCH_TAGS: BenchTag[] = [
  '适合阅读',
  '适合午睡',
  '有夕阳',
  '人少',
  '有树荫',
];

export const ENVIRONMENT_TYPES: EnvironmentType[] = [
  '公园',
  '江边',
  '街角',
  '校园',
  '其他',
];

export const TAG_ICONS: Record<BenchTag, string> = {
  '适合阅读': '📖',
  '适合午睡': '😴',
  '有夕阳': '🌅',
  '人少': '🤫',
  '有树荫': '🌳',
};

export const TAG_COLORS: Record<BenchTag, string> = {
  '适合阅读': 'bg-amber-100 text-amber-800 border-amber-200',
  '适合午睡': 'bg-indigo-100 text-indigo-800 border-indigo-200',
  '有夕阳': 'bg-orange-100 text-orange-800 border-orange-200',
  '人少': 'bg-emerald-100 text-emerald-800 border-emerald-200',
  '有树荫': 'bg-green-100 text-green-800 border-green-200',
};
