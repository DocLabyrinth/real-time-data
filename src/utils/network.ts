export const makePoller = (
  pollFunc: () => void,
  shouldContinue: () => boolean,
  pollTime: number
) => () => {
  // make a function which keeps rescheduling itself
  // until shouldContinue() returns non-truthy
  const repeatFunc = () => {
    try {
      pollFunc()
    } catch (err) {}

    if (!shouldContinue()) {
      return
    }

    setTimeout(repeatFunc, pollTime)
  }

  // start the loop by invoking the repeating function
  repeatFunc()
}
