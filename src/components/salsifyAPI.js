import axios from 'axios';

const PROXY_URL = '/api/salsifyProxy';  // Use the relative path to your backend on Vercel

export const getProductImage = async (itemNumber) => {
  try {
    console.log(`Searching for item number: ${itemNumber}`);
    
    const response = await axios.get(PROXY_URL, {
      params: { itemNumber }
    });

    if (response.data && response.data.imageUrl) {
      console.log(`Image URL found: ${response.data.imageUrl}`);
      return response.data.imageUrl;
    } else {
      console.log(`No image found for item ${itemNumber}`);
      return null;
    }
  } catch (error) {
    console.error('Error fetching product data:', error);
    throw error;
  }
};
