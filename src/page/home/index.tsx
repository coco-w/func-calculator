import React, { useState, useEffect, useRef } from 'react'
import { Table, Button, Row, Form, Select, Input, Col, message, Popconfirm } from 'antd'
import { getCalcFunc, getMajorClass, getSubclass, calcFuncSubmit, deleteCalcFunc } from '../../api'
import { funItem, AlgorithModal, MajorClass, SubClass, CalcBaseMsg, IBaseModal } from './type'
import './index.less'
import { ColumnProps, TablePaginationConfig } from 'antd/lib/table'
import { Store } from 'antd/lib/form/interface'
import EidtCalc from '../../components/editCalc'
import BaseModal from '../../components/baseModal'
import Modal from 'antd/lib/modal/Modal'

const Home: React.FC<any> = (props: any) => {
  const algorithModal = useRef<AlgorithModal>(null)
  const baseModal = useRef<IBaseModal>(null)
  const [queryParams, setQueryParams] = useState<funItem>({})
  const [majorClass, setMajorClass] = useState<Array<MajorClass>>([])
  const [subClass, setSubClass] = useState<Array<SubClass>>([])
  const [activeSubClass, setActiveSubClass] = useState<Array<SubClass>>([])
  const [deleteVisible, setDeleteVisible] = useState<boolean>(false)
  const [deleteCode, setDeleteCode] = useState<string>('')
  const [pages, setPages] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  })
  const [dataSource, setDataSource] =  useState<Array<funItem>>([])
  const [showEditCalcFunc, setShowEditCalcFunc] = useState<boolean>(false)
  const [editData, setEditData] = useState<funItem | null>(null)
  const [baseModalTitle, setBaseModalTitle] = useState<'新增' | '编辑' | ''>('')
  const [baseForm, setBaseForm] = useState<funItem | undefined | null>(undefined)
  const [baseModalType, setBaseModalType] = useState<'add'|'update'>('add')
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false)
  const [tableLoading, setTableLoading] = useState<boolean>(false)
  
  const [form] = Form.useForm()
  
  /**
   * 加载table数据
   */
  const onLoad = (pages: TablePaginationConfig, params: any): void => {
    setTableLoading(true)
    getCalcFunc(pages, params).then((res: any) => {
      setPages({
        ...pages,
        total: res.result.total,
      })
      setDataSource(res.result.records)
      setTableLoading(false)
    }).catch(err => {
      setTableLoading(false)
    })
  }
  
  const handleChangeAlgorith = (item: funItem) => {
    if (algorithModal.current) {
      setEditData((oid: funItem | null) => {
        if (algorithModal.current) {
          algorithModal.current.open(item)
        }
        return item
      })
      
    }
  }
  const handleUpdateCalcBase = (item: funItem) => {
    if (baseModal.current) {
      setBaseForm(item)
      setBaseModalType('update')
      setBaseModalTitle('编辑')
      baseModal.current.open()
    }
  }
  const hadnleDeleteItem = () => {
    setConfirmLoading(true)
    deleteCalcFunc(deleteCode).then(res => {
      message.success('删除成功')
      console.log(queryParams)
      onLoad(pages, queryParams)
      setConfirmLoading(false)
      setDeleteVisible(false)
    }).catch(err => {
      setConfirmLoading(false)
    })
  }
  
  
  const [columns, setColumns] = useState<Array<ColumnProps<funItem>>>([
    {
      title: '序号',
      render: function render(value: any, record: funItem, index: number): React.ReactElement {
        return (
          <div>{index+1}</div>
        )
      },
      width: 80
    },
    {
      title: '指标编号',
      dataIndex: 'indexCode',
    },
    {
      title: '指标名称',
      dataIndex: 'indexName',
    },
    {
      title: '排序号',
      dataIndex: 'orderNo',
      width: '100px',
    },
    {
      title: '计算顺序',
      dataIndex: 'calculateOrder',
      width: '100px',
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
    {
      title: '操作',
      render: function render(value: any, record: funItem, index: number): React.ReactElement {
        return (
          <div className="btn-wrapper" style={{padding: 0}}>
            <Button type="primary" onClick={handleUpdateCalcBase.bind(this, record)}>修改</Button>
            <Button type="primary" danger onClick={() => {
                setDeleteVisible(true)
                if (record.indexCode) {
                  setDeleteCode(record.indexCode)
                }
              }}
            >删除</Button>
            <Button type="primary" onClick={handleChangeAlgorith.bind(this, record)}>配置算法</Button>
          </div>
        )
      },
      width: '300px',
    }
  ])
  useEffect(() => {
    onLoad(pages, queryParams)
    getMajorClass().then((res: any) => {
      setMajorClass(res.result.eaProjectbEntityList)
    })
    getSubclass().then((res: any) => {
      setSubClass(res.result.eaProjectsEntityList)
    })
  }, [])
  // useEffect(() => {
  //   if (algorithModal.current && editData) {
      
  //   }
  // }, [editData])
  // useEffect(() => {
  //   if (baseModal.current && baseForm) {
      
  //   }
  // }, [baseForm])
  const handleTableChange = (pagination: TablePaginationConfig): void => {
    setPages({
      ...pagination
    })
    onLoad(pagination, queryParams)
  }
  const handleFormSearch = (): void => {
    form.validateFields().then((value: Store) => {
      setQueryParams(value)
      onLoad(pages, value)
    })
  }
  const handleMajorChange = (value: any): void => {
    const arr: Array<SubClass> = []
    subClass.forEach((ele: SubClass) => {
      if (ele.eaProjectpoid === String(value)) {
        arr.push(ele)
      }
    })
    form.resetFields(['eaProjectsOid'])
    setActiveSubClass(arr)
  }
  const handleAddCalcFunc = (): void => {
    if (baseModal.current) {
      setBaseModalTitle('新增')
      setBaseModalType('add')
      baseModal.current.open()
    }
  }
  const handleBaseModalSubmit = (value: any): void => {
    if (baseModalType === 'add') {
      calcFuncSubmit(value).then(res => {
        message.success('提交成功')
        baseModal.current?.restForm()
        baseModal.current?.close()
        onLoad(pages, queryParams)
      }).catch((err: any) => {
        // baseModal.current?.close()
      })
    } else if (baseModalType === 'update') {
      calcFuncSubmit({
        ...baseForm,
        ...value
      }).then(res => {
        message.success('提交成功')
        baseModal.current?.restForm()
        baseModal.current?.close()
        onLoad(pages, queryParams)
      }).catch((err: any) => {
        // baseModal.current?.close()
      })
    }
  }
  const eidtCalcSubmit = (text: string, html: string) => {
    calcFuncSubmit({
      ...editData,
      calculateExp: text,
      htmlText: html
    })
  }
  return (
    <div className="home">
      <Form layout="inline" form={form}>
        <Form.Item name="eaProjectOid"  label="项目大类">
          <Select
            onChange={handleMajorChange}
            allowClear={true}
          >
            {
              majorClass.map((ele: MajorClass) => {
               return (
                <Select.Option key={ele.oid} value={ele.oid}>
                  {ele.projectbname}
                </Select.Option>
               ) 
              })
            }
          </Select>
        </Form.Item>
        <Form.Item label="项目小类" name="eaProjectsOid">
          <Select allowClear={true}>
          {
              activeSubClass.map((ele: SubClass) => {
               return (
                <Select.Option key={ele.oid} value={ele.oid}>
                  {ele.projectsname}
                </Select.Option>
               ) 
              })
            }
          </Select>
        </Form.Item>
        <Form.Item label="指标编号" name="indexCode">
          <Input></Input>
        </Form.Item>
        <Form.Item label="指标名称" name="indexName">
          <Input></Input>
        </Form.Item>
        <Form.Item >
          <Button type="primary" onClick={handleFormSearch}>查询</Button>
        </Form.Item>
      </Form>
      <Row className="btn-wrapper">
        <Button type="primary" onClick={handleAddCalcFunc}>新增</Button>
      </Row>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={pages}
        onChange={handleTableChange}
        bordered={true}
        loading={tableLoading}
      />
      <EidtCalc visible={showEditCalcFunc} ref={algorithModal} data={editData} submit={eidtCalcSubmit}/>
      <BaseModal ref={baseModal} title={baseModalTitle} data={baseForm} majorClass={majorClass} subClass={subClass} submit={handleBaseModalSubmit} type={baseModalType}></BaseModal>
      <Modal
        title="删除"
        visible={deleteVisible}
        onCancel={() => {setDeleteVisible(false)}}
        onOk={hadnleDeleteItem}
        okText="确认"
        cancelText="取消"
        okType="danger"
        confirmLoading={confirmLoading}
      >
        <p>确认删除指标编号为{deleteCode}</p>
      </Modal>
    </div>
  )
}

export default Home