import { init } from './model'
import { queryTab, createTab } from './chrome'
import { pageTitles, urls } from './constants'
import {
  ChannelType,
  EventStatus,
  EventType,
  InitRequest,
  InitResponse,
  RequestEvent,
  ResponseEvent,
} from './types'
import { wait } from './utils'

chrome.runtime.onConnect.addListener((port) => {
  console.info('connecting background script to port', port)

  if (port.name == ChannelType.Model) {
    console.info('background script successfully connected to model port')

    port.onMessage.addListener(async (msg: RequestEvent<any>) => {
      switch (msg.type) {
        case EventType.Init: {
          try {
            const { prefix } = msg.data as InitRequest

            const driveTabs = await queryTab({
              title: pageTitles.googleDriveFolder,
            })

            let driveTabId

            if (driveTabs.length === 0) {
              let driveTab = await createTab({
                active: true,
                url: urls.googleDriveFolder,
              })
              await wait(5000)
              driveTabId = driveTab.id
            } else {
              driveTabId = driveTabs[0].id
              await wait(2000)
            }

            if (!driveTabId) {
              console.error("couldn't get Google Drive tab ID")
              throw new Error('extension exception')
            }

            const data = await init(driveTabId, prefix)

            let response: ResponseEvent<InitResponse> = {
              type: EventType.Init,
              status: EventStatus.Success,
              data,
            }

            port.postMessage(response)
          } catch (err) {
            let response: ResponseEvent<InitResponse> = {
              type: EventType.Init,
              status: EventStatus.Error,
            }

            port.postMessage(response)
          }
          break
        }
        default: {
          console.info('unhandled event in background script:', msg)
        }
      }
    })
  }
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.info('received connection in background script', request, sender)
  sendResponse('pong')
})
