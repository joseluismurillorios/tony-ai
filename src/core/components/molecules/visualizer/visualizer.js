import * as THREE from 'three';
import ImprovedNoise from './improvedNoise';

// const defaults = {
//   RINGCOUNT: 60,
//   SEPARATION: 30,
//   GROWTH: 1.02,
//   LINE_WIDTH: 1,
//   INIT_RADIUS: 50,
//   SEGMENTS: 512,
//   VOL_SENS: 2,
//   BIN_COUNT: 512,
// };

const LoopVisualizer = (scene, analyser, mic) => {
  const RINGCOUNT = 30;
  const GROWTH = 1.04;
  const INIT_RADIUS = 50;
  const SEGMENTS = 512;
  const VOL_SENS = 2;
  const BIN_COUNT = 512;

  let rings = [];
  let materials = [];

  let levels = [];
  let colors = [];

  const loopHolder = new THREE.Object3D();
  const perlin = new ImprovedNoise();
  let noisePos = 0;
  let freqByteData;
  let timeByteData;

  let loopGeom;// one geom for all rings


  function init() {
    rings = [];
    materials = [];
    levels = [];
    // waves = [];
    colors = [];

    // //////INIT audio in
    freqByteData = new Uint8Array(BIN_COUNT);
    timeByteData = new Uint8Array(BIN_COUNT);

    scene.add(loopHolder);

    let scale = 1;

    const circleShape = new THREE.Shape();
    circleShape.absarc(0, 0, INIT_RADIUS, 0, Math.PI * 2, false);
    // createPointsGeometry returns (SEGMENTS * 2 )+ 1 points
    loopGeom = circleShape.createPointsGeometry(SEGMENTS / 2);
    loopGeom.dynamic = true;

    // create rings
    for (let i = 0; i < RINGCOUNT; i += 1) {
      const m = new THREE.LineBasicMaterial({
        color: 0xffffff,
        linewidth: 0.5,
        opacity: 1,
        blending: THREE.AdditiveBlending,
        // depthTest : false,
        transparent: true,

      });
      const line = new THREE.Line(loopGeom, m);

      rings.push(line);
      materials.push(m);
      scale *= GROWTH;
      line.scale.x = scale;
      line.scale.y = scale;

      loopHolder.add(line);

      levels.push(0);
      colors.push(0);
    }
  }

  function remove() {
    if (loopHolder) {
      for (let i = 0; i < RINGCOUNT; i += 1) {
        loopHolder.remove(rings[i]);
      }
    }
  }

  function update() {
    // analyser.smoothingTimeConstant = 0.1;
    analyser.getByteFrequencyData(freqByteData);
    analyser.getByteTimeDomainData(timeByteData);

    // get average level
    let sum = 0;
    for (let i = 0; i < BIN_COUNT; i += 1) {
      sum += freqByteData[i];
    }
    const aveLevel = sum / BIN_COUNT;
    // console.log('aveLevel', aveLevel);
    const scaledAverage = (aveLevel / 256) * VOL_SENS; // 256 is the highest a level can be
    // console.log('scaledAverage', scaledAverage * 2);
    const aveOffset = mic ? 2 : 1;
    levels.push(scaledAverage * aveOffset);

    // get noise color posn
    noisePos += 0.005;
    const n = Math.abs(perlin.noise(noisePos, 0, 0));
    colors.push(n);

    levels.shift();
    colors.shift();
    // colors.shift();


    // write current waveform into all rings
    for (let j = 0; j < SEGMENTS; j += 1) {
      loopGeom.vertices[j].z = (timeByteData[j] - 128);// stretch by 2
    }
    // link up last segment
    loopGeom.vertices[SEGMENTS].z = loopGeom.vertices[0].z;
    loopGeom.verticesNeedUpdate = true;

    // for( i = RINGCOUNT-1; i > 0 ; i--) {

    for (let i = 0; i < RINGCOUNT; i += 1) {
      const ringId = RINGCOUNT - i - 1;


      const offset = mic ? 0.5 : 0.01;
      const normLevel = levels[ringId] + offset; // avoid scaling by 0
      // console.log(colors[i]);
      // const hue = colors[i];

      materials[i].color.setHSL(1, 0, normLevel);
      // materials[i].color.setHSL(hue, 1, normLevel);
      materials[i].linewidth = normLevel * 3;
      materials[i].opacity = normLevel; // fadeout
      rings[i].scale.z = normLevel / 3;
    }

    // auto tilt
    loopHolder.rotation.x = perlin.noise(noisePos * 0.25, 0, 0) * Math.PI * 0.6;
    loopHolder.rotation.y = perlin.noise(noisePos * 0.25, 10, 0) * Math.PI * 0.6;
  }

  return {
    init,
    update,
    remove,
    loopHolder,
  };
};

export default LoopVisualizer;
