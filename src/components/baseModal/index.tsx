import React, {forwardRef, useState, useImperativeHandle, useEffect} from 'react'
import { Modal, Button, Form, Select, Input, Row, Col } from 'antd'
import './index.less'
import { MajorClass, SubClass } from '@page/home/type'
import { BaseModalProps } from './type'
import { useForm } from 'antd/lib/form/Form'

const BaseModal = forwardRef((props: BaseModalProps, ref: any) => {
  const [visible, setVisible] = useState<boolean>(false)
  const [activeSubClass, setActiveSubClass] = useState<Array<SubClass>>([])
  const [form] = Form.useForm()
  useImperativeHandle(ref, () => ({
    open: () => {
      setVisible(true)
    },
    close: () => {
      setVisible(false)
    },
    restForm: () => {
      form.resetFields()
    }
  }))
  const handleMajorChange = (value: any) => {
    const arr: Array<SubClass> = []
    props.subClass.forEach((ele: SubClass) => {
      if (ele.eaProjectpoid === value) {
        arr.push(ele)
      }
    })
    setActiveSubClass(arr)
    form.resetFields(['eaProjectsOid'])
  }
  useEffect(() => {
    if (props.data) {
      const majorId: string|undefined = props.subClass.find((ele: SubClass) => ele.oid === props.data?.eaProjectsOid)?.eaProjectpoid
      handleMajorChange(majorId)
      form.setFieldsValue({
        ...props.data,
        major: majorId,
      })
      
    }
    
  }, [props.data])
  const handleCancel = () => {
    setVisible(false)
  }
  const handleOk = () => {
    form.validateFields().then((value: any) => {
      props.submit(value)
    })
  }
  
  return (
    <div>
      <Modal
        title={props.title}
        visible={visible}
        width='50%'
        onCancel={handleCancel}
        onOk={handleOk}
      >
        <Form labelAlign="left" form={form}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="major" label="大类">
                <Select
                  onChange={handleMajorChange}
                  allowClear={true}
                >
                {
                  props.majorClass.map((ele: MajorClass) => {
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
              <Form.Item name="eaProjectsOid" label="小类" rules={[{required: true, message: "请选择小类"}]}>
                <Select
                  allowClear={true}
                >
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
            </Col>
          </Row>
          <Form.Item name="indexCode" label="指标编号" rules={[{required: true, message: "请输入指标编号"}]} >
            <Input disabled={props.type === 'add' ? false : true}/>
          </Form.Item>
          <Form.Item name="indexName" label="指标名称" rules={[{required: true, message: "请输入指标名称"}]}>
            <Input/>
          </Form.Item>
          <Form.Item name="orderNo" label="排序号" rules={[{required: true, message: "请输入排序号"}]}>
            <Input type="number"/>
          </Form.Item>
          <Form.Item name="indexUnit" label="指标单位">
            <Input/>
          </Form.Item>
          <Form.Item name="remark" label="备注">
            <Input/>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
})

export default BaseModal