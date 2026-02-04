import { catAnimations } from './catAnimations';
import { dogAnimations } from './dogAnimations';
import type { PetState, Animal } from './types';

/**
 * Get the first frame of ASCII art for a pet in a given state.
 * Used for static rendering on Wall posts and OG images.
 */
export function getStaticPetFrame(animal: Animal, state: PetState = 'idle') {
  const animations = animal === 'dog' ? dogAnimations : catAnimations;
  const animation = animations[state] || animations.idle;
  const frame = animation.frames[0];
  return {
    lines: frame.lines,
    colors: frame.colors,
  };
}
