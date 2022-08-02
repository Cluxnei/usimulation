import {GRAVITATION_CONSTANT} from './constants.js';

export const rand = (min, max) => Math.random() * (max - min) + min;

export const newtonGravitationLaw = (m1, m2, d, cg = GRAVITATION_CONSTANT) => cg * (m1 * m2 / (d * d));












