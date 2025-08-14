// Debug script to test the search functionality
const fetch = require('node-fetch');

async function testSearch() {
    console.log('=== Testing Japan Search ===');
    
    try {
        // Test API directly
        console.log('\n1. Testing API directly...');
        const response = await fetch('http://localhost:3000/api/city-info?city=japan');
        const data = await response.json();
        
        console.log('API Response Status:', response.status);
        console.log('API Response Data:', JSON.stringify(data, null, 2));
        
        if (data.cityInfo) {
            console.log('\n2. Checking specific fields:');
            console.log('Name:', data.cityInfo.name);
            console.log('Currency:', data.cityInfo.currency);
            console.log('Language:', data.cityInfo.language);
            console.log('Timezone:', data.cityInfo.timezone);
            console.log('Best Time to Visit:', data.cityInfo.bestTimeToVisit);
            console.log('Description:', data.cityInfo.description.substring(0, 100) + '...');
        }
        
        // Test places API
        console.log('\n3. Testing Places API...');
        const placesResponse = await fetch('http://localhost:3000/api/places?city=japan&limit=5');
        const placesData = await placesResponse.json();
        
        console.log('Places Response Status:', placesResponse.status);
        console.log('Places Count:', placesData.places ? placesData.places.length : 0);
        
    } catch (error) {
        console.error('Error:', error.message);
    }
}

testSearch();