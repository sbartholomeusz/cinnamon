import { Injectable } from '@angular/core';
import * as printJs from 'print-js'

@Injectable({
  providedIn: 'root'
})
export class PrinterService {

  constructor() { }

  /**
   * Open the print preview dialog for the specified HTML element
   * @param htmlElement source element
   */
  public async printElement(htmlElement: HTMLElement) : Promise<void> {
    if (htmlElement) {
      printJs({printable: htmlElement.id, type: 'html', targetStyles: ['*']});
    }
  }
}
