const axios = require('axios');
const fs = require('fs');
const path = require('path');

const queries = {
  home: ['handcrafted home decor', 'minimalist living room decor', 'artisanal pottery'],
  categories: ['indian textiles', 'wooden handcrafted furniture', 'decorative brass items'],
  banners: ['luxury interior design', 'craftsmanship close up', 'home styling'],
  products: ['handmade ceramic vase', 'woven rug pattern', 'wooden carving detail']
};

async function downloadImage(url, folder, filename) {
  const dir = path.join(__dirname, '../public', folder);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const writer = fs.createWriteStream(path.join(dir, filename));

  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream',
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}

async function fetchAndSave() {
  console.log('🚀 Starting Induvra Asset Sourcing (v2)...');

  for (const [folder, keywords] of Object.entries(queries)) {
    for (let i = 0; i < keywords.length; i++) {
      const keyword = keywords[i];
      console.log(`📸 Fetching "${keyword}" for /public/${folder}...`);
      
      // Use images.unsplash.com with specific dimensions
      const url = `https://images.unsplash.com/photo-1?auto=format&fit=crop&w=1600&q=80&q=${encodeURIComponent(keyword)}`;
      // Actually, Unsplash images need a specific ID. 
      // Let's use a fallback placeholder service that is more reliable than the deprecated Source API.
      const fallbackUrl = `https://loremflickr.com/1600/900/${encodeURIComponent(keyword)}`;
      
      try {
        await downloadImage(fallbackUrl, folder, `asset-${i + 1}.jpg`);
        console.log(`✅ Saved asset-${i + 1}.jpg to /public/${folder}`);
      } catch (err) {
        console.error(`❌ Failed to download "${keyword}":`, err.message);
      }
    }
  }
  
  console.log('✨ Asset sourcing complete!');
}

fetchAndSave();
