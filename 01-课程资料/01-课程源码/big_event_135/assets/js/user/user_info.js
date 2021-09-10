$(function () {
  // 封装获取用户基本信息的函数
  function initUserInfo() {
    // 基于 axios 发起请求，获取用户的信息
    axios.get('/my/userinfo').then(({ data: res }) => {
      console.log(res)
      // 使用 layui 的 API，快速为表单赋值
      layui.form.val('user-form', res.data)
    })
  }

  initUserInfo()

  // 自定义校验规则
  layui.form.verify({
    // 昵称的校验规则
    nickname: [/^\S{1,10}$/, '昵称必须是1-10位的非空字符']
  })

  // 监听表单的提交行为
  $('[lay-filter="user-form"]').on('submit', function (e) {
    e.preventDefault()

    // 获取表单数据，把数据发给服务器
    const data = $(this).serialize()
    axios.put('/my/userinfo', data).then(({ data: res }) => {
      if (res.code === 0) {
        // 更新用户资料成功！
        layer.msg('更新用户资料成功！')
        // 让 index.html 页面，重新调用 initUserInfo() 函数
        window.parent.initUserInfo()
      }
    })
  })

  // 阻止重置按钮的默认行为
  $('[type="reset"]').on('click', function (e) {
    // 阻止重置按钮的默认行为
    e.preventDefault()
    // 重新请求用户的信息，并填充到表单中即可
    initUserInfo()
  })
})
