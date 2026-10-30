// Keep the camera's near plane clear of the room's walls, carpet and coffers.
export const INTERIOR_BOUNDS = Object.freeze({
  minX: -20.45, maxX: 20.45,
  minY: 0.8, maxY: 5.15,
  minZ: -17.15, maxZ: 17.15,
});

export function confineInteriorCamera(position, target) {
  const b = INTERIOR_BOUNDS;
  for (const [axis, min, max] of [
    ['x', b.minX, b.maxX], ['y', b.minY, b.maxY], ['z', b.minZ, b.maxZ],
  ]) {
    position[axis] = Math.max(min, Math.min(max, position[axis]));
    target[axis] = Math.max(min, Math.min(max, target[axis]));
  }
}
