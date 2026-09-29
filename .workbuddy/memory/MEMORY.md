# Tutorial 项目长期记忆

## 项目概述
- 项目路径：`C:\Users\Gove2\Desktop\Tutorial\`
- 教程合集，包含 8 个教程系列
- Mirror 教程位于 `unity-mirror-networking/` 目录，共 10 章

## 离散数学教程（2026-09-12）
- 新建 `discrete-math-tutorial/`，蓝本屈婉玲/耿素云/张立昂《离散数学》，共 15 章
- 结构：数理逻辑(01-04)、集合论(05-08)、代数结构(09-11)、图论(12-14)、组合计数(15)
- 风格 theme-math（纸质感衬线体，棕 #8b4513）；数学符号用 Unicode+HTML，无 MathJax 依赖，离线可开
- 每章含定义/定理框、例题、易错点 callout、自测题（details 折叠答案）、上下章导航

## Mirror 96 重写工作
- 全部 10 章（含 index.html）已于 2026-07-31 按 Mirror 96.x（v96.11.1+）完成重写
- 每章添加了 "Mirror 96 API 更新" callout 说明主要变化
- 每章更新了自测题，加入 "Mirror 96 变化题"
- 保持了原有 HTML 结构、Prism.js 代码高亮、theme-tech 样式

## PyTorch 强化学习教程（2026-08-03）
- 新建 `pytorch-rl-tutorial/` 目录，共 12 章
- 覆盖：MDP 基础 → Q-Learning/DQN → REINFORCE → A2C → PPO → 探索策略 → 实战 → 分布式
- 主题风格：theme-tech（红色系，匹配 PyTorch 品牌色）
- 包含完整 PyTorch 代码实现、Gymnasium 环境训练、自定义环境定义

## Mirror 96 重写工作
- 全部 10 章（含 index.html）已于 2026-07-31 按 Mirror 96.x（v96.11.1+）完成重写
- 每章添加了 "Mirror 96 API 更新" callout 说明主要变化
- 每章更新了自测题，加入 "Mirror 96 变化题"
- 保持了原有 HTML 结构、Prism.js 代码高亮、theme-tech 样式

## Mirror 96 关键 API 变更（供后续参考）
- `hasAuthority` → `isOwned`
- `[Command]`/`[ClientRpc]` 方法前缀（Cmd/Rpc）从必需变为可选
- `[ServerCallback]` = `[Server]` 但不输出警告（非"跳过网络层"）
- `[Command(requiresAuthority = false)]` / `[ClientRpc(includeOwner = false)]` 新选项
- `NetworkConnectionToClient sender = null` Command 可选参数
- SyncVar hook 双参数 `(T oldValue, T newValue)`
- `SyncList<T>` 泛型化，事件回调（OnAdd/OnInsert/OnSet/OnRemoveAt/OnClear）
- `Transport` 抽象类（非 ITransport 接口）
- `ClientScene` 合并入 `NetworkClient`
- `AssignClientAuthority` / `RemoveClientAuthority`
- `NetworkClient.Connect(string address)` 只接受字符串
- `NetworkManager` 回调：`OnStartServer()` / `OnStartClient()`
- `playerPrefab` 字段设置（无 `AddPlayerPrefab()`）
- 自定义消息 `struct : INetworkMessage`（非 `class : MessageBase`）
- GitHub: `https://github.com/MirrorNetworking/Mirror`

## 用户兴趣画像（基于桌面文件推断，2026-08-04）
- 身份线索：疑似大数据专业本科生（桌面有「大数据231成员信息统计」「副本2023级成绩一览」「培养方案」「小学期.xls」「副本实习生应聘登记表」）
- 核心主线 = 游戏开发：装有 Unity / Godot 4.6.2 / UE，研究 DOTS、Compute Shader、Mirror、Lua 脚本、游戏 Mod（tModLoader、Noita、缺氧、Slay the Spire 2）
- 系统/底层偏好强信号：桌面有 `build-your-own-x` 与 `project-based-learning` README、`C++八股文.pdf`、`算法` 夹
- 游戏逆向/安全独特信号：同时装有 dnSpy / ILSpy / Cheat Engine / AssetStudio / gdre_tools / 中文输入法工程夹
- AI/ML：独立 `Pytorch` 资料夹、收藏「吴翼深度学习公开课」、有 `论文` 夹；已做 PyTorch RL 教程
- 已建 7 套教程：Lua(13)、Network(6)、compute-shader(10)、ecs-dot(10)、software-engineering(10)、unity-mirror(10)、pytorch-rl(12)
- 给用户推教程话题时的优先候选（信号最强且现有教程未覆盖）：Unity Shader 编程、Build Your Own X、游戏逆向工程、现代 C++、中文输入法原理、PyTorch 深度学习基础、程序化生成、DOTS Netcode
