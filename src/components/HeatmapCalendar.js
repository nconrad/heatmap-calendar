
/*
 * HeatmapCalendar
 *
 * Author: nconrad
 *
 * Acknowledgement:
 *  https://observablehq.com/@d3/calendar-view
 *
 * Licensed under MIT license.
 * See LICENSE file in the project root for full license information.
 */

import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import color from './color'


// cell defaults
const size = 20
const pad = 2
const xStart = 50
const yStart = 30

// text defaults
const textRightMargin = 5

// day defaults
const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']


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


const Grid = (props) => {
  let {
    startDate, endDate,  data,
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

  let rects = []
  const n = 7, m = numOfWeeks
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

      const x = xStart + j * size
      const y = yStart + i * size
      const w = size - pad

      const rect = (
        <rect
          x={x}
          y={y}
          width={w}
          height={w}
          fill={color}
          onMouseOver={() => onMouseOver({x, y, data: dayData})}
          onMouseOut={() => onMouseOut({x, y, data: dayData})}
          key={k}
        />
      )

      const ele = showValue ?
        <g key={k}>
          {rect}
          <text x={x} y={y + size / 2} fontSize={size / 2}>
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


// takes array of data objects,
// returns mapping of date to value
const getDateMapping = (data) => {
  let mapping = {}
  for (let i = 0; i < data.length; i++) {
    mapping[data[i].date] = data[i]
  }

  return mapping
}


const DayAaxis = (props) => {
  const fontSize = size / 1.5

  return (
    <>
      {
        days.map((day, j) =>
          <text
            x={xStart - textRightMargin}
            y={yStart + j * size + (size / 1.5) + 2}
            fontSize={fontSize}
            key={j}
            textAnchor="end"
          >
            {day}
          </text>
        )
      }
    </>
  )
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


const Tooltip = (props) => {
  const {show} = props;
  let {x = 0, y = 0, data} = props.data;

  useState(() => {

  }, [x, y])

  return (
    <TooltipRoot
      style={{top: y - size - tooltipPad * 2, left: x + size}}
      className={`${show && 'show '}tooltip` }
    >
      {show &&
        <>
          {new Date(data.date).toDateString().slice(0, 10)}<br/>
          value: {data.value}
        </>
      }
    </TooltipRoot>
  )
}

const tooltipPad = 10
const TooltipRoot = styled.div`
  position: absolute;
  background: #666;
  color: #fff;
  padding: ${tooltipPad}px;
  opacity: 0;
  transition: opacity .5s;

  &.show {
    opacity: 1.0;
    transition: all .5s;
    transition-property: opacity, top, left;
  }

  &:empty {
    visibility: hidden;
  }
`

const HeatmapCalendar = (props) => {
  const {data} = props
  let {startDate, endDate} = props

  // if start/end aren't provided, use start/end of data
  startDate = startDate || data[0].date
  endDate = endDate || data[data.length - 1].date

  const [hover, setHover] = useState(false)
  const [hoverInfo, setHoverInfo] = useState({})

  useEffect(() => {
  }, [])

  const onMouseOver = (obj) => {
    setHover(true)
    setHoverInfo(obj)
  }

  const onMouseOut = (obj) => {
    setHover(false)
  }

  return (
    <Root>
      <SVG>
        <DayAaxis/>
        <Grid
          startDate={startDate}
          endDate={endDate}
          data={data}
          onMouseOver={obj => onMouseOver(obj)}
          onMouseOut={obj => onMouseOut(obj)}
        />
      </SVG>

      <Tooltip data={hoverInfo} show={hover} />

    </Root>
  )
}

const Root = styled.div`
  position: relative;
`

const SVG = styled.svg`
  height: 100%;
  width: 100%;
`


export default HeatmapCalendar
