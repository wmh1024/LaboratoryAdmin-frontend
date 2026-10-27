# 后端接口契约

> 本文件是前后端唯一契约来源。`src/api/*` 与 `src/mock/*` 均以此为准。
> 基础路径：`VITE_API_BASE_URL`，默认 `/api`。以下路径均省略该前缀。

## 1. 通用约定

### 1.1 响应结构

所有接口返回 JSON：

```json
{
    "code": 200,
    "msg": "操作成功",
    "data": {}
}
```

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `code` | number | 业务码。`200` 表示成功，其余为失败 |
| `msg` | string | 面向用户的提示信息 |
| `data` | any | 业务数据，失败时为 `null` |

- 前端仅以 `code === 200` 判定成功。
- 失败时 HTTP 状态码与 `code` 保持一致，便于网关与前端统一处理。
- 不允许返回 `data` 为 `undefined`；无数据时返回 `null`。

### 1.2 错误码

| HTTP / code | 含义 |
| --- | --- |
| `200` | 成功 |
| `400` | 参数缺失或格式错误 |
| `401` | 未登录、令牌无效或已失效 |
| `403` | 已登录但无操作权限 |
| `404` | 资源或接口不存在 |
| `500` | 服务端异常 |

### 1.3 认证与授权

- 登录成功返回不透明令牌 `data.token`。
- 除 `POST /admin/login` 与 `POST /admin/logout` 外，所有接口必须携带：

```http
Authorization: Bearer <token>
```

- 令牌缺失、伪造或已注销：返回 `401`。前端会清除本地登录态并跳转登录页。
- 写操作（`add` / `update` / `delete`）仅允许「院长」（`status === 0`），否则返回 `403`。
- 密码为**只写字段**：请求可传，任何响应都不得返回 `password`。

### 1.4 分页

请求参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `page` | number | 是 | 页码，从 `1` 开始 |
| `pageSize` | number | 否 | 每页条数，默认 `10`，有效范围 `1-100` |

响应 `data`：

```json
{
    "items": [],
    "counts": 0
}
```

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `items` | array | 当前页数据 |
| `counts` | number | 总条数 |

### 1.5 批量删除

```http
DELETE /<resource>/delete?ids=1,2,3
```

- `ids` 为必填的逗号分隔正整数，至少包含一个 ID。
- 缺失或为空返回 `400`。
- 不存在的 ID 会被忽略，接口仍返回成功。

### 1.6 枚举

**管理员角色 `status` / 实验室类别权限 `categoryStatus`**

| 值 | 含义 |
| --- | --- |
| `0` | 院长 |
| `1` | 主任 |
| `2` | 指导老师 |
| `3` | 负责人 |

**用户职位 `positionStatus`**

| 值 | 含义 |
| --- | --- |
| `0` | 学生 |
| `1` | 教职工 |

**预约状态 `status`**

| 值 | 含义 |
| --- | --- |
| `0` | 审批通过 |
| `1` | 指导教师未通过 |
| `2` | 主任未通过 |
| `3` | 院长未通过 |

**用户违规状态 `violationStatus`**

| 值 | 含义 |
| --- | --- |
| `0` | 无违规 |
| `1` | 现有违规 |

## 2. 数据模型

> `id` 均由服务端生成，客户端提交时会被忽略。`createdAt` / `updatedAt` 等审计字段如后续新增，同样由服务端维护。

### 2.1 User（用户）

| 字段 | 类型 | 必填 | 只读 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | number | - | ✅ | 主键 |
| `username` | string | ✅ | - | 学号 / 工号，唯一 |
| `name` | string | ✅ | - | 姓名 |
| `positionStatus` | number | ✅ | - | 职位枚举 |
| `className` | string | - | - | 专业班级 / 部门 |
| `violationCount` | number | - | ✅ | 违规次数，由服务端统计 |
| `violationStatus` | number | - | ✅ | 违规状态，由服务端维护 |
| `password` | string | 新增必填 | 写 | 密码，最短 6 位；更新时留空表示不修改 |

### 2.2 Admin（管理员）

| 字段 | 类型 | 必填 | 只读 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | number | - | ✅ | 主键 |
| `username` | string | ✅ | - | 登录账号，唯一 |
| `name` | string | ✅ | - | 姓名 |
| `status` | number | ✅ | - | 角色枚举 |
| `phone` | string | - | - | 联系电话 |
| `password` | string | 新增必填 | 写 | 密码，最短 6 位；更新时留空表示不修改 |

### 2.3 LabCategory（实验室类别）

| 字段 | 类型 | 必填 | 只读 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | number | - | ✅ | 主键 |
| `categoryName` | string | ✅ | - | 类别名称 |
| `categoryStatus` | number | ✅ | - | 类别权限（管理员角色枚举） |

### 2.4 Laboratory（实验室）

| 字段 | 类型 | 必填 | 只读 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | number | - | ✅ | 主键 |
| `laboratoryName` | string | ✅ | - | 实验室名称 |
| `laboratoryLocation` | string | ✅ | - | 位置 |
| `laboratoryType` | string | ✅ | - | 类型 |
| `laboratoryCategory` | number | ✅ | - | 所属类别 ID |
| `laboratoryDirectorId` | number | - | - | 审核人（管理员 ID） |
| `laboratoryHeadId` | number | - | - | 负责人（管理员 ID） |
| `laboratoryCount` | number | - | ✅ | 使用次数，新增时由服务端置 `0` |

### 2.5 LabRecord（实验室预约记录）

预约记录当前仅提供只读查询。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | number | 主键 |
| `laboratoryId` | number | 实验室 ID |
| `laboratoryName` | string | 实验室名称（冗余快照） |
| `className` | string | 预约班级 |
| `userName` | string | 预约用户姓名（冗余快照） |
| `useTime` | string | 使用日期，`YYYY-MM-DD` |
| `startCourseNumber` | number | 开始节次 |
| `endCourseNumber` | number | 结束节次 |
| `teacherId` | number | 指导教师 ID |
| `presidentId` | number | 审核院长 ID |
| `directorId` | number | 审核主任 ID |
| `useTo` | string | 用途 |
| `status` | number | 预约状态枚举 |
| `teacherFailReason` | string | 指导教师拒绝原因 |
| `directorFailReason` | string | 主任拒绝原因 |
| `presidentFailReason` | string | 院长拒绝原因 |

## 3. 接口清单

| 方法 | 路径 | 权限 | 说明 |
| --- | --- | --- | --- |
| POST | `/admin/login` | 公开 | 登录 |
| POST | `/admin/logout` | 公开 | 注销当前令牌（幂等） |
| GET | `/user/list` | 登录 | 用户分页列表 |
| GET | `/user/find/{id}` | 登录 | 用户详情 |
| POST | `/user/add` | 院长 | 新增用户 |
| PUT | `/user/update` | 院长 | 修改用户 |
| DELETE | `/user/delete?ids=` | 院长 | 批量删除用户 |
| GET | `/admin/list` | 登录 | 管理员分页列表 |
| GET | `/admin/find/{id}` | 登录 | 管理员详情 |
| POST | `/admin/add` | 院长 | 新增管理员 |
| PUT | `/admin/update` | 院长 | 修改管理员 |
| DELETE | `/admin/delete?ids=` | 院长 | 批量删除管理员 |
| GET | `/lab/category/list` | 登录 | 实验室类别分页列表 |
| GET | `/lab/category/find/{id}` | 登录 | 实验室类别详情 |
| POST | `/lab/category/add` | 院长 | 新增类别 |
| PUT | `/lab/category/update` | 院长 | 修改类别 |
| DELETE | `/lab/category/delete?ids=` | 院长 | 批量删除类别 |
| GET | `/laboratory/list` | 登录 | 实验室分页列表 |
| GET | `/laboratory/find/{id}` | 登录 | 实验室详情 |
| POST | `/laboratory/add` | 院长 | 新增实验室 |
| PUT | `/laboratory/update` | 院长 | 修改实验室 |
| DELETE | `/laboratory/delete?ids=` | 院长 | 批量删除实验室 |
| GET | `/laboratory/record/list` | 登录 | 预约记录分页列表 |
| GET | `/laboratory/record/find/{id}` | 登录 | 预约记录详情 |

> 实验室详情统一使用 `/laboratory/find/{id}`。历史拼写 `findl` 已废弃，不保证兼容。

## 4. 接口明细

### 4.1 登录

```http
POST /admin/login
Content-Type: application/json

{ "username": "demo_admin", "password": "demo1234" }
```

成功：

```json
{ "code": 200, "msg": "操作成功", "data": { "token": "<token>" } }
```

失败：`400`（用户名或密码为空）、`401`（账号或密码错误）。

### 4.2 注销

```http
POST /admin/logout
Authorization: Bearer <token>
```

幂等：无论令牌是否有效都返回 `200`，服务端在令牌有效时将其作废。

### 4.3 列表 / 详情

以管理员为例，其余资源结构一致：

```http
GET /admin/list?page=1&pageSize=10
GET /admin/find/2
```

`GET /admin/list` 成功：

```json
{
    "code": 200,
    "msg": "操作成功",
    "data": {
        "items": [
            { "id": 1, "username": "demo_admin", "name": "演示管理员", "status": 0, "phone": "199-0000-0001" }
        ],
        "counts": 1
    }
}
```

`GET /admin/find/{id}` 成功时 `data` 为单个对象；不存在时返回 `404`。

### 4.4 新增 / 修改

```http
POST /admin/add
PUT /admin/update
Content-Type: application/json

{ "username": "demo_new", "name": "新管理员", "status": 1, "password": "123456" }
```

- `PUT` 必须携带 `id`，其余字段按需提交。
- 只处理白名单字段；`id`、`violationCount`、`violationStatus`、`laboratoryCount` 等只读字段会被忽略。
- 更新时 `password` 缺省或为空字符串表示不修改密码。
- 成功时 `data` 为保存后的对象（不含 `password`）。
- 成功提示：新增 `msg = 添加成功`，修改 `msg = 修改成功`。

### 4.5 删除

```http
DELETE /user/delete?ids=1,2
```

成功时 `data` 为 `null`、`msg = 删除成功`；`ids` 缺失或为空返回 `400`。

## 5. Mock 实现说明

- Mock 服务（`src/mock/server.js`）实现本契约的全部接口，数据保存在内存中，重启后恢复种子数据。
- 离线演示仅接受固定账号：`demo_admin` / `demo1234`。真实后端应按 `Admin.username` 与密码校验，并签发自己的令牌。
- Mock 同样校验 Bearer 令牌与院长权限，失败返回 `401` / `403`，以便前端鉴权逻辑在无后端时也可验证。
- 生产构建会排除 Mock；纯静态演示请使用 `npm run build:demo`。
