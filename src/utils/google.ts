import { GOOGLE_CLIENT_ID, GOOGLE_API_KEY, GOOGLE_VIEW_ID } from '../constants'
import { BarGraphData, SunburstData } from '../types'

export const isUserSignedIn = () => {
  if (!(window as any).gapi) return false
  return (window as any).gapi.auth2.getAuthInstance().isSignedIn.get()
}

const injectGoogleTag = (id: string, documentRoot: Document) =>
  new Promise((resolve, _) => {
    // adapted from:
    // https://github.com/CyrilSiman/react-google-oauth/blob/master/src/services/index.jsx#L5
    const firstScriptTag = documentRoot.getElementsByTagName('script')[0]
    const scriptTag = documentRoot.createElement('script')
    scriptTag.async = true
    scriptTag.defer = true
    scriptTag.id = id
    scriptTag.src = '//apis.google.com/js/client:platform.js'
    scriptTag.onload = resolve
    ;(firstScriptTag.parentNode || document).insertBefore(
      scriptTag,
      firstScriptTag
    )
  })

const loadGoogleAuth = () =>
  new Promise((resolve, _) => (window as any).gapi.load('auth2', resolve))

// resolves true or false indicating if the user is logged in or not
export const initGoogleAuth: () => Promise<boolean> = async () => {
  await injectGoogleTag('gapi-js', document)
  await loadGoogleAuth()

  await (window as any).gapi.client.init({
    clientId: GOOGLE_CLIENT_ID,
    apiKey: GOOGLE_API_KEY,
    scope: 'https://www.googleapis.com/auth/analytics.readonly',
    discoveryDocs: [
      'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'
    ],
    uxMode: 'redirect'
  })

  return new Promise((resolve, _) => {
    // Listen for sign-in state changes.
    const auth2 = (window as any).gapi.auth2.getAuthInstance()

    // auth2.isSignedIn.listen(onUpdateSigninStatus)

    // Handle the initial sign-in state.
    resolve(isUserSignedIn())
  })
}

// {
//     "kind": "analytics#realtimeData",
//     "id": "https://www.googleapis.com/analytics/v3/data/realtime?ids=ga:174135385&dimensions=rt:country,rt:browser&metrics=rt:activeUsers",
//     "query": {
//       "ids": "ga:174135385",
//       "dimensions": "rt:country,rt:browser",
//       "metrics": [
//         "rt:activeUsers"
//       ],
//       "max-results": 1000
//     },
//     "totalResults": 1,
//     "selfLink": "https://www.googleapis.com/analytics/v3/data/realtime?ids=ga:174135385&dimensions=rt:country,rt:browser&metrics=rt:activeUsers",
//     "profileInfo": {
//       "profileId": "174135385",
//       "accountId": "118132167",
//       "webPropertyId": "UA-118132167-1",
//       "internalWebPropertyId": "175044688",
//       "profileName": "All Web Site Data",
//       "tableId": "realtime:174135385"
//     },
//     "columnHeaders": [
//       {
//         "name": "rt:country",
//         "columnType": "DIMENSION",
//         "dataType": "STRING"
//       },
//       {
//         "name": "rt:browser",
//         "columnType": "DIMENSION",
//         "dataType": "STRING"
//       },
//       {
//         "name": "rt:activeUsers",
//         "columnType": "METRIC",
//         "dataType": "INTEGER"
//       }
//     ],
//     "totalsForAllResults": {
//       "rt:activeUsers": "1"
//     },
//     "rows": [
//       [
//         "Germany",
//         "Chrome",
//         "1"
//       ]
//     ]
//   }

type CountryObject = {
  [browser: string]: number | string
}

export const fetchUserBrowserData: () => Promise<BarGraphData | null> = async () => {
  if (!isUserSignedIn()) {
    throw new Error('Not authorized, cannot request data')
  }

  const response = await (window as any).gapi.client.request({
    path: `https://www.googleapis.com/analytics/v3/data/realtime?ids=ga:${GOOGLE_VIEW_ID}&metrics=rt:activeUsers&dimensions=rt:country,rt:browser`
  })

  if (!response.result.rows) {
    console.log('No active users')
    return null
  }

  const countryIndex = response.result.rows.reduce(
    (acc: any, item: any) => {
      const [country, browser, totalStr]: Array<string> = item
      const total = parseInt(totalStr, 10)

      // record the total for this browser/country pair
      if (!acc.countries[country]) acc.countries[country] = {}
      acc.countries[country][browser] = total

      // add this browser to the set of keys so we can pass
      // the values to d3 to create the graph later
      acc.browserSet.add(browser)

      return acc
    },
    { countries: {}, browserSet: new Set() }
  )

  return {
    keys: Array.from(countryIndex.browserSet),
    data: Object.keys(countryIndex.countries).map(countryKey => ({
      country: countryKey,
      ...countryIndex.countries[countryKey]
    }))
  }
}

export const fetchUserDeviceData: () => Promise<SunburstData | null> = async () => {
  if (!isUserSignedIn()) {
    throw new Error('Not authorized, cannot request data')
  }

  const response = await (window as any).gapi.client.request({
    path: `https://www.googleapis.com/analytics/v3/data/realtime?ids=ga:${GOOGLE_VIEW_ID}&metrics=rt:activeUsers&dimensions=rt:deviceCategory,rt:browser,rt:operatingSystem`
  })

  if (!response.result.rows) {
    console.log('No active users')
    return null
  }

  const totalUsersStr = response.result.totalsForAllResults['rt:activeUsers']
  const totalUsers = parseInt(totalUsersStr, 10)

  const userIndex = response.result.rows.reduce((acc: any, item: any) => {
    const [deviceType, browser, os, numUsersStr]: Array<string> = item
    const numUsers = parseInt(numUsersStr, 10)

    if (!acc[deviceType]) acc[deviceType] = {}
    if (!acc[deviceType][browser]) acc[deviceType][browser] = {}
    acc[deviceType][browser][os] = numUsers

    return acc
  }, {})

  return {
    name: 'devices',
    children: Object.entries(userIndex).map(
      ([deviceType, deviceObj]: [string, any]) => ({
        name: deviceType,
        children: Object.entries(deviceObj).map(
          ([browser, osObj]: [string, any]) => ({
            name: browser,
            children: Object.entries(osObj).map(
              ([os, numUsers]: [string, any]) => ({
                name: os,
                loc: ((numUsers as number) / totalUsers) * 100
              })
            )
          })
        )
      })
    )
  }
}
