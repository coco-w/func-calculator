import React, { useState, forwardRef, useImperativeHandle, useRef } from 'react'
import BraftEditor, { ControlType } from 'braft-editor'
import { ContentUtils } from 'braft-utils'
import 'braft-editor/dist/index.css'
import { Modal, Select, message, Row, Col, Input } from 'antd'
import { AlgorithModal, funItem } from '../../page/home/type'
import { getBaseIndex, getFunction } from '../../api/index'
import { IBaseIndex, IFunction } from './type'
import './index.less'
import { SelectValue } from 'antd/lib/select'
import { traversalDFSDOM } from '@/utils'

const EditCalc = forwardRef((props: any, ref: any) => {
  const instance = useRef<any>(null)
  const [showModel, setShowModel] = useState<boolean>(false)
  const [editorState, setEditorState] = useState<any>(BraftEditor.createEditorState(null))
  const [baseIndexVisible, setBaseIndexVisible] = useState<boolean>(false)
  const [baseIndexData, setBaseIndexData] = useState<Array<IBaseIndex>>([])
  const [baseIndexValue, setBaseIndexValue] = useState<SelectValue>('')
  const [functionArr, setFunctionArr] = useState<Array<IFunction>>([])
  const [functionVisible, setFunctionVisible] = useState<boolean>(false)
  const [functionValue, setFunctionValue] = useState<SelectValue>('')
  const [previewVisible, setPreviewVisible] = useState<boolean>(false)
  const [previewHTML, setPreviewHTML] = useState<string>('')
  const [timer, setTimer] = useState<any>(null)
  const [searchBaseIndexValue, setSearchBaseIndexValue] = useState<string>('')
  const [searchFunctionValue, setSearchFunctionValue] = useState<string>('')
  const controls: ControlType|Array<any> = [
    {
      key: 'if',
      text: <b>if</b>,
      type: 'button',
      onClick: (): void => {
        setEditorState(ContentUtils.insertHTML(editorState, '<span data-foo="keyword" class="keyword">if</span>'))
      }
    },
    {
      key: 'else',
      type: 'button',
      text: <b>else</b>,
      onClick: (): void => {
        setEditorState(ContentUtils.insertHTML(editorState, '<span data-foo="keyword" class="keyword">else</span>'))
      }
    },
    {
      key: 'return',
      type: 'button',
      text: <b>return</b>,
      onClick: (): void => {
        setEditorState(ContentUtils.insertHTML(editorState, '<span data-foo="keyword" class="keyword">return</span>'))
      }
    },
    {
      key: 'bracket',
      type: 'button',
      text: <b>&#123; &#125;</b>,
      onClick: (): void => {
        setEditorState(ContentUtils.insertHTML(editorState, '{}'))
      }
    },
    {
      key: 'more',
      type: 'button',
      text: '基础指标',
      onClick: (): void => {
        setBaseIndexVisible(true)
      }
    },
    {
      key: 'func',
      type: 'button',
      text: '函数',
      onClick: (): void => {
        setFunctionVisible(true)
      }
    }
  ]
  
  const entityExtension = {
    // 指定扩展类型
    type: 'entity',
    // 指定扩展的entity名称，推荐使用全部大写，内部也会将小写转换为大写
    name: 'KEYBOARD-ITEM',
    // 指定entity的mutability属性，可选值为MUTABLE和IMMUTABLE，表明该entity是否可编辑，默认为MUTABLE
    mutability: 'IMMUTABLE',
    // 指定entity在编辑器中的渲染组件
    component: (props: any): JSX.Element => {
      // 通过entityKey获取entity实例，关于entity实例请参考https://github.com/facebook/draft-js/blob/master/src/model/entity/DraftEntityInstance.js
      const entity = props.contentState.getEntity(props.entityKey)
      // 通过entity.getData()获取该entity的附加数据
      const { foo } = entity.getData()
      if (foo === 'keyword') {
        return <span data-foo={foo} className="keyword">{props.children}</span>
      }else if (foo === 'value'){
       return <span data-foo={foo} className="value">{props.children}</span>
      }else if (foo === 'function') {
        return <span data-foo={foo} className="function">{props.children}</span>
      }else{
        return <span>{props.children}</span>
      }
      
    },
    // 指定html转换为editorState时，何种规则的内容将会转换成该entity
    importer: (nodeName: any, node: any, source: any): {mutability: string; data?: object}|void => {
      // source属性表明输入来源，可能值为create、paste或undefined
      // console.log(node)
      if (nodeName.toLowerCase() === 'span' && node.classList && node.classList.contains('keyword')) {
        // 此处可以返回true或者一个包含mutability和data属性的对象
        return {
          mutability: 'IMMUTABLE',
          data: {
            foo: node.dataset.foo
          },
        }
      } else if (nodeName.toLowerCase() === 'span' && node.classList && (node.classList.contains('value') || node.classList.contains('value1'))) {
        return {
          mutability: 'IMMUTABLE',
          data: {
            foo: node.dataset.foo
          }
        }
      } else if(nodeName.toLowerCase() === 'span' && node.classList && (node.classList.contains('function') || node.classList.contains('function1'))) {
        return {
          mutability: 'IMMUTABLE',
          data: {
            foo: node.dataset.foo
          }
        }
      }
    },
    // 指定输出该entnty在输出的html中的呈现方式
    exporter: (entityObject: any, originalText: any): JSX.Element => {
      // 注意此处的entityObject并不是一个entity实例，而是一个包含type、mutability和data属性的对象
      const { foo } = entityObject.data
      if (foo === 'keyword') {
        return <span data-foo={foo} className="keyword">{originalText}</span>
      }else if (foo === 'value') {
        return <span data-foo={foo} className="value">{originalText}</span>
      } else if (foo === 'function') {
        return <span data-foo={foo} className="function">{originalText}</span>
      }else if (foo === 'function1') {
        const value: string | undefined = functionArr.find((ele: IFunction) => ele.functionCode === originalText)?.functionName
        if (value) {
          return <span data-foo={foo} className="function">{value}</span>
        } else {
          return <span data-foo={foo} className="function">{originalText}</span>
        }
      }else if (foo === 'value1'){
        const value: string | undefined = baseIndexData.find((ele: IBaseIndex) => ele.pointCode === originalText)?.pointName
        if (value) {
          return <span data-foo={foo} className="value">{value}</span>
        } else {
          return <span data-foo={foo} className="value">{originalText}</span>
        }
      }else {
        return <span>{originalText}</span>
      }
      
    }
  }
  
  
  // 加载扩展模块
  BraftEditor.use(entityExtension)
  const transtionPreview: (a: any) => void = (editorState: any) => {
    console.log('preview')
    const html: string = editorState.toHTML()
    const div: HTMLElement = document.createElement('div')
    div.innerHTML = html
    const previewDOM: HTMLElement|Element = traversalDFSDOM(div, (ele: HTMLElement) => {
      if(ele.className === 'value') {
        const value: string|undefined =  baseIndexData.find((item: IBaseIndex) => item.pointCode === ele.innerText)?.pointName
      if (value) {
        ele.innerText = value
      }
      }else if (ele.className === 'function'){
        const value: string|undefined =  functionArr.find((item: IFunction) => item.functionCode === ele.innerText)?.functionName
        if (value) {
          ele.innerText = value
        }
      }
    })
    
    setPreviewHTML(previewDOM.innerHTML)
  }
  useImperativeHandle(ref, (): AlgorithModal => ({
    open:async (data: funItem) => {
      setShowModel(true)
      Promise.all([getBaseIndex(data.eaProjectsOid), getFunction(data.eaProjectsOid)]).then((res: any) => {
        setBaseIndexData(res[0].result)
        setFunctionArr(res[1].result)
        setEditorState((old: any) => {
          let r: any = null
          if (data.htmlText) {
            r = BraftEditor.createEditorState(data.htmlText)
          }else {
            r = BraftEditor.createEditorState(data.expDesc)
          }
          setTimeout(() => {
            transtionPreview(r)
          }, 10)
          return r
        })
      })
      // getBaseIndex(data.eaProjectsOid).then((res: any) => {
      //   if (res.result) {
      //     setBaseIndexData(res.result)
      //   }
      // })
      // getFunction(data.eaProjectsOid).then((res: any) => {
      //   setFunctionArr(res.result)
      // })
      
    }
  }))
  const handleOk = () => {
    setShowModel(false)
    const text: string = editorState.toText()
    const html: string = editorState.toHTML()
    if (props.submit) {
      props.submit(text, html)
    }
  }
  const handleCancel = () => {
    setShowModel(false)
    setBaseIndexData([])
    setFunctionArr([])
    if (props.close) {
      props.close()
    }
  }
  
  const handleChange = (editorState: any) => {
    // console.log(instance.current.getValue())
    setEditorState(editorState)
    setTimer((old: any) => {
      if (old) {
        clearTimeout(old)
      }else {
        const t: any = setTimeout(() => {
          console.log('111')
          transtionPreview(editorState)
        }, 500)
        return t
      }
    })
    
  }
  const handleBaseIndexModalOk = () => {
    const baseindex: IBaseIndex | undefined = baseIndexData.find((ele: IBaseIndex) => ele.pointName === baseIndexValue)
    if (baseindex) {
      setEditorState(ContentUtils.insertHTML(editorState, `<span data-foo="value" class="value">${baseindex.pointCode}</span>`))
      setTimeout(() => {
        instance.current.forceRender()  
      }, 10)
    }
    setBaseIndexVisible(false)
    setBaseIndexValue('')
  }
  const handleFunctionModalOk = () => {
    const obj: IFunction|undefined = functionArr.find((ele: IFunction) => ele.functionName === functionValue)
    if (obj) {
      setEditorState(ContentUtils.insertHTML(editorState, `<span data-foo="function" class="function">${obj.functionCode}</span>`))
      setTimeout(() => {
        instance.current.forceRender()  
      }, 10)
    }
    setFunctionVisible(false)
    setFunctionValue('')
  }

  const handleFunctionItemClick = (item: IFunction) => {
    setEditorState(ContentUtils.insertHTML(editorState, `<span data-foo="function" class="function">${item.functionCode}</span>`))
    setTimeout(() => {
      instance.current.forceRender()  
    }, 10)
    setFunctionVisible(false)
    setFunctionValue('')
  }
  const handleBaseIndexItemClick = ((item: IBaseIndex) => {
    setEditorState(ContentUtils.insertHTML(editorState, `<span data-foo="value" class="value">${item.pointCode}</span>`))
    setTimeout(() => {
      instance.current.forceRender()  
    }, 10)
    setBaseIndexVisible(false)
    setBaseIndexValue('')
  })
 
  const width = '100%'
  return (
    <div>
      <Modal
        wrapClassName="eidtCalc"
        title="公式编辑器"
        visible={showModel}
        onOk={handleOk}
        onCancel={handleCancel}
        width="100%"
      >
        <Row gutter={12}>
          <Col span={12}>
            <div className="editor">
              <BraftEditor
                ref={instance}
                value={editorState}
                controls={controls}
                onChange={handleChange}
              />
            </div>
          </Col>
          <Col span={12}>
            <div className="preview">
              <div className="bf-controlbar">
                <button className="control-item button" >
                  <b>公式描述</b>
                </button>
              </div>
              <div dangerouslySetInnerHTML={{__html: previewHTML}} style={{padding: 15}}></div>
            </div>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={12}>
            <div className="base">
            <div className="bf-controlbar">
                <button className="control-item button" >
                  <b>基础指数</b>
                </button>
                <Input 
                  value={searchBaseIndexValue}
                  // onChange={(e: any) => setSearchBaseIndexValue(e.target)}
                  onChange={e => setSearchBaseIndexValue(e.target.value)}
                  placeholder="名称或者编号"
                />
              </div>
              <div className="base-index-wrapper">
              {
                baseIndexData.map((item: IBaseIndex, index: number) => {
                  if (searchBaseIndexValue.trim().length > 0) {
                    if ((item.pointCode.indexOf(searchBaseIndexValue) > -1 || item.pointName.indexOf(searchBaseIndexValue) > -1)) {
                      return (
                        <div 
                          className="item"
                          onClick={() => handleBaseIndexItemClick(item)}
                          key={index}
                        >
                          <h4 className="ant-list-item-meta-title">{item.pointName}</h4>
                          <div className="ant-list-item-meta-description">{item.pointCode}</div>
                        </div>
                      )
                    }
                  } else {
                    return (
                      <div 
                        className="item"
                        onClick={() => handleBaseIndexItemClick(item)}
                        key={index}
                      >
                        <h4 className="ant-list-item-meta-title">{item.pointName}</h4>
                        <div className="ant-list-item-meta-description">{item.pointCode}</div>
                      </div>
                    )
                  }
                })
              }
            </div>
              {/* <List
                dataSource={baseIndexData}
                renderItem={item => (
                  <List.Item>
                    <List.Item.Meta
                      title={item.pointName}
                      description={item.pointCode}
                    />
                  </List.Item>
                )}
              /> */}
            </div>
          </Col>
          <Col span={12}>
            <div className="base">
            <div className="bf-controlbar">
              <button className="control-item button" >
                <b>函数</b>
              </button>
              <Input
                value={searchFunctionValue}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchFunctionValue(e.target.value)}
                placeholder="名称或者编号"
              />
            </div>
            <div className="function-wrapper">
              {
                functionArr.map((item: IFunction, index: number) => {
                  if (searchFunctionValue.trim().length > 0) {
                    if (item.functionName.indexOf(searchFunctionValue) > -1 || item.functionCode.indexOf(searchFunctionValue) > -1) {
                      return (
                        <div 
                          className="item"
                          onClick={() => handleFunctionItemClick(item)}
                          key={index}
                        >
                          <h4 className="ant-list-item-meta-title">{item.functionName}</h4>
                          <div className="ant-list-item-meta-description">{item.functionCode}</div>
                        </div>
                      )
                    }
                  } else {
                    return (
                      <div 
                        className="item"
                        onClick={() => handleFunctionItemClick(item)}
                        key={index}
                      >
                        <h4 className="ant-list-item-meta-title">{item.functionName}</h4>
                        <div className="ant-list-item-meta-description">{item.functionCode}</div>
                      </div>
                    )
                  }
                })
              }
            </div>
            {/* <List
                dataSource={functionArr}
                
                renderItem={(item: IFunction) => (
                  <List.Item
                    
                  >
                    <List.Item.Meta
                      title={item.functionName}
                      description={item.functionCode}
                    />
                  </List.Item>
                )}
              /> */}
            </div>
          </Col>
        </Row>
      </Modal>
      <Modal
        title="函数"
        visible={functionVisible}
        onCancel={() => {setFunctionVisible(false)}}
        onOk={handleFunctionModalOk}
        wrapClassName="base-index"
      >
        <Select
          // open={true}
          showSearch={true}
          onChange={(value: SelectValue) => setFunctionValue(value)}
          autoFocus={true}
        >
          {
            functionArr.map((ele: IFunction, index: number) => {
              return (
                <Select.Option
                  value={ele.functionName}
                  key={index}
                >
                  {ele.functionName}
                </Select.Option>
              )
            })
          }
        </Select>
      </Modal>
      <Modal
        title="基础指标"
        visible={baseIndexVisible}
        onCancel={() => {setBaseIndexVisible(false)}}
        onOk={handleBaseIndexModalOk}
        wrapClassName="base-index"
      >
        <Select
          // open={true}
          showSearch={true}
          onChange={(value: SelectValue) => setBaseIndexValue(value)}
          autoFocus={true}
        >
          
          {
            baseIndexData.map((ele: IBaseIndex, index: number) => {
              return (
                <Select.Option
                  value={ele.pointName}
                  key={index}
                >
                  {ele.pointName}
                </Select.Option>
              )
            })
          }
        </Select>
      </Modal>
    </div>
  )
})

export default EditCalc