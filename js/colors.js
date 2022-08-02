const interpolateColorStyle = (int, s, e) => {
    int = Math.max(Math.min(int, 1), 0);
    const intI = 1 - int;
    const r = s[0] * intI + e[0] * int;
    const g = s[1] * intI + e[1] * int;
    const b = s[2] * intI + e[2] * int;
    const a = s[3] * intI + e[3] * int;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
};

const interpolateColorStyleMapping = (mag, magS, magE, colorAtMin, colorAtMax) => {
    const int = (mag - magS) / (magE - magS);
    return interpolateColorStyle(int, colorAtMin, colorAtMax);
};

export const colorForTrace = (mag, magE = 500) => {
    const magS = 0
    const colorAtMax = [230, 255, 230, 0.9]
    const colorAtMin = [255, 255, 255, 0.05]

    return interpolateColorStyleMapping(mag, magS, magE, colorAtMin, colorAtMax)
};