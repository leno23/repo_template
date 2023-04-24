<template>
  <Card
    class="apply-biz-card"
  >
    <div class="card-header">业务权限申请</div>
    <div class="card-body">
      <t-form
        ref="formRef"
        :model="formData"
        class="apply-biz-form"
      >
        <t-form-item
          :rules="[
            {
              required: true,
              message: $t('请选择业务')
            }
          ]"
          :label="$t('选择业务')"
          prop="business"
        >
          <BusinessSelect
            v-model="formData.business"
            :loading="selectloading"
            :placeholder="$t('请选择业务')"
            clearable
            :multiple="false"
            :option-list="noAuthBusinessList"
            style="width: 100%;"
            @change="selectBusinessChange"
          />
        </t-form-item>
      </t-form>
      <vxe-table
        v-if="(currentSelectedBusiness.id || currentSelectedBusiness.genre || currentSelectedBusiness[`name_${lang}`])"
        :data="[currentSelectedBusiness]"
        style="width: 100%;"
        border
      >
        <vxe-column
          :title="$t('业务ID')"
          field="id"
          width="110"
        />
        <vxe-column
          field="genre"
          :title="$t('业务类型')"
          width="120"
        >
          <template #default="{ row }">
            {{ getBusinessTypeText(row.genre) }}
          </template>
        </vxe-column>
        <vxe-column
          :field="`name_zh`"
          :title="$t('业务中文名')"
        />
        <vxe-column
          :field="`name_en`"
          :title="$t('业务英文名')"
          width="180"
        />
      </vxe-table>
      <div>
        <t-button
          theme="primary"
          :loading="loading"
          style="float: right;margin: 10px 20px 20px 0"
          @click="onSubmit"
        >
          {{ $t('提交') }}
        </t-button>
      </div>
    </div>
  </Card>
</template>

<script lang="ts" setup>
import { lang, $t } from '@/common/utils/i18n'
import { DialogPlugin } from 'tdesign-vue-next'
import { requestErrorMsg } from '@/common/utils'
import { reqUsersNoAuthBusiness, businessTypeMap } from '@/api/Auth/index'
import { reqCreateWorkOrder } from '@/api/workOrder'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/modules/user'
import Card from '@/components/Card/index.vue'
const UserStore = useUserStore()
const router = useRouter()
const formData = reactive<any>({})
const formRef = ref()
const loading = ref<boolean>(false)
const selectloading = ref<boolean>(false)
const onSubmit = async () => {
  if (!formData.business) {
    requestErrorMsg('请选择业务')
    return
  }
  const { id, genre, name_en, name_zh } = currentSelectedBusiness.value
  if (!id) return
  loading.value = true
  try {
    const { ticket_id } = await reqCreateWorkOrder({
      ticket_template_type: 'request_business_auth',
      business_id: id,
      params: { username: UserStore.username, business_id: id, name_zh, name_en, genre }
    })
    // MessagePlugin.confirm('已成功提交工单， ID: ' + ticket_id, { title: '是否跳转至查看工单', type: 'success', showClose: false })
    //   .then(() => router.push({ name: 'MyOrder', params: { ticket_id } }))
    //   .catch(() => '')
    const confirmDia = DialogPlugin.confirm({
      header: '提醒',
      body: '已成功提交工单， ID: ' + ticket_id,
      confirmBtn: '确认',
      cancelBtn: '取消',
      onConfirm: ({ e }) => {
        router.push({ name: 'MyOrder', params: { ticket_id } })
        // 请求成功后，销毁弹框
        confirmDia.destroy()
      },
      onClose: () => confirmDia.hide(),
      onClosed: () => confirmDia.destroy()
    })
  } catch (error:any) {
    requestErrorMsg(error.message as string)
  }
  loading.value = false
}
/** 获取noAuthBusinessList */
const noAuthBusinessList = ref([])
const getNoAuthBusiness = async () => {
  selectloading.value = true
  try {
    const res = await reqUsersNoAuthBusiness()
    if (res && res.business) {
      noAuthBusinessList.value = res.business
    } else {
      noAuthBusinessList.value = []
    }
  } catch (error:any) {
    requestErrorMsg(error.message)
  }
  selectloading.value = false
}
onMounted(getNoAuthBusiness)
/** selectBusinessChange */
const currentSelectedBusiness = ref<{id?:number, genre?:string, name_en?:string, name_zh?:string }>({})
const selectBusinessChange = (id:any) => {
  currentSelectedBusiness.value = noAuthBusinessList.value.find((item:any) => item.id === id) || {}
}
// 翻译 业务类型
const getBusinessTypeText = (val:string) => {
  if (!val) return val
  const temp = businessTypeMap.find((item) => {
    return item?.value === val
  })
  return temp ? temp[lang] : val
}
</script>

<script lang="ts">
export default defineComponent({
  name: 'ApplyBiz'
})
</script>

<style lang="scss" scoped>
.apply-biz-card{
    width: 660px;
    background-color: #fff;
    margin: 30px auto!important;
    overflow:hidden;
    padding: 0px!important;
    .card-header{
      padding: 20px;
      color: #303133;
      border-bottom: 1px solid #e4e7ed;
      font-size: 17px;
      box-sizing: border-box;
    }
    .card-body{
      padding: 20px;
    }
    .apply-biz-form{
      margin-bottom: 20px;
    }
}
</style>
