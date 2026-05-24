/** Pointer angle → ring progress 0–1 (0 = top, clockwise). */
export function progressFromClientPoint(clientX: number, clientY: number, rect: DOMRect): number {
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const angle = Math.atan2(clientY - cy, clientX - cx);
  let progress = (angle + Math.PI / 2) / (2 * Math.PI);
  if (progress < 0) progress += 1;
  if (progress >= 1) progress -= 1;
  return progress;
}

/** Clockwise delta between two progress samples on [0, 1). */
export function clockwiseProgressDelta(from: number, to: number): number {
  let delta = to - from;
  if (delta < -0.5) delta += 1;
  if (delta > 0.5) delta -= 1;
  return delta > 0 ? delta : 0;
}
