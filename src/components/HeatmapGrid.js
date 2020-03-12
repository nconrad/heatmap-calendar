import React from 'react'

import color from './color'


const defaultColorMap = (value) => {
  if (!value) return color.noValue

  if (value <= 5)
    return color.green1
  else if (value <= 10)
    return color.green2
  else if (value <= 15)
    return color.green3
  else if (value <= 30)
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
// returns mapping of date to value
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
  const numOfWeeks =  Math.ceil(allDates.length / 7)
  const startDay = startDate.getDay()
  const endDay = endDate.getDay()

  // optimize by getting mapping of dates to values
  const dateMapping = getDateMapping(data)

  const n = 7
  const m = numOfWeeks
  let rects = []
  let k = 0

  // for each week of week
  for (let j = 0; j < m; j++) {

    // for each day of week
    const i = (j == 0 ? startDay : 0)
    const end = (j == m - 1 ? endDay + 1 : n)
    for (; i < end; i++) {
      const date = allDates[j * n + i - startDay]

      const dayData = dateMapping[date]
      const value = dayData.value || null
      const color = colorForValue ? colorForValue(value) : defaultColorMap(value)

      const x = xStart + j * (cellSize + cellPad)
      const y = yStart + i * (cellSize + cellPad)

      const rect = (
        <rect
          x={x}
          y={y}
          width={cellSize}
          height={cellSize}
          fill={color}
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

