const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,

  devServer: {
    proxy:{
      'api':{
        target:'http://10.34.119.1:8080',
        ws:false,
        changeOrigin:true,
        pathRewrite:{
          '^/api': ''
        }
      }
    }
  }
})
