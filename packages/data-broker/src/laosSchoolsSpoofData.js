const DATA_TYPE_TO_FUNC = {
  number: index => index,
  bool: index => index % 2,
  binary: index => (index % 2 ? 1 : 0),
};

// Add any codes required here
export const LAOS_SCHOOLS_DATA_ELEMENTS = {
  SchPop001: { type: 'number' },
  BCD29_event: { type: 'binary' },
  BCD32_event: { type: 'binary' },
  SchQuar001: { type: 'binary' },
};

const generateSpoofData = (dataElementCode, orgUnits) => {
  const type = LAOS_SCHOOLS_DATA_ELEMENTS[dataElementCode].type;
  const dataGenerator = DATA_TYPE_TO_FUNC[type];
  return orgUnits.map((school, index) => {
    return {
      dataElement: dataElementCode,
      period: '20200304',
      organisationUnit: school,
      value: dataGenerator(index),
    };
  });
};

export const getSpoofData = dataSourceSpec => {
  const dataElementCode = dataSourceSpec.code[0];
  // Doesn't return any metadata
  const data = generateSpoofData(dataElementCode, schools);
  console.log('generating data like:', data[0]);
  return { results: data };
};

const schools = [
  'LA_sch_706035',
  'LA_sch_801055',
  'LA_sch_907013',
  'LA_sch_105011',
  'LA_sch_107056',
  'LA_sch_107061',
  'LA_sch_107026',
  'LA_sch_120701',
  'LA_sch_120701',
  'LA_sch_120601',
  'LA_sch_131102',
  'LA_sch_131102',
  'LA_sch_131201',
  'LA_sch_131100',
  'LA_sch_131103',
  'LA_sch_131200',
  'LA_sch_131203',
  'LA_sch_131304',
  'LA_sch_504050',
  'LA_sch_131304',
  'LA_sch_130501',
  'LA_sch_131301',
  'LA_sch_130302',
  'LA_sch_130301',
  'LA_sch_130301',
  'LA_sch_130301',
  'LA_sch_130200',
  'LA_sch_130601',
  'LA_sch_130108',
  'LA_sch_130104',
  'LA_sch_130300',
  'LA_sch_131500',
  'LA_sch_130302',
  'LA_sch_131500',
  'LA_sch_130106',
  'LA_sch_130502',
  'LA_sch_130904',
  'LA_sch_131001',
  'LA_sch_130502',
  'LA_sch_130104',
  'LA_sch_130904',
  'LA_sch_131404',
  'LA_sch_130602',
  'LA_sch_130903',
  'LA_sch_130900',
  'LA_sch_130906',
  'LA_sch_130900',
  'LA_sch_131002',
  'LA_sch_131403',
  'LA_sch_131202',
  'LA_sch_131001',
  'LA_sch_140401',
  'LA_sch_140300',
  'LA_sch_131402',
  'LA_sch_131000',
  'LA_sch_131400',
  'LA_sch_131000',
  'LA_sch_131402',
  'LA_sch_206004',
  'LA_sch_206012',
  'LA_sch_206013',
  'LA_sch_206021',
  'LA_sch_206024',
  'LA_sch_206008',
  'LA_sch_206002',
  'LA_sch_206037',
  'LA_sch_206035',
  'LA_sch_708003',
  'LA_sch_708009',
  'LA_sch_708006',
  'LA_sch_708010',
  'LA_sch_403013',
  'LA_sch_304051',
  'LA_sch_708027',
  'LA_sch_708001',
  'LA_sch_304033',
  'LA_sch_702023',
  'LA_sch_708035',
  'LA_sch_708007',
  'LA_sch_304045',
  'LA_sch_702012',
  'LA_sch_702016',
  'LA_sch_702018',
  'LA_sch_702004',
  'LA_sch_206032',
  'LA_sch_206034',
  'LA_sch_206015',
  'LA_sch_206017',
  'LA_sch_206031',
  'LA_sch_206022',
  'LA_sch_206025',
  'LA_sch_206005',
  'LA_sch_206018',
  'LA_sch_206014',
  'LA_sch_206003',
  'LA_sch_206011',
  'LA_sch_206009',
  'LA_sch_206006',
  'LA_sch_205034',
  'LA_sch_201029',
  'LA_sch_205022',
  'LA_sch_205006',
  'LA_sch_205039',
  'LA_sch_205038',
  'LA_sch_201013',
  'LA_sch_206016',
  'LA_sch_206023',
  'LA_sch_206029',
  'LA_sch_206020',
  'LA_sch_201024',
  'LA_sch_205024',
  'LA_sch_201005',
  'LA_sch_201010',
  'LA_sch_201002',
  'LA_sch_201030',
  'LA_sch_201027',
  'LA_sch_205035',
  'LA_sch_202015',
  'LA_sch_205029',
  'LA_sch_205030',
  'LA_sch_201011',
  'LA_sch_201022',
  'LA_sch_201034',
  'LA_sch_205036',
  'LA_sch_205031',
  'LA_sch_205001',
  'LA_sch_205025',
  'LA_sch_205016',
  'LA_sch_205007',
  'LA_sch_201021',
  'LA_sch_207006',
  'LA_sch_202048',
  'LA_sch_204023',
  'LA_sch_205043',
  'LA_sch_205037',
  'LA_sch_205004',
  'LA_sch_202051',
  'LA_sch_204021',
  'LA_sch_205015',
  'LA_sch_205023',
  'LA_sch_205019',
  'LA_sch_205020',
  'LA_sch_205032',
  'LA_sch_205011',
  'LA_sch_204018',
  'LA_sch_205040',
  'LA_sch_302056',
  'LA_sch_205005',
  'LA_sch_205002',
  'LA_sch_205008',
  'LA_sch_205027',
  'LA_sch_205013',
  'LA_sch_205021',
  'LA_sch_205010',
  'LA_sch_204004',
  'LA_sch_207002',
  'LA_sch_202033',
  'LA_sch_202016',
  'LA_sch_204015',
  'LA_sch_207003',
  'LA_sch_302055',
  'LA_sch_205012',
  'LA_sch_204005',
  'LA_sch_205018',
  'LA_sch_205041',
  'LA_sch_207005',
  'LA_sch_205003',
  'LA_sch_204016',
  'LA_sch_204001',
  'LA_sch_302015',
  'LA_sch_204012',
  'LA_sch_302033',
  'LA_sch_302047',
  'LA_sch_202017',
  'LA_sch_302052',
  'LA_sch_207001',
  'LA_sch_207009',
  'LA_sch_204017',
  'LA_sch_207008',
  'LA_sch_202018',
  'LA_sch_207004',
  'LA_sch_204010',
  'LA_sch_302032',
  'LA_sch_302054',
  'LA_sch_204019',
  'LA_sch_302051',
  'LA_sch_202044',
  'LA_sch_207007',
  'LA_sch_302019',
  'LA_sch_302038',
  'LA_sch_202045',
  'LA_sch_202009',
  'LA_sch_204008',
  'LA_sch_202046',
  'LA_sch_204013',
  'LA_sch_302042',
  'LA_sch_302023',
  'LA_sch_302041',
  'LA_sch_302049',
  'LA_sch_202035',
  'LA_sch_302031',
  'LA_sch_302048',
  'LA_sch_207010',
  'LA_sch_204011',
  'LA_sch_204014',
  'LA_sch_202006',
  'LA_sch_204024',
  'LA_sch_204025',
  'LA_sch_302006',
  'LA_sch_302022',
  'LA_sch_204002',
  'LA_sch_204027',
  'LA_sch_302012',
];
