$(function () {
  initCateList()

  // 封装初始化文章分类的函数
  function initCateList() {
    // 发请求拿数据
    // 把获取到的数据，循环渲染到页面的表格中
    axios.get('/my/cate/list').then(({ data: res }) => {
      const rows = []
      res.data.forEach((item, index) => {
        rows.push(`<tr>
        <td>${index + 1}</td>
        <td>${item.cate_name}</td>
        <td>${item.cate_alias}</td>
        <td>
          <button type="button" class="layui-btn layui-btn-xs btn-edit" data-id="${item.id}">修改</button>
          <button type="button" class="layui-btn layui-btn-danger layui-btn-xs btn-delete" data-id="${item.id}">删除</button>
        </td>
      </tr>`)
      })
      $('tbody').html(rows)
    })
  }

  // 点击按钮，展示添加的弹出层
  let addIndex = null
  $('#btnShowAdd').on('click', function () {
    // console.log($('#template-add').html())
    addIndex = layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '添加文章分类',
      content: $('#template-add').html()
    })
  })

  // 自定义表单的校验规则
  layui.form.verify({
    // 分类名称的校验规则
    name: [/^\S{1,10}$/, '分类名称必须是1-10位的非空字符'],
    // 分类别名的校验规则
    alias: [/^[a-zA-Z0-9]{1,15}$/, '分类别名必须是1-15位的字母和数字']
  })

  // 监听添加表单的 submit 事件
  $('body').on('submit', '#form-add', function (e) {
    e.preventDefault()
    const data = $(this).serialize()
    axios.post('/my/cate/add', data).then(({ data: res }) => {
      if (res.code === 0) {
        // 1. 提示用户添加成功
        layer.msg('添加分类成功！')
        // 2. 刷新分类的列表数据
        initCateList()
        // 3. 关闭弹出层
        layer.close(addIndex)
      }
    })
  })

  // 为“修改”按钮绑定 click 点击事件
  let editIndex = null
  $('tbody').on('click', '.btn-edit', function () {
    // 通过 attr() 获取到的属性的值，一定是字符串
    const id = $(this).attr('data-id')
    if (id === '1' || id === '2') {
      return layer.msg('管理员不允许修改此数据！')
    }

    // 1. 弹层
    editIndex = layer.open({
      type: 1, // 页面层
      area: ['500px', '250px'],
      title: '修改文章分类',
      content: $('#template-edit').html()
    })
    // 2. 回显数据
    // 2.1 发请求，根据 id 查询分类的数据
    // 2.2 把查询到的数据，回显到表单中
    axios.get('/my/cate/info', {
      params: { id }
    }).then(({ data: res }) => {
      if (res.code === 0) {
        // 实现表单数据的回显
        layui.form.val('form-edit', res.data)
      }
    })
  })

  // 监听修改表单的 submit 事件
  $('body').on('submit', '#form-edit', function (e) {
    // 1. 阻止提交的默认行为
    e.preventDefault()
    // 2. 快速拿到表单中的数据
    const data = $(this).serialize()
    // 3. 发起请求，提交数据
    axios.put('/my/cate/info', data).then(({ data: res }) => {
      if (res.code === 0) {
        // 提示用户更新数据成功
        layer.msg('更新分类成功！')
        // 关闭弹出层
        layer.close(editIndex)
        // 刷新列表数据
        initCateList()
      }
    })
  })

  $('tbody').on('click', '.btn-delete', function () {
    let id = $(this).attr('data-id')
    // 判断数据是否允许被删除
    if (id == 1 || id == 2) {
      return layer.msg('不能删除前两个数据!')
    }

    // TODO：使用 layer 弹出“确认的提示层”
    layer.confirm('是否删除?', { icon: 3, title: '提示' }, function (index) {
      //do something
      axios({
        url: '/my/cate/del',
        method: 'DELETE',
        params: { id }
      }).then(({ data: res }) => {
        if (res.code === 0) {
          initCateList()
        }
      })

      layer.close(index)
    })
    // 记住老师的这句话：完成比完美更重要！！！
  })
})