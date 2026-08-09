// @flow
export function toMinAndSec(durationInSeconds: number = 0): string {
  let minutes = Math.floor(durationInSeconds / 60).toString()
  let seconds = Math.round(durationInSeconds % 60).toString()

  if (minutes.length === 1) minutes = '0' + minutes
  if (seconds.length === 1) seconds = '0' + seconds

  return minutes + ':' + seconds
}

type TestIdType = {
  componentId?: string,
  parentId?: string,
  useId?: string,
}

// Used to format data-qa-id
export function toQaId({ parentId, componentId, useId }: TestIdType = {}): string {
  return [parentId, componentId, useId].filter(Boolean).join('_')
}
