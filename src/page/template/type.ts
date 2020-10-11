/**
 * @param eaProjectsOid  小类OId
 * @param maxValue  最大值
 * @param minValue  最小值
 * @param oid  id
 * @param valueCode  code
 * @param valueDemo  默认值
 * @param valueSense  label名
 */
export interface TemplateItem {
  eaProjectsOid: string
  maxValue: string
  minValue: string
  oid: string
  valueCode: string
  valueDemo: string
  valueSense: string
  address: string|number
}

export interface QueryParams {
  eaProjectOid?: string
  eaProjectsOid?: string
  valueSense?: string
}