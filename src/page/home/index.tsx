import React, { useState, useEffect } from 'react'
import { Table, Button, Row } from 'antd'
const Home:React.FC<any> = (prop: any) => {
  const dataSource = [
    {
      key: '1',
      name: '胡彦斌',
      age: 32,
      address: '西湖区湖底公园1号',
    },
    {
      key: '2',
      name: '胡彦祖',
      age: 42,
      address: '西湖区湖底公园1号',
    },
  ]
  
  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '住址',
      dataIndex: 'address',
      key: 'address',
    },
  ]
  return (
    <div>
      <Row className="btn-wrapper">
        <Button type="primary">新增</Button>
        <Button type="primary">修改</Button>
        <Button type="dashed">删除</Button>
        <Button type="primary">配置算法</Button>
      </Row>
      <Table dataSource={dataSource} columns={columns}></Table>
    </div>
  )
}

export default Home