import zhCN from '../../../.astrbot-plugin/i18n/zh-CN.json' with {type: 'json'};
import zhTW from '../../../.astrbot-plugin/i18n/zh-TW.json' with {type: 'json'};
import jaJP from '../../../.astrbot-plugin/i18n/ja-JP.json' with {type: 'json'};
import enUS from '../../../.astrbot-plugin/i18n/en-US.json' with {type: 'json'};

export const defaultLocale = 'zh-CN';
export const locales = /** @type {const} */ (['zh-CN','zh-TW','ja-JP','en-US']);
const catalogs = {'zh-CN':zhCN.strings,'zh-TW':zhTW.strings,'ja-JP':jaJP.strings,'en-US':enUS.strings};

/** @param {unknown} value */
export function isLanguage(value){
 return value==='auto'||locales.some(locale=>locale===value);
}

/** @param {unknown} override @param {unknown} hostLocale */
export function resolveLocale(override,hostLocale){
 const explicit=locales.find(locale=>locale===override);
 if(explicit)return explicit;
 if(typeof hostLocale!=='string'||hostLocale.length>32)return defaultLocale;
 let locale;
 try{locale=new Intl.Locale(hostLocale.trim().replaceAll('_','-'));}catch{return defaultLocale;}
 if(locale.language==='ja')return 'ja-JP';
 if(locale.language==='en')return 'en-US';
 if(locale.language==='zh'&&(locale.script==='Hant'||locale.script!=='Hans'&&['TW','HK','MO'].includes(locale.region)))return 'zh-TW';
 return defaultLocale;
}

/** @param {string} id @param {string} [locale] @param {Record<string,unknown>} [args] */
export function translate(id,locale=defaultLocale,args={}){
 const catalog=Object.hasOwn(catalogs,locale)?catalogs[locale]:catalogs[resolveLocale('auto',locale)];
 const localized=Object.hasOwn(catalog,id)?catalog[id]:undefined;
 const template=typeof localized==='string'&&localized.trim()?localized:Object.hasOwn(zhCN.strings,id)?zhCN.strings[id]:id;
 return template.replace(/\{([A-Za-z_][A-Za-z0-9_]*)\}/g,(token,key)=>{
  if(!Object.hasOwn(args,key))return token;
  const value=args[key];
  return value instanceof MessageError?errorText(value,locale):String(value);
 });
}

export class MessageError extends Error{
 /** @param {string} id @param {Record<string,unknown>} [args] */
 constructor(id,args){
  super(translate(id,defaultLocale,args));
  this.id=id;this.args=args;
 }
}

/** @param {unknown} error @param {string} [locale] */
export function errorText(error,locale){
 return error instanceof MessageError?translate(error.id,locale,error.args):translate('web.validation.invalid_input',locale);
}
