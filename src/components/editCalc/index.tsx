import React, { useEffect, useState, forwardRef, useImperativeHandle, FC } from 'react'
import BraftEditor, { ControlType } from 'braft-editor'
import { ContentUtils } from 'braft-utils'
import 'braft-editor/dist/index.css'
import { Modal, Button } from 'antd'
import { AlgorithModal } from '../../page/home/type'
import './index.less'
const entityExtension = {
  // 指定扩展类型
  type: 'entity',
  // 指定扩展的entity名称，推荐使用全部大写，内部也会将小写转换为大写
  name: 'KEYBOARD-ITEM',
  // 指定entity的mutability属性，可选值为MUTABLE和IMMUTABLE，表明该entity是否可编辑，默认为MUTABLE
  mutability: 'IMMUTABLE',
  // 指定entity在编辑器中的渲染组件
  component: (props: any) => {
    // 通过entityKey获取entity实例，关于entity实例请参考https://github.com/facebook/draft-js/blob/master/src/model/entity/DraftEntityInstance.js
    const entity = props.contentState.getEntity(props.entityKey)
    // 通过entity.getData()获取该entity的附加数据
    const { foo } = entity.getData()
    return <span data-foo={foo} className="keyword">{props.children}</span>
  },
  // 指定html转换为editorState时，何种规则的内容将会转换成该entity
  importer: (nodeName: any, node: any, source: any) => {
    // source属性表明输入来源，可能值为create、paste或undefined
    console.log(source, nodeName, node)
    if (nodeName.toLowerCase() === 'span' && node.classList && node.classList.contains('keyword')) {
      // 此处可以返回true或者一个包含mutability和data属性的对象
      return {
        mutability: 'IMMUTABLE',
        data: {
          foo: node.dataset.foo
        },
      }
    }
  },
  // 指定输出该entnty在输出的html中的呈现方式
  exporter: (entityObject: any, originalText: any) => {
    // 注意此处的entityObject并不是一个entity实例，而是一个包含type、mutability和data属性的对象
    const { foo } = entityObject.data
    return <span data-foo={foo} className="keyword">{originalText}</span>
  }
}


// 加载扩展模块
BraftEditor.use(entityExtension)

const EditCalc =  forwardRef((props: any, ref: any) => {
  
  const [showModel, setShowModel] = useState<boolean>(false)
  const [editorState, setEditorState] = useState<any>(BraftEditor.createEditorState(null))
  const controls: ControlType|Array<any> = [
    {
      key: 'if',
      text: <b>if</b>,
      type: 'button',
      onClick: () => {
        setEditorState(ContentUtils.insertText(editorState, 'if'))
      }
    },
    {
      key: 'else',
      type: 'button',
      text: <b>else</b>,
      onClick: () => {
        setEditorState(ContentUtils.insertText(editorState, 'else'))
      }
    },
    {
      key: 'return',
      type: 'button',
      text: <b>return</b>,
      onClick: () => {
        setEditorState(ContentUtils.insertText(editorState, 'retrun'))
      }
    },
    {
      key: 'bracket',
      type: 'button',
      text: <b>&#123; &#125;</b>,
      onClick: (val: any, val2: any) => {
        console.log(val, val2)
        setEditorState(ContentUtils.insertText(editorState, '{}'))
      }
    },
  ]
  useImperativeHandle(ref, (): AlgorithModal => ({
    open: () => {
      setShowModel(true)
      console.log(props)
      if (props.data && props.data.calculateExp) {
        const text = props.data.calculateExp.replace(/(if)|(else)|(return)/g, (word: string) => {
          if (word) {
            return `<span class="keyword">${word}</span>`
          }
        })
        setEditorState(BraftEditor.createEditorState(text))
      }
    }
  }))
  const handleOk = () => {
    setShowModel(false)
    if (props.submit) {
      props.submit()
    }
  }
  const handleCancel = () => {
    setShowModel(false)
    if (props.close) {
      props.close()
    }
  }
  const handleChange = (editorState: any) => {
    setEditorState(editorState)
  }
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
      <BraftEditor
        value={editorState}
        controls={controls}
        onChange={handleChange}
      />
    </Modal>
    </div>
  )
})

export default EditCalc