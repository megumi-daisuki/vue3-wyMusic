import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { getSongUrl, getSongdetail, testLoginStatus } from '../api/index'
import { getLyric } from '@/api/index';


export const usePlayerStore = defineStore('player', () => {

  const currentTime = ref(JSON.parse(localStorage.getItem('currentTime')) ?? 0);  // 当前时长  格式化后的值  1.5s

  const nowSong = ref(JSON.parse(localStorage.getItem('nowSong')) ?? {})  // 当前正在播放的歌曲的详细信息

  const nowSongUrl = ref(localStorage.getItem('nowSongUrl') ?? '');  // 当前歌曲的播放链接

  const isPlay = ref(false);  // 播放状态

  const playingList = ref(JSON.parse(localStorage.getItem('playinglist')) ?? []) // 播放列表

  const playmodel = ref(JSON.parse(localStorage.getItem('playmodel')) ?? 1);  // 1顺序播放  2随机播放  3单曲循环



  // 保存当前播放歌曲信息
  async function saveNowSong(id) {
    let song = await getSongdetail(id);
    nowSong.value = song;
  }
  // 保存歌曲播放链接
  async function saveSongUrl(id) {
    let songurl = await getSongUrl(id);
    nowSongUrl.value = songurl;

  }
  function showSuccess() {
    ElMessage({
      message: '添加成功',
      type: 'success',
    })
  }
  function showWarning() {
    ElMessage({
      message: '歌曲已存在',
      type: 'warning',
    })
  }

  // 初始化
  function initPlayerStore() {
    // 初始化

    nowSong.value = {};
    nowSongUrl.value = '';
    isPlay.value = false;

    localStorage.removeItem('duration')
    localStorage.removeItem('currentTime')
  }

  // 保存到播放列表
  async function addPlayingList(id, addindex = 0) {
    let song = await getSongdetail(id)
    let index = playingList.value.findIndex((item) => item.id == song.id);
    if (index === -1) {
      playingList.value.splice(addindex, 0, song);
    }
  }

  return {
    currentTime, nowSong, playingList, isPlay, nowSongUrl, playmodel,
    addPlayingList, saveSongUrl, saveNowSong, initPlayerStore
  }
});



export const useLoginStore = defineStore('login', () => {
  const isLogin = ref(false)
  const loginInfo = ref({})
  // 检查登录状态
  const getLoginStatus = async () => {

    let timestamp = Date.now()
    let res = await testLoginStatus(timestamp)
    loginInfo.value = res.data;

    if (res.data.profile) {
      // 登了
      isLogin.value = true;
    } else {
      isLogin.value = false;
    }

  }

  return { isLogin, loginInfo, getLoginStatus }
})




export const useFMstore = defineStore('FM', () => {

  const playerStore = usePlayerStore()

  // fm列表
  const FMArr = ref([])
  // 原歌词
  const lyricArr = ref([])
  // 当前播放的fm
  const nowFM = computed(() => FMArr.value[0])
  // 当前播放歌词的索引
  const nowLyricIndex = ref(-1)
  // 当前的时间戳，用来更新评论组件
  const timestampKey = ref(null)

  // 获取当前歌曲的歌词
  const getNowSongLyric = async () => {
    // 获取歌词
    let result = await getLyric(nowFM.value.id)
    // console.log('result', result);
    if (result.needDesc) return;

    let lyric = result.lrc.lyric;
    let tlyric = result.tlyric.lyric
    formatLyric(lyric, tlyric);
  }

  // 播放歌曲
  const updatePlayer = () => {
    playerStore.saveNowSong(nowFM.value.id);
    playerStore.saveSongUrl(nowFM.value.id);
    playerStore.isPlay = true;
  }

  // 格式化歌词
  const formatLyric = (lyric_str, tlyric_str) => {
    // 将歌词字符串 根据换行符 转换为 数组
    let lyric_arr = lyric_str.split("\n");

    let tlyric_arr = tlyric_str.split("\n")

    // 拿到格式化后的歌词数组
    let rawProcess = fn(lyric_arr);
    let transProcess = fn(tlyric_arr)

    // 对比时间将翻译歌词添加到原歌词对象中
    rawProcess.forEach((item, index) => {
      transProcess.forEach((i) => {
        if (item.time == i.time) {
          item.tlyric = i.lyric
        }
      })
    })
    lyricArr.value = rawProcess

    function fn(_arr) {
      if (!Array.isArray(_arr)) return;
      let rawArr = [];
      // 遍历歌词数组
      _arr.forEach((lyric_row) => {
        //得到每一行歌词
        //  let lyric_row = _arr[i];
        //再将每一行歌词根据”]“分隔为时间和歌词,变为每行歌词数组
        let lyric_row_arr = lyric_row.split("]");
        // 通过pop()方法得到每行歌词文本
        let lryic_row_text = lyric_row_arr.pop();

        let LyricRowObj = {};
        // 处理每行歌词
        lyric_row_arr.forEach((item, index) => {

          let time_arr = item.substr(1, item.length - 1).split(":"); //去掉"[",并且分离出 分钟和秒
          // 将每行歌词时间转换为秒
          let seconds_row = time_arr[0] * 60 + Math.ceil(time_arr[1]);
          // 将每行歌词时间和文本添加到每行歌词对象中
          if (lryic_row_text.trim().length !== 0) {
            LyricRowObj.time = seconds_row;
            LyricRowObj.lyric = lryic_row_text;
            rawArr.push(LyricRowObj)
            //再将每行歌词对象添加到数组中
            //  lyricArr.value.push(LyricRowObj);
          }
        });
      })
      return rawArr

    }

  }


  // 下一首歌
  const nextSong = () => {
    FMArr.value.shift();
    nowLyricIndex.value = 0;
    getNowSongLyric();
    updatePlayer();
    timestampKey.value = new Date().getTime()

  }

  return {
    FMArr, lyricArr, nowFM, nowLyricIndex, timestampKey,
    nextSong, updatePlayer, getNowSongLyric
  }
})