$(function () {
  // 点击“去注册”链接
  $('#link-reg').on('click', function () {
    // 1. 展示“注册”
    $('.reg-box').show()
    // 2. 隐藏“登录”
    $('.login-box').hide()
  })

  // 点击“去登录”链接
  $('#link-login').on('click', function () {
    // 1. 展示“登录”
    $('.login-box').show()
    // 2. 隐藏“注册”
    $('.reg-box').hide()
  })

  // 使用 layui.form.verify() 函数，自定义校验规则
  layui.form.verify({
    // 键: 值
    // 自定义校验规则的名字: 自定义的校验规则
    // uname: [正则, 错误提示]
    uname: [/^[a-zA-Z0-9]{1,10}$/, '用户名必须是1-10位的字母和数字'],
    pwd: [/^\S{6,15}$/, '密码必须是6-15位的非空字符'],
    // 判断两次密码是否一致的规则
    repwd: function (value) {
      // 注意：形参中 value 是“确认密码框”的值
      // 应该和“密码框”的值进行对比
      const pwd = $('.reg-box [name="password"]').val()
      if (value !== pwd) {
        // 校验不通过
        return '两次密码不一致！'
      }
    }
  })

  // 监听注册表单的 submit 事件
  $('.reg-box form').on('submit', function (e) {
    // 阻止表单的默认提交行为
    e.preventDefault()

    // 1. 发起 POST 请求
    // 2. 判断是否请求成功
    // 3. 提示用户注册成功
    // 4. 隐藏“注册”，展示“登录”
    axios.post('/api/reg', $(this).serialize()).then(({ data: res }) => {
      if (res.code === 0) {
        // 成功
        layer.msg('注册成功，请登录！')
        // 模拟元素的点击行为
        $('#link-login').click()
      } else {
        // 失败
        layer.msg(res.message)
      }
    })
  })

  // 监听登录表单的 submit 事件
  $('.login-box form').on('submit', function (e) {
    e.preventDefault()

    // 发起 POST 请求，进行登录
    axios.post('/api/login', $(this).serialize()).then(({ data: res }) => {
      if (res.code === 0) {
        // 登录成功
        layer.msg('登录成功！')
        // 把 token 的值存储到本地
        localStorage.setItem('token', res.token)
        // 跳转到后台主页
        location.href = '/index.html'
      } else {
        // 登录失败
        layer.msg('登录失败！')
        // 移除 token
        localStorage.removeItem('token')
      }
    })
  })
})
