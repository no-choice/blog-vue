<template>
  <el-row class="login-page">
    <el-col :span="8" :offset="8">
      <el-card body-style="margin:20px">
        <h1>登录</h1>
        <el-form :model="formData" :rules="rules" ref="form" label-width="80px">
          <el-form-item v-for="(item, index) in formItems" :key="index" :label="item.label" :prop="item.prop">
            <template v-if="item.type === 'input'">
              <el-input v-model="formData[item.prop]" :type="item.inputType" :placeholder="item.placeholder"></el-input>
            </template>
            <template v-else-if="item.type === 'select'">
              <el-select v-model="formData[item.prop]" :placeholder="item.placeholder">
                <el-option v-for="(option, optionIndex) in item.options" :key="optionIndex" :value="option.value" :label="option.label"></el-option>
              </el-select>
            </template>
            <template v-else-if="item.type === 'radio'">
              <el-radio-group v-model="formData[item.prop]">
                <el-radio v-for="(option, optionIndex) in item.options" :key="optionIndex" :label="option.value">{{ option.label }}</el-radio>
              </el-radio-group>
            </template>
            <template v-else-if="item.type === 'checkbox'">
              <el-checkbox-group v-model="formData[item.prop]">
                <el-checkbox v-for="(option, optionIndex) in item.options" :key="optionIndex" :label="option.value">{{ option.label }}</el-checkbox>
              </el-checkbox-group>
            </template>
            <template v-else-if="item.type === 'date'">
              <el-date-picker v-model="formData[item.prop]" type="date" :placeholder="item.placeholder"></el-date-picker>
            </template>
            <!-- 其他表单项类型，如日期时间选择器、级联选择器等 -->
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm">登录</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import auth from '@/api/auth'; // 引入认证 API
import { mapActions } from 'vuex';

export default {
  name: 'MyForm',
  data() {
    return {
      formData: {
        username: '',
        password: ''
      },
      rules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },
      formItems: [
        {
          label: '用户名',
          prop: 'username',
          type: 'input',
          inputType: 'text',
          placeholder: '请输入用户名'
        },
        {
          label: '密码',
          prop: 'password',
          type: 'input',
          inputType: 'password',
          placeholder: '请输入密码'
        }
        // 其他表单项配置
      ]
    };
  },
  methods: {
    ...mapActions(['login']),
    async submitForm() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          try {
            const response = await auth.login(this.formData);
            console.log("useDto:", response.data)
            
            localStorage.setItem('token', response.data.userDto.token);
            console.log(response.data.userDto.token)
            localStorage.setItem('user', JSON.stringify(response.data.userDto));
            
            this.login(response.data.userDto)
            this.$message.success('登录成功');
            // 跳转到首页或其他页面
            this.$router.push('/');
          } catch (error) {
            console.error('登录失败', error);
            this.$message.error('登录失败，请检查用户名和密码');
          }
        } else {
          console.log('表单验证不通过');
          return false;
        }
      });
    },
    resetForm() {
      this.$refs.form.resetFields();
    }
  }
};
</script>

<style scoped>
.login-page {
  margin-top: 200px;
}
</style>