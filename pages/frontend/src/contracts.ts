export type Configuration=Record<string,any>&{providers:Array<Record<string,any>>};
export interface CredentialStatus{configured:boolean;source:'encrypted'|'environment'|'missing'}
export interface Snapshot{revision:number;config:Configuration;credentials:Record<string,Record<string,CredentialStatus>>;encryption:{ready:boolean;state:string;reason_code:string|null};migration:{pending:boolean;account_count:number;cleanup_pending?:boolean;legacy_conflict?:boolean}}
export interface MigrationPlan{plan_id:string;pending:boolean;cleanup_pending?:boolean;legacy_conflict?:boolean;account_count:number;plaintext_count:number;environment_count:number}
export interface SecretDraft{account:string;field:string;mode:string;value:string;environment:string}
export interface State{ready:boolean;theme:'light'|'dark';locale:string;snapshot:Snapshot|null;draft:Configuration|null;secret:SecretDraft|null;plan:MigrationPlan|null;busy:boolean;stale:boolean;unknown:boolean;notice:string;tone:string;edit:number;route:string;selected:string|null}
export interface Bridge{ready():Promise<Record<string,unknown>>;onContext(callback:(context:Record<string,unknown>)=>void):(()=>void)|undefined;apiPost(path:string,body:unknown):Promise<unknown>}
