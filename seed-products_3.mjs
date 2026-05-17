/**
 * Medusa v2 — Product Seed Script (FIXED)
 * Fix: Removed 'inventory_quantity' (not allowed in V2 creation)
 * Fix: Corrected image variable name and added placeholder logic.
 * Run: node seed-products_3.mjs
 */

import "dotenv/config";

const BACKEND_URL   = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
const ADMIN_EMAIL   = process.env.MEDUSA_ADMIN_EMAIL   || "admin@medusa-test.com";
const ADMIN_PASSWORD = process.env.MEDUSA_ADMIN_PASSWORD || "supersecret";

const CURRENCY            = "usd";
const LOW_STOCK_THRESHOLD = 10;

let JWT_TOKEN = null;

async function api(method, path, body = null) {
  const headers = { "Content-Type": "application/json" };
  if (JWT_TOKEN) headers["Authorization"] = `Bearer ${JWT_TOKEN}`;
  const res  = await fetch(`${BACKEND_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = text; }
  if (!res.ok) throw new Error(`${method} ${path} → ${res.status}: ${JSON.stringify(data)}`);
  return data;
}

const toHandle = (str) =>
  str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

function priceForCategory(parentCat, subcategory) {
  const priceMap = {
    "Kitchen & Dining": {
      Drinkware:           { min: 399,  max: 1499 },
      Serveware:           { min: 599,  max: 2999 },
      "Kitchen Storage":   { min: 349,  max: 1799 },
      "Table Accessories": { min: 249,  max: 999  },
      Cutlery:             { min: 299,  max: 1999 },
    },
    "Home Decor": {
      "Wall Decor":               { min: 699,  max: 3499 },
      "Decorative Vases":         { min: 499,  max: 2499 },
      "Showpieces & Figurines":   { min: 599,  max: 4999 },
      "Candles & Fragrances":     { min: 249,  max: 1299 },
      "Bathroom Decor":           { min: 349,  max: 1999 },
    },
    Lighting: {
      "Table Lamps": { min: 1499, max: 5999 },
    },
  };
  const range = priceMap[parentCat]?.[subcategory] || { min: 499, max: 1999 };
  return Math.round((range.min + range.max) / 2);
}

function variantsFor(childSubcategory, basePrice) {
  const sizeOptions = {
    "Ceramic Coffee Mugs":      ["250ml", "350ml", "450ml"],
    "Tea Cups & Saucers":       ["150ml Cup Only", "150ml Cup+Saucer x2", "150ml Cup+Saucer x4"],
    "Copper Bottles":           ["500ml", "750ml", "1L"],
    "Glass Tumblers":           ["300ml", "450ml", "600ml"],
    "Wooden Drinkware":         ["200ml", "300ml"],
    "Serving Bowls":            ["Small 500ml", "Medium 1L", "Large 1.5L"],
    "Platters":                 ["10 inch", "12 inch", "14 inch"],
    "Dinner Sets":              ["12-Piece", "18-Piece", "24-Piece"],
    "Snack Plates":             ["6-Inch", "8-Inch", "10-Inch"],
    "Trays":                    ["Small", "Medium", "Large"],
    "Spice Boxes":              ["4 Compartments", "7 Compartments", "12 Compartments"],
    "Jars & Containers":        ["250ml", "500ml", "1L"],
    "Tea & Coffee Storage":     ["250g", "500g", "1kg"],
    "Oil & Vinegar Bottles":    ["200ml", "500ml", "750ml"],
    "Bread Boxes":              ["Small", "Medium", "Large"],
    "Coasters":                 ["Set of 2", "Set of 4", "Set of 6"],
    "Napkin Holders":           ["Single", "Set of 2"],
    "Cutlery Holders":          ["Small", "Large"],
    "Salt & Pepper Sets":       ["Set of 2", "Set of 4"],
    "Pickle Holders":           ["250ml", "500ml"],
    "Spoon Sets":               ["Set of 6", "Set of 12"],
    "Fork Sets":                ["Set of 6", "Set of 12"],
    "Knife Sets":               ["Set of 4", "Set of 6"],
    "Serving Spoons":           ["Set of 3", "Set of 6"],
    "Chopsticks":               ["1 Pair", "2 Pairs", "4 Pairs"],
    "Wall Art":                 ["12x16 inch", "18x24 inch", "24x36 inch"],
    "Mirrors":                  ["12 inch Round", "18 inch Round", "24 inch Oval"],
    "Wall Shelves":             ["18 inch Single", "24 inch Double", "36 inch Triple"],
    "Clocks":                   ["10 inch Silent", "14 inch Silent", "18 inch Pendulum"],
    "Hanging Decor":            ["Small 30cm", "Medium 50cm", "Large 80cm"],
    "Ceramic Vases":            ["Small 15cm", "Medium 25cm", "Large 35cm"],
    "Glass Vases":              ["Small 15cm", "Medium 25cm", "Large 35cm"],
    "Metal Vases":              ["Small 15cm", "Medium 25cm", "Large 35cm"],
    "Wooden Vases":             ["Small 15cm", "Medium 25cm", "Large 35cm"],
    "Planters":                 ["4-Inch", "6-Inch", "8-Inch", "10-Inch"],
    "Animal Figurines":         ["Small", "Medium", "Large"],
    "Buddha Statues":           ["Small 10cm", "Medium 20cm", "Large 30cm"],
    "Abstract Sculptures":      ["Small", "Medium", "Large"],
    "Religious Decor":          ["Small", "Medium", "Large"],
    "Miniatures":               ["Single", "Set of 3"],
    "Scented Candles":          ["50g 15hrs", "100g 30hrs", "200g 60hrs"],
    "Candle Holders":           ["Single", "Set of 2", "Set of 4"],
    "Diffusers":                ["50ml 30days", "100ml 60days", "200ml 90days"],
    "Incense Holders":          ["Single"],
    "Potpourri":                ["100g", "200g", "400g"],
    "Soap Dispensers":          ["200ml", "350ml", "500ml"],
    "Toothbrush Holders":       ["Single", "Family Pack"],
    "Towel Holders":            ["Single Rail", "Double Rail"],
    "Bath Accessories":         ["Set of 4", "Set of 6"],
    "Storage Organizers":       ["Small", "Medium", "Large"],
    "Ceramic Lamps":            ["Table E27", "Bedside E14"],
    "Wooden Lamps":             ["Table E27", "Bedside E14"],
    "Metal Lamps":              ["Table E27", "Desk Clamp"],
    "Fabric Shade Lamps":       ["Table E27", "Floor E27"],
    "Smart Lamps":              ["9W Wi-Fi", "12W Wi-Fi", "15W Wi-Fi USB-C"],
  };

  const sizes  = sizeOptions[childSubcategory] || ["Standard"];
  const colors = ["Natural Neutral", "Earthy Tones", "Bold Dark"];

  return sizes.flatMap((size, si) =>
    colors.map((color, ci) => ({
      title:              `${size} / ${color}`,
      options:            { Size: size, Color: color },
      prices:             [{ amount: Math.round(basePrice * (1 + si * 0.15)) * 100, currency_code: CURRENCY }],
      // inventory_quantity REMOVED for V2 POST /admin/products compatibility
      manage_inventory:   true,
      allow_backorder:    false,
    }))
  );
}

function descriptionFor(productName, childSubcategory, subcategory, parentCat) {
  return (
    `${productName} is a premium handcrafted piece from our ${childSubcategory} collection ` +
    `under ${subcategory} (${parentCat}). ` +
    `Thoughtfully designed for everyday use, it blends artisanal craftsmanship with contemporary aesthetics.`
  );
}

// ── Catalog ───────────────────────────────────────────────────
const CATALOG = [
  { parentCategory: "Kitchen & Dining", subcategory: "Drinkware",           childSubcategory: "Ceramic Coffee Mugs",    products: ["Rustic Blue Ceramic Mug","Handpainted Floral Mug","Minimal Matte Coffee Mug","Artisan Tea Mug","Vintage Clay Mug","Ethnic Pattern Mug","Stoneware Espresso Mug","Nordic Breakfast Mug","Boho Ceramic Cup","Textured Handmade Mug"] },
  { parentCategory: "Kitchen & Dining", subcategory: "Drinkware",           childSubcategory: "Tea Cups & Saucers",     products: ["Royal Chai Cup Set","Lotus Tea Cup Pair","Vintage Porcelain Tea Cup","Handcrafted Kulhad Cup","Ceramic Tea Saucer Set","Peacock Design Tea Cup","Marble Finish Tea Set","Elegant Floral Cup Pair","Minimal White Tea Cup","Traditional Indian Tea Set"] },
  { parentCategory: "Kitchen & Dining", subcategory: "Drinkware",           childSubcategory: "Copper Bottles",         products: ["Hammered Copper Bottle","Ayurvedic Copper Flask","Antique Finish Bottle","Designer Copper Bottle","Engraved Copper Water Bottle","Copper Travel Flask","Matte Copper Bottle","Pure Copper Storage Bottle","Ethnic Copper Jug","Copper Wellness Bottle"] },
  { parentCategory: "Kitchen & Dining", subcategory: "Drinkware",           childSubcategory: "Glass Tumblers",         products: ["Frosted Juice Glass","Ribbed Water Tumbler","Premium Whiskey Glass","Floral Printed Glass","Crystal Beverage Glass","Transparent Juice Tumbler","Tall Cocktail Glass","Colored Water Glass","Handcrafted Drinking Glass","Minimal Glass Set"] },
  { parentCategory: "Kitchen & Dining", subcategory: "Drinkware",           childSubcategory: "Wooden Drinkware",       products: ["Mango Wood Cup","Rustic Wooden Mug","Coconut Shell Cup","Bamboo Tea Tumbler","Handcrafted Wooden Goblet","Eco Wooden Coffee Mug","Wooden Juice Cup","Tribal Wooden Mug","Matte Finish Wooden Cup","Premium Oak Mug"] },
  { parentCategory: "Kitchen & Dining", subcategory: "Serveware",           childSubcategory: "Serving Bowls",          products: ["Ceramic Curry Bowl","Stoneware Serving Bowl","Floral Salad Bowl","Matte Black Pasta Bowl","Rustic Soup Bowl","Designer Dip Bowl","Mango Wood Bowl","Handpainted Rice Bowl","Marble Finish Bowl","Ethnic Katori Set"] },
  { parentCategory: "Kitchen & Dining", subcategory: "Serveware",           childSubcategory: "Platters",               products: ["Wooden Snack Platter","Marble Cheese Board","Ceramic Party Platter","Handcrafted Serving Tray","Floral Ceramic Platter","Oval Serving Plate","Decorative Snack Tray","Rustic Wooden Platter","Premium Dining Platter","Party Serving Board"] },
  { parentCategory: "Kitchen & Dining", subcategory: "Serveware",           childSubcategory: "Dinner Sets",            products: ["Ethnic Dinner Set","Minimal Ceramic Dinnerware","Royal Blue Dinner Set","Handpainted Dining Set","Matte Black Plate Set","Stoneware Family Set","Traditional Indian Dinner Set","Floral Ceramic Dining Set","Premium White Dinnerware","Festive Dining Collection"] },
  { parentCategory: "Kitchen & Dining", subcategory: "Serveware",           childSubcategory: "Snack Plates",           products: ["Ceramic Snack Plate","Wooden Appetizer Plate","Floral Tea Plate","Minimal Dessert Plate","Textured Ceramic Plate","Party Snack Tray","Marble Finish Plate","Rustic Side Plate","Ethnic Quarter Plate","Artistic Serving Plate"] },
  { parentCategory: "Kitchen & Dining", subcategory: "Serveware",           childSubcategory: "Trays",                  products: ["Wooden Breakfast Tray","Decorative Tea Tray","Marble Serving Tray","Handcrafted Snack Tray","Rustic Wooden Tray","Floral Serving Tray","Metal Decorative Tray","Minimal Serving Board","Party Serving Tray","Premium Display Tray"] },
  { parentCategory: "Kitchen & Dining", subcategory: "Kitchen Storage",     childSubcategory: "Spice Boxes",            products: ["Wooden Masala Box","Steel Spice Organizer","Ceramic Spice Jar Set","Handpainted Spice Box","Bamboo Spice Container","Traditional Masala Dabba","Glass Spice Storage","Rustic Spice Rack","Decorative Spice Organizer","Compact Spice Box"] },
  { parentCategory: "Kitchen & Dining", subcategory: "Kitchen Storage",     childSubcategory: "Jars & Containers",      products: ["Airtight Glass Jar","Ceramic Storage Container","Wooden Dry Fruit Jar","Bamboo Kitchen Container","Rustic Storage Jar","Minimal Kitchen Jar","Decorative Cookie Jar","Transparent Pantry Container","Handmade Ceramic Jar","Multi-Purpose Storage Box"] },
  { parentCategory: "Kitchen & Dining", subcategory: "Kitchen Storage",     childSubcategory: "Tea & Coffee Storage",   products: ["Tea Bag Organizer","Coffee Bean Jar","Rustic Tea Storage Box","Wooden Tea Chest","Airtight Coffee Container","Ceramic Tea Jar","Floral Coffee Canister","Minimal Tea Box","Kitchen Beverage Organizer","Handcrafted Storage Jar"] },
  { parentCategory: "Kitchen & Dining", subcategory: "Kitchen Storage",     childSubcategory: "Oil & Vinegar Bottles",  products: ["Ceramic Oil Bottle","Glass Vinegar Dispenser","Rustic Olive Oil Bottle","Handpainted Oil Container","Minimal Kitchen Pourer","Decorative Oil Jar","Bamboo Lid Bottle","Transparent Oil Dispenser","Premium Kitchen Bottle","Wooden Cork Oil Jar"] },
  { parentCategory: "Kitchen & Dining", subcategory: "Kitchen Storage",     childSubcategory: "Bread Boxes",            products: ["Wooden Bread Bin","Bamboo Bread Box","Rustic Kitchen Bread Case","Minimal Storage Bread Box","Farmhouse Bread Container","Ceramic Bread Holder","Vintage Bread Storage","Compact Bread Box","Decorative Bread Bin","Airtight Bread Organizer"] },
  { parentCategory: "Kitchen & Dining", subcategory: "Table Accessories",   childSubcategory: "Coasters",               products: ["Marble Tea Coaster","Wooden Cup Coaster","Resin Art Coaster","Floral Ceramic Coaster","Rustic Drink Coaster","Minimal Black Coaster","Cork Beverage Coaster","Decorative Table Coaster","Ethnic Tea Coaster","Premium Glass Coaster"] },
  { parentCategory: "Kitchen & Dining", subcategory: "Table Accessories",   childSubcategory: "Napkin Holders",         products: ["Wooden Napkin Stand","Marble Napkin Holder","Rustic Tissue Holder","Decorative Napkin Organizer","Minimal Napkin Stand","Metal Table Napkin Holder","Floral Tissue Stand","Premium Dining Holder","Ethnic Table Organizer","Ceramic Napkin Rack"] },
  { parentCategory: "Kitchen & Dining", subcategory: "Table Accessories",   childSubcategory: "Cutlery Holders",        products: ["Wooden Spoon Holder","Ceramic Cutlery Stand","Minimal Kitchen Organizer","Rustic Cutlery Jar","Dining Table Organizer","Bamboo Spoon Stand","Decorative Fork Holder","Metal Cutlery Rack","Premium Utensil Holder","Handcrafted Storage Stand"] },
  { parentCategory: "Kitchen & Dining", subcategory: "Table Accessories",   childSubcategory: "Salt & Pepper Sets",     products: ["Ceramic Spice Shaker","Wooden Salt Cellar","Marble Pepper Set","Rustic Table Shaker","Minimal Dining Set","Floral Salt Jar","Glass Spice Dispenser","Decorative Pepper Mill","Premium Table Shaker","Ethnic Spice Set"] },
  { parentCategory: "Kitchen & Dining", subcategory: "Table Accessories",   childSubcategory: "Pickle Holders",         products: ["Ceramic Pickle Jar","Traditional Condiment Set","Wooden Pickle Container","Handpainted Pickle Holder","Rustic Chutney Jar","Decorative Pickle Bowl","Marble Finish Pickle Set","Minimal Spice Holder","Glass Condiment Jar","Dining Table Pickle Set"] },
  { parentCategory: "Kitchen & Dining", subcategory: "Cutlery",             childSubcategory: "Spoon Sets",             products: ["Stainless Steel Spoon Set","Gold Finish Spoon Set","Wooden Dessert Spoon","Matte Black Spoon Set","Premium Dining Spoon","Rustic Serving Spoon","Decorative Tea Spoon","Bamboo Spoon Collection","Floral Spoon Set","Minimal Cutlery Spoon"] },
  { parentCategory: "Kitchen & Dining", subcategory: "Cutlery",             childSubcategory: "Fork Sets",              products: ["Stainless Steel Fork Set","Gold Dining Fork","Rustic Serving Fork","Minimal Dessert Fork","Premium Table Fork","Bamboo Dining Fork","Decorative Salad Fork","Matte Finish Fork Set","Floral Fork Collection","Elegant Cutlery Fork"] },
  { parentCategory: "Kitchen & Dining", subcategory: "Cutlery",             childSubcategory: "Knife Sets",             products: ["Stainless Kitchen Knife","Premium Chef Knife","Rustic Steak Knife","Minimal Bread Knife","Decorative Dinner Knife","Matte Black Knife Set","Wooden Handle Knife","Bamboo Kitchen Knife","Elegant Dining Knife","Professional Cutting Knife"] },
  { parentCategory: "Kitchen & Dining", subcategory: "Cutlery",             childSubcategory: "Serving Spoons",         products: ["Wooden Rice Spoon","Ceramic Serving Spoon","Rustic Curry Spoon","Gold Finish Ladle","Decorative Serving Spoon","Premium Soup Spoon","Bamboo Kitchen Spoon","Minimal Cooking Spoon","Floral Serving Ladle","Matte Black Spoon"] },
  { parentCategory: "Kitchen & Dining", subcategory: "Cutlery",             childSubcategory: "Chopsticks",             products: ["Bamboo Chopstick Set","Minimal Wooden Chopsticks","Floral Printed Chopsticks","Decorative Sushi Sticks","Matte Finish Chopsticks","Premium Dining Chopsticks","Rustic Bamboo Chopsticks","Handcrafted Chopstick Set","Ethnic Wooden Chopsticks","Elegant Asian Dining Sticks"] },
  { parentCategory: "Home Decor",       subcategory: "Wall Decor",          childSubcategory: "Wall Art",               products: ["Abstract Canvas Wall Art","Botanical Framed Artwork","Minimal Line Art Poster","Ethnic Tribal Painting","Rustic Wooden Wall Panel","Floral Watercolor Canvas","Geometric Metal Wall Art","Vintage Landscape Frame","Contemporary Abstract Print","Handpainted Village Artwork"] },
  { parentCategory: "Home Decor",       subcategory: "Wall Decor",          childSubcategory: "Mirrors",                products: ["Round Wooden Wall Mirror","Antique Brass Mirror","Minimal Black Frame Mirror","Decorative Sunburst Mirror","Rustic Hanging Mirror","Oval Vanity Mirror","Boho Rattan Mirror","Vintage Gold Mirror","Decorative Hallway Mirror","Handcrafted Accent Mirror"] },
  { parentCategory: "Home Decor",       subcategory: "Wall Decor",          childSubcategory: "Wall Shelves",           products: ["Floating Wooden Shelf","Rustic Corner Shelf","Industrial Metal Shelf","Decorative Display Shelf","Minimal Wall Rack","Geometric Wall Shelf","Bamboo Storage Shelf","Vintage Hanging Shelf","Farmhouse Wall Organizer","Contemporary Accent Shelf"] },
  { parentCategory: "Home Decor",       subcategory: "Wall Decor",          childSubcategory: "Clocks",                 products: ["Vintage Roman Wall Clock","Minimal Silent Clock","Rustic Wooden Clock","Decorative Metal Clock","Industrial Gear Clock","Contemporary Wall Clock","Handcrafted Pendulum Clock","Marble Finish Clock","Floral Design Clock","Modern Digital Wall Clock"] },
  { parentCategory: "Home Decor",       subcategory: "Wall Decor",          childSubcategory: "Hanging Decor",          products: ["Macrame Wall Hanging","Beaded Hanging Ornament","Decorative Dreamcatcher","Handwoven Cotton Hanging","Rustic Bamboo Hanging","Bohemian Tassel Decor","Ceramic Hanging Bells","Ethnic Wall Ornament","Decorative Rope Hanging","Artistic Hanging Accent"] },
  { parentCategory: "Home Decor",       subcategory: "Decorative Vases",    childSubcategory: "Ceramic Vases",          products: ["Matte White Ceramic Vase","Floral Handpainted Vase","Rustic Clay Flower Vase","Minimal Table Vase","Contemporary Decorative Vase","Stoneware Flower Pot","Textured Ceramic Vase","Scandinavian Accent Vase","Elegant Tall Vase","Artistic Pottery Vase"] },
  { parentCategory: "Home Decor",       subcategory: "Decorative Vases",    childSubcategory: "Glass Vases",            products: ["Transparent Flower Vase","Frosted Decorative Vase","Ribbed Glass Vase","Colored Glass Pot","Crystal Floral Vase","Minimal Cylinder Vase","Vintage Glass Decor","Contemporary Bud Vase","Elegant Table Vase","Artistic Glass Accent"] },
  { parentCategory: "Home Decor",       subcategory: "Decorative Vases",    childSubcategory: "Metal Vases",            products: ["Brass Decorative Vase","Copper Flower Pot","Rustic Iron Vase","Gold Finish Vase","Minimal Metal Planter","Contemporary Steel Vase","Decorative Aluminium Vase","Antique Metal Pot","Hammered Brass Vase","Ethnic Decorative Vase"] },
  { parentCategory: "Home Decor",       subcategory: "Decorative Vases",    childSubcategory: "Wooden Vases",           products: ["Mango Wood Flower Vase","Rustic Wooden Pot","Handcarved Decorative Vase","Minimal Wooden Accent","Bamboo Decorative Vase","Tribal Wooden Pot","Contemporary Wood Vase","Eco Wooden Decor","Artistic Wooden Vase","Rustic Table Accent"] },
  { parentCategory: "Home Decor",       subcategory: "Decorative Vases",    childSubcategory: "Planters",               products: ["Ceramic Indoor Planter","Hanging Plant Pot","Minimal Concrete Planter","Rustic Garden Pot","Decorative Succulent Pot","Contemporary Plant Holder","Handcrafted Clay Planter","Bamboo Indoor Pot","Geometric Plant Pot","Marble Finish Planter"] },
  { parentCategory: "Home Decor",       subcategory: "Showpieces & Figurines", childSubcategory: "Animal Figurines",    products: ["Brass Elephant Figurine","Wooden Horse Statue","Ceramic Owl Decor","Decorative Peacock Accent","Rustic Deer Sculpture","Handcrafted Bird Figurine","Marble Elephant Showpiece","Contemporary Animal Decor","Tribal Animal Sculpture","Artistic Lion Accent"] },
  { parentCategory: "Home Decor",       subcategory: "Showpieces & Figurines", childSubcategory: "Buddha Statues",      products: ["Meditating Buddha Statue","Golden Buddha Figurine","Ceramic Buddha Decor","Rustic Stone Buddha","Handcrafted Buddha Accent","Minimal Zen Buddha","Decorative Buddha Sculpture","Marble Buddha Statue","Contemporary Buddha Decor","Ethnic Buddha Idol"] },
  { parentCategory: "Home Decor",       subcategory: "Showpieces & Figurines", childSubcategory: "Abstract Sculptures", products: ["Modern Art Sculpture","Geometric Metal Accent","Minimal Abstract Figurine","Contemporary Resin Art","Artistic Table Sculpture","Rustic Decorative Accent","Marble Finish Sculpture","Handcrafted Abstract Decor","Decorative Modern Statue","Elegant Artistic Piece"] },
  { parentCategory: "Home Decor",       subcategory: "Showpieces & Figurines", childSubcategory: "Religious Decor",     products: ["Brass Ganesha Idol","Wooden Temple Decor","Ceramic Krishna Statue","Handcrafted Religious Accent","Decorative Spiritual Idol","Marble Temple Figurine","Rustic Prayer Decor","Contemporary Religious Accent","Ethnic God Idol","Traditional Spiritual Decor"] },
  { parentCategory: "Home Decor",       subcategory: "Showpieces & Figurines", childSubcategory: "Miniatures",          products: ["Mini Village Figurine","Decorative Tiny House","Mini Garden Accent","Handcrafted Mini Statue","Artistic Table Miniature","Rustic Mini Decor","Contemporary Small Accent","Ethnic Mini Sculpture","Ceramic Mini Showpiece","Vintage Mini Figurine"] },
  { parentCategory: "Home Decor",       subcategory: "Candles & Fragrances", childSubcategory: "Scented Candles",      products: ["Lavender Aroma Candle","Vanilla Soy Candle","Sandalwood Fragrance Candle","Rose Scent Candle","Jasmine Decorative Candle","Ocean Breeze Candle","Cinnamon Spice Candle","Minimal White Candle","Decorative Jar Candle","Handmade Aroma Candle"] },
  { parentCategory: "Home Decor",       subcategory: "Candles & Fragrances", childSubcategory: "Candle Holders",       products: ["Brass Candle Stand","Wooden Tea Light Holder","Glass Votive Holder","Decorative Lantern Holder","Rustic Candle Stand","Contemporary Candle Accent","Marble Finish Holder","Geometric Candle Holder","Hanging Candle Lantern","Elegant Table Holder"] },
  { parentCategory: "Home Decor",       subcategory: "Candles & Fragrances", childSubcategory: "Diffusers",            products: ["Reed Aroma Diffuser","Ceramic Oil Diffuser","Lavender Fragrance Diffuser","Bamboo Reed Diffuser","Minimal Glass Diffuser","Contemporary Aroma Diffuser","Decorative Fragrance Set","Floral Room Diffuser","Ocean Scent Diffuser","Wooden Essential Diffuser"] },
  { parentCategory: "Home Decor",       subcategory: "Candles & Fragrances", childSubcategory: "Incense Holders",      products: ["Wooden Agarbatti Stand","Ceramic Incense Holder","Brass Dhoop Stand","Decorative Incense Tray","Minimal Incense Plate","Marble Finish Holder","Rustic Aroma Stand","Ethnic Incense Decor","Handcrafted Incense Burner","Contemporary Incense Holder"] },
  { parentCategory: "Home Decor",       subcategory: "Candles & Fragrances", childSubcategory: "Potpourri",            products: ["Rose Fragrance Potpourri","Lavender Scent Bowl","Decorative Dry Flower Mix","Ocean Breeze Potpourri","Cinnamon Aroma Mix","Jasmine Decorative Potpourri","Rustic Fragrance Bowl","Contemporary Aroma Decor","Handmade Floral Mix","Natural Scent Collection"] },
  { parentCategory: "Home Decor",       subcategory: "Bathroom Decor",      childSubcategory: "Soap Dispensers",       products: ["Ceramic Soap Pump","Glass Bathroom Dispenser","Marble Finish Soap Holder","Bamboo Soap Bottle","Rustic Bathroom Pump","Minimal Soap Dispenser","Decorative Handwash Bottle","Contemporary Bath Accessory","Matte Black Soap Pump","Elegant Bathroom Dispenser"] },
  { parentCategory: "Home Decor",       subcategory: "Bathroom Decor",      childSubcategory: "Toothbrush Holders",    products: ["Ceramic Brush Holder","Wooden Bathroom Organizer","Marble Finish Holder","Minimal Bathroom Cup","Rustic Toothbrush Stand","Decorative Bathroom Holder","Contemporary Bath Organizer","Glass Bathroom Cup","Bamboo Brush Holder","Premium Bathroom Accessory"] },
  { parentCategory: "Home Decor",       subcategory: "Bathroom Decor",      childSubcategory: "Towel Holders",         products: ["Wooden Towel Rack","Brass Bathroom Rail","Minimal Towel Hook","Rustic Bathroom Holder","Contemporary Towel Stand","Decorative Bath Rack","Matte Black Towel Holder","Bamboo Bath Organizer","Elegant Bathroom Rail","Premium Towel Rack"] },
  { parentCategory: "Home Decor",       subcategory: "Bathroom Decor",      childSubcategory: "Bath Accessories",      products: ["Ceramic Bathroom Set","Marble Bath Organizer","Rustic Bathroom Tray","Bamboo Vanity Set","Decorative Bath Accent","Contemporary Bathroom Decor","Minimal Bath Storage","Elegant Bathroom Organizer","Handcrafted Bath Set","Premium Vanity Collection"] },
  { parentCategory: "Home Decor",       subcategory: "Bathroom Decor",      childSubcategory: "Storage Organizers",    products: ["Bathroom Storage Basket","Bamboo Organizer Box","Rustic Vanity Storage","Minimal Bathroom Shelf","Decorative Bath Basket","Contemporary Storage Rack","Marble Finish Organizer","Wooden Bathroom Tray","Elegant Storage Container","Compact Bath Organizer"] },
  { parentCategory: "Lighting",         subcategory: "Table Lamps",         childSubcategory: "Ceramic Lamps",         products: ["Floral Ceramic Table Lamp","Minimal White Lamp","Rustic Pottery Lamp","Contemporary Ceramic Accent","Artistic Bedside Lamp","Stoneware Table Lamp","Decorative Clay Lamp","Scandinavian Ceramic Lamp","Handpainted Accent Lamp","Elegant Ceramic Light"] },
  { parentCategory: "Lighting",         subcategory: "Table Lamps",         childSubcategory: "Wooden Lamps",          products: ["Mango Wood Table Lamp","Rustic Wooden Light","Minimal Oak Lamp","Bamboo Bedside Lamp","Contemporary Wooden Accent","Handcrafted Wooden Lamp","Decorative Timber Lamp","Scandinavian Wood Light","Artistic Wooden Fixture","Vintage Wooden Lamp"] },
  { parentCategory: "Lighting",         subcategory: "Table Lamps",         childSubcategory: "Metal Lamps",           products: ["Brass Desk Lamp","Industrial Metal Lamp","Minimal Black Lamp","Contemporary Gold Lamp","Rustic Iron Light","Decorative Steel Lamp","Matte Finish Table Lamp","Artistic Metal Fixture","Elegant Desk Light","Vintage Brass Lamp"] },
  { parentCategory: "Lighting",         subcategory: "Table Lamps",         childSubcategory: "Fabric Shade Lamps",    products: ["Linen Bedside Lamp","Cotton Shade Table Lamp","Floral Fabric Lamp","Rustic Fabric Accent","Contemporary Shade Lamp","Minimal White Shade","Decorative Fabric Light","Scandinavian Table Lamp","Elegant Bedroom Lamp","Premium Shade Fixture"] },
  { parentCategory: "Lighting",         subcategory: "Table Lamps",         childSubcategory: "Smart Lamps",           products: ["LED Smart Table Lamp","Touch Control Lamp","RGB Mood Lamp","Wireless Charging Lamp","Contemporary Smart Light","Minimal LED Lamp","App Controlled Lamp","Adjustable Brightness Lamp","Smart Bedside Fixture","Modern Smart Lamp"] },
];

const TAGS_MAP = {
  "Kitchen & Dining": ["kitchen", "dining", "handcrafted", "artisan", "home-essentials"],
  "Home Decor":       ["home-decor", "gifting", "artisan", "interior-design"],
  "Lighting":         ["lighting", "home-decor", "interior-design", "smart-home"],
};

// ── Runtime caches ────────────────────────────────────────────
const categoryCache = {};
const tagIdCache    = {};

async function getOrCreateCategory(name, parentId = null) {
  const key = `${name}|${parentId ?? "root"}`;
  if (categoryCache[key]) return categoryCache[key];

  const { product_categories } = await api("GET", `/admin/product-categories?q=${encodeURIComponent(name)}&limit=100`);
  const existing = product_categories.find(
    c => c.name === name && (c.parent_category_id ?? null) === parentId
  );
  if (existing) { categoryCache[key] = existing.id; return existing.id; }

  const body = { name, is_active: true, is_internal: false };
  if (parentId) body.parent_category_id = parentId;
  const { product_category } = await api("POST", "/admin/product-categories", body);
  categoryCache[key] = product_category.id;
  return product_category.id;
}

// ── Main ──────────────────────────────────────────────────────
async function seed() {
  // 1. Auth
  console.log("🔐  Authenticating…");
  try {
    const auth = await api("POST", "/auth/user/emailpass", { email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
    JWT_TOKEN = auth.token;
    console.log("✅  Authenticated.\n");
  } catch (err) {
    console.error("❌ Auth Failed. Check your MEDUSA_ADMIN_EMAIL and PASSWORD.");
    return;
  }

  // 2. Pre-create tags
  console.log("🏷️   Creating tags…");
  const allTagValues = [...new Set(Object.values(TAGS_MAP).flat())];
  for (const value of allTagValues) {
    try {
      const { product_tags } = await api("GET", `/admin/product-tags?q=${encodeURIComponent(value)}&limit=100`);
      const existing = product_tags.find(t => t.value === value);
      if (existing) {
        tagIdCache[value] = existing.id;
        console.log(`   ♻️  Reused tag: "${value}" (${existing.id})`);
      } else {
        const { product_tag } = await api("POST", "/admin/product-tags", { value });
        tagIdCache[value] = product_tag.id;
        console.log(`   ✅  Created tag: "${value}" (${product_tag.id})`);
      }
    } catch (err) {
      console.error(`   ❌ Tag failed "${value}":`, err.message);
    }
  }
  console.log();

  // 3. Sales channel
  console.log("📡  Fetching sales channel…");
  const { sales_channels } = await api("GET", "/admin/sales-channels?limit=1");
  const salesChannelId = sales_channels[0]?.id;
  if (!salesChannelId) throw new Error("No sales channel found — create one in the admin dashboard first.");
  console.log(`   ✅  Sales channel: ${salesChannelId}\n`);

  // 4. Seed products
  let total = 0, skipped = 0, failed = 0;
  console.log("🛒  Seeding products…\n");

  for (const group of CATALOG) {
    const { parentCategory, subcategory, childSubcategory, products } = group;

    const parentCatId = await getOrCreateCategory(parentCategory);
    const subcatId    = await getOrCreateCategory(subcategory, parentCatId);
    const childCatId  = await getOrCreateCategory(childSubcategory, subcatId);

    const basePrice = priceForCategory(parentCategory, subcategory);
    const tagIds = (TAGS_MAP[parentCategory] || [])
      .filter(v => tagIdCache[v])
      .map(v => ({ id: tagIdCache[v] }));

    for (const productName of products) {
      const handle   = toHandle(productName);
      const variants = variantsFor(childSubcategory, basePrice);
      const uniqueSizes  = [...new Set(variants.map(v => v.options.Size))];
      const uniqueColors = [...new Set(variants.map(v => v.options.Color))];

      const payload = {
        title:        productName,
        handle,
        description:  descriptionFor(productName, childSubcategory, subcategory, parentCategory),
        status:       "published",
        sales_channels: [{ id: salesChannelId }],
        categories:   [{ id: childCatId }],
        tags:         tagIds,
        images: [
           { url: `https://loremflickr.com/800/800/${encodeURIComponent(childSubcategory.toLowerCase())}` }
        ],
        options: [
          { title: "Size",  values: uniqueSizes },
          { title: "Color", values: uniqueColors },
        ],
        variants: variants.map((v, idx) => ({
          title:              v.title,
          sku:                `${handle.slice(0, 16).toUpperCase().replace(/-/g,"")}-${idx+1}-${Math.floor(Math.random()*1000)}`,
          options:            v.options,
          prices:             v.prices,
          // inventory_quantity REMOVED for V2 POST /admin/products compatibility
          manage_inventory:   true,
          allow_backorder:    false,
        })),
        metadata: { parentCategory, subcategory, childSubcategory, lowStockThreshold: LOW_STOCK_THRESHOLD },
      };

      try {
        const { product } = await api("POST", "/admin/products", payload);
        total++;
        console.log(`  ✅ [${total}] ${productName}  (${product.id})`);
      } catch (err) {
        if (err.message.includes("422") || err.message.toLowerCase().includes("already exists") || err.message.includes("handle")) {
          skipped++;
          console.log(`  ⚠️  Skipped (exists): ${productName}`);
        } else {
          failed++;
          console.error(`  ❌ Failed: ${productName} →`, err.message);
        }
      }
    }
    console.log(`\n  📦 Done: ${parentCategory} › ${subcategory} › ${childSubcategory}\n`);
  }

  console.log(`\n🎉  Seeding complete!`);
  console.log(`   ✅ Created : ${total}`);
  console.log(`   ⚠️  Skipped : ${skipped}`);
  console.log(`   ❌ Failed  : ${failed}`);
}

seed().catch(err => {
  console.error("\n💥 Fatal error:", err.message);
  process.exit(1);
});
