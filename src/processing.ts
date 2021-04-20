import { Cell, Sheet } from './types'

export const processPage = (page: Cell) => {
  console.info(Sheet.Processing)
  // find pages not yet processed
  // de-dupe text content using textContent Map
  // write de-duped text per Page
  // load Page textContent into Wink.js as Document (with title and metadata)
  // list all entities by type (sorted alphabetically, comma-separated)
  // list all tokens
  // write results
  // mark Page as Processed
}
