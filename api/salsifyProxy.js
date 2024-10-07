import axios from 'axios';

const API_KEY = process.env.SALSIFY_API_KEY;
const BASE_URL = 'https://app.salsify.com/api/v1/products';

export default async function handler(req, res) {
  try {
    const { itemNumber } = req.query;

    console.log(`Searching for item number: ${itemNumber}`);

    // First, try to fetch the product by 'salsify:id'
    let response = await axios.get(`${BASE_URL}/${itemNumber}`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`
      }
    });

    let product = response.data;

    // If not found, try a broader search
    if (!product) {
      response = await axios.get(BASE_URL, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`
        },
        params: {
          'filter': `"Item Number" eq "${itemNumber}"`,
          'per_page': 1
        }
      });

      if (response.data && response.data.data && response.data.data.length > 0) {
        product = response.data.data[0];
      }
    }

    if (product) {
      const assets = product['salsify:digital_assets'] || [];
      const image = assets.find(asset =>
        asset['salsify:format'] === 'png' ||
        asset['salsify:format'] === 'jpg' ||
        asset['salsify:format'] === 'jpeg'
      );

      if (image) {
        return res.status(200).json({
          imageUrl: image['salsify:url'],
          salsifyId: product['salsify:id']
        });
      } else {
        return res.status(404).json({ error: `No images found for item ${itemNumber}` });
      }
    } else {
      return res.status(404).json({ error: `No product found for item ${itemNumber}` });
    }
  } catch (error) {
    console.error('Error details:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message, 
      stack: error.stack,
      config: error.config ? JSON.stringify(error.config) : 'No config available'
    });
  }
}