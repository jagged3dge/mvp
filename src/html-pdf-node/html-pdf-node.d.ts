declare module 'html-pdf-node' {
  import {
    LaunchOptions,
    BrowserLaunchArgumentOptions,
    BrowserConnectOptions,
    Product,
    PDFOptions,
  } from 'puppeteer'

  type PuppeteerArgs = LaunchOptions &
    BrowserLaunchArgumentOptions &
    BrowserConnectOptions & {
      product?: Product
      extraPrefsFirefox?: Record<string, unknown>
    }

  export type DocumentConfig = {
    url?: string
    content?: string
  }

  export type DocumentPDFOptions = PDFOptions & { args?: PuppeteerArgs }

  export function generatePdf(
    file: DocumentConfig,
    options?: DocumentPDFOptions
  ): Promise<Buffer>

  export function generatePdfs(
    files: DocumentConfig[],
    options?: DocumentPDFOptions
  ): Promise<Buffer>[]
}
