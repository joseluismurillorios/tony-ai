/* eslint-disable max-len */
import { Vector3 } from 'three';

const ATUtil = {
  getRandVec3D: (minVal, maxVal) => (
    new Vector3(ATUtil.getRand(minVal, maxVal), ATUtil.getRand(minVal, maxVal), ATUtil.getRand(minVal, maxVal))
  ),
  getRand: (minVal, maxVal) => minVal + (Math.random() * (maxVal - minVal)),
  map: (value, min1, max1, min2, max2) => ATUtil.lerp(min2, max2, ATUtil.norm(value, min1, max1)),
  lerp: (min, max, amt) => min + (max - min) * amt,
  norm: (value, min, max) => (value - min) / (max - min),
};

export default ATUtil;
