$(function () {
  // 点击了“选择图片”的按钮
  $('#btnChooseImg').on('click', function () {
    // 模拟点击行为
    $('#file').click()
  })

  // 监听文件选择框的 change 事件
  let file = null
  $('#file').on('change', function (e) {
    // 1. 获取到用户选择的文件列表（伪数组）
    const files = e.target.files
    // 2. 判断用户是否选择了文件（伪数组的长度）
    if (files.length === 0) {
      // 如果用户没有选择文件，则把 file 重置为 null
      file = null
      return
    }
    // 为全局的 file 文件赋值
    file = files[0]
    // 3. 如果用户选择了图片，则把图片渲染到页面的 img 标签中
    // 3.1 URL.createObjectURL() 函数接收一个文件，返回值是这个文件的 URL 地址
    const imgURL = URL.createObjectURL(files[0])
    $('#image').attr('src', imgURL)
  })

  // 点击了“上传头像”的按钮
  $('#btnUploadImg').on('click', function () {
    if (!file) {
      layer.msg('请先选择要上传的头像！')
      return
    }
    // 1. 把用户选择的图片文件，转为 base64 格式
    // 2. 调用 axios 发起请求，上传头像
    // 3. 如果头像上传成功了，则应该更新父页面（index）中用户的头像
    const fr = new FileReader()
    // fr.readAsDataURL(要读取的文件)
    fr.readAsDataURL(file)
    // 监听文件读取完成的 load 事件
    fr.addEventListener('load', function () {
      // 1. 发起请求上传头像
      // 2. 如果上传成功了，则提示用户
      // 3. 需要更新父页面中，用户的基本信息
      axios.patch('/my/update/avatar', {
        avatar: fr.result
      }).then(({ data: res }) => {
        if (res.code === 0) {
          layer.msg('更新头像成功！', { icon: 1 })
          window.parent.initUserInfo()
        }
      })
    })
  })
})
