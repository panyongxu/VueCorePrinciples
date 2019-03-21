// 依赖收集 管理Wather
export default class Dep {
  constructor() {
    this.deps = []
  }
  // 添加依赖
  addDep(dep) {
    this.deps.push(dep)
  }
  // 移除依赖
  remove () {
    this.deps.shift()
  }
  // 触发更新
  notify () {
    this.deps.map( dep => dep.update())
  }
}