import puppeteer from 'puppeteer';


export type DocumentConfig = {
  url?: string;
  template: string;
  context: unknown;
  type: 'buffer' | 'file';
  path?: string;
};

export type PDFOptions = puppeteer.PDFOptions & {
  args?: puppeteer.BrowserLaunchArgumentOptions['args'];
};
