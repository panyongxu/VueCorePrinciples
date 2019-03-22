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
         
          const attrName = attr.name //属性名
          const attrValue = attr.value  //属性值
          console.log(attrName,attrValue);
          if(this.isAttrNameDirective(attrName)) {
            const dir = attrName.substring(2)
            // 根据数据更新
            this[dir]
            // this[dir] && this[dir](node, this.$vm, exp);
          }
          if(this.isEvent(attrName)) {
            const event =  attrName.substring(1)
            // 添加事件
          }
          
        })
      }
      // if(isTextAndInterpolation(node)) {
      //   this.compileText(node);
      // }
      // 递归子节点
      if (node.childNodes && node.childNodes.length > 0) {
        this.compile(node);
      }

    })
  }
  compileText(node) {
    // console.log(RegExp.$1);
    this.update(node, this.$vm, RegExp.$1, "text");
  }
  // 元素节点验证
  isElement(node) {
    return node.nodeType == 1
  }
  // 验证是否属于text节点 且 为 {{}} 格式
  isTextAndInterpolation(node) {
    return node.nodeType == 3 && /\{\{(.*)\}\}/.test(node.textContent)
  }
  // 属性名验证 p- 开头
  isAttrNameDirective(attrName) {
    return attrName.indexOf('p-') == 0
  }
  // 验证 @开头
  isEvent(attrName) {
    return attrName.indexOf('@') == 0
  }
  

}