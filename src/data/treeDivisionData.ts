export interface DivisionMaster {
  id: string;
  division: string;
  field: string;
  className: string;
  yop: number;
  clone: string;
  area: number;
  tappingTrees: number;
  nonTappingTrees: number;
  effectiveArea: number;
  productionTarget: number;
  revisedTarget: number;
  tappingSystem: string;
}

export interface OverKiloSlab {
  id: string;
  field: string;
  className: string;
  minimumQuantity: number;
  slab: string;
  slabRate: number;
}

export const divisionMasters: DivisionMaster[] = [
  {
    id: 'DIV-A-01',
    division: 'North Division',
    field: 'Field A1',
    className: 'Mature',
    yop: 2014,
    clone: 'RRIC 121',
    area: 42.5,
    tappingTrees: 10840,
    nonTappingTrees: 920,
    effectiveArea: 39.2,
    productionTarget: 18600,
    revisedTarget: 19450,
    tappingSystem: 'S/2 d3',
  },
  {
    id: 'DIV-A-02',
    division: 'North Division',
    field: 'Field A2',
    className: 'Prime',
    yop: 2017,
    clone: 'PB 260',
    area: 36.8,
    tappingTrees: 9240,
    nonTappingTrees: 610,
    effectiveArea: 34.7,
    productionTarget: 17100,
    revisedTarget: 17620,
    tappingSystem: 'S/2 d2',
  },
  {
    id: 'DIV-B-01',
    division: 'River Division',
    field: 'Field B1',
    className: 'Replanted',
    yop: 2020,
    clone: 'RRIM 600',
    area: 28.4,
    tappingTrees: 5910,
    nonTappingTrees: 1280,
    effectiveArea: 22.9,
    productionTarget: 9600,
    revisedTarget: 10250,
    tappingSystem: 'S/2 d4',
  },
  {
    id: 'DIV-C-03',
    division: 'Hill Division',
    field: 'Field C3',
    className: 'Mature',
    yop: 2012,
    clone: 'GT 1',
    area: 51.2,
    tappingTrees: 12780,
    nonTappingTrees: 1140,
    effectiveArea: 47.6,
    productionTarget: 21800,
    revisedTarget: 22400,
    tappingSystem: 'S/2 d3 ET',
  },
  {
    id: 'DIV-D-02',
    division: 'Factory Division',
    field: 'Field D2',
    className: 'Prime',
    yop: 2018,
    clone: 'RRIC 100',
    area: 33.6,
    tappingTrees: 8420,
    nonTappingTrees: 740,
    effectiveArea: 31.1,
    productionTarget: 15400,
    revisedTarget: 15880,
    tappingSystem: 'S/2 d2',
  },
];

export const overKiloSlabs: OverKiloSlab[] = [
  {
    id: 'OK-A1-01',
    field: 'Field A1',
    className: 'Mature',
    minimumQuantity: 18,
    slab: '18.01 - 24.00 kg',
    slabRate: 42,
  },
  {
    id: 'OK-A1-02',
    field: 'Field A1',
    className: 'Mature',
    minimumQuantity: 24,
    slab: '24.01 kg and above',
    slabRate: 58,
  },
  {
    id: 'OK-A2-01',
    field: 'Field A2',
    className: 'Prime',
    minimumQuantity: 20,
    slab: '20.01 - 26.00 kg',
    slabRate: 46,
  },
  {
    id: 'OK-B1-01',
    field: 'Field B1',
    className: 'Replanted',
    minimumQuantity: 14,
    slab: '14.01 - 19.00 kg',
    slabRate: 34,
  },
  {
    id: 'OK-C3-01',
    field: 'Field C3',
    className: 'Mature',
    minimumQuantity: 19,
    slab: '19.01 - 25.00 kg',
    slabRate: 44,
  },
];
