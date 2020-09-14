import { funItem, SubClass, MajorClass } from '@page/home/type'

export interface Title {
  
}
export interface BaseModalProps {
  title: '新增' | '编辑' | '复制' | ''
  data: funItem | undefined | null
  subClass: Array<SubClass>
  majorClass: Array<MajorClass>,
  submit: (value: any) => void,
  type: 'add' | 'update' | 'copy'
}

