// row, column
export type Cell = [string, number]

// individual sheets within a Google Sheet
export enum Sheet {
  Tasks = 'Tasks',
  Crawler = 'Crawler',
  Processing = 'Processing',
  Results = 'Results',
}

export enum TasksColumn {
  'Brand' = 'A',
  'Site' = 'B',
  'Processed?' = 'C',
  'Pages Crawled' = 'D',
}

export enum CrawlerColumn {
  'Page URL' = 'A',
  'Page Scraped?' = 'B',
  'Page Processed?' = 'C',
  'Ignored?' = 'D',
  'Title' = 'E',
  'Text' = 'F',
  'Links' = 'G',
  'Metadata' = 'H',
}

export enum ProcessingColumn {
  'Site' = 'A',
  'Content' = 'B',
  'Entities' = 'C',
  'Tokens' = 'D',
}

export enum ResultsColumn {
  'Term' = 'A',
  'Frequency' = 'B',
  'Brands' = 'C',
  'Number of Brands' = 'D',
}

export type Column =
  | TasksColumn
  | CrawlerColumn
  | ProcessingColumn
  | ResultsColumn

export enum ChannelType {
  Model = 'WH::ModelChannel',
  Page = 'WH::PageChannel',
}

export enum EventType {
  Init = 'WH::Init',
  Config = 'WH::Config',
  Write = 'WH::Write',
  Read = 'WH::Read',
  Click = 'WH::Click',
  FillText = 'WH::FillText',
  GetLinks = 'WH::GetLinks',
  GetTextBody = 'WH::GetTextBody',
  GetTitle = 'WH::GetTitle',
  GetMetadata = 'WH::GetMetadata',
}

export enum EventStatus {
  Success = 'Success',
  Error = 'Error',
}

// similar to RPC
export interface RequestEvent<T> {
  type: EventType
  data: T
}

export interface ResponseEvent<T> {
  type: EventType
  status: EventStatus
  data?: T
}

export interface InitRequest {
  prefix: string
}

export interface InitResponse {
  title: string
}

export interface ClickRequest {
  clickSelector: string
  clickText: string
  expectSelector: string
  expectText: string
}

export interface ClickResponse {}

export enum FillEnterMethod {
  blur = 'blur',
  submit = 'submit',
}

export interface FillTextRequest {
  inputSelector: string
  inputText: string
  fillText: string
  enterMethod: FillEnterMethod
}

export interface FillTextResponse {}
