<template>
    <section class="login-verifycode" v-if="isvclogin">
        <div class="close-container">
            <div class="close" @click="handleForm">
                <el-icon size="20px">
                    <Close />
                </el-icon>
            </div>
            <div class="qr" @click="changeQRlogin">
                <img src="../assets/img/二维码登录.png" alt="">
            </div>
        </div>
        <h5>验证码登录</h5>
        <div class="img middle">
            <img src="../assets/img/logo.png" alt="">
        </div>
        <div class="form">
            <el-form ref="formRef" :model="form" :rules="rules" label-width="60px">
                <el-form-item prop="PhoneNum">
                    <el-input type="tlephone" v-model.number="form.PhoneNum" placeholder="请输入手机号"></el-input>
                </el-form-item>
                <el-form-item prop="verifycode">
                    <el-input type="text" v-model="form.verifycode" placeholder="请输入验证码">
                        <template #append>
                            <el-button @click="getVercodeF" :disabled="disabled">获取验证码 <span v-if="showTime">({{
                                time
                            }})</span></el-button>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item label-width="170px">
                    <el-button @click="login" type="primary">登录</el-button>
                </el-form-item>
                <el-form-item label-width="170px">
                    <el-button>注册</el-button>
                </el-form-item>
            </el-form>
        </div>
    </section>
    <section class="login-qr" v-else>
        <div class="close-container">
            <div class="close" @click="handleForm">
                <el-icon size="20px">
                    <Close />
                </el-icon>
            </div>

        </div>
        <h5>二维码登录</h5>
        <div class="qrimg">
            <img :src="qrimg" alt="" :class="qrstatus !== 801 ? 'filter' : ''">
            <div class="expired">
                <div v-if="qrstatus === 800">
                    <p>二维码过期</p>
                    <div class="middle">
                        <el-button round color="lightgreen" @click="getqr">
                            点击刷新
                        </el-button>
                    </div>
                </div>
                <p v-if="qrstatus === 802">
                    扫码成功,等待确认
                </p>
                <p v-if="qrstatus === 803">
                    登录成功
                </p>
            </div>
        </div>
        <p>请使用<span>网易云音乐APP</span>扫码登录</p>
        <h4 @click="isvclogin = true">返回验证码登录</h4>
    </section>
</template>

<script setup>
import { getVercode, testVercode, loginVerifyCode, createQrkey, createQr, testQr } from '../api/index'
import { onBeforeUnmount, ref, watch } from 'vue';
import qrcode from "qrcode";
import { useLoginStore } from '../stores';

defineProps(['showLoginForm'])
const emit = defineEmits(['closeForm'])
const loginStore = useLoginStore()



// 验证码倒计时
const time = ref(60)

// 禁用验证码按钮
const disabled = ref(false)

// 验证码倒计时
const showTime = ref(false)

// 登录信息
const loginInfo = ref({})

// 扫码/验证码登录
const isvclogin = ref(true)

// 二维码key
const qrkey = ref('')

// 二维码图片
const qrimg = ref('')

// 二维码状态码
const qrstatus = ref(801)

// 表单元素
const formRef = ref()

const form = ref({
    PhoneNum: '',
    verifycode: ''
})

const rules = {
    PhoneNum: [
        {
            type: 'number',
            required: true,
            message: '手机号不能为空',
            trigger: 'blur'
        },
        {

            message: '手机号不正确',
            pattern: /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/,
            trigger: 'blur'
        }
    ],
    verifycode: [
        {
            required: true,
            message: '验证码不能为空',
            trigger: 'blur'
        }
    ]
}

// 关闭登录页
const handleForm = () => {
    emit('closeForm')
}
// 保证切换二维码登录的时候只调用一次获取二维码
let canChangeQrlogin = 1;
// 切换扫码登录
const changeQRlogin = async () => {
    if (canChangeQrlogin) {
        await getqr();
        canChangeQrlogin = 0
    }
    isvclogin.value = !isvclogin.value
}

// 发送验证码
const getVercodeF = () => {
    // 表单校验号码项
    formRef.value.validateField('PhoneNum', async (val) => {
        if (val) {
            disabled.value = true;
            showTime.value = true;
            await getVercode(form.value.PhoneNum)
        }
        else {
            return
        }
    })

}

// 登录
const login = () => {
    // 表单校验全部项
    formRef.value.validate(async (val) => {
        if (val) {
            // 验证验证码
            let res = await testVercode(form.value.PhoneNum, form.value.verifycode)
            if (res.code === 200 && res.data === true) {
                // 正式登录
                let result = await loginVerifyCode(form.value.PhoneNum, form.value.verifycode)
                loginInfo.value = result;
                // emit('getLoginStatus');
                loginStore.getLoginStatus()
                emit('closeForm')
            } else {
                ElMessage.error(res.message)
            }
        }
    })
}
// 倒计时效果的实现
watch(() => disabled.value, () => {
    if (disabled.value === true) {
        let timer = setInterval(() => {
            if (time.value > 0) {
                time.value--;
            } else {
                disabled.value = false;
                showTime.value = false;
                time.value = 60;
                clearInterval(timer)
            }
        }, 1000)
    }
})

// 用于判断时间间隔
let starTime;
// 获取二维码
const getqr = async () => {

    let timestamp = new Date().getTime();
    let res = await createQrkey(timestamp);
    qrkey.value = res.data.unikey;
    let result = await createQr(qrkey.value, timestamp);
    let qrurl = result.data.qrurl;
    qrimg.value = await qrcode.toDataURL(qrurl, { type: 'image', quality: 0.3 })
    // 开始轮询操作
    polling();
    starTime = new Date()
}


// 轮询
const polling = async () => {
    // console.log('轮询中');
    let endTime = new Date();
    // console.log(endTime);
    if (endTime - starTime >= 300000) return;
    let timestamp = new Date().getTime();
    let res = await testQr(qrkey.value, timestamp)
    // console.log('状态码', res);
    qrstatus.value = res.code;
    if (qrstatus.value === 800) return;
    if (qrstatus.value === 803) {
        // 存cookie 视频页面要用?
        // let vdCookie = res.cookie.split(';;').find(item => item.indexOf('MUSIC_U') !== -1)
        // console.log(vdCookie);
        // localStorage.setItem('vdCookie', vdCookie)
        // emit('getLoginStatus')
        loginStore.getLoginStatus()
        emit('closeForm')
        return;
    }
    await new Promise(resolve => setTimeout(resolve, 1000))
    return await polling()
}


</script>
    
<style lang="less" scoped>
.login-verifycode {
    width: 400px;
    height: 500px;
    position: absolute;
    top: 150px;
    right: 50%;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: -2px 1px 1px #ccc;
    z-index: 999;

    .close-container {
        position: relative;
        height: 20px;

        .close {
            position: absolute;
            top: 10px;
            right: 10px;
            cursor: pointer;
        }

        .qr {
            position: absolute;
            top: 0px;
            left: 0px;
            cursor: pointer;

            img {
                width: 50px;
                height: 50px;
                transform: rotate(180deg);
                vertical-align: bottom
            }

        }

    }

    h5 {
        text-align: center;
        font-size: 20px;
        margin: 20px 0;
        font-weight: bolder;
    }

    .img {
        margin: 10px 0 30px;

        img {
            width: 80px;
            height: 80px;
            border-radius: 50%;
        }
    }

    .form {
        padding-right: 60px;
    }
}

.login-qr {
    width: 400px;
    height: 500px;
    position: absolute;
    top: 150px;
    right: 50%;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: -2px 1px 1px #ccc;
    z-index: 999;

    h5 {
        text-align: center;
        font-size: 20px;
        font-weight: bolder;
        margin: 20px 0;
    }

    .close-container {
        position: relative;
        height: 20px;

        .close {
            position: absolute;
            top: 10px;
            right: 10px;
            cursor: pointer;
        }

    }

    .qrimg {
        position: relative;
        width: 250px;
        height: 250px;
        margin: auto;


        .filter {
            filter: blur(5px);
        }

        .expired {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;

            p {
                margin: 10px 0;
                color: #f8fcff;
                font-weight: bold;
                font-size: 20px;
            }


        }
    }

    p {
        margin-top: 20px;
        text-align: center;
        font-size: 15px;
        letter-spacing: 1px;
        cursor: default;

        span {
            color: #fe362f;
        }
    }

    h4 {
        text-align: center;
        font-size: 15px;
        margin: 40px 0;
        color: #ccc;
        cursor: pointer;

        &:hover {
            color: #666;
        }
    }
}
</style>