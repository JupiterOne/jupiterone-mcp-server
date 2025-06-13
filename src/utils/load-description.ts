// src/utils/load-description.ts
import { descriptionMap } from '../generated/description-map.js';

export function loadDescription(filename: string): string {
  return descriptionMap[filename] ?? '';
}
