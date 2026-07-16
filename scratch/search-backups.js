const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    if (file === 'node_modules' || file === '.next' || file === '.git' || file === '.vercel') return;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else {
      const ext = path.extname(file).toLowerCase();
      if (['.sql', '.xlsx', '.csv', '.json', '.bak', '.db'].includes(ext)) {
        results.push({ path: fullPath, size: stat.size, mtime: stat.mtime });
      }
    }
  });
  return results;
}

const found = walk('.');
console.log('Found files:');
found.forEach(f => {
  console.log(`- ${f.path} (Size: ${f.size} bytes, Modified: ${f.mtime})`);
});
