import QRCode from 'qrcode';

export async function generateQrCode(text: string, options?: QRCode.QRCodeToDataURLOptions): Promise<string> {
  try {
    const dataUrl = await QRCode.toDataURL(text, {
      width: options?.width || 300,
      margin: options?.margin ?? 2,
      color: {
        dark: options?.color?.dark || '#1C1917',
        light: options?.color?.light || '#FFFFFF',
      },
      errorCorrectionLevel: 'H',
    });
    return dataUrl;
  } catch (err) {
    console.error('Error generating QR code:', err);
    return '';
  }
}
