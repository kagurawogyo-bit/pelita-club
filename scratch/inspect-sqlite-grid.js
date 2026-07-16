const { DatabaseSync } = require('node:sqlite');
const path = require('path');

async function main() {
  const dbPath = path.join(__dirname, '..', 'prisma', 'dev.db');
  console.log(`Inspecting SQLite: ${dbPath}`);
  const db = new DatabaseSync(dbPath);

  // Get table info for GridAttendance
  try {
    const columns = db.prepare("PRAGMA table_info(GridAttendance)").all();
    console.log('\nGridAttendance columns:');
    console.log(columns.map(c => `${c.name} (${c.type})`));

    // Get count of all records
    const total = db.prepare("SELECT count(*) as count FROM GridAttendance").get();
    console.log(`Total GridAttendance records in SQLite: ${total.count}`);

    // Get a sample of records
    if (total.count > 0) {
      const sample = db.prepare("SELECT * FROM GridAttendance LIMIT 10").all();
      console.log('\nSample GridAttendance records in SQLite:');
      console.log(sample);
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

main();
