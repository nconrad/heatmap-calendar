import React from 'react'

import {color, getRedColor} from './color'

import {getMinMax, getBins} from './utils'

const months = [
  'Jan', 'Feb', 'March', 'April', 'May', 'June',
  'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'
]

const defaultBinCount = 4

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


const getDates = (startDate, endDate) => {
  const dates = []
  let nextDate = new Date(startDate)
  while (nextDate <= endDate) {
    dates.push(nextDate)
    nextDate = new Date(nextDate);
    nextDate.setDate(nextDate.getDate() + 1);
  }

  return dates
}

// takes array of data objects,
// returns mapping of date to data object
const getDateMapping = (data) => {
  let mapping = {}
  for (let i = 0; i < data.length; i++) {
    mapping[data[i].date] = data[i]
  }

  return mapping
}

const HeatmapGrid = (props) => {
  let {
    startDate, endDate,  data, cellSize, xStart, yStart, cellPad,
    colorForValue, showValue, onMouseOver, onMouseOut
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
  const dateMapping = getDateMapping(data)

  // compute some stats for coloring
  const {min, max} = getMinMax(data)
  const bins = getBins(min, max, defaultBinCount)

  const n = 7
  const m = numOfWeeks
  let rects = []
  let prevMonth
  let k = 0

  // for each week of calendar
  for (let j = 0; j < m; j++) {

    // for each day of week
    const i = (j == 0 ? startDay : 0)
    const end = (j == m - 1 ? endDay + 1 : n)
    for (; i < end; i++) {
      const date = allDates[j * n + i - startDay]

      const dayData = dateMapping[date]
      const value = dayData.value || null

      let fill
      if (colorForValue == 'gradient') {
        fill = getRedColor(value / max)
      } else if (colorForValue) {
        fill = colorForValue(value)
      } else {
        fill = defaultColorMap(value, bins)
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
            {value}
          </text>
        </g> : rect

      rects.push(ele)

      // render month label if new and in first two weeks
      const month = months[date.getMonth()]
      if (i == 0 && month !== prevMonth && date.getDate() < 15) {
        rects.push(
          <text
            x={x}
            y={y - 10}
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
  }

  return (
    <>
      {rects}
    </>
  )
}

export default HeatmapGrid

