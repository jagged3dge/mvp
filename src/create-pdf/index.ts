import * as Handlebars from 'handlebars'
import { readFile, writeFile } from 'fs/promises'
import * as path from 'path'
import { DocumentConfig, generatePdf, PDFOptions } from './pdf'

export { DocumentConfig, PDFOptions } from './pdf'

// Handlebar helper support
export const registerHelper = (
  conditionName: string,
  callback: Handlebars.HelperDelegate
) => {
  Handlebars.registerHelper(conditionName, callback)
}

export const create = async (
  document: DocumentConfig,
  options?: PDFOptions
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

    const htmlTemplateContent = await readFile(document.template, {
      encoding: 'utf8',
    })
    const html = Handlebars.compile(htmlTemplateContent)(document.context)

    // Write to a temp file
    const tmpFile =
      path.dirname(document.template) +
      '/' +
      path.basename(document.template, '.html') +
      '.tmp.html'

    // console.log('tmpFile =', tmpFile)
    await writeFile(tmpFile, html)

    const buffer = await generatePdf({ url: 'file://' + tmpFile }, options)

    if (document.type === 'buffer') {
      return buffer
    } else {
      if (document.path) {
        const filename = path.resolve(document.path)
        await writeFile(filename, buffer)
        return { filename }
      }
    }
  } catch (err) {
    console.log('[Puppeteer-create-pdf]', 'err =', err)
    throw err
  }
}
