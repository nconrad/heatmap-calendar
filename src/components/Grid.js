import React from 'react'

import {color, pickColor} from './color'
import {getMinMax, getBins, getDates} from './utils'

const defaultBinCount = 4

const months = [
  'Jan', 'Feb', 'March', 'April', 'May', 'June',
  'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'
]

const defaultColorMap = (value, bins) => {
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
const getDateMapping = (data, dataKey = 'value') => {
  let mapping = {}
  for (let i = 0; i < data.length; i++) {
    mapping[data[i].date] = {
      ...data[i],
      value: data[i][dataKey]
    }
  }

  return mapping
}

const Grid = (props) => {
  let {
    data, dataKey, startDate, endDate, cellSize, xStart, yStart, cellPad,
    colorForValue, showValue, onMouseOver, onMouseOut,
    minRGB, maxRGB, emptyRGB, histogram, histogramKey
  } = props

  // ensure data is sorted
  data.sort((a, b) => a.date - b.date)

  // get all dates and other stuff between start/end
  const allDates = getDates(startDate, endDate)
  const numOfDates = allDates.length
  const numOfWeeks =  Math.ceil(allDates.length / 7)
  const startDay = startDate.getDay()
  const endDay = endDate.getDay()

  // optimize by getting mapping of dates to values
  const dateMapping = getDateMapping(data, dataKey)

  // compute some stats for coloring
  const {min, max} = getMinMax(data, dataKey)
  const bins = getBins(min, max, defaultBinCount)

  const n = 7
  const m = numOfWeeks
  let rects = []
  let prevMonth
  let k = 0
  let histogramTotal = 0

  // for each week of calendar
  for (let j = 0; j < m; j++) {

    let weekTotal = 0

    // for each day of week
    const i = (j == 0 ? startDay : 0)
    const end = (j == m - 1 ? endDay + 1 : n)
    for (; i < end; i++) {
      const date = allDates[j * n + i - startDay]

      const dayData = dateMapping[date]
      const val = dayData.value || null
      weekTotal += val

      if (histogram) histogramTotal += val

      let fill
      if (!val && colorForValue == 'gradient' && emptyRGB) {
        fill = `rgb(${emptyRGB.join(',')})`
      } else if (colorForValue == 'gradient') {
        fill = pickColor(val / max, minRGB, maxRGB)
      } else if (colorForValue) {
        fill = colorForValue(val)
      } else {
        fill = defaultColorMap(val, bins)
      }

      const x = xStart + j * (cellSize + cellPad)
      const y = yStart + i * (cellSize + cellPad)

      const rect = (
        <rect
          x={x}
          y={y}
          width={cellSize}
          height={cellSize}
          fill={fill}
          onMouseOver={() => onMouseOver({x, y, data: dayData})}
          onMouseOut={() => onMouseOut({x, y, data: dayData})}
          key={k}
        />
      )

      const ele = showValue ?
        <g key={k}>
          {rect}
          <text x={x} y={y + cellSize / 2} fontSize={cellSize / 2}>
            {val}
          </text>
        </g> : rect

      rects.push(ele)

      // render month label if new and in first two weeks
      const month = months[date.getMonth()]
      if (i == 0 && month !== prevMonth && date.getDate() < 15) {
        rects.push(
          <text
            x={x}
            y={y - 7}
            fontSize={cellSize / 1.5}
            key={numOfDates + k}
          >
            {month}
          </text>
        )
        prevMonth = month
      }

      k += 1
    }

    // render histogram bar if needed
    if (histogram) {
      const x = xStart + j * (cellSize + cellPad)
      const y = yStart + i * (cellSize + cellPad)

      rects.push(
        <rect
          x={x}
          y={y}
          width={cellSize}
          height={histogramTotal / max}
          fill={'#999'}
          key={numOfDates + k * 999}
        />
      )
    }
  }

  return (
    <>
      {rects}
    </>
  )
}

export default Grid

