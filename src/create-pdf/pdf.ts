import puppeteer from 'puppeteer'

export type DocumentConfig = {
  url?: string
  template: string
  context: unknown
  type: 'buffer' | 'file'
  path?: string
}

export type PDFOptions = puppeteer.PDFOptions & {
  args?: puppeteer.BrowserLaunchArgumentOptions['args']
}

export async function generatePdf(file: { url: string }, options: PDFOptions) {
  // we are using headless mode
  let args = ['--no-sandbox', '--disable-setuid-sandbox']

  if (options.args) {
    args = options.args
    delete options.args
  }

  const browser = await puppeteer.launch({
    args,
  })
  const page = await browser.newPage()

  await page.goto(file.url, {
    waitUntil: ['load', 'networkidle0'], // wait for page to load completely
  })

  await page.focus('body')

  const data = await page.pdf(options)
  await browser.close()

  return data
}
