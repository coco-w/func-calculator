import React, { useEffect, useState } from 'react'
import { Button, Col, Form, Input, Row, Select, Table, Modal, message, Drawer } from 'antd'
import { TemplateItem, QueryParams } from './type'
import { getMajorClass, getSubclass, getTemplatepage, saveTemplate, deleteTemplate } from '@/api/index'
import { MajorClass, SubClass } from '../home/type'
import { TablePaginationConfig } from 'antd/lib/table'
import { Store } from 'antd/lib/form/interface'
import './index.less'
import province from '@/utils/province'
// import  from 'antd/lib/modal/Modal'
const TemplatePage: React.FC = () => {
  const [tableData, setTableData] = useState<Array<TemplateItem>>([])
  const [majorClass, setMajorClass] = useState<Array<MajorClass>>([])
  const [subClass, setSubClass] = useState<Array<SubClass>>([])
  const [queryParams, setQueryParams] = useState<QueryParams>({})
  const [activeSubClass, setActiveSubClass] = useState<Array<SubClass>>([])
  const [tableLoading, setTableLoading] = useState<boolean>(false)
  const [pages, setPages] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  })
  const [modalTitle, setModalTitle] = useState<'新增'|'编辑'>('新增')
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [modalSubClass, setModalSubClass] = useState<Array<SubClass>>([])
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false)
  const [modalFormData, setModalFormData] = useState<TemplateItem>({
    eaProjectsOid: '',
    maxValue: '',
    minValue: '',
    oid: '',
    valueCode: '',
    valueDemo: '',
    valueSense: '',
    address: '',
    phase: '',
  })
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false)
  const [deleteConfirmLoading, setDeleteConfirmLoading] = useState<boolean>(false)
  const [deleteModalContent, setDeleteModalContent] = useState<string>('')
  const [deleteOid, setDeleteOid] = useState<string>('')
  const [form] = Form.useForm()
  const [modalForm] = Form.useForm()
  const onLoad = (pages: TablePaginationConfig, params: any): void => {
    setTableLoading(true)
    getTemplatepage(pages, params).then((res: any) => {
      setPages({
        ...pages,
        total: res.result.total,
      })
      setTableData(res.result.records)
      setTableLoading(false)
    }).catch(() => {
      setTableLoading(false)
    })
  }
  useEffect(() => {
    getMajorClass().then((res: any) => {
      setMajorClass(res.result.eaProjectbEntityList)
    })
    getSubclass().then((res: any) => {
      setSubClass(res.result.eaProjectsEntityList)
      onLoad(pages, queryParams)
    })
  }, [])
  const handleUpdate = (record: TemplateItem): void => {
    setModalTitle("编辑")
    setModalVisible(true)
    const major: string|undefined = subClass.find((ele: SubClass) => ele.oid === record.eaProjectsOid)?.eaProjectpoid
    if(major) {
      const arr: Array<SubClass> = []
      subClass.forEach((ele: SubClass) => {
        if (ele.eaProjectpoid === major) {
          arr.push(ele)
        }
      })
      setModalSubClass(arr)
      modalForm.setFieldsValue({
        ...record,
        address: (record.address === null || record.address === '') ? '' : Number(record.address),
        major
      })
      setModalFormData({...record})
    }
  }
  const handleDelete = (record: TemplateItem): void => {
    setDeleteModalVisible(true)
    setDeleteModalContent(`确认删除 ${record.valueSense} ？`)
    setDeleteOid(record.oid)
  }
  const columns = [
    {
      title: '类别',
      dataIndex: 'eaProjectsOid',
      render: (value: any, record: TemplateItem, index: number) => {
        const i: SubClass|undefined = subClass.find((ele: SubClass) => ele.oid === value)
        if (i) {
          return (
            <div>{i.projectsname}</div>
          )
        }else {
          return (
            <div>{record.eaProjectsOid}</div>
          )
        }
        
      }
    },
    {
      title: '名称',
      dataIndex: 'valueSense'
    },
    {
      title: '省份',
      dataIndex: 'address',
      render: (value: any, record: TemplateItem) => {
        if (value) {
          const item = province[Number(value)]
          return (
            <span>{item}</span>
          )
        }else {
          return null
        }
        
      }
    },
    {
      title: '工作阶段',
      dataIndex: 'phase',
      render: (value: any) => {
        if (value === '0') {
          return (
            <span>新建</span>
          )
        }else {
          return (
            <span>后评价</span>
          )
        }
      }
    },
    {
      title: '最大值',
      dataIndex: 'maxValue'
    },
    {
      title: '最小值',
      dataIndex: 'minValue'
    },
    {
      title: '默认值',
      dataIndex: 'valueDemo'
    },
    {
      title: '操作',
      render: (value: any, record: TemplateItem) => {
        return (
          <div className="btn-wrapper">
            <Button type="primary" onClick={() => {handleUpdate(record)}}>编辑</Button>
            <Button danger type="primary" onClick={() => {handleDelete(record)}}>删除</Button>
          </div>
        )
      }
    }
  ]

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
  const handleSearch = (): void => {
    form.validateFields().then((value: Store) => {
      setQueryParams(value)
      setPages({
        current: 1,
        pageSize: 10,
        total: 0,
      })
      onLoad({
        current: 1,
        pageSize: 10,
        total: 0,
      }, value)
    })
  }

  const handleAddTemplate = (): void => {
    setModalTitle('新增')
    setModalVisible(true)
  }
  const modalClose = (): void => {
    modalForm.resetFields()
    setModalFormData({
      eaProjectsOid: '',
      maxValue: '',
      minValue: '',
      oid: '',
      valueCode: '',
      valueDemo: '',
      valueSense: '',
      address: '',
      phase: '',
    })
  }
  const handleModalCancel = (): void => {
    modalClose()
    setModalVisible(false)
  }
  const handleModalOK = (): void => {
    try {
      modalForm.validateFields().then(async (value: any) => {
        let data: TemplateItem = {...value}
        data.address = data.address !== undefined ? data.address : ''
        
        if (modalTitle === '编辑') {
          data = {
            ...modalFormData,
            ...data
          }
        }
        setConfirmLoading(true)
        const res: any = await getTemplatepage({pageSize: 2, current: 1}, {valueSense: data.valueSense, address: data.address})  
        const temp: TemplateItem = res.result.records.find((ele: TemplateItem) => ele.valueSense === data.valueSense && ele.eaProjectsOid === data.eaProjectsOid)
        if (temp && modalTitle === '新增') {
          modalForm.setFields([
            {
              errors: ['存在重名'],
              name: 'valueSense'
            }
          ])
          setConfirmLoading(false)
        }else if (temp && temp.oid !== modalFormData.oid) {
          modalForm.setFields([
            {
              errors: ['存在重名'],
              name: 'valueSense'
            }
          ])
          setConfirmLoading(false)
          
        }else {
          saveTemplate(data).then((res: any) => {
            setConfirmLoading(false)
            setModalVisible(false)
            modalClose()
            onLoad(pages, queryParams)
          })
        }
      })
    } catch (error) {
      setConfirmLoading(false)
      console.log(error)
    }
  }
  const handleModalMajorChange = (value: any): void => {
    const arr: Array<SubClass> = []
    subClass.forEach((ele: SubClass) => {
      if (ele.eaProjectpoid === String(value)) {
        arr.push(ele)
      }
    })
    modalForm.resetFields(['eaProjectsOid'])
    setModalSubClass(arr)
  }
  const handleTableChange = (pagination: TablePaginationConfig): void => {
    setPages({
      ...pagination
    })
    onLoad(pagination, queryParams)
  }
  return (
    <div className="templatePage">
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
        <Form.Item 
          label="项目小类" 
          name="eaProjectsOid"
        >
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
        <Form.Item label="名称" name="valueSense">
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={handleSearch}>搜索</Button>
        </Form.Item>
      </Form>
      <div style={{padding: '0 0 15px 15px'}}>
        <Button onClick={handleAddTemplate} type="primary">新增</Button>
      </div>
      <Table
        dataSource={tableData}
        columns={columns}
        loading={tableLoading}
        pagination={pages}
        onChange={handleTableChange}
        bordered
      >

      </Table>
      <Drawer
        title={modalTitle}
        visible={modalVisible}
        width="500px"
        footer={
          <div
           style={{
             textAlign: 'right'
           }}
          >
            <Button onClick={handleModalCancel}>取消</Button>
            <Button onClick={handleModalOK} type="primary" style={{marginLeft: 10}} loading={confirmLoading}>确认</Button>
          </div>
        }
        // onCancel={handleModalCancel}
        // onOk={handleModalOK}
        // afterClose={modalClose}
        // confirmLoading={confirmLoading}
      >
        <Form form={modalForm}>
            <Row>
              <Col span={12}>
                <Form.Item label="大类" name="major">
                  <Select
                    onChange={handleModalMajorChange}
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
              </Col>
              <Col span={12}>
                <Form.Item 
                  label="小类" 
                  name="eaProjectsOid"
                  rules={[
                    {
                      required: true,
                      message: "小类为必填项"
                    },
                  ]}
                >
                  <Select
                    onChange={handleMajorChange}
                    allowClear={true}
                  >
                    {
                      modalSubClass.map((ele: SubClass) => {
                      return (
                        <Select.Option key={ele.oid} value={ele.oid}>
                          {ele.projectsname}
                        </Select.Option>
                      ) 
                      })
                    }
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Form.Item 
              label="省份" 
              name="address"
            >
              <Select allowClear>
                {
                  province.map(((ele: string, index: number) => {
                    return (
                      <Select.Option
                        value={index}
                        key={index}
                      >
                        {ele}
                      </Select.Option>
                    )
                  }))
                }
              </Select>
            </Form.Item>
            <Form.Item
              label="工作阶段"
              name="phase"
            >
              <Select allowClear>
                <Select.Option
                  value={'0'}
                >
                  新建
                </Select.Option>
                <Select.Option
                  value={'1'}
                >
                  后评价
                </Select.Option>
              </Select>
            </Form.Item>
            <Form.Item 
              label="中文名" 
              name="valueSense"
              rules={[
                {
                  required: true,
                  message: "中文名为必填项"
                }  
              ]}
            >
              <Input/>
            </Form.Item>
            <Form.Item
              label="code"
              name="valueCode"
              rules={[
                {
                  required: true,
                  message: "code为必填项"
                }
              ]}
            >
              <Input/>
            </Form.Item>
            <Form.Item label="最大值" name="maxValue">
              <Input/>
            </Form.Item>
            <Form.Item label="最小值" name="minValue">
              <Input/>
            </Form.Item>
            <Form.Item label="默认值" name="valueDemo">
              <Input/>
            </Form.Item>
        </Form>
      </Drawer>
      <Modal
        title="删除"
        visible={deleteModalVisible}
        onCancel={() => {setDeleteModalVisible(false)}}
        onOk={() => {
          setDeleteConfirmLoading(true)
          deleteTemplate(deleteOid).then((res: any) => {
            setDeleteModalVisible(false)
            message.success('删除成功')
            onLoad(pages, queryParams)
            setDeleteConfirmLoading(false)
          }).catch(() => {
            setDeleteModalVisible(false)
            message.warning('删除失败')
            setDeleteConfirmLoading(false)
          })
        }}
        okText="确认"
        cancelText="取消"
        confirmLoading={deleteConfirmLoading}
      >
        <div>{deleteModalContent}</div>
      </Modal>
    </div>
  )
}

export default TemplatePage