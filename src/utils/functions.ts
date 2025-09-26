export const updateLastTime = (timestamp) => {
  var jsDate: any = new Date(timestamp)
  var currentDate = new Date()
  var currentTime = currentDate.getTime()

  var timeSince = Math.floor((currentTime - jsDate) / 1000)

  // year
  if (timeSince > 31536000) {
    return Math.floor(timeSince / 31536000) + ' years ago'
    // Days
  } else if (timeSince > 86400) {
    return Math.floor(timeSince / 86400) + ' days ago'
    // Hours
  } else if (timeSince > 3600) {
    return Math.floor(timeSince / 3600) + ' hours ago'
    // Minutes
  } else if (timeSince > 60) {
    return Math.floor(timeSince / 60) + ' minutes ago'
    // Seconds
  } else {
    return timeSince + ' seconds ago'
  }
}
