import React, {useState, useEffect} from 'react'
import styled from 'styled-components'

import {pickColor} from './color'
import {
  getLinearMinMax, getBins, getDates,
  months, defaultColorMap, getLinearDateMap
} from './utils'

const caretPad = 5
const caretDown = (x, y) => <path d={`M${x+4} ${y} L${x} ${y-6} L${x+8} ${y-6} Z`} />
const caretUp = (x, y) => <path d={`M${x+4} ${y-6} L${x} ${y} L${x+8} ${y} Z`} />


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

const textRightMargin = 5

const rowAxis = (props) => {
  const {xStart, yStart, offset, data, sort, onSort} = props
  const fontSize = offset / 1.5

  const rows = data ? data : days

  const x = xStart - textRightMargin
  const y = yStart - offset / 2 + 2

  return (
    <>
        <THead
          x={x}
          y={y}
          fontSize={offset / 1.3}
          key={name}
          textAnchor="end"
          onClick={() => onSort('name')}
        >
          Name
        </THead>
        {sort[0] == 'name' && sort[1] == 'asc' && caretUp(x + caretPad, y) }
        {sort[0] == 'name' && sort[1] == 'dsc' && caretDown(x + caretPad, y) }
      {
        rows.map((name, j) =>
          <text
            x={x}
            y={yStart + j * offset + (offset / 1.5) + 2}
            fontSize={fontSize}
            key={name}
            textAnchor="end"
          >
            {name}
          </text>
        )
      }
    </>
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
        <g key={numOfDates + j}>
          <text
            x={x}
            y={y - 7}
            fontSize={fontSize + 1}
            fontWeight="bold"
            // transform={`rotate(-30,${x + cellW / 2},${y-7})`}
          >
            {month}
          </text>
          <line
            x1={x}
            y1={y - 4}
            x2={x}
            y2={y}
            strokeWidth={1}
            stroke="#aaa"
            key={date}
          />
        </g>
      )
      prevMonth = month
    }

    // add day ordinals
    if (dateOfMonth != 1 && showDays && dateOfMonth % 7 == 0 ) {
      eles.push(
        <text
          x={x}
          y={y - 7}
          fontSize={fontSize / 1.3}
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

const getTableData = (rows, info, displayTotals) => {
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
  return tableData
}


const summaryTable = ({
  rows, info, xStart, yStart, cellH,
  cellPad, xEnd, displayTotals, sort, onSort
}) => {

  const fontSize = cellH / 1.5

  // first process data;
  // todo: refactor this out, ensuring table does not depend on rows
  let tableData = getTableData(rows, info, displayTotals)

  // table header
  const header = displayTotals.map((field, j) => {
    const x = xStart + xEnd + j * colWidth + colWidth
    const y = yStart - cellH / 2 + 2
    return (
      <g key={`summary-th-${field}`}>
        <THead
          x={x}
          y={y}
          fontSize={cellH / 1.3}
          textAnchor="end"
          key={`summary-th-${name}-${field}`}
          onClick={() => onSort(field)}
        >
          {field}
        </THead>
        {sort[0] == field && sort[1] == 'asc' && caretUp(x + caretPad, y) }
        {sort[0] == field && sort[1] == 'dsc' && caretDown(x + caretPad, y) }
      </g>
    )
  })

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
  data, dataKey, startDate, endDate, cellH, cellW, xStart, yStart, cellPad,
  colorForValue, showValue, onMouseOver, onMouseOut,
  minRGB, maxRGB, emptyRGB, histogram, displayTotals,
  showDays = true,
  showDayOrdinal = true,
  showGrid = true,
  ...props
}) => {

  const [rows, setRows] = useState(props.rows)

  // sort state is of the form [field, 'asc' || 'dec']
  const [sort, setSort] = useState(props.defaultSort || null)

  useEffect(() => {
    if (!sort) return

    const [field, order] = sort

    // todo: get rid of this processing
    const tableObj = getTableData(rows, data[data.length - 1].data, displayTotals)
    const table = Object.keys(tableObj).map(name => ({name, ...tableObj[name]}))

    let sortType = typeof table[0][field]
    if (!['number', 'string'].includes(sortType))
      throw `HeatmapCalendar: Invalid sort type '${sortType}' in data`

    let newRows
    if (order == 'dsc')
      sortType == 'string' ?
        table.sort((a, b) => a[field].localeCompare(b[field])) :
        table.sort((a, b) => b[field] - a[field])
    else
      sortType == 'string' ?
        table.sort((a, b) => b[field].localeCompare(a[field])) :
        table.sort((a, b) => a[field] - b[field])

    newRows = table.map(o => o.name)
    setRows(newRows)
  }, [sort])


  // ensure data is sorted by date
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
      xEnd: numOfDays * cellW,
      sort,
      onSort
    })
  }

  function onSort(field) {
    setSort(prev => {
      const [prevField, order] = prev
      if (prevField == field && order == 'asc')
        return [field, 'dsc']

      return [field, 'asc']
    })
  }

  return (
    <>
      {[
        rowAxis({xStart, yStart, offset: cellH + cellPad, data: rows, sort, onSort}),
        ...rects,
        grid,
        dayAxis,
        sumTable
      ]}
    </>
  )
}, (prev, next) =>  prev.dataKey == next.dataKey)


// https://stackoverflow.com/a/39466341
function nth(n) {
  return ["st","nd","rd"][((n+90)%100-10)%10-1] || "th"
}

const THead = styled.text`
  font-weight: 800;
  &:hover {
    color: #000;
    cursor: pointer;
  }
`

export default LinearGrid

