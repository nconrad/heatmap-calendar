import React from 'react'

import {pickColor} from './color'
import {
  getLinearMinMax, getBins, getDates,
  months, defaultColorMap, getLinearDateMap
} from './utils'

const defaultBinCount = 4

// summary table column width
const colWidth = 70

const getGrid = ({
  n, xStart, yStart, xEnd, cellH, cellPad,
  displayTotals = []
}) => {
  const lines = []

  // for each row
  for (let i = 0; i <= n; i++) {
    const x = xStart + displayTotals.length * colWidth
    const y = yStart + i * (cellH + cellPad)

    lines.push(
      <line
        x1={0}
        y1={y}
        x2={x + xEnd}
        y2={y}
        strokeWidth={1}
        stroke="#eee"
        key={`gl-${i}`}
      />
    )
  }

  return (
    <g key="grid" className="grid">
      {lines}
    </g>
  )
}


const timeAxis = ({
  m, xStart, yStart, allDates, cellW, cellH,
  showDays, showDayOrdinal, cellPad, showGrid, yEnd
}) => {
  const eles = []

  const numOfDates = allDates.length
  const fontSize = cellH / 1.5

  const y = yStart

  let prevMonth

  // for day of calendar
  for (let j = 0; j < m; j++) {
    const date = allDates[j]
    if (!date) continue

    const x = xStart + j * (cellW + cellPad)
    const dateOfMonth = date.getDate()

    // add month label if new and in first two weeks
    const month = months[date.getMonth()]
    if (month !== prevMonth && dateOfMonth < 15) {
      eles.push(
        <text
          x={x + cellW / 2}
          y={y - 7}
          fontSize={fontSize}
          fontWeight="bold"
          // transform={`rotate(-30,${x + cellW / 2},${y-7})`}
          key={numOfDates + j}
        >
          {month}
        </text>
      )
      prevMonth = month
    }

    // add month label if new and in first two weeks
    if (dateOfMonth != 1 && showDays && dateOfMonth % 7 == 0 ) {
      eles.push(
        <text
          x={x}
          y={y - 7}
          fontSize={fontSize}
          key={`${date}-ordinal`}
        >
          {dateOfMonth}{showDayOrdinal && nth(dateOfMonth)}
        </text>
      )
      eles.push(
        <line
          x1={x}
          y1={y - 4}
          x2={x}
          y2={y}
          strokeWidth={1}
          stroke="#aaa"
          key={date}
        />
      )

      if (showGrid) {
        eles.push(
          <line
            x1={x}
            y1={y}
            x2={x}
            y2={yEnd + yStart }
            strokeWidth={1}
            stroke="#333"
            strokeDasharray="5,3"
            key={`timeaxis-line-${j}`}
          />
        )
      }
      prevMonth = month
    }
  }

  return (
    <g key="time-axis" className="time-axis">
      {eles}
    </g>
  )
}

const summaryTable = ({
  rows, info, xStart, yStart, cellH,
  cellPad, xEnd, displayTotals
}) => {

  const fontSize = cellH / 1.5

  // first process data
  let tableData = {}
  for (let i = 0; i < rows.length; i++) {
    const name = rows[i]
    const sumData = info.filter(obj => obj.name == name)[0]

    let obj = {}
    displayTotals.forEach(field => {
      obj[field] = sumData ? sumData[field] : 0
    })

    tableData[name] = obj
  }

  // table header
  const header = displayTotals.map((field, j) =>
    <text
      x={xStart + xEnd + j * colWidth + colWidth}
      y={yStart - cellH/ 2+ 2}
      fontSize={cellH / 1.3}
      textAnchor="end"
      key={`summary-th-${name}-${field}`}
    >
      {field}
    </text>
  )

  // the summary table
  let table = []
  for (let i = 0; i < rows.length; i++) {
    for (let j = 0; j < displayTotals.length; j++) {
      const x = xStart + xEnd + j * colWidth + colWidth

      const offset = cellH + cellPad
      const y = yStart + i * offset + offset / 1.5 + 2

      const name = rows[i]
      const field = displayTotals[j]

      table.push(
        <text
          x={x}
          y={y}
          fontSize={fontSize}
          textAnchor="end"
          key={`${name}-${field}`}
        >
          {tableData[name][field] ? tableData[name][field].toLocaleString() : tableData[name][field]}
        </text>
      )
    }
  }

  return (
    <g key="summary-table" className="time-axis">
      {[...header, table]}
    </g>
  )
}


const LinearGrid = React.memo(({
  rows, data, dataKey, startDate, endDate, cellH, cellW, xStart, yStart, cellPad,
  colorForValue, showValue, onMouseOver, onMouseOut,
  minRGB, maxRGB, emptyRGB, histogram, displayTotals,
  showDays = true,
  showDayOrdinal = true,
  showGrid = true
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
  let k = 0
  let histogramTotal = 0

  // for day of calendar
  for (let j = 0; j < m; j++) {

    let weekTotal = 0

    // for each row
    for (let i = 0; i < n; i++) {

      const date = allDates[j]
      if (!date) continue

      const dateOfMonth = date.getDate()
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

      const x = xStart + j * (cellW + cellPad)
      const y = yStart + i * (cellH + cellPad)

      const hoverData = {x, y, data: dayData, name, date, value: val}
      const rect = (
        <rect
          x={x}
          y={y}
          width={cellW}
          height={cellH}
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
          <text x={x} y={y + cellH / 2} fontSize={cellH / 2}>
            {val}
          </text>
        </g> : rect

      rects.push(ele)
      k += 1
    }

    // render histogram bar if needed
    if (histogram) {
      const x = xStart + j * (cellH + cellPad)
      const y = yStart + numOfDaysInWeek * (cellW + cellPad)

      rects.push(
        <rect
          x={x}
          y={y}
          width={cellW}
          height={weekTotal / max * 10}
          fill={'#999'}
          key={numOfDates + k * 999}
        />
      )
    }
  }

  let dayAxis = timeAxis({
    m, xStart, yStart, allDates, cellW, cellH,
    showDays, showDayOrdinal, cellPad, showGrid,
    yEnd: rows.length * cellH
  })

  let grid
  if (showGrid) {
    grid = getGrid({
      n, xStart, yStart, cellH, cellPad, displayTotals,
      xEnd: numOfDays * cellW
    })
  }


  let sumTable
  if (displayTotals) {
    sumTable = summaryTable({
      rows, info: data[data.length - 1].data,
      xStart, yStart, cellH, cellPad, displayTotals,
      xEnd: numOfDays * cellW
    })
  }


  return (
    <>
      {[...rects, grid, dayAxis, sumTable]}
    </>
  )
}, (prev, next) =>  prev.dataKey == next.dataKey)


// https://stackoverflow.com/a/39466341
function nth(n) {
  return ["st","nd","rd"][((n+90)%100-10)%10-1] || "th"
}


export default LinearGrid

