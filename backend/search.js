const fs = require('fs');
const path = require('path');
function search(dir) {
    fs.readdirSync(dir).forEach(f => {
        let p = path.join(dir, f);
        let stat;
        try { stat = fs.statSync(p); } catch(e) { return; }
        if (stat.isDirectory()) {
            search(p);
        } else if (p.endsWith('.js') || p.endsWith('.cjs') || p.endsWith('.mjs')) {
            try {
                if (fs.readFileSync(p, 'utf8').includes('||=')) {
                    console.log(p);
                }
            } catch(e) {}
        }
    });
}
search('node_modules');
