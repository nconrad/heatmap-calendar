export const getMinMax = (data, key = 'value') => {
  let max = 0, min = 0
  let l = data.length
  while (l--) {
    const val = data[l][key]
    if (val > max) max = val
    if (val < min) min = val
  }

  return {min, max}
}

export const getBins = (min, max, num, round = true) => {
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


export const getDates = (startDate, endDate) => {
  const dates = []
  let nextDate = new Date(startDate)
  while (nextDate <= endDate) {
    dates.push(nextDate)
    nextDate = new Date(nextDate);
    nextDate.setDate(nextDate.getDate() + 1);
  }

  return dates
}
