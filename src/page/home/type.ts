import { TablePaginationConfig } from "antd/lib/table"

export interface funItem {
  calculateExp?: string //计算公式
  calculateOrder?: number //计算顺序
  displayExp?: string //显示公式(包含注释)
  eaProjectsOid?: string //项目小类标识oid
  expDesc?: string //公式描述
  indexCode?: string //指标编号
  indexName?: string //指标中文描述
  indexType?: number
  indexUnit?: string // 指标计量单位
  isMove?: number
  isSensitivityAnalysis?: number
  localVar?: string //内部变量
  orderNo?: number //排序号
  outVar?: string //外部变量
  outVarFunc?: string //外部函数变量
  rangeType?: number
  remark?:	string //备注
}

export interface ColumnItem {
  dataIndex: string
  title: string
  key: string
}
/**
 * @method open 打开modal
 */
export interface AlgorithModal {
  open: () => void
}
/**
 * 基础信息modal
 * @method open 打开modal
 * @method close 关闭modal
 * @method restForm 重置表单
 */
export interface IBaseModal {
  open: () => void
  close: () => void
  restForm: () => void
}
/**
 * 大类
 * @param oid id
 * @param projectbname 中文名称
 * @param projectbcode code
 */
export interface MajorClass {
  /**
   * id
   */
  oid: string,
  projectbname: string,
  projectbcode: string
}
/**
 * 小类
 */
export interface SubClass {
  "eaProjectpoid": "string",
  "mgAnalysisTableName": "string",
  "oid": "string",
  "projectscode": "string",
  "projectsname": "string"
}
/**
 * 新增计算指标
 */
export interface CalcBaseMsg {
  "calculateExp": "string",
  /**
   * 计算顺序
   */
  "calculateOrder": number,
  "displayExp": "string",
  /**
   * 小类
   */
  "eaProjectsOid": "string",
  "expDesc": "string",
  /**
   * 指标编号
   */
  "indexCode": "string",
  /**
   * 指标名称
   */
  "indexName": "string",
  "indexType": number,
  /**
   * 指标计量单位
   */
  "indexUnit": "string",
  "isMove": number,
  "isSensitivityAnalysis": number,
  "localVar": "string",
  /**
   * 排序号
   */
  "orderNo": number,
  "outVar": "string",
  "outVarFunc": "string",
  "rangeType": number,
  /**
   * 备注
   */
  "remark": "string"
}