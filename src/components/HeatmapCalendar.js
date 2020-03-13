
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

import Tooltip from './Tooltip'
import Grid from './HeatmapGrid'
import DayAxis from './DayAxis'


// cell defaults
const cellSize = 14
const xStart = 50
const yStart = 30

const hoverStroke = '#666'
const cellPad = 2


const HeatmapCalendar = (props) => {
  const {
    data, dataKey, tooltip, colorForValue
  } = props

  // if start/end aren't provided, use start/end of data
  const {
    startDate = data[0].date,
    endDate = data[data.length - 1].date,
    height
  } = props

  const [hover, setHover] = useState(false)
  const [hoverInfo, setHoverInfo] = useState({})

  const onMouseOver = (obj) => {
    setHover(true)
    setHoverInfo(obj)
  }

  return (
    <Root>
      <SVG height={height}>
        <DayAxis x={xStart} y={yStart} offset={cellSize + cellPad} />
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

        {hover &&
          <HoverBox className="hover-box"
            x={hoverInfo.x - cellPad/2}
            y={hoverInfo.y - cellPad/2}
            width={cellSize + cellPad}
            height={cellSize + cellPad}
            stroke={hoverStroke}
            strokeWidth={cellPad}
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
