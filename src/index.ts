// import { create } from './html-pdf/create-pdf'
import {
  DocumentConfig,
  PhantomJsPdfOptions,
  PuppeteerPdfOptions,
} from './types'
import * as path from 'path'
import { readFile } from 'fs/promises'
import { create } from './html-pdf-node/create-pdf'

async function main() {
  try {
    const html = await readFile('src/test.html', { encoding: 'utf8' })

    const documentConfig: DocumentConfig = {
      type: 'file',
      path: 'output/test.pdf',
      context: {
        name: 'World',
      },
      template: html,
    }

    const assetPath = 'src/assets'
    const basePath =
      'file://' + path.resolve(assetPath).split(path.sep).join(path.posix.sep)
    console.log('basePath =', basePath)

    const phantomJsPdfOptions: PhantomJsPdfOptions = {
      // format: 'A4',
      type: 'pdf',
      orientation: 'landscape',
      border: '10mm',
      base: basePath,
      localUrlAccess: true,

      phantomArgs: ['--ignore-ssl-errors=yes'],
    }

    const puppeteerPdfOptions: PuppeteerPdfOptions = {
      format: 'a4',
      margin: { top: '10mm', left: '10mm', right: '10mm', bottom: '10mm' },
    }

    const result = await create(documentConfig, puppeteerPdfOptions)
    console.log('PDF Created', result)
  } catch (err) {
    console.log('err =', err)
  }
}

void main()
