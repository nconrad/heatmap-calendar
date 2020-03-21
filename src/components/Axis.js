import React from 'react'

// text defaults
const textRightMargin = 5

// day defaults
const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']


export default function Axis(props) {
  const {x, y, offset, data} = props
  const fontSize = offset / 1.5

  const rows = data ? data : days

  return (
    <>
      {
        rows.map((name, j) =>
          <text
            x={x - textRightMargin}
            y={y + j * offset + (offset / 1.5) + 2}
            fontSize={fontSize}
            key={j}
            textAnchor="end"
          >
            {name}
          </text>
        )
      }
    </>
  )
}

