# WebHarvester (From Chrome Extension TypeScript Starter)

![build](https://github.com/chibat/chrome-extension-typescript-starter/workflows/build/badge.svg)

Chrome Extension, TypeScript and Visual Studio Code

## Tasks

- [x] Sketch out functionality
  - [x] Model (new, config, write, read)
  - [x] Crawler Workflow (start, pause, resume)
  - [x] Processing
  - [x] Results
- [ ] Model Implementation
  - [x] Init
  - [ ] Config
  - [ ] Write
  - [ ] Read
- [ ] Scraper Implementation
  - [ ] Open New Tab
  - [ ] Navigate to URL
  - [ ] Wait for DOM to be loaded
  - [ ] Scan for links to new unique Pages
  - [ ] Scrape DOM text, double line-break-separated
  - [ ] Page Title
  - [ ] OG Tags (Metadata)
  - [ ] Write contents for Page to Crawler Sheet
  - [ ] Mark page as crawled
  - [ ] Captcha detection
- [ ] NLP Implementation
  - [ ] De-Dupe
  - [ ] Write Dedupe
  - [ ] Write Unique Content per-Page
  - [ ] Load Content into NLP
  - [ ] List all entities (sorted alphabetically, comma-separated)
  - [ ] List all tokens
- [ ] Popup UI elements
  - [ ] Buttons
    - [ ] New, use corrent
    - [ ] Start, stop, pause
  - [ ] Events
    - [ ] Status events
      - [ ] Crawler count (crawled / pages)
  - [ ] Calls
    - [ ] Use current: model.config
  - [ ] Fields
    - [ ] New Sheet title prefix
  - [ ] Statuses
    - [ ] Crawling
      - [ ] Pages crawled
      - [ ] Pages queued
      - [ ] Elapsed
    - [ ] Processing
- [ ] Manual Testing and Debugging
- [ ] Operator Instructions
  - [ ] Pre-Requisites
    - [ ] uBlock Origin Extension
    - [ ] Use Chrome Browser
  - [ ] Usage
    - [ ] Login and open as you normally would
    - [ ] Do not use private browsing, otherwise we might run into captchas
  - [ ] Caveats
    - [ ] There is a risk of a circular crawl
  - [ ] Cleanup
    - [ ] Remove extension

## Prerequisites

- [node + npm](https://nodejs.org/) (Current Version)

## Option

- [Visual Studio Code](https://code.visualstudio.com/)

## Includes the following

- TypeScript
- Webpack
- React
- Example Code
  - Chrome Storage
  - Options Version 2
  - content script
  - count up badge number
  - background

## Project Structure

- src/typescript: TypeScript source files
- src/assets: static files
- dist: Chrome Extension directory
- dist/js: Generated JavaScript files

## Setup

```
npm install
```

## Import as Visual Studio Code project

...

## Build

```
npm run build
```

## Build in watch mode

### terminal

```
npm run watch
```

### Visual Studio Code

Run watch mode.

type `Ctrl + Shift + B`

## Load extension to chrome

Load `dist` directory
