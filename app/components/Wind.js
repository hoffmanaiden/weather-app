import { createContext, useReducer, useMemo, useEffect, useRef, useContext } from 'react'
import { AppContext } from '../page'
import * as d3 from 'd3';

export default function Wind() {

  const { state, dispatch } = useContext(AppContext)
  const graphLineRef = useRef()

  useEffect(() => {
    const svg = d3.select(graphLineRef.current)
    const xScale = d3.scaleLinear()
      .domain([0, 23])
      .range([0, 300])
    const yScale = d3.scaleLinear()
      .domain([0, 30])
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
      .data([state.todaysWind])
      .join('path')
      .attr('class', 'line')
      .attr('d', value => myLine(value))
      .attr('fill', 'none')
      .attr('stroke', 'red')

  }, [state.todaysWind])

  return (
    <div>
      <div className='sectionIcon'>💨</div>
      <div className='graphContainer'>
        <svg ref={graphLineRef}>
          <g className="x-axis" />
          <g className="y-axis" />
        </svg>
      </div>
      <div className='additionalInfo'>Wind</div>
    </div>
  )
}