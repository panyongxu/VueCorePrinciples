class Compile {
    constructor(el, vm) {
        this.$el = document.querySelector(el)
        this.$vm = vm
        // 模板移动到文档片段
        this.$fragment = this.node2Fragment(this.$el)
        // 编译
        this.compile(this.$fragment)

        this.$el.appendChild(this.$fragment)



    }
    node2Fragment(el) {
        const fragment = document.createDocumentFragment()
        let firstNode
        while (firstNode = el.firstChild) {
            fragment.appendChild(firstNode)
        }
        return fragment
    }
    compile(el) {
        const nodes = el.childNodes
        Array.from(nodes, (node) => {
            // 标签
            if (node.nodeType === 1) {
                this.compileElement(node)
            }
            // 文本 
            else if (this.isInter(node)) {
                this.compileText(node)
            }

            if (node.children && node.childNodes.length > 0) {
                this.compile(node)
            }
        })
    }

    isInter(node) {
        return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent)
    }
    compileElement(node) {
        const nodeAttrs = node.attributes;
        Array.from(nodeAttrs, (nodeAttr) => {
            // 获取到标签内的属性名以及属性值
            const attrName = nodeAttr.name
            const attrValue = nodeAttr.value

            if (attrName.includes('p-')) {
                const dir = attrName.substring(2)
                this[dir] && this[dir](node, attrValue)
            }
            if (attrName.includes('@')) {
                const dir = attrName.substring(1)
                this[dir] && this[dir](node, attrValue)
            }
        })

    }
    compileText(node) {
        // 拿取到文本标签里的{{xxx}}

        // console.log(RegExp.$1); // {{...}}
        // console.log(this.$vm[RegExp.$1]);
        // node.textContent = this.$vm[RegExp.$1]
        this.update(node, RegExp.$1, 'text')
    }
    update(node, key, dir) {
        const updator = this[dir + 'Updator']
        updator && updator(node, this.$vm[key])

        new Wather(this.$vm, key, (value) => {
            updator && updator(node, value)
        })
    }
    eventListener(node, key, type) {
        const options = this.$vm.$options
        // 处理this指向问题
        const eventFn = options.methods[key].bind(this.$vm)

        eventFn && this.addEventListener(node, type, eventFn)

    }
    textUpdator(node, value) {
        node.textContent = value
    }

    htmlUpdator(node, value) {
        node.innerHTML = value
    }
    modelUpdator(node, value) {
        node.value = value

    }
    text(node, key) {
        this.update(node, key, 'text')
    }

    html(node, key) {
        this.update(node, key, 'html')
    }
    model(node, key) {
        this.update(node, key, 'model')
        node.addEventListener('input', () => {
            this.$vm[key] = node.value
        })
    }
    click(node, key) {
        this.eventListener(node, key, 'click')
    }
    dblclick(node, key) {
        this.eventListener(node, key, 'dblclick')
    }
    addEventListener(node, key, fn) {
        node.addEventListener(key, fn)
    }
}