import React from 'react'

// text defaults
const textRightMargin = 5

// day defaults
const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']


const DayAxis = (props) => {
  const {x, y, offset} = props
  const fontSize = offset / 1.5

  return (
    <>
      {
        days.map((day, j) =>
          <text
            x={x - textRightMargin}
            y={y + j * offset + (offset / 1.5) + 2}
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


export default DayAxis

