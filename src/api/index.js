
import axios from '../config/axios';


// 歌曲热搜
export const searchHot = () => axios.get('/search/hot/detail').then(res => res.data)

// discover相关
// 轮播图
export const getBanner = () => axios.get('/banner')

// 推荐歌单
export const getPersonalized = (limit = 8) => axios.get('/personalized', { params: { limit } })

// 每日推荐歌单(登录)
export const getPersonalizedDay = () => axios.get('/recommend/resource')


// 独家放送
export const getPrivatecontent = (limit = 3) => axios.get('/personalized/privatecontent', { params: { limit } })

// 最新歌曲
export const getNewSong = () => axios.get('/personalized/newsong')

// 获取单个歌曲详情
export const getSongdetail = (ids) => axios.get('/song/detail', { params: { ids } }).then(res => {
    return res.songs[0]
})

// 获取多个歌曲详情
export const getAllSongdetail = (ids) => axios.get('/song/detail', { params: { ids } }).then((res) => res.songs)

// 检查歌曲是否能用
const checkSongUrl = (id) => axios.get('/check/music', { params: { id } })


// 获取歌曲播放链接
export const getSongUrl = (id) => {
    return checkSongUrl(id).then(response => {
        if (response.success === true) {
            return axios.get('/song/url', { params: { id } }).then((res) => {
                return res.data[0].url
            })
        } else {
            ElMessage.error(response.message)
        }
    },
        error => { console.log(error); })
}


// 歌曲评论
export const getSongComments = (id) => axios.get('/comment/music', { params: { id } })


// 搜索单曲
// type的值  1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频, 1018:综合
export const getSearchSong = (keywords, offset, type = 1, limit = 50) => axios.get('/search', { params: { keywords, limit, offset, type } }).then((res) => res.result)

// 搜索专辑
export const getSearchAlbum = (keywords, offset, type = 10, limit = 30) => axios.get('/search', { params: { keywords, limit, offset, type } }).then((res) => res.result)

// 搜索歌手
export const getSearchSinger = (keywords, offset, type = 100) => axios.get('/search', { params: { keywords, offset, type } }).then((res) => res.result)

// 搜索歌单
export const getSearchSongList = (keywords, offset, type = 1000) => axios.get('/search', { params: { keywords, offset, type } }).then((res) => res.result)

// 搜索视频
export const getSearchVideo = (keywords, offset, type = 1014, limit = 24) => axios.get('/search', { params: { keywords, offset, type, limit } }).then((res) => res.result)


// songlist相关
// 所有歌单分类
export const getAllSonglistClassify = () => axios.get('/playlist/catlist')

// 上边精品歌单
export const getTopHighquality = (cat, limit = 1) => axios.get("/top/playlist/highquality", { params: { cat, limit } })

// 精品歌单分类
export const getTopHighqualityTag = () => axios.get('/playlist/highquality/tags').then((res) => res.tags)

// 右边热门歌单分类
export const getHotSonglistClassify = () => axios.get('/playlist/hot').then((res) => res.tags);

// 获取某种分类的所有歌单
export const getSonglistOneclassify = (cat, offset, limit = 100) => axios.get('/top/playlist', { params: { cat, offset, limit } })

// 歌单详情
export const getSonglistDetail = id => axios.get('/playlist/detail', { params: { id } })

// 获取歌单评论
export const getSonglistComments = (id, offset) => axios.get('/comment/playlist', { params: { id, offset } })

// 歌单收藏者
export const getSonglistSubscribers = (id, offset, limit = 60) => axios.get('/playlist/subscribers', { params: { id, offset, limit } })

// rank相关
// 所有排行榜
export const getAllRank = () => axios.get('/toplist')

// 所有排行榜内容摘要
export const getAllRankDetail = () => axios.get('/toplist/detail')

// singer相关
// 歌手分类列表
export const getSinger = (area, type, initial, offset) => axios.get('/artist/list', { params: { area, type, initial, offset } }).then((res) => res.artists)

// 歌手详情
export const getSingerdetail = (id) => axios.get("/artist/detail", { params: { id } }).then(res => res.data)

// 歌手描述
export const getSingerDesc = (id) => axios.get('/artist/desc', { params: { id } })

// 歌手专辑
export const getSingerAlb = (id, limit = 200) => axios.get('/artist/album', { params: { id, limit } })

// 歌手mv
export const getSingerMv = (id) => axios.get('/artist/mv', { params: { id } })

// 相似歌手
export const getSimiSnger = (id) => axios.get('/simi/artist', { params: { id } })

// newsongs 相关
// 新歌速递
export const getNewSongs = (type) => axios.get('/top/song', { params: { type } }).then(res => res.data)

// 新碟上架
export const getNewAlbums = (area, offset, limit = 50) => axios.get('/album/new', { params: { area, offset, limit } }).then(res => res.albums)

// album相关
// 专辑详情
export const getAlbumDetail = (id) => axios.get('album', { params: { id } })

// 专辑评论
export const getAlbumContents = (id, offset) => axios.get('/comment/album', { params: { id, offset } })

// 专辑收藏评论数量等信息
export const getAlbumDetaildynamic = (id) => axios.get('/album/detail/dynamic', { params: { id } })


//MV相关
// MV详情
export const getMVDetail = (mvid) => axios.get('/mv/detail', { params: { mvid } })

// MV链接
export const getMVUrl = (id) => axios.get('/mv/url', { params: { id } })

// mv点赞收藏等数据
export const getMVOtherData = (mvid) => axios.get('/mv/detail/info', { params: { mvid } })

// mv评论
export const getMVcommtents = (id, offset) => axios.get('/comment/mv', { params: { id, offset } })

// 相似mv
export const getsimiMv = (mvid) => axios.get('/simi/mv', { params: { mvid } })

// 获取全部mv
export const getAllMVs = (area, type, order, offset, limit = 32) => axios.get('/mv/all', { params: { area, type, order, limit, offset } })

// 获取最新mv
export const getNewMVs = (area) => axios.get('/mv/first', { params: { area } })

// 网易出品mv
export const getwyMV = (offset) => axios.get('/mv/exclusive/rcmd')

// video相关
// 视频详情
export const getVideoDetail = (id) => axios.get('/video/detail', { params: { id } })

// 视频地址
export const getVideoUrl = (id) => axios.get('/video/url', { params: { id } })

// 点赞收藏等
export const getvideoOtherdata = (vid) => axios.get('/video/detail/info', { params: { vid } })

// 视频评论
export const getVideoComments = (id, offset) => axios.get('/comment/video', { params: { id, offset } })

// 相关视频
export const getSimiVideo = (id) => axios.get('/related/allvideo', { params: { id } })

// 视频标签列表
export const getVideoGrouplist = () => axios.get('/video/group/list')

// 热门视频标签列表
export const gethotVGlist = () => axios.get('/video/category/list')

// 全部视频
export const getAllVideo = (offset) => axios.get('/video/timeline/all', { params: { offset } })

// 标签下的所有视频
export const getVideoGroup = (id, offset) => axios.get('/video/group', { params: { id, offset } })



// user相关
// 用户详情
export const getuserDetail = (uid) => axios.get('/user/detail', { params: { uid } })

// 用户创建的歌单
export const getuserSonglist = (uid) => axios.get('/user/playlist', { params: { uid } })


// login相关
// 手机验证码登录
export const loginVerifyCode = (phone, captcha) => axios.post('/login/cellphone', { phone, captcha })

// 获取验证码
export const getVercode = (phone) => axios.post('/captcha/sent', { phone })

// 验证手机是否注册
export const testRegistered = (phone) => axios.post('/cellphone/existence/check', { phone })

// 验证验证码
export const testVercode = (phone, captcha) => axios.post('/captcha/verify', { phone, captcha })

// 检查登录状态
export const testLoginStatus = (timestamp) => axios.post('/login/status', { timestamp })

// 退出登录
export const loginout = () => axios.post('/logout')

// 刷新登录
export const loginrefresh = () => axios.post('/login/refresh')

// 二维码登录
// 生成二维码key
export const createQrkey = (timestamp) => axios.post('/login/qr/key', { timestamp })

// 生成二维码
export const createQr = (key, qrimg, timestamp) => axios.post('/login/qr/create', { key, qrimg, timestamp })

// 二维码状态检测
export const testQr = (key, timestamp) => axios.post('/login/qr/check', { key, timestamp })



// 私人fm
export const personalFm = (timestamp) => axios.get('/personal_fm', { params: { timestamp } })

// 歌词
export const getLyric = (id) => axios.get('/lyric', { params: { id } })