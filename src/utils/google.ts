import { GOOGLE_CLIENT_ID, GOOGLE_API_KEY, GOOGLE_VIEW_ID } from '../constants'

export const isUserSignedIn = () =>
  (window as any).gapi.auth2.getAuthInstance().isSignedIn.get()

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
    ]
  })

  return new Promise((resolve, _) => {
    // Listen for sign-in state changes.
    const auth2 = (window as any).gapi.auth2.getAuthInstance()

    // auth2.isSignedIn.listen(onUpdateSigninStatus)

    // Handle the initial sign-in state.
    resolve(isUserSignedIn())
  })
}

export const fetchRealTimeData = () => {
  if (!isUserSignedIn()) {
    throw new Error('Not authorized, cannot request data')
  }

  return (window as any).gapi.client.request({
    path: `https://www.googleapis.com/analytics/v3/data/realtime?ids=ga:${GOOGLE_VIEW_ID}&metrics=rt:activeUsers&dimensions=rt:country,rt:city,rt:browser`
  })
}
