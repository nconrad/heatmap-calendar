import React, {useState} from 'react'
import styled from 'styled-components'

const Tooltip = (props) => {
  const {show, offset} = props;
  let {x = 0, y = 0, data} = props.data;

  useState(() => {

  }, [x, y])

  return (
    <TooltipRoot
      style={{top: y - offset * 2 - tooltipPad * 2, left: x + offset}}
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

export default Tooltip