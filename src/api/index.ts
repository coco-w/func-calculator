export const baseUrl = 'http://192.168.3.251:9006'
import axios, { AxiosPromise, AxiosRequestConfig } from 'axios'
import { message } from 'antd'
import { TablePaginationConfig } from 'antd/lib/table'
import { funItem } from '@page/home/type'
import { TemplateItem } from '@page/template/type'
const instance = axios.create({
  headers: {
    'content-type':'application/json;charset=utf-8',
    'x-requested-with':'XMLHttpRequest',
    'jreap-heard':'dtxy'
  }
})
instance.interceptors.request.use((config: AxiosRequestConfig) => {
  return config
})
instance.interceptors.response.use(res => {
  if (res.data.flag === 'error') {
    if (res.data.errorCode === '403') {
      message.warning('没有登录')
      setTimeout(() => {
        window.location.href = 'http://192.168.3.251/page/login/index.html'  
      }, 2000)
    }
    return new Promise((resolve, reject) => {
      return reject(res.data)
    })
  }else {
    return res.data
  }
  
})

/**
 * 查询所有计算方法
 * @param pages 分页条件
 * @param params 筛选条件
 * @returns {AxiosPromise} promise
 */

export const getCalcFunc = (pages: TablePaginationConfig, params: any): AxiosPromise => {
  return instance.get('api/eanew/eaProjectIndex/detail', {
    params: {
      current: pages.current,
      pageSize:pages.pageSize,
      ...params
    }
  })
}

/**
 * 查询大类
 */
export const getMajorClass = (): AxiosPromise => {
  return instance.get('api/eanew/eaProjectb/detail')
}

/**
 * 查询小类
 */
export const getSubclass = (): AxiosPromise => {
  return instance.get('api/eanew/eaProjects/detail')
}

/**
 * 新增或修改计算指标
 * @param params 
 */
export const calcFuncSubmit = (params: funItem): AxiosPromise => {
  return instance.post('api/eanew/eaProjectIndex/submit', {
    eaProjectIndexEntity: params
  })
}
/**
 * 删除计算指标
 * @param indexCode 
 */
export const deleteCalcFunc = (indexCode: string): AxiosPromise => {
  return instance.get('api/eanew/eaProjectIndex/delete', {
    params: {
      oid: indexCode
    }
  })
}
/**
 * 获取所有基础指标
 */
export const getBaseIndex = (id?: string): AxiosPromise => {
  return instance.get('api/eanew/eaProjectPoint/detail', {
    params: {
      eaProjectsOid: id
    }
  })
}

/**
 * 查询函数
 * @param id 指标类型
 */
export const getFunction = (id?: string): AxiosPromise => {
  return instance.get('api/eanew/eaProjectPoint/selectFunction', {
    params: {
      eaProjectsOid: id
    }
  })
}

export const verification = (eaProjectOid: string, indexCode: string, oid?: string) => {
  return instance.get('api/eanew/eaProjectIndex/selectCountByIndexCode', {
    params: {
      eaProjectOid: eaProjectOid, 
      indexCode: indexCode,
      oid: oid,
    }
  })
}
/**
 * @param eaProjectsOid id
 * @param valueSense 中文名
 */
export interface Templatepage {
  eaProjectsOid?: string;
  valueSense?: string;
}
/**
 * 查询模板
 * @param current 
 * @param pageSize 

 */
export const getTemplatepage = (pages: TablePaginationConfig, params?: Templatepage) => {
  return instance.get('api/eanew/eaTempDemo/page', {
    params: {
      current: pages.current,
      pageSize: pages.pageSize,
      ...params
    }
  })
}
/**
 * 保存
 * @param data template数据
 */
export const saveTemplate = (data: TemplateItem) => {
  return instance.post('api/eanew/eaTempDemo/submit', {
    eaTempDemoEntity: {
      ...data
    }
  })
}
/**
 * 删除 template
 * @param oid id
 */
export const deleteTemplate = (oid: string) => {
  return instance.get('api/eanew/eaTempDemo/delete', {
    params: {
      oid
    }
  })
}