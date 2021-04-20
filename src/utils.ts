export const wait = (ms: number): Promise<void> =>
  new Promise((resolve, _reject) => {
    console.info('waiting', ms, 'ms')
    setTimeout(() => {
      resolve()
    }, ms)
  })

export const jitter = (minimum: number, scale: number) =>
  Math.random() * scale + minimum
