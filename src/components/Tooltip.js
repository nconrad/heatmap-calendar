import React from 'react'
import styled from 'styled-components'



const DefaultTooltip = (props) => {
  const {date, value} = props

  return (
    <>
      {new Date(date).toDateString().slice(0, 10)}<br/>
       value: {value}
    </>
  )
}

const Tooltip = (props) => {
  const {show, offset, tooltip} = props;
  let {x = 0, y = 0, data} = props.data;

  return (
    <TooltipRoot
      style={{
        top: y - offset * 2 - tooltipPad * 2,
        left: x + offset
      }}
      className={`${show && 'show '}tooltip` }
    >
      {show &&
        <>
          {tooltip ?
            [tooltip(props.data)] :
            <DefaultTooltip date={data.date} value={data.value} />
          }
        </>
      }
    </TooltipRoot>
  )
}

const tooltipPad = 8
const TooltipRoot = styled.div`
  position: absolute;
  background: #666;
  color: #fff;
  padding: ${tooltipPad}px;
  opacity: 0;
  transition: opacity .5s;
  font-size: 0.9em;
  z-index: 9999;

  &.show {
    opacity: 1.0;
    transition: all .5s;
    transition-property: opacity, top, left;
  }

  &:empty {
    visibility: hidden;
  }
`

export default Tooltip