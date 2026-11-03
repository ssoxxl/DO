const fs = require('node:fs');
const path = require('node:path');

function build(output = path.join(__dirname, '..', 'dist'), siteUrl = process.env.SITE_URL || process.env.CF_PAGES_URL) {
    const root = path.join(__dirname, '..');
    let base;
    if (siteUrl) {
        base = new URL(siteUrl);
        if (!['https:','http:'].includes(base.protocol) || base.username || base.password) throw new Error('SITE_URL must be a public HTTP(S) URL');
        base.search = ''; base.hash = '';
        if (!base.pathname.endsWith('/')) base.pathname += '/';
    }
    fs.mkdirSync(output, {recursive:true});
    for (const folder of ['js','css']) fs.cpSync(path.join(root,folder),path.join(output,folder),{recursive:true});
    fs.mkdirSync(path.join(output,'assets'),{recursive:true});
    for (const file of ['og.png','pixel-worlds.png','chapter-panorama.png']) fs.copyFileSync(path.join(root,'assets',file),path.join(output,'assets',file));
    for (const file of ['ads.txt','_headers']) fs.copyFileSync(path.join(root,file),path.join(output,file));
    let html = fs.readFileSync(path.join(root,'index.html'),'utf8');
    if (base) html = html.replace('content="assets/og.png"',`content="${new URL('assets/og.png',base).href.replaceAll('&','&amp;').replaceAll('"','&quot;')}"`);
    fs.writeFileSync(path.join(output,'index.html'),html,'utf8');
    return output;
}
if (require.main === module) console.log(`Static site built: ${build()}`);
module.exports = {build};
