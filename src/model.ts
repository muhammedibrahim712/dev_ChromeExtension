// for using spreadsheet as db

import {
  Cell,
  Column,
  CrawlerColumn,
  FillEnterMethod,
  InitResponse,
  ProcessingColumn,
  ResultsColumn,
  Sheet,
  TasksColumn,
} from './types'
// import { urls } from './constants'
import {
  connectModelChannel,
  createTab,
  queryTab,
  requestClick,
  requestFillText,
} from './chrome'
import { wait } from './utils'

export let driveTabId: number | undefined = undefined
export let sheetTabId: number | undefined = undefined

export const init = async (
  tabId: number,
  prefix: string,
): Promise<InitResponse> => {
  /// open drive, click new Google Sheet, get url
  // const driveTabs = await queryTab({
  //   url: urls.googleDriveFolder,
  // })

  // if (driveTabs.length === 0) {
  //   let driveTab = await createTab({
  //     active: true,
  //     url: urls.googleDriveFolder,
  //   })
  //   driveTabId = driveTab.id
  // } else {
  //   driveTabId = driveTabs[0].id
  // }

  // if (!driveTabId) {
  //   console.error("couldn't get Google Drive tab ID")
  //   throw new Error('extension exception')
  // }

  await wait(2000)

  driveTabId = tabId
  connectModelChannel(driveTabId)

  await wait(2000)

  await requestClick(driveTabId, 'div', 'New', 'div', 'Google Sheets')
  await requestClick(
    driveTabId,
    'div',
    'Google Sheets',
    'button',
    'Create and share',
  )
  await requestClick(driveTabId, 'div', 'Create and share')

  await wait(100)

  const sheetTabs = await queryTab({
    title: 'Untitled spreadsheet - Google Sheets',
  })

  if (sheetTabs.length > 0) {
    sheetTabId = sheetTabs[0].id
  } else {
    console.error("couldn't find new Google Sheet tab")
    throw new Error('extension exception')
  }

  if (!sheetTabId) {
    console.error("couldn't get Google Sheet tab ID")
    throw new Error('extension exception')
  }

  /// get current date
  const [date] = new Date().toISOString().split('T')
  /// new title
  const title = `WH-${prefix.toUpperCase()} ${date}`

  // rename spreadsheet
  await requestClick(
    sheetTabId,
    'input.docs-title-input',
    'Untitled spreadsheet',
  )
  await requestFillText(
    sheetTabId,
    'input.docs-title-input',
    'Untitled spreadsheet',
    title,
    FillEnterMethod.blur,
  )

  // create column headers
  write(Sheet.Tasks, TasksColumn.Brand, 1, 'Brand')
  write(Sheet.Tasks, TasksColumn.Site, 1, 'Site')
  write(Sheet.Tasks, TasksColumn['Processed?'], 1, 'Processed?')
  write(Sheet.Tasks, TasksColumn['Pages Crawled'], 1, 'Pages Crawled')
  write(Sheet.Crawler, CrawlerColumn['Page URL'], 1, 'Page URL')
  write(Sheet.Crawler, CrawlerColumn['Page Scraped?'], 1, 'Page Scraped?')
  write(Sheet.Crawler, CrawlerColumn['Page Processed?'], 1, 'Page Processed?')
  write(Sheet.Crawler, CrawlerColumn['Ignored?'], 1, 'Ignored?')
  write(Sheet.Crawler, CrawlerColumn.Title, 1, 'Title')
  write(Sheet.Crawler, CrawlerColumn.Text, 1, 'Text')
  write(Sheet.Crawler, CrawlerColumn.Links, 1, 'Links')
  write(Sheet.Crawler, CrawlerColumn.Metadata, 1, 'Metadata')
  write(Sheet.Processing, ProcessingColumn.Site, 1, 'Site')
  write(Sheet.Processing, ProcessingColumn.Content, 1, 'Content')
  write(Sheet.Processing, ProcessingColumn.Entities, 1, 'Entities')
  write(Sheet.Processing, ProcessingColumn.Tokens, 1, 'Tokens')
  write(Sheet.Results, ResultsColumn.Term, 1, 'Term')
  write(Sheet.Results, ResultsColumn.Frequency, 1, 'Frequency')
  write(Sheet.Results, ResultsColumn.Brands, 1, 'Brands')
  write(Sheet.Results, ResultsColumn['Number of Brands'], 1, 'Number of Brands')

  return { title }
}

export const config = (title: string, url: string) => {
  // set current title and url for db in memory
}

export const write = (sheet: Sheet, column: Column, row = 0, value: string) => {
  if (!sheetTabId) {
    console.error('no sheet tab configured')
    throw new Error('write exception')
  }

  sheetTabId

  // TODO: check if row is 0, which means to append as last row
  // TODO: switch to sheet
  // TODO: write to cell
}

export const read = (
  tab: string,
  sheet: Sheet,
  column: Column,
  row = 0,
  defaultValue?: string,
) => {
  // TODO: check if row is 0, which means to append as last row
  // TODO: switch to sheet
  // TODO: read from cell
}
