import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {readFile,writeFile,readdir,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {build} from 'vite';
const frontend=dirname(fileURLToPath(import.meta.url)),output=resolve(frontend,'../00-quota-link');
process.chdir(frontend);
const packages=new Set(['vue']);
const audit={name:'runtime-license-audit',generateBundle(_options,bundle){for(const chunk of Object.values(bundle))if(chunk.type==='chunk')for(const [id,meta]of Object.entries(chunk.modules)){const match=/node_modules[\\/](?:(@[^\\/]+)[\\/])?([^\\/]+)/.exec(id);if(match&&meta.renderedLength!==0)packages.add((match[1]?match[1]+'/':'')+match[2]);}}};
await build({configFile:false,root:frontend,plugins:[audit],define:{'process.env.NODE_ENV':JSON.stringify('production'),__VUE_OPTIONS_API__:false,__VUE_PROD_DEVTOOLS__:false,__VUE_PROD_HYDRATION_MISMATCH_DETAILS__:false},build:{outDir:output,emptyOutDir:false,lib:{entry:resolve(frontend,'src/main.ts'),formats:['es'],fileName:()=> 'app.js',cssFileName:'styles'},minify:true,sourcemap:false}});
await writeFile(resolve(output,'index.html'),await readFile(resolve(frontend,'src/index.html')));
await mkdir(resolve(output,'licenses'),{recursive:true});
const notices=['Third-party notices for Quota Link production frontend. Sources are pinned in pages/frontend/package-lock.json.\nOil UI shell, tokens, shared Vue components, and confirmation behavior adapted from Yomihime Game Link, commit cf755ed4ac455e8be48a9b99c285078cdb696510, under AGPL-3.0. See pages/frontend/PROVENANCE.md and project LICENSE.'];
for(const name of [...packages].sort()){
 const path=resolve(frontend,'node_modules',name),meta=JSON.parse(await readFile(resolve(path,'package.json'),'utf8')),files=(await readdir(path)).filter(file=>/^(?:licen[sc]e|copying|notice)(?:\.|$)/i.test(file));
 let content=`${name} ${meta.version}\nLicense: ${meta.license||'see below'}\n`;
 if(files.length)for(const file of files.sort())content+=`\n${file}\n${await readFile(resolve(path,file),'utf8')}\n`;
 else if(name==='css-render'||name.startsWith('@css-render/'))content+='\n'+await readFile(resolve(frontend,'legal/css-render.txt'),'utf8');
 else if(name==='vdirs')content+='\n'+await readFile(resolve(frontend,'legal/vdirs.txt'),'utf8');
 else throw Error('Missing production runtime license: '+name);
 await writeFile(resolve(output,'licenses',name.replaceAll('/','_')+'.txt'),content);notices.push(content);
}
await writeFile(resolve(output,'THIRD_PARTY_NOTICES.txt'),notices.join('\n\n--------------------\n\n'));
const files=['index.html','app.js','styles.css','THIRD_PARTY_NOTICES.txt',...(await readdir(resolve(output,'licenses'))).map(name=>'licenses/'+name)];
const assets=[];for(const file of files)assets.push({path:file,sha256:createHash('sha256').update(await readFile(resolve(output,file))).digest('hex')});
await writeFile(resolve(output,'assets.json'),JSON.stringify({schema_version:1,assets},null,2)+'\n');
console.log(JSON.stringify({output,packages:[...packages].sort(),assets:assets.length}));
