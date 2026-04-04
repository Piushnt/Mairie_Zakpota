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

export function getOptimizedNetworkUrl(url: string | undefined, width: number = 800): string {
  const parsed = parseImageUrl(url);
  if (!parsed) return '';

  // Google Drive Thumbnail API for lighter images
  if (parsed.includes('drive.google.com/uc?id=')) {
    const id = parsed.split('id=')[1];
    // Google Drive sz parameter supports width: s1000, w1000 etc.
    return `https://drive.google.com/thumbnail?id=${id}&sz=w${width}`;
  }

  // Unsplash formatting for WebP compression
  if (parsed.includes('images.unsplash.com')) {
    // Remove existing width/quality params to re-apply them correctly
    const baseUrl = parsed.split('?')[0];
    const q = width > 1000 ? 80 : 70; // Better quality for large images
    return `${baseUrl}?auto=format&fit=crop&q=${q}&w=${width}&fm=webp`;
  }

  return parsed;
}
