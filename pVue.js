class Pvue {
    constructor(options) {
        this.$options = options
        this.$data = options.data
        this.observe(this.$data)

        // 运行created生命周期
        this.$options.created && this.$options.created.call(this)
        new Wather(this.$data, 'name', null)
        new Wather(this.$data.fag, 'foo', null)
        new Compile(this.$options.el, this)
    }
    observe(data) {
        if (!data || typeof data !== 'object') {
            return
        }
        Object.keys(data).forEach((key) => {
            this.defineProperty(data, key, data[key])
            this.poxyData(key)
        })
    }
    defineProperty(obj, key, val) {
        const dep = new Dep()
        // 递归遍历
        this.observe(val)
        Object.defineProperty(obj, key, {
            get() {
                Dep.target && dep.addWather(Dep.target)
                return val
            },
            set(newVal) {
                val = newVal
                dep.notify()
            }
        })
    }
    poxyData(key) {
        this.$data[key] && Object.defineProperty(this, key, {
            get() {
                return this.$data[key]
            },
            set(newVal) {
                this.$data[key] = newVal

            }
        })
    }

}


class Wather {
    constructor(vm, key, cb) {
        this.vm = vm
        this.key = key
        this.cb = cb

        Dep.target = this
        this.vm[this.key]
        Dep.target = null
    }

    update() {
        this.cb && this.cb.call(this.vm, this.vm[this.key])
    }
}

class Dep {
    constructor() {
        this.wathers = []
    }
    addWather(wather) {
        this.wathers.push(wather)
    }
    notify() {
        this.wathers.forEach(wather => wather.update())
    }
}