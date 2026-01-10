<template>
    <div>
        <n-scrollbar x-scrollable style="max-width: 100%">
            <div v-if="loading" style="text-align: center; padding: 20px;">
                <n-spin size="small" />
                <span style="margin-left: 8px;">加载热力图数据中...</span>
            </div>
            <n-heatmap 
                v-else
                :value="heatmapData" 
                :label="label"
                :tooltip="tooltipConfig"
                :active-colors="customActiveColors" 
                :minimum-color="minimumColor"
                :data="rawData"
            >
                <template #tooltip="{ timestamp: date, value: tooltipValue }">
                    <div style="padding: 8px; min-width: 160px;">
                        <n-divider style="margin: 6px 0;" />
                        <div style="color: #666; margin-bottom: 4px;">
                            {{ formatDate(date) }}
                        </div>
                        <div style="display: flex; align-items: center; justify-content: space-between;">
                            <span style="color: #666;">完成任务:</span>
                            <n-tag :type="getValueType(tooltipValue)" size="small">
                                {{ tooltipValue ?? 0 }} 个
                            </n-tag>
                        </div>
                    </div>
                </template>
            </n-heatmap>
        </n-scrollbar>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import {
    NHeatmap,
    NScrollbar,
    NDivider,
    NTag,
    NSpin
} from 'naive-ui'
import service from '../../utils/request';

// 响应式数据
const loading = ref(false)
const rawData = ref([])

// 配置项
const customActiveColors = ref(["#9be9a8", "#40c463", "#30a14e", "#216e39"])
const minimumColor = ref("#ebedf0")
const label = ref('完成任务')
const tooltipConfig = ref({ 
    placement: 'bottom', 
    delay: 500 
})

// 转换数据格式以适应 n-heatmap
const heatmapData = computed(() => {
    if (!rawData.value || rawData.value.length === 0) {
        return []
    }
    
    return rawData.value.map(item => ({
        timestamp: Number(item.date), // 确保时间戳是数字
        value: item.value ?? 0
    }))
})

// 获取热力图数据
onMounted(async () => {
    loading.value = true
    try {
        const user = JSON.parse(localStorage.getItem("user"))
        if (!user || !user.id) {
            console.error('用户信息不存在')
            return
        }

        const response = await service.get(`/api/user/task/heatmap`, {
            params: { userId: user.id }
        })
        
        rawData.value = response.data || []
        console.log('热力图数据:', rawData.value)
        
    } catch (error) {
        console.error('获取热力图数据失败:', error)
        rawData.value = []
    } finally {
        loading.value = false
    }
})

// 格式化日期显示
const formatDate = (timestamp) => {
    if (!timestamp) return "未知日期"
    try {
        const date = new Date(Number(timestamp))
        return date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long'
        })
    } catch (error) {
        console.error('日期格式化错误:', error)
        return "日期格式错误"
    }
}

// 根据值获取标签类型
const getValueType = (value) => {
    if (!value || value === 0) return 'default'
    if (value <= 3) return 'info'
    if (value <= 5) return 'success'
    if (value <= 8) return 'warning'
    return 'error'
}
</script>

<style scoped>
/* 自定义样式 */
.n-heatmap {
    margin: 20px 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .n-card {
        margin: 10px;
    }
}
</style>