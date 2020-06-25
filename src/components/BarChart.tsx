import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { ResponsiveBar } from '@nivo/bar'
import { Heading } from 'theme-ui'
import { makePoller } from '../utils/network'
import {
  selectBrowserData,
  fetchBrowserData,
  clearBrowserData
} from '../slices/realtimeDataSlice'

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.

const MyResponsiveBar = () => {
  const graphData = useSelector(selectBrowserData)
  const dispatch = useDispatch()

  useEffect(() => {
    let stopPolling = false
    const dataPoller = makePoller(
      () => {
        dispatch(fetchBrowserData())
      },
      () => !stopPolling,
      5000
    )

    dataPoller()

    return () => {
      stopPolling = true
      dispatch(clearBrowserData)
    }
  }, [])

  return (
    <div style={{ height: 500 }}>
      <Heading>Active Users by Country / Browser</Heading>
      {graphData.data.length < 1 && (
        <h5>There are currently no active users</h5>
      )}
      <ResponsiveBar
        layout='horizontal'
        data={graphData.data}
        keys={graphData.keys}
        indexBy='country'
        margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
        padding={0.3}
        colors={{ scheme: 'nivo' }}
        defs={[
          {
            id: 'dots',
            type: 'patternDots',
            background: 'inherit',
            color: '#38bcb2',
            size: 4,
            padding: 1,
            stagger: true
          },
          {
            id: 'lines',
            type: 'patternLines',
            background: 'inherit',
            color: '#eed312',
            rotation: -45,
            lineWidth: 6,
            spacing: 10
          }
        ]}
        fill={[
          {
            match: {
              id: 'fries'
            },
            id: 'dots'
          },
          {
            match: {
              id: 'sandwich'
            },
            id: 'lines'
          }
        ]}
        borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Total Active Users',
          legendPosition: 'middle',
          legendOffset: 32
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legendPosition: 'middle',
          legendOffset: -40
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
        legends={[
          {
            dataFrom: 'keys',
            anchor: 'bottom-right',
            direction: 'column',
            justify: false,
            translateX: 120,
            translateY: 0,
            itemsSpacing: 2,
            itemWidth: 100,
            itemHeight: 20,
            itemDirection: 'left-to-right',
            itemOpacity: 0.85,
            symbolSize: 20,
            effects: [
              {
                on: 'hover',
                style: {
                  itemOpacity: 1
                }
              }
            ]
          }
        ]}
        animate={true}
        motionStiffness={90}
        motionDamping={15}
      />
    </div>
  )
}

export default MyResponsiveBar
