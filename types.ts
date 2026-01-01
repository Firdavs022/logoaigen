
export type LogoStyle = 'minimalist' | '3d' | 'vintage' | 'futuristic' | 'hand-drawn' | 'gradient' | 'luxury';

export interface LogoGenerationOptions {
  prompt: string;
  style: LogoStyle;
  aspectRatio: '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
}

export interface GeneratedLogo {
  id: string;
  url: string;
  prompt: string;
  style: LogoStyle;
  createdAt: number;
}
