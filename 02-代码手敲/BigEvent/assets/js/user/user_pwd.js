$(function () {
  // 自定义校验规则
  layui.form.verify({
    // 验证密码框内容长度的规则
    pwd: [/^\S{6,15}$/, '密码必须是6-15位的非空字符'],
    // 验证新密码不能等于原密码的规则
    samePwd: function (value) {
      // 获取“原密码”的值
      const pwd = $('[name="old_pwd"]').val()
      // 判断新旧密码是否一致
      if (value === pwd) {
        return '新旧密码不能一致！'
      }
    },
    // 验证两次新密码是否一致的规则
    rePwd: function (value) {
      // 获取“新密码”的值
      const newPwd = $('[name="new_pwd"]').val()
      // 判断两次输入的新密码是否一致
      if (value !== newPwd) {
        return '两次输入的新密码不一致！'
      }
    }
  })

  // 监听表单的 submit 事件
  $('#formUpdatePwd').on('submit', function (e) {
    // 阻止表单的默认提交行为
    e.preventDefault()

    // 使用 axios 发起请求，修改用户的密码
    axios.patch('/my/updatepwd', $(this).serialize()).then(({ data: res }) => {
      if (res.code === 0) {
        // 更新密码成功！
        layer.msg('更新密码成功！', { icon: 1 })
      } else {
        // 更新密码失败！
        layer.msg(res.message, { icon: 2 })
      }

      // 不论更新成功还是失败，都要重置表单
      $('[type="reset"]').click()
    })
  })
})
