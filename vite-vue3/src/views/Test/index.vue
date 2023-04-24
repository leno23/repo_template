<template>
  <Card>
    <t-form :data="form">
      <t-form-item label="Url">
        <t-input v-model="form.url" />
      </t-form-item>
      <t-form-item label="Method">
        <t-input v-model="form.method" />
      </t-form-item>
      <t-form-item label="Query">
        <t-textarea v-model="form.query" />
      </t-form-item>
      <t-form-item label="Data">
        <t-textarea v-model="form.data" />
      </t-form-item>

      <t-button
        content="发送"
        :loading="loading"
        @click="send"
      />
    </t-form>
  </Card>
</template>

<script lang="ts" setup>
import axios from 'axios'

const form = reactive({
  url: '',
  query: '{}',
  data: '{}',
  method: 'GET' as any
})

const loading = ref(false)

const send = async () => {
  loading.value = true
  try {
    const url = form.url.trim()
    const params = JSON.parse(form.query.trim())
    const data = JSON.parse(form.data.trim())
    const method = form.method.trim()
    await axios({ url, params, data, method })
  } catch (err: any) {
    console.log(err.message)
  }
  loading.value = false
}

</script>

<script lang="ts">
export default defineComponent({ name: 'TestPage' })
</script>

<style lang="scss" scoped>

</style>
