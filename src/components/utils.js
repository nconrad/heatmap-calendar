export function getMinMax(data, key = 'value') {
  let max = 0, min = 0
  let l = data.length
  while (l--) {
    const val = data[l][key]
    if (val > max) max = val
    if (val < min) min = val
  }

  return {min, max}
}

export function getLinearMinMax(data, key) {
  let max = 0, min = 0
  let l = data.length
  while (l--) {
    const objs = data[l].data
    let k = objs.length
    while (k--) {
      const val = objs[k][key]
      if (val > max) max = val
      if (val < min) min = val
    }
  }

  return {min, max}
}


export function getBins(min, max, num, round = true) {
  num = num - 1
  let size = (max - min) / num
  let val = min;
  let bins = [min]
  while(--num) {
    val = round ? Math.round(val + size) : val + size
    bins.push(val)
  }

  bins.push(max)
  return bins
}


export function getDates(startDate, endDate) {
  const dates = []
  let nextDate = new Date(startDate)
  while (nextDate <= endDate) {
    dates.push(nextDate)
    nextDate = new Date(nextDate);
    nextDate.setDate(nextDate.getDate() + 1);
  }

  return dates
}


export const months = [
  'Jan', 'Feb', 'March', 'April', 'May', 'June',
  'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'
]

export function defaultColorMap(value, bins) {
  if (!value) return color.noValue

  if (value <= bins[0])
    return color.green1
  else if (value <= bins[1])
    return color.green2
  else if (value <= bins[2])
    return color.green3
  else if (value <= bins[3])
    return color.green4
}

// takes array of data objects,
// returns mapping of date to data object
export function getDateMapping(data, dataKey = 'value') {
  let mapping = {}
  for (let i = 0; i < data.length; i++) {
    mapping[data[i].date] = {
      ...data[i],
      value: data[i][dataKey]
    }
  }

  return mapping
}


export function getLinearDateMap(data) {
  let mapping = {}
  for (let j = 0; j < data.length; j++) {
    const obj = data[j]
    const date = obj.date
    const objs = obj.data
    if (!(date in mapping))
      mapping[date] = {}

    for (let i = 0; i < objs.length; i++) {
      mapping[date][objs[i].name] = objs[i]
    }
  }

  return mapping
}
