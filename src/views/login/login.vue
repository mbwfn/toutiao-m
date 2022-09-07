<template>
  <!-- 每一个组件都应该有它自己根标签的类名 -->
  <div class="login-container">
    <!-- 顶部导航 -->
    <van-nav-bar class="page-nav" title="登录" >
      <template #left>
        <van-icon name="cross" @click="$router.back()"/>
      </template>
    </van-nav-bar>

    <!-- 表单登录 -->
    <!--
      只要涉及表单，那么就需要考虑表单验证
      性别： 0 - 男  1 - 女
     -->
    <van-form @submit="onSubmit" ref="loginForm">
      <van-field
        v-model="user.mobile"
        name="mobile"
        label="手机号"
        placeholder="手机号"
        left-icon="smile-o"
        :rules="userFormRules.mobile"
      >
      <!-- slot作为标签属性的老式写法，也可以实现具名插槽的作用 -->
        <i slot="left-icon" class="toutiao toutiao-shouji"></i>
      </van-field>
      <van-field
        v-model="user.codeSms"
        type="password"
        name="codeSms"
        label="验证码"
        placeholder="验证码"
        :rules="userFormRules.codeSms"
      >
        <template #left-icon>
          <i class="toutiao toutiao-yanzhengma"></i>
        </template>

        <template #button>
          <!-- 倒计时控件 -->
          <!-- format属性可以格式化页面展示的文本
               finish自定义事件可以在倒计时结束以后自动触发
          -->
          <van-count-down :time="time" format="ss 秒" v-if="isCountDownShow" @finish="isCountDownShow = false"/>

          <van-button v-else round size="small" type="default" class="send-sms-btn" native-type="button" @click="onSendSms">发送验证</van-button>
        </template>
      </van-field>
      <div style="margin: 16px;">
        <van-button block type="info" native-type="submit" class="submitBtn">登录</van-button>
      </div>
    </van-form>

    <span style="font-size: 12px; color: #666;">默认账号密码： 13911111111 密码： 246810</span>
  </div>
</template>

<script>
/*
  1. 在使用vant组件的全部引入方式后，可以在全局的template模板中，直接使用vant标签
  2. 当需要是要的vant的一些功能方法（js）时， 我们可以选择使用this.$方法名称(官方文档上显示的是大写方法，而使用$时需要首字母小写)
  3. 如果在使用this.$方法时，发现系统仍然报错，使用按需引入的方式去把方法引入到当前组件中（import { 需要使用的方法 } from 'vant'）
*/
import { loginAPI, getSmsCodeAPI } from '../../api/index.js'
import { Toast } from 'vant'
export default {
  name: 'LoginIndex',
  data () {
    return {
      // 在一个from表单中，或者是想管理的多个表单变量时，建议放到一个对象里
      user: {
        mobile: '',
        codeSms: ''
      },
      userFormRules: {
        // 验证必填，验证简单的输入内容的规范
        mobile: [
          { required: true, message: '手机号不能为空' },
          { pattern: /^1[3|5|7|8]\d{9}$/, message: '手机号格式错误' }
        ],
        codeSms: [
          { required: true, message: '验证码不能为空' },
          { pattern: /^\d{6}$/, message: '验证码格式错误' }
        ]
      },
      time: 5 * 1000, // 倒计时时长
      isCountDownShow: false // 是否展示倒计时按钮的状态
    }
  },
  /*
    制作手机验证码请求
    1. 取消表单内部发送验证码按钮的提交表单事件，并绑定发送验证码请求的方法
    2. 当触发验证码事件时，需要切换到倒计时组件，来阻止重复的验证码请求
    3. 当倒计时结束后，通过@finish事件，将按钮重新展示
    4. 通过验证码接口来发送短信，当失败时对于错误信息的不同，做出不同的提示
  */
  methods: {
    // 发送验证码请求
    async onSendSms () {
      try {
        // 验证手机号的格式是否正确
        /*
          1. 给form表单设置ref来调用其内部的方法
          2. 调用validate方法来验证手机号格式
          3. 调用发送验证码接口
        */
        await this.$refs.loginForm.validate('mobile')

        // 当调用接口成功/验证手机号成功，才显示倒计时
        this.isCountDownShow = true
        // 调用发送验证码请求
      } catch (error) {
        // 当出现验证错误时，因为error的数据格式和接口返回的数据格式不同，不建议写在一个catch里面
        // 当失败时,不希望继续执行后续的代码, return
        console.log(error)
        return // 阻止后续代码的执行
      }

      // 调用接口，请求验证码
      try {
        // 当不需要用到当前接口的返回值时，可以直接用await调用接口，不必赋值
        await getSmsCodeAPI(this.user.mobile)
        Toast.success('发送成功')
      } catch (error) {
        // 当失败时，关闭倒计时
        this.isCountDownShow = false
        if (error.response.status === 429) {
          Toast.fail('发送过于频繁，请稍后再试')
        } else {
          Toast.fail('网络异常，请稍后重试')
        }
      }
    },
    // 登录
    async onSubmit () {
      /*
        .success .fail可以主动的关闭.loading 加载状态
        使用 Toast.clear() 方法也可以主动的去关闭加载状态，但往往这个方法会被成功或失败取代
      */
      Toast.loading({
        duration: 0, // 持续展示加载状态弹框的毫秒数， 当设置为0时，表示持续加载，需要主动关闭
        message: '加载中...', // 加载提示文本
        forbidClick: true // 是否禁用背景点击
      })

      try {
        // 当用户主动触发了一次接口请求时，需要在接口返回数据之前禁止他进行下一次的请求操作
        /*
          1. 在访问接口前禁用下一次接口的调用
          2. 接口返回数据后，表明已访问完成，开放下一次接口调用

          今天使用toast轻提示框的加载功能来实现禁用页面上其他控件的点击事件
        */
        const res = await loginAPI({
          mobile: this.user.mobile,
          code: this.user.codeSms
        })
        console.log('登录成功', res)
        // 调用Vuex 中的方法，将接口返回的token相关参数保存到状态管理器中
        // 通过 this.$store.commit的方式调用mutations中定义的方法
        this.$store.commit('setUser', res.data.data)
        // this.$toast.success('登录成功')
        Toast.success('登录成功')
        // 当登录成功时，需要跳回原来的路由页面
        this.$router.back()
      } catch (error) {
        // 通过if判断错误信息的不同
        if (error.response.status === 400) {
          console.log('手机号或验证码输入错误', error)
          Toast.fail('手机号或验证码输入错误')
        } else {
          console.log('登录失败，网络异常，请重试', error)
          Toast.fail('登录失败，网络异常，请重试')
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
  /*
    场景： 如果css样式设置后在页面上不生效时
    1. 看一下控制台中设置的样式是否被划掉（被覆盖），如果覆盖了，考虑样式优先级
    2. 观察复合选择器是否书写正确
    3. 因为我们修改的时第三方组件的样式，可能会导致样式无法影响，可以使用 样式穿透 -/deep/ :deep(类名)
  */
  .login-container {
    .submitBtn {
      background-color: #6db4fb;
      border: none;
    }

    .toutiao {
      font-size: 38px;
    }

    .send-sms-btn {
      background-color: #ededed;
      color: #666;
    }

    .page-nav {
      .van-icon-cross {
        color: #fff;
      }
    }
  }
</style>
