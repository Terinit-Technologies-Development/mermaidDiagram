
export interface AppState {
  code: string;
  error: string | null;
  apiKey: string | null;
  isSettingsOpen: boolean;
  isDiffOpen: boolean;
  aiFixedCode: string | null;
  isGenerating: boolean;
}

export enum Theme {
  Light = 'light',
  Dark = 'dark'
}
