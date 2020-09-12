export const traversalDFSDOM = (rootDom: HTMLElement|Element, callback: Function): HTMLElement|Element => {
  console.log(rootDom)
  // if(!rootDom)return;
  if(rootDom.children.length==0){
      // arr.push(rootDom)//没有孩子节点，表示是个叶子节点，将节点push到数组中
      callback(rootDom)
      // return;
  }
  // callback(rootDom)//非孩子节点，在每次遍历它的孩子节点之前先把它push到数组中
  for(let i=0;i<rootDom.children.length;i++){
      traversalDFSDOM(rootDom.children[i], callback)//递归调用
  }
  return rootDom
}