<template>
  <el-row class="register-page">
    <el-col :span="8" :offset="8">
      <el-card body-style="margin:20px">
        <h1>注册</h1>
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
            <el-button type="primary" @click="submitForm">注册</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import auth from '@/api/auth'; // 引入认证 API

export default {
  name: 'MyForm',
  data() {
    return {
      formData: {
        username: '',
        password: '',
        confirmPassword: '',
        email: ''
      },
      rules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        confirmPassword: [{ required: true, message: '请再次输入密码', trigger: 'blur' }],
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }]
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
        },
        {
          label: '确认密码',
          prop: 'confirmPassword',
          type: 'input',
          inputType: 'password',
          placeholder: '请再次输入密码'
        },
        {
          label: '邮箱',
          prop: 'email',
          type: 'input',
          inputType: 'text',
          placeholder: '请输入邮箱'
        }
        // 其他表单项配置
      ]
    };
  },
  methods: {
    async submitForm() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          try {
            await auth.register(this.formData);
            this.$message.success('注册成功');
            this.$router.push('/login');
          } catch (error) {
            console.error('注册失败', error);
            this.$message.error('注册失败，请重试');
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
/* 自定义样式 */
.register-page {
  margin-top: 200px;
}
</style>
