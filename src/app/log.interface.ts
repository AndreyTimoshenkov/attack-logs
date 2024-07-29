export interface ILog {
  date: Date,
  type: TAttack,
  product: Product,
  status: Status,
}

type TAttack = 'DDoS' | 'Bot' | 'Intrusion' | 'Malware' | 'Phishing' | 'Exploit' | 'Ransomware';
// type TProduct = 'AntiDDoS' | 'AntiBot' | 'WAF' | 'SEG' | 'EASM';
// type TStatus = 'mitigated' | 'active' | 'blocked' | 'quarantined' | 'detected';


export enum Product {
  AllProducts = 'AllProducts',
  AntiDDoS = 'AntiDDoS',
  AntiBot = 'AntiBot',
  WAF = 'WAF',
  SEG = 'SEG',
  EASM = 'EASM'
}

export enum Status {
  AllStatuses = 'AllStatuses',
  Mitigated = 'mitigated',
  Active = 'active',
  Blocked = 'blocked',
  Quarantined = 'quarantined',
  Detected = 'detected'
}
