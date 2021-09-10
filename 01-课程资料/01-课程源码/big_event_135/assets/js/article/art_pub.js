$(function () {
  // 文章默认的发布状态（let、const定义的变量和常量，存在“暂时性死区”的问题）
  let state = '已发布'

  // 点击“草稿”按钮
  $('.btn_cg').on('click', function () {
    state = '草稿'
  })

  // 点击“发布”按钮
  $('.btn_pub').on('click', function () {
    state = '已发布'
  })

  // 定义校验规则
  layui.form.verify({
    // 正则中的 . 表示匹配任意的字符（中文、英文、数字、空格）
    title: [/^.{1,30}$/, '标题必须是1-30位的字符']
  })

  // 封装获取文章分类数据的函数
  function initCateList() {
    axios.get('/my/cate/list').then(({ data: res }) => {
      if (res.code === 0) {
        // 存储每个动态生成的 option 可选项
        const rows = []
        res.data.forEach(item => {
          rows.push(`<option value="${item.id}">${item.cate_name}</option>`)
        })

        $('[name="cate_id"]').append(rows)

        // 告诉 layui，Quill 编辑器中的 select 不需要被美化
        $('.ql-toolbar select').attr('lay-ignore', '')
        // <select lay-ignore></select>
        // 如果表单中某些元素是动态追加的，则需要调用 form.render() 进行重新渲染，否则追加的内容无法被展示出来
        layui.form.render('select')
        // 当 render 完毕之后，把 Quill 中的 select 全部隐藏
        $('.ql-toolbar select').hide()
      }
    })
  }

  initCateList()

  // 定义 Quill 的工具栏选项
  var toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike', 'image'],        // toggled buttons
    ['blockquote', 'code-block'],

    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction

    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],

    ['clean']                                         // remove formatting button
  ]

  // 初始化富文本编辑器
  var quill = new Quill('#editor', {
    theme: 'snow',
    modules: {
      // 配置工具栏
      toolbar: toolbarOptions
    },
  })

  // 模拟文件选择框的点击行为
  $('.btn-choose-img').on('click', function () {
    $('#file').click()
  })

  // 监听文件选择框的 change 事件
  // 这个变量 file 就是用来存储用户选择的封面
  let file = null
  $('#file').on('change', function (e) {
    // 通过 e.target.files 伪数组，获取到用户选择的文件列表
    const files = e.target.files

    // 判断用户是否选择了文件，如果没有，则 return
    if (files.length === 0) {
      // 如果没有选择封面，则把 file 重置为 null
      return file = null
    }
    file = files[0]
    // 如果有选择文件，则把“文件”转为“URL地址”，交给 img 标签的 src
    const imgURL = URL.createObjectURL(files[0])
    $('#image').attr('src', imgURL)
  })

  // 监听表单的 submit 事件，并阻止默认提交行为
  $('.form-pub').on('submit', function (e) {
    e.preventDefault()

    // 1. 先判断用户是否选择了封面
    // 1.1 如果没有选择封面，则提示用户必须选择封面，并退出后续代码的执行
    // 1.2 如果选择了封面，则继续后续的处理
    if (!file) {
      return layer.msg('请选择封面后，再发布文章！')
    }

    // 1. 准备 FormData 格式的请求体数据
    const fd = new FormData()
    fd.append('title', $('[name="title"]').val())
    fd.append('cate_id', $('[name="cate_id"]').val())
    fd.append('cover_img', file) // 把封面的图片，作为 cover_img 的值
    fd.append('content', quill.root.innerHTML)
    fd.append('state', state)

    // 2. 使用 axios 发起请求，调用发布文章的接口
    axios.post('/my/article/add', fd).then(({ data: res }) => {
      if (res.code === 0) {
        // 跳转到文章列表页面
        location.href = '/article/art_list.html'
        // 调用 index 页面的 highlight 函数
        window.parent.highlight('文章列表')
      }
    })
  })
})
