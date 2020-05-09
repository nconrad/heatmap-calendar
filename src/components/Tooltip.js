import React from 'react'
import styled from 'styled-components'


const DefaultTooltip = ({date, value}) =>
  <>
    {new Date(date).toDateString().slice(0, 10)}<br/>
     value: {value}
  </>


const Tooltip = (props) => {
  const {show, offset, tooltip, tooltipOutline} = props;
  let {x = 0, y = 0, date, name, value, fill} = props.data;

  return (
    <TooltipRoot
      style={{
        top: y - offset * 2 - tooltipPad * 2,
        left: x + offset,
        border: tooltipOutline ? `3px solid ${fill}` : 'none'
      }}
      className={`${show && 'show '} tooltip` }
    >
      {show &&
        <>
          {tooltip ?
            <div key={`${date}-${name}`}>{tooltip(props.data)}</div> :
            <DefaultTooltip date={date} value={value} />
          }
        </>
      }
    </TooltipRoot>
  )
}

const tooltipPad = 8
const TooltipRoot = styled.div`
  position: absolute;
  background: #444;
  color: #fff;
  padding: ${tooltipPad}px;
  opacity: 0;
  transition: opacity .5s;
  font-size: 0.9em;
  z-index: 9999;
  white-space: nowrap;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.7);

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