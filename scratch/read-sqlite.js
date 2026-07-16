const { DatabaseSync } = require('node:sqlite');
const fs = require('fs');
const path = require('path');

function inspectDb(filePath) {
  console.log(`\n=== Inspecting: ${filePath} ===`);
  if (!fs.existsSync(filePath)) {
    console.log('File does not exist.');
    return;
  }

  try {
    const db = new DatabaseSync(filePath);
    
    // Get list of tables
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
    console.log('Tables:', tables.map(t => t.name));

    for (const table of tables) {
      const countRow = db.prepare(`SELECT count(*) as count FROM "${table.name}"`).get();
      console.log(`- Table ${table.name}: ${countRow.count} rows`);
      
      if (table.name === 'GridAttendance') {
        const cbbCount = db.prepare("SELECT count(*) as count FROM GridAttendance WHERE eventType = 'CBB'").get();
        console.log(`  * CBB eventType count: ${cbbCount.count}`);
      }
    }
  } catch (error) {
    console.error('Error inspecting:', error.message);
  }
}

inspectDb(path.join(__dirname, '..', 'dev.db'));
inspectDb(path.join(__dirname, '..', 'prisma', 'dev.db'));
