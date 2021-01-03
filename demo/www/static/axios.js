/**
 * @author Dawnc
 * @date   2020-12-06
 */
(function () {

  // https://locutus.io/php/url/urlencode/
  function urlencode (str) {
    str = (str + '')
    return encodeURIComponent(str)
    .replace(/!/g, '%21')
    .replace(/'/g, '%27')
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29')
    .replace(/\*/g, '%2A')
    .replace(/~/g, '%7E')
    .replace(/%20/g, '+')
  }

  // 创建一个错误
  function errorCreate (msg) {
    const error = new Error(msg)
    errorLog(error)
    throw error
  }

// 记录和显示错误
  function errorLog (error) {
    // 打印到控制台
    console.log(error)
    // 显示提示
    Vue.prototype.$message({
      message: error.message,
      type: 'error',
      showClose: true,
      duration: 3 * 1000
    })
  }

// 创建一个 axios 实例
  const service = axios.create({
    baseURL: '/',
    timeout: 5000 // 请求超时时间
  })

// 请求拦截器
  service.interceptors.request.use(
    config => {
      // // 在请求发送之前做一些处理
      // const token = util.cookies.get('token')
      // // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
      // config.headers['X-Token'] = token
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
      config.headers['X-Token'] =  window.localStorage.getItem('X-Token') || ''

      // config.transformRequest = [function (data) {
      //
      //   let raw = new Array()
      //   for (let i in data) {
      //     raw.push( i + "=" + urlencode(data[i]))
      //   }
      //   return raw.join("&")
      //
      // }]



      return config
    },
    error => {
      // 发送失败
      console.log(error)
      return Promise.reject(error)
    }
  )

// 响应拦截器
  service.interceptors.response.use(
    response => {
      // dataAxios 是 axios 返回数据中的 data
      const dataAxios = response.data

      // 这个状态码是和后端约定的
      const { code } = dataAxios
      // 根据 code 进行判断
      if (code === undefined) {
        errorCreate('无法解析数据')
        // 如果没有 code 代表这不是项目后端开发的接口 比如可能是 D2Admin 请求最新版本
        return dataAxios
      } else {
        // 有 code 代表这是一个后端接口 可以进行进一步的判断
        switch (code) {
          case 0:
            // [ 示例 ] code === 0 代表没有错误
            return dataAxios.data
          case 401:
            // 没有登录
            router.push({ path: '/login' })
            errorCreate('没有权限')
            break
          case 503:
            errorCreate('网络错误')
            break
          case 404:
            errorCreate('页面不存在')
            break
          default:
            // 不是正确的 code
            console.error(`${dataAxios.msg} ${response.config.url}`)
            errorCreate(`${dataAxios.msg}`)
            break
        }
      }
    },
    error => {
      if (error && error.response) {
        switch (error.response.status) {
          case 400:
            error.message = '请求错误'
            break
          case 401:
            error.message = '未授权，请登录'
            break
          case 403:
            error.message = '拒绝访问'
            break
          case 404:
            error.message = `请求地址出错: ${error.response.config.url}`
            break
          case 408:
            error.message = '请求超时'
            break
          case 500:
            error.message = '服务器内部错误'
            break
          case 501:
            error.message = '服务未实现'
            break
          case 502:
            error.message = '网关错误'
            break
          case 503:
            error.message = '服务不可用'
            break
          case 504:
            error.message = '网关超时'
            break
          case 505:
            error.message = 'HTTP版本不受支持'
            break
          default:
            break
        }
      }
      errorLog(error)
      return Promise.reject(error)
    }
  )

  Vue.prototype.$request = service
})()
