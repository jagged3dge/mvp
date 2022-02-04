import { create, DocumentConfig, PdfOptions } from './create-pdf'
import * as fs from 'fs'
import * as path from 'path'

async function main() {
  try {
    const html = fs.readFileSync('src/test.html', 'utf8')

    const documentConfig: DocumentConfig = {
      type: 'file',
      path: 'output/test.pdf',
      context: {
        name: 'World',
      },
      template: html,
    }

    const assetPath = 'src/'
    const basePath = 'file://' + (path.resolve(assetPath)).split(path.sep).join(path.posix.sep)
    console.log('basePath =', basePath)

    const pdfOptions: PdfOptions = {
      format: 'A4',
      type: 'pdf',
      orientation: 'landscape',
      border: '10mm',
      base: basePath,
      localUrlAccess: true,
    }

    await create(documentConfig)
    console.log('PDF Created')
  } catch (err) {
    console.log('err =', err)
  }
}

void main()
