const useSleep = (ms = 0) => {
  return new Promise<void>(resolve => {
    setTimeout(resolve, ms)
  })
}

export { useSleep, useSleep as $sleep }
