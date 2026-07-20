const { createClient } = require('@libsql/client');
require('dotenv').config();

const db = createClient({
  url: process.env.TURSO_DB_URL || 'file:./medic-taste.db',
  authToken: process.env.TURSO_AUTH_TOKEN || undefined,
});

async function testConnection() {
  try {
    await db.execute('SELECT 1');
    const mode = process.env.TURSO_DB_URL?.startsWith('file:') ? 'SQLite local' : 'Turso cloud';
    console.log(`✅ Conectado a ${mode} correctamente`);
  } catch (error) {
    console.error('❌ Error al conectar:', error.message);
    process.exit(1);
  }
}

module.exports = { db, testConnection };
