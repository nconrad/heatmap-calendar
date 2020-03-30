
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

import React, { useState } from 'react'
import styled from 'styled-components'

import Grid from './components/Grid'
import LinearGrid from './components/LinearGrid'
import Axis from './components/Axis'
import Tooltip from './components/Tooltip'



const getRowNames = (allData) => {

  const rowNames = []
  for (let j = 0; j < allData.length; j++) {
    const {data} = allData[j]
    for (let i = 0; i < data.length; i++) {
      const {name} = data[i]
      if (!rowNames.includes(name))
        rowNames.push(name)
    }
  }

  return rowNames
}


const HeatmapCalendar = (props) => {

  const {
    data, dataKey, colorForValue, type,
    cellSize = 14,
    cellPad = 2,
    xStart = 50,
    yStart = 30,
    hoverStroke = '#666',
    tooltip
  } = props

  // if start/end aren't provided, use start/end of data
  const {
    startDate = data[0].date,
    endDate = data[data.length - 1].date,
    height
  } = props

  if (typeof startDate == 'string' || typeof endDate == 'string')
    throw 'The dates (value of `date`) provided must be date objects'

  // if type is linear, we need to figure out all the rows
  const rowNames = type == 'linear' ? getRowNames(data) : null

  const [hover, setHover] = useState(false)
  const [hoverInfo, setHoverInfo] = useState({})

  const onMouseOver = (obj) => {
    setHover(true)
    setHoverInfo(obj)
  }

  const onSVGMouseOver = () => {
    const target = event.target
    if (target.tagName != 'rect') return

    // const {clientX: x, clientY: y} = event
    // console.dir(target)
    const data = JSON.parse(target.dataset.hov)

    setHover(true)
    setHoverInfo(data)
  }


  return (
    <Root>
      <SVG height={height}>

        {
          !type &&
          <>
            <Axis x={xStart} y={yStart} offset={cellSize + cellPad} />
            <Grid
              startDate={startDate}
              endDate={endDate}
              data={data}
              dataKey={dataKey}
              cellSize={cellSize}
              xStart={xStart}
              yStart={yStart}
              cellPad={cellPad}
              colorForValue={colorForValue}
              onMouseOver={obj => onMouseOver(obj)}
              onMouseOut={() => setHover(false)}
              {...props}
            />
          </>
        }

        {
          type == 'linear' &&
          <>
            <Axis
              x={xStart}
              y={yStart}
              offset={cellSize + cellPad}
              data={rowNames}
            />
            <LinearGrid
              rows={rowNames}
              startDate={startDate}
              endDate={endDate}
              data={data}
              dataKey={dataKey}
              cellSize={cellSize}
              xStart={xStart}
              yStart={yStart}
              cellPad={cellPad}
              colorForValue={colorForValue}
              onMouseOver={obj => onMouseOver(obj)}
              onMouseOut={() => setHover(false)}
              {...props}
            />
          </>
        }

        {hover &&
          <HoverBox className="hover-box"
            x={hoverInfo.x - cellPad/2}
            y={hoverInfo.y - cellPad/2}
            width={cellSize + cellPad}
            height={cellSize + cellPad}
            stroke={hoverStroke}
            strokeWidth={cellPad || 1}
          />
        }
      </SVG>

      <Tooltip
        data={hoverInfo}
        show={hover}
        offset={cellSize + 4}
        tooltip={tooltip}
      />

    </Root>
  )
}

const Root = styled.div`
  position: relative;
`

const SVG = styled.svg`
  width: 100%;
`

const HoverBox = styled.rect`
  fill: none;
`

export default HeatmapCalendar
