export interface ILog {
  date: Date,
  type: TAttack,
  product: TProduct,
  status: TStatus,
}

type TAttack = 'DDoS' | 'Bot' | 'Intrusion' | 'Malware' | 'Phishing' | 'Exploit' | 'Ransomware';
type TProduct = 'AntiDDoS' | 'AntiBot' | 'WAF' | 'SEG' | 'EASM';
type TStatus = 'mitigated' | 'active' | 'blocked' | 'quarantined' | 'detected';