import {
  ChannelType,
  ClickRequest,
  ClickResponse,
  EventType,
  FillEnterMethod,
  FillTextRequest,
  FillTextResponse,
  RequestEvent,
} from './types'

export const createTab = (
  createProperties: chrome.tabs.CreateProperties,
): Promise<chrome.tabs.Tab> =>
  new Promise((resolve, _reject) => {
    chrome.tabs.create(createProperties, (tab: chrome.tabs.Tab) => {
      resolve(tab)
    })
  })

export const queryTab = (
  queryInfo: chrome.tabs.QueryInfo,
): Promise<chrome.tabs.Tab[]> =>
  new Promise((resolve, _reject) => {
    chrome.tabs.query(queryInfo, (results: chrome.tabs.Tab[]) => {
      resolve(results)
    })
  })

let modelPort: chrome.runtime.Port | undefined = undefined

export const connectModelChannel = (tabId: number) => {
  console.info('creating model channel connection handler for tabId:', tabId)
  modelPort = chrome.tabs.connect(tabId, { name: ChannelType.Model })
  console.info('created model channel connection handler')
}

export const requestClick = (
  tabId: number,
  clickSelector: string,
  clickText: string,
  expectSelector: string = '',
  expectText: string = '',
  timeout = 1000,
): Promise<ClickResponse> =>
  new Promise((resolve, reject) => {
    const message: RequestEvent<ClickRequest> = {
      type: EventType.Click,
      data: {
        clickSelector,
        clickText,
        expectSelector,
        expectText,
      },
    }

    const t = setTimeout(() => {
      console.warn('click timed out', message)
      reject()
    }, timeout)

    const listener = (response: ClickResponse) => {
      clearTimeout(t)
      console.info('click returned successful response', response)
      modelPort?.onMessage.removeListener(listener)
      resolve(response)
    }

    modelPort?.onMessage.addListener(listener)
    modelPort?.postMessage(message)
  })

export const requestFillText = (
  tabId: number,
  inputSelector: string,
  inputText: string,
  fillText: string = '',
  enter: FillEnterMethod,
  timeout = 1000,
): Promise<FillTextResponse> =>
  new Promise((resolve, reject) => {
    const message: RequestEvent<FillTextRequest> = {
      type: EventType.FillText,
      data: {
        inputSelector,
        inputText,
        fillText,
        enterMethod: enter,
      },
    }

    const t = setTimeout(() => {
      console.warn('fill text timed out', message)
      reject()
    }, timeout)

    const listener = (response: FillTextResponse) => {
      clearTimeout(t)
      console.info('fill text returned successful response', response)
      modelPort?.onMessage.removeListener(listener)
      resolve(response)
    }

    modelPort?.onMessage.addListener(listener)
    modelPort?.postMessage(message)
  })
