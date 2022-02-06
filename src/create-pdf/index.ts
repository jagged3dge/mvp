import { readFile, writeFile } from 'fs/promises'
import * as Handlebars from 'handlebars'
import { tmpdir } from 'os'
import { basename, resolve } from 'path'
import { generatePdf } from './pdf'
import { DocumentConfig, PDFOptions } from './types'

// Handlebar helper support
export const registerHelper = (
  conditionName: string,
  callback: Handlebars.HelperDelegate
) => {
  Handlebars.registerHelper(conditionName, callback)
}

export const createPDF = async (
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
    const tmpFile = resolve(
      tmpdir(),
      basename(document.template, '.html') + '.tmp.html'
    )

    console.log('tmpFile =', tmpFile)
    await writeFile(tmpFile, html)

    const buffer = await generatePdf({ url: 'file://' + tmpFile }, options)

    if (document.type === 'buffer') {
      return buffer
    } else {
      if (document.path) {
        const filename = resolve(document.path)
        await writeFile(filename, buffer)
        return { filename }
      }
    }
  } catch (err) {
    console.log('[Puppeteer-create-pdf]', 'err =', err)
    throw err
  }
}
