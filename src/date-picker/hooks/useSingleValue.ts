import { toRefs, watchEffect, ref } from '@vue/composition-api';
import dayjs from 'dayjs';
import useFormat from './useFormat';
import useVModel from '../../hooks/useVModel';
import { TdDatePickerProps } from '../type';

export default function useSingleValue(props: TdDatePickerProps) {
  const { value: valueFromProps } = toRefs(props);
  const [value, onChange] = useVModel(valueFromProps, props.defaultValue, props.onChange, 'change');

  const { isValidDate, formatDate, formatTime } = useFormat({
    value: value.value,
    mode: props.mode,
    format: props.format,
    valueType: props.valueType,
    enableTimePicker: props.enableTimePicker,
  });

  const time = ref(formatTime(value.value));
  const month = ref<number>(dayjs(value.value).month() || new Date().getMonth());
  const year = ref<number>(dayjs(value.value).year() || new Date().getFullYear());
  const cacheValue = ref(formatDate(value.value)); // 缓存选中值，panel 点击时更改

  // 输入框响应 value 变化
  watchEffect(() => {
    if (!value.value) {
      cacheValue.value = '';
      return;
    }
    if (!isValidDate(value.value, 'valueType')) return;

    cacheValue.value = formatDate(value.value);
    time.value = formatTime(value.value);
  });

  return {
    year,
    month,
    value,
    time,
    cacheValue,
    onChange,
  };
}
