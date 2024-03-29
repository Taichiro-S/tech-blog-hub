module.exports = { sleep }

async function sleep(duration) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, duration)
  })
}
