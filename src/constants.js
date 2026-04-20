export const CROWD_FLOW_DATA = [
  { time: '14:00', G1: 800, G2: 1200, G3: 1500, G4: 900, G5: 1100, G6: 1800, G7: 700, G8: 1000 },
  { time: '15:00', G1: 1500, G2: 2100, G3: 2400, G4: 1700, G5: 1900, G6: 3200, G7: 1300, G8: 1800 },
  { time: '16:00', G1: 2200, G2: 3200, G3: 3100, G4: 2500, G5: 2800, G6: 4500, G7: 2100, G8: 2600 },
  { time: '17:00', G1: 2800, G2: 4100, G3: 3800, G4: 3100, G5: 3500, G6: 5200, G7: 2900, G8: 3400 },
  { time: '18:00', G1: 3240, G2: 4524, G3: 4316, G4: 3800, G5: 4100, G6: 4732, G7: 3500, G8: 4000 },
];

export const GATES = [
  { id: 1, name: 'Gate 1', desc: 'North Main', status: 'Open', color: 'blue', wait: '3m', rate: 42, fill: 62, count: 3240 },
  { id: 2, name: 'Gate 2', desc: 'North East', status: 'Critical', color: 'red', wait: '11m', rate: 28, fill: 87, count: 4524 },
  { id: 3, name: 'Gate 3', desc: 'East Upper', status: 'Warning', color: 'amber', wait: '8m', rate: 31, fill: 83, count: 4316 },
  { id: 4, name: 'Gate 4', desc: 'South East', status: 'Open', color: 'blue', wait: '2m', rate: 55, fill: 38, count: 1976 },
  { id: 5, name: 'Gate 5', desc: 'South Main', status: 'Warning', color: 'amber', wait: '6m', rate: 38, fill: 71, count: 3692 },
  { id: 6, name: 'Gate 6', desc: 'South West', status: 'Critical', color: 'red', wait: '14m', rate: 19, fill: 91, count: 4732 },
  { id: 7, name: 'Gate 7', desc: 'West Lower', status: 'Open', color: 'blue', wait: '1m', rate: 61, fill: 33, count: 1716 },
  { id: 8, name: 'Gate 8', desc: 'North West', status: 'Open', color: 'blue', wait: '4m', rate: 44, fill: 58, count: 3016 },
];

export const HEATMAP_BLOCKS = [
  { label: 'North', blocks: [{id:'A', fill:42, c:'emerald'}, {id:'B', fill:55, c:'amber'}, {id:'C', fill:68, c:'amber'}, {id:'D', fill:88, c:'red'}, {id:'E', fill:72, c:'orange'}, {id:'F', fill:91, c:'red'}, {id:'G', fill:35, c:'emerald'}] },
  { label: 'Mid', blocks: [{id:'H', fill:48, c:'emerald'}, {id:'I', fill:63, c:'amber'}, {id:'J', fill:77, c:'orange'}, {id:'K', fill:82, c:'orange'}, {id:'L', fill:94, c:'red'}, {id:'M', fill:29, c:'emerald'}, {id:'N', fill:44, c:'emerald'}] },
  { label: 'South', blocks: [{id:'O', fill:56, c:'amber'}, {id:'P', fill:71, c:'orange'}, {id:'Q', fill:38, c:'emerald'}, {id:'R', fill:86, c:'red'}, {id:'S', fill:67, c:'amber'}, {id:'T', fill:52, c:'amber'}, {id:'U', fill:79, c:'orange'}] },
  { label: 'VIP', blocks: [{id:'V', fill:93, c:'red'}, {id:'W', fill:41, c:'emerald'}, {id:'X', fill:58, c:'amber'}, {id:'Y', fill:33, c:'emerald'}, {id:'Z', fill:75, c:'orange'}] }
];

export const INCIDENTS = [
  { id: 'INC-2026-0847', time: '05:38:22', gate: 'Gate 2', blocks: ['C','D','R','Z'], type: 'Overcrowding', severity: 'Critical', fill: '87%', redirect: 'Gate 1, Gate 8', operator: 'M. Okonkwo', status: 'Active', aiMsg: 'Gate 2 (North East) reached 87% capacity. Reroute to Gate 1 and Gate 8 recommended.' },
  { id: 'INC-2026-0846', time: '05:33:47', gate: 'Gate 6', blocks: ['K','L','V'], type: 'Reroute', severity: 'Critical', fill: '91%', redirect: 'Gate 7', operator: 'System (Auto)', status: 'Acknowledged', aiMsg: 'Gate 6 (South West) at 91% — automated reroute to Gate 7 initiated.' },
  { id: 'INC-2026-0845', time: '05:29:14', gate: 'Gate 3', blocks: ['E','F'], type: 'Overcrowding', severity: 'Warning', fill: '79%', redirect: 'Gate 4', operator: 'S. Patel', status: 'Acknowledged', aiMsg: 'Gate 3 (East Upper) approaching threshold at 79%. Recommend reroute blocks E, F to Gate 4.' },
  { id: 'INC-2026-0844', time: '05:21:33', gate: 'Gate 1', blocks: ['B'], type: 'Technical', severity: 'Warning', fill: '58%', redirect: '—', operator: 'T. Ndiaye', status: 'Resolved', aiMsg: 'Gate 1 scanner malfunction detected. Block B temporarily rerouted. Issue resolved by T. Ndiaye.' },
  { id: 'INC-2026-0843', time: '05:17:48', gate: 'Gate 5', blocks: ['U'], type: 'Overcrowding', severity: 'Warning', fill: '71%', redirect: 'Gate 4', operator: 'M. Okonkwo', status: 'Resolved', aiMsg: 'Gate 5 (South Main) reached 71%. Block U redirected to Gate 4 successfully.' },
  { id: 'INC-2026-0842', time: '05:12:09', gate: 'Gate 6', blocks: ['L','V'], type: 'Overcrowding', severity: 'Critical', fill: '84%', redirect: 'Gate 7', operator: 'System (Auto)', status: 'Resolved', aiMsg: 'Gate 6 overcrowding resolved. Automated reroute to Gate 7 completed for blocks L, V.' },
  { id: 'INC-2026-0841', time: '05:08:31', gate: 'Gate 2', blocks: ['D'], type: 'Security', severity: 'Warning', fill: '62%', redirect: 'Gate 1', operator: 'R. Vasquez', status: 'Resolved', aiMsg: 'Security incident at Gate 2. Block D access restricted. Resolved by R. Vasquez.' },
  { id: 'INC-2026-0840', time: '05:03:55', gate: 'Gate 8', blocks: ['P'], type: 'Overcrowding', severity: 'Info', fill: '58%', redirect: '—', operator: 'System (Monitor)', status: 'Resolved', aiMsg: 'Gate 8 moderate load at 58%. No action required — monitoring continues.' },
  { id: 'INC-2026-0839', time: '04:58:17', gate: 'Gate 3', blocks: ['F','S'], type: 'Reroute', severity: 'Warning', fill: '74%', redirect: 'Gate 4', operator: 'S. Patel', status: 'Resolved', aiMsg: 'Gate 3 blocks F, S rerouted to Gate 4 due to rising occupancy.' },
  { id: 'INC-2026-0838', time: '04:52:44', gate: 'Gate 7', blocks: ['M','N'], type: 'Technical', severity: 'Info', fill: '45%', redirect: '—', operator: 'T. Ndiaye', status: 'Resolved', aiMsg: 'Gate 7 turnstile calibration completed. No crowd impact observed.' },
  { id: 'INC-2026-0837', time: '04:47:05', gate: 'Gate 4', blocks: ['G','H'], type: 'Overcrowding', severity: 'Warning', fill: '76%', redirect: 'Gate 7', operator: 'M. Okonkwo', status: 'Resolved', aiMsg: 'Gate 4 (South East) reaching 76%. Blocks G, H diverted to Gate 7.' },
  { id: 'INC-2026-0836', time: '04:41:28', gate: 'Gate 1', blocks: ['A','B'], type: 'Security', severity: 'Info', fill: '52%', redirect: '—', operator: 'R. Vasquez', status: 'Resolved', aiMsg: 'Routine security sweep at Gate 1. No irregularities found.' },
  { id: 'INC-2026-0835', time: '04:31:08', gate: 'Gate 5', blocks: ['I','J'], type: 'Gate Closure', severity: 'Critical', fill: '88%', redirect: 'Gate 4', operator: 'System (Auto)', status: 'Resolved', aiMsg: 'Gate 5 temporarily closed due to 88% saturation. All traffic redirected to Gate 4.' },
  { id: 'INC-2026-0834', time: '04:22:36', gate: 'Gate 8', blocks: ['O','P'], type: 'Overcrowding', severity: 'Warning', fill: '69%', redirect: 'Gate 7', operator: 'System (Monitor)', status: 'Resolved', aiMsg: 'Gate 8 occupancy at 69%. Preventive reroute of blocks O, P to Gate 7.' },
  { id: 'INC-2026-0833', time: '04:15:02', gate: 'Gate 2', blocks: ['C'], type: 'Reroute', severity: 'Info', fill: '55%', redirect: 'Gate 1', operator: 'S. Patel', status: 'Resolved', aiMsg: 'Planned reroute of block C from Gate 2 to Gate 1 executed smoothly.' },
];
