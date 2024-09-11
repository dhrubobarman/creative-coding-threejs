import * as THREE from "three";

export function createElement<T extends keyof HTMLElementTagNameMap>(
  tag: T,
  attributes?: Partial<HTMLElementTagNameMap[T]>,
  insertToApp: string | boolean = true
): HTMLElementTagNameMap[T] {
  const element = document.createElement(tag);
  if (attributes) {
    Object.assign(element, attributes);
  }
  if (typeof insertToApp === "string") {
    document.querySelector(insertToApp)?.appendChild(element);
  } else if (insertToApp) {
    document.querySelector("#app")?.appendChild(element);
  }
  return element;
}

export const getSphearePoint = (radius: number) => {
  const halfRadius = radius * 0.5;
  radius *= Math.random() - halfRadius;
  const u = Math.random();
  const v = Math.random();
  const theta = 2 * Math.PI * u;
  const phi = Math.acos(2 * v - 1);

  return new THREE.Vector3(
    radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.sin(phi) * Math.sin(theta),
    radius * Math.cos(phi)
  );
};
