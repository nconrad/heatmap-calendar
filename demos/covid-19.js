

import React from 'react'
import { render } from 'react-dom'
import styled from 'styled-components'

import HeatmapCalendar from '../src/HeatmapCalendar'
import summaryData from '../sample-data/nssac-ncov-sd-summary.json'


const emptyRGB = [230, 230, 230]

const parseData = (data) => {
  return data.map((obj, i) => {
    const {
      date, totalConfirmed, totalDeaths, totalRecovered
    } = obj

    return {
      ...obj,
      date: new Date(date),
      totalActive: totalConfirmed - totalDeaths - totalRecovered,
    }
  })
}


const tooltip = (obj, key, countStr, totalStr) => {
  const {date, value} = obj
  return (
    <>
      {new Date(date).toDateString().slice(0, 10)}<br/>
      <br/>
      {countStr}: {value}<br/>
      {totalStr}: {obj[key]}
    </>
  )
}


const App = () => {
  const data = parseData(summaryData)

  const props = {
    data,
    colorForValue: 'gradient',
    emptyRGB
  }

  return (
    <Root>
      <h2>COVID-19</h2>

      {data &&
        <Content>
          <h3>{data[data.length - 1].totalConfirmed} Confirmed Cases</h3>
          <Cal
            dataKey="newConfirmed"
            tooltip={(obj) => tooltip(obj, 'totalConfirmed',  'New cases', 'Total to date')}
            minRGB={[200, 230, 255]}
            maxRGB={[0, 90, 165]}
            histogram={true}
            height={200}
            {...props}
          />


          <h3>{data[data.length - 1].totalDeaths} Deaths</h3>
          <Cal
            dataKey="newDeaths"
            tooltip={(obj) => tooltip(obj, 'totalDeaths', 'Deaths', 'Total deaths to date')}
            minRGB={[255, 220, 220]}
            maxRGB={[165, 0, 0]}
            histogram={true}
            height={200}
            {...props}
          />


          <h3>{data[data.length - 1].totalRecovered} Recovered</h3>
          <Cal
            dataKey="newRecovered"
            tooltip={(obj) => tooltip(obj, 'totalRecovered', 'Recovered', 'Total recovered to date')}
            minRGB={[201, 235, 200]}
            maxRGB={[0, 165, 0]}
            histogram={true}
            height={200}
            {...props}
          />


          <h3>{data[data.length - 1].totalActive} Active Cases</h3>
          <Cal
            dataKey="totalActive"
            tooltip={(obj) => tooltip(obj, 'totalActive',  'Active cases', 'Total active to date')}
            minRGB={[255, 248, 198]}
            maxRGB={[190, 108, 0]}
            histogram={true}
            height={200}
            {...props}
          />

        </Content>
      }
    </Root>
  )
}

const Root = styled.div`
  margin: 2rem auto;
  width: 95%;
`

const Content = styled.div`
`

const Cal = styled(HeatmapCalendar)`
`


render(<App />, document.getElementById('app'));
