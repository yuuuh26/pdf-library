import {createHash} from 'node:crypto';
import {cp,mkdir,readFile,writeFile,readdir} from 'node:fs/promises';
await mkdir('dist',{recursive:true});
await cp('public','dist',{recursive:true});
const root='node_modules/pdfjs-dist';
await mkdir('dist/vendor',{recursive:true});
for(const f of ['pdf.mjs','pdf.worker.mjs']) await cp(`${root}/build/${f}`,`dist/vendor/${f}`);
for(const f of ['cmaps','standard_fonts','wasm','iccs']) await cp(`${root}/${f}`,`dist/vendor/${f}`,{recursive:true});
await cp(`${root}/LICENSE`,'dist/vendor/LICENSE');
async function walk(dir){let r=[];for(const e of await readdir(dir,{withFileTypes:true})){const p=`${dir}/${e.name}`;r.push(...e.isDirectory()?await walk(p):[p.replace('dist/','./')]);}return r;}
const files=(await walk('dist')).filter(x=>!x.endsWith('sw.js'));
const template=await readFile('scripts/sw-template.js','utf8');
const hash=createHash('sha256');for(const f of files.sort())hash.update(await readFile('dist/'+f.slice(2)));
await writeFile('dist/sw.js',template.replace('__ASSETS__',JSON.stringify(files)).replace('__VERSION__',hash.digest('hex').slice(0,12)));
console.log(`Built ${files.length} local assets`);
