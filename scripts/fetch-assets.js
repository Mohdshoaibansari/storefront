const axios = require('axios');
const fs = require('fs');
const path = require('path');

const queries = {
  home: ['handcrafted home decor', 'minimalist living room decor', 'artisanal pottery'],
  categories: ['indian textiles', 'wooden handcrafted furniture', 'decorative brass items'],
  banners: ['luxury interior design', 'craftsmanship close up', 'home styling'],
  products: ['handmade ceramic vase', 'woven rug pattern', 'wooden carving detail']
};

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function downloadImage(url, folder, filename) {
  const dir = path.join(__dirname, '../public', folder);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const writer = fs.createWriteStream(path.join(dir, filename));

  try {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream',
      timeout: 10000,
      headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'
      }
    });

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  } catch (error) {
    if (error.response && error.response.status === 403) {
      throw new Error('Access forbidden (403). The service might be blocking automated downloads.');
    }
    throw error;
  }
}

async function fetchAndSave() {
  console.log('🚀 Starting Induvra Asset Sourcing (v3)...');

  for (const [folder, keywords] of Object.entries(queries)) {
    for (let i = 0; i < keywords.length; i++) {
      const keyword = keywords[i];
      console.log(`📸 Fetching "${keyword}" for /public/${folder}...`);
      
      // Using a different service: picsum.photos for random but high quality
      // Or trying to use Unsplash direct URLs if we can guess them
      // Let's try placeholder.com fallback or just random picsum if keywords fail
      const urls = [
        `https://loremflickr.com/1600/900/${encodeURIComponent(keyword.replace(/ /g, ','))}`,
        `https://source.unsplash.com/featured/1600x900/?${encodeURIComponent(keyword)}`,
        `https://picsum.photos/1600/900`
      ];

      let success = false;
      for (const url of urls) {
        try {
          await downloadImage(url, folder, `asset-${i + 1}.jpg`);
          console.log(`✅ Saved asset-${i + 1}.jpg to /public/${folder} using ${url}`);
          success = true;
          break;
        } catch (err) {
          console.log(`⚠️ Failed with ${url}: ${err.message}`);
          await delay(2000); // Wait before trying next service
        }
      }

      if (!success) {
        console.error(`❌ All services failed for "${keyword}"`);
      }
      
      await delay(3000); // Wait between keywords to avoid rate limits
    }
  }
  
  console.log('✨ Asset sourcing complete!');
}

fetchAndSave();
