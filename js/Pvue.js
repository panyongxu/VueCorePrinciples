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
        })
    }
    // 添加 deﬁneProperty  
    defineReactive(data, key, value) {
        console.log(typeof value);
        
        var vm = this;
        Object.defineProperty(data, key, {
            get() {
                return value
            },
            set(newVal) {
                if(newVal === value) {
                    return
                }
                value = newVal
            }
        })
    }
}