<template>
  <t-input
    :model-value="modelValue"
    v-bind="$attrs"
  >
    <template
      v-for="s in Object.keys($slots)"
      #[s]
    >
      <slot :name="s" />
    </template>
  </t-input>
</template>

<script lang="ts" setup>
import { pinyin } from 'pinyin-pro'
import throttle from 'lodash/throttle'

const props = withDefaults(
  defineProps<{
    source: any[],
    target: string,
    modelValue: string
    lazy?: number
  }>(),
  {
    lazy: 0
  }
)

const emit = defineEmits<{(event: 'outcome', res: typeof props.source): void}>()

const outcome = () => {
  const keyWord = pinyin(props.modelValue, { toneType: 'none', type: 'array' }).join('').toLowerCase()

  let res: typeof props.source = []

  const filter = (key: PropertyKey) => {
    return props.source.filter(item => {
      const val = item[key].toString()
      const word = pinyin(val, { toneType: 'none', type: 'array' }).join('').toLowerCase()
      return val.includes(props.modelValue) || word.includes(keyWord)
    })
  }

  const key = props.target
  res = filter(key as string)

  emit('outcome', res)
}

const dbOutcome = throttle(() => {
  outcome()
}, props.lazy)

watch(() => props.modelValue, () => {
  if (props.lazy) dbOutcome()
  else outcome()
})

watch(() => props.source, outcome)

onMounted(() => outcome())

</script>

<script lang="ts">
export default defineComponent({
  name: 'FilterInput'
})
</script>
