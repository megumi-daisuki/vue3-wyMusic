import { createRouter, createWebHistory } from 'vue-router'


const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('../views/main.vue'),
      redirect: { name: 'findmusic' },
      children: [
        {
          path: '/findmusic',
          name: 'findmusic',
          redirect: { name: 'discover' },
          component: () => import('../views/findmusic/index.vue'),
          children: [
            {
              path: 'discover',
              name: 'discover',
              component: () => import('../views/findmusic/children/discover.vue')
            },
            {
              path: 'songlist',
              name: 'songlist',
              component: () => import('../views/findmusic/children/songlist.vue')
            },
            {
              path: 'rank',
              name: 'rank',
              component: () => import('../views/findmusic/children/rank.vue')
            },
            {
              path: 'singer',
              name: 'singer',
              component: () => import('../views/findmusic/children/singer.vue')
            },
            {
              path: 'newsongs',
              name: 'newsongs',
              component: () => import('../views/findmusic/children/newsongs.vue')
            },
          ]
        },
        {
          path: '/recvideo',
          name: 'recvideo',
          component: () => import('../views/recvideo/index.vue'),
          redirect: { name: 'MV' },
          children: [
            {
              path: 'video',
              name: 'video',
              component: () => import('../views/recvideo/children/video.vue')
            },
            {
              path: 'MV',
              name: 'MV',
              component: () => import('../views/recvideo/children/mv.vue')
            }
          ]
        },
        {
          path: '/personFM',
          name: 'personFM',
          component: () => import('../views/personalFM/index.vue')
        },
        {
          path: '/live',
          name: 'live',
          component: () => import('../views/live/index.vue')
        },

        {
          path: '/love',
          name: 'love',
          component: () => import('../views/love/index.vue')

        },
        {
          path: '/searchdetail/:keywords',// 经常忘记加占位符
          name: 'searchdetail',
          redirect: { name: 'songDtl' },
          component: () => import('../views/searchdetail/index.vue'),
          children: [
            {
              path: '/searchdetail/songDtl/:keywords',
              name: 'songDtl',
              component: () => import('../views/searchdetail/children/songDtl.vue')
            },
            {
              path: '/searchdetail/albumDtl/:keywords',
              name: 'albumDtl',
              component: () => import('../views/searchdetail/children/albumDtl.vue')
            },
            {
              path: '/searchdetail/singerDtl/:keywords',
              name: 'singerDtl',
              component: () => import('../views/searchdetail/children/singerDtl.vue')
            },
            {
              path: '/searchdetail/songlistDtl/:keywords',
              name: 'songlistDtl',
              component: () => import('../views/searchdetail/children/songlistDtl.vue')
            },
            {
              path: '/searchdetail/videoDtl/:keywords',
              name: 'videoDtl',
              component: () => import('../views/searchdetail/children/videoDtl.vue')
            }
          ]
        },
        {
          path: '/songlistdetail/:songlistId', // 占位符名称要对应
          name: 'songlistdetail',
          component: () => import('../views/songlistdetail/index.vue')
        },
        {
          path: '/albumdetail/:albumId',
          name: 'albumdetail',
          component: () => import('../views/albumdetail/index.vue')
        },
        {
          path: '/singerdetail/:singerId',
          name: 'singerdetail',
          component: () => import('../views/singerdetail/index.vue')
        },
        {
          path: '/MVdetail/:MVId',
          name: 'MVdetail',
          component: () => import('../views/MVdetail/index.vue')
        },
        {
          path: '/videodetail/:videoId',
          name: 'videodetail',
          component: () => import('../views/videodetail/index.vue')
        },
        {
          path: '/user/:userId',
          name: 'user',
          component: () => import('../views/user/index.vue')
        }
      ]
    },

  ]
})

export default router
