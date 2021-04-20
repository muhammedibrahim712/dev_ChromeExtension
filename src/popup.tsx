import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'

// import { init } from './model'
import {
  ChannelType,
  EventStatus,
  EventType,
  InitRequest,
  InitResponse,
  RequestEvent,
  ResponseEvent,
} from './types'

const modelPort = chrome.runtime.connect({ name: ChannelType.Model })

const Popup = () => {
  const [newSheetDisabled, setNewSheetDisabled] = useState(false)
  const [currentSheet, setCurrentSheet] = useState<string>('None configured')

  // useEffect(() => {
  //   modelPort.onMessage.addListener((response: ResponseEvent<any>) => {
  //     console.log('result message:', response)
  //     switch (response.type) {
  //       case EventType.Init: {
  //         if (response.status === EventStatus.Success) {
  //           setCurrentSheet(response.data?.title || '')
  //         } else if (response.status === EventStatus.Error) {
  //           console.error('error creating new sheet', response)
  //         }
  //         setNewSheetDisabled(false)
  //         break
  //       }
  //       default: {
  //         console.info('unhandled event in popup model listener', response)
  //       }
  //     }
  //   })
  // }, [modelPort.name])

  const newSheet = async () => {
    setNewSheetDisabled(true)

    try {
      const message: RequestEvent<InitRequest> = {
        type: EventType.Init,
        data: {
          prefix: 'TESTING', // TODO: should be user-configurable
        },
      }

      const listener = (response: ResponseEvent<InitResponse>) => {
        console.info('received init response:', response)

        if (response.type === EventType.Init) {
          if (response.status === EventStatus.Success) {
            modelPort.onMessage.removeListener(listener)
            setCurrentSheet(response?.data?.title || 'Error')
            setNewSheetDisabled(false)
          } else {
            console.error('error creating new sheet')
          }
        } else {
          console.info('unhandled event received by popup script')
        }
      }

      modelPort.onMessage.addListener(listener)
      modelPort.postMessage(message)

      console.info('successfully initialized new sheet')
    } catch {
      console.error('error initializing new sheet')
    }

    // let response: ResponseEvent<InitResponse> = {
    //   type: EventType.Init,
    //   status: EventStatus.Success,
    //   data,
    // }

    // const message: RequestEvent<InitRequest> = {
    //   type: EventType.Init,
    //   data: {
    //     prefix: 'TESTING', // TODO: should be user-configurable
    //   },
    // }

    // modelPort.postMessage(message)
  }

  return (
    <>
      <button disabled={newSheetDisabled} onClick={newSheet}>
        Create a new Sheet
      </button>
      <div>Current Sheet: {currentSheet}</div>
    </>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById('root'),
)
