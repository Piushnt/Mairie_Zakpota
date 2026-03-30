export function parseImageUrl(url: string | undefined): string {
  if (!url) return '';
  
  // Clean potential whitespace
  const cleanUrl = url.trim();

  // ImgBB Embed HTML (extract src)
  // e.g., <a href="https://ibb.co/XXXX"><img src="https://i.ibb.co/XXXX/image.png" alt="img" border="0"></a>
  if (cleanUrl.includes('<img') && cleanUrl.includes('src=')) {
    const match = cleanUrl.match(/src=["'](.*?)["']/);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  // Google Drive Share Link
  // Ex: https://drive.google.com/file/d/1XyZ.../view?usp=sharing
  const driveRegex = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
  const match = cleanUrl.match(driveRegex);
  if (match && match[1]) {
    return `https://drive.google.com/uc?id=${match[1]}`;
  }
  
  return cleanUrl;
}
