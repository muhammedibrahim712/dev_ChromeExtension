import {
  ChannelType,
  ClickRequest,
  ClickResponse,
  EventStatus,
  EventType,
  FillEnterMethod,
  FillTextRequest,
  FillTextResponse,
  // InitRequest,
  // InitResponse,
  RequestEvent,
  ResponseEvent,
} from './types'
import { wait } from './utils'
// import { init } from './model'

const modelPort = chrome.runtime.connect(chrome.runtime.id, {
  name: ChannelType.Model,
})
// const pagePort = chrome.runtime.connect({ name: ChannelType.Page })

const ping = () => {
  chrome.runtime.sendMessage('ping', async (response) => {
    if (chrome.runtime.lastError) {
      await wait(1000)
      ping()
    } else {
      if (response === 'pong') {
        console.info('ready', response)
      } else {
        console.error('unexpected response', response)
      }
    }
  })
}

ping()

modelPort.onMessage.addListener(async (msg: RequestEvent<any>) => {
  console.info('content script received event from model port')

  switch (msg.type) {
    // case EventType.Init: {
    //   try {
    //     const { prefix } = msg.data as InitRequest
    //     const data = await init(prefix)

    //     let response: ResponseEvent<InitResponse> = {
    //       type: EventType.Init,
    //       status: EventStatus.Success,
    //       data,
    //     }

    //     port.postMessage(response)
    //   } catch (err) {
    //     let response: ResponseEvent<InitResponse> = {
    //       type: EventType.Init,
    //       status: EventStatus.Error,
    //     }

    //     port.postMessage(response)
    //   }
    //   break
    // }
    case EventType.Click: {
      try {
        const data = await handleClick(msg.data as ClickRequest)

        let response: ResponseEvent<ClickResponse> = {
          type: EventType.Click,
          status: EventStatus.Success,
          data,
        }

        modelPort.postMessage(response)
      } catch (err) {
        let response: ResponseEvent<ClickResponse> = {
          type: EventType.Click,
          status: EventStatus.Error,
        }

        modelPort.postMessage(response)
      }
      break
    }
    case EventType.FillText: {
      try {
        const data = await handleFillText(msg.data as FillTextRequest)

        let response: ResponseEvent<FillTextResponse> = {
          type: EventType.FillText,
          status: EventStatus.Success,
          data,
        }

        modelPort.postMessage(response)
      } catch (err) {
        let response: ResponseEvent<FillTextResponse> = {
          type: EventType.FillText,
          status: EventStatus.Error,
        }

        modelPort.postMessage(response)
      }
      break
    }
    default: {
      console.info('unhandled event in background script:', msg)
    }
  }
})

// const modelPort = chrome.runtime.connect({ name: ChannelType.Model })
// const pagePort = chrome.runtime.connect({ name: ChannelType.Page })

// modelPort.onMessage.addListener(async (msg: RequestEvent<any>) => {
//   console.info('content script received event from model port')

//   switch (msg.type) {
//     case EventType.Click: {
//       try {
//         const data = await handleClick(msg.data as ClickRequest)

//         let response: ResponseEvent<ClickResponse> = {
//           type: EventType.Click,
//           status: EventStatus.Success,
//           data,
//         }

//         modelPort.postMessage(response)
//       } catch (err) {
//         let response: ResponseEvent<ClickResponse> = {
//           type: EventType.Click,
//           status: EventStatus.Error,
//         }

//         modelPort.postMessage(response)
//       }
//       break
//     }
//     case EventType.FillText: {
//       try {
//         const data = await handleFillText(msg.data as FillTextRequest)

//         let response: ResponseEvent<FillTextResponse> = {
//           type: EventType.FillText,
//           status: EventStatus.Success,
//           data,
//         }

//         modelPort.postMessage(response)
//       } catch (err) {
//         let response: ResponseEvent<FillTextResponse> = {
//           type: EventType.FillText,
//           status: EventStatus.Error,
//         }

//         modelPort.postMessage(response)
//       }
//       break
//     }
//     default: {
//       console.debug('unhandled event:', msg)
//     }
//   }
// })

const handleClick = async (
  clickRequest: ClickRequest,
): Promise<ClickResponse> => {
  let foundElement = false

  while (!foundElement) {
    const elements = [
      ...document.querySelectorAll<HTMLElement>(clickRequest.clickSelector),
    ]

    const element = elements.find((el) =>
      el.textContent?.includes(clickRequest.clickText),
    )

    if (element) {
      foundElement = true
      element.click()
    } else {
      await wait(100)
    }
  }

  let foundExpected = false

  if (clickRequest.expectSelector.length > 0) {
    while (!foundExpected) {
      const elements = [
        ...document.querySelectorAll<HTMLElement>(clickRequest.expectSelector),
      ]

      if (elements.length > 0) {
        if (clickRequest.expectText.length > 0) {
          const element = elements.find((el) =>
            el.textContent?.includes(clickRequest.expectText),
          )

          if (element) {
            foundExpected = true
          }
        } else {
          await wait(100) // wait a bit because we can't poll for expected text
          foundExpected = true
        }
      } else {
        await wait(100)
      }
    }
  } else {
    await wait(100) // wait a bit because we can't poll for expected element
  }

  return {}
}

const handleFillText = async (
  fillTextRequest: FillTextRequest,
): Promise<FillTextResponse> => {
  let foundElement = false

  while (!foundElement) {
    const elements = [
      ...document.querySelectorAll<HTMLInputElement>(
        fillTextRequest.inputSelector,
      ),
    ]

    const element = elements.find((el) =>
      el.textContent?.includes(fillTextRequest.inputText),
    )

    if (element) {
      foundElement = true
      element.setAttribute('value', fillTextRequest.fillText)
      element.value = fillTextRequest.fillText
      if (fillTextRequest.enterMethod === FillEnterMethod.blur) {
        element.blur()
      } else if (fillTextRequest.enterMethod === FillEnterMethod.submit) {
        element.form?.submit()
      } else {
        console.warn('unknown enter method')
      }
    } else {
      await wait(100)
    }
  }

  return {}
}

// TODO: call scraper
