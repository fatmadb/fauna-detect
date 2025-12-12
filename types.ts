export interface AnimalCandidate {
  name: string;
  confidence: number;
}

export interface IdentificationResult {
  candidates: AnimalCandidate[];
  description: string;
  scientificName: string;
}

export interface AnalysisState {
  status: 'idle' | 'analyzing' | 'success' | 'error';
  result: IdentificationResult | null;
  error: string | null;
}
