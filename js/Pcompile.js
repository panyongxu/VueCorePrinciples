// 用法 new Compile(el, vm)
class Compile {
  constructor(el) {
    this.$el = document.querySelector(el);
    
    if (this.$el) {
      // 遍历所有节点
      this.$fragment = this.node2Fragment(this.$el)
      
      // 执行编译
      this.compile(this.$fragment)
      // 编译完的结果追加到 this.$el
      this.$el.appendChild(this.$fragment)
    }

  }
  node2Fragment(el) {
    // 先创建一个内容片段
    
    const frag = document.createDocumentFragment()
    // 把el中的所有子元素搬家到frag
    let child;
    while ((child = el.firstChild)) {
      frag.appendChild(child)
    }
    return frag
  }
  compile(el) {
    const childNodes = el.childNodes
    
    // 遍历所有元素
    Array.from(childNodes).forEach(node => {
      
      // 判断是否为元素节点
      if (this.isElement(node)) {
        // console.log('编译元素'+item.nodeName);
        // 查找所有属性
        const nodeAttrs = node.attributes
        Array.from(nodeAttrs).map((attr,index) => {
          console.log(attr,index);
          
        })
      } else {
        
      }

    })
  }
  // 元素节点验证
  isElement(node) {
    return node.nodeType == 1
  }
}