$(function () {
  // 为退出登录按钮绑定点击事件
  $('.logout').on('click', function () {
    // 1. 询问用户是否要退出登录
    // 2. 如果用户确认退出了：
    // 2.1 清空 token
    // 2.2 跳转到登录页面
    layer.confirm('确认退出登录吗?', { icon: 3, title: '提示' }, function (index) {
      //do something
      localStorage.removeItem('token')
      location.href = '/login.html'

      // 关闭弹出层
      layer.close(index)
    })
  })

  // 调用获取用户信息的函数
  initUserInfo()
})

function test() {
  console.log('触发了 test 函数')
}

// 封装获取用户基本信息的函数
function initUserInfo() {
  // 产生 401 响应状态码的两种情况：
  // 1. 没有把 token 发给服务器
  // 2. 给服务器发送了一个假 token

  // Promise.prototype.then(成功的回调, 失败的回调)
  // 在 .then 函数中，失败的回调可以被省略不写
  axios.get('/my/userinfo').then(({ data: res }) => {
    // console.log('成功了！')
    // console.log(res)
    // 调用渲染用户信息的函数
    renderUserInfo(res.data)
  }, (error) => {
    console.log('失败了！')
    console.dir(error)
    // 1. 判断“响应状态码”是否等于 401
    // 2. 如果是，则清空 token，并跳转到“登录页”
    if (error.response.status === 401) {
      localStorage.removeItem('token') // 清空“假”token
      location.href = '/login.html'
    }
  })
}

// 封装渲染用户信息的函数
function renderUserInfo(data) {
  // console.log(data)
  const name = data.nickname || data.username
  const textAvatar = name.charAt(0).toUpperCase()
  // 渲染头部区域的用户信息
  // 判断用户，是否有图片的头像，如果有，执行 if；否则，执行 else
  if (data.user_pic) {
    // 有图片的头像
    $('#header-avatar').html(`<img src="${data.user_pic}" class="layui-nav-img">
      个人中心`)
  } else {
    // 没有图片的头像，应该渲染“文本头像”
    $('#header-avatar').html(`<div class="text-avatar">${textAvatar}</div>
      个人中心`)
  }

  // 渲染侧边栏的用户信息
  if (data.user_pic) {
    // 渲染图片头像
    $('.user-info-box').html(`<img src="${data.user_pic}" class="layui-nav-img">
      <span class="welcome">&nbsp;欢迎&nbsp; ${name}</span>`)
  } else {
    // 渲染文本头像
    $('.user-info-box').html(`<div class="text-avatar">${textAvatar}</div>
      <span class="welcome">&nbsp;欢迎&nbsp; ${name}</span>`)
  }

  // 在页面元素动态生成好之后，调用 layui 提供的 element.render() 函数
  // 重新渲染指定区域的效果
  layui.element.render('nav', 'header-nav')
}

// 定义切换高亮的函数
function highlight(kw) {
  console.log('index 页面中的 highlight 函数被调用了！')
  $('dd').removeClass('layui-this')
  $(`dd:contains("${kw}")`).addClass('layui-this')
}
