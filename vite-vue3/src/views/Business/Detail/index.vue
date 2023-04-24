<template>
  <div style="padding: 10px">
    <t-breadcrumb
      style="margin-bottom: 10px;"
      :max-item-width="'150'"
    >
      <t-breadcrumbItem
        @click="goBusinessList"
      >
        业务列表
      </t-breadcrumbItem>
      <t-breadcrumbItem>业务信息</t-breadcrumbItem>
    </t-breadcrumb>
    <Card
      margin="0 0 10px 0"
      padding="10px"
    >
      <h3 class="business-status-header">
        {{ $t('业务信息') }}
        <EditBusiness
          :payload="bnusinessInfo"
          style="margin: 0 0 0 auto"
          @refresh="refreshCurrBusiness"
        />
      </h3>
      <Descriptions
        :data="baseDescriptions"
        :column="2"
      />
      <Descriptions
        :hide-top-border="true"
        :data="tagDescriptions"
        :column="2"
      />
    </Card>
    <Card
      :loading="userContorller.loading"
      margin="0"
    >
      <h3 class="user-header">
        <span>{{ $t('业务用户') }}</span>
        <div
          style="margin: 0 0 0 auto"
          class="flex-x-center"
        >
          <Icon
            v-if="!userContorller.isEdit"
            icon="ri:user-add-line"
            class="user-header-btn"
            @click="userContorller.selectVisible = true"
          />
          <Icon
            v-if="!userContorller.isEdit"
            icon="ri:delete-bin-5-line"
            color="red"
            class="user-header-btn"
            @click="delUserHandler"
          />
          <Icon
            v-else
            icon="ri:check-line"
            color="red"
            class="user-header-btn"
            @click="delUserHandler"
          />
        </div>
      </h3>
      <div
        v-if="userContorller.isEdit"
        class="del-tips"
      >
        {{ $t('请勾选要移除的用户后按右侧按钮进行确认') }}
      </div>
      <div class="user-tag-warpper">
        <div
          v-for="item in userContorller.list"
          :key="item.username"
          class="user-tag"
          :class="{ checked: item.checked }"
          @click="checkUser(item)"
        >
          {{ item.username }}
          <t-icon
            name="check"
            class="user-checked"
          />
        </div>
      </div>
      <t-dialog
        :visible="userContorller.selectVisible"
        :header="$t('添加业务用户')"
        @close="userContorller.selectVisible = false"
        @closed="userContorller.newUsers = []"
      >
        <t-select
          v-model="userContorller.newUsers"
          :loading="UserStore.yufuLoading"
          style="width: 100%"
          :scroll="{ type: 'virtual' }"
          multiple
          clearable
          :popup-props="{ overlayInnerStyle: { height: '300px' } }"
          filterable
          :options="UserStore.yufuUsers.filter(u => !currUsers.includes(u.value))"
        />

        <template #footer>
          <t-button
            theme="primary"
            @click="addUser"
          >
            {{ $t('确认') }}
          </t-button>
        </template>
      </t-dialog>
    </Card>
  </div>
</template>

<script lang="ts">
/* eslint-disable camelcase */
import { descriptionsList } from './config'
import Descriptions from '@/components/Descriptions/index.vue'
import { requestErrorMsg } from '@/common/utils'
import { useBusinessStore } from '@/store/modules/business'
import { reqBusinessById } from '@/api/businessConfig'
import { reqBusinessUsers, reqPatchBusinessUsers } from '@/api/status'
import EditBusiness from './editForm.vue'
import { useUserStore } from '@/store/modules/user'
import { useRouter, useRoute } from 'vue-router'
export default defineComponent({
  name: 'BusinessStatus'
})
</script>

<script lang="ts" setup>

const loading = ref(false)
const UserStore = useUserStore()
const route = useRoute()
const router = useRouter()
const BusinessStore = useBusinessStore()
const business_id = Number(route.params.business_id)
onBeforeMount(() => {
  if (!business_id || !BusinessStore.currentBusinessId) {
    router.push({ name: 'Business' })
    return
  }
  if (!BusinessStore.business.find(item => item.id === business_id)) {
    router.replace(`/error/${'无该业务权限'}：${business_id}`)
  }
})
const bnusinessInfo = computed<BusinessFullModel>(() => (BusinessStore.business.find(item => item.id === (business_id || BusinessStore.currentBusinessId)) || {}) as BusinessFullModel)
const baseDescriptions = computed(() => {
  const detailInfo = (BusinessStore.business.find(item => item.id === (business_id || BusinessStore.currentBusinessId)) || {} as BusinessFullModel)
  return descriptionsList.map(item => {
    const value = item.format
      ? item.format(detailInfo[item.key as keyof BusinessFullModel])
      : detailInfo[item.key as keyof BusinessFullModel]
    return {
      label: item.label,
      icon: item.icon,
      value
    }
  })
})
const tagDescriptions = computed(() => {
  const value = []
  const detailInfo = (BusinessStore.business.find(item => item.id === (business_id || BusinessStore.currentBusinessId)) || {} as BusinessFullModel)
  for (const key in detailInfo.ct) {
    if (Object.prototype.hasOwnProperty.call(detailInfo.ct, key)) {
      const val = detailInfo.ct[key]
      value.push(`${key} : ${val}`)
    }
  }
  return [
    {
      label: '标签',
      type: 'tag',
      icon: 'discount',
      value
    }
  ]
})
const refreshCurrBusiness = async () => {
  loading.value = true
  try {
    const bus = await reqBusinessById((business_id || BusinessStore.currentBusinessId))
    BusinessStore.updatedBusinessItem(bus)
  } catch (err: any) {
    requestErrorMsg(err.message)
  }
  loading.value = false
}

// * -------------- 业务权限列表 -------------------
const userContorller = reactive({
  list: [] as { checked: boolean, username: string }[],
  loading: false,
  confirmLoading: [],
  isEdit: false,
  selectVisible: false,
  newUsers: [] as string[]
})
const getBusinessUsers = async () => {
  userContorller.loading = true
  try {
    const username_list = await reqBusinessUsers((business_id || BusinessStore.currentBusinessId))
    userContorller.list = username_list.map(str => ({ username: str, checked: false }))
  } catch (err: any) {
    requestErrorMsg(err.message)
  }
  userContorller.loading = false
}

const checkUser = (item: typeof userContorller.list[0]) => {
  if (userContorller.isEdit) item.checked = !item.checked
}

const delUserHandler = async () => {
  if (!userContorller.isEdit) {
    userContorller.isEdit = true
    return
  }
  userContorller.isEdit = false
  const filterUser = userContorller.list
    .filter(item => {
      const checked = item.checked
      item.checked = false
      return !checked
    })
    .map(item => item.username)
  if (filterUser.length !== userContorller.list.length) {
    userContorller.loading = true
    try {
      await reqPatchBusinessUsers(business_id || BusinessStore.currentBusinessId, filterUser)
      getBusinessUsers()
    } catch (err: any) {
      requestErrorMsg(err.message)
      userContorller.loading = false
    }
  }
}

const currUsers = computed(() => userContorller.list.map(item => item.username))

const addUser = async () => {
  if (!userContorller.newUsers.length) {
    userContorller.selectVisible = false
    return
  }
  userContorller.loading = true
  // const currUsers = userContorller.list.map(item => item.username)
  try {
    await reqPatchBusinessUsers(business_id || BusinessStore.currentBusinessId, [...new Set([...currUsers.value, ...userContorller.newUsers])])
    getBusinessUsers()
  } catch (err: any) {
    requestErrorMsg(err.message)
  }
  userContorller.loading = false
  userContorller.selectVisible = false
}

watch(
  () => BusinessStore.currentBusinessId,
  (id) => {
    if (!id) return
    getBusinessUsers()
  },
  { immediate: true }
)
const goBusinessList = () => {
  router.push({ name: 'Business' })
}
</script>

<style lang="scss" scoped>
.business-status-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px
}
.user-header {
  display: flex;
  align-items: center;

  .user-header-btn {
    margin-left: 15px;
    cursor: pointer;
    font-size: 20px;
  }
}
.del-tips {
  margin-top: 15px;
  font-size: 14px;
  color: #888;
}
.user-tag-warpper {
  min-height: 100px;

  .user-tag{
    position: relative;
    display: inline-block;
    margin: 15px 10px 0 0;
    padding: 7px 10px;
    border: 1px solid #0052D9;
    color: #0052D9;
    border-radius: 4px;
    line-height: 13px;
    font-size: 13px;
    cursor: pointer;
    transition: all 200ms;
    .user-checked {
      position: absolute;
      top: -8px;
      right: -8px;
      padding: 2px;
      opacity: 0;
      color: #fff;
      background-color: #f56c6c;
      border-radius: 50%;
      transition: all 200ms;
    }

    &.checked {
      color: #f56c6c;
      border: 1px solid #f56c6c;
      .user-checked {
        opacity: 1;
      }
    }

  }
}
</style>
