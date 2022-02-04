import * as Handlebars from 'handlebars'
import { readFile, writeFile } from 'fs/promises'
import * as HtmlToPdf from 'html-pdf-node'
import { DocumentConfig, PuppeteerPdfOptions } from '../types'
import * as path from 'path'

// Handlebar helper support
export const registerHelper = (
  conditionName: string,
  callback: Handlebars.HelperDelegate
) => {
  Handlebars.registerHelper(conditionName, callback)
}

export const create = async (
  document: DocumentConfig,
  options?: PuppeteerPdfOptions
) => {
  try {
    if (!document || !document.template || !document.context) {
      throw new Error('Some, or all, options are missing.')
    }

    if (document.type !== 'buffer' && !document.path) {
      throw new Error(
        "Please provide path parameter to save file or if you want buffer as output give parameter type = 'buffer'"
      )
    }

    const htmlFile = await readFile(document.template, { encoding: 'utf8' })
    const html = Handlebars.compile(htmlFile)(document.context)
    // console.log('html =', html)
    // Write to a temp file
    const tmpFile =
      path.dirname(document.template) +
      '/' +
      path.basename(document.template, '.html') +
      '.tmp.html'

    console.log('tmpFile =', tmpFile)
    await writeFile(tmpFile, html)

    // const buffer = await HtmlToPdf.generatePdf({ content: html }, options)
    const buffer = await HtmlToPdf.generatePdf(
      { url: 'file://' + tmpFile },
      options
    )

    if (document.type === 'buffer') {
      return buffer
    } else {
      if (document.path) await writeFile(document.path, buffer)
    }
  } catch (err) {
    console.log('[Puppeteer-create-pdf]', 'err =', err)
  }
}
