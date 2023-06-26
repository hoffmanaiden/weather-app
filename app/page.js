'use client'

import { createContext, useReducer, useMemo, useEffect, useRef } from 'react'
import * as d3 from 'd3'
import dynamic from 'next/dynamic';
import styles from './page.module.css'
import reducer from './reducer'
import { useWindowSize } from 'react-use';
import { getWeatherData } from './functions';

import Temp from './components/Temp';
import Precipitation from './components/Precipitation';
import Wind from './components/Wind';

export const AppContext = createContext(null)

// video 1
// https://www.youtube.com/watch?v=9uEmNgHzPhQ
// video 2 - 5:45
// https://www.youtube.com/watch?v=hR8xtl_IbCw
// https://github.com/muratkemaldar/using-react-hooks-with-d3/tree/02-curved-line-chart
// video 3

export default function App() {
  const { width, height } = useWindowSize();
  const initialState = {
    brwsrHeight: height,
    brwsrWidth: width,
    leftMargin: 50,
    bottomMargin: 50,
    data: [],
    todaysTemps: [],
    todaysRain: [],
    todaysWind: []
  }

  const [state, dispatch] = useReducer(reducer, initialState)
  const providerValue = useMemo(() => ({ state, dispatch }), [state, dispatch])

  const circleRef = useRef()
  const lineRef = useRef()

  // getting data & setting state on top level
  useEffect(() => {
    async function getNeededWeatherData(){
      const tempByHour = []
      const rainByHour = []
      const windByHour = []
      const data = await getWeatherData()
      const hours = data.forecast.forecastday[0].hour
      for (let hour of hours){
        tempByHour.push(hour.temp_f)
        rainByHour.push(hour.chance_of_rain)
        windByHour.push(hour.wind_mph)
      }
      return {
        tempByHour: tempByHour,
        rainByHour: rainByHour,
        windByHour: windByHour
      }
    }
    async function getWindToday() {
      const windByHour = []
      const data = await getWeatherData()
      console.log(data)
      const hours = data.forecast.forecastday[0].hour
      for (let hour of hours) {
        // console.log(hour.time + ': ' + hour.wind_mph)
        windByHour.push(hour.wind_mph)
      }
      return windByHour
    }
    getWindToday().then((res) => {
      // console.log(res)
      dispatch({ type: 'setData', value: res })
    })
    getNeededWeatherData().then((res) => {
      dispatch({ type: 'tempSetData', value: res})
    })
  }, [])


  // draw line graph
  useEffect(() => {
    const svg = d3.select(lineRef.current)
    const xScale = d3.scaleLinear()
      .domain([0, 23])
      .range([0, 300])
    const yScale = d3.scaleLinear()
      .domain([0, 50])
      .range([150, 0])

    const xAxis = d3.axisBottom(xScale).ticks(8).tickFormat(index => index)
    const yAxis = d3.axisRight(yScale).ticks(7)
    svg.select('.x-axis')
      .style('transform', `translateY(150px)`)
      .call(xAxis)
    svg.select('.y-axis')
      .style('transform', `translateX(300px)`)
      .call(yAxis)

    const myLine = d3.line()
      .x((value, index) => xScale(index))
      .y(((value, index) => yScale(value)))
      .curve(d3.curveCardinal)


    svg.selectAll('.line')
      .data([state.data])
      .join('path')
      .attr('class', 'line')
      .attr('d', value => myLine(value))
      .attr('fill', 'none')
      .attr('stroke', 'blue')

  }, [state.data])


  return (
    <main>
      <AppContext.Provider value={providerValue}>
        <div className='homeScreen'>
          <div className='homeSection highlights'>
            <div>one</div>
            <div>two</div>
            <div>three</div>
          </div>
          <div className='homeSection temp'>
            <Temp/>
          </div>
          <div className='homeSection precipitation'>
            <Precipitation/>
          </div>
          <div className='homeSection wind'>
            <Wind/>
          </div>
        </div>

      </AppContext.Provider>
    </main>
  )
}
