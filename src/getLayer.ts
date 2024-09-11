import * as THREE from "three";

const loader = new THREE.TextureLoader();

function getSprite({
  hasFog,
  color,
  opacity,
  path,
  pos,
  size,
}: {
  hasFog: boolean;
  color: THREE.Color;
  opacity: number;
  path: string;
  pos: THREE.Vector3;
  size: number;
}) {
  const spriteMat = new THREE.SpriteMaterial({
    color,
    fog: hasFog,
    map: loader.load(path),
    transparent: true,
    opacity,
  });
  spriteMat.color.offsetHSL(0, 0, Math.random() * 0.2 - 0.1);
  const sprite = new THREE.Sprite(spriteMat);
  sprite.position.set(pos.x, -pos.y, pos.z);
  size += Math.random() - 0.5;
  sprite.scale.set(size, size, size);
  sprite.material.rotation = 0;
  return sprite;
}

type GetLayerProps = {
  hasFog?: boolean;
  hue?: number;
  numSprites?: number;
  opacity?: number;
  path?: string;
  radius?: number;
  sat?: number;
  size?: number;
  light?: number;
  z?: number;
  hex?: number;
};
function getLayer({
  hasFog = true,
  hue = 0.0,
  numSprites = 10,
  opacity = 1,
  path = "/rad-grad.png",
  radius = 1,
  sat = 0.5,
  size = 1,
  light = 1,
  z = 0,
  hex,
}: GetLayerProps) {
  const layerGroup = new THREE.Group();
  for (let i = 0; i < numSprites; i += 1) {
    let angle = (i / numSprites) * Math.PI * 2;
    const pos = new THREE.Vector3(
      Math.cos(angle) * Math.random() * radius,
      Math.sin(angle) * Math.random() * radius,
      z + Math.random()
    );
    // const length = new THREE.Vector3(pos.x, pos.y, 0).length();
    // const hue = 0.0; // (0.9 - (radius - length) / radius) * 1;

    let color = new THREE.Color().setHSL(hue, sat, light, "srgb");
    if (hex) color = new THREE.Color(hex);
    const sprite = getSprite({ hasFog, color, opacity, path, pos, size });
    layerGroup.add(sprite);
  }
  return layerGroup;
}
export default getLayer;
