export type TransferMode = 'USB' | 'Internet';
export type WeighmentStatus = 'Accepted' | 'Warning' | 'Hold' | 'Pending Transfer';

export interface CollectionStation {
  id: string;
  station: string;
  division: string;
  deviceId: string;
  mode: TransferMode;
  connection: 'Online' | 'Offline';
  lastSync: string;
  pendingRecords: number;
}

export interface WeighmentEntry {
  id: string;
  station: string;
  division: string;
  field: string;
  collector: string;
  latexWeight: number;
  scrapWeight: number;
  capturedAt: string;
  mode: TransferMode;
  status: WeighmentStatus;
  validation: string;
}

export const collectionStations: CollectionStation[] = [
  {
    id: 'ST-01',
    station: 'North Gate Collection',
    division: 'North Division',
    deviceId: 'EW-USB-204',
    mode: 'USB',
    connection: 'Online',
    lastSync: '08 Jun 2026, 09:42',
    pendingRecords: 0,
  },
  {
    id: 'ST-02',
    station: 'River Side Shed',
    division: 'River Division',
    deviceId: 'EW-NET-118',
    mode: 'Internet',
    connection: 'Online',
    lastSync: '08 Jun 2026, 09:55',
    pendingRecords: 2,
  },
  {
    id: 'ST-03',
    station: 'Hill Top Station',
    division: 'Hill Division',
    deviceId: 'EW-USB-311',
    mode: 'USB',
    connection: 'Offline',
    lastSync: '08 Jun 2026, 08:10',
    pendingRecords: 8,
  },
];

export const weighmentEntries: WeighmentEntry[] = [
  {
    id: 'WT-20260608-001',
    station: 'North Gate Collection',
    division: 'North Division',
    field: 'Field A1',
    collector: 'Mohan Team',
    latexWeight: 486.5,
    scrapWeight: 42.8,
    capturedAt: '08 Jun 2026, 09:18',
    mode: 'USB',
    status: 'Accepted',
    validation: 'Device seal, gross/tare and operator match verified',
  },
  {
    id: 'WT-20260608-002',
    station: 'River Side Shed',
    division: 'River Division',
    field: 'Field B1',
    collector: 'Ravi Team',
    latexWeight: 318.2,
    scrapWeight: 61.4,
    capturedAt: '08 Jun 2026, 09:31',
    mode: 'Internet',
    status: 'Warning',
    validation: 'Scrap variance above station average; supervisor review required',
  },
  {
    id: 'WT-20260608-003',
    station: 'Hill Top Station',
    division: 'Hill Division',
    field: 'Field C3',
    collector: 'Suresh Team',
    latexWeight: 0,
    scrapWeight: 89.6,
    capturedAt: '08 Jun 2026, 08:54',
    mode: 'USB',
    status: 'Pending Transfer',
    validation: 'Queued for USB import when station device is connected',
  },
  {
    id: 'WT-20260608-004',
    station: 'River Side Shed',
    division: 'River Division',
    field: 'Field B1',
    collector: 'Anil Team',
    latexWeight: 512.9,
    scrapWeight: 38.1,
    capturedAt: '08 Jun 2026, 09:47',
    mode: 'Internet',
    status: 'Accepted',
    validation: 'Auto-transfer received and checksum verified',
  },
  {
    id: 'WT-20260608-005',
    station: 'North Gate Collection',
    division: 'North Division',
    field: 'Field A2',
    collector: 'Kumar Team',
    latexWeight: 742.4,
    scrapWeight: 24.7,
    capturedAt: '08 Jun 2026, 09:59',
    mode: 'USB',
    status: 'Hold',
    validation: 'Latex weight exceeds configured shift threshold',
  },
];
