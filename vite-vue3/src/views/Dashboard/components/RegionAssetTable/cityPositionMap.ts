// longitude 正东经 负西经 latitude正北纬 负南纬

// export default {
//   Singapore: { lng: 103.51, lat: 1.18 },
//   SiliconValley: { lng: 58.21, lat: 135.57 },
//   Bangkok: { lng: 100.3, lat: 13.5 },
//   GuangZhou: { lng: 113.3, lat: 23.2 },
//   Frankfurt: { lng: 14.32, lat: 52.2 },
//   SaoPaulo: { lng: -46.38, lat: -23.34 }
// } as Record<string, { lng: number; lat: number }>

export default {
  TH: {
    region: 'ap-bangkok',
    provider_key: 'tencent',
    name: '亚太地区(曼谷)',
    country_zh: '泰国',
    country_en: 'Thailand',
    // 曼谷经纬度
    lng: 100.3,
    lat: 13.5
  },
  CN: {
    region: 'ap-beijing',
    provider_key: 'tencent',
    name: '华北地区(北京)',
    country_zh: '中国',
    country_en: 'China',
    // 北京经纬度
    lng: 116.3,
    lat: 39.9
  },
  HK: {
    region: 'ap-hongkong',
    provider_key: 'tencent',
    name: '港澳台地区(中国香港)',
    country_zh: '中国香港',
    country_en: 'Hong Kong',
    // 香港经纬度
    lng: 114,
    lat: 22
  },
  TW: {
    region: 'ap-taipei',
    provider_key: 'tencent',
    name: '港澳台地区(中国台北)',
    country_zh: '中国台湾',
    country_en: 'China Taiwan',
    // 台北经纬度
    lng: 119.6,
    lat: 22.9
  },
  IN: {
    region: 'ap-mumbai',
    provider_key: 'tencent',
    name: '亚太地区(孟买)',
    country_zh: '印度',
    country_en: 'India',
    // 孟买经纬度
    lng: 71.49,
    lat: 17.56
  },
  SG: {
    region: 'ap-singapore',
    provider_key: 'tencent',
    name: '东南亚地区(新加坡)',
    country_zh: '新加坡',
    country_en: 'Singapore',
    // 新加坡经纬度
    lng: 101.51,
    lat: 0.18
  },
  JP: {
    region: 'ap-tokyo',
    provider_key: 'tencent',
    name: '亚太地区(东京)',
    country_zh: '日本',
    country_en: 'Japan',
    // 东京经纬度
    lng: 135.69,
    lat: 34.69
  },
  DE: {
    region: 'eu-frankfurt',
    provider_key: 'tencent',
    name: '欧洲地区(法兰克福)',
    country_zh: '德国',
    country_en: 'Germany',
    // 法兰克福经纬度
    lng: 8.32,
    lat: 50.2
  },
  RU: {
    region: 'eu-moscow',
    provider_key: 'tencent',
    name: '欧洲地区(莫斯科)',
    country_zh: '俄罗斯',
    country_en: 'Russian Federation (the)',
    // 莫斯科经纬度
    lng: 37.35,
    lat: 55.45
  },
  US: {
    region: 'na-ashburn',
    provider_key: 'tencent',
    name: '美国东部(弗吉尼亚)',
    country_zh: '美国',
    country_en: 'United States of America (the)',
    // 阿什本 经纬度
    lng: -79.8,
    lat: 37.03
  },
  CA: {
    region: 'na-toronto',
    provider_key: 'tencent',
    name: '北美地区(多伦多)',
    country_zh: '加拿大',
    country_en: 'Canada',
    // 多伦多经纬度
    lng: -80.3,
    lat: 44.4
  },
  BR: {
    region: 'sa-saopaulo',
    provider_key: 'tencent',
    name: '南美地区(圣保罗)',
    country_zh: '巴西',
    country_en: 'Brazil',
    // 圣保罗经纬度
    lng: -48.4,
    lat: -22.4
  },
  ID: {
    region: 'ap-jakarta',
    provider_key: 'tencent',
    name: '亚太地区(雅加达)',
    country_zh: '印度尼西亚',
    country_en: 'Indonesia',
    // 雅加达经纬度
    lng: 106.5,
    lat: -8.1
  },
  SE: {
    region: 'eu-north-1',
    provider_key: 'aws',
    name: 'eu-north-1',
    country_zh: '瑞典',
    country_en: 'Sweden',
    // 斯德哥尔摩经纬度
    lng: 16.03,
    lat: 59.19
  },
  ZA: {
    region: 'af-south-1',
    provider_key: 'aws',
    name: 'af-south-1',
    country_zh: '南非',
    country_en: 'South Africa',
    // 比勒陀利亚经纬度
    lng: 26.17,
    lat: -26.4
  },
  FR: {
    region: 'eu-west-3',
    provider_key: 'aws',
    name: 'eu-west-3',
    country_zh: '法国',
    country_en: 'France',
    // 巴黎经纬度
    lng: 1.25,
    lat: 47.5
  },
  GB: {
    region: 'eu-west-2',
    provider_key: 'aws',
    name: 'eu-west-2',
    country_zh: '英国',
    country_en: 'The United Kingdom',
    // 伦敦经纬度
    lng: -4,
    lat: 52.3
  },
  IE: {
    region: 'eu-west-1',
    provider_key: 'aws',
    name: 'eu-west-1',
    country_zh: '爱尔兰',
    country_en: 'Ireland',
    // 都柏林经纬度
    lng: -9,
    lat: 52
  },
  KR: {
    region: 'ap-northeast-2',
    provider_key: 'aws',
    name: 'ap-northeast-2',
    country_zh: '韩国',
    country_en: 'Korea (the Republic of)',
    // 首尔经纬度
    lng: 124.6,
    lat: 37.3
  },
  AU: {
    region: 'ap-southeast-2',
    provider_key: 'aws',
    name: 'ap-southeast-2',
    country_zh: '澳大利亚',
    country_en: 'Australia',
    // 堪培拉经纬度
    lng: 147.1,
    lat: -33.1
  },
  BH: {
    region: 'me-south-1',
    provider_key: 'aws',
    name: 'me-south-1',
    country_zh: '巴林',
    country_en: 'Bahrain',
    // 麦纳麦经纬度
    lng: 48.35,
    lat: 25.12
  },
  NL: {
    region: 'europe-west4',
    provider_key: 'gcp',
    name: 'europe-west4',
    country_zh: '荷兰',
    country_en: 'Netherlands (the)',
    // 阿姆斯特丹经纬度
    lng: 2.53,
    lat: 50.22
  },
  BE: {
    region: 'europe-west1',
    provider_key: 'gcp',
    name: 'europe-west1',
    country_zh: '比利时',
    country_en: 'Belgium',
    // 布鲁塞尔经纬度
    lng: 3.2,
    lat: 50.5
  },
  IT: {
    region: 'europe-west8',
    provider_key: 'gcp',
    name: 'europe-west8',
    country_zh: '意大利',
    country_en: 'Italy',
    // 罗马经纬度
    lng: 11.3,
    lat: 40.5
  },
  ES: {
    region: 'europe-southwest1',
    provider_key: 'gcp',
    name: 'europe-southwest1',
    country_zh: '西班牙',
    country_en: 'Spain',
    // 马德里经纬度
    lng: -5.8,
    lat: 38.8
  },
  CL: {
    region: 'southamerica-west1',
    provider_key: 'gcp',
    name: 'southamerica-west1',
    country_zh: '智利',
    country_en: 'Chile',
    // 圣地亚哥经纬度
    lng: -72.4,
    lat: -34.3
  },
  PL: {
    region: 'europe-central2',
    provider_key: 'gcp',
    name: 'europe-central2',
    country_zh: '波兰',
    country_en: 'Poland',
    // 华沙经纬度
    lng: 18,
    lat: 51.5
  },
  FI: {
    region: 'europe-north1',
    provider_key: 'gcp',
    name: 'europe-north1',
    country_zh: '芬兰',
    country_en: 'Finland',
    // 赫尔辛基经纬度
    lng: 22.5,
    lat: 60.1
  },
  CH: {
    region: 'europe-west6',
    provider_key: 'gcp',
    name: 'europe-west6',
    country_zh: '瑞士',
    country_en: 'Switzerland',
    // 伯尔尼经纬度
    lng: 6.26,
    lat: 46.6
  },
  AR: {
    region: 'sa-argentina-1',
    provider_key: 'huawei',
    name: 'LA-Buenos Aires1',
    country_zh: '阿根廷',
    country_en: 'Argentina',
    // 布宜诺斯艾利斯经纬度
    lng: -60.3,
    lat: -34.2
  },
  PE: {
    region: 'sa-peru-1',
    provider_key: 'huawei',
    name: 'LA-Lima1',
    country_zh: '秘鲁',
    country_en: 'Peru',
    // 利马经纬度
    lng: -78.5,
    lat: -13.26
  },
  MX: {
    region: 'na-mexico-1',
    provider_key: 'huawei',
    name: 'LA-Mexico City1',
    country_zh: '墨西哥',
    country_en: 'Mexico',
    // 墨西哥城经纬度
    lng: -101.5,
    lat: 19.24
  },
  AE: {
    region: 'ae-ad-1',
    provider_key: 'huawei',
    name: 'ME-Abu Dhabi',
    country_zh: '阿联酋',
    country_en: 'United Arab Emirates (the)',
    // 阿布扎比经纬度
    lng: 52,
    lat: 23
  },
  // Logical: {
  //   region: 'Logical',
  //   provider_key: 'azure',
  //   name: 'Logical',
  //   country_zh: '逻辑',
  //   country_en: 'Logical',
  //   lng: 0,
  //   lat: 0
  // },
  // Asia: {
  //   region: 'Asia Pacific',
  //   provider_key: 'azure',
  //   name: 'Asia Pacific',
  //   country_zh: '亚洲',
  //   country_en: 'Asia Pacific',
  //   lng: 0,
  //   lat: 0
  // },
  // Europe: {
  //   region: 'Europe',
  //   provider_key: 'azure',
  //   name: 'Europe',
  //   country_zh: '欧洲',
  //   country_en: 'Europe',
  //   lng: 0,
  //   lat: 0
  // },
  // Africa: {
  //   region: 'Africa',
  //   provider_key: 'azure',
  //   name: 'Africa',
  //   country_zh: '非洲',
  //   country_en: 'Africa',
  //   lng: 0,
  //   lat: 0
  // },
  // 'Middle East': {
  //   region: 'Middle East',
  //   provider_key: 'azure',
  //   name: 'Middle East',
  //   country_zh: '中东',
  //   country_en: 'Middle East',
  //   lng: 0,
  //   lat: 0
  // },
  // 'South America': {
  //   region: 'South America',
  //   provider_key: 'azure',
  //   name: 'South America',
  //   country_zh: '南美',
  //   country_en: 'South America',
  //   lng: 0,
  //   lat: 0
  // },
  PK: {
    region: '53a1316e-f202-4a7a-96a4-87706075a0fa-0x37',
    provider_key: 'zenlayer',
    name: 'Asia Pacific-Islamabad',
    country_zh: '巴基斯坦',
    country_en: 'Pakistan',
    // 伊斯兰堡经纬度
    lng: 72,
    lat: 32.4
  },
  MY: {
    region: 'cbbcd4b6-61df-49af-805c-fe9165699ae6-0x17',
    provider_key: 'zenlayer',
    name: 'Asia Pacific-Kuala Lumpur',
    country_zh: '马来西亚',
    country_en: 'Malaysia',
    // 吉隆坡经纬度
    lng: 97.4,
    lat: 5.8
  },
  PH: {
    region: '966b901d-edf5-401e-8e78-620fb6d61b0e-0x16',
    provider_key: 'zenlayer',
    name: 'Asia Pacific-Manila',
    country_zh: '菲律宾',
    country_en: 'Philippines (the)',
    // 马尼拉经纬度
    lng: 118,
    lat: 14.5
  },
  VN: {
    region: 'bff2d2b7-1ca9-4d05-b24b-9cb70b1149a1-0x19',
    provider_key: 'zenlayer',
    name: 'Asia Pacific-Ho Chi Minh City',
    country_zh: '越南',
    country_en: 'Viet Nam',
    // 河内经纬度
    lng: 103.5,
    lat: 20
  },
  NG: {
    region: '65a677ad-6c14-418c-8247-198f8fa5dc02-0x23',
    provider_key: 'zenlayer',
    name: 'Europe and Middle East-Lagos',
    country_zh: '尼日利亚',
    country_en: 'Nigeria',
    // 阿布贾经纬度
    lng: 5.27,
    lat: 8.24
  },
  TR: {
    region: 'ff228b10-bbc4-4588-8de8-4b71eae6f965-0x25',
    provider_key: 'zenlayer',
    name: 'Europe and Middle East-Istanbul',
    country_zh: '土耳其',
    country_en: 'Türkiye',
    // 安卡拉经纬度
    lng: 32,
    lat: 38.5
  }
} as any
