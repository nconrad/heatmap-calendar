import React from 'react'

import {pickColor} from './color'
import {
  getLinearMinMax, getBins, getDates,
  months, defaultColorMap, getLinearDateMap
} from './utils'

const defaultBinCount = 4


const LinearGrid = React.memo(({
  rows, data, dataKey, startDate, endDate, cellSize, xStart, yStart, cellPad,
  colorForValue, showValue, onMouseOver, onMouseOut,
  minRGB, maxRGB, emptyRGB, histogram, displayTotals
}) => {

  // ensure data is sorted
  data.sort((a, b) => a.date - b.date)

  // get all dates and other stuff between start/end
  const allDates = getDates(startDate, endDate)
  const numOfDates = allDates.length
  const numOfDays = allDates.length

  // optimize by getting mapping of dates to values
  const dateMapping = getLinearDateMap(data, dataKey)

  // compute some stats for coloring
  const {min, max} = getLinearMinMax(data, dataKey)
  const bins = getBins(min, max, defaultBinCount)

  const n = rows.length
  const m = numOfDays
  let rects = []
  let prevMonth
  let k = 0
  let histogramTotal = 0

  // for each week of calendar
  for (let j = 0; j < m; j++) {

    let weekTotal = 0

    // for each row
    for (let i = 0; i < n; i++) {

      const date = allDates[j]
      if (!date) continue

      const name = rows[i]
      const dayData = dateMapping[date]

      const val = (dayData && name in dayData && dataKey in dayData[name])
        ? dayData[name][dataKey] : null

      weekTotal += val
      histogramTotal += val

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

      const hoverData = {x, y, data: dayData, name, date, value: val}
      const rect = (
        <rect
          x={x}
          y={y}
          width={cellSize}
          height={cellSize}
          fill={fill}
          className="cell"
          onMouseOver={() => onMouseOver(hoverData)}
          onMouseOut={() => onMouseOut(hoverData)}
          key={`${date}-${name}`}
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
      const y = yStart + numOfDaysInWeek * (cellSize + cellPad)

      rects.push(
        <rect
          x={x}
          y={y}
          width={cellSize}
          height={weekTotal / max * 10}
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
}, (prev, next) =>  prev.dataKey == next.dataKey)


export default LinearGrid

