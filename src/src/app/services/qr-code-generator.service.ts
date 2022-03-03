import { Injectable } from '@angular/core';
import { AwesomeQR } from 'awesome-qr';

@Injectable({
  providedIn: 'root'
})
export class QrCodeGeneratorService {

  constructor() { }

  public async getQRCodeDataUri(message: string): Promise<string> {
    if (!message || message.length == 0)
      return "";

    const qr: any = await new AwesomeQR({
                        text: message,
                        size: 250,
                    }).draw();
    return qr;
  }
}
