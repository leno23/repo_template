/**
 * 基础的云厂商key，某些地方还会有一个ibm
 */
type ProviderTypeEnum = 'tencent' | 'huawei' | 'gcp' | 'aws' | 'azure' | 'zenlayer'

interface AllCloudRegionAndZoneModel {
   config: { secret_id: string; secret_key: string };
   created_at: string;
   created_by: string;
   deleted_at: string;
   deleted_by: string;
   description: string;
   devices: {
     cpu: string,
     instanceType: string
     memory: string
     tempStorage: string
   }[];
   id: number;
   is_deleted: boolean;
   is_extra: boolean;
   key: ProviderTypeEnum | 'ibm'
   name_en: string;
   name_zh: string;
   regions: {
     area: string
     region: string
     zones: {
       name: string
       zone: string
     }[]
   }[];
   updated_at: string;
   updated_by: string;
 }

//* --------------------------------

 /**
  * 业务状态
  */
 type BusinessStatusEnum = 'test' | 'live' | 'retired' | 'demo' | 'down'

 /**
  * 运营阶段
  */
 type BusinessStateEnum = 'INNER' | 'CBT' | 'OBT' | 'SL' | 'GL'

 /**
  * 发行模式
  */
 type BusinessReleaseModeEnum = 'SELF' | 'SECOND_PARTY' | 'THIRD_PARTY' | 'WHOLE' | 'OTHER'

 /**
  * 等级
  */
 type BusinessLevelEnum = 'Super' | 'Key' | 'Regular'

 /**
  * 游戏类型
  */
 type BusinessGameTypeEnum = 'MOBA' | 'FPS' | 'TPS' | 'BR' | 'SLG' | 'LVG' | 'SandBox' | 'MMORPG' | 'ACG' | 'RAC' | 'Metaverse' | 'SPT' | 'FTG' | 'TAB' | 'CAG' | 'PUZ' | 'Others'

 /**
  * 业务类型 不同的业务类型下的关联字段支持的值不一样
  */
 type BusinessTypeEunm = 'component' | 'game' | 'app'

 /**
   * 组件业务的组件类型
   */
 type BusinessComponentTypeEnum = 'B' | 'D' | 'M' | 'P' | 'S'

 /**
   * app业务类型
   */
 type BusinessAppType = 'self' | 'external'

 /**
   * app业务类型 敏感等级
   */
 type BusinessSensitiveLevelEnum = 'top' | 'high' | 'middle' | 'low'

 /**
   * app业务类型 域名类型
   */
 type BusinessDomainTypeEnum = 'productive' | 'nonproductive'

 /**
  * 业务信息对象
  */
 interface BusinessFullModel {
   id: number
   action: string // enum
   created_at: string
   created_by: string
   ct: Record<string, string>
   description: null | string
   developer: string
   game_id: null | number
   game_type: BusinessGameTypeEnum | ''
   genre: BusinessTypeEunm
   level: null | BusinessLevelEnum
   name_en: string
   name_zh: string
   parent_id: number
   publisher: string
   application: string

   release_mode: BusinessReleaseModeEnum

   stage: BusinessStateEnum | null

   status: BusinessStatusEnum // enum
   /**
    * 业务类型genre是component才有
    */
   component_type: null | BusinessComponentTypeEnum // enum

   apps: { name: string, genre: string, app_id: string }[]
   app_data_type: { low?: { '1': number[] }, middle?: { '1': number[], '2': number[] }, high?: { '1': number[], '2': number[] }, top?: { '1': number[], '2': number[] } }
   app_domains: { type: BusinessDomainTypeEnum, value: string }[] // ???
   app_is_public: boolean
   app_sensitive_level: BusinessSensitiveLevelEnum | ''

   /**
    * 业务类型genre是app才有
    */
   app_type: BusinessAppType | ''

   obs_id: null | number
   product_name: string // 运营产品

   updated_at: string | null
   updated_by: string | null

   /**
    * 用户在改业务中所拥有的所有角色权限
    */
   roles: { name_zh: string, name_en: string }[]
 }
