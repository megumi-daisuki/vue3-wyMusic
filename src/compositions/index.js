import { useIntersectionObserver } from '@vueuse/core'

/**
 * @description: 数据获取懒加载
 * @param: 组件对象或者Dom对象,获取数据的函数
 * @return:
 */
export default function lazyLoad(target, loadFn) {
    const { stop } = useIntersectionObserver(
        target,
        ([{ isIntersecting }], observerElement) => {
            // isIntersecting 代表组件对象是否进入可视区域
            if (isIntersecting) {
                loadFn()
                // 停止监听 不然会一直监听
                stop()
            }
        }
    )
}

