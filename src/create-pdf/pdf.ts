import puppeteer from 'puppeteer'
import { PDFOptions } from './types'

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

  // Workaround to force rendering of webfonts (Google fonts)
  // Got to check which one works better
  await page.focus('body')
  // await page.screenshot()

  const data = await page.pdf(options)

  await browser.close()

  return data
}
