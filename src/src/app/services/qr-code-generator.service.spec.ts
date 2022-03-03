import { TestBed } from '@angular/core/testing';

import { QrCodeGeneratorService } from './qr-code-generator.service';

describe('QrCodeGeneratorService', () => {
  let service: QrCodeGeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QrCodeGeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be generate a QR Code for fake website url', async () => {
    const dataUri = await service.getQRCodeDataUri('https://www.myfakewebsite.com/');
    expect(dataUri).toBeDefined();
    expect(dataUri).not.toBeNull();
    expect(dataUri).toContain('data:'); // Contains a QR code data uri
  });
});
