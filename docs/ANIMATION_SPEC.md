# LeetCode 283「移动零」动画规格

## 目标与可观察状态

画布重放预生成的 `AlgorithmStep[]` 快照；UI 不重新执行算法。每帧展示固定数组槽位、`slow` 写入指针、`fast` 扫描指针、当前比较对象、已保留的非零前缀和累计交换次数。数据值在槽位间交换，槽位本身不变。

## 步骤与教学焦点

| 操作 | 状态变化 | 代码锚点 | 说明 |
| --- | --- | --- | --- |
| init | 数组原样出现，slow 指向 0 | 初始化 | slow 表示下一个非零值的目标位置 |
| compare | fast 对应元素成为唯一焦点 | for / if | 判断当前值是否为零以及是否应保留 |
| swap | 非零值换到 slow 槽位，零移至扫描位置 | swap 行 | 只在 slow 与 fast 不同且值非零时发生 |
| move | slow 前进，已处理前缀留痕 | slow++ | 为后续非零值留出写入位置 |
| done | 所有非零值稳定在前缀，零位于末尾 | 函数完成 | 展示操作数和最终结果 |

每步均绑定 `operation`、自然语言 `narration`、至少一个稳定 `anchorIds` 与最多两个 `focusIndices`；数组主结构的稳定 ID 为 `array-slot-{index}`，坐标使用 `startX + index * (elementWidth + spacing)`，除容器尺寸或输入长度变化外不随机重排。`compare` 帧最多一个比较焦点，`swap_execute` 帧突出两个交换对象，焦点离开后由已处理前缀持续标为 `visited`，最终帧全部转为 `done` 并显示勾号。

## 视觉语义

- slow：深青绿圆形指针；fast：赭金色圆形指针。
- compare：暖黄色填充 + 粗描边；visited/已处理前缀：浅青绿 + 对勾；零值：中性灰色；普通非零值：低饱和绿灰。
- 固定图例持续显示 slow、fast、compare、processed、zero；文字/符号与色彩并用。
- 画布教学层固定包含步骤编号、operation 徽标、解说、fast/slow/交换/已保留指标。
- 交换箭头标注具体写入值；步骤解说解释操作与原因。

## 镜头与动效

D3 仅负责缩放和平移。初次显示、画布尺寸变化和输入数组长度变化时 fit；普通步进不重置镜头。数组槽位由 React keyed elements 复用，不由 D3 与 React 同时管理同一 SVG 子树。

统一时长由 `src/utils/motion.ts` 的 `MOTION` token 提供：状态 240ms、移动 360ms、退场 180ms、箭头 420ms、镜头 fit 260ms；统一 `motionDuration` 按速度缩放并限制在停留时间的 55% 内。1x 播放停留 1000ms，3x 播放停留约 333ms。`prefers-reduced-motion: reduce` 时 CSS 动画/过渡关闭且 D3 镜头过渡时长为 0，步骤数据、焦点、解说与图例仍立即更新。跳步通过 React 的稳定 `array-slot-{index}` keyed 节点更新快照，不重建 SVG 树；镜头只在视口/输入长度变化时 fit。

## 限制

演示输入数组限制为 1–20 个元素，避免数组过宽及 O(步骤数 × 数组长度) 的快照内存放大。LeetCode 数值域仍限制为 signed 32-bit integer。更长数组可在未来引入视窗裁剪/虚拟化后再评估。
