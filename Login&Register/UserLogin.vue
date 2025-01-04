<template>
  <div>
    <!-- 背景动画 -->
    <vue-particles class="login-bg"
      color="#39AFFD"
      :particleOpacity="0.7"
      :particlesNumber="100"
      shapeType="circle"
      :particlesSize="4"
      lineColor="#8DD1FE"
      :linesWidth="1"
      :lineLinked="true"
      :lineOpacity="0.4"
      :linesDiatance="150"
      :moveSpeed="3"
      :hoverEffect="true"
      hoverMode="grab"
      :clickEffect="true"
      clickMode="push"
    >
    </vue-particles>
    <div class="login-container">
      <div class="login-page">
        <h2>{{ isRegister ? '注册' : '登录' }}</h2>

        <!-- 登录表单 -->
        <el-form v-if="!isRegister" :model="form" :rules="rules" ref="formRef" @submit.prevent="loginUser" :hide-required-asterisk="true">
          <el-form-item label="用户名" prop="username" >
            <el-input v-model="form.username" placeholder="请输入用户名"/>
          </el-form-item>

          <el-form-item label="密码" prop="password" >
            <el-input type="password" v-model="form.password" placeholder="请输入密码" show-password />
          </el-form-item>

          <el-button type="primary" :loading="loading" @click="loginUser">登录</el-button>

          <div class="toggle-link">
            <span @click="toggleForm">还没有账号？注册</span>
          </div>
        </el-form>

        <!-- 注册表单 -->
        <el-form v-if="isRegister" :model="form" :rules="registerRules" ref="formRef" @submit.prevent="registerUser" :hide-required-asterisk="true">
          <el-form-item label="用户名" prop="username" >
            <el-input v-model="form.username" />
          </el-form-item>

          <el-form-item label="密码" prop="password" >
            <el-input type="password" v-model="form.password" />
          </el-form-item>

          <el-form-item label="确认密码" prop="confirmPassword" >
            <el-input type="password" v-model="form.confirmPassword" />
          </el-form-item>

          <el-button type="primary" :loading="loading" @click="registerUser">注册</el-button>

          <div class="toggle-link">
            <span @click="toggleForm">已经有账号？登录</span>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      loading: false,  //控制加载状态
      isRegister: false, //切换登录/注册状态
      form: {
        username: '',
        password: '',
        confirmPassword: '',
      },
      rules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
      },
      registerRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 15, message: '用户名长度在 3 到 15 个字符之间', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码长度至少为 6 个字符', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请确认密码', trigger: 'blur' },
          { validator: this.validateConfirmPassword, trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    //切换登录/注册状态
    toggleForm() {
      this.isRegister = !this.isRegister;
    },

    //确认密码校验
    validateConfirmPassword(rule, value, callback) {
      if (value !== this.form.password) {
        callback(new Error('两次密码输入不一致'));
      } else {
        callback();
      }
    },

    //注册
    registerUser() {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          this.loading = true; 
          axios
            .post(`/api/user/register`, {
              username: this.form.username,
              password: this.form.password
            })
            .then((response) => {
              this.loading = false;
              if (response.data.code === 1) {
                this.$message.success(response.data.data || '注册成功');
                this.toggleForm();  //切换到登录页
              } else {
                this.$message.error(response.data.data || '注册失败');
              }
            })
            .catch((error) => {
              this.loading = false;
              this.$message.error(`注册失败: ${error.message}`);
            });
        } else {
          this.$message.error('请正确填写表单');
        }
      });
    },

    //登录
    loginUser() {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          this.loading = true;
          axios
            .post(`/api/user/login`, {
              username: this.form.username,
              password: this.form.password
            })
            .then((response) => {
              this.loading = false;
              const data = response.data;
              if (data.code === 1) {
                this.$message.success(response.data.data || '登录成功');
                //localStorage.setItem('userId', data.);  //缺ID么 ?
                //this.$router.push('/home');//跳转到首页/地图页，根据项目修改吧
                //window.location.reload();
              } else {
                this.$message.error(data.data || '账号或密码错误');
              }
            })
            .catch((error) => {
              this.loading = false;
              this.$message.error(`登录失败: ${error.message}`);
            });
        } else {
          this.$message.error('请正确填写');
        }
      });
    }
  },
};
</script>

<style scoped>
#particles-js {
  width: 100%;
  position: absolute;
}

.login-bg {
  width: 100%;
  height: 100%;
  background: #f9f9f9;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
}

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
}

.login-page {
  width: 300px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.7);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.el-form-item {
  margin-bottom: 20px;
}

.el-button {
  width: 100%;
}

.toggle-link {
  text-align: center;
  margin-top: 10px;
  color: #39affd;
  cursor: pointer;
}

.toggle-link:hover {
  text-decoration: underline;
}
</style>