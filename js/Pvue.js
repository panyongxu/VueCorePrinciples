// import Pdep from './Pdep'
// import Pwatcher from './Pwatcher'

// Vue响应式的原理deﬁneProperty 
// 使用 new PVue({...})

 class PVue {
    constructor(options) {
        // 整个配置对象保存到实例
        this.$options = options
        this.$data = options.data
        // 给 $data 所有数据进行绑定代理
        this.observer(this.$data)
        // new Pwatcher()
        // this.$data.name
        new Compile(options.el, this);
    }
    // 观察者
    observer(data) {
        // 当 data 存在且为对象时
        if (!data || typeof data != 'object') {
            return
        }
        Object.keys(data).map(key => {
            this.defineReactive(data, key, data[key])
            // 把数据代理到实例
            this.proxyData(key)
        })
    }
    // 添加 deﬁneProperty  
    defineReactive(data, key, item) {
        // 循环遍历深层数据
        this.observer(item)
        const dep = new Pdep()
        Object.defineProperty(data, key, {
            get() {
                Pdep.target && dep.addDep(Pdep.target)
                return item
            },
            set(newVal) {
                if (newVal === item) {
                    return
                }
                item = newVal
                dep.notify()
            }
        })   
    }
    proxyData(key) {
        Object.defineProperty(this, key, {
            get() {
                return this.$data[key]
            },
            set(newVal) {
                this.$data[key] = newVal
            }
        })
    }
}

// 依赖收集 管理Wather
class Pdep {
    constructor() {
        this.deps = []
    }
    // 添加依赖
    addDep(dep) {
        this.deps.push(dep)
    }
    // 移除依赖
    remove() {
        this.deps.shift()
    }
    // 触发更新
    notify() {
        this.deps.map(dep => dep.update())
    }
}

// 观察者
class Pwatcher {
    constructor(vm, key, cb) {
        // this.vm = vm;
        // this.key = key;
        // this.cb = cb;
        Pdep.target = this
        // this.vm[this.key]; // 触发getter，添加依赖
        // Pdep.target = null;
    }
    update() {
        console.log('属性更新了');
        // this.cb.call(this.vm, this.vm[this.key]);
    }
}