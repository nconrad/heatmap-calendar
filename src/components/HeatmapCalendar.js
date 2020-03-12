
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

import Tooltip from './Tooltip'
import Grid from './HeatmapGrid'
import DayAxis from './DayAxis'


// cell defaults
const size = 20
const xStart = 50
const yStart = 30

const hoverStroke = '#666'
const cellPad = 3


const HeatmapCalendar = (props) => {
  const {data} = props
  let {startDate, endDate} = props

  // if start/end aren't provided, use start/end of data
  startDate = startDate || data[0].date
  endDate = endDate || data[data.length - 1].date

  const [hover, setHover] = useState(false)
  const [hoverInfo, setHoverInfo] = useState({})

  useEffect(() => {
  })

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
        <DayAxis x={xStart} y={yStart} offset={size + cellPad} />
        <Grid
          startDate={startDate}
          endDate={endDate}
          data={data}
          cellSize={size}
          xStart={xStart}
          yStart={yStart}
          cellPad={cellPad}
          onMouseOver={obj => onMouseOver(obj)}
          onMouseOut={obj => onMouseOut(obj)}
        />

        {hover &&
          <HoverBox className="hover-box"
            x={hoverInfo.x - cellPad/2}
            y={hoverInfo.y - cellPad/2}
            width={size + cellPad}
            height={size + cellPad}
            stroke={hoverStroke}
            strokeWidth={2}
          />
        }

      </SVG>

      <Tooltip data={hoverInfo} show={hover} offset={size} box={size} />
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

const HoverBox = styled.rect`
  fill: none;
`

export default HeatmapCalendar
