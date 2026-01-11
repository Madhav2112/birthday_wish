require('dotenv').config({ path: '.env.local' });
console.log('ENV FILE LOADED: .env.local');
console.log('GOOGLE_PRIVATE_KEY_B64 length:', (process.env.GOOGLE_PRIVATE_KEY_B64 || '').length);
console.log('HAS GOOGLE_PRIVATE_KEY_B64:', !!process.env.GOOGLE_PRIVATE_KEY_B64);
console.log('GOOGLE_CLIENT_EMAIL:', process.env.GOOGLE_CLIENT_EMAIL || '<missing>');
console.log('GOOGLE_SHEET_ID:', process.env.GOOGLE_SHEET_ID || '<missing>');
