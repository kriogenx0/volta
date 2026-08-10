export function toMinAndSec(durationInSeconds = 0) {
  let minutes = Math.floor(durationInSeconds / 60).toString()
  let seconds = Math.round(durationInSeconds % 60).toString()

  if (minutes.length === 1) minutes = '0' + minutes
  if (seconds.length === 1) seconds = '0' + seconds

  return minutes + ':' + seconds
}

// Used to format data-qa-id
export function toQaId({ parentId, componentId, useId } = {}) {
  return [parentId, componentId, useId].filter(Boolean).join('_')
}
