import * as path from 'path'
import { create, DocumentConfig, PDFOptions } from './create-pdf'

async function main() {
  try {
    const templateDir = path.resolve(process.cwd(), 'templates', 'test')
    const templateFile = path.resolve(templateDir, 'test.html')

    const documentConfig: DocumentConfig = {
      type: 'file',
      path: 'output/test.pdf',
      context: {
        name: 'World',
      },
      template: templateFile,
    }

    const puppeteerPdfOptions: PDFOptions = {
      format: 'a4',
      margin: { top: '10mm', left: '10mm', right: '10mm', bottom: '10mm' },
      landscape: true,
    }

    const result = await create(documentConfig, puppeteerPdfOptions)
    console.log('PDF Created', result)
  } catch (err) {
    console.log('err =', err)
  }
}

void main()
