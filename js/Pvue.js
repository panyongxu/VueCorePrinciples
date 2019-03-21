// Vue响应式的原理deﬁneProperty 
// 使用 new PVue({...})

class PVue {
    constructor(options) {
        // 整个配置对象保存到实例
        this.$options = options
        this.$data = options.data
        // 给 $data 所有数据进行绑定代理
        this.observer(this.$data)
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
        Object.defineProperty(data, key, {
            get() {
                return item
            },
            set(newVal) {
                if(newVal === item) {
                    return
                }
                item = newVal
                console.log(`${key}数据被更新了`);
                
            }
        })
    }
    proxyData (key) {
        Object.defineProperty(this, key, {
            get () {
                return this.$data[key]
            },
            set(newVal) {
                this.$data[key] = newVal
            }
        })
    }
}

