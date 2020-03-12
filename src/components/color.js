export const color = {
  noValue: '#f2f2f2',
  green1: '#b2dfb0',
  green2: '#8ed88b',
  green3: '#4cc948',
  green4: '#06af00',
  red1: '#ffc5c5',
  red2: '#ff8686',
  red3: '#d34848',
  red4: '#b90000'
}


// based on less.js functions
function pickHex(color1, color2, weight) {
    var w1 = weight;
    var w2 = 1 - w1;
    var rgb = [
        Math.round(color1[0] * w1 + color2[0] * w2),
        Math.round(color1[1] * w1 + color2[1] * w2),
        Math.round(color1[2] * w1 + color2[2] * w2)
    ];
    return rgb;
}

const gradientGreenMin = [178, 223, 176]
const gradientGreenMax = [6, 175, 0]
const gradientRedMin = [255, 220, 220]
const gradientRedMax = [165, 0, 0]

export function getRedColor(weight) {
  return `rgb(${pickHex(gradientRedMax, gradientRedMin, weight).join(',')})`
}
