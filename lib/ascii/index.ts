/**
 * ASCII Pet Animations - Main Export
 */

export * from './types';
export { catAnimations } from './catAnimations';
export { dogAnimations } from './dogAnimations';

import { catAnimations } from './catAnimations';
import { dogAnimations } from './dogAnimations';
import type { Animal, PetAnimations } from './types';

/**
 * Get animations for a specific animal
 */
export function getAnimations(animal: Animal): PetAnimations {
  return animal === 'cat' ? catAnimations : dogAnimations;
}
