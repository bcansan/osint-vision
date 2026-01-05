async function testGoogleLens() {
  const fs = require('fs');
  
  // CAMBIAR ESTA RUTA por la ruta a tu imagen del Dragón
  const imagePath = 'C:\\ruta\\a\\tu\\imagen\\dragon.jpg';
  
  console.log('📸 Leyendo imagen:', imagePath);
  
  try {
    // Leer imagen
    const imageBuffer = fs.readFileSync(imagePath);
    const base64 = imageBuffer.toString('base64');
    const mimeType = 'image/jpeg';
    
    // Crear FormData
    const FormData = require('form-data');
    const formData = new FormData();
    formData.append('image', imageBuffer, {
      filename: 'test.jpg',
      contentType: mimeType
    });
    
    console.log('🔍 Llamando a Google Lens API...');
    
    const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
    
    const response = await fetch('http://localhost:3000/api/google-lens', {
      method: 'POST',
      body: formData,
      headers: formData.getHeaders()
    });
    
    const result = await response.json();
    
    console.log('\n📊 RESULTADO:');
    console.log(JSON.stringify(result, null, 2));
    
    if (result.success) {
      console.log('\n✅ ¡ÉXITO!');
      if (result.results?.mainIdentification) {
        console.log('🎯 Identificado como:', result.results.mainIdentification.title);
      }
    } else {
      console.log('\n❌ FALLÓ:', result.error);
    }
    
  } catch (error) {
    console.error('❌ ERROR:', error.message);
  }
}

testGoogleLens();