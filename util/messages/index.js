export const localeMessages = {
  approveRemove: 'Once approved, individual locales cannot be removed.',
}

export const demoDevicePlaylists = {
  noVideoAvailable: 'No video available for this device/locale combination.',
}

export const smartPlaylistMessages = {
  automaticContentPreview: 'Automatically created content cannot be previewed in RMM.',
  noContent: 'This playlist does not contain any content.',
  noAvailability: 'This playlist is not available yet in this locale\'s stores.',
  noDemoDeviceAvailability:
    'Demo device playlists cannot be removed from a store post-approval. This playlist can be overwritten by creating and approving a new playlist.',
}

export const ambientMessages = {
  editDisabledForClassicPlaylist: 'Ambient content cannot be edited once it is used in a classic playlist',
}

export const publishMessages = {
  republish(type) {
    return `The ${type} has tried to publish for the maximum amount of time and is now marked as a permanent failure.`
  },
}

export const dateTimeMessages = {
  timeRangeError: 'Please check these times. The start time must be earlier than the end time.',
  dateRangeError: 'Please check the dates. Start Date must be earlier than End Date.',
  timeFormatError: 'Please check the time. Times need to be formatted hh:mm',
  invalidDateError: 'Dates need to be a valid format.',
  missingDateError: 'Date is a required field.',
  missingTimeError: 'Time is a required field.',
}

export const activityLogMessages = {
  noLogs: 'There are no activity logs yet.',
}
