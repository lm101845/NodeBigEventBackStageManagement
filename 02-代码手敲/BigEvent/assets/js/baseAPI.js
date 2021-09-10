// 封装请求的根路径
axios.defaults.baseURL = 'http://www.liulongbin.top:3008'

// 声明请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // 形参中的 config，是每次请求时候的配置选项，里面记录着这次请求对应的：
  // method、url、根路径、headers 请求头
  if (config.url.indexOf('/my') !== -1) {
    // 如果请求的 URL 地址中，包含 /my 则为当前的请求头添加 Authorization 字段
    config.headers.Authorization = localStorage.getItem('token')
  }

  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})
