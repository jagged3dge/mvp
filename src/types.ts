import { CreateOptions } from 'html-pdf'
import { DocumentPDFOptions } from 'html-pdf-node'

export type DocumentConfig = {
  url?: string
  template: string
  context: unknown
  type: 'buffer' | 'file'
  path?: string
}

export type PhantomJsPdfOptions = CreateOptions

export type PuppeteerPdfOptions = DocumentPDFOptions
