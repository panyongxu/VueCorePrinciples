class Compile {
    constructor(el, vm) {
        this.$el = document.querySelector(el)
        this.$vm = vm
        // 模板移动到文档片段
        this.$fragment = this.node2Fragment(this.$el)
        // 编译
        this.compile(this.$fragment)

        this.$el.appendChild(this.$fragment)


        // 运行created生命周期
        this.$vm.$options.created && this.$vm.$options.created.call(this.$vm)
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
        })

    }
    compileText(node) {
        // 拿取到文本标签里的{{xxx}}

        console.log(RegExp.$1); // {{...}}
        console.log(this.$vm[RegExp.$1]);
        node.textContent = this.$vm[RegExp.$1]
    }
    text(node, key) {
        node.innerText = this.$vm[key]
    }
    html(node, key) {
        node.innerHTML = this.$vm[key]
    }
    model(node, key) {
        node.value = this.$vm[key]
        node.addEventListener('change', () => {
            this.$vm[key] = node.value
        })
    }
}