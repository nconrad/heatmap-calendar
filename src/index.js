

import React, {useState, useEffect} from 'react'
import { render } from 'react-dom'
import styled from 'styled-components'

//import data from '../sample-data/nssac-ncov-sd-summary'

import HeatmapCalendar from './components/HeatmapCalendar'


const getSampleData = (startDate, endDate) => {
  const data = []
  let nextDate = new Date(startDate)
  while (nextDate <= endDate) {
    data.push({
      date: nextDate,
      value: Math.floor((Math.random() * 25) + 1)
    })
    nextDate = new Date(nextDate);
    nextDate.setDate(nextDate.getDate() + 1);
  }

  return data
}


const App = () => {
  const start = new Date('01-01-2020')
  const end = new Date('12-31-2020')
  const data = getSampleData(start, end)

  return (
    <Root>
      {data && <HeatmapCalendar data={data}/>}
    </Root>
  )
}

const Root = styled.div`
  margin: 2rem auto;
  width: 95%;
  border: 1px solid #ccc;
  display: block;
  overflow: scroll;
`

const Calendar = styled(HeatmapCalendar)`
  overflow: scroll;
`

render(<App />, document.getElementById('app'));
