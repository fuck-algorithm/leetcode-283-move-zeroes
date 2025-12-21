# Requirements Document

## Introduction

本文档定义了 LeetCode 283 "移动零" 算法可视化教学网站的增强需求。该项目是一个基于 TypeScript + React + D3.js 的单屏幕算法演示应用，旨在通过分步动画帮助用户理解双指针算法的执行过程。项目部署在 GitHub Pages 上，GitHub 仓库地址为 https://github.com/fuck-algorithm/leetcode-283-move-zeroes。

## Glossary

- **Algorithm_Visualizer**: 算法可视化系统，负责以动画形式展示算法执行步骤
- **Canvas**: 画布组件，用于绑定 D3.js 渲染算法动画的主要区域
- **Step**: 算法执行的单个步骤/分镜，包含数组状态、指针位置、操作类型等信息
- **Code_Display**: 代码展示组件，显示多语言算法代码并支持行高亮和变量值显示
- **Control_Panel**: 播放控制面板，提供播放/暂停/步进等控制功能
- **Progress_Bar**: 进度条组件，支持拖拽调整播放进度
- **IndexedDB_Cache**: 基于 IndexedDB 的本地缓存系统，用于存储用户偏好和 GitHub Star 数
- **GitHub_Badge**: GitHub 徽标组件，显示仓库链接和 Star 数量
- **Data_Input**: 数据输入组件，支持用户自定义输入、预设样例和随机生成
- **Language_Selector**: 编程语言选择器，支持 Java、Python、Golang、JavaScript 四种语言
- **Algorithm_Explanation**: 算法思路弹窗，展示当前算法的解题思路
- **WeChat_Float**: 微信交流群悬浮球组件

## Requirements

### Requirement 1: 页面标题与题目链接

**User Story:** 作为用户，我希望页面标题与 LeetCode 题目保持一致，以便快速识别当前演示的算法题目。

#### Acceptance Criteria

1. WHEN the page loads, THE Algorithm_Visualizer SHALL display the title "283. 移动零" at the top of the page with the problem number and Chinese title.
2. WHEN a user clicks on the title, THE Algorithm_Visualizer SHALL open the LeetCode problem page (https://leetcode.cn/problems/move-zeroes/) in a new browser tab.
3. WHEN the page renders, THE Algorithm_Visualizer SHALL set the browser tab title to "283. 移动零 - 算法可视化".

### Requirement 2: GitHub 徽标与 Star 数显示

**User Story:** 作为用户，我希望看到 GitHub 仓库链接和 Star 数，以便了解项目热度并支持项目。

#### Acceptance Criteria

1. WHEN the page loads, THE GitHub_Badge SHALL display a GitHub icon in the top-right corner of the page.
2. WHEN a user clicks on the GitHub icon, THE GitHub_Badge SHALL open the repository URL (https://github.com/fuck-algorithm/leetcode-283-move-zeroes) in a new browser tab.
3. WHEN the page loads, THE GitHub_Badge SHALL fetch the Star count from GitHub API and display it next to the icon.
4. WHEN fetching Star count, THE IndexedDB_Cache SHALL cache the result for one hour to avoid repeated API calls.
5. IF the GitHub API request fails, THEN THE GitHub_Badge SHALL display the cached Star count from IndexedDB_Cache.
6. IF no cached Star count exists and the API request fails, THEN THE GitHub_Badge SHALL display "0" as the default value.
7. WHEN a user hovers over the GitHub icon, THE GitHub_Badge SHALL display a tooltip prompting "点击去 GitHub 仓库 Star 支持一下".

### Requirement 3: 算法思路展示

**User Story:** 作为用户，我希望能够查看算法的解题思路，以便更好地理解算法原理。

#### Acceptance Criteria

1. WHEN the page loads, THE Algorithm_Visualizer SHALL display an "算法思路" button to the left of the GitHub icon.
2. WHEN a user clicks the "算法思路" button, THE Algorithm_Explanation SHALL display a modal dialog containing the algorithm explanation.
3. WHEN the modal is open, THE Algorithm_Explanation SHALL display the two-pointer swap algorithm explanation with time complexity O(n) and space complexity O(1).
4. WHEN a user clicks outside the modal or presses Escape, THE Algorithm_Explanation SHALL close the modal dialog.

### Requirement 4: 数据输入与验证

**User Story:** 作为用户，我希望能够输入自定义数据或选择预设样例，以便测试不同输入下的算法执行过程。

#### Acceptance Criteria

1. WHEN the page loads, THE Data_Input SHALL display an input area below the title with compact layout.
2. WHEN a user enters custom data, THE Data_Input SHALL validate the input format as a comma-separated list of integers.
3. IF the user input contains invalid characters or format, THEN THE Data_Input SHALL display an error message and reject the input.
4. WHEN validating input, THE Data_Input SHALL verify that array length is between 1 and 10000 (inclusive) per LeetCode constraints.
5. WHEN validating input, THE Data_Input SHALL verify that each element value is within the 32-bit signed integer range.
6. WHEN the page loads, THE Data_Input SHALL display preset example buttons (e.g., [0,1,0,3,12], [0], [1,2,3]) as flat clickable options.
7. WHEN a user clicks a preset example button, THE Data_Input SHALL populate the input with that example data.
8. WHEN a user clicks the "随机生成" button, THE Data_Input SHALL generate a valid random array conforming to LeetCode constraints.
9. WHEN generating random data, THE Data_Input SHALL produce arrays with length between 1 and 20 containing integers between -100 and 100 with at least one zero.

### Requirement 5: 多语言代码展示与调试效果

**User Story:** 作为用户，我希望查看多种编程语言的算法代码，并看到类似调试器的执行效果。

#### Acceptance Criteria

1. WHEN the page loads, THE Code_Display SHALL display algorithm code with syntax highlighting.
2. WHEN the page loads, THE Language_Selector SHALL provide options for Java, Python, Golang, and JavaScript languages.
3. WHEN a user selects a different language, THE Code_Display SHALL switch to display the corresponding language code.
4. WHEN a user selects a language, THE IndexedDB_Cache SHALL store the selection and restore it on next page load.
5. WHEN an algorithm step executes, THE Code_Display SHALL highlight the corresponding code line(s) with a distinct background color.
6. WHEN an algorithm step executes, THE Code_Display SHALL display current variable values (slow, fast, array state) inline after the relevant code lines.
7. WHEN displaying code, THE Code_Display SHALL show line numbers on the left side of each line.
8. WHEN displaying code, THE Code_Display SHALL maintain proper indentation without alignment issues.
9. WHEN displaying code, THE Code_Display SHALL size the code container to avoid horizontal and vertical scrollbars when possible.

### Requirement 6: 画布与可视化

**User Story:** 作为用户，我希望在画布上看到算法执行的详细动画，包括数据结构变化和状态转移。

#### Acceptance Criteria

1. WHEN the page loads, THE Canvas SHALL occupy the majority of the page space as the primary visualization area.
2. WHEN displaying the visualization, THE Canvas SHALL support pan (drag) and zoom (scroll) interactions.
3. WHEN an algorithm step executes, THE Canvas SHALL display array elements with distinct colors for zero (gray) and non-zero (blue) values.
4. WHEN an algorithm step executes, THE Canvas SHALL display slow and fast pointer positions with labeled indicators.
5. WHEN a swap operation occurs, THE Canvas SHALL animate the element exchange with arrow indicators showing the data flow direction.
6. WHEN a swap operation occurs, THE Canvas SHALL display text labels describing the operation (e.g., "交换 nums[0] 和 nums[2]").
7. WHEN displaying elements, THE Canvas SHALL position elements with adequate spacing to prevent overlap.
8. WHEN the array size changes, THE Canvas SHALL auto-scale the view to fit all elements within the visible area.
9. WHEN an algorithm step executes, THE Canvas SHALL display step-specific annotations above or beside relevant elements.

### Requirement 7: 播放控制面板

**User Story:** 作为用户，我希望能够控制算法动画的播放，包括播放/暂停、步进和速度调节。

#### Acceptance Criteria

1. WHEN the page loads, THE Control_Panel SHALL display "上一步" button with "←" label indicating the left arrow keyboard shortcut.
2. WHEN the page loads, THE Control_Panel SHALL display "下一步" button with "→" label indicating the right arrow keyboard shortcut.
3. WHEN the page loads, THE Control_Panel SHALL display "播放/暂停" button with "空格" label indicating the space keyboard shortcut.
4. WHEN the page loads, THE Control_Panel SHALL display "重置" button with "R" label indicating the R key keyboard shortcut.
5. WHEN a user presses the left arrow key, THE Control_Panel SHALL execute the previous step action.
6. WHEN a user presses the right arrow key, THE Control_Panel SHALL execute the next step action.
7. WHEN a user presses the space key, THE Control_Panel SHALL toggle between play and pause states.
8. WHEN a user presses the R key, THE Control_Panel SHALL reset the animation to the initial state.
9. WHEN the page loads, THE Control_Panel SHALL display a custom speed selector with default value 1.0x.
10. WHEN a user changes the playback speed, THE IndexedDB_Cache SHALL store the selection and restore it on next page load.
11. WHEN the page loads, THE Progress_Bar SHALL display at the bottom of the Control_Panel spanning 100% width.
12. WHEN displaying progress, THE Progress_Bar SHALL show played portion in green and unplayed portion in gray.
13. WHEN a user drags the Progress_Bar, THE Algorithm_Visualizer SHALL jump to the corresponding step position.

### Requirement 8: 微信交流群悬浮球

**User Story:** 作为用户，我希望能够加入算法交流群与其他学习者交流。

#### Acceptance Criteria

1. WHEN the page loads, THE WeChat_Float SHALL display a floating button with "交流群" text in the bottom-right corner.
2. WHEN a user hovers over the floating button, THE WeChat_Float SHALL display the WeChat QR code image.
3. WHEN displaying the QR code, THE WeChat_Float SHALL maintain the original image aspect ratio without distortion.
4. WHEN displaying the QR code, THE WeChat_Float SHALL show a prompt "微信扫码发送'leetcode'加入算法交流群".

### Requirement 9: 算法步骤分镜与代码行绑定

**User Story:** 作为用户，我希望算法步骤与代码行精确对应，以便理解每行代码的执行效果。

#### Acceptance Criteria

1. WHEN generating algorithm steps, THE Algorithm_Visualizer SHALL create detailed step breakdowns including initialization, comparison, swap, pointer movement, and completion phases.
2. WHEN generating algorithm steps, THE Algorithm_Visualizer SHALL bind each step to corresponding code line numbers for all supported languages.
3. WHEN switching languages, THE Code_Display SHALL maintain correct step-to-line binding for the selected language.
4. WHEN an algorithm step executes, THE Code_Display SHALL highlight all bound code lines for the current step.
5. WHEN displaying step information, THE Algorithm_Visualizer SHALL show descriptive text explaining the current operation.

### Requirement 10: 页面配色与样式

**User Story:** 作为用户，我希望页面配色协调美观，提供良好的视觉体验。

#### Acceptance Criteria

1. WHEN rendering the page, THE Algorithm_Visualizer SHALL use a coordinated color scheme across all components.
2. WHEN rendering the page, THE Algorithm_Visualizer SHALL NOT use any purple colors in any component.
3. WHEN rendering the page, THE Algorithm_Visualizer SHALL maintain a single-screen layout without page scrolling for standard viewport sizes.

### Requirement 11: 部署与 CI/CD

**User Story:** 作为开发者，我希望代码提交后自动部署到 GitHub Pages，以便快速发布更新。

#### Acceptance Criteria

1. WHEN code is pushed to the main branch, THE GitHub_Action SHALL automatically build and deploy to GitHub Pages.
2. WHEN building the project, THE GitHub_Action SHALL verify no compilation errors exist before deployment.
3. WHEN building the project, THE GitHub_Action SHALL verify no linter errors exist before deployment.

### Requirement 12: 端口配置

**User Story:** 作为开发者，我希望开发服务器使用非默认端口，以避免与其他服务冲突。

#### Acceptance Criteria

1. WHEN starting the development server, THE Algorithm_Visualizer SHALL use a random port between 30000 and 65535 instead of the default port 3000.

### Requirement 13: README 文档

**User Story:** 作为访问者，我希望 README 简洁明了，快速了解项目用途和访问方式。

#### Acceptance Criteria

1. WHEN viewing the README, THE documentation SHALL clearly state this is a visualization for LeetCode 283 "移动零" problem.
2. WHEN viewing the README, THE documentation SHALL provide a direct link to the deployed GitHub Pages site.
