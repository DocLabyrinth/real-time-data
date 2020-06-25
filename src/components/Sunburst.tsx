import React, { useEffect } from 'react'
import { ResponsiveSunburst } from '@nivo/sunburst'
import { Heading } from 'theme-ui'
import { useSelector, useDispatch } from 'react-redux'
import {
  selectDeviceData,
  fetchDeviceData,
  clearDeviceData
} from '../slices/realtimeDataSlice'
import { makePoller } from '../utils/network'
import MyResponsiveBar from './BarChart'

const MyResponsiveSunburst = () => {
  const data = useSelector(selectDeviceData)
  const dispatch = useDispatch()

  useEffect(() => {
    let stopPolling = false
    const dataPoller = makePoller(
      () => {
        dispatch(fetchDeviceData())
      },
      () => !stopPolling,
      5000
    )

    dataPoller()

    return () => {
      dispatch(clearDeviceData())
      stopPolling = true
    }
  }, [])

  return (
    <div style={{ height: 500 }}>
      <Heading>Active User Breakdown - Browser / Device Type / OS</Heading>
      {(data.children || []).length < 1 && (
        <h5>There are currently no active users</h5>
      )}
      <ResponsiveSunburst
        data={data}
        margin={{ top: 40, right: 20, bottom: 20, left: 20 }}
        identity='name'
        value='loc'
        cornerRadius={2}
        borderWidth={1}
        borderColor='white'
        colors={{ scheme: 'nivo' }}
        childColor={{ from: 'color' }}
        animate={true}
        motionStiffness={90}
        motionDamping={15}
        isInteractive={true}
      />
    </div>
  )
}

export default MyResponsiveSunburst
