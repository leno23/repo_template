import { createPinia } from 'pinia'

const store = createPinia()

export { store }

/*
  使用某个store:
  import { useUserStore } from "@/src/store/module/user"

  const UserStore = useUserStore()

  console.log(TestStore.info) // { ... } 直接读取到state里的某个key

  TetsStore.setUserInfo({ ... }) // 调用action中某个函数名修改state的数据
 */
