var e = {
	views: { "00-quota-link": { title: "额度查询" } },
	pages: { "00-quota-link": { title: "额度查询" } },
	strings: /* @__PURE__ */ JSON.parse("{\"alert.account_missing\":\"未找到该预警账户。\",\"alert.account_unqueryable\":\"账户尚不可查询；请先核对账户启用状态和查询配置。\",\"alert.admins.count\":\"{count} 位 QQ 用户 · 仅私聊显示\",\"alert.admins.host_admin_note\":\"AstrBot 内置管理员也可管理。\",\"alert.admins.permissions\":\"管理权限\",\"alert.admins.qq_list\":\"QQ 白名单\",\"alert.admins.separate_permissions\":\"额度查询与推送收件权限分别配置。\",\"alert.admins.title\":\"预警 QQ 管理白名单\",\"alert.command.account_candidate_required\":\"请指定账户与候选 ID。\",\"alert.command.account_not_unique\":\"账户不存在或名称不唯一，请使用管理页中的账户 ID。\",\"alert.command.account_required\":\"请指定账户。\",\"alert.command.admin_required\":\"无权管理额度预警；需要预警 QQ 白名单或 AstrBot 内置管理员权限。\",\"alert.command.extra_arguments\":\"该预警命令不接受附加参数。\",\"alert.command.help_syntax\":\"用法：/yql alert help [account|units|targets]。\",\"alert.command.interval_range\":\"间隔必须是范围内的整数分钟。\",\"alert.command.invalid_arguments\":\"预警命令参数无效；请私聊使用 /yql alert help。\",\"alert.command.invalid_target_arguments\":\"目标命令参数无效。\",\"alert.command.latest_candidate_required\":\"请选择最新单位候选 ID。\",\"alert.command.mention_syntax\":\"提及必须写成 @QQ号；不支持昵称、@all 或 CQ 代码。\",\"alert.command.parameters_required\":\"请指定账户及必要参数。\",\"alert.command.private_help\":\"预警管理：请私聊机器人使用 /yql alert help 查看详细配置用法。\",\"alert.command.private_status\":\"预警详细状态和目标名单仅在私聊显示，请私聊机器人执行此命令。\",\"alert.command.qq_not_allowlisted\":\"该 QQ 号不在预警管理白名单中。\",\"alert.command.resumed\":\"已恢复检查。\",\"alert.command.save_failed\":\"预警配置未保存；请私聊查看用法或在管理页修正配置。\",\"alert.command.saved\":\"预警配置已保存。\",\"alert.command.saved_private\":\"预警配置已保存。详细状态请私聊查看。\",\"alert.command.target_missing\":\"目标 ID 不存在；请私聊使用 targets list。\",\"alert.command.targets_syntax\":\"请使用 targets list/add/addhere/remove。\",\"alert.command.unsupported_official_scene\":\"当前会话不是受支持的官方 QQ 群聊或个人私聊。频道及频道私信无法添加。\",\"alert.command.threshold_syntax\":\"用法：threshold \\\"账户名\\\" 金额 [指标ID]。\",\"alert.command.too_long\":\"预警命令过长。\",\"alert.command.unclosed_quote\":\"引号未配对；多词账户名请使用双引号。\",\"alert.command.unit_confirmed\":\"单位已确认。\",\"alert.command.unknown\":\"未知预警命令；使用 /yql alert help 查看用法。\",\"alert.command.untrusted_session\":\"宿主没有提供可信当前会话，未保存目标。\",\"alert.command.value_required\":\"请指定账户及数值。\",\"alert.delivery.budget\":\"配置已变更或发送预算暂不可用\",\"alert.delivery.cancelled\":\"配置已变更或预警已停止\",\"alert.delivery.failed\":\"平台未接受发送；冷却后可重试\",\"alert.delivery.fixed_hint\":\"会话 AI 不可用或生成内容未通过检查，已改用普通提醒\",\"alert.delivery.llm_changed\":\"会话模型或人格已变更，已改用普通提醒\",\"alert.delivery.llm_config_unavailable\":\"会话 AI 配置不可用，已改用普通提醒\",\"alert.delivery.llm_failed\":\"AI 提醒未能生成或未通过检查，已改用普通提醒\",\"alert.delivery.llm_locale_changed\":\"生成通知期间语言已更改，改用普通提醒\",\"alert.delivery.llm_model_unavailable\":\"会话模型不可用，已改用普通提醒\",\"alert.delivery.llm_nonlocal\":\"当前执行器不支持此人格提醒调用，已改用普通提醒\",\"alert.delivery.llm_not_called\":\"目标会话已停用或状态不可用，未调用 AI\",\"alert.delivery.llm_off\":\"会话 AI 已关闭，已改用普通提醒\",\"alert.delivery.llm_persona_unavailable\":\"会话人格不可用，已改用普通提醒\",\"alert.delivery.llm_session_unavailable\":\"目标会话已停用或状态不可用，未使用 AI 通知\",\"alert.delivery.llm_unavailable\":\"会话 AI 已关闭或状态不可用，已改用普通提醒\",\"alert.delivery.llm_webchat_persona\":\"会话使用专用 WebChat 人格，已改用普通提醒\",\"alert.delivery.legacy_target_unknown\":\"旧目标有一条无法匹配的发送记录，结果未知。余额恢复后，下一次进入低余额时才会向官方 QQ 目标发送\",\"alert.delivery.mention_invalid\":\"群目标或提及 QQ 号格式无效；请核对群会话标识和数字 QQ 号\",\"alert.delivery.mention_unsupported\":\"目标适配器或会话类型不支持 QQ 提及；请移除 @ 或使用 aiocqhttp 群目标\",\"alert.delivery.message_components_unavailable\":\"消息组件构造失败；请检查 AstrBot 消息组件接口\",\"alert.delivery.note_suffix\":\"；{note}\",\"alert.delivery.platform_not_found\":\"目标平台实例未找到；请核对 UMO 中的平台实例 ID\",\"alert.delivery.platform_unavailable\":\"目标平台实例状态不可用；请检查适配器是否正常运行\",\"alert.delivery.platform_unsupported\":\"目标平台不支持此主动发送接口；请更换支持的目标平台\",\"alert.delivery.session_check_failed\":\"无法确认目标会话状态；请检查 AstrBot 会话状态接口\",\"alert.delivery.session_disabled\":\"目标会话已停用；请在 AstrBot 中启用该会话后等待下次检查\",\"alert.delivery.submitted\":\"已提交平台；不代表最终送达\",\"alert.delivery.target_invalid\":\"目标 UMO 格式无效；请重新选择或填写完整会话标识\",\"alert.delivery.target_scene_required\":\"官方 QQ 目标缺少会话类型。请在全局设置补填，或在目标会话使用 /yql alert targets addhere\",\"alert.delivery.transport_unavailable\":\"宿主主动发送接口不可用；请检查 AstrBot 版本及平台适配器\",\"alert.delivery.unknown\":\"发送结果未知；为避免重复不自动重发\",\"alert.fact.line\":\"{name}：{balance}\",\"alert.fact.title\":\"【额度预警】\",\"alert.help.account_heading\":\"账户预警\",\"alert.help.account_rules\":\"账户规则\",\"alert.help.account_title\":\"账户预警规则\",\"alert.help.admin_note\":\"管理权限：预警 QQ 白名单或 AstrBot 内置管理员。详细状态和名单请私聊查看。\",\"alert.help.admins\":\"预警 QQ 白名单\",\"alert.help.admins_command\":\"/yql alert admins list|add QQ号|remove QQ号\",\"alert.help.admins_short\":\"管理白名单\",\"alert.help.bind\":\"确认单位\",\"alert.help.bind_command\":\"/yql alert bind \\\"账户名\\\" 候选ID\",\"alert.help.common_actions\":\"常用操作\",\"alert.help.confirm_note\":\"确认前核对单位，确认后阈值数值不变。\",\"alert.help.delivery_permissions\":\"推送与权限\",\"alert.help.interval\":\"检查间隔（分钟）\",\"alert.help.interval_command\":\"/yql alert interval \\\"账户名\\\" 15\",\"alert.help.interval_note\":\"间隔单位为分钟；重复间隔 0 表示不重复。\",\"alert.help.interval_short\":\"检查间隔\",\"alert.help.llm\":\"AI 提醒\",\"alert.help.manage_note\":\"预警 QQ 白名单或 AstrBot 内置管理员可管理。\",\"alert.help.more_settings\":\"更多设置\",\"alert.help.persona_note\":\"AI 提醒使用目标会话的人格。\",\"alert.help.prefix\":\"表内命令前缀：/yql alert\",\"alert.help.private_notice\":\"仅管理员可用 · 详细信息请私聊查看\",\"alert.help.recipients_note\":\"先确认收件人与群成员；保存不会立即推送。\",\"alert.help.recovery\":\"恢复阈值\",\"alert.help.recovery_command\":\"/yql alert recovery \\\"账户名\\\" 12|auto\",\"alert.help.refresh_note\":\"查看候选只读；refresh 会重新查询余额。\",\"alert.help.repeat\":\"重复间隔（0 为不重复）\",\"alert.help.repeat_command\":\"/yql alert repeat \\\"账户名\\\" 0\",\"alert.help.repeat_short\":\"重复间隔\",\"alert.help.retry\":\"解除认证暂停\",\"alert.help.retry_command\":\"/yql alert retry \\\"账户名\\\"\",\"alert.help.retry_short\":\"恢复检查\",\"alert.help.return\":\"返回总览：/yql alert help\",\"alert.help.set_threshold\":\"设置阈值\",\"alert.help.status\":\"预警状态\",\"alert.help.targets_add\":\"添加指定会话\",\"alert.help.targets_add_short\":\"指定会话\",\"alert.help.targets_heading\":\"目标与管理权限\",\"alert.help.targets_here\":\"添加当前会话\",\"alert.help.targets_here_short\":\"当前会话\",\"alert.help.targets_list\":\"查看目标\",\"alert.help.targets_remove\":\"移除目标\",\"alert.help.targets_remove_command\":\"/yql alert targets remove 目标ID\",\"alert.help.targets_title\":\"推送与管理权限\",\"alert.help.threshold_command\":\"/yql alert threshold \\\"账户名\\\" 10 [指标ID]\",\"alert.help.threshold_note\":\"阈值按当前单位判定；确认单位见 help units。\",\"alert.help.threshold_quick_command\":\"threshold \\\"账户名\\\" 10\",\"alert.help.title\":\"额度预警管理\",\"alert.help.toggle\":\"启用或关闭\",\"alert.help.toggle_command\":\"/yql alert on|off \\\"账户名\\\"\",\"alert.help.toggle_quick_command\":\"on|off \\\"账户名\\\"\",\"alert.help.toggle_short\":\"开启 / 关闭\",\"alert.help.trigger\":\"触发阈值\",\"alert.help.unit_confirmation\":\"单位确认\",\"alert.help.unit_note\":\"单位自动识别，阈值按当前单位判定；AI 提醒使用目标会话的人格。\",\"alert.help.units_read\":\"单位候选（只读）\",\"alert.help.units_read_command\":\"/yql alert units \\\"账户名\\\"\",\"alert.help.units_read_short\":\"查看候选\",\"alert.help.units_refresh\":\"刷新单位候选\",\"alert.help.units_refresh_command\":\"/yql alert units \\\"账户名\\\" refresh\",\"alert.help.units_refresh_short\":\"刷新候选\",\"alert.help.units_title\":\"识别与确认单位\",\"alert.help.view_status\":\"查看状态\",\"alert.invalid_unit\":\"单位候选无效或预警运行时已更新，请刷新后重试。\",\"alert.metric.available\":\"可用额度\",\"alert.metric.available_cash\":\"现金余额\",\"alert.metric.credit\":\"积分余额\",\"alert.metric.credit_amount\":\"信用额度\",\"alert.metric.granted\":\"赠送余额\",\"alert.metric.mapped\":\"映射余额\",\"alert.metric.site_credit\":\"站内额度\",\"alert.metric.topped_up\":\"充值余额\",\"alert.metric.total\":\"总余额\",\"alert.metric_changed\":\"监测项已变更，请确认阈值和单位\",\"alert.no_metric_unit\":\"本次未取得当前监测项的有效单位候选；请检查查询结果与监测项后重试。\",\"alert.no_unit\":\"本次未取得有效单位候选；请检查查询状态，稍后重新查询。\",\"alert.query_identity_changed\":\"账户查询配置已变更，请重新确认阈值和单位\",\"alert.receipt.result\":\"处理结果\",\"alert.receipt.title\":\"操作完成\",\"alert.runtime_changed\":\"预警运行时已更新，请刷新后重试。\",\"alert.state.blocked\":\"预警配置不完整或目标不可用\",\"alert.state.disabled\":\"预警已关闭\",\"alert.state.error\":\"查询失败；保留原预警状态，不将错误视为零余额\",\"alert.state.failed\":\"平台未接受发送；冷却后可重试\",\"alert.state.low\":\"额度低于或等于阈值，等待满足发送间隔或目标恢复\",\"alert.state.monitoring\":\"监测中，未触发预警\",\"alert.state.paused\":\"认证或权限校验失败；修正配置或手动重试后恢复检查\",\"alert.state.recovered\":\"已达到恢复阈值，等待下一次低额事件\",\"alert.state.recovering\":\"额度已回升，尚未达到恢复阈值\",\"alert.state.stale\":\"未获得新鲜且指标、单位一致的余额；保留原状态\",\"alert.state.storage_unavailable\":\"预警状态存储不可用；已停止检查和发送\",\"alert.state.submitted\":\"已提交平台；不代表最终送达\",\"alert.state.unit_changed\":\"监测项、单位或查询身份变化，请确认后继续\",\"alert.state.unit_unidentified\":\"等待有效查询识别额度单位\",\"alert.state.units_ambiguous\":\"存在多个或重复单位，请确认实际候选单位\",\"alert.state.unknown\":\"发送结果未知；为避免重复不自动重发\",\"alert.state.waiting\":\"等待下一次检查\",\"alert.state.waiting_budget\":\"同一推送目标共用至少 300 秒发送间隔；等待后续有效检查\",\"alert.status.account_count\":\"{count} 个账户 · 本地运行记录\",\"alert.status.account_id\":\"账户 ID\",\"alert.status.blocked\":\"需要检查配置\",\"alert.status.delivery_note\":\"本地记录 · 实际送达请查看平台记录。\",\"alert.status.empty\":\"当前没有可显示的预警检查记录。\",\"alert.status.empty_heading\":\"暂无账户状态\",\"alert.status.failed\":\"发送未被接受\",\"alert.status.last_checked\":\"最近检查\",\"alert.status.last_sent\":\"最近提交平台\",\"alert.status.low\":\"额度偏低\",\"alert.status.monitoring\":\"监测中\",\"alert.status.no_record\":\"暂无记录\",\"alert.status.paused\":\"检查已暂停\",\"alert.status.recovered\":\"已恢复\",\"alert.status.recovering\":\"额度回升中\",\"alert.status.running\":\"检查任务已启动\",\"alert.status.scheduler\":\"{task} · 状态存储{storage}\",\"alert.status.stale\":\"等待有效余额\",\"alert.status.stopped\":\"检查任务未运行\",\"alert.status.storage_unavailable\":\"存储不可用\",\"alert.status.submitted\":\"已提交平台\",\"alert.status.title\":\"额度预警状态\",\"alert.status.unit_changed\":\"需要重新确认\",\"alert.status.unit_unidentified\":\"等待识别单位\",\"alert.status.units_ambiguous\":\"待确认单位\",\"alert.status.unknown\":\"发送结果未知\",\"alert.status.waiting\":\"等待检查\",\"alert.status.waiting_budget\":\"等待发送间隔\",\"alert.targets.add_note\":\"使用 targets add 或 targets addhere 添加已确认的目标。手填官方 QQ 目标时，在 UMO 后加 scene=qq_group（群聊）或 scene=qq_c2c（个人私聊）。\",\"alert.targets.count\":\"{count} 个目标 · 仅私聊显示\",\"alert.targets.empty\":\"尚未配置预警目标\",\"alert.targets.item\":\"目标 {index} · {key}\",\"alert.targets.mentions\":\"群内提及\",\"alert.targets.remove_command\":\"移除命令\",\"alert.targets.save_note\":\"管理员确认收件人和群成员后配置；保存仅更新本地目标。\",\"alert.targets.title\":\"预警推送目标\",\"alert.targets.umo\":\"会话 UMO\",\"alert.unit_changed\":\"查询单位已变更，请重新确认阈值和单位\",\"alert.unit_expired\":\"候选已过期或不再匹配；请先查询余额，再刷新单位候选。\",\"alert.units.ambiguous\":\"多个单位待确认\",\"alert.units.auto_detect_note\":\"查询余额后自动识别。\",\"alert.units.bind_command\":\"确认命令：/yql alert bind \\\"账户名\\\" 候选ID\",\"alert.units.binding_valid_note\":\"已有有效绑定不会因候选过期而失效。\",\"alert.units.bound_metric\":\"已绑定指标\",\"alert.units.candidate\":\"候选 {index} · {unit}\",\"alert.units.candidate_id\":\"候选 ID\",\"alert.units.candidate_updated\":\"候选更新时间\",\"alert.units.candidates_empty\":\"暂无可确认候选\",\"alert.units.candidates_expired\":\"候选已过期\",\"alert.units.change_reason\":\"变更原因\",\"alert.units.current_and_bound\":\"当前 / 已绑定指标\",\"alert.units.current_metric\":\"当前指标\",\"alert.units.current_unit\":\"当前单位\",\"alert.units.identity_changed\":\"查询身份已变化，请重新确认\",\"alert.units.last_verified\":\"最近验证\",\"alert.units.metric\":\"指标\",\"alert.units.metric_changed\":\"指标已变化，请重新确认\",\"alert.units.metric_unknown\":\"待识别\",\"alert.units.not_bound\":\"尚未绑定\",\"alert.units.pending_query\":\"待获取\",\"alert.units.readonly\":\"已有查询结果 · 只读状态\",\"alert.units.readonly_note\":\"列表读取现有查询结果；候选过期时可显式刷新。\",\"alert.units.refresh_command\":\"使用 /yql alert units \\\"账户名\\\" refresh 显式刷新候选。\",\"alert.units.refreshed\":\"已请求刷新 · 最新本地状态\",\"alert.units.refreshed_note\":\"本次按请求刷新账户余额。\",\"alert.units.stale\":\"单位验证已过期\",\"alert.units.threshold_note\":\"确认前核对阈值含义；确认后保留阈值原值。\",\"alert.units.title\":\"预警单位与候选\",\"alert.units.unit_changed\":\"单位已变化，请重新确认\",\"alert.units.verified\":\"单位已验证\",\"balance.expiry\":\"到期\",\"balance.expiry_date\":\"到期 {time}\",\"balance.item_expiry\":\"{label}到期\",\"balance.item_note\":\"{label}说明\",\"balance.kind.cash\":\"现金余额\",\"balance.kind.credits\":\"积分\",\"balance.kind.custom\":\"自定义项目\",\"balance.kind.free_quota\":\"免费额度\",\"balance.kind.quota\":\"额度\",\"balance.kind.subscription\":\"套餐\",\"balance.kind.usage\":\"用量\",\"balance.remaining\":\"剩余\",\"balance.remaining_amount\":\"剩余 {amount}\",\"balance.semantics\":\"语义说明 {meaning}\",\"balance.site_credit_meaning\":\"账户站内额度以 site_credit 计量。\",\"balance.total\":\"总量\",\"balance.total_amount\":\"总量 {amount}\",\"balance.unknown_amount\":\"数值未知（单位：{unit}）\",\"balance.unknown_unit\":\"未知单位\",\"balance.unreported\":\"未提供（单位：{unit}）\",\"balance.used\":\"已用\",\"balance.used_amount\":\"已用 {amount}\",\"balance.value_separator\":\"；\",\"capability.alibaba\":\"阿里云百炼\",\"capability.alibaba_balance\":\"阿里云账户余额（BSS：现金 / 可用 / 信用）\",\"capability.cash\":\"现金余额\",\"capability.compatible\":\"OpenAI 兼容服务\",\"capability.credential_missing\":\"未配置可用凭据\",\"capability.credits\":\"积分\",\"capability.custom\":\"用户配置的余额类别\",\"capability.deepseek_balance\":\"多币种账户余额\",\"capability.endpoint_invalid\":\"余额查询端点配置无效\",\"capability.free_quota\":\"免费额度\",\"capability.grsai_region\":\"Grsai 节点配置无效\",\"capability.grsai_token_missing\":\"未配置 Grsai 账户请求令牌\",\"capability.host_invalid\":\"Host 配置无效\",\"capability.host_missing\":\"缺少 HTTPS 服务根地址 Host\",\"capability.kind_invalid\":\"Grsai 积分类别必须映射为 credits\",\"capability.mapping_invalid\":\"余额字段映射未配置或无效\",\"capability.meinianda_balance\":\"账户站内额度（site_credit）\",\"capability.path_invalid\":\"API Path 配置无效\",\"capability.path_missing\":\"缺少以 / 开头的相对 API Path\",\"capability.profile_invalid\":\"服务类型配置无效\",\"capability.quota\":\"额度\",\"capability.scope_invalid\":\"余额范围配置无效\",\"capability.subscription\":\"订阅额度\",\"capability.unqueryable\":\"当前配置不可查询\",\"capability.usage\":\"用量\",\"common.empty\":\"空\",\"common.field_separator\":\"：\",\"common.label_value\":\"{label}：{value}\",\"common.list_separator\":\"、\",\"common.none\":\"无\",\"common.unknown\":\"未知\",\"config.account_id\":\"账户 id 必须为非空文本\",\"config.account_mapping\":\"账户配置必须为映射\",\"config.admin_boolean\":\"command_admin_only 必须为布尔值；已使用默认值\",\"config.aliases\":\"aliases 必须为非空文本列表\",\"config.auth_mapping\":\"auth 必须为映射\",\"config.balance_scope\":\"余额范围只能是 generic、account 或 api_key\",\"config.bss_auth\":\"阿里云 BSS 查询需要独立 AccessKey ID 和 AccessKey Secret\",\"config.compatible_auth\":\"兼容接口需要配置 API 密钥\",\"config.conflict\":\"配置已改变，请刷新后重新确认。\",\"config.conflicting_account\":\"账户名称与其他账户冲突\",\"config.credential_in_field\":\"普通配置字段不得包含凭据。\",\"config.credential_operation\":\"凭据只能通过独立凭据操作保存。\",\"config.display_name\":\"display_name 必须为非空文本\",\"config.duplicate_credential\":\"凭据不得与普通配置字段重复。\",\"config.duplicate_id\":\"账户 id 重复\",\"config.enabled_boolean\":\"enabled 必须为布尔值；已禁用账户\",\"config.endpoint_mapping\":\"endpoint 必须为映射\",\"config.group_boolean\":\"allow_group_queries 必须为布尔值；已使用默认值\",\"config.group_list\":\"group_allowed_user_ids 必须为非空文本列表；已使用空列表\",\"config.grsai_account_only\":\"Grsai 当前仅支持账户积分，API Key 积分预设尚未实现\",\"config.grsai_account_path\":\"Grsai 账户积分仅支持 /client/openapi/getCredits\",\"config.grsai_api_key_scope\":\"Grsai API Key 积分预设尚未实现，请选择账户积分\",\"config.grsai_credits\":\"Grsai 积分查询必须将 kind 固定映射为 credits\",\"config.grsai_path_scope\":\"Grsai getCredits 端点应选择 account；getAPIKeyCredits 端点应选择 api_key\",\"config.grsai_post\":\"该 Grsai 积分端点要求使用 POST\",\"config.grsai_region\":\"Grsai 节点只能选择国内直连或海外\",\"config.grsai_required\":\"账户余额或 API Key 余额范围仅适用于已选择的 Grsai 服务\",\"config.grsai_scope\":\"Grsai 当前仅支持账户积分预设\",\"config.grsai_token\":\"Grsai 账户积分需要用户信息中的请求令牌 token\",\"config.invalid\":\"配置无效；请检查字段和数据类型。\",\"config.invalid_amount_mapping\":\"兼容接口必须配置有效的 amount_path 映射\",\"config.invalid_endpoint\":\"余额端点必须是安全的 HTTPS GET 或 POST 配置\",\"config.invalid_host\":\"Host 必须是没有路径、查询参数或片段的 HTTPS 服务根地址\",\"config.invalid_path\":\"API Path 必须以单个 / 开头，且不能包含完整 URL、查询参数或片段\",\"config.invalid_root\":\"配置根节点必须是映射\",\"config.legacy_credential_in_field\":\"旧配置的普通字段包含凭据，原配置未删除。\",\"config.legacy_credential_shape\":\"旧凭据结构无法安全迁移，原配置未删除。\",\"config.migrate_first\":\"请先确认并迁移旧配置，再修改设置。\",\"config.missing_auth\":\"缺少可用凭据\",\"config.missing_endpoint\":\"缺少余额查询端点\",\"config.missing_env\":\"引用的凭据环境变量未设置\",\"config.missing_host\":\"请填写 HTTPS 服务根地址 Host\",\"config.missing_path\":\"请填写以 / 开头的相对 API Path\",\"config.positive_integer\":\"{path} 必须为正整数；已使用默认值\",\"config.positive_number\":\"{path} 必须为正数；已使用默认值\",\"config.private_list\":\"private_allowed_user_ids 必须为 平台名:用户ID 文本列表；已使用空列表\",\"config.provider_immutable\":\"现有账户的供应商类型不可更改；请新建账户。\",\"config.provider_type\":\"未知供应商类型\",\"config.providers_list\":\"providers 必须为列表\",\"config.response_mapping\":\"response_mapping 必须为映射；已使用空映射\",\"config.secret_in_name\":\"账户名称不得包含凭据\",\"config.service_profile\":\"兼容服务类型只能是 generic 或 grsai\",\"config.storage_unavailable\":\"安全存储暂不可用；未回退到明文，请检查密钥与存储状态。\",\"config.template_mismatch\":\"账户模板与供应商类型不一致\",\"config.wallet_origin\":\"请输入站点的 HTTPS 根地址，例如 https://gateway.example。\",\"config.wallet_origin_credential\":\"要更换站点地址，请先清除该账户的查询凭据。\",\"config.wallet_region\":\"请选择与查询密钥对应的地区。\",\"config.wallet_team\":\"请输入 xAI 团队 ID，仅支持英文字母、数字、连字符和下划线。\",\"credential.encrypted\":\"加密凭据已保存\",\"credential.environment\":\"环境变量引用已保存\",\"credential.missing\":\"尚未保存凭据\",\"credential.mixed\":\"加密凭据与环境变量引用已保存\",\"credential.unknown\":\"保存状态待确认\",\"error.alert_config.account_disabled\":\"启用预警前须先启用账户。\",\"error.alert_config.decimal_format\":\"{label}须为普通十进制文本，不支持科学计数法。\",\"error.alert_config.duplicate_target\":\"预警目标 UMO 重复，请合并为同一行。\",\"error.alert_config.group_mention_only\":\"仅数字 QQ 群会话可配置 @QQ号；私聊请删除提及。\",\"error.alert_config.integer_range\":\"{label}必须为 {low}–{high} 的整数。\",\"error.alert_config.invalid_enabled\":\"预警开关必须为布尔值。\",\"error.alert_config.invalid_model_enabled\":\"预警模型开关必须为布尔值。\",\"error.alert_config.invalid_model_object\":\"预警模型配置结构无效。\",\"error.alert_config.invalid_object\":\"账户预警配置必须为对象。\",\"error.alert_config.invalid_admin_id\":\"{label}需填写 QQ 号或 qq_official:UID；不接受 UMO 或全体提及。\",\"error.alert_config.invalid_qq_id\":\"{label}仅支持 ASCII 正整数 QQ 号，不能 @全体。\",\"error.alert_config.invalid_target_fields\":\"每个预警目标须包含 umo 和 mentions，可选填 scene。\",\"error.alert_config.invalid_target_scene\":\"官方 QQ 群聊请为 GroupMessage 指定 scene=qq_group，个人私聊请为 FriendMessage 指定 scene=qq_c2c。两种目标均不支持 @。\",\"error.alert_config.invalid_text\":\"{label}必须为不含控制字符的文本。\",\"error.alert_config.invalid_text_format\":\"{label}长度或格式无效。\",\"error.alert_config.invalid_umo\":\"UMO 须为 平台实例:消息类型:会话ID。\",\"error.alert_config.label.admin_qq\":\"预警管理 QQ 白名单\",\"error.alert_config.label.check_interval\":\"检查间隔（分钟）\",\"error.alert_config.label.mentions\":\"群内提及\",\"error.alert_config.label.metric\":\"预警指标\",\"error.alert_config.label.model\":\"模型 ID\",\"error.alert_config.label.persona\":\"人格 ID\",\"error.alert_config.label.recovery_threshold\":\"恢复阈值\",\"error.alert_config.label.repeat_interval\":\"持续低额重复间隔（分钟，0 表示不重复）\",\"error.alert_config.label.threshold\":\"额度阈值\",\"error.alert_config.label.unit\":\"预警单位\",\"error.alert_config.list_limit\":\"{label}须为最多 {limit} 项的列表。\",\"error.alert_config.missing_targets\":\"启用预警前须设置至少一个推送目标。\",\"error.alert_config.missing_threshold_or_metric\":\"请设置阈值和指标。\",\"error.alert_config.recovery_threshold_order\":\"恢复阈值必须大于额度阈值。\",\"error.alert_config.target_limit\":\"预警推送目标须为最多 {limit} 项的列表。\",\"error.alert_config.unknown_fields\":\"账户预警配置含未知字段。\",\"error.alert_config.unsupported_metric\":\"预警指标不受该供应商支持。\",\"error.query.empty_target\":\"目标名称不能为空\",\"error.query.invalid_arguments\":\"该命令不接受目标参数\",\"error.query.multiple_targets\":\"检测到多个账户或供应商，请指定一个目标\",\"error.query.unknown_target\":\"未找到匹配的账户或供应商\",\"help.account_command\":\"/yql account <名称>\",\"help.alerts\":\"额度预警\",\"help.aliyun_note\":\"阿里云 BSS 查询现金余额、可用额度、信用额度；RAM 身份至少需要 AliyunBSSReadOnlyAccess。\",\"help.all_accounts\":\"全部账户\",\"help.all_command\":\"/yql  或  /yql all\",\"help.card_subtitle\":\"查询额度 · 查看本地配置\",\"help.card_title\":\"YQL 使用帮助\",\"help.card_tool_note\":\"启用函数工具后，可用自然语言查询额度。\",\"help.command_body\":\"如月怜的额度连结\\n用法：\\n  /yql                 查询所有账户\\n  /yql help            查看帮助\\n  /yql status          查看本地配置状态\\n  /yql all             查询所有账户\\n  /yql <名称>          查询指定账户或供应商\\n  /yql account <名称>  查询指定账户\\n  /yql provider <名称> 查询指定供应商\\n\",\"help.compatible_note\":\"OpenAI 兼容服务的余额查询使用服务商专属接口；请按余额文档填写服务地址、接口路径和高级认证/响应映射。配置完整后即可查询。\",\"help.configured_accounts\":\"已配置账户：{names}\",\"help.enabled_accounts\":\"已启用账户 · {count} 个\",\"help.local_config\":\"本地配置\",\"help.local_note\":\"help 和 status 读取本地信息。\",\"help.management_note\":\"供应商接口与凭据请在管理页配置。\",\"help.name_note\":\"也可使用 /yql <名称>；名称支持显示名、别名与供应商名。\",\"help.no_accounts\":\"当前没有配置账户。\",\"help.no_enabled_accounts\":\"尚未配置启用的账户。请先在管理页添加账户。\",\"help.provider_command\":\"/yql provider <名称>\",\"help.query\":\"查询额度\",\"help.select_account\":\"指定账户\",\"help.select_provider\":\"指定供应商\",\"help.status_heading\":\"帮助与状态\",\"help.tool_note\":\"在启用函数工具的 AI 对话中，也可用自然语言让模型调用 yql_query_balance。\",\"help.usage\":\"使用帮助\",\"provider.alibaba_bailian.authentication\":\"阿里云访问密钥认证失败\",\"provider.alibaba_bailian.available_credit\":\"可用额度\",\"provider.alibaba_bailian.cash_balance\":\"现金余额\",\"provider.alibaba_bailian.connection\":\"无法连接阿里云余额服务\",\"provider.alibaba_bailian.credit_limit\":\"信用额度\",\"provider.alibaba_bailian.fallback_account\":\"阿里云账户\",\"provider.alibaba_bailian.invalid_credentials\":\"阿里云余额查询凭据配置无效\",\"provider.alibaba_bailian.invalid_request\":\"阿里云余额查询请求配置无效\",\"provider.alibaba_bailian.invalid_response\":\"阿里云返回的余额数据格式无法识别\",\"provider.alibaba_bailian.permission\":\"阿里云拒绝访问账户现金余额。请为查询当前 BSS 现金余额的 RAM 身份至少授予 AliyunBSSReadOnlyAccess；DashScope 模型 API Key 不能替代此 RAM 授权。无需授予 BSS FullAccess。\",\"provider.alibaba_bailian.query_failed\":\"阿里云账户现金余额查询失败\",\"provider.alibaba_bailian.rate_limited\":\"阿里云余额查询被限流，请稍后重试\",\"provider.alibaba_bailian.request_denied\":\"阿里云拒绝了账户现金余额查询请求\",\"provider.alibaba_bailian.source\":\"阿里云账户余额与额度\",\"provider.alibaba_bailian.timeout\":\"阿里云现金余额查询超时\",\"provider.alibaba_bailian.too_many_requests\":\"阿里云余额查询过于频繁，请稍后重试\",\"provider.alibaba_bailian.unavailable\":\"阿里云余额服务暂时不可用\",\"provider.deepseek.authentication\":\"DeepSeek API 密钥认证失败\",\"provider.deepseek.connection\":\"无法连接 DeepSeek 余额服务\",\"provider.deepseek.granted_balance\":\"未过期赠金余额\",\"provider.deepseek.insufficient_balance\":\"DeepSeek 账户余额不足，当前无法调用 API\",\"provider.deepseek.invalid_request\":\"DeepSeek 余额查询请求配置无效\",\"provider.deepseek.invalid_response\":\"DeepSeek 返回的余额数据格式无法识别\",\"provider.deepseek.missing_key\":\"DeepSeek 账户缺少有效 API 密钥\",\"provider.deepseek.permission\":\"DeepSeek 拒绝了余额查询\",\"provider.deepseek.rate_limited\":\"DeepSeek 请求过于频繁，请稍后重试\",\"provider.deepseek.request_denied\":\"DeepSeek 拒绝了余额查询请求\",\"provider.deepseek.source\":\"DeepSeek API\",\"provider.deepseek.timeout\":\"DeepSeek 余额查询超时\",\"provider.deepseek.topped_up_balance\":\"充值余额\",\"provider.deepseek.total_balance\":\"总可用余额\",\"provider.deepseek.unavailable\":\"DeepSeek 余额查询暂时失败\",\"provider.glm_plan.credits\":\"积分用量\",\"provider.glm_plan.five_hours\":\"5 小时窗口\",\"provider.glm_plan.mcp\":\"MCP 用量\",\"provider.glm_plan.monthly\":\"月窗口\",\"provider.glm_plan.other_window\":\"窗口 {number}\",\"provider.glm_plan.source\":\"GLM Coding Plan 官方额度接口\",\"provider.glm_plan.tokens\":\"令牌用量\",\"provider.glm_plan.weekly\":\"周窗口\",\"provider.glm_plan.window\":\"{category} · {window}\",\"provider.meinianda.authentication\":\"Meinianda API Key 认证失败\",\"provider.meinianda.connection\":\"无法连接 Meinianda 余额服务\",\"provider.meinianda.invalid_request\":\"Meinianda 余额查询请求配置无效\",\"provider.meinianda.invalid_response\":\"Meinianda 返回的余额数据格式无法识别\",\"provider.meinianda.missing_key\":\"Meinianda 账户缺少有效 API Key\",\"provider.meinianda.permission\":\"Meinianda 拒绝了余额查询\",\"provider.meinianda.query_failed\":\"Meinianda 未能完成余额查询\",\"provider.meinianda.rate_limited\":\"Meinianda 请求过于频繁，请稍后重试\",\"provider.meinianda.site_credit\":\"账户站内额度\",\"provider.meinianda.site_credit_note\":\"账户站内额度，不是 API Key 限额；不换算为货币\",\"provider.meinianda.source\":\"Meinianda 余额 API\",\"provider.meinianda.timeout\":\"Meinianda 余额查询超时\",\"provider.meinianda.unavailable\":\"Meinianda 余额查询暂时失败\",\"provider.minimax_plan.exhausted\":\"{window}（已用尽）\",\"provider.minimax_plan.general\":\"通用资源\",\"provider.minimax_plan.interval\":\"{model} · 当前窗口\",\"provider.minimax_plan.not_in_plan\":\"{window}（当前套餐不包含）\",\"provider.minimax_plan.other_model\":\"资源组 {number}\",\"provider.minimax_plan.source\":\"MiniMax 官方套餐额度接口\",\"provider.minimax_plan.unlimited\":\"{window}（不限量）\",\"provider.minimax_plan.video\":\"视频资源\",\"provider.minimax_plan.weekly\":\"{model} · 周窗口\",\"provider.minimax_plan.weekly_boost\":\"{model} · 周额度倍率\",\"provider.moonshot.cash_balance\":\"现金余额\",\"provider.moonshot.source\":\"Kimi 开放平台账户余额\",\"provider.moonshot.voucher_balance\":\"代金券余额\",\"provider.new_api.effective_quota\":\"此令牌可用额度\",\"provider.new_api.key_quota\":\"令牌额度\",\"provider.new_api.source\":\"New API 令牌额度接口\",\"provider.new_api.unlimited\":\"令牌额度不限\",\"provider.new_api.user_quota\":\"账户额度\",\"provider.novita.available\":\"可用账户额度\",\"provider.novita.cash\":\"充值余额\",\"provider.novita.credit_limit\":\"信用额度上限\",\"provider.novita.outstanding\":\"未付账单金额\",\"provider.novita.source\":\"Novita AI 账户余额接口\",\"provider.openai_compatible.authentication\":\"余额接口认证失败\",\"provider.openai_compatible.business_failure\":\"余额服务报告查询失败\",\"provider.openai_compatible.connection\":\"余额接口连接失败\",\"provider.openai_compatible.grsai_authentication\":\"账户积分接口返回 HTTP 401，需核对认证配置\",\"provider.openai_compatible.grsai_permission\":\"账户积分接口返回 HTTP 403，需核对访问配置\",\"provider.openai_compatible.grsai_query_failed\":\"账户积分接口请求失败\",\"provider.openai_compatible.grsai_rate_limited\":\"账户积分接口返回 HTTP 429，请稍后重试\",\"provider.openai_compatible.grsai_source\":\"Grsai 账户积分接口\",\"provider.openai_compatible.https_required\":\"余额接口必须使用 HTTPS\",\"provider.openai_compatible.invalid_configuration\":\"兼容平台余额查询配置无效\",\"provider.openai_compatible.invalid_request\":\"余额接口请求配置无效\",\"provider.openai_compatible.invalid_response\":\"余额接口返回的数据格式无法识别\",\"provider.openai_compatible.not_found\":\"余额接口路径或版本不存在\",\"provider.openai_compatible.permission\":\"余额接口拒绝访问\",\"provider.openai_compatible.rate_limited\":\"余额接口请求过于频繁，请稍后重试\",\"provider.openai_compatible.source\":\"OpenAI-compatible 余额接口\",\"provider.openai_compatible.timeout\":\"余额接口查询超时\",\"provider.openai_compatible.unavailable\":\"余额接口请求暂时失败\",\"provider.openrouter.balance\":\"可用账户额度\",\"provider.openrouter.source\":\"OpenRouter 账户额度接口\",\"provider.pollinations.held\":\"冻结的任务 Pollen\",\"provider.pollinations.paid\":\"付费 Pollen\",\"provider.pollinations.quest\":\"任务 Pollen\",\"provider.pollinations.source\":\"Pollinations 官方账户余额接口\",\"provider.pollinations.total\":\"可用 Pollen\",\"provider.retry.explicit_throttling\":\"余额服务明确返回限流，请稍后重试\",\"provider.stepfun.source\":\"阶跃星辰开放平台账户余额\",\"provider.stepfun.total_cash\":\"累计充值金额\",\"provider.stepfun.total_voucher\":\"累计赠送金额\",\"provider.sub2api.key_quota\":\"API Key 额度\",\"provider.sub2api.source\":\"Sub2API 额度查询\",\"provider.sub2api.wallet_balance\":\"钱包余额\",\"provider.venice.available_balance\":\"美元预付余额\",\"provider.venice.bundled_credits\":\"剩余套餐额度\",\"provider.venice.diem_balance\":\"本周期剩余 DIEM\",\"provider.venice.earned_credits\":\"剩余奖励额度\",\"provider.venice.no_numeric_balance\":\"接口没有返回具体余额金额。\",\"provider.venice.source\":\"Venice 账户余额接口\",\"provider.vercel_gateway.balance\":\"可用团队额度\",\"provider.vercel_gateway.lifetime_usage\":\"累计已用额度\",\"provider.vercel_gateway.source\":\"Vercel AI Gateway 团队额度接口\",\"provider.wallet.authentication\":\"供应商拒绝了查询凭据。\",\"provider.wallet.available_balance\":\"可用余额\",\"provider.wallet.configuration\":\"请检查查询凭据和账户设置。\",\"provider.wallet.endpoint\":\"余额或额度接口不可用，请核对账户设置。\",\"provider.wallet.parse\":\"无法读取供应商返回的余额或额度。\",\"provider.wallet.permission\":\"当前凭据无权查询该账户的余额或额度。\",\"provider.wallet.rate_limited\":\"查询过于频繁，请稍后重试。\",\"provider.wallet.unavailable\":\"供应商暂时未能返回余额或额度。\",\"provider.wallet.unsupported\":\"此接口返回的额度类型暂不支持。\",\"provider.xai.posted_balance\":\"已入账预付额度\",\"provider.xai.posted_note\":\"当前账期尚未入账的用量可能未从余额中扣除。\",\"provider.xai.source\":\"xAI 团队预付费账本\",\"query.account_card_title\":\"账户额度与用量\",\"query.account_incomplete\":\"账户配置不完整，暂时无法查询\",\"query.account_outcome_count\":\"{count} 个{label}\",\"query.account_timeout\":\"账户查询超过时限\",\"query.account_title\":\"账户查询：{target}\",\"query.accounts_count\":\"{count} 个账户\",\"query.all_card_title\":\"额度与用量\",\"query.all_title\":\"额度与用量查询\",\"query.authentication_paused\":\"认证或权限失败，已暂停；更新配置或明确重试后恢复\",\"query.available\":\"可用\",\"query.cached\":\"（缓存）\",\"query.cached_card\":\" · 缓存数据\",\"query.client_unconfigured\":\"查询客户端未配置\",\"query.cooldown_account\":\"账户查询冷却中，请在 {seconds} 秒后重试\",\"query.cooldown_provider\":\"供应商查询冷却中，请在 {seconds} 秒后重试\",\"query.empty_title\":\"暂无结果\",\"query.error_detail\":\"  查询失败：{message}\",\"query.failed\":\"查询失败\",\"query.failed_short\":\"失败\",\"query.invalid_operation\":\"操作类型必须为 query 或 list。\",\"query.invalid_provider_result\":\"供应商返回的账户结果无效\",\"query.invalid_request\":\"无法识别查询请求。\",\"query.invalid_target\":\"查询目标必须是账户、供应商名称或 all。\",\"query.matches\":\"{message}\\n匹配项：{candidates}\",\"query.no_accounts\":\"当前没有配置可查询的账户。\",\"query.no_items\":\"没有可显示的余额或用量项目\",\"query.no_results\":\"没有可显示的查询结果。\",\"query.outcome_count\":\"{label} {count}\",\"query.partial\":\"部分可用\",\"query.partial_data\":\"部分数据已获取\",\"query.partial_success\":\"部分成功\",\"query.permission_denied\":\"当前会话无权查询额度信息。\",\"query.provider_card_title\":\"供应商额度与用量\",\"query.provider_title\":\"供应商查询：{target}\",\"query.provider_unsupported\":\"该供应商的余额查询尚未实现\",\"query.queue_timeout\":\"等待查询时超过账户时限\",\"query.service_closed\":\"查询服务已关闭\",\"query.source_time\":\"  获取时间：{time} · 来源：{source}\",\"query.source_time_card\":\"来源：{source} · 获取：{time}\",\"query.status_unavailable\":\"不可用\",\"query.success\":\"查询成功\",\"query.success_short\":\"成功\",\"query.summary\":\"查询汇总：{summary}。\",\"query.summary_separator\":\"，\",\"query.target_card\":\"目标：{target}\\n\",\"query.time\":\"查询时间：{time}\",\"query.time_card\":\"查询：{time}\",\"query.total_timeout\":\"查询超过总时限\",\"query.unavailable\":\"查询暂时不可用\",\"query.unknown_status\":\"状态未知\",\"status.account_list\":\"账户列表：\",\"status.accounts_count\":\"账户：共 {total} 个，启用 {enabled} 个，可查询 {ready} 个\",\"status.add_account\":\"在管理页添加账户与凭据\",\"status.admin_only\":\"仅管理员\",\"status.after_save\":\"保存后发送 /yql status 查看本地配置，再用 /yql 查询额度。\",\"status.api_path\":\"请填写以 / 开头的相对接口路径\",\"status.card_access\":\"访问与凭据\",\"status.card_counts\":\"{total} 个账户 · {enabled} 个启用 · {ready} 个配置完整\",\"status.card_incomplete\":\"待补齐：{reason}\",\"status.card_issues\":\"配置问题 · {count} 项\",\"status.card_needs_check\":\"待检查：{reason}\",\"status.card_needs_setup\":\"待配置：{reason}\",\"status.card_no_accounts\":\"尚未配置账户\",\"status.card_online_check\":\"连通性和余额可通过 /yql 查询。\",\"status.card_source\":\"依据本地账户目录与凭据保存记录\",\"status.card_title\":\"本地配置状态\",\"status.credential_storage\":\"凭据存储\",\"status.credential_storage_state\":\"凭据存储：{state}\",\"status.disabled\":\"已禁用\",\"status.enabled\":\"已开启\",\"status.group_queries\":\"群聊查询\",\"status.group_queries_state\":\"群聊查询：{state}\",\"status.incomplete\":\"配置不全：{reason}\",\"status.issue_count\":\"配置问题：{count} 项\",\"status.next_step\":\"下一步\",\"status.no_accounts\":\"尚未配置账户。\",\"status.not_queryable\":\"不可查询：{reason}\",\"status.off\":\"已关闭\",\"status.permissions\":\"命令权限\",\"status.permissions_state\":\"命令权限：{state}\",\"status.provider\":\"供应商：{provider}\",\"status.queryable\":\"已配置，可查询\",\"status.reason.grsai_account_path_mismatch\":\"请使用 Grsai 账户积分接口\",\"status.reason.grsai_balance_scope_mismatch\":\"请按 Grsai 接口选择对应余额范围\",\"status.reason.grsai_method_must_post\":\"Grsai 积分接口使用 POST\",\"status.reason.invalid_api_path\":\"接口路径配置无效；请填写以 / 开头且不含参数的相对路径\",\"status.reason.invalid_balance_kind\":\"Grsai 积分类别应配置为 credits\",\"status.reason.invalid_balance_scope\":\"请检查余额查询范围\",\"status.reason.invalid_base_url\":\"服务地址配置无效；请填写不含路径、参数或凭据的 HTTPS 服务根地址\",\"status.reason.invalid_endpoint\":\"服务地址或接口路径配置无效；服务地址填 HTTPS 服务根地址，接口路径以 / 开头\",\"status.reason.invalid_grsai_region\":\"请选择有效的 Grsai 节点\",\"status.reason.invalid_response_mapping\":\"请在高级设置中按服务商响应文档填写余额映射\",\"status.reason.invalid_service_profile\":\"请检查服务类型\",\"status.reason.missing_api_path\":\"请填写以 / 开头的接口路径\",\"status.reason.missing_base_url\":\"请填写 HTTPS 服务根地址\",\"status.reason.missing_credentials\":\"缺少可用凭据\",\"status.reason.missing_endpoint\":\"请按服务商文档补齐服务地址与接口路径\",\"status.reason.missing_environment_variable\":\"凭据环境变量未设置\",\"status.reason.missing_grsai_token\":\"请配置 Grsai 账户请求令牌\",\"status.saved_credentials\":\"凭据保存\",\"status.session_permissions\":\"按会话授权\",\"status.source\":\"数据来源：本地配置与凭据保存记录；连通性和余额可通过 /yql 查询。\",\"status.title\":\"如月怜的额度连结状态\",\"status.unknown_reason\":\"配置不全或暂不可查询\",\"storage.migration_pending\":\"旧配置待迁移\",\"storage.ready\":\"安全存储已就绪\",\"storage.unavailable\":\"安全存储待检查\",\"storage.unknown\":\"凭据保存状态待确认\",\"web.account.add\":\"添加账户\",\"web.account.add_query\":\"添加查询账户\",\"web.account.advanced\":\"高级接口与响应映射\",\"web.account.aliases_hint\":\"命令与自然语言使用这些别名。每行一项，避免与其他账户重名。\",\"web.account.count\":\"{count} 个账户\",\"web.account.credentials_configured\":\"凭据已配置\",\"web.account.credentials_pending\":\"待配置凭据\",\"web.account.disabled\":\"已停用\",\"web.account.editor_subtitle\":\"配置查询参数与来源凭据。\",\"web.account.empty\":\"还没有查询账户\",\"web.account.empty_hint\":\"选择供应商添加账户，再单独配置加密凭据。\",\"web.account.enabled\":\"已启用\",\"web.account.id_hint\":\"使用稳定、唯一的 ID；保存后不可更改。\",\"web.account.id_locked\":\"已有账户 ID 不可修改，避免凭据误绑定。\",\"web.account.list\":\"查询账户\",\"web.account.list_subtitle\":\"管理 AI 服务的余额、用量与额度查询账户。\",\"web.account.mapping\":\"余额响应映射\",\"web.account.mapping_hint\":\"使用 JSON Pointer，例如 /data/remaining。静态请求体和映射中不允许放入凭据。\",\"web.account.new\":\"新建账户\",\"web.account.profile_action\":\"更换并清空阈值\",\"web.account.profile_body\":\"将清空阈值并关闭预警，单位会重新识别。\",\"web.account.profile_title\":\"更换服务类型并重设预警？\",\"web.account.protocol\":\"请求协议\",\"web.account.provider\":\"供应商\",\"web.account.provider_scope\":\"各供应商使用自己的余额协议和查询凭据，不复用模型聊天配置。\",\"web.account.provider_settings\":\"供应商设置\",\"web.account.remove\":\"移除账户\",\"web.account.remove_action\":\"从草稿移除\",\"web.account.remove_body\":\"将从草稿移除此账户。保存设置后才会生效，并移除其已保存凭据；其他账户不受影响。\",\"web.account.remove_hint\":\"移除操作在保存设置后生效。\",\"web.account.remove_title\":\"移除账户「{account}」？\",\"web.account.settings\":\"账户设置\",\"web.alert.admin_list\":\"预警管理 QQ 白名单\",\"web.alert.admin_list_hint\":\"每行一个 OneBot QQ 号，或 qq_official:UID。官方 UID 从 /sid 获取，不填 UMO；名单成员或 AstrBot 管理员可管理预警。\",\"web.alert.admin_list_placeholder\":\"QQ 号或 qq_official:UID\",\"web.alert.enable_account\":\"启用此账户预警\",\"web.alert.hints_title\":\"预警提示\",\"web.alert.interval\":\"检查间隔（分钟）\",\"web.alert.interval_days\":\"{count} 天\",\"web.alert.interval_hint\":\"1–4320 分钟，默认 15。\",\"web.alert.interval_minutes\":\"{count} 分钟\",\"web.alert.interval_set\":\"设为 {count} 分钟\",\"web.alert.interval_slider\":\"检查间隔滑条（分钟）\",\"web.alert.metric\":\"预警指标\",\"web.alert.metric_hint\":\"选择需要监测的余额。\",\"web.alert.minutes\":\"分钟\",\"web.alert.permissions\":\"预警管理权限\",\"web.alert.query_only\":\"此预设仅支持手动查询额度。\",\"web.alert.quick_group\":\"检查间隔快捷设置\",\"web.alert.quick_label\":\"快捷设置：\",\"web.alert.recovery\":\"恢复阈值（可选）\",\"web.alert.recovery_hint\":\"留空自动设置，须高于触发阈值。\",\"web.alert.recovery_placeholder\":\"留空自动设置\",\"web.alert.repeat\":\"持续低额重复提醒（分钟）\",\"web.alert.repeat_hint\":\"0 不重复，最多 4320 分钟。\",\"web.alert.smart_hint\":\"AI 提醒\",\"web.alert.smart_hint_help\":\"按目标会话的人格生成整条提醒，数值由程序填入。\",\"web.alert.targets\":\"目标 UMO（每行一个）\",\"web.alert.targets_hint\":\"每行一个 UMO。OneBot 群聊可追加 @QQ号。官方 QQ 请使用 OpenID，群聊行末填 scene=qq_group，个人私聊行末填 scene=qq_c2c。请勿填写频道或频道私信的 UMO。\",\"web.alert.targets_title\":\"额度预警推送目标\",\"web.alert.threshold\":\"触发阈值\",\"web.alert.threshold_hint\":\"余额低于或等于此值时触发预警。\",\"web.alert.threshold_placeholder\":\"填写触发阈值\",\"web.alert.title\":\"额度预警\",\"web.common.cancel\":\"取消\",\"web.common.choose\":\"请选择\",\"web.common.off\":\"已关闭\",\"web.common.on\":\"已开启\",\"web.common.one_per_line\":\"每行一项\",\"web.common.time_unavailable\":\"时间不可用\",\"web.credential.balance_key\":\"余额查询 API Key\",\"web.credential.cancel_entry\":\"取消输入\",\"web.credential.clear\":\"清除凭据\",\"web.credential.clear_body\":\"将移除账户「{account}」的此项凭据或引用。账户设置保留；之后需重新配置才能查询。\",\"web.credential.clear_title\":\"清除 {credential}？\",\"web.credential.confirm_clear\":\"确认清除\",\"web.credential.encrypted_status\":\"已配置 · 加密存储\",\"web.credential.enter_new\":\"输入新凭据\",\"web.credential.environment_hint\":\"仅填写环境变量名，例如 QUOTA_API_KEY；凭据值由运行环境提供。\",\"web.credential.environment_name\":\"环境变量名\",\"web.credential.environment_status\":\"已配置 · 环境变量引用\",\"web.credential.eyebrow\":\"SOURCE ACCESS\",\"web.credential.finish_settings\":\"请先保存或放弃普通设置修改，再操作凭据。\",\"web.credential.gateway_key\":\"站点模型 API Key\",\"web.credential.glm_plan\":\"GLM Coding Plan API Key\",\"web.credential.grsai_token\":\"Grsai 请求令牌\",\"web.credential.legacy_field\":\"旧版凭据（{field}）\",\"web.credential.minimax_plan\":\"MiniMax Token Plan 密钥\",\"web.credential.missing\":\"未配置\",\"web.credential.new_source\":\"新凭据来源\",\"web.credential.new_value\":\"新凭据\",\"web.credential.new_value_hint\":\"空值不会清除已有凭据。提交后立即清空输入。\",\"web.credential.openrouter_management\":\"OpenRouter 管理密钥\",\"web.credential.optional_sts\":\"STS Security Token（可选）\",\"web.credential.replace\":\"更换凭据\",\"web.credential.save_account\":\"请先保存新账户，再配置凭据。\",\"web.credential.save_new\":\"保存新凭据\",\"web.credential.saved_hint\":\"凭据已保存，将在余额查询时验证有效性。\",\"web.credential.separate\":\"凭据单独保存。\",\"web.credential.status_unread\":\"状态未读取\",\"web.credential.title\":\"查询凭据\",\"web.credential.use_environment\":\"引用环境变量\",\"web.credential.venice_admin\":\"Venice 管理员 API Key\",\"web.credential.vercel_gateway\":\"Vercel AI Gateway API Key\",\"web.credential.xai_management\":\"xAI 管理密钥\",\"web.detail.fixed_hint\":\"已改用普通提醒。\",\"web.detail.legacy_target_unknown\":\"旧目标有一条无法匹配的发送记录，结果未知。余额恢复后，下一次进入低余额时才会向官方 QQ 目标发送。\",\"web.detail.mention_invalid\":\"QQ 提及格式无效，请核对群会话与 @QQ 号。\",\"web.detail.mention_unsupported\":\"目标不支持 QQ 提及，请移除 @ 后缀或使用支持的 QQ 群目标。\",\"web.detail.message_components_unavailable\":\"消息组件无法构造，请检查宿主组件与日志。\",\"web.detail.platform_not_found\":\"未找到目标平台实例，请核对 UMO 的平台实例 ID。\",\"web.detail.platform_unavailable\":\"目标平台实例暂不可用，请检查连接状态与宿主日志。\",\"web.detail.platform_unsupported\":\"目标平台不支持此主动发送方式，请改用支持的推送目标。\",\"web.detail.session_check_failed\":\"无法核对目标会话状态，请检查 AstrBot 会话设置与日志。\",\"web.detail.session_disabled\":\"目标会话已停用，请在 AstrBot 中启用会话。\",\"web.detail.target_invalid\":\"推送目标格式无效，请在全局设置中核对 UMO。\",\"web.detail.target_scene_required\":\"官方 QQ 目标缺少会话类型。请在全局设置补填，或在目标会话使用 /yql alert targets addhere。\",\"web.detail.transport_unavailable\":\"宿主主动发送接口不可用，请检查 AstrBot 版本与日志。\",\"web.detail.unknown\":\"暂无明确阻止原因，请核对全局推送目标、平台连接与宿主预警日志。\",\"web.field.advanced_options\":\"显示高级设置\",\"web.field.aliases\":\"查询别名\",\"web.field.amount_path\":\"主余额路径\",\"web.field.auth_mode\":\"认证方式\",\"web.field.auth_name\":\"认证参数名\",\"web.field.balance_scope\":\"积分范围\",\"web.field.base_url\":\"服务地址\",\"web.field.cache_ttl_seconds\":\"成功结果缓存（秒）\",\"web.field.display_name\":\"显示名称\",\"web.field.enabled\":\"启用账户\",\"web.field.expires_at_path\":\"到期时间路径\",\"web.field.expiry_path\":\"旧版到期路径\",\"web.field.failure_path\":\"业务失败路径\",\"web.field.failure_value\":\"业务失败值\",\"web.field.gateway_origin\":\"站点地址\",\"web.field.id\":\"账户 ID\",\"web.field.json_body\":\"静态 JSON 请求体\",\"web.field.kind\":\"余额类别\",\"web.field.kind_path\":\"类别路径\",\"web.field.method\":\"请求方法\",\"web.field.path\":\"接口路径\",\"web.field.region\":\"连接区域\",\"web.field.remaining_path\":\"剩余量路径\",\"web.field.service_profile\":\"服务类型\",\"web.field.status_path\":\"状态路径\",\"web.field.status_values\":\"状态值映射\",\"web.field.success_path\":\"业务成功路径\",\"web.field.success_value\":\"业务成功值\",\"web.field.team_id\":\"团队 ID\",\"web.field.timeout_seconds\":\"账户超时（秒）\",\"web.field.total_path\":\"总量路径\",\"web.field.unit\":\"固定单位\",\"web.field.unit_path\":\"单位路径\",\"web.field.url\":\"旧版完整 URL\",\"web.field.used_path\":\"已用量路径\",\"web.global.allow_group_queries\":\"允许群聊查询\",\"web.global.command_admin_only\":\"余额查询命令仅管理员\",\"web.global.group_allowed_user_ids\":\"群聊用户白名单\",\"web.global.max_concurrency\":\"最大并发数\",\"web.global.private_allowed_user_ids\":\"私聊白名单\",\"web.global.timeout_seconds\":\"单账户超时（秒）\",\"web.global.total_timeout_seconds\":\"整次查询超时（秒）\",\"web.hint.advanced_options\":\"通用服务配置认证、方法与响应映射；Grsai 账户积分使用固定协议并忽略旧映射。\",\"web.hint.amount_path\":\"必需的 JSON Pointer，例如 /data/remaining。\",\"web.hint.auth_mode\":\"按余额文档确认；Grsai 账户积分忽略此栏，token 固定放入 JSON 请求体。\",\"web.hint.auth_name\":\"仅认证方式为「请求头」或「查询参数」时使用。\",\"web.hint.balance_scope\":\"账户积分已支持；API Key 积分暂不可查询。\",\"web.hint.base_url\":\"HTTPS 服务根地址，不含 API 路径。https://api.example.invalid 仅为不可访问的格式示例。\",\"web.hint.expiry_path\":\"兼容旧版 expires_at_path。\",\"web.hint.gateway_origin\":\"填写站点的 HTTPS 根地址。查询凭据只发送到该站点。\",\"web.hint.json_body\":\"仅供通用服务使用，不支持模板或凭据。Grsai 账户积分留空；旧条目切换时清除旧请求体。\",\"web.hint.kind_path\":\"可选 JSON Pointer；仅接受 cash/quota/free_quota/subscription/credits/usage/custom。\",\"web.hint.legacy_base_url\":\"HTTPS 服务根地址，可与接口路径配合。\",\"web.hint.legacy_json_body\":\"仅用于有文档依据的只读 POST，不支持模板或凭据。\",\"web.hint.legacy_method\":\"只允许 GET 或已确认无副作用的 POST。\",\"web.hint.meinianda_cache\":\"站点建议每分钟查询一次，默认缓存 60 秒。\",\"web.hint.method\":\"通用服务按文档填写。Grsai 账户积分固定 POST；旧条目切换时清除原 GET。\",\"web.hint.path\":\"通用服务按文档填写。Grsai 账户积分留空或填 /client/openapi/getCredits；旧条目切换时清除原路径。/account/balance 仅为占位示例。\",\"web.hint.private_allowlist\":\"填写完整 平台名:用户ID，例如 aiocqhttp:123456；管理员无需加入。/yql 余额查询还受上方管理员开关限制。\",\"web.hint.region\":\"国内与海外均使用内置官方节点，无需手填服务器地址。\",\"web.hint.service_profile\":\"余额查询使用服务商专属接口。新 Grsai 账户请直接添加 Grsai 模板；本模板旧条目可切换账户积分预设。\",\"web.hint.status_values\":\"将供应商状态值映射到 available/unavailable/partial/unknown。\",\"web.hint.unit\":\"可用 CNY/USD/JPY/credit/credits/tokens/requests/custom；设置 unit_path 时必填。\",\"web.hint.unit_path\":\"可选 JSON Pointer；运行时值必须与固定 unit 一致。\",\"web.hint.url\":\"完整 HTTPS 地址，不含 query、凭据或 fragment。\",\"web.language.auto\":\"跟随 AstrBot\",\"web.language.en-US\":\"English\",\"web.language.ja-JP\":\"日本語\",\"web.language.zh-CN\":\"简体中文\",\"web.language.zh-TW\":\"繁體中文\",\"web.metric.AvailableAmount\":\"可用额度\",\"web.metric.AvailableCashAmount\":\"现金余额\",\"web.metric.CreditAmount\":\"信用额度\",\"web.metric.credit\":\"积分\",\"web.metric.granted_balance\":\"赠送余额\",\"web.metric.mapped_balance\":\"已配置映射余额\",\"web.metric.monitored\":\"监测余额\",\"web.metric.site_credit\":\"站内额度\",\"web.metric.topped_up_balance\":\"充值余额\",\"web.metric.total_balance\":\"总余额\",\"web.migration.accounts\":\"账户\",\"web.migration.cleanup_hint\":\"仅在迁移成功后清理宿主中的旧配置。若源配置变化，将拒绝执行，请重新预览。\",\"web.migration.cleanup_pending\":\"迁移已保存，但宿主旧字段尚未清理完成。请重新预览后重试清理。\",\"web.migration.confirm\":\"确认迁移旧配置\",\"web.migration.confirm_body\":\"将迁移预览中的 {count} 个账户；明文凭据加密后保存，并清理旧版插件字段。不会展示或发送凭据到其他服务。\",\"web.migration.confirm_title\":\"迁移旧配置？\",\"web.migration.conflict\":\"发现与当前加密存储不同的旧配置。不会自动覆盖现有存储，也不会清理这份新出现的旧配置。请人工核对来源。\",\"web.migration.environment\":\"环境变量引用\",\"web.migration.execute\":\"执行迁移\",\"web.migration.lock_warning\":\"有旧版配置等待迁移。普通设置与凭据操作暂时锁定。\",\"web.migration.no_pending\":\"没有待迁移的旧版配置。\",\"web.migration.open\":\"前往迁移\",\"web.migration.overview\":\"将旧版插件配置中的普通设置、凭据和环境变量引用迁移到独立管理存储。凭据加密保存，不会在页面显示。\",\"web.migration.pending\":\"检测到旧版配置，迁移完成前不能保存新设置。\",\"web.migration.plaintext\":\"需要加密的凭据\",\"web.migration.preview\":\"读取迁移预览\",\"web.migration.retry_cleanup\":\"重试清理旧字段\",\"web.migration.scope\":\"本次迁移范围\",\"web.migration.title\":\"旧配置迁移\",\"web.navigation.accounts\":\"账户管理\",\"web.navigation.back_to_accounts\":\"返回账户\",\"web.navigation.global\":\"全局设置\",\"web.navigation.leave_action\":\"放弃草稿并离开\",\"web.navigation.leave_body\":\"未保存的设置和凭据输入将清空。已发出的请求无法撤回，结果不明时需重新读取，不会自动重试。\",\"web.navigation.leave_title\":\"离开当前设置？\",\"web.navigation.maintenance\":\"配置维护\",\"web.navigation.mobile\":\"移动端导航\",\"web.navigation.primary\":\"主导航\",\"web.navigation.reload\":\"重新读取状态\",\"web.navigation.reload_action\":\"丢弃草稿并读取\",\"web.navigation.reload_body\":\"这会清空当前未保存的设置和凭据输入。\",\"web.navigation.reload_title\":\"重新读取配置？\",\"web.navigation.skip\":\"跳至正文\",\"web.notice.alert_loading\":\"正在读取预警运行状态…\",\"web.notice.alert_read_failed\":\"无法读取预警运行状态，请稍后重试。\",\"web.notice.authorization_lost\":\"管理授权已失效。所有草稿已清空，请从 AstrBot 插件管理重新打开。\",\"web.notice.authorization_reopen\":\"管理授权已失效，请重新打开。\",\"web.notice.config_changed\":\"配置已改变，请重新读取。\",\"web.notice.connecting\":\"正在连接宿主管理会话…\",\"web.notice.discarded\":\"未保存的草稿已丢弃。\",\"web.notice.invalid_context\":\"宿主管理上下文无效。请从 AstrBot 插件管理打开此页。\",\"web.notice.invalid_environment\":\"请输入有效的环境变量名，不要填写变量的值。\",\"web.notice.left_during_write\":\"已离开原设置。已发出的请求无法撤回，请重新读取确认结果。\",\"web.notice.legacy_cleanup_incomplete\":\"配置已迁移，但宿主旧字段清理尚未完成，请在配置维护中重新预览并完成清理。\",\"web.notice.legacy_cleanup_retry\":\"迁移已保存，可重试清理宿主中的旧字段。\",\"web.notice.legacy_conflict\":\"旧配置与当前存储不一致。两份配置均保留，请核对来源。\",\"web.notice.legacy_not_pending\":\"没有待迁移的旧配置。\",\"web.notice.legacy_preview_ready\":\"迁移预览已就绪。执行前请核对下方范围。\",\"web.notice.loaded\":\"已读取最新配置。\",\"web.notice.missing_credential\":\"请输入新凭据；留空不会执行清除。\",\"web.notice.open_in_host\":\"请从 AstrBot 插件管理页面打开此页。\",\"web.notice.read_failed\":\"无法确认当前配置状态。请重新读取，或从 AstrBot 重新打开。\",\"web.notice.reading\":\"正在读取最新状态…\",\"web.notice.revision_conflict\":\"配置已被其他页面修改。请重新读取，再核对并提交；不会自动重试。\",\"web.notice.saved\":\"已保存，当前状态已重新核对。\",\"web.notice.saving\":\"正在提交，请勿重复操作…\",\"web.notice.session_unavailable\":\"宿主管理会话不可用，请重新打开此页。\",\"web.notice.unit_candidate_changed\":\"候选已变化或过期，请重新查询后确认。\",\"web.notice.unit_candidates\":\"已获取最新候选，请核对后确认。\",\"web.notice.unit_confirm_uncertain\":\"确认结果未知，请刷新单位后再操作。\",\"web.notice.unit_confirmed\":\"单位已确认。\",\"web.notice.unit_current\":\"已读取最新单位状态，已确认的单位仍有效。\",\"web.notice.unit_no_candidates\":\"暂未取得可确认候选，请检查凭据、接口配置或查询退避状态后再查询。\",\"web.notice.unit_querying\":\"正在查询余额以获取最新单位…\",\"web.notice.unit_read_failed\":\"单位获取失败，请刷新。\",\"web.notice.unit_unverified_candidates\":\"无法确认新的单位候选。请检查凭据、接口与查询状态，再重新查询。\",\"web.notice.validation_failed\":\"提交未通过校验。请检查字段和凭据类型；敏感输入已清空。\",\"web.notice.write_uncertain\":\"提交结果尚未确认，敏感输入已清空。请先重新读取状态，再决定是否提交。\",\"web.option.auth.bearer\":\"Bearer 令牌\",\"web.option.auth.header\":\"请求头\",\"web.option.auth.query\":\"查询参数\",\"web.option.profile.generic\":\"OpenAI 兼容服务 / 第三方服务\",\"web.option.region.cn\":\"国内直连\",\"web.option.region.overseas\":\"海外节点\",\"web.option.scope.account\":\"账户积分（已支持预设）\",\"web.option.scope.api_key\":\"API Key 积分（暂不可查询）\",\"web.option.scope.none\":\"请选择积分范围\",\"web.provider.alibaba_help\":\"阿里云 BSS：现金余额、可用额度和信用额度。\",\"web.provider.compatible_help\":\"余额查询使用供应商专属接口，请按其文档配置只读余额接口。\",\"web.provider.compatible_name\":\"其他兼容服务\",\"web.provider.deepseek_help\":\"DeepSeek 官方账户余额，查询地址与解析规则已内置。\",\"web.provider.glm_plan_help\":\"使用所选地区的 GLM Coding Plan 密钥，分开查询各统计周期的使用比例。\",\"web.provider.grsai_help\":\"Grsai 使用请求令牌，通过固定接口 POST /client/openapi/getCredits 查询账户积分。模型 API Key 不用于余额查询。\",\"web.provider.legacy_name\":\"旧版通用账户\",\"web.provider.meinianda_help\":\"查询 Meinianda 账户站内额度。建议缓存至少 60 秒。\",\"web.provider.minimax_plan_help\":\"使用所选地区的 Token Plan 密钥，查询各模型组的周期和周额度。\",\"web.provider.moonshot_help\":\"查询所选地区的 Moonshot 账户，分别显示可用余额、现金和赠金。\",\"web.provider.new_api_help\":\"查询 New API 模型令牌及其获准读取的账户额度。结果保留站点原始额度点。\",\"web.provider.novita_help\":\"查询 Novita AI 的可用余额、现金余额、信用额度和未结清账单。\",\"web.provider.openrouter_help\":\"使用管理密钥查询 OpenRouter 账户积分，按累计购入积分减去已用积分计算。\",\"web.provider.pollinations_help\":\"使用带 account:usage 权限的密钥查询账户 Pollen。冻结额度单独显示。\",\"web.provider.stepfun_help\":\"查询所选地区的 StepFun 账户。累计充值和累计赠金单独显示。\",\"web.provider.sub2api_help\":\"使用 Sub2API 模型密钥查询站点钱包或明确返回的密钥额度。\",\"web.provider.venice_help\":\"使用管理员 API Key 查询 Venice。美元余额、DIEM 和各类积分单独显示。\",\"web.provider.vercel_gateway_help\":\"使用 AI Gateway 专用密钥查询团队的美元余额和累计用量。\",\"web.provider.xai_help\":\"使用团队的管理密钥查询 xAI 已入账的预付余额。\",\"web.runtime.last_checked\":\"最近检查：\",\"web.runtime.last_sent\":\"最近发送尝试：\",\"web.runtime.loading\":\"读取中…\",\"web.runtime.no_account_record\":\"此账户尚无运行记录。\",\"web.runtime.refresh\":\"刷新预警状态\",\"web.runtime.running\":\"检查任务已运行；仅配置完整且单独开启的账户参与。\",\"web.runtime.stopped\":\"检查任务未运行。\",\"web.runtime.storage_unavailable\":\"预警状态存储不可用，预警未运行。\",\"web.runtime.title\":\"运行状态\",\"web.runtime.unknown_status\":\"状态已更新，请通过预警命令查看详情。\",\"web.settings.access_eyebrow\":\"QUERY ACCESS\",\"web.settings.access_title\":\"访问权限\",\"web.settings.account_alerts\":\"各账户可单独开启预警。\",\"web.settings.admin_access\":\"此页面仅供 AstrBot 管理员配置。查询权限不会授予管理页面访问权。\",\"web.settings.admin_allowlist\":\"管理员不需要加入私聊白名单。\",\"web.settings.appearance\":\"语言设置\",\"web.settings.applies_after_save\":\"保存后生效。\",\"web.settings.command_access\":\"/yql 余额查询命令受管理员开关限制；预警命令按独立规则。\",\"web.settings.discard\":\"放弃修改\",\"web.settings.group_access\":\"开启群聊查询后，管理员和白名单中的用户可以在群内查询。\",\"web.settings.language\":\"插件语言\",\"web.settings.language_hint\":\"保存后生效。自动模式采用 AstrBot 提供的语言。没有可用语言时（例如定时预警）使用简体中文。\",\"web.settings.private_format\":\"私聊白名单使用完整 平台名:用户ID。\",\"web.settings.query_access\":\"查询权限\",\"web.settings.query_and_cache\":\"查询与缓存\",\"web.settings.save\":\"保存设置\",\"web.settings.save_first\":\"请先保存设置。\",\"web.settings.separate_credentials\":\"普通设置与凭据分别保存\",\"web.settings.unsaved\":\"有未保存修改\",\"web.shell.auth_required\":\"需要宿主管理授权\",\"web.shell.brand_author\":\"如月怜的\",\"web.shell.brand_name\":\"额度连结\",\"web.shell.eyebrow\":\"YOMIHIME QUOTA LINK / ADMIN\",\"web.shell.loading_config\":\"正在读取配置\",\"web.shell.open_from_host\":\"请先登录 AstrBot，再从插件详情页打开「额度查询」。\",\"web.shell.page_title\":\"额度查询\",\"web.shell.project_name\":\"如月怜的额度连结\",\"web.shell.revision\":\"配置版本 {revision}\",\"web.shell.scope\":\"统一查询 · 独立凭据\",\"web.shell.waiting\":\"等待管理会话\",\"web.status.accepted\":\"发送请求已受理（不代表送达）\",\"web.status.auth_paused\":\"凭据被拒绝，检查已暂停\",\"web.status.blocked\":\"预警发送已暂停，请检查下方原因\",\"web.status.disabled\":\"预警已关闭\",\"web.status.error\":\"检查失败，保留上次预警状态\",\"web.status.failed\":\"发送失败\",\"web.status.incomplete\":\"配置不完整，未启动\",\"web.status.low\":\"余额低于或等于阈值，预警持续中\",\"web.status.monitoring\":\"余额监测中\",\"web.status.normal\":\"余额在阈值以上\",\"web.status.paused\":\"认证或权限校验失败；修正配置或手动重试后恢复检查\",\"web.status.pending\":\"等待检查\",\"web.status.pending_send\":\"等待合并提醒\",\"web.status.recovered\":\"余额已恢复\",\"web.status.recovering\":\"额度已回升，尚未达到恢复阈值\",\"web.status.stale\":\"结果过期或指标、单位不匹配，不用于预警判断\",\"web.status.storage_unavailable\":\"预警状态存储不可用，预警未运行。\",\"web.status.submitted\":\"已提交平台，最终送达情况尚未确认\",\"web.status.unit_changed\":\"监测项或单位已变化，请确认\",\"web.status.unit_unidentified\":\"等待识别单位\",\"web.status.units_ambiguous\":\"多个单位待确认\",\"web.status.unknown\":\"发送结果未知；不会盲目重试\",\"web.status.waiting\":\"等待下次检查\",\"web.status.waiting_budget\":\"等待同一推送目标的发送间隔（至少 300 秒 / 5 分钟）；将在后续有效检查中重试\",\"web.storage.eyebrow\":\"LOCAL ENCRYPTION\",\"web.storage.key_handling\":\"主密钥由运行环境管理，不在此页面输入、导出或恢复。\",\"web.storage.ready\":\"加密存储就绪\",\"web.storage.title\":\"存储安全\",\"web.storage.troubleshooting\":\"遇到存储故障请检查宿主日志中的安全错误代码。不要在公开日志或截图中粘贴密钥。\",\"web.storage.unavailable\":\"加密存储不可用\",\"web.storage.unavailable_warning\":\"加密存储不可用。新的明文凭据不能保存，请先检查运行环境；不会改用明文存储。\",\"web.unit.ambiguous\":\"发现多个单位，请选择。\",\"web.unit.awaiting\":\"待获取\",\"web.unit.candidates_stale\":\"查询候选已过期，请重新查询。已确认的单位记录仍保留。\",\"web.unit.changed\":\"查询单位已变化，请重新确认。\",\"web.unit.choices_expired\":\"可确认候选已过期，重新查询后再选择。\",\"web.unit.choose\":\"选择单位\",\"web.unit.confirm\":\"确认单位\",\"web.unit.confirm_no_threshold\":\"改用 {unit}？阈值尚未设置。\",\"web.unit.confirm_observed\":\"请确认查询到的单位。\",\"web.unit.confirm_threshold\":\"改用 {unit}，按阈值 {threshold} 比较？\",\"web.unit.confirm_title\":\"确认单位 {unit}？\",\"web.unit.current\":\"单位：{unit}\",\"web.unit.detect_on_account_save\":\"保存账户后自动识别。\",\"web.unit.detect_on_query\":\"查询余额后自动识别。\",\"web.unit.detect_on_save\":\"保存设置后重新识别。\",\"web.unit.finish_credential_before_query\":\"完成或取消凭据输入后可重新查询。\",\"web.unit.loading\":\"处理中…\",\"web.unit.metric_changed\":\"监测项已变化：{previous} → {current}。请重新确认单位和阈值。\",\"web.unit.metric_edited\":\"监测项已改为“{metric}”，保存后重新查询并确认。\",\"web.unit.metric_or_unit_changed\":\"监测项或单位已变化，请重新确认。\",\"web.unit.no_choices\":\"当前没有可确认候选，重新查询后再选择。\",\"web.unit.query\":\"重新查询单位\",\"web.unit.query_changed\":\"查询账户或接口已变化，请重新确认单位和阈值。\",\"web.unit.query_edited\":\"查询配置已修改，保存后重新识别单位。\",\"web.unit.query_hint\":\"请求此账户的余额接口，获取新候选；不发送预警。\",\"web.unit.read\":\"读取单位状态\",\"web.unit.recorded\":\"单位记录：\",\"web.unit.save_before_query\":\"保存设置后可重新查询单位。\",\"web.unit.title\":\"预警单位\",\"web.unit.verified\":\"单位已验证。\",\"web.unit.verified_expired\":\"单位已验证。查询候选已过期，已确认的单位仍有效。\",\"web.validation.account_alert\":\"{account}：{message}\",\"web.validation.account_bounds\":\"账户超时最多 120 秒，缓存最多 86400 秒。\",\"web.validation.account_id\":\"账户 ID 不能为空或重复。\",\"web.validation.account_name\":\"请填写账户显示名称。\",\"web.validation.account_positive\":\"账户超时和缓存必须为正数。\",\"web.validation.alert_fields\":\"预警配置字段无效。\",\"web.validation.alert_prerequisites\":\"启用预警前，请启用账户并填写阈值和至少一个全局推送目标。\",\"web.validation.decimal_length\":\"阈值最多 30 位整数、18 位小数，不支持指数形式。\",\"web.validation.duplicate_umo\":\"UMO 重复，请合并为一行。\",\"web.validation.finite_decimal\":\"阈值须为不含指数的有限十进制字符串。\",\"web.validation.global_bounds\":\"全局参数超出允许范围。\",\"web.validation.group_mentions\":\"仅数字 QQ 群会话可附加 @QQ 号；私聊或其他会话请删除 @ 后缀。\",\"web.validation.id_limit\":\"QQ 号最多 {limit} 项。\",\"web.validation.interval_input\":\"请输入 1 至 4320 的整数分钟；不会自动截断或夹值。\",\"web.validation.interval_range\":\"检查间隔须为 1 至 4320 的整数分钟。\",\"web.validation.invalid_input\":\"请检查输入。\",\"web.validation.invisible_chars\":\"不允许控制字符或不可见字符。\",\"web.validation.json_object\":\"请输入有效的 JSON 对象，不要填写凭据。\",\"web.validation.language\":\"请选择受支持的插件语言。\",\"web.validation.llm_fields\":\"提示模型配置无效。\",\"web.validation.llm_ids\":\"模型与人格 ID 须为不超过 128 字的文本。\",\"web.validation.llm_switch\":\"提示模型开关无效。\",\"web.validation.mentions_suffix\":\"UMO 后请填写空格分隔的 @QQ号，或为官方 QQ 指定 scene=qq_group 或 scene=qq_c2c。\",\"web.validation.metric\":\"请选择该供应商支持的预警指标。\",\"web.validation.private_allowlist\":\"私聊白名单需使用 平台名:用户ID。\",\"web.validation.qq_id\":\"QQ 号须为 1 至 20 位 ASCII 正整数字串；不支持 @all、昵称或 CQ 码。\",\"web.validation.query_parameters\":\"请填写有效的查询参数。\",\"web.validation.recovery_order\":\"恢复阈值须严格大于触发阈值。\",\"web.validation.repeat_input\":\"请输入 0 至 4320 的整数分钟。\",\"web.validation.repeat_range\":\"重复提醒须为 0 至 4320 的整数分钟；0 表示不重复。\",\"web.validation.target_fields\":\"每个目标须包含 UMO 和提及列表。\",\"web.validation.target_limit\":\"推送目标最多 20 个。\",\"web.validation.target_line\":\"第 {line} 行：{message}\",\"web.validation.targets_text\":\"请输入推送目标。\",\"web.validation.umo_format\":\"请填写完整 UMO：平台实例:消息类型:会话 ID。\",\"web.validation.umo_invisible\":\"UMO 不允许控制字符或不可见字符。\",\"web.validation.umo_type\":\"消息类型需为 FriendMessage、GroupMessage 或 OtherMessage。\",\"web.validation.unit\":\"单位须为不超过 32 字的明确文本。\"}"),
	metadata: {
		display_name: "如月怜的额度连结",
		short_desc: "多平台 AI API 余额与用量监控",
		desc: "查询 AI API 的余额、用量与额度，统一管理账户并设置额度预警。"
	},
	config: { enable_admin_page: {
		description: "启用插件管理页面",
		hint: "账户、凭据、查询权限与超时设置均在插件页面管理。旧配置仅保留用于确认迁移，不会自动删除。"
	} }
}, t = {
	views: { "00-quota-link": { title: "額度查詢" } },
	pages: { "00-quota-link": { title: "額度查詢" } },
	strings: /* @__PURE__ */ JSON.parse("{\"alert.account_missing\":\"找不到該預警帳戶。\",\"alert.account_unqueryable\":\"帳戶暫時無法查詢，請檢查帳戶是否啟用以及查詢設定。\",\"alert.admins.count\":\"{count} 位 QQ 使用者 · 僅私訊顯示\",\"alert.admins.host_admin_note\":\"AstrBot 內建管理員也可管理。\",\"alert.admins.permissions\":\"管理權限\",\"alert.admins.qq_list\":\"QQ 允許名單\",\"alert.admins.separate_permissions\":\"額度查詢與推播收件權限分開設定。\",\"alert.admins.title\":\"警示 QQ 管理允許名單\",\"alert.command.account_candidate_required\":\"請指定帳戶與候選 ID。\",\"alert.command.account_not_unique\":\"帳戶不存在或名稱不唯一，請使用管理頁面中的帳戶 ID。\",\"alert.command.account_required\":\"請指定帳戶。\",\"alert.command.admin_required\":\"沒有權限管理額度警示。需要警示 QQ 允許名單或 AstrBot 內建管理員權限。\",\"alert.command.extra_arguments\":\"此警示指令不接受額外參數。\",\"alert.command.help_syntax\":\"用法：/yql alert help [account|units|targets]。\",\"alert.command.interval_range\":\"間隔須為範圍內的整數分鐘。\",\"alert.command.invalid_arguments\":\"警示指令參數無效。請私訊使用 /yql alert help。\",\"alert.command.invalid_target_arguments\":\"目標指令參數無效。\",\"alert.command.latest_candidate_required\":\"請選擇最新的單位候選 ID。\",\"alert.command.mention_syntax\":\"請使用 @QQ號碼 的格式，只接受數字。\",\"alert.command.parameters_required\":\"請指定帳戶及必要參數。\",\"alert.command.private_help\":\"警示管理：請私訊機器人並輸入 /yql alert help 查看詳細用法。\",\"alert.command.private_status\":\"詳細警示狀態及目標清單僅在私訊顯示。請私訊機器人執行此指令。\",\"alert.command.qq_not_allowlisted\":\"此 QQ 號碼不在警示管理允許名單中。\",\"alert.command.resumed\":\"已恢復檢查。\",\"alert.command.save_failed\":\"警示設定未儲存。請私訊查看用法，或在管理頁面修正設定。\",\"alert.command.saved\":\"警示設定已儲存。\",\"alert.command.saved_private\":\"警示設定已儲存。請私訊查看詳細狀態。\",\"alert.command.target_missing\":\"目標 ID 不存在。請私訊使用 targets list。\",\"alert.command.targets_syntax\":\"請使用 targets list/add/addhere/remove。\",\"alert.command.unsupported_official_scene\":\"目前對話不是受支援的官方 QQ 群組或個人私訊。頻道及頻道私訊無法新增。\",\"alert.command.threshold_syntax\":\"用法：threshold \\\"帳戶名稱\\\" 金額 [指標ID]。\",\"alert.command.too_long\":\"警示指令過長。\",\"alert.command.unclosed_quote\":\"引號未配對。含空格的帳戶名稱請使用雙引號。\",\"alert.command.unit_confirmed\":\"單位已確認。\",\"alert.command.unknown\":\"未知的警示指令。請使用 /yql alert help 查看用法。\",\"alert.command.untrusted_session\":\"宿主未提供可信的目前會話，目標未儲存。\",\"alert.command.value_required\":\"請指定帳戶及數值。\",\"alert.delivery.budget\":\"設定已變更或暫時無法傳送\",\"alert.delivery.cancelled\":\"設定已變更或警示已停止\",\"alert.delivery.failed\":\"平台未接受傳送，冷卻後可重試\",\"alert.delivery.fixed_hint\":\"會話 AI 無法使用或產生的內容未通過檢查，已改用一般提醒\",\"alert.delivery.llm_changed\":\"會話模型或人格已變更，已改用一般提醒\",\"alert.delivery.llm_config_unavailable\":\"會話 AI 設定無法使用，已改用一般提醒\",\"alert.delivery.llm_failed\":\"AI 提醒未能產生或未通過檢查，已改用一般提醒\",\"alert.delivery.llm_locale_changed\":\"產生通知期間語言已變更，已改用一般提醒\",\"alert.delivery.llm_model_unavailable\":\"會話模型無法使用，已改用一般提醒\",\"alert.delivery.llm_nonlocal\":\"目前執行器不支援此人格提醒呼叫，已改用一般提醒\",\"alert.delivery.llm_not_called\":\"目標會話已停用或狀態無法確認，未呼叫 AI\",\"alert.delivery.llm_off\":\"會話 AI 已關閉，已改用一般提醒\",\"alert.delivery.llm_persona_unavailable\":\"會話人格無法使用，已改用一般提醒\",\"alert.delivery.llm_session_unavailable\":\"目標會話已停用或狀態無法確認，未使用 AI 通知\",\"alert.delivery.llm_unavailable\":\"會話 AI 已關閉或狀態無法確認，已改用一般提醒\",\"alert.delivery.llm_webchat_persona\":\"會話使用專用 WebChat 人格，已改用一般提醒\",\"alert.delivery.legacy_target_unknown\":\"舊目標有一筆無法配對的傳送紀錄，結果未知。餘額恢復後，下一次進入低餘額時才會向官方 QQ 目標傳送\",\"alert.delivery.mention_invalid\":\"群組目標或提及的 QQ 號碼格式無效。請核對群組識別碼及純數字的 QQ 號碼\",\"alert.delivery.mention_unsupported\":\"目標介接器或會話類型不支援 QQ 提及。請移除 @ 或改用 aiocqhttp 群組目標\",\"alert.delivery.message_components_unavailable\":\"無法建立訊息元件。請檢查 AstrBot 訊息元件介面\",\"alert.delivery.note_suffix\":\"；{note}\",\"alert.delivery.platform_not_found\":\"找不到目標平台執行個體。請核對 UMO 中的平台執行個體 ID\",\"alert.delivery.platform_unavailable\":\"目標平台執行個體無法使用。請檢查介接器是否正常執行\",\"alert.delivery.platform_unsupported\":\"目標平台不支援主動傳送介面。請選擇支援此介面的目標平台\",\"alert.delivery.session_check_failed\":\"無法確認目標會話狀態。請檢查 AstrBot 會話狀態介面\",\"alert.delivery.session_disabled\":\"目標會話已停用。請在 AstrBot 中啟用該會話，然後等待下次檢查\",\"alert.delivery.submitted\":\"已提交平台，實際送達情況請查看平台記錄\",\"alert.delivery.target_invalid\":\"目標 UMO 格式無效。請重新選擇或填寫完整會話識別碼\",\"alert.delivery.target_scene_required\":\"官方 QQ 目標缺少對話類型。請在全域設定補填，或在目標對話使用 /yql alert targets addhere\",\"alert.delivery.transport_unavailable\":\"宿主的主動傳送介面無法使用。請檢查 AstrBot 版本及平台介接器\",\"alert.delivery.unknown\":\"傳送結果未知。為避免重複，系統不會自動重送\",\"alert.fact.line\":\"{name}：{balance}\",\"alert.fact.title\":\"【額度警示】\",\"alert.help.account_heading\":\"帳戶警示\",\"alert.help.account_rules\":\"帳戶規則\",\"alert.help.account_title\":\"帳戶警示規則\",\"alert.help.admin_note\":\"管理權限限警示 QQ 允許名單或 AstrBot 內建管理員。請私訊查看詳細狀態及名單。\",\"alert.help.admins\":\"警示 QQ 允許名單\",\"alert.help.admins_command\":\"/yql alert admins list|add QQ號碼|remove QQ號碼\",\"alert.help.admins_short\":\"管理允許名單\",\"alert.help.bind\":\"確認單位\",\"alert.help.bind_command\":\"/yql alert bind \\\"帳戶名稱\\\" 候選ID\",\"alert.help.common_actions\":\"常用操作\",\"alert.help.confirm_note\":\"確認前請核對單位，確認後門檻數值維持原值。\",\"alert.help.delivery_permissions\":\"推播與權限\",\"alert.help.interval\":\"檢查間隔（分鐘）\",\"alert.help.interval_command\":\"/yql alert interval \\\"帳戶名稱\\\" 15\",\"alert.help.interval_note\":\"間隔以分鐘為單位。重複間隔設為 0 可停用重複通知。\",\"alert.help.interval_short\":\"檢查間隔\",\"alert.help.llm\":\"AI 提示\",\"alert.help.manage_note\":\"警示 QQ 允許名單中的使用者或 AstrBot 內建管理員可管理。\",\"alert.help.more_settings\":\"更多設定\",\"alert.help.persona_note\":\"AI 提醒使用目標會話的人格。\",\"alert.help.prefix\":\"表內指令前綴：/yql alert\",\"alert.help.private_notice\":\"僅限管理員 · 請私訊查看詳細資訊\",\"alert.help.recipients_note\":\"請先確認收件人及群組成員。儲存時不會立即推播。\",\"alert.help.recovery\":\"恢復門檻\",\"alert.help.recovery_command\":\"/yql alert recovery \\\"帳戶名稱\\\" 12|auto\",\"alert.help.refresh_note\":\"查看候選為唯讀。refresh 會重新查詢餘額。\",\"alert.help.repeat\":\"重複間隔（0 表示不重複）\",\"alert.help.repeat_command\":\"/yql alert repeat \\\"帳戶名稱\\\" 0\",\"alert.help.repeat_short\":\"重複間隔\",\"alert.help.retry\":\"解除驗證暫停\",\"alert.help.retry_command\":\"/yql alert retry \\\"帳戶名稱\\\"\",\"alert.help.retry_short\":\"恢復檢查\",\"alert.help.return\":\"返回總覽：/yql alert help\",\"alert.help.set_threshold\":\"設定門檻\",\"alert.help.status\":\"警示狀態\",\"alert.help.targets_add\":\"新增指定會話\",\"alert.help.targets_add_short\":\"指定會話\",\"alert.help.targets_heading\":\"目標與管理權限\",\"alert.help.targets_here\":\"新增目前會話\",\"alert.help.targets_here_short\":\"目前會話\",\"alert.help.targets_list\":\"查看目標\",\"alert.help.targets_remove\":\"移除目標\",\"alert.help.targets_remove_command\":\"/yql alert targets remove 目標ID\",\"alert.help.targets_title\":\"推播與管理權限\",\"alert.help.threshold_command\":\"/yql alert threshold \\\"帳戶名稱\\\" 10 [指標ID]\",\"alert.help.threshold_note\":\"餘額低於或等於門檻時觸發警示。請用 help units 確認單位。\",\"alert.help.threshold_quick_command\":\"threshold \\\"帳戶名稱\\\" 10\",\"alert.help.title\":\"額度警示管理\",\"alert.help.toggle\":\"啟用或關閉\",\"alert.help.toggle_command\":\"/yql alert on|off \\\"帳戶名稱\\\"\",\"alert.help.toggle_quick_command\":\"on|off \\\"帳戶名稱\\\"\",\"alert.help.toggle_short\":\"開啟 / 關閉\",\"alert.help.trigger\":\"觸發門檻\",\"alert.help.unit_confirmation\":\"單位確認\",\"alert.help.unit_note\":\"系統自動辨識單位，並以目前單位判斷門檻。AI 提醒使用目標會話的人格。\",\"alert.help.units_read\":\"單位候選（唯讀）\",\"alert.help.units_read_command\":\"/yql alert units \\\"帳戶名稱\\\"\",\"alert.help.units_read_short\":\"查看候選\",\"alert.help.units_refresh\":\"重新整理單位候選\",\"alert.help.units_refresh_command\":\"/yql alert units \\\"帳戶名稱\\\" refresh\",\"alert.help.units_refresh_short\":\"重新整理候選\",\"alert.help.units_title\":\"辨識與確認單位\",\"alert.help.view_status\":\"查看狀態\",\"alert.invalid_unit\":\"候選單位無效，或預警執行狀態已更新。請重新整理後再試。\",\"alert.metric.available\":\"可用額度\",\"alert.metric.available_cash\":\"現金餘額\",\"alert.metric.credit\":\"點數餘額\",\"alert.metric.credit_amount\":\"信用額度\",\"alert.metric.granted\":\"贈送餘額\",\"alert.metric.mapped\":\"對應餘額\",\"alert.metric.site_credit\":\"站內額度\",\"alert.metric.topped_up\":\"儲值餘額\",\"alert.metric.total\":\"總餘額\",\"alert.metric_changed\":\"監測項目已變更，請確認門檻與單位\",\"alert.no_metric_unit\":\"此次未取得目前監測項目的有效候選單位，請檢查查詢結果與監測項目後重試。\",\"alert.no_unit\":\"此次未取得有效的候選單位，請檢查查詢狀態，稍後重試。\",\"alert.query_identity_changed\":\"帳戶查詢設定已變更，請重新確認門檻與單位\",\"alert.receipt.result\":\"處理結果\",\"alert.receipt.title\":\"操作完成\",\"alert.runtime_changed\":\"預警執行狀態已更新，請重新整理後再試。\",\"alert.state.blocked\":\"預警設定不完整或目標無法使用\",\"alert.state.disabled\":\"預警已關閉\",\"alert.state.error\":\"查詢失敗，保留原有預警狀態。錯誤不視為零餘額\",\"alert.state.failed\":\"平台未接受傳送，稍後可重試\",\"alert.state.low\":\"額度低於或等於門檻，等待滿足傳送間隔或目標恢復\",\"alert.state.monitoring\":\"監測中，尚未觸發預警\",\"alert.state.paused\":\"驗證或權限檢查失敗。修正設定或手動重試後恢復檢查\",\"alert.state.recovered\":\"已達到恢復門檻，等待下次低額事件\",\"alert.state.recovering\":\"額度已回升，尚未達到恢復門檻\",\"alert.state.stale\":\"未取得指標與單位相符的新餘額資料，保留原有狀態\",\"alert.state.storage_unavailable\":\"預警狀態儲存無法使用，已停止檢查與傳送\",\"alert.state.submitted\":\"已提交至平台，尚未確認送達\",\"alert.state.unit_changed\":\"監測項目、單位或查詢設定已變更，請確認後繼續\",\"alert.state.unit_unidentified\":\"等待有效查詢辨識額度單位\",\"alert.state.units_ambiguous\":\"有多個或重複的單位，請確認實際候選單位\",\"alert.state.unknown\":\"傳送結果不明。為避免重複，系統不會自動重傳\",\"alert.state.waiting\":\"等待下次檢查\",\"alert.state.waiting_budget\":\"傳送至同一目標的訊息須至少間隔 300 秒，等待下一次有效檢查\",\"alert.status.account_count\":\"{count} 個帳戶 · 本機執行記錄\",\"alert.status.account_id\":\"帳戶 ID\",\"alert.status.blocked\":\"需要檢查設定\",\"alert.status.delivery_note\":\"本機記錄 · 實際送達情況請查看平台記錄。\",\"alert.status.empty\":\"目前沒有可顯示的警示檢查記錄。\",\"alert.status.empty_heading\":\"暫無帳戶狀態\",\"alert.status.failed\":\"平台未接受傳送\",\"alert.status.last_checked\":\"最近檢查\",\"alert.status.last_sent\":\"最近提交平台\",\"alert.status.low\":\"額度偏低\",\"alert.status.monitoring\":\"監測中\",\"alert.status.no_record\":\"暫無記錄\",\"alert.status.paused\":\"檢查已暫停\",\"alert.status.recovered\":\"已恢復\",\"alert.status.recovering\":\"額度回升中\",\"alert.status.running\":\"檢查工作已啟動\",\"alert.status.scheduler\":\"{task} · 狀態儲存{storage}\",\"alert.status.stale\":\"等待有效餘額\",\"alert.status.stopped\":\"檢查工作未執行\",\"alert.status.storage_unavailable\":\"儲存空間無法使用\",\"alert.status.submitted\":\"已提交平台\",\"alert.status.title\":\"額度警示狀態\",\"alert.status.unit_changed\":\"需要重新確認\",\"alert.status.unit_unidentified\":\"等待辨識單位\",\"alert.status.units_ambiguous\":\"待確認單位\",\"alert.status.unknown\":\"傳送結果未知\",\"alert.status.waiting\":\"等待檢查\",\"alert.status.waiting_budget\":\"等待傳送間隔\",\"alert.targets.add_note\":\"使用 targets add 或 targets addhere 新增已確認的目標。手動填寫官方 QQ 目標時，在 UMO 後加上 scene=qq_group（群組）或 scene=qq_c2c（個人私訊）。\",\"alert.targets.count\":\"{count} 個目標 · 僅私訊顯示\",\"alert.targets.empty\":\"尚未設定警示目標\",\"alert.targets.item\":\"目標 {index} · {key}\",\"alert.targets.mentions\":\"群組提及\",\"alert.targets.remove_command\":\"移除指令\",\"alert.targets.save_note\":\"管理員確認收件人及群組成員後再設定。儲存時僅更新本機目標。\",\"alert.targets.title\":\"警示推播目標\",\"alert.targets.umo\":\"會話 UMO\",\"alert.unit_changed\":\"查詢單位已變更，請重新確認門檻與單位\",\"alert.unit_expired\":\"候選單位已過期或不再相符，請先查詢餘額，再重新整理候選單位。\",\"alert.units.ambiguous\":\"多個單位待確認\",\"alert.units.auto_detect_note\":\"查詢餘額後自動辨識。\",\"alert.units.bind_command\":\"確認指令：/yql alert bind \\\"帳戶名稱\\\" 候選ID\",\"alert.units.binding_valid_note\":\"候選逾期時，既有的有效繫結仍然有效。\",\"alert.units.bound_metric\":\"已繫結指標\",\"alert.units.candidate\":\"候選 {index} · {unit}\",\"alert.units.candidate_id\":\"候選 ID\",\"alert.units.candidate_updated\":\"候選更新時間\",\"alert.units.candidates_empty\":\"暫無可確認候選\",\"alert.units.candidates_expired\":\"候選已逾期\",\"alert.units.change_reason\":\"變更原因\",\"alert.units.current_and_bound\":\"目前 / 已繫結指標\",\"alert.units.current_metric\":\"目前指標\",\"alert.units.current_unit\":\"目前單位\",\"alert.units.identity_changed\":\"查詢身分已變更，請重新確認\",\"alert.units.last_verified\":\"最近驗證\",\"alert.units.metric\":\"指標\",\"alert.units.metric_changed\":\"指標已變更，請重新確認\",\"alert.units.metric_unknown\":\"待辨識\",\"alert.units.not_bound\":\"尚未繫結\",\"alert.units.pending_query\":\"待取得\",\"alert.units.readonly\":\"既有查詢結果 · 唯讀狀態\",\"alert.units.readonly_note\":\"清單讀取既有查詢結果。候選逾期時可手動更新。\",\"alert.units.refresh_command\":\"使用 /yql alert units \\\"帳戶名稱\\\" refresh 手動更新候選。\",\"alert.units.refreshed\":\"已要求更新 · 最新本機狀態\",\"alert.units.refreshed_note\":\"此次依要求更新帳戶餘額。\",\"alert.units.stale\":\"單位驗證已逾期\",\"alert.units.threshold_note\":\"確認前請核對門檻含義，確認後保留門檻原值。\",\"alert.units.title\":\"警示單位與候選\",\"alert.units.unit_changed\":\"單位已變更，請重新確認\",\"alert.units.verified\":\"單位已驗證\",\"balance.expiry\":\"到期\",\"balance.expiry_date\":\"到期 {time}\",\"balance.item_expiry\":\"{label}到期\",\"balance.item_note\":\"{label}說明\",\"balance.kind.cash\":\"現金餘額\",\"balance.kind.credits\":\"點數\",\"balance.kind.custom\":\"自訂項目\",\"balance.kind.free_quota\":\"免費額度\",\"balance.kind.quota\":\"額度\",\"balance.kind.subscription\":\"方案\",\"balance.kind.usage\":\"用量\",\"balance.remaining\":\"剩餘\",\"balance.remaining_amount\":\"剩餘 {amount}\",\"balance.semantics\":\"語義說明 {meaning}\",\"balance.site_credit_meaning\":\"帳戶站內額度以 site_credit 計量。\",\"balance.total\":\"總量\",\"balance.total_amount\":\"總量 {amount}\",\"balance.unknown_amount\":\"數值未知（單位：{unit}）\",\"balance.unknown_unit\":\"未知單位\",\"balance.unreported\":\"未提供（單位：{unit}）\",\"balance.used\":\"已用\",\"balance.used_amount\":\"已用 {amount}\",\"balance.value_separator\":\"；\",\"capability.alibaba\":\"阿里雲百煉\",\"capability.alibaba_balance\":\"阿里雲帳戶餘額（BSS：現金／可用／信用）\",\"capability.cash\":\"現金餘額\",\"capability.compatible\":\"OpenAI 相容服務\",\"capability.credential_missing\":\"未設定可用憑證\",\"capability.credits\":\"點數\",\"capability.custom\":\"使用者設定的餘額類別\",\"capability.deepseek_balance\":\"多幣別帳戶餘額\",\"capability.endpoint_invalid\":\"餘額查詢端點設定無效\",\"capability.free_quota\":\"免費額度\",\"capability.grsai_region\":\"Grsai 節點設定無效\",\"capability.grsai_token_missing\":\"未設定 Grsai 帳戶請求權杖\",\"capability.host_invalid\":\"Host 設定無效\",\"capability.host_missing\":\"缺少 HTTPS 服務根網址 Host\",\"capability.kind_invalid\":\"Grsai 點數類別必須對應為 credits\",\"capability.mapping_invalid\":\"餘額欄位對應尚未設定或無效\",\"capability.meinianda_balance\":\"帳戶站內額度（site_credit）\",\"capability.path_invalid\":\"API Path 設定無效\",\"capability.path_missing\":\"缺少以 / 開頭的相對 API Path\",\"capability.profile_invalid\":\"服務類型設定無效\",\"capability.quota\":\"額度\",\"capability.scope_invalid\":\"餘額範圍設定無效\",\"capability.subscription\":\"訂閱額度\",\"capability.unqueryable\":\"目前的設定無法查詢\",\"capability.usage\":\"用量\",\"common.empty\":\"空白\",\"common.field_separator\":\"：\",\"common.label_value\":\"{label}：{value}\",\"common.list_separator\":\"、\",\"common.none\":\"無\",\"common.unknown\":\"未知\",\"config.account_id\":\"帳戶 id 必須為非空字串\",\"config.account_mapping\":\"帳戶設定必須是物件\",\"config.admin_boolean\":\"command_admin_only 必須為布林值，已使用預設值\",\"config.aliases\":\"aliases 必須是由非空字串組成的清單\",\"config.auth_mapping\":\"auth 必須是物件\",\"config.balance_scope\":\"餘額範圍只能是 generic、account 或 api_key\",\"config.bss_auth\":\"阿里雲 BSS 查詢需要獨立的 AccessKey ID 和 AccessKey Secret\",\"config.compatible_auth\":\"相容介面需要設定 API 金鑰\",\"config.conflict\":\"設定已變更，請重新整理後再次確認。\",\"config.conflicting_account\":\"帳戶名稱與其他帳戶衝突\",\"config.credential_in_field\":\"一般設定欄位不得包含憑證。\",\"config.credential_operation\":\"憑證只能透過專用的憑證操作儲存。\",\"config.display_name\":\"display_name 必須為非空字串\",\"config.duplicate_credential\":\"憑證不得與一般設定欄位重複。\",\"config.duplicate_id\":\"帳戶 id 重複\",\"config.enabled_boolean\":\"enabled 必須為布林值，已停用帳戶\",\"config.endpoint_mapping\":\"endpoint 必須是物件\",\"config.group_boolean\":\"allow_group_queries 必須為布林值，已使用預設值\",\"config.group_list\":\"group_allowed_user_ids 必須是由非空字串組成的清單，已使用空清單\",\"config.grsai_account_only\":\"Grsai 目前僅支援帳戶點數，尚未提供 API Key 點數預設\",\"config.grsai_account_path\":\"Grsai 帳戶點數僅支援 /client/openapi/getCredits\",\"config.grsai_api_key_scope\":\"尚未提供 Grsai API Key 點數預設，請選擇帳戶點數\",\"config.grsai_credits\":\"Grsai 點數查詢必須將 kind 固定對應為 credits\",\"config.grsai_path_scope\":\"Grsai getCredits 端點應選擇 account，getAPIKeyCredits 端點應選擇 api_key\",\"config.grsai_post\":\"此 Grsai 點數端點要求使用 POST\",\"config.grsai_region\":\"Grsai 節點只能選擇中國大陸直連或海外\",\"config.grsai_required\":\"帳戶餘額或 API Key 餘額範圍僅適用於所選的 Grsai 服務\",\"config.grsai_scope\":\"Grsai 目前僅支援帳戶點數預設\",\"config.grsai_token\":\"Grsai 帳戶點數需要使用者資訊中的請求權杖 token\",\"config.invalid\":\"設定無效，請檢查欄位與資料類型。\",\"config.invalid_amount_mapping\":\"相容介面必須設定有效的 amount_path 對應\",\"config.invalid_endpoint\":\"餘額端點必須是安全的 HTTPS GET 或 POST 設定\",\"config.invalid_host\":\"Host 必須是沒有路徑、查詢參數或片段的 HTTPS 服務根網址\",\"config.invalid_path\":\"API Path 必須以單個 / 開頭，且不得包含完整 URL、查詢參數或片段\",\"config.invalid_root\":\"設定根節點必須是物件\",\"config.legacy_credential_in_field\":\"舊設定的一般欄位包含憑證，原有設定未刪除。\",\"config.legacy_credential_shape\":\"舊憑證結構無法安全移轉，原有設定未刪除。\",\"config.migrate_first\":\"請先確認並移轉舊設定，再修改設定。\",\"config.missing_auth\":\"缺少可用憑證\",\"config.missing_endpoint\":\"缺少餘額查詢端點\",\"config.missing_env\":\"尚未設定所引用的憑證環境變數\",\"config.missing_host\":\"請填寫 HTTPS 服務根網址 Host\",\"config.missing_path\":\"請填寫以 / 開頭的相對 API Path\",\"config.positive_integer\":\"{path} 必須為正整數，已使用預設值\",\"config.positive_number\":\"{path} 必須為正數，已使用預設值\",\"config.private_list\":\"private_allowed_user_ids 必須為「平台名稱:使用者 ID」格式的文字清單，已使用空清單\",\"config.provider_immutable\":\"現有帳戶的供應商類型無法變更，請建立新帳戶。\",\"config.provider_type\":\"未知的供應商類型\",\"config.providers_list\":\"providers 必須為清單\",\"config.response_mapping\":\"response_mapping 必須是物件，已使用空物件\",\"config.secret_in_name\":\"帳戶名稱不得包含憑證\",\"config.service_profile\":\"相容服務類型只能是 generic 或 grsai\",\"config.storage_unavailable\":\"安全儲存暫時無法使用，未改用明文。請檢查金鑰與儲存狀態。\",\"config.template_mismatch\":\"帳戶範本與供應商類型不一致\",\"config.wallet_origin\":\"請輸入站點的 HTTPS 根網址，例如 https://gateway.example。\",\"config.wallet_origin_credential\":\"若要更換站點網址，請先清除此帳戶的查詢憑證。\",\"config.wallet_region\":\"請選擇與查詢金鑰相符的地區。\",\"config.wallet_team\":\"請輸入 xAI 團隊 ID，只能使用英文字母、數字、連字號與底線。\",\"credential.encrypted\":\"已儲存加密憑證\",\"credential.environment\":\"已儲存環境變數參照\",\"credential.missing\":\"尚未儲存憑證\",\"credential.mixed\":\"已儲存加密憑證及環境變數參照\",\"credential.unknown\":\"儲存狀態待確認\",\"error.alert_config.account_disabled\":\"啟用預警前，請先啟用帳戶。\",\"error.alert_config.decimal_format\":\"{label}須為一般十進位文字，且不支援科學記號。\",\"error.alert_config.duplicate_target\":\"預警目標的 UMO 重複，請合併為同一列。\",\"error.alert_config.group_mention_only\":\"只有群組 ID 為數字的 QQ 群組可設定 @QQ 號碼。私訊請移除提及。\",\"error.alert_config.integer_range\":\"{label}必須為 {low}–{high} 的整數。\",\"error.alert_config.invalid_enabled\":\"預警開關必須為布林值。\",\"error.alert_config.invalid_model_enabled\":\"預警模型開關必須為布林值。\",\"error.alert_config.invalid_model_object\":\"預警模型設定結構無效。\",\"error.alert_config.invalid_object\":\"帳戶預警設定必須為物件。\",\"error.alert_config.invalid_admin_id\":\"{label}需填寫 QQ 號或 qq_official:UID；不接受 UMO 或全體提及。\",\"error.alert_config.invalid_qq_id\":\"{label}僅支援以 ASCII 正整數表示的 QQ 號碼，無法 @全體。\",\"error.alert_config.invalid_target_fields\":\"每個預警目標須包含 umo 和 mentions，可選填 scene。\",\"error.alert_config.invalid_target_scene\":\"官方 QQ 群組請為 GroupMessage 指定 scene=qq_group，個人私訊請為 FriendMessage 指定 scene=qq_c2c。兩種目標均不支援 @。\",\"error.alert_config.invalid_text\":\"{label}必須為不含控制字元的文字。\",\"error.alert_config.invalid_text_format\":\"{label}長度或格式無效。\",\"error.alert_config.invalid_umo\":\"UMO 格式須為「平台執行個體:訊息類型:工作階段ID」。\",\"error.alert_config.label.admin_qq\":\"預警管理 QQ 允許清單\",\"error.alert_config.label.check_interval\":\"檢查間隔（分鐘）\",\"error.alert_config.label.mentions\":\"群組內提及\",\"error.alert_config.label.metric\":\"預警指標\",\"error.alert_config.label.model\":\"模型 ID\",\"error.alert_config.label.persona\":\"人格 ID\",\"error.alert_config.label.recovery_threshold\":\"恢復門檻\",\"error.alert_config.label.repeat_interval\":\"持續低額時的重複通知間隔（分鐘，0 表示不重複）\",\"error.alert_config.label.threshold\":\"額度門檻\",\"error.alert_config.label.unit\":\"預警單位\",\"error.alert_config.list_limit\":\"{label}須為最多 {limit} 個項目的清單。\",\"error.alert_config.missing_targets\":\"啟用預警前，請至少設定一個推播目標。\",\"error.alert_config.missing_threshold_or_metric\":\"請設定門檻和指標。\",\"error.alert_config.recovery_threshold_order\":\"恢復門檻必須高於額度門檻。\",\"error.alert_config.target_limit\":\"預警推播目標須為最多 {limit} 個項目的清單。\",\"error.alert_config.unknown_fields\":\"帳戶預警設定含有未知欄位。\",\"error.alert_config.unsupported_metric\":\"此供應商不支援該預警指標。\",\"error.query.empty_target\":\"目標名稱不得為空\",\"error.query.invalid_arguments\":\"此命令不接受目標參數\",\"error.query.multiple_targets\":\"偵測到多個帳戶或供應商，請指定一個目標\",\"error.query.unknown_target\":\"找不到相符的帳戶或供應商\",\"help.account_command\":\"/yql account <名稱>\",\"help.alerts\":\"額度警示\",\"help.aliyun_note\":\"阿里雲 BSS 查詢現金餘額、可用額度和信用額度。RAM 身分至少需要 AliyunBSSReadOnlyAccess。\",\"help.all_accounts\":\"所有帳戶\",\"help.all_command\":\"/yql  或  /yql all\",\"help.card_subtitle\":\"查詢額度 · 查看本機設定\",\"help.card_title\":\"YQL 使用說明\",\"help.card_tool_note\":\"啟用函式工具後，可用自然語言查詢額度。\",\"help.command_body\":\"如月怜的額度連結\\n用法：\\n  /yql                 查詢所有帳戶\\n  /yql help            查看說明\\n  /yql status          查看本機設定狀態\\n  /yql all             查詢所有帳戶\\n  /yql <名稱>          查詢指定帳戶或供應商\\n  /yql account <名稱>  查詢指定帳戶\\n  /yql provider <名稱> 查詢指定供應商\\n\",\"help.compatible_note\":\"OpenAI 相容服務的餘額查詢使用供應商專屬介面。請依餘額文件填寫服務位址、介面路徑及進階驗證／回應對應。完成設定後即可查詢。\",\"help.configured_accounts\":\"已設定帳戶：{names}\",\"help.enabled_accounts\":\"已啟用帳戶 · {count} 個\",\"help.local_config\":\"本機設定\",\"help.local_note\":\"help 和 status 讀取本機資訊。\",\"help.management_note\":\"請在管理頁面設定供應商介面與憑證。\",\"help.name_note\":\"也可使用 /yql <名稱>，支援顯示名稱、別名和供應商名稱。\",\"help.no_accounts\":\"目前未設定帳戶。\",\"help.no_enabled_accounts\":\"尚未設定啟用的帳戶。請先在管理頁面新增帳戶。\",\"help.provider_command\":\"/yql provider <名稱>\",\"help.query\":\"查詢額度\",\"help.select_account\":\"指定帳戶\",\"help.select_provider\":\"指定供應商\",\"help.status_heading\":\"說明與狀態\",\"help.tool_note\":\"在啟用函式工具的 AI 對話中，也可用自然語言讓模型呼叫 yql_query_balance。\",\"help.usage\":\"使用說明\",\"provider.alibaba_bailian.authentication\":\"阿里雲存取金鑰驗證失敗\",\"provider.alibaba_bailian.available_credit\":\"可用額度\",\"provider.alibaba_bailian.cash_balance\":\"現金餘額\",\"provider.alibaba_bailian.connection\":\"無法連線至阿里雲餘額服務\",\"provider.alibaba_bailian.credit_limit\":\"信用額度\",\"provider.alibaba_bailian.fallback_account\":\"阿里雲帳戶\",\"provider.alibaba_bailian.invalid_credentials\":\"阿里雲餘額查詢憑證設定無效\",\"provider.alibaba_bailian.invalid_request\":\"阿里雲餘額查詢請求設定無效\",\"provider.alibaba_bailian.invalid_response\":\"無法辨識阿里雲傳回的餘額資料格式\",\"provider.alibaba_bailian.permission\":\"阿里雲拒絕存取帳戶現金餘額。請至少將 AliyunBSSReadOnlyAccess 授予查詢目前 BSS 現金餘額的 RAM 身分。DashScope 模型 API Key 無法取代此 RAM 授權，無須授予 BSS FullAccess。\",\"provider.alibaba_bailian.query_failed\":\"阿里雲帳戶現金餘額查詢失敗\",\"provider.alibaba_bailian.rate_limited\":\"阿里雲餘額查詢受到流量限制，請稍後再試\",\"provider.alibaba_bailian.request_denied\":\"阿里雲拒絕了帳戶現金餘額查詢請求\",\"provider.alibaba_bailian.source\":\"阿里雲帳戶餘額與額度\",\"provider.alibaba_bailian.timeout\":\"阿里雲現金餘額查詢逾時\",\"provider.alibaba_bailian.too_many_requests\":\"阿里雲餘額查詢過於頻繁，請稍後再試\",\"provider.alibaba_bailian.unavailable\":\"阿里雲餘額服務暫時無法使用\",\"provider.deepseek.authentication\":\"DeepSeek API 金鑰驗證失敗\",\"provider.deepseek.connection\":\"無法連線至 DeepSeek 餘額服務\",\"provider.deepseek.granted_balance\":\"未到期贈金餘額\",\"provider.deepseek.insufficient_balance\":\"DeepSeek 帳戶餘額不足，目前無法呼叫 API\",\"provider.deepseek.invalid_request\":\"DeepSeek 餘額查詢請求設定無效\",\"provider.deepseek.invalid_response\":\"無法辨識 DeepSeek 傳回的餘額資料格式\",\"provider.deepseek.missing_key\":\"DeepSeek 帳戶缺少有效的 API 金鑰\",\"provider.deepseek.permission\":\"DeepSeek 拒絕了餘額查詢\",\"provider.deepseek.rate_limited\":\"DeepSeek 請求過於頻繁，請稍後再試\",\"provider.deepseek.request_denied\":\"DeepSeek 拒絕了餘額查詢請求\",\"provider.deepseek.source\":\"DeepSeek API\",\"provider.deepseek.timeout\":\"DeepSeek 餘額查詢逾時\",\"provider.deepseek.topped_up_balance\":\"儲值餘額\",\"provider.deepseek.total_balance\":\"總可用餘額\",\"provider.deepseek.unavailable\":\"DeepSeek 餘額查詢暫時失敗\",\"provider.glm_plan.credits\":\"點數用量\",\"provider.glm_plan.five_hours\":\"5 小時時段\",\"provider.glm_plan.mcp\":\"MCP 用量\",\"provider.glm_plan.monthly\":\"每月時段\",\"provider.glm_plan.other_window\":\"時段 {number}\",\"provider.glm_plan.source\":\"GLM Coding Plan 官方額度 API\",\"provider.glm_plan.tokens\":\"權杖用量\",\"provider.glm_plan.weekly\":\"每週時段\",\"provider.glm_plan.window\":\"{category} · {window}\",\"provider.meinianda.authentication\":\"Meinianda API Key 驗證失敗\",\"provider.meinianda.connection\":\"無法連線至 Meinianda 餘額服務\",\"provider.meinianda.invalid_request\":\"Meinianda 餘額查詢請求設定無效\",\"provider.meinianda.invalid_response\":\"無法辨識 Meinianda 傳回的餘額資料格式\",\"provider.meinianda.missing_key\":\"Meinianda 帳戶缺少有效的 API Key\",\"provider.meinianda.permission\":\"Meinianda 拒絕了餘額查詢\",\"provider.meinianda.query_failed\":\"Meinianda 未能完成餘額查詢\",\"provider.meinianda.rate_limited\":\"Meinianda 請求過於頻繁，請稍後再試\",\"provider.meinianda.site_credit\":\"帳戶站內額度\",\"provider.meinianda.site_credit_note\":\"帳戶站內額度與 API Key 限額是不同的額度，且不換算為貨幣\",\"provider.meinianda.source\":\"Meinianda 餘額 API\",\"provider.meinianda.timeout\":\"Meinianda 餘額查詢逾時\",\"provider.meinianda.unavailable\":\"Meinianda 餘額查詢暫時失敗\",\"provider.minimax_plan.exhausted\":\"{window}（已用盡）\",\"provider.minimax_plan.general\":\"通用資源\",\"provider.minimax_plan.interval\":\"{model} · 目前時段\",\"provider.minimax_plan.not_in_plan\":\"{window}（目前方案未包含）\",\"provider.minimax_plan.other_model\":\"資源群組 {number}\",\"provider.minimax_plan.source\":\"MiniMax 官方方案額度 API\",\"provider.minimax_plan.unlimited\":\"{window}（無用量上限）\",\"provider.minimax_plan.video\":\"影片資源\",\"provider.minimax_plan.weekly\":\"{model} · 每週時段\",\"provider.minimax_plan.weekly_boost\":\"{model} · 每週額度倍率\",\"provider.moonshot.cash_balance\":\"現金餘額\",\"provider.moonshot.source\":\"Kimi 開放平台帳戶餘額\",\"provider.moonshot.voucher_balance\":\"抵用券餘額\",\"provider.new_api.effective_quota\":\"此權杖可用額度\",\"provider.new_api.key_quota\":\"權杖額度\",\"provider.new_api.source\":\"New API 權杖額度介面\",\"provider.new_api.unlimited\":\"權杖額度無上限\",\"provider.new_api.user_quota\":\"帳戶額度\",\"provider.novita.available\":\"可用帳戶額度\",\"provider.novita.cash\":\"儲值餘額\",\"provider.novita.credit_limit\":\"信用額度上限\",\"provider.novita.outstanding\":\"未付帳單金額\",\"provider.novita.source\":\"Novita AI 帳戶餘額 API\",\"provider.openai_compatible.authentication\":\"餘額介面驗證失敗\",\"provider.openai_compatible.business_failure\":\"餘額服務回報查詢失敗\",\"provider.openai_compatible.connection\":\"餘額介面連線失敗\",\"provider.openai_compatible.grsai_authentication\":\"帳戶點數介面傳回 HTTP 401，請檢查驗證設定\",\"provider.openai_compatible.grsai_permission\":\"帳戶點數介面傳回 HTTP 403，請檢查存取設定\",\"provider.openai_compatible.grsai_query_failed\":\"帳戶點數介面請求失敗\",\"provider.openai_compatible.grsai_rate_limited\":\"帳戶點數介面傳回 HTTP 429，請稍後重試\",\"provider.openai_compatible.grsai_source\":\"Grsai 帳戶點數介面\",\"provider.openai_compatible.https_required\":\"餘額介面必須使用 HTTPS\",\"provider.openai_compatible.invalid_configuration\":\"相容平台餘額查詢設定無效\",\"provider.openai_compatible.invalid_request\":\"餘額介面請求設定無效\",\"provider.openai_compatible.invalid_response\":\"無法辨識餘額介面傳回的資料格式\",\"provider.openai_compatible.not_found\":\"餘額介面路徑或版本不存在\",\"provider.openai_compatible.permission\":\"餘額介面拒絕存取\",\"provider.openai_compatible.rate_limited\":\"餘額介面請求過於頻繁，請稍後再試\",\"provider.openai_compatible.source\":\"OpenAI 相容餘額介面\",\"provider.openai_compatible.timeout\":\"餘額介面查詢逾時\",\"provider.openai_compatible.unavailable\":\"餘額介面請求暫時失敗\",\"provider.openrouter.balance\":\"可用帳戶額度\",\"provider.openrouter.source\":\"OpenRouter 帳戶額度 API\",\"provider.pollinations.held\":\"凍結的任務 Pollen\",\"provider.pollinations.paid\":\"付費 Pollen\",\"provider.pollinations.quest\":\"任務 Pollen\",\"provider.pollinations.source\":\"Pollinations 官方帳戶餘額 API\",\"provider.pollinations.total\":\"可用 Pollen\",\"provider.retry.explicit_throttling\":\"餘額服務回報已達請求速率限制，請稍後重試\",\"provider.stepfun.source\":\"階躍星辰開放平台帳戶餘額\",\"provider.stepfun.total_cash\":\"累計儲值金額\",\"provider.stepfun.total_voucher\":\"累計贈送金額\",\"provider.sub2api.key_quota\":\"API Key 額度\",\"provider.sub2api.source\":\"Sub2API 額度查詢\",\"provider.sub2api.wallet_balance\":\"錢包餘額\",\"provider.venice.available_balance\":\"美元預付餘額\",\"provider.venice.bundled_credits\":\"剩餘方案額度\",\"provider.venice.diem_balance\":\"本週期剩餘 DIEM\",\"provider.venice.earned_credits\":\"剩餘獎勵額度\",\"provider.venice.no_numeric_balance\":\"API 沒有回傳具體餘額。\",\"provider.venice.source\":\"Venice 帳戶餘額 API\",\"provider.vercel_gateway.balance\":\"可用團隊額度\",\"provider.vercel_gateway.lifetime_usage\":\"累計已用額度\",\"provider.vercel_gateway.source\":\"Vercel AI Gateway 團隊額度 API\",\"provider.wallet.authentication\":\"供應商拒絕了查詢憑證。\",\"provider.wallet.available_balance\":\"可用餘額\",\"provider.wallet.configuration\":\"請檢查查詢憑證與帳戶設定。\",\"provider.wallet.endpoint\":\"餘額或額度介面無法使用，請檢查帳戶設定。\",\"provider.wallet.parse\":\"無法讀取供應商回傳的餘額或額度。\",\"provider.wallet.permission\":\"目前的憑證無權查詢此帳戶的餘額或額度。\",\"provider.wallet.rate_limited\":\"查詢過於頻繁，請稍後重試。\",\"provider.wallet.unavailable\":\"供應商暫時無法提供餘額或額度。\",\"provider.wallet.unsupported\":\"目前不支援此介面回傳的額度類型。\",\"provider.xai.posted_balance\":\"已入帳預付額度\",\"provider.xai.posted_note\":\"本帳期尚未入帳的用量可能還未從餘額扣除。\",\"provider.xai.source\":\"xAI 團隊預付額度帳本\",\"query.account_card_title\":\"帳戶額度與用量\",\"query.account_incomplete\":\"帳戶設定不完整，暫時無法查詢\",\"query.account_outcome_count\":\"{count} 個{label}\",\"query.account_timeout\":\"帳戶查詢超過時限\",\"query.account_title\":\"帳戶查詢：{target}\",\"query.accounts_count\":\"{count} 個帳戶\",\"query.all_card_title\":\"額度與用量\",\"query.all_title\":\"額度與用量查詢\",\"query.authentication_paused\":\"驗證或權限檢查失敗，已暫停。更新設定或手動重試後恢復\",\"query.available\":\"可用\",\"query.cached\":\"（快取）\",\"query.cached_card\":\" · 快取資料\",\"query.client_unconfigured\":\"尚未設定查詢用戶端\",\"query.cooldown_account\":\"帳戶查詢暫停中，請在 {seconds} 秒後重試\",\"query.cooldown_provider\":\"供應商查詢暫停中，請在 {seconds} 秒後重試\",\"query.empty_title\":\"暫無結果\",\"query.error_detail\":\"  查詢失敗：{message}\",\"query.failed\":\"查詢失敗\",\"query.failed_short\":\"失敗\",\"query.invalid_operation\":\"操作類型必須為 query 或 list。\",\"query.invalid_provider_result\":\"供應商傳回的帳戶結果無效\",\"query.invalid_request\":\"無法辨識查詢要求。\",\"query.invalid_target\":\"查詢目標必須是帳戶、供應商名稱或 all。\",\"query.matches\":\"{message}\\n符合項目：{candidates}\",\"query.no_accounts\":\"目前未設定可查詢的帳戶。\",\"query.no_items\":\"沒有可顯示的餘額或用量項目\",\"query.no_results\":\"沒有可顯示的查詢結果。\",\"query.outcome_count\":\"{label} {count}\",\"query.partial\":\"部分可用\",\"query.partial_data\":\"已取得部分資料\",\"query.partial_success\":\"部分成功\",\"query.permission_denied\":\"目前的對話沒有查詢額度的權限。\",\"query.provider_card_title\":\"供應商額度與用量\",\"query.provider_title\":\"供應商查詢：{target}\",\"query.provider_unsupported\":\"尚未支援此供應商的餘額查詢\",\"query.queue_timeout\":\"等待查詢時超過帳戶時限\",\"query.service_closed\":\"查詢服務已關閉\",\"query.source_time\":\"  取得時間：{time} · 來源：{source}\",\"query.source_time_card\":\"來源：{source} · 取得：{time}\",\"query.status_unavailable\":\"無法使用\",\"query.success\":\"查詢成功\",\"query.success_short\":\"成功\",\"query.summary\":\"查詢摘要：{summary}。\",\"query.summary_separator\":\"，\",\"query.target_card\":\"目標：{target}\\n\",\"query.time\":\"查詢時間：{time}\",\"query.time_card\":\"查詢：{time}\",\"query.total_timeout\":\"查詢超過總時限\",\"query.unavailable\":\"查詢暫時無法使用\",\"query.unknown_status\":\"狀態未知\",\"status.account_list\":\"帳戶清單：\",\"status.accounts_count\":\"帳戶：共 {total} 個，啟用 {enabled} 個，可查詢 {ready} 個\",\"status.add_account\":\"在管理頁面新增帳戶與憑證\",\"status.admin_only\":\"僅限管理員\",\"status.after_save\":\"儲存後輸入 /yql status 查看本機設定，再用 /yql 查詢額度。\",\"status.api_path\":\"請填寫以 / 開頭的相對介面路徑\",\"status.card_access\":\"存取與憑證\",\"status.card_counts\":\"{total} 個帳戶 · {enabled} 個已啟用 · {ready} 個設定完整\",\"status.card_incomplete\":\"待補齊：{reason}\",\"status.card_issues\":\"設定問題 · {count} 項\",\"status.card_needs_check\":\"待檢查：{reason}\",\"status.card_needs_setup\":\"待設定：{reason}\",\"status.card_no_accounts\":\"尚未設定帳戶\",\"status.card_online_check\":\"可用 /yql 查詢連線及餘額。\",\"status.card_source\":\"依據本機帳戶清單與憑證儲存記錄\",\"status.card_title\":\"本機設定狀態\",\"status.credential_storage\":\"憑證儲存\",\"status.credential_storage_state\":\"憑證儲存：{state}\",\"status.disabled\":\"已停用\",\"status.enabled\":\"已開啟\",\"status.group_queries\":\"群組查詢\",\"status.group_queries_state\":\"群組查詢：{state}\",\"status.incomplete\":\"設定不完整：{reason}\",\"status.issue_count\":\"設定問題：{count} 項\",\"status.next_step\":\"下一步\",\"status.no_accounts\":\"尚未設定帳戶。\",\"status.not_queryable\":\"無法查詢：{reason}\",\"status.off\":\"已關閉\",\"status.permissions\":\"指令權限\",\"status.permissions_state\":\"指令權限：{state}\",\"status.provider\":\"供應商：{provider}\",\"status.queryable\":\"已設定，可查詢\",\"status.reason.grsai_account_path_mismatch\":\"請使用 Grsai 帳戶點數介面\",\"status.reason.grsai_balance_scope_mismatch\":\"請依 Grsai 介面選擇對應餘額範圍\",\"status.reason.grsai_method_must_post\":\"Grsai 點數介面使用 POST\",\"status.reason.invalid_api_path\":\"介面路徑無效。請填寫以 / 開頭且不含參數的相對路徑\",\"status.reason.invalid_balance_kind\":\"Grsai 點數類別應設定為 credits\",\"status.reason.invalid_balance_scope\":\"請檢查餘額查詢範圍\",\"status.reason.invalid_base_url\":\"服務位址無效。請填寫不含路徑、參數或憑證的 HTTPS 服務根位址\",\"status.reason.invalid_endpoint\":\"服務位址或介面路徑無效。請填寫 HTTPS 服務根位址及以 / 開頭的介面路徑\",\"status.reason.invalid_grsai_region\":\"請選擇有效的 Grsai 節點\",\"status.reason.invalid_response_mapping\":\"請依供應商回應文件在進階設定中填寫餘額對應\",\"status.reason.invalid_service_profile\":\"請檢查服務類型\",\"status.reason.missing_api_path\":\"請填寫以 / 開頭的介面路徑\",\"status.reason.missing_base_url\":\"請填寫 HTTPS 服務根位址\",\"status.reason.missing_credentials\":\"缺少可用憑證\",\"status.reason.missing_endpoint\":\"請依供應商文件填寫服務位址及介面路徑\",\"status.reason.missing_environment_variable\":\"未設定憑證環境變數\",\"status.reason.missing_grsai_token\":\"請設定 Grsai 帳戶請求權杖\",\"status.saved_credentials\":\"憑證儲存\",\"status.session_permissions\":\"依會話授權\",\"status.source\":\"資料來源：本機設定與憑證儲存記錄。可用 /yql 查詢連線及餘額。\",\"status.title\":\"如月怜的額度連結狀態\",\"status.unknown_reason\":\"設定不完整或暫時無法查詢\",\"storage.migration_pending\":\"舊設定待移轉\",\"storage.ready\":\"安全儲存已就緒\",\"storage.unavailable\":\"安全儲存待檢查\",\"storage.unknown\":\"憑證儲存狀態待確認\",\"web.account.add\":\"新增帳戶\",\"web.account.add_query\":\"新增查詢帳戶\",\"web.account.advanced\":\"進階介面與回應對應\",\"web.account.aliases_hint\":\"指令與自然語言使用這些別名。每行一項，避免與其他帳戶重名。\",\"web.account.count\":\"{count} 個帳戶\",\"web.account.credentials_configured\":\"憑證已設定\",\"web.account.credentials_pending\":\"待設定憑證\",\"web.account.disabled\":\"已停用\",\"web.account.editor_subtitle\":\"管理查詢參數與來源憑證。\",\"web.account.empty\":\"還沒有查詢帳戶\",\"web.account.empty_hint\":\"選擇供應商新增帳戶，再單獨設定加密憑證。\",\"web.account.enabled\":\"已啟用\",\"web.account.id_hint\":\"請使用穩定且唯一的 ID。儲存後無法變更。\",\"web.account.id_locked\":\"為避免憑證綁錯帳戶，既有帳戶 ID 無法變更。\",\"web.account.list\":\"查詢帳戶\",\"web.account.list_subtitle\":\"管理 AI 服務的餘額、用量與額度查詢帳戶。\",\"web.account.mapping\":\"餘額回應對應\",\"web.account.mapping_hint\":\"使用 JSON Pointer，例如 /data/remaining。靜態請求本文和對應中不允許放入憑證。\",\"web.account.new\":\"新增帳戶\",\"web.account.profile_action\":\"更換並清空門檻\",\"web.account.profile_body\":\"將清空門檻並關閉警示，單位會重新辨識。\",\"web.account.profile_title\":\"更換服務類型並重設警示？\",\"web.account.protocol\":\"請求協定\",\"web.account.provider\":\"供應商\",\"web.account.provider_scope\":\"各供應商使用自己的餘額查詢協定和憑證，與模型聊天設定分開管理。\",\"web.account.provider_settings\":\"供應商設定\",\"web.account.remove\":\"移除帳戶\",\"web.account.remove_action\":\"從草稿移除\",\"web.account.remove_body\":\"將從草稿移除此帳戶。儲存設定後才會生效，並移除其已儲存憑證；其他帳戶不受影響。\",\"web.account.remove_hint\":\"移除操作在儲存設定後生效。\",\"web.account.remove_title\":\"移除帳戶「{account}」？\",\"web.account.settings\":\"帳戶設定\",\"web.alert.admin_list\":\"警示管理 QQ 允許名單\",\"web.alert.admin_list_hint\":\"每行一個 OneBot QQ 號，或 qq_official:UID。官方 UID 從 /sid 取得，不填 UMO；名單成員或 AstrBot 管理員可管理預警。\",\"web.alert.admin_list_placeholder\":\"QQ 號或 qq_official:UID\",\"web.alert.enable_account\":\"啟用此帳戶的警示\",\"web.alert.hints_title\":\"警示提示\",\"web.alert.interval\":\"檢查間隔（分鐘）\",\"web.alert.interval_days\":\"{count} 天\",\"web.alert.interval_hint\":\"1–4320 分鐘，預設 15。\",\"web.alert.interval_minutes\":\"{count} 分鐘\",\"web.alert.interval_set\":\"設為 {count} 分鐘\",\"web.alert.interval_slider\":\"檢查間隔滑桿（分鐘）\",\"web.alert.metric\":\"警示指標\",\"web.alert.metric_hint\":\"選擇需要監測的餘額。\",\"web.alert.minutes\":\"分鐘\",\"web.alert.permissions\":\"警示管理權限\",\"web.alert.query_only\":\"此預設僅支援手動查詢額度。\",\"web.alert.quick_group\":\"檢查間隔快速設定\",\"web.alert.quick_label\":\"快速設定：\",\"web.alert.recovery\":\"恢復門檻（可選）\",\"web.alert.recovery_hint\":\"留空時會自動設定。指定數值時，須高於觸發門檻。\",\"web.alert.recovery_placeholder\":\"留空自動設定\",\"web.alert.repeat\":\"持續低額時的重複提醒間隔（分鐘）\",\"web.alert.repeat_hint\":\"設為 0 可停用重複通知，上限為 4320 分鐘。\",\"web.alert.smart_hint\":\"AI 提醒\",\"web.alert.smart_hint_help\":\"依目標會話的人格產生完整提醒，數值由程式填入。\",\"web.alert.targets\":\"目標 UMO（每行一個）\",\"web.alert.targets_hint\":\"每行一個 UMO。OneBot 群組可加上 @QQ 號碼。官方 QQ 請使用 OpenID，群組行末填寫 scene=qq_group，個人私訊行末填寫 scene=qq_c2c。請勿填寫頻道或頻道私訊的 UMO。\",\"web.alert.targets_title\":\"額度警示推播目標\",\"web.alert.threshold\":\"觸發門檻\",\"web.alert.threshold_hint\":\"餘額低於或等於此值時提醒。\",\"web.alert.threshold_placeholder\":\"填寫觸發門檻\",\"web.alert.title\":\"額度警示\",\"web.common.cancel\":\"取消\",\"web.common.choose\":\"請選擇\",\"web.common.off\":\"已關閉\",\"web.common.on\":\"已開啟\",\"web.common.one_per_line\":\"每行一項\",\"web.common.time_unavailable\":\"時間不可用\",\"web.credential.balance_key\":\"餘額查詢 API Key\",\"web.credential.cancel_entry\":\"取消輸入\",\"web.credential.clear\":\"清除憑證\",\"web.credential.clear_body\":\"將移除帳戶「{account}」的此項憑證或引用。帳戶設定保留；之後需重新設定才能查詢。\",\"web.credential.clear_title\":\"清除 {credential}？\",\"web.credential.confirm_clear\":\"確認清除\",\"web.credential.encrypted_status\":\"已設定 · 加密儲存\",\"web.credential.enter_new\":\"輸入新憑證\",\"web.credential.environment_hint\":\"僅輸入環境變數名稱，例如 QUOTA_API_KEY。憑證值由執行環境提供。\",\"web.credential.environment_name\":\"環境變數名稱\",\"web.credential.environment_status\":\"已設定 · 環境變數引用\",\"web.credential.eyebrow\":\"來源存取\",\"web.credential.finish_settings\":\"請先儲存或放棄一般設定修改，再操作憑證。\",\"web.credential.gateway_key\":\"站點模型 API Key\",\"web.credential.glm_plan\":\"GLM Coding Plan API Key\",\"web.credential.grsai_token\":\"Grsai 請求權杖\",\"web.credential.legacy_field\":\"舊版憑證（{field}）\",\"web.credential.minimax_plan\":\"MiniMax Token Plan 金鑰\",\"web.credential.missing\":\"未設定\",\"web.credential.new_source\":\"新憑證來源\",\"web.credential.new_value\":\"新憑證\",\"web.credential.new_value_hint\":\"留空會保留現有憑證。送出後會立即清除輸入內容。\",\"web.credential.openrouter_management\":\"OpenRouter 管理金鑰\",\"web.credential.optional_sts\":\"STS Security Token（可選）\",\"web.credential.replace\":\"更換憑證\",\"web.credential.save_account\":\"請先儲存新帳戶，再設定憑證。\",\"web.credential.save_new\":\"儲存新憑證\",\"web.credential.saved_hint\":\"憑證已儲存，將在餘額查詢時驗證有效性。\",\"web.credential.separate\":\"憑證單獨儲存。\",\"web.credential.status_unread\":\"狀態未讀取\",\"web.credential.title\":\"查詢憑證\",\"web.credential.use_environment\":\"引用環境變數\",\"web.credential.venice_admin\":\"Venice 管理員 API Key\",\"web.credential.vercel_gateway\":\"Vercel AI Gateway API Key\",\"web.credential.xai_management\":\"xAI 管理金鑰\",\"web.detail.fixed_hint\":\"已改用一般提醒。\",\"web.detail.legacy_target_unknown\":\"舊目標有一筆無法配對的傳送紀錄，結果未知。餘額恢復後，下一次進入低餘額時才會向官方 QQ 目標傳送。\",\"web.detail.mention_invalid\":\"QQ 提及格式無效，請核對群組會話與 @QQ 號碼。\",\"web.detail.mention_unsupported\":\"目標不支援 QQ 提及，請移除尾端的 @ 指定或改用支援的 QQ 群組。\",\"web.detail.message_components_unavailable\":\"訊息元件無法建立，請檢查宿主元件與記錄。\",\"web.detail.platform_not_found\":\"未找到目標平台執行個體，請核對 UMO 的平台執行個體 ID。\",\"web.detail.platform_unavailable\":\"目標平台執行個體暫不可用，請檢查連線狀態與宿主記錄。\",\"web.detail.platform_unsupported\":\"目標平台不支援此主動傳送方式，請改用支援的推播目標。\",\"web.detail.session_check_failed\":\"無法核對目標會話狀態，請檢查 AstrBot 會話設定與記錄。\",\"web.detail.session_disabled\":\"目標會話已停用，請在 AstrBot 中啟用會話。\",\"web.detail.target_invalid\":\"推播目標格式無效，請在全域設定中核對 UMO。\",\"web.detail.target_scene_required\":\"官方 QQ 目標缺少對話類型。請在全域設定補填，或在目標對話使用 /yql alert targets addhere。\",\"web.detail.transport_unavailable\":\"宿主主動傳送介面不可用，請檢查 AstrBot 版本與記錄。\",\"web.detail.unknown\":\"暫無明確阻止原因，請核對全域推播目標、平台連線與宿主警示記錄。\",\"web.field.advanced_options\":\"顯示進階設定\",\"web.field.aliases\":\"查詢別名\",\"web.field.amount_path\":\"主餘額路徑\",\"web.field.auth_mode\":\"認證方式\",\"web.field.auth_name\":\"認證參數名稱\",\"web.field.balance_scope\":\"點數範圍\",\"web.field.base_url\":\"服務位址\",\"web.field.cache_ttl_seconds\":\"成功結果快取（秒）\",\"web.field.display_name\":\"顯示名稱\",\"web.field.enabled\":\"啟用帳戶\",\"web.field.expires_at_path\":\"到期時間路徑\",\"web.field.expiry_path\":\"舊版到期路徑\",\"web.field.failure_path\":\"業務失敗路徑\",\"web.field.failure_value\":\"業務失敗值\",\"web.field.gateway_origin\":\"站點網址\",\"web.field.id\":\"帳戶 ID\",\"web.field.json_body\":\"靜態 JSON 請求本文\",\"web.field.kind\":\"餘額類別\",\"web.field.kind_path\":\"類別路徑\",\"web.field.method\":\"請求方法\",\"web.field.path\":\"介面路徑\",\"web.field.region\":\"連線區域\",\"web.field.remaining_path\":\"剩餘量路徑\",\"web.field.service_profile\":\"服務類型\",\"web.field.status_path\":\"狀態路徑\",\"web.field.status_values\":\"狀態值對應\",\"web.field.success_path\":\"業務成功路徑\",\"web.field.success_value\":\"業務成功值\",\"web.field.team_id\":\"團隊 ID\",\"web.field.timeout_seconds\":\"帳戶逾時（秒）\",\"web.field.total_path\":\"總量路徑\",\"web.field.unit\":\"固定單位\",\"web.field.unit_path\":\"單位路徑\",\"web.field.url\":\"舊版完整 URL\",\"web.field.used_path\":\"已使用量路徑\",\"web.global.allow_group_queries\":\"允許群組查詢\",\"web.global.command_admin_only\":\"餘額查詢指令僅管理員\",\"web.global.group_allowed_user_ids\":\"群組查詢使用者允許名單\",\"web.global.max_concurrency\":\"查詢並行數上限\",\"web.global.private_allowed_user_ids\":\"私訊允許名單\",\"web.global.timeout_seconds\":\"單一帳戶逾時（秒）\",\"web.global.total_timeout_seconds\":\"整次查詢逾時（秒）\",\"web.hint.advanced_options\":\"通用服務設定認證、方法與回應對應；Grsai 帳戶點數使用固定協定並忽略舊對應。\",\"web.hint.amount_path\":\"必需的 JSON Pointer，例如 /data/remaining。\",\"web.hint.auth_mode\":\"按餘額文件確認；Grsai 帳戶點數忽略此欄位，token 固定放入 JSON 請求本文。\",\"web.hint.auth_name\":\"僅認證方式為「請求標頭」或「查詢參數」時使用。\",\"web.hint.balance_scope\":\"帳戶點數已支援；API Key 點數暫不可查詢。\",\"web.hint.base_url\":\"不含 API 路徑的 HTTPS 根網址。https://api.example.invalid 僅供格式參考，無法存取。\",\"web.hint.expiry_path\":\"用於相容舊版 expires_at_path。\",\"web.hint.gateway_origin\":\"請填寫站點的 HTTPS 根網址。查詢憑證只會傳送到該站點。\",\"web.hint.json_body\":\"僅供通用服務使用，不支援範本或憑證。Grsai 帳戶點數留空；舊項目切換時清除舊請求本文。\",\"web.hint.kind_path\":\"可選 JSON Pointer；僅接受 cash/quota/free_quota/subscription/credits/usage/custom。\",\"web.hint.legacy_base_url\":\"HTTPS 服務根網址，可與介面路徑配合。\",\"web.hint.legacy_json_body\":\"僅用於有文件依據的唯讀 POST。不支援範本或憑證。\",\"web.hint.legacy_method\":\"允許 GET，或已確認無副作用的 POST。\",\"web.hint.meinianda_cache\":\"網站建議每分鐘查詢一次。預設快取時間為 60 秒。\",\"web.hint.method\":\"通用服務按文件填寫。Grsai 帳戶點數固定 POST；舊項目切換時清除原 GET。\",\"web.hint.path\":\"通用服務按文件填寫。Grsai 帳戶點數留空或填 /client/openapi/getCredits；舊項目切換時清除原路徑。/account/balance 僅為占位範例。\",\"web.hint.private_allowlist\":\"輸入完整的「平台名稱:使用者 ID」，例如 aiocqhttp:123456。管理員無須加入。上方的管理員開關也適用於 /yql 餘額查詢。\",\"web.hint.region\":\"中國與海外區域皆使用內建官方節點，無須自行填寫伺服器位址。\",\"web.hint.service_profile\":\"餘額查詢使用服務供應商專屬介面。新 Grsai 帳戶請直接新增 Grsai 範本；本範本舊項目可切換帳戶點數預設。\",\"web.hint.status_values\":\"將供應商狀態值對應到 available/unavailable/partial/unknown。\",\"web.hint.unit\":\"可用 CNY/USD/JPY/credit/credits/tokens/requests/custom；設定 unit_path 時必填。\",\"web.hint.unit_path\":\"可選 JSON Pointer；執行時值必須與固定 unit 一致。\",\"web.hint.url\":\"完整 HTTPS 地址，不含 query、憑證或 fragment。\",\"web.language.auto\":\"跟隨 AstrBot\",\"web.language.en-US\":\"English\",\"web.language.ja-JP\":\"日本語\",\"web.language.zh-CN\":\"简体中文\",\"web.language.zh-TW\":\"繁體中文\",\"web.metric.AvailableAmount\":\"可用額度\",\"web.metric.AvailableCashAmount\":\"現金餘額\",\"web.metric.CreditAmount\":\"信用額度\",\"web.metric.credit\":\"點數\",\"web.metric.granted_balance\":\"贈送餘額\",\"web.metric.mapped_balance\":\"已設定對應餘額\",\"web.metric.monitored\":\"監測餘額\",\"web.metric.site_credit\":\"站內額度\",\"web.metric.topped_up_balance\":\"儲值餘額\",\"web.metric.total_balance\":\"總餘額\",\"web.migration.accounts\":\"帳戶\",\"web.migration.cleanup_hint\":\"舊版宿主設定只會在遷移成功後清除。如果來源設定有變更，請重新預覽後再執行。\",\"web.migration.cleanup_pending\":\"遷移已儲存，但宿主舊欄位尚未清理完成。請重新預覽後重試清理。\",\"web.migration.confirm\":\"確認遷移舊設定\",\"web.migration.confirm_body\":\"將遷移預覽中的 {count} 個帳戶；明文憑證加密後儲存，並清理舊版外掛欄位。不會顯示或傳送憑證到其他服務。\",\"web.migration.confirm_title\":\"遷移舊設定？\",\"web.migration.conflict\":\"發現與目前加密儲存不同的舊設定。不會自動覆蓋現有儲存，也不會清理這份新出現的舊設定。請人工核對來源。\",\"web.migration.environment\":\"環境變數引用\",\"web.migration.execute\":\"執行遷移\",\"web.migration.lock_warning\":\"有舊版設定等待遷移。一般設定與憑證操作暫時鎖定。\",\"web.migration.no_pending\":\"沒有待遷移的舊版設定。\",\"web.migration.open\":\"前往遷移\",\"web.migration.overview\":\"將舊版外掛設定中的一般設定、憑證和環境變數引用遷移到獨立管理儲存。憑證加密儲存，不會在頁面顯示。\",\"web.migration.pending\":\"偵測到舊版設定，遷移完成前不能儲存新設定。\",\"web.migration.plaintext\":\"需要加密的憑證\",\"web.migration.preview\":\"讀取遷移預覽\",\"web.migration.retry_cleanup\":\"重試清除舊欄位\",\"web.migration.scope\":\"本次遷移範圍\",\"web.migration.title\":\"舊設定遷移\",\"web.navigation.accounts\":\"帳戶管理\",\"web.navigation.back_to_accounts\":\"返回帳戶\",\"web.navigation.global\":\"全域設定\",\"web.navigation.leave_action\":\"放棄草稿並離開\",\"web.navigation.leave_body\":\"未儲存的設定和憑證輸入將清空。已發出的請求無法撤回，結果不明時需重新讀取，不會自動重試。\",\"web.navigation.leave_title\":\"離開目前設定？\",\"web.navigation.maintenance\":\"設定維護\",\"web.navigation.mobile\":\"行動版導覽\",\"web.navigation.primary\":\"主導覽\",\"web.navigation.reload\":\"重新讀取狀態\",\"web.navigation.reload_action\":\"丟棄草稿並讀取\",\"web.navigation.reload_body\":\"這會清空目前未儲存的設定和憑證輸入。\",\"web.navigation.reload_title\":\"重新讀取設定？\",\"web.navigation.skip\":\"跳到主要內容\",\"web.notice.alert_loading\":\"正在讀取警示執行狀態…\",\"web.notice.alert_read_failed\":\"無法確認警示執行狀態，請稍後重試。\",\"web.notice.authorization_lost\":\"管理授權已失效。所有草稿已清空，請從 AstrBot 外掛管理重新開啟。\",\"web.notice.authorization_reopen\":\"管理授權已失效，請重新開啟。\",\"web.notice.config_changed\":\"設定已變更，請重新讀取。\",\"web.notice.connecting\":\"正在連線至宿主管理工作階段…\",\"web.notice.discarded\":\"未儲存的草稿已丟棄。\",\"web.notice.invalid_context\":\"宿主的管理工作階段資訊無效。請從 AstrBot 的外掛管理開啟此頁面。\",\"web.notice.invalid_environment\":\"請輸入有效的環境變數名稱。變數的值由執行環境提供。\",\"web.notice.left_during_write\":\"已離開原設定。已發出的請求無法撤回，請重新讀取確認結果。\",\"web.notice.legacy_cleanup_incomplete\":\"設定已遷移，但宿主舊欄位清理尚未完成，請在設定維護中重新預覽並完成清理。\",\"web.notice.legacy_cleanup_retry\":\"遷移已儲存，可重試清理原來的宿主舊欄位。\",\"web.notice.legacy_conflict\":\"舊設定與目前儲存不一致。不會覆蓋現有儲存或清理新的舊設定。\",\"web.notice.legacy_not_pending\":\"沒有待遷移的舊設定。\",\"web.notice.legacy_preview_ready\":\"遷移預覽已就緒。執行前請核對下方範圍。\",\"web.notice.loaded\":\"已讀取最新設定。\",\"web.notice.missing_credential\":\"請輸入新憑證；留空不會執行清除。\",\"web.notice.open_in_host\":\"請從 AstrBot 外掛管理頁面開啟此頁。\",\"web.notice.read_failed\":\"無法確認設定狀態。請重新讀取，或從宿主重新開啟。\",\"web.notice.reading\":\"正在讀取最新狀態…\",\"web.notice.revision_conflict\":\"設定已被其他頁面修改。請重新讀取，再核對並送出；不會自動重試。\",\"web.notice.saved\":\"已儲存，目前狀態已重新核對。\",\"web.notice.saving\":\"正在送出，請勿重複操作…\",\"web.notice.session_unavailable\":\"宿主管理工作階段無法使用，請重新開啟此頁面。\",\"web.notice.unit_candidate_changed\":\"候選已變更或過期，請重新查詢後確認。\",\"web.notice.unit_candidates\":\"已取得最新候選，請核對後確認。\",\"web.notice.unit_confirm_uncertain\":\"確認結果未知，請重新整理單位後再操作。\",\"web.notice.unit_confirmed\":\"單位已確認。\",\"web.notice.unit_current\":\"已讀取最新單位狀態，已確認的單位仍有效。\",\"web.notice.unit_no_candidates\":\"暫未取得可確認候選，請檢查憑證、介面設定或查詢重試等待狀態後再查詢。\",\"web.notice.unit_querying\":\"正在查詢餘額以取得最新單位…\",\"web.notice.unit_read_failed\":\"單位取得失敗，請重新整理。\",\"web.notice.unit_unverified_candidates\":\"未取得可信的新候選。請檢查憑證、介面與查詢狀態後重新查詢。\",\"web.notice.validation_failed\":\"送出未透過驗證。請檢查欄位和憑證類型；敏感輸入已清空。\",\"web.notice.write_uncertain\":\"送出結果尚未確認，敏感輸入已清空。請重新讀取狀態後再決定，切勿直接重複送出。\",\"web.option.auth.bearer\":\"Bearer 權杖\",\"web.option.auth.header\":\"請求標頭\",\"web.option.auth.query\":\"查詢參數\",\"web.option.profile.generic\":\"OpenAI 相容服務 / 第三方服務\",\"web.option.region.cn\":\"國內直連\",\"web.option.region.overseas\":\"海外節點\",\"web.option.scope.account\":\"帳戶點數（已支援預設）\",\"web.option.scope.api_key\":\"API Key 點數（暫不可查詢）\",\"web.option.scope.none\":\"請選擇點數範圍\",\"web.provider.alibaba_help\":\"阿里雲 BSS：現金餘額、可用額度及信用額度。\",\"web.provider.compatible_help\":\"餘額查詢使用供應商專屬介面，請按其文件設定唯讀餘額介面。\",\"web.provider.compatible_name\":\"其他相容服務\",\"web.provider.deepseek_help\":\"DeepSeek 官方帳戶餘額，查詢地址與解析規則已內建。\",\"web.provider.glm_plan_help\":\"使用所選地區的 GLM Coding Plan 金鑰，分開查詢各統計週期的用量比例。\",\"web.provider.grsai_help\":\"Grsai 帳戶點數使用請求權杖，固定呼叫 POST /client/openapi/getCredits，無須提供模型 API Key。\",\"web.provider.legacy_name\":\"舊版通用帳戶\",\"web.provider.meinianda_help\":\"查詢 Meinianda 帳戶的站內額度。建議將快取時間設為至少 60 秒。\",\"web.provider.minimax_plan_help\":\"使用所選地區的 Token Plan 金鑰，查詢各模型群組的週期與每週額度。\",\"web.provider.moonshot_help\":\"查詢所選地區的 Moonshot 帳戶，分別顯示可用餘額、現金與贈金。\",\"web.provider.new_api_help\":\"查詢 New API 模型權杖及其獲准讀取的帳戶額度。結果保留站點原始額度點數。\",\"web.provider.novita_help\":\"查詢 Novita AI 的可用餘額、現金餘額、信用額度與未結清帳單。\",\"web.provider.openrouter_help\":\"使用管理金鑰查詢 OpenRouter 帳戶點數，以累計購買點數扣除已用點數計算。\",\"web.provider.pollinations_help\":\"使用具備 account:usage 權限的金鑰查詢帳戶 Pollen。凍結額度會分開顯示。\",\"web.provider.stepfun_help\":\"查詢所選地區的 StepFun 帳戶。累計儲值與累計贈金會分開顯示。\",\"web.provider.sub2api_help\":\"使用 Sub2API 模型金鑰查詢站點錢包或明確回傳的金鑰額度。\",\"web.provider.venice_help\":\"使用管理員 API Key 查詢 Venice。美元餘額、DIEM 與各類點數會分開顯示。\",\"web.provider.vercel_gateway_help\":\"使用 AI Gateway 專用金鑰查詢團隊的美元餘額與累計用量。\",\"web.provider.xai_help\":\"使用團隊的管理金鑰查詢 xAI 已入帳的預付餘額。\",\"web.runtime.last_checked\":\"最近檢查：\",\"web.runtime.last_sent\":\"最近一次傳送嘗試：\",\"web.runtime.loading\":\"讀取中…\",\"web.runtime.no_account_record\":\"此帳戶尚無執行記錄。\",\"web.runtime.refresh\":\"重新整理警示狀態\",\"web.runtime.running\":\"檢查工作執行中，只會檢查已完成設定並啟用警示的帳戶。\",\"web.runtime.stopped\":\"檢查工作未執行。\",\"web.runtime.storage_unavailable\":\"警示狀態儲存不可用，警示未執行。\",\"web.runtime.title\":\"執行狀態\",\"web.runtime.unknown_status\":\"狀態已更新，請透過警示指令查看詳細資訊。\",\"web.settings.access_eyebrow\":\"查詢權限\",\"web.settings.access_title\":\"查詢權限\",\"web.settings.account_alerts\":\"各帳戶可單獨開啟警示。\",\"web.settings.admin_access\":\"此頁面僅供 AstrBot 管理員設定。查詢權限無法用於存取管理頁面。\",\"web.settings.admin_allowlist\":\"管理員不需要加入私訊允許名單。\",\"web.settings.appearance\":\"語言設定\",\"web.settings.applies_after_save\":\"儲存後生效。\",\"web.settings.command_access\":\"管理員開關只限制 /yql 餘額查詢。警示指令適用獨立的權限規則。\",\"web.settings.discard\":\"放棄修改\",\"web.settings.group_access\":\"群組查詢須先開啟群組查詢功能，並符合使用者允許名單的規則。\",\"web.settings.language\":\"外掛語言\",\"web.settings.language_hint\":\"儲存後生效。自動模式採用 AstrBot 提供的語言。沒有可用語言時（例如定時警示）會使用簡體中文。\",\"web.settings.private_format\":\"私訊允許名單使用完整的「平台名稱:使用者 ID」。\",\"web.settings.query_access\":\"查詢權限\",\"web.settings.query_and_cache\":\"查詢與快取\",\"web.settings.save\":\"儲存設定\",\"web.settings.save_first\":\"請先儲存設定。\",\"web.settings.separate_credentials\":\"一般設定與憑證分別儲存\",\"web.settings.unsaved\":\"有未儲存的變更\",\"web.shell.auth_required\":\"需要宿主管理授權\",\"web.shell.brand_author\":\"如月憐的\",\"web.shell.brand_name\":\"額度連結\",\"web.shell.eyebrow\":\"YOMIHIME QUOTA LINK / 管理\",\"web.shell.loading_config\":\"正在讀取設定\",\"web.shell.open_from_host\":\"請先登入 AstrBot，再從外掛詳細資訊頁面開啟「額度查詢」。\",\"web.shell.page_title\":\"額度查詢\",\"web.shell.project_name\":\"如月憐的額度連結\",\"web.shell.revision\":\"設定版本 {revision}\",\"web.shell.scope\":\"統一查詢 · 獨立憑證\",\"web.shell.waiting\":\"等待管理工作階段\",\"web.status.accepted\":\"傳送請求已受理（不代表送達）\",\"web.status.auth_paused\":\"憑證被拒絕，檢查已暫停\",\"web.status.blocked\":\"警示傳送已暫停，請檢查下方原因\",\"web.status.disabled\":\"警示已關閉\",\"web.status.error\":\"檢查失敗，保留上次警示狀態\",\"web.status.failed\":\"傳送失敗\",\"web.status.incomplete\":\"設定不完整，未啟動\",\"web.status.low\":\"低於或等於門檻，目前警示持續中\",\"web.status.monitoring\":\"餘額監測中\",\"web.status.normal\":\"餘額在門檻以上\",\"web.status.paused\":\"身分或權限驗證失敗。修正設定或手動重試後會恢復檢查。\",\"web.status.pending\":\"等待檢查\",\"web.status.pending_send\":\"等待合並提醒\",\"web.status.recovered\":\"餘額已恢復\",\"web.status.recovering\":\"額度已回升，尚未達到恢復門檻\",\"web.status.stale\":\"結果過期或指標、單位不匹配，不用於警示判斷\",\"web.status.storage_unavailable\":\"警示狀態儲存不可用，警示未執行\",\"web.status.submitted\":\"已送出平台；不代表最終送達\",\"web.status.unit_changed\":\"監測指標或單位已變更，請確認\",\"web.status.unit_unidentified\":\"等待辨識單位\",\"web.status.units_ambiguous\":\"多個單位待確認\",\"web.status.unknown\":\"傳送結果不明，請先核對再重試。\",\"web.status.waiting\":\"等待下次檢查\",\"web.status.waiting_budget\":\"正在等待同一推播目標的傳送間隔（至少 300 秒／5 分鐘），後續檢查有效時將重試。\",\"web.storage.eyebrow\":\"本機加密\",\"web.storage.key_handling\":\"主金鑰由執行環境管理，不在此頁面輸入、匯出或恢復。\",\"web.storage.ready\":\"加密儲存就緒\",\"web.storage.title\":\"儲存安全\",\"web.storage.troubleshooting\":\"遇到儲存故障請檢查宿主記錄中的安全錯誤代碼。不要在公開記錄或螢幕擷取畫面中貼上金鑰。\",\"web.storage.unavailable\":\"加密儲存不可用\",\"web.storage.unavailable_warning\":\"加密儲存不可用。新的明文憑證不能儲存，請先檢查執行環境；不會改用明文儲存。\",\"web.unit.ambiguous\":\"發現多個單位，請選擇。\",\"web.unit.awaiting\":\"待取得\",\"web.unit.candidates_stale\":\"查詢候選已過期，請重新查詢。已確認的單位記錄仍保留。\",\"web.unit.changed\":\"查詢單位已變更，請重新確認。\",\"web.unit.choices_expired\":\"可確認候選已過期，重新查詢後再選擇。\",\"web.unit.choose\":\"選擇單位\",\"web.unit.confirm\":\"確認單位\",\"web.unit.confirm_no_threshold\":\"改用 {unit}？門檻尚未設定。\",\"web.unit.confirm_observed\":\"請確認查詢到的單位。\",\"web.unit.confirm_threshold\":\"改用 {unit}，按門檻 {threshold} 比較？\",\"web.unit.confirm_title\":\"確認單位 {unit}？\",\"web.unit.current\":\"單位：{unit}\",\"web.unit.detect_on_account_save\":\"儲存帳戶後自動辨識。\",\"web.unit.detect_on_query\":\"查詢餘額後自動辨識。\",\"web.unit.detect_on_save\":\"儲存設定後重新辨識。\",\"web.unit.finish_credential_before_query\":\"完成或取消憑證輸入後可重新查詢。\",\"web.unit.loading\":\"處理中…\",\"web.unit.metric_changed\":\"監測指標已從「{previous}」變更為「{current}」。請重新確認單位及門檻。\",\"web.unit.metric_edited\":\"監測指標已改為「{metric}」。儲存後請重新查詢並確認單位。\",\"web.unit.metric_or_unit_changed\":\"監測指標或單位已變更，請重新確認。\",\"web.unit.no_choices\":\"目前沒有可確認候選，重新查詢後再選擇。\",\"web.unit.query\":\"重新查詢單位\",\"web.unit.query_changed\":\"查詢帳戶或介面已變更，請重新確認單位和門檻。\",\"web.unit.query_edited\":\"查詢設定已修改，儲存後重新辨識單位。\",\"web.unit.query_hint\":\"查詢此帳戶的餘額介面以取得新候選單位，這項操作不會傳送警示。\",\"web.unit.read\":\"讀取單位狀態\",\"web.unit.recorded\":\"單位記錄：\",\"web.unit.save_before_query\":\"儲存設定後可重新查詢單位。\",\"web.unit.title\":\"警示單位\",\"web.unit.verified\":\"單位已驗證。\",\"web.unit.verified_expired\":\"單位已驗證。查詢候選已過期，已確認的單位仍有效。\",\"web.validation.account_alert\":\"{account}：{message}\",\"web.validation.account_bounds\":\"帳戶逾時上限為 120 秒，快取時間上限為 86400 秒。\",\"web.validation.account_id\":\"帳戶 ID 不能為空或重複。\",\"web.validation.account_name\":\"請填寫帳戶顯示名稱。\",\"web.validation.account_positive\":\"帳戶逾時和快取時間都必須為正數。\",\"web.validation.alert_fields\":\"警示設定欄位無效。\",\"web.validation.alert_prerequisites\":\"啟用警示前，請啟用帳戶並填寫門檻和至少一個全域推播目標。\",\"web.validation.decimal_length\":\"門檻最多 30 位整數、18 位小數，不支援指數形式。\",\"web.validation.duplicate_umo\":\"UMO 重複，請合並為一行。\",\"web.validation.finite_decimal\":\"請輸入不含指數記法的有限十進位字串。\",\"web.validation.global_bounds\":\"全域參數超出允許範圍。\",\"web.validation.group_mentions\":\"只有數字 ID 的 QQ 群組會話支援 @QQ 號碼。請從私訊或其他會話移除尾端的 @ 指定。\",\"web.validation.id_limit\":\"QQ 號碼最多 {limit} 項。\",\"web.validation.interval_input\":\"請輸入 1 至 4320 分鐘的整數。系統不會自動調整數值。\",\"web.validation.interval_range\":\"檢查間隔須為 1 至 4320 的整數分鐘。\",\"web.validation.invalid_input\":\"請檢查輸入。\",\"web.validation.invisible_chars\":\"不允許控制字元或不可見字元。\",\"web.validation.json_object\":\"請輸入有效的 JSON 物件，不要填寫憑證。\",\"web.validation.language\":\"請選擇受支援的外掛語言。\",\"web.validation.llm_fields\":\"提示模型設定無效。\",\"web.validation.llm_ids\":\"模型與人格 ID 須為不超過 128 字的文字。\",\"web.validation.llm_switch\":\"提示模型開關無效。\",\"web.validation.mentions_suffix\":\"UMO 後請填寫以空格分隔的 @QQ 號碼，或為官方 QQ 指定 scene=qq_group 或 scene=qq_c2c。\",\"web.validation.metric\":\"請選擇該供應商支援的警示指標。\",\"web.validation.private_allowlist\":\"私訊允許名單須使用「平台名稱:使用者 ID」。\",\"web.validation.qq_id\":\"QQ 號碼須為 1 至 20 位 ASCII 正整數字串；不支援 @all、暱稱或 CQ 碼。\",\"web.validation.query_parameters\":\"請填寫有效的查詢參數。\",\"web.validation.recovery_order\":\"恢復門檻須嚴格大於觸發門檻。\",\"web.validation.repeat_input\":\"請輸入 0 至 4320 的整數分鐘。\",\"web.validation.repeat_range\":\"重複提醒須為 0 至 4320 的整數分鐘；0 表示不重複。\",\"web.validation.target_fields\":\"每個目標須包含 UMO 與提及清單。\",\"web.validation.target_limit\":\"推播目標最多 20 個。\",\"web.validation.target_line\":\"第 {line} 行：{message}\",\"web.validation.targets_text\":\"請輸入推播目標。\",\"web.validation.umo_format\":\"請輸入完整 UMO，格式為「平台執行個體:訊息類型:會話 ID」。\",\"web.validation.umo_invisible\":\"UMO 不允許控制字元或不可見字元。\",\"web.validation.umo_type\":\"訊息類型需為 FriendMessage、GroupMessage 或 OtherMessage。\",\"web.validation.unit\":\"單位須為不超過 32 字的明確文字。\"}"),
	metadata: {
		display_name: "如月憐的額度連結",
		short_desc: "多平台 AI API 餘額與用量監控",
		desc: "查詢 AI API 的餘額、用量與額度，集中管理帳戶並設定額度警示。"
	},
	config: { enable_admin_page: {
		description: "啟用外掛管理頁面",
		hint: "帳戶、憑證、查詢權限與逾時設定都在外掛頁面管理。舊設定僅供確認遷移，不會自動刪除。"
	} }
}, n = {
	views: { "00-quota-link": { title: "クォータ照会" } },
	pages: { "00-quota-link": { title: "クォータ照会" } },
	strings: /* @__PURE__ */ JSON.parse("{\"alert.account_missing\":\"該当するアラートのアカウントが見つかりません。\",\"alert.account_unqueryable\":\"アカウントを照会できません。アカウントが有効かどうかと、照会設定を確認してください。\",\"alert.admins.count\":\"{count} 人の QQ ユーザー · プライベートチャットのみ\",\"alert.admins.host_admin_note\":\"AstrBot の管理者も設定できます。\",\"alert.admins.permissions\":\"管理権限\",\"alert.admins.qq_list\":\"QQ 許可リスト\",\"alert.admins.separate_permissions\":\"クォータ照会と通知の受信権限は個別に設定します。\",\"alert.admins.title\":\"アラート管理用 QQ 許可リスト\",\"alert.command.account_candidate_required\":\"アカウントと候補 ID を指定してください。\",\"alert.command.account_not_unique\":\"アカウントが存在しないか、名前が重複しています。管理画面のアカウント ID を使ってください。\",\"alert.command.account_required\":\"アカウントを指定してください。\",\"alert.command.admin_required\":\"クォータアラートを管理するには QQ 許可リストへの登録、または AstrBot の管理者権限が必要です。\",\"alert.command.extra_arguments\":\"このアラートコマンドに追加の引数は指定できません。\",\"alert.command.help_syntax\":\"使い方：/yql alert help [account|units|targets]。\",\"alert.command.interval_range\":\"間隔は指定範囲内の整数分で入力してください。\",\"alert.command.invalid_arguments\":\"アラートコマンドの引数が無効です。プライベートチャットで /yql alert help を使ってください。\",\"alert.command.invalid_target_arguments\":\"送信先コマンドの引数が無効です。\",\"alert.command.latest_candidate_required\":\"最新の単位候補 ID を選択してください。\",\"alert.command.mention_syntax\":\"メンションは @QQ番号 の形式で入力してください。ニックネーム、@all、CQ コードは使用できません。\",\"alert.command.parameters_required\":\"アカウントと必要な引数を指定してください。\",\"alert.command.private_help\":\"アラートの設定方法は、ボットとのプライベートチャットで /yql alert help を使って確認してください。\",\"alert.command.private_status\":\"詳しいアラートの状態と送信先一覧はプライベートチャットでのみ表示されます。ボットとのプライベートチャットで実行してください。\",\"alert.command.qq_not_allowlisted\":\"その QQ 番号はアラート管理の許可リストにありません。\",\"alert.command.resumed\":\"チェックを再開しました。\",\"alert.command.save_failed\":\"アラート設定を保存できませんでした。プライベートチャットで使い方を確認するか、管理画面で設定を修正してください。\",\"alert.command.saved\":\"アラート設定を保存しました。\",\"alert.command.saved_private\":\"アラート設定を保存しました。詳細はプライベートチャットで確認してください。\",\"alert.command.target_missing\":\"送信先 ID が見つかりません。プライベートチャットで targets list を使ってください。\",\"alert.command.targets_syntax\":\"targets list/add/addhere/remove を使用してください。\",\"alert.command.unsupported_official_scene\":\"この会話は対応する QQ 公式のグループチャットまたは個人チャットではありません。チャンネルやチャンネル内のダイレクトメッセージは追加できません。\",\"alert.command.threshold_syntax\":\"使い方：threshold \\\"アカウント名\\\" 金額 [指標ID]。\",\"alert.command.too_long\":\"アラートコマンドが長すぎます。\",\"alert.command.unclosed_quote\":\"引用符が閉じていません。空白を含むアカウント名は二重引用符で囲んでください。\",\"alert.command.unit_confirmed\":\"単位を確認しました。\",\"alert.command.unknown\":\"不明なアラートコマンドです。使い方は /yql alert help で確認できます。\",\"alert.command.untrusted_session\":\"ホストから信頼できる現在の会話情報を取得できなかったため、送信先を保存できませんでした。\",\"alert.command.value_required\":\"アカウントと数値を指定してください。\",\"alert.delivery.budget\":\"設定が変更されたか、送信枠を一時的に利用できません\",\"alert.delivery.cancelled\":\"設定が変更されたか、アラートが停止されました\",\"alert.delivery.failed\":\"プラットフォームが送信を受理しませんでした。待機時間の経過後に再試行できます\",\"alert.delivery.fixed_hint\":\"会話の AI を利用できないか、生成内容がチェックを通過しなかったため、定型文を使用しました\",\"alert.delivery.llm_changed\":\"会話のモデルかペルソナが変わったため、定型文を使用しました\",\"alert.delivery.llm_config_unavailable\":\"会話の AI 設定を利用できないため、定型文を使用しました\",\"alert.delivery.llm_failed\":\"AI の通知文を生成できないか、チェックを通過しなかったため、定型文を使用しました\",\"alert.delivery.llm_locale_changed\":\"通知の生成中に言語が変わったため、定型文を使用しました\",\"alert.delivery.llm_model_unavailable\":\"会話のモデルを利用できないため、定型文を使用しました\",\"alert.delivery.llm_nonlocal\":\"現在の実行方式ではこのペルソナ通知の生成に対応していないため、定型通知を使用しました\",\"alert.delivery.llm_not_called\":\"送信先の会話が無効か状態を確認できないため、AI を呼び出しませんでした\",\"alert.delivery.llm_off\":\"会話の AI が無効のため、定型文を使用しました\",\"alert.delivery.llm_persona_unavailable\":\"会話のペルソナを利用できないため、定型文を使用しました\",\"alert.delivery.llm_session_unavailable\":\"送信先の会話が無効か状態を確認できないため、AI の通知文を使用しませんでした\",\"alert.delivery.llm_unavailable\":\"会話の AI が無効か状態を確認できないため、定型文を使用しました\",\"alert.delivery.llm_webchat_persona\":\"会話は専用の WebChat ペルソナを使用しているため、定型文を使用しました\",\"alert.delivery.legacy_target_unknown\":\"旧送信先に対応付けられない送信記録があり、結果は不明です。残高が回復した後、次に残高がしきい値以下になったときに QQ 公式の送信先へ通知します\",\"alert.delivery.mention_invalid\":\"グループの送信先またはメンションの QQ 番号の形式が無効です。グループの識別子と数字の QQ 番号を確認してください\",\"alert.delivery.mention_unsupported\":\"送信先のアダプターまたは会話の種類は QQ メンションに対応していません。@ を削除するか、aiocqhttp のグループを選んでください\",\"alert.delivery.message_components_unavailable\":\"メッセージコンポーネントの作成に失敗しました。AstrBot のメッセージコンポーネント API を確認してください\",\"alert.delivery.note_suffix\":\"。{note}\",\"alert.delivery.platform_not_found\":\"送信先のプラットフォームインスタンスが見つかりません。UMO 内のインスタンス ID を確認してください\",\"alert.delivery.platform_unavailable\":\"送信先のプラットフォームインスタンスを利用できません。アダプターの動作を確認してください\",\"alert.delivery.platform_unsupported\":\"送信先プラットフォームはこの自発送信 API に対応していません。対応プラットフォームを選んでください\",\"alert.delivery.session_check_failed\":\"送信先の会話の状態を確認できません。AstrBot の会話状態 API を確認してください\",\"alert.delivery.session_disabled\":\"送信先の会話は無効です。AstrBot でその会話を有効にし、次のチェックを待ってください\",\"alert.delivery.submitted\":\"プラットフォームに送信済みです。配信結果はプラットフォームで確認してください\",\"alert.delivery.target_invalid\":\"送信先 UMO の形式が無効です。会話を選び直すか、完全な識別子を入力してください\",\"alert.delivery.target_scene_required\":\"QQ 公式の送信先にチャット種別がありません。全体設定で指定するか、送信先で /yql alert targets addhere を実行してください\",\"alert.delivery.transport_unavailable\":\"ホストの自発送信 API を利用できません。AstrBot のバージョンとプラットフォームアダプターを確認してください\",\"alert.delivery.unknown\":\"送信結果は不明です。重複を防ぐため、自動で再送しません\",\"alert.fact.line\":\"{name}：{balance}\",\"alert.fact.title\":\"【クォータアラート】\",\"alert.help.account_heading\":\"アカウントアラート\",\"alert.help.account_rules\":\"アカウントのルール\",\"alert.help.account_title\":\"アカウントのアラートルール\",\"alert.help.admin_note\":\"QQ 許可リストの登録者と AstrBot 管理者が設定できます。詳細な状態と一覧はプライベートチャットで確認してください。\",\"alert.help.admins\":\"アラート用 QQ 許可リスト\",\"alert.help.admins_command\":\"/yql alert admins list|add QQ番号|remove QQ番号\",\"alert.help.admins_short\":\"管理者の許可リスト\",\"alert.help.bind\":\"単位を確認\",\"alert.help.bind_command\":\"/yql alert bind \\\"アカウント名\\\" 候補ID\",\"alert.help.common_actions\":\"よく使う操作\",\"alert.help.confirm_note\":\"確認前に単位を確認してください。しきい値の数値は確認後も維持されます。\",\"alert.help.delivery_permissions\":\"通知と権限\",\"alert.help.interval\":\"チェック間隔（分）\",\"alert.help.interval_command\":\"/yql alert interval \\\"アカウント名\\\" 15\",\"alert.help.interval_note\":\"間隔は分単位です。繰り返し間隔を 0 にすると再通知を無効にできます。\",\"alert.help.interval_short\":\"チェック間隔\",\"alert.help.llm\":\"AI による案内\",\"alert.help.manage_note\":\"QQ 許可リストの登録者と AstrBot 管理者が設定できます。\",\"alert.help.more_settings\":\"その他の設定\",\"alert.help.persona_note\":\"AI の通知文は送信先会話のペルソナを使います。\",\"alert.help.prefix\":\"コマンドの先頭：/yql alert\",\"alert.help.private_notice\":\"管理者のみ · 詳細はプライベートチャットで確認\",\"alert.help.recipients_note\":\"受信者とグループメンバーを先に確認してください。保存時に通知は送信されません。\",\"alert.help.recovery\":\"復旧しきい値\",\"alert.help.recovery_command\":\"/yql alert recovery \\\"アカウント名\\\" 12|auto\",\"alert.help.refresh_note\":\"候補の表示は読み取り専用です。refresh は残高を再照会します。\",\"alert.help.repeat\":\"繰り返し間隔（0 で無効）\",\"alert.help.repeat_command\":\"/yql alert repeat \\\"アカウント名\\\" 0\",\"alert.help.repeat_short\":\"繰り返し間隔\",\"alert.help.retry\":\"認証による一時停止を解除\",\"alert.help.retry_command\":\"/yql alert retry \\\"アカウント名\\\"\",\"alert.help.retry_short\":\"チェック再開\",\"alert.help.return\":\"概要に戻る：/yql alert help\",\"alert.help.set_threshold\":\"しきい値を設定\",\"alert.help.status\":\"アラートの状態\",\"alert.help.targets_add\":\"指定した会話を追加\",\"alert.help.targets_add_short\":\"指定した会話\",\"alert.help.targets_heading\":\"送信先と管理権限\",\"alert.help.targets_here\":\"現在の会話を追加\",\"alert.help.targets_here_short\":\"現在の会話\",\"alert.help.targets_list\":\"送信先を表示\",\"alert.help.targets_remove\":\"送信先を削除\",\"alert.help.targets_remove_command\":\"/yql alert targets remove 送信先ID\",\"alert.help.targets_title\":\"通知と管理権限\",\"alert.help.threshold_command\":\"/yql alert threshold \\\"アカウント名\\\" 10 [指標ID]\",\"alert.help.threshold_note\":\"残高が通知しきい値以下になると通知します。単位の確認方法は help units を参照してください。\",\"alert.help.threshold_quick_command\":\"threshold \\\"アカウント名\\\" 10\",\"alert.help.title\":\"クォータアラートの管理\",\"alert.help.toggle\":\"有効化または無効化\",\"alert.help.toggle_command\":\"/yql alert on|off \\\"アカウント名\\\"\",\"alert.help.toggle_quick_command\":\"on|off \\\"アカウント名\\\"\",\"alert.help.toggle_short\":\"有効 / 無効\",\"alert.help.trigger\":\"通知しきい値\",\"alert.help.unit_confirmation\":\"単位の確認\",\"alert.help.unit_note\":\"単位は自動で識別し、現在の単位でしきい値を判定します。AI の通知文は送信先会話のペルソナを使います。\",\"alert.help.units_read\":\"単位候補（読み取り専用）\",\"alert.help.units_read_command\":\"/yql alert units \\\"アカウント名\\\"\",\"alert.help.units_read_short\":\"候補を表示\",\"alert.help.units_refresh\":\"単位候補を更新\",\"alert.help.units_refresh_command\":\"/yql alert units \\\"アカウント名\\\" refresh\",\"alert.help.units_refresh_short\":\"候補を更新\",\"alert.help.units_title\":\"単位の識別と確認\",\"alert.help.view_status\":\"状態を表示\",\"alert.invalid_unit\":\"単位の候補が無効か、アラートの実行状態が更新されました。更新して再試行してください。\",\"alert.metric.available\":\"利用可能額\",\"alert.metric.available_cash\":\"現金残高\",\"alert.metric.credit\":\"クレジット残高\",\"alert.metric.credit_amount\":\"与信枠\",\"alert.metric.granted\":\"付与残高\",\"alert.metric.mapped\":\"マッピング済み残高\",\"alert.metric.site_credit\":\"サイト内クォータ\",\"alert.metric.topped_up\":\"チャージ残高\",\"alert.metric.total\":\"合計残高\",\"alert.metric_changed\":\"監視項目が変わりました。しきい値と単位を確認してください\",\"alert.no_metric_unit\":\"現在の監視項目に有効な単位の候補がありません。照会結果と監視項目を確認してから再試行してください。\",\"alert.no_unit\":\"有効な単位の候補が得られませんでした。照会状態を確認してから再試行してください。\",\"alert.query_identity_changed\":\"アカウントの照会設定が変わりました。しきい値と単位を再確認してください\",\"alert.receipt.result\":\"処理結果\",\"alert.receipt.title\":\"操作完了\",\"alert.runtime_changed\":\"アラートの実行状態が変わりました。更新してから再試行してください。\",\"alert.state.blocked\":\"アラートの設定が不完全か、送信先を利用できません\",\"alert.state.disabled\":\"アラートはオフです\",\"alert.state.error\":\"照会に失敗しました。現在のアラート状態を維持し、残高をゼロとして扱いません\",\"alert.state.failed\":\"プラットフォームが送信を受け付けませんでした。待機後に再試行できます\",\"alert.state.low\":\"残高がしきい値以下です。次の送信可能時刻、または送信先の復旧を待っています\",\"alert.state.monitoring\":\"監視中です。アラートは発生していません\",\"alert.state.paused\":\"認証または権限の確認に失敗しました。設定を修正するか、手動で再試行するとチェックを再開します\",\"alert.state.recovered\":\"回復しきい値に達しました。次に残高が発動しきい値以下になるまで待機します\",\"alert.state.recovering\":\"残高は上昇しましたが、回復しきい値には達していません\",\"alert.state.stale\":\"指標と単位が一致する新しい残高データを取得できませんでした。現在の状態を維持します\",\"alert.state.storage_unavailable\":\"アラート状態を保存できないため、チェックと送信を停止しました\",\"alert.state.submitted\":\"プラットフォームに送信を依頼しました。配信の完了は未確認です\",\"alert.state.unit_changed\":\"監視項目、単位、またはアカウントの照会設定が変わりました。確認してから続行してください\",\"alert.state.unit_unidentified\":\"有効な照会で残高の単位が判明するまで待機します\",\"alert.state.units_ambiguous\":\"複数または重複する単位があります。実際の候補を確認してください\",\"alert.state.unknown\":\"送信結果が不明です。重複を防ぐため自動再送は行いません\",\"alert.state.waiting\":\"次回のチェックを待っています\",\"alert.state.waiting_budget\":\"同じ送信先への送信間隔は最低 300 秒です。次回の有効なチェックを待っています\",\"alert.status.account_count\":\"{count} アカウント · ローカル実行記録\",\"alert.status.account_id\":\"アカウント ID\",\"alert.status.blocked\":\"設定の確認が必要\",\"alert.status.delivery_note\":\"ローカル記録 · 配信結果はプラットフォームの記録を確認してください。\",\"alert.status.empty\":\"表示できるアラートのチェック記録はありません。\",\"alert.status.empty_heading\":\"アカウントの状態なし\",\"alert.status.failed\":\"送信は受理されませんでした\",\"alert.status.last_checked\":\"最終チェック\",\"alert.status.last_sent\":\"プラットフォームへの最終送信\",\"alert.status.low\":\"クォータ低下\",\"alert.status.monitoring\":\"監視中\",\"alert.status.no_record\":\"記録なし\",\"alert.status.paused\":\"チェックを一時停止中\",\"alert.status.recovered\":\"回復済み\",\"alert.status.recovering\":\"クォータ回復中\",\"alert.status.running\":\"チェックタスク稼働中\",\"alert.status.scheduler\":\"{task} · 状態ストレージ：{storage}\",\"alert.status.stale\":\"有効な残高を待機中\",\"alert.status.stopped\":\"チェックタスク停止中\",\"alert.status.storage_unavailable\":\"ストレージ利用不可\",\"alert.status.submitted\":\"プラットフォームに送信済み\",\"alert.status.title\":\"クォータアラートの状態\",\"alert.status.unit_changed\":\"再確認が必要\",\"alert.status.unit_unidentified\":\"単位の識別待ち\",\"alert.status.units_ambiguous\":\"単位の確認待ち\",\"alert.status.unknown\":\"送信結果不明\",\"alert.status.waiting\":\"チェック待ち\",\"alert.status.waiting_budget\":\"送信間隔の経過待ち\",\"alert.targets.add_note\":\"確認済みの送信先を targets add または targets addhere で追加してください。QQ 公式の送信先を手入力する場合は、UMO の後に scene=qq_group（グループチャット）または scene=qq_c2c（個人チャット）を指定してください。\",\"alert.targets.count\":\"{count} 件の送信先 · プライベートチャットのみ\",\"alert.targets.empty\":\"アラートの送信先が未設定\",\"alert.targets.item\":\"送信先 {index} · {key}\",\"alert.targets.mentions\":\"グループ内メンション\",\"alert.targets.remove_command\":\"削除コマンド\",\"alert.targets.save_note\":\"管理者が受信者とグループメンバーを確認してから設定します。保存時はローカルの送信先だけを更新します。\",\"alert.targets.title\":\"アラート通知先\",\"alert.targets.umo\":\"会話 UMO\",\"alert.unit_changed\":\"照会の単位が変わりました。しきい値と単位を再確認してください\",\"alert.unit_expired\":\"候補の有効期限が切れたか一致しなくなりました。残高を照会してから単位の候補を更新してください。\",\"alert.units.ambiguous\":\"複数の単位候補あり\",\"alert.units.auto_detect_note\":\"残高の照会後に自動で識別します。\",\"alert.units.bind_command\":\"確認コマンド：/yql alert bind \\\"アカウント名\\\" 候補ID\",\"alert.units.binding_valid_note\":\"候補の期限が切れても既存の有効な紐付けは維持されます。\",\"alert.units.bound_metric\":\"紐付け済みの指標\",\"alert.units.candidate\":\"候補 {index} · {unit}\",\"alert.units.candidate_id\":\"候補 ID\",\"alert.units.candidate_updated\":\"候補の更新日時\",\"alert.units.candidates_empty\":\"確認可能な候補なし\",\"alert.units.candidates_expired\":\"候補の期限切れ\",\"alert.units.change_reason\":\"変更理由\",\"alert.units.current_and_bound\":\"現在 / 紐付け済みの指標\",\"alert.units.current_metric\":\"現在の指標\",\"alert.units.current_unit\":\"現在の単位\",\"alert.units.identity_changed\":\"照会に使う識別情報が変わりました。再確認してください\",\"alert.units.last_verified\":\"最終検証\",\"alert.units.metric\":\"指標\",\"alert.units.metric_changed\":\"指標が変わりました。再確認してください\",\"alert.units.metric_unknown\":\"識別待ち\",\"alert.units.not_bound\":\"未設定\",\"alert.units.pending_query\":\"取得待ち\",\"alert.units.readonly\":\"既存の照会結果 · 読み取り専用\",\"alert.units.readonly_note\":\"一覧には既存の照会結果を表示します。期限切れの候補は手動で更新できます。\",\"alert.units.refresh_command\":\"候補を手動で更新するには /yql alert units \\\"アカウント名\\\" refresh を使います。\",\"alert.units.refreshed\":\"更新をリクエスト済み · 最新のローカル状態\",\"alert.units.refreshed_note\":\"リクエストに従ってアカウント残高を更新しました。\",\"alert.units.stale\":\"単位の検証期限切れ\",\"alert.units.threshold_note\":\"確認前にしきい値の意味を確認してください。しきい値の数値は確認後も維持されます。\",\"alert.units.title\":\"アラートの単位と候補\",\"alert.units.unit_changed\":\"単位が変わりました。再確認してください\",\"alert.units.verified\":\"単位を検証済み\",\"balance.expiry\":\"有効期限\",\"balance.expiry_date\":\"有効期限 {time}\",\"balance.item_expiry\":\"{label}の有効期限\",\"balance.item_note\":\"{label}の説明\",\"balance.kind.cash\":\"現金残高\",\"balance.kind.credits\":\"クレジット\",\"balance.kind.custom\":\"カスタム項目\",\"balance.kind.free_quota\":\"無料クォータ\",\"balance.kind.quota\":\"クォータ\",\"balance.kind.subscription\":\"プラン\",\"balance.kind.usage\":\"使用量\",\"balance.remaining\":\"残り\",\"balance.remaining_amount\":\"残り {amount}\",\"balance.semantics\":\"意味：{meaning}\",\"balance.site_credit_meaning\":\"アカウントのサイト内クォータは site_credit 単位です。\",\"balance.total\":\"合計\",\"balance.total_amount\":\"合計 {amount}\",\"balance.unknown_amount\":\"値不明（単位：{unit}）\",\"balance.unknown_unit\":\"単位不明\",\"balance.unreported\":\"未提供（単位：{unit}）\",\"balance.used\":\"使用済み\",\"balance.used_amount\":\"使用済み {amount}\",\"balance.value_separator\":\"；\",\"capability.alibaba\":\"Alibaba Cloud 百煉\",\"capability.alibaba_balance\":\"Alibaba Cloud のアカウント残高（BSS：現金・利用可能額・信用枠）\",\"capability.cash\":\"現金残高\",\"capability.compatible\":\"OpenAI 互換サービス\",\"capability.credential_missing\":\"使用できる認証情報が設定されていません\",\"capability.credits\":\"ポイント\",\"capability.custom\":\"ユーザー設定の残高区分\",\"capability.deepseek_balance\":\"複数通貨のアカウント残高\",\"capability.endpoint_invalid\":\"残高照会エンドポイントの設定が無効です\",\"capability.free_quota\":\"無料枠\",\"capability.grsai_region\":\"Grsai の接続先設定が無効です\",\"capability.grsai_token_missing\":\"Grsai のアカウントリクエストトークンが設定されていません\",\"capability.host_invalid\":\"Host の設定が無効です\",\"capability.host_missing\":\"HTTPS ベース URL の Host が設定されていません\",\"capability.kind_invalid\":\"Grsai のポイントの種類は credits に設定してください\",\"capability.mapping_invalid\":\"残高フィールドの割り当てが未設定か無効です\",\"capability.meinianda_balance\":\"アカウントのサイト内クレジット（site_credit）\",\"capability.path_invalid\":\"API Path の設定が無効です\",\"capability.path_missing\":\"/ で始まる相対 API Path が設定されていません\",\"capability.profile_invalid\":\"サービスの種類の設定が無効です\",\"capability.quota\":\"利用枠\",\"capability.scope_invalid\":\"残高の範囲の設定が無効です\",\"capability.subscription\":\"サブスクリプション枠\",\"capability.unqueryable\":\"現在の設定では照会できません\",\"capability.usage\":\"使用量\",\"common.empty\":\"空\",\"common.field_separator\":\"：\",\"common.label_value\":\"{label}：{value}\",\"common.list_separator\":\"、\",\"common.none\":\"なし\",\"common.unknown\":\"不明\",\"config.account_id\":\"アカウントの id には空でない文字列を指定してください\",\"config.account_mapping\":\"アカウント設定はオブジェクトである必要があります\",\"config.admin_boolean\":\"command_admin_only には真偽値を指定してください。既定値を使用しました\",\"config.aliases\":\"aliases には空でない文字列のリストを指定してください\",\"config.auth_mapping\":\"auth にはオブジェクトを指定してください\",\"config.balance_scope\":\"残高の範囲には generic、account、api_key のいずれかを指定してください\",\"config.bss_auth\":\"Alibaba Cloud BSS の照会には専用の AccessKey ID と AccessKey Secret が必要です\",\"config.compatible_auth\":\"互換 API には API キーが必要です\",\"config.conflict\":\"設定が変更されました。更新してから再確認してください。\",\"config.conflicting_account\":\"アカウント名が別のアカウントと重複しています\",\"config.credential_in_field\":\"通常の設定項目に認証情報を含めることはできません。\",\"config.credential_operation\":\"認証情報は専用の操作で保存してください。\",\"config.display_name\":\"display_name には空でない文字列を指定してください\",\"config.duplicate_credential\":\"認証情報と通常の設定項目に同じ値は使えません。\",\"config.duplicate_id\":\"アカウントの id が重複しています\",\"config.enabled_boolean\":\"enabled には真偽値を指定してください。アカウントは無効になりました\",\"config.endpoint_mapping\":\"endpoint にはオブジェクトを指定してください\",\"config.group_boolean\":\"allow_group_queries には真偽値を指定してください。既定値を使用しました\",\"config.group_list\":\"group_allowed_user_ids には空でない文字列のリストを指定してください。空のリストを使用しました\",\"config.grsai_account_only\":\"Grsai は現在、アカウントポイントにのみ対応しています。API キーのポイント用プリセットは未対応です\",\"config.grsai_account_path\":\"Grsai のアカウントポイントには /client/openapi/getCredits を使用してください\",\"config.grsai_api_key_scope\":\"Grsai の API キーのポイント用プリセットは未対応です。アカウントポイントを選択してください\",\"config.grsai_credits\":\"Grsai のポイント照会では kind を credits に固定してください\",\"config.grsai_path_scope\":\"Grsai では getCredits に account、getAPIKeyCredits に api_key を指定してください\",\"config.grsai_post\":\"この Grsai ポイント API には POST が必要です\",\"config.grsai_region\":\"Grsai の接続先には中国本土への直接接続か、海外向け接続を選択してください\",\"config.grsai_required\":\"アカウントまたは API Key の残高範囲は Grsai を選択した場合のみ使用できます\",\"config.grsai_scope\":\"Grsai は現在、アカウントポイントのプリセットにのみ対応しています\",\"config.grsai_token\":\"Grsai のアカウントポイントには、ユーザー情報にあるリクエストトークン（token）が必要です\",\"config.invalid\":\"設定が無効です。項目とデータ型を確認してください。\",\"config.invalid_amount_mapping\":\"互換 API には有効な amount_path の割り当てが必要です\",\"config.invalid_endpoint\":\"残高エンドポイントには安全な HTTPS GET または POST を設定してください\",\"config.invalid_host\":\"Host にはパス、クエリ、フラグメントを含まない HTTPS ベース URL を指定してください\",\"config.invalid_path\":\"API Path は単一の / で始まり、完全な URL、クエリ、フラグメントを含めることはできません\",\"config.invalid_root\":\"設定のルートはオブジェクトである必要があります\",\"config.legacy_credential_in_field\":\"旧設定の通常項目に認証情報があります。元の設定は削除されていません。\",\"config.legacy_credential_shape\":\"旧認証情報を安全に移行できません。元の設定は削除されていません。\",\"config.migrate_first\":\"設定を変更する前に、旧設定を確認して移行してください。\",\"config.missing_auth\":\"使用できる認証情報がありません\",\"config.missing_endpoint\":\"残高照会のエンドポイントが設定されていません\",\"config.missing_env\":\"参照先の認証情報の環境変数が設定されていません\",\"config.missing_host\":\"サービスの HTTPS ベース URL を Host に入力してください\",\"config.missing_path\":\"/ で始まる相対 API Path を入力してください\",\"config.positive_integer\":\"{path} には正の整数を指定してください。既定値を使用しました\",\"config.positive_number\":\"{path} には正の数を指定してください。既定値を使用しました\",\"config.private_list\":\"private_allowed_user_ids には platform:userID 形式の文字列リストを指定してください。空のリストを使用しました\",\"config.provider_immutable\":\"既存のアカウントのプロバイダーは変更できません。新しいアカウントを作成してください。\",\"config.provider_type\":\"不明なプロバイダーの種類です\",\"config.providers_list\":\"providers にはリストを指定してください\",\"config.response_mapping\":\"response_mapping にはオブジェクトを指定してください。空のオブジェクトを使用しました\",\"config.secret_in_name\":\"アカウント名に認証情報を含めることはできません\",\"config.service_profile\":\"互換サービスには generic または grsai を指定してください\",\"config.storage_unavailable\":\"安全なストレージを一時的に利用できません。平文での保存には切り替えていません。鍵とストレージの状態を確認してください。\",\"config.template_mismatch\":\"アカウントテンプレートとプロバイダーの種類が一致しません\",\"config.wallet_origin\":\"サイトの HTTPS オリジンを入力してください。例：https://gateway.example\",\"config.wallet_origin_credential\":\"サイトのアドレスを変更するには、このアカウントの照会用認証情報を先に削除してください。\",\"config.wallet_region\":\"照会キーを発行した地域を選択してください。\",\"config.wallet_team\":\"xAI のチーム ID を半角英数字、ハイフン、アンダースコアで入力してください。\",\"credential.encrypted\":\"暗号化された認証情報を保存済み\",\"credential.environment\":\"環境変数の参照を保存済み\",\"credential.missing\":\"認証情報は未保存\",\"credential.mixed\":\"暗号化された認証情報と環境変数の参照を保存済み\",\"credential.unknown\":\"保存状態は未確認\",\"error.alert_config.account_disabled\":\"アラートを有効にする前に、アカウントを有効にしてください。\",\"error.alert_config.decimal_format\":\"{label}は通常の10進表記で入力してください。指数表記は使用できません。\",\"error.alert_config.duplicate_target\":\"アラート通知先の UMO が重複しています。同じ行にまとめてください。\",\"error.alert_config.group_mention_only\":\"QQ 番号でのメンションは、数値 ID の QQ グループでのみ設定できます。個別チャットではメンションを削除してください。\",\"error.alert_config.integer_range\":\"{label}には {low}〜{high} の整数を指定してください。\",\"error.alert_config.invalid_enabled\":\"アラートのオン・オフには真偽値を指定してください。\",\"error.alert_config.invalid_model_enabled\":\"アラート用モデルのオン・オフには真偽値を指定してください。\",\"error.alert_config.invalid_model_object\":\"アラート用モデルの設定構造が無効です。\",\"error.alert_config.invalid_object\":\"アカウントのアラート設定にはオブジェクトを指定してください。\",\"error.alert_config.invalid_admin_id\":\"{label}には QQ 番号または qq_official:UID を入力してください。UMO や全員メンションは使用できません。\",\"error.alert_config.invalid_qq_id\":\"{label}に指定できるのは、ASCII の数字で表した正の整数の QQ 番号のみです。全員へのメンションはできません。\",\"error.alert_config.invalid_target_fields\":\"各アラート通知先には umo と mentions が必要です。scene は任意です。\",\"error.alert_config.invalid_target_scene\":\"QQ 公式のグループチャットは GroupMessage に scene=qq_group、個人チャットは FriendMessage に scene=qq_c2c を指定してください。どちらも @ メンションは使えません。\",\"error.alert_config.invalid_text\":\"{label}には制御文字を含まないテキストを指定してください。\",\"error.alert_config.invalid_text_format\":\"{label}の長さまたは形式が無効です。\",\"error.alert_config.invalid_umo\":\"UMO は「プラットフォームインスタンス:メッセージ種別:セッションID」の形式で指定してください。\",\"error.alert_config.label.admin_qq\":\"アラート管理用 QQ 許可リスト\",\"error.alert_config.label.check_interval\":\"確認間隔（分）\",\"error.alert_config.label.mentions\":\"グループ内メンション\",\"error.alert_config.label.metric\":\"アラート指標\",\"error.alert_config.label.model\":\"モデル ID\",\"error.alert_config.label.persona\":\"ペルソナ ID\",\"error.alert_config.label.recovery_threshold\":\"回復しきい値\",\"error.alert_config.label.repeat_interval\":\"残高が低い間の再通知間隔（分、0 で再通知なし）\",\"error.alert_config.label.threshold\":\"発動しきい値\",\"error.alert_config.label.unit\":\"アラートの単位\",\"error.alert_config.list_limit\":\"{label}は {limit} 件以下のリストで指定してください。\",\"error.alert_config.missing_targets\":\"アラートを有効にする前に、通知先を1件以上設定してください。\",\"error.alert_config.missing_threshold_or_metric\":\"しきい値と指標を設定してください。\",\"error.alert_config.recovery_threshold_order\":\"回復しきい値は発動しきい値より大きい値を指定してください。\",\"error.alert_config.target_limit\":\"アラート通知先は {limit} 件以下のリストで指定してください。\",\"error.alert_config.unknown_fields\":\"アカウントのアラート設定に不明なフィールドがあります。\",\"error.alert_config.unsupported_metric\":\"このプロバイダーは指定されたアラート指標に対応していません。\",\"error.query.empty_target\":\"対象名を入力してください\",\"error.query.invalid_arguments\":\"このコマンドには対象を指定できません\",\"error.query.multiple_targets\":\"複数のアカウントまたはプロバイダーが見つかりました。対象を1つ指定してください\",\"error.query.unknown_target\":\"一致するアカウントまたはプロバイダーが見つかりません\",\"help.account_command\":\"/yql account <名前>\",\"help.alerts\":\"クォータアラート\",\"help.aliyun_note\":\"Alibaba Cloud BSS では現金残高、利用可能額、与信枠を照会します。RAM ID には AliyunBSSReadOnlyAccess が必要です。\",\"help.all_accounts\":\"全アカウント\",\"help.all_command\":\"/yql または /yql all\",\"help.card_subtitle\":\"クォータ照会 · ローカル設定の確認\",\"help.card_title\":\"YQL ヘルプ\",\"help.card_tool_note\":\"関数ツールを有効にすると、自然言語でクォータを照会できます。\",\"help.command_body\":\"如月怜のクォータリンク\\n使い方：\\n  /yql                 全アカウントを照会\\n  /yql help            ヘルプを表示\\n  /yql status          ローカル設定を表示\\n  /yql all             全アカウントを照会\\n  /yql <名前>          アカウントまたはプロバイダーを照会\\n  /yql account <名前>  アカウントを照会\\n  /yql provider <名前> プロバイダーを照会\\n\",\"help.compatible_note\":\"OpenAI 互換サービスの残高照会にはプロバイダー固有の API を使用します。残高 API の文書に従い、サービス URL、API パス、高度な認証と応答マッピングを設定してください。\",\"help.configured_accounts\":\"設定済みアカウント：{names}\",\"help.enabled_accounts\":\"有効なアカウント · {count} 件\",\"help.local_config\":\"ローカル設定\",\"help.local_note\":\"help と status はローカル情報を表示します。\",\"help.management_note\":\"プロバイダーの API と認証情報は管理画面で設定してください。\",\"help.name_note\":\"/yql <名前> も使えます。表示名、別名、プロバイダー名に対応します。\",\"help.no_accounts\":\"アカウントが設定されていません。\",\"help.no_enabled_accounts\":\"有効なアカウントがありません。管理画面でアカウントを追加してください。\",\"help.provider_command\":\"/yql provider <名前>\",\"help.query\":\"クォータ照会\",\"help.select_account\":\"指定アカウント\",\"help.select_provider\":\"指定プロバイダー\",\"help.status_heading\":\"ヘルプと状態\",\"help.tool_note\":\"関数ツールが有効な AI 会話では、自然言語でモデルに yql_query_balance の呼び出しを依頼できます。\",\"help.usage\":\"使い方\",\"provider.alibaba_bailian.authentication\":\"Alibaba Cloud のアクセスキー認証に失敗しました\",\"provider.alibaba_bailian.available_credit\":\"利用可能枠\",\"provider.alibaba_bailian.cash_balance\":\"現金残高\",\"provider.alibaba_bailian.connection\":\"Alibaba Cloud の残高サービスに接続できません\",\"provider.alibaba_bailian.credit_limit\":\"与信枠\",\"provider.alibaba_bailian.fallback_account\":\"Alibaba Cloud アカウント\",\"provider.alibaba_bailian.invalid_credentials\":\"Alibaba Cloud の残高照会に使用する認証情報の設定が無効です\",\"provider.alibaba_bailian.invalid_request\":\"Alibaba Cloud の残高照会リクエスト設定が無効です\",\"provider.alibaba_bailian.invalid_response\":\"Alibaba Cloud が返した残高データの形式を認識できません\",\"provider.alibaba_bailian.permission\":\"Alibaba Cloud がアカウントの現金残高へのアクセスを拒否しました。BSS の現金残高を照会する RAM ID に少なくとも AliyunBSSReadOnlyAccess を付与してください。DashScope モデルの API キーはこの RAM 権限の代わりにはなりません。BSS FullAccess の付与は不要です。\",\"provider.alibaba_bailian.query_failed\":\"Alibaba Cloud のアカウント現金残高照会に失敗しました\",\"provider.alibaba_bailian.rate_limited\":\"Alibaba Cloud の残高照会がレート制限されました。しばらくしてから再試行してください\",\"provider.alibaba_bailian.request_denied\":\"Alibaba Cloud がアカウントの現金残高照会を拒否しました\",\"provider.alibaba_bailian.source\":\"Alibaba Cloud アカウントの残高と利用枠\",\"provider.alibaba_bailian.timeout\":\"Alibaba Cloud の現金残高照会がタイムアウトしました\",\"provider.alibaba_bailian.too_many_requests\":\"Alibaba Cloud への残高照会が多すぎます。しばらくしてから再試行してください\",\"provider.alibaba_bailian.unavailable\":\"Alibaba Cloud の残高サービスは一時的に利用できません\",\"provider.deepseek.authentication\":\"DeepSeek API キーの認証に失敗しました\",\"provider.deepseek.connection\":\"DeepSeek の残高サービスに接続できません\",\"provider.deepseek.granted_balance\":\"有効期限内の付与残高\",\"provider.deepseek.insufficient_balance\":\"DeepSeek アカウントの残高が不足しているため、現在 API を呼び出せません\",\"provider.deepseek.invalid_request\":\"DeepSeek の残高照会リクエスト設定が無効です\",\"provider.deepseek.invalid_response\":\"DeepSeek が返した残高データの形式を認識できません\",\"provider.deepseek.missing_key\":\"DeepSeek アカウントに有効な API キーがありません\",\"provider.deepseek.permission\":\"DeepSeek が残高照会を拒否しました\",\"provider.deepseek.rate_limited\":\"DeepSeek へのリクエストが多すぎます。しばらくしてから再試行してください\",\"provider.deepseek.request_denied\":\"DeepSeek が残高照会リクエストを拒否しました\",\"provider.deepseek.source\":\"DeepSeek API\",\"provider.deepseek.timeout\":\"DeepSeek の残高照会がタイムアウトしました\",\"provider.deepseek.topped_up_balance\":\"チャージ残高\",\"provider.deepseek.total_balance\":\"利用可能な残高の合計\",\"provider.deepseek.unavailable\":\"DeepSeek の残高照会が一時的に失敗しました\",\"provider.glm_plan.credits\":\"クレジット使用量\",\"provider.glm_plan.five_hours\":\"5 時間枠\",\"provider.glm_plan.mcp\":\"MCP 使用量\",\"provider.glm_plan.monthly\":\"月間枠\",\"provider.glm_plan.other_window\":\"期間 {number}\",\"provider.glm_plan.source\":\"GLM Coding Plan 公式利用枠 API\",\"provider.glm_plan.tokens\":\"トークン使用量\",\"provider.glm_plan.weekly\":\"週間枠\",\"provider.glm_plan.window\":\"{category} · {window}\",\"provider.meinianda.authentication\":\"Meinianda API キーの認証に失敗しました\",\"provider.meinianda.connection\":\"Meinianda の残高サービスに接続できません\",\"provider.meinianda.invalid_request\":\"Meinianda の残高照会リクエスト設定が無効です\",\"provider.meinianda.invalid_response\":\"Meinianda が返した残高データの形式を認識できません\",\"provider.meinianda.missing_key\":\"Meinianda アカウントに有効な API キーがありません\",\"provider.meinianda.permission\":\"Meinianda が残高照会を拒否しました\",\"provider.meinianda.query_failed\":\"Meinianda の残高照会を完了できませんでした\",\"provider.meinianda.rate_limited\":\"Meinianda へのリクエストが多すぎます。しばらくしてから再試行してください\",\"provider.meinianda.site_credit\":\"サイト内クレジット\",\"provider.meinianda.site_credit_note\":\"アカウントのサイト内クレジットです。API キーの上限とは別で、通貨には換算しません。\",\"provider.meinianda.source\":\"Meinianda 残高 API\",\"provider.meinianda.timeout\":\"Meinianda の残高照会がタイムアウトしました\",\"provider.meinianda.unavailable\":\"Meinianda の残高照会が一時的に失敗しました\",\"provider.minimax_plan.exhausted\":\"{window}（上限に到達）\",\"provider.minimax_plan.general\":\"共通リソース\",\"provider.minimax_plan.interval\":\"{model} · 現在の期間\",\"provider.minimax_plan.not_in_plan\":\"{window}（プラン対象外）\",\"provider.minimax_plan.other_model\":\"リソースグループ {number}\",\"provider.minimax_plan.source\":\"MiniMax 公式プラン利用枠 API\",\"provider.minimax_plan.unlimited\":\"{window}（無制限）\",\"provider.minimax_plan.video\":\"動画リソース\",\"provider.minimax_plan.weekly\":\"{model} · 週間\",\"provider.minimax_plan.weekly_boost\":\"{model} · 週間利用枠の倍率\",\"provider.moonshot.cash_balance\":\"現金残高\",\"provider.moonshot.source\":\"Kimi オープンプラットフォームのアカウント残高\",\"provider.moonshot.voucher_balance\":\"クーポン残高\",\"provider.new_api.effective_quota\":\"このトークンで利用可能なクォータ\",\"provider.new_api.key_quota\":\"トークンクォータ\",\"provider.new_api.source\":\"New API トークンクォータ API\",\"provider.new_api.unlimited\":\"トークンクォータに上限なし\",\"provider.new_api.user_quota\":\"アカウントクォータ\",\"provider.novita.available\":\"利用可能なアカウントクレジット\",\"provider.novita.cash\":\"チャージ残高\",\"provider.novita.credit_limit\":\"信用限度額\",\"provider.novita.outstanding\":\"未払い請求額\",\"provider.novita.source\":\"Novita AI アカウント残高 API\",\"provider.openai_compatible.authentication\":\"残高 API の認証に失敗しました\",\"provider.openai_compatible.business_failure\":\"残高サービスが照会の失敗を報告しました\",\"provider.openai_compatible.connection\":\"残高 API に接続できません\",\"provider.openai_compatible.grsai_authentication\":\"アカウントのポイント API が HTTP 401 を返しました。認証設定を確認してください\",\"provider.openai_compatible.grsai_permission\":\"アカウントのポイント API が HTTP 403 を返しました。アクセス設定を確認してください\",\"provider.openai_compatible.grsai_query_failed\":\"アカウントのポイント API へのリクエストに失敗しました\",\"provider.openai_compatible.grsai_rate_limited\":\"アカウントのポイント API が HTTP 429 を返しました。しばらくしてから再試行してください\",\"provider.openai_compatible.grsai_source\":\"Grsai アカウントのポイント API\",\"provider.openai_compatible.https_required\":\"残高 API には HTTPS が必要です\",\"provider.openai_compatible.invalid_configuration\":\"互換プラットフォームの残高照会設定が無効です\",\"provider.openai_compatible.invalid_request\":\"残高 API のリクエスト設定が無効です\",\"provider.openai_compatible.invalid_response\":\"残高 API が返したデータの形式を認識できません\",\"provider.openai_compatible.not_found\":\"残高 API のパスまたはバージョンが見つかりません\",\"provider.openai_compatible.permission\":\"残高 API がアクセスを拒否しました\",\"provider.openai_compatible.rate_limited\":\"残高 API へのリクエストが多すぎます。しばらくしてから再試行してください\",\"provider.openai_compatible.source\":\"OpenAI 互換の残高 API\",\"provider.openai_compatible.timeout\":\"残高 API の照会がタイムアウトしました\",\"provider.openai_compatible.unavailable\":\"残高 API へのリクエストが一時的に失敗しました\",\"provider.openrouter.balance\":\"利用可能なアカウントクレジット\",\"provider.openrouter.source\":\"OpenRouter アカウントクレジット API\",\"provider.pollinations.held\":\"凍結中のクエスト Pollen\",\"provider.pollinations.paid\":\"有料 Pollen\",\"provider.pollinations.quest\":\"クエスト Pollen\",\"provider.pollinations.source\":\"Pollinations 公式アカウント残高 API\",\"provider.pollinations.total\":\"利用可能な Pollen\",\"provider.retry.explicit_throttling\":\"残高サービスがレート制限を通知しました。しばらくしてから再試行してください\",\"provider.stepfun.source\":\"StepFun オープンプラットフォームのアカウント残高\",\"provider.stepfun.total_cash\":\"累計チャージ額\",\"provider.stepfun.total_voucher\":\"累計付与額\",\"provider.sub2api.key_quota\":\"API キーの利用枠\",\"provider.sub2api.source\":\"Sub2API の利用枠照会\",\"provider.sub2api.wallet_balance\":\"ウォレット残高\",\"provider.venice.available_balance\":\"USD プリペイド残高\",\"provider.venice.bundled_credits\":\"プラン付帯クレジットの残高\",\"provider.venice.diem_balance\":\"現在のエポックの残り DIEM\",\"provider.venice.earned_credits\":\"獲得済みクレジットの残高\",\"provider.venice.no_numeric_balance\":\"API から具体的な残高は返されませんでした。\",\"provider.venice.source\":\"Venice アカウント残高 API\",\"provider.vercel_gateway.balance\":\"利用可能なチームクレジット\",\"provider.vercel_gateway.lifetime_usage\":\"累計使用クレジット\",\"provider.vercel_gateway.source\":\"Vercel AI Gateway チームクレジット API\",\"provider.wallet.authentication\":\"プロバイダーが照会用の認証情報を拒否しました。\",\"provider.wallet.available_balance\":\"利用可能残高\",\"provider.wallet.configuration\":\"照会用の認証情報とアカウント設定を確認してください。\",\"provider.wallet.endpoint\":\"残高・クォータ照会のエンドポイントを利用できません。アカウント設定を確認してください。\",\"provider.wallet.parse\":\"プロバイダーが返した残高やクォータを読み取れませんでした。\",\"provider.wallet.permission\":\"現在の認証情報では、このアカウントの残高やクォータを照会できません。\",\"provider.wallet.rate_limited\":\"照会回数が上限に達しました。しばらくしてから再試行してください。\",\"provider.wallet.unavailable\":\"プロバイダーから残高やクォータを取得できませんでした。\",\"provider.wallet.unsupported\":\"このエンドポイントが返すクォータの種類には対応していません。\",\"provider.xai.posted_balance\":\"台帳上のプリペイド残高\",\"provider.xai.posted_note\":\"現在の請求期間の未計上分は、残高から差し引かれていない場合があります。\",\"provider.xai.source\":\"xAI チームのプリペイド台帳\",\"query.account_card_title\":\"アカウントのクォータと使用量\",\"query.account_incomplete\":\"アカウントの設定が不完全なため照会できません\",\"query.account_outcome_count\":\"{label} {count} 件\",\"query.account_timeout\":\"アカウントの照会がタイムアウトしました\",\"query.account_title\":\"アカウント照会：{target}\",\"query.accounts_count\":\"{count} アカウント\",\"query.all_card_title\":\"クォータと使用量\",\"query.all_title\":\"クォータと使用量の照会\",\"query.authentication_paused\":\"認証または権限のエラーで一時停止しました。設定を更新するか、手動で再試行してください\",\"query.available\":\"利用可能\",\"query.cached\":\"（キャッシュ）\",\"query.cached_card\":\" · キャッシュデータ\",\"query.client_unconfigured\":\"照会クライアントが設定されていません\",\"query.cooldown_account\":\"このアカウントの照会は一時停止中です。{seconds} 秒後に再試行してください\",\"query.cooldown_provider\":\"このプロバイダーの照会は一時停止中です。{seconds} 秒後に再試行してください\",\"query.empty_title\":\"結果なし\",\"query.error_detail\":\"  照会失敗：{message}\",\"query.failed\":\"照会失敗\",\"query.failed_short\":\"失敗\",\"query.invalid_operation\":\"操作には query または list を指定してください。\",\"query.invalid_provider_result\":\"プロバイダーから無効な照会結果が返されました\",\"query.invalid_request\":\"照会リクエストを認識できません。\",\"query.invalid_target\":\"アカウント、プロバイダー名、または all を指定してください。\",\"query.matches\":\"{message}\\n候補：{candidates}\",\"query.no_accounts\":\"照会可能なアカウントが設定されていません。\",\"query.no_items\":\"表示できる残高や使用量の項目はありません\",\"query.no_results\":\"表示できる照会結果はありません。\",\"query.outcome_count\":\"{label} {count} 件\",\"query.partial\":\"一部利用可能\",\"query.partial_data\":\"一部のデータを取得済み\",\"query.partial_success\":\"一部成功\",\"query.permission_denied\":\"この会話には残高を照会する権限がありません。\",\"query.provider_card_title\":\"プロバイダーのクォータと使用量\",\"query.provider_title\":\"プロバイダー照会：{target}\",\"query.provider_unsupported\":\"このプロバイダーの残高照会にはまだ対応していません\",\"query.queue_timeout\":\"照会の順番待ち中にアカウントの制限時間を超えました\",\"query.service_closed\":\"照会サービスは停止しています\",\"query.source_time\":\"  取得日時：{time} · ソース：{source}\",\"query.source_time_card\":\"ソース：{source} · 取得：{time}\",\"query.status_unavailable\":\"利用不可\",\"query.success\":\"照会成功\",\"query.success_short\":\"成功\",\"query.summary\":\"照会結果：{summary}。\",\"query.summary_separator\":\"、\",\"query.target_card\":\"対象：{target}\\n\",\"query.time\":\"照会日時：{time}\",\"query.time_card\":\"照会：{time}\",\"query.total_timeout\":\"照会全体の制限時間を超えました\",\"query.unavailable\":\"現在は照会できません\",\"query.unknown_status\":\"状態不明\",\"status.account_list\":\"アカウント一覧：\",\"status.accounts_count\":\"アカウント：全 {total} 件、有効 {enabled} 件、照会可能 {ready} 件\",\"status.add_account\":\"管理画面でアカウントと認証情報を追加\",\"status.admin_only\":\"管理者のみ\",\"status.after_save\":\"保存後、/yql status でローカル設定を確認し、/yql でクォータを照会します。\",\"status.api_path\":\"/ で始まる相対 API パスを入力してください\",\"status.card_access\":\"アクセスと認証情報\",\"status.card_counts\":\"{total} アカウント · 有効 {enabled} 件 · 設定済み {ready} 件\",\"status.card_incomplete\":\"未設定：{reason}\",\"status.card_issues\":\"設定の問題 · {count} 件\",\"status.card_needs_check\":\"要確認：{reason}\",\"status.card_needs_setup\":\"要設定：{reason}\",\"status.card_no_accounts\":\"アカウント未設定\",\"status.card_online_check\":\"接続と残高は /yql で照会できます。\",\"status.card_source\":\"ローカルアカウント一覧と認証情報の保存記録に基づく\",\"status.card_title\":\"ローカル設定の状態\",\"status.credential_storage\":\"認証情報の保存\",\"status.credential_storage_state\":\"認証情報の保存：{state}\",\"status.disabled\":\"無効\",\"status.enabled\":\"有効\",\"status.group_queries\":\"グループでの照会\",\"status.group_queries_state\":\"グループでの照会：{state}\",\"status.incomplete\":\"設定不足：{reason}\",\"status.issue_count\":\"設定の問題：{count} 件\",\"status.next_step\":\"次の手順\",\"status.no_accounts\":\"アカウントが設定されていません。\",\"status.not_queryable\":\"照会不可：{reason}\",\"status.off\":\"無効\",\"status.permissions\":\"コマンド権限\",\"status.permissions_state\":\"コマンド権限：{state}\",\"status.provider\":\"プロバイダー：{provider}\",\"status.queryable\":\"設定済み、照会可能\",\"status.reason.grsai_account_path_mismatch\":\"Grsai アカウントのクレジット API を使用してください\",\"status.reason.grsai_balance_scope_mismatch\":\"Grsai の API に対応する残高範囲を選んでください\",\"status.reason.grsai_method_must_post\":\"Grsai のクレジット API は POST を使います\",\"status.reason.invalid_api_path\":\"API パスが無効です。/ で始まるクエリなしの相対パスを入力してください\",\"status.reason.invalid_balance_kind\":\"Grsai の残高種別は credits に設定してください\",\"status.reason.invalid_balance_scope\":\"残高の照会範囲を確認してください\",\"status.reason.invalid_base_url\":\"サービス URL が無効です。パス、クエリ、認証情報を含まない HTTPS のベース URL を入力してください\",\"status.reason.invalid_endpoint\":\"サービス URL または API パスが無効です。HTTPS のベース URL と / で始まる API パスを入力してください\",\"status.reason.invalid_grsai_region\":\"有効な Grsai リージョンを選択してください\",\"status.reason.invalid_response_mapping\":\"プロバイダーの応答仕様に従い、詳細設定で残高のマッピングを入力してください\",\"status.reason.invalid_service_profile\":\"サービスの種類を確認してください\",\"status.reason.missing_api_path\":\"/ で始まる API パスを入力してください\",\"status.reason.missing_base_url\":\"HTTPS のベース URL を入力してください\",\"status.reason.missing_credentials\":\"有効な認証情報がありません\",\"status.reason.missing_endpoint\":\"プロバイダーの文書に従いサービス URL と API パスを入力してください\",\"status.reason.missing_environment_variable\":\"認証情報の環境変数が未設定です\",\"status.reason.missing_grsai_token\":\"Grsai アカウントのリクエストトークンを設定してください\",\"status.saved_credentials\":\"認証情報の保存\",\"status.session_permissions\":\"会話ごとに許可\",\"status.source\":\"情報源：ローカル設定と認証情報の保存記録。接続と残高は /yql で照会できます。\",\"status.title\":\"如月怜のクォータリンクの状態\",\"status.unknown_reason\":\"設定が不完全か、一時的に照会できません\",\"storage.migration_pending\":\"旧設定の移行が必要\",\"storage.ready\":\"安全なストレージを利用可能\",\"storage.unavailable\":\"安全なストレージの確認が必要\",\"storage.unknown\":\"認証情報の保存状態は未確認\",\"web.account.add\":\"アカウントを追加\",\"web.account.add_query\":\"照会アカウントを追加\",\"web.account.advanced\":\"API とレスポンスの詳細設定\",\"web.account.aliases_hint\":\"コマンドと自然言語の照会で使う別名です。1 行に 1 件入力し、他のアカウントと重複しないようにしてください。\",\"web.account.count\":\"アカウント {count} 件\",\"web.account.credentials_configured\":\"認証情報設定済み\",\"web.account.credentials_pending\":\"認証情報未設定\",\"web.account.disabled\":\"無効\",\"web.account.editor_subtitle\":\"照会設定と照会先の認証情報を管理します。\",\"web.account.empty\":\"照会アカウントがありません\",\"web.account.empty_hint\":\"プロバイダーを選んでアカウントを追加し、暗号化する認証情報を別途設定してください。\",\"web.account.enabled\":\"有効\",\"web.account.id_hint\":\"変更が不要な一意の ID を選んでください。保存後は変更できません。\",\"web.account.id_locked\":\"認証情報の誤った紐付けを防ぐため、既存のアカウント ID は変更できません。\",\"web.account.list\":\"照会アカウント\",\"web.account.list_subtitle\":\"AI サービスの残高、使用量、クォータを照会するアカウントを管理します。\",\"web.account.mapping\":\"残高レスポンスのマッピング\",\"web.account.mapping_hint\":\"/data/remaining のような JSON Pointer を使用してください。固定リクエスト本文やマッピングに認証情報を含めないでください。\",\"web.account.new\":\"新しいアカウント\",\"web.account.profile_action\":\"変更してしきい値を消去\",\"web.account.profile_body\":\"しきい値を消去し、アラートを無効にします。単位は再検出されます。\",\"web.account.profile_title\":\"サービスの種類を変更し、アラートをリセットしますか？\",\"web.account.protocol\":\"リクエストの仕様\",\"web.account.provider\":\"プロバイダー\",\"web.account.provider_scope\":\"プロバイダーごとに残高照会の仕様と認証情報が異なり、モデルのチャット設定とは別に管理されます。\",\"web.account.provider_settings\":\"プロバイダー設定\",\"web.account.remove\":\"アカウントを削除\",\"web.account.remove_action\":\"下書きから削除\",\"web.account.remove_body\":\"このアカウントを下書きから削除します。設定を保存すると削除が適用され、保存済みの認証情報も削除されます。他のアカウントには影響しません。\",\"web.account.remove_hint\":\"削除は設定の保存後に適用されます。\",\"web.account.remove_title\":\"アカウント「{account}」を削除しますか？\",\"web.account.settings\":\"アカウント設定\",\"web.alert.admin_list\":\"アラート管理用 QQ 許可リスト\",\"web.alert.admin_list_hint\":\"1行に OneBot の QQ 番号、または qq_official:UID を入力します。公式 UID は /sid で確認し、UMO は入力しません。登録者と AstrBot 管理者が通知を管理できます。\",\"web.alert.admin_list_placeholder\":\"QQ 番号または qq_official:UID\",\"web.alert.enable_account\":\"このアカウントのアラートを有効にする\",\"web.alert.hints_title\":\"アラートメッセージ\",\"web.alert.interval\":\"チェック間隔（分）\",\"web.alert.interval_days\":\"{count} 日\",\"web.alert.interval_hint\":\"1～4320 分。既定値は 15 分です。\",\"web.alert.interval_minutes\":\"{count} 分\",\"web.alert.interval_set\":\"{count} 分に設定\",\"web.alert.interval_slider\":\"チェック間隔のスライダー（分）\",\"web.alert.metric\":\"アラート指標\",\"web.alert.metric_hint\":\"監視する残高を選択します。\",\"web.alert.minutes\":\"分\",\"web.alert.permissions\":\"アラートの管理権限\",\"web.alert.query_only\":\"このプリセットでは、クォータの手動照会のみ利用できます。\",\"web.alert.quick_group\":\"チェック間隔のプリセット\",\"web.alert.quick_label\":\"プリセット：\",\"web.alert.recovery\":\"復旧しきい値（任意）\",\"web.alert.recovery_hint\":\"空欄の場合は自動で設定します。通知しきい値より大きい値を指定してください。\",\"web.alert.recovery_placeholder\":\"空欄で自動設定\",\"web.alert.repeat\":\"残高不足通知の繰り返し間隔（分）\",\"web.alert.repeat_hint\":\"0 で繰り返しなし。最大 4320 分です。\",\"web.alert.smart_hint\":\"AI による通知\",\"web.alert.smart_hint_help\":\"送信先会話のペルソナで通知全体を書き、数値はプログラムが挿入します。\",\"web.alert.targets\":\"送信先 UMO（1 行に 1 件）\",\"web.alert.targets_hint\":\"UMO を 1 行に 1 件入力してください。OneBot のグループでは @QQ 番号を追加できます。QQ 公式は OpenID を使用し、グループチャットには scene=qq_group、個人チャットには scene=qq_c2c を末尾に追加してください。チャンネルとチャンネル内のダイレクトメッセージの UMO は入力できません。\",\"web.alert.targets_title\":\"クォータアラートの送信先\",\"web.alert.threshold\":\"通知しきい値\",\"web.alert.threshold_hint\":\"残高がこの値以下になったときに通知します。\",\"web.alert.threshold_placeholder\":\"通知しきい値を入力\",\"web.alert.title\":\"クォータアラート\",\"web.common.cancel\":\"キャンセル\",\"web.common.choose\":\"選択してください\",\"web.common.off\":\"オフ\",\"web.common.on\":\"オン\",\"web.common.one_per_line\":\"1 行に 1 件\",\"web.common.time_unavailable\":\"時刻を取得できません\",\"web.credential.balance_key\":\"残高照会用 API キー\",\"web.credential.cancel_entry\":\"入力をキャンセル\",\"web.credential.clear\":\"認証情報を削除\",\"web.credential.clear_body\":\"「{account}」のこの認証情報または参照を削除します。アカウント設定は保持されます。再度照会するには認証情報を設定してください。\",\"web.credential.clear_title\":\"{credential}を削除しますか？\",\"web.credential.confirm_clear\":\"削除を確定\",\"web.credential.encrypted_status\":\"設定済み · 暗号化ストレージ\",\"web.credential.enter_new\":\"新しい認証情報を入力\",\"web.credential.environment_hint\":\"QUOTA_API_KEY などの環境変数名だけを入力してください。値は実行環境から取得します。\",\"web.credential.environment_name\":\"環境変数名\",\"web.credential.environment_status\":\"設定済み · 環境変数参照\",\"web.credential.eyebrow\":\"照会先へのアクセス\",\"web.credential.finish_settings\":\"認証情報を操作する前に、一般設定の変更を保存または破棄してください。\",\"web.credential.gateway_key\":\"サイトのモデル API キー\",\"web.credential.glm_plan\":\"GLM Coding Plan API キー\",\"web.credential.grsai_token\":\"Grsai リクエストトークン\",\"web.credential.legacy_field\":\"旧形式の認証情報（{field}）\",\"web.credential.minimax_plan\":\"MiniMax Token Plan キー\",\"web.credential.missing\":\"未設定\",\"web.credential.new_source\":\"新しい認証情報の取得元\",\"web.credential.new_value\":\"新しい認証情報\",\"web.credential.new_value_hint\":\"空欄の場合は既存の認証情報を保持します。送信後すぐに入力欄が消去されます。\",\"web.credential.openrouter_management\":\"OpenRouter 管理キー\",\"web.credential.optional_sts\":\"STS Security Token（任意）\",\"web.credential.replace\":\"認証情報を更新\",\"web.credential.save_account\":\"認証情報を設定する前に、新しいアカウントを保存してください。\",\"web.credential.save_new\":\"新しい認証情報を保存\",\"web.credential.saved_hint\":\"認証情報を保存しました。残高照会時に有効性を確認します。\",\"web.credential.separate\":\"認証情報は個別に保存されます。\",\"web.credential.status_unread\":\"状態未取得\",\"web.credential.title\":\"照会用の認証情報\",\"web.credential.use_environment\":\"環境変数を参照\",\"web.credential.venice_admin\":\"Venice 管理者 API キー\",\"web.credential.vercel_gateway\":\"Vercel AI Gateway API キー\",\"web.credential.xai_management\":\"xAI 管理キー\",\"web.detail.fixed_hint\":\"定型のアラートメッセージを使用しました。\",\"web.detail.legacy_target_unknown\":\"旧送信先に対応付けられない送信記録があり、結果は不明です。残高が回復した後、次に残高がしきい値以下になったときに QQ 公式の送信先へ通知します。\",\"web.detail.mention_invalid\":\"QQ メンションの形式が無効です。グループセッションと @QQ 番号を確認してください。\",\"web.detail.mention_unsupported\":\"送信先は QQ メンションに対応していません。末尾の @ 指定を削除するか、対応する QQ グループを指定してください。\",\"web.detail.message_components_unavailable\":\"メッセージのコンポーネントを組み立てられませんでした。ホストのコンポーネントとログを確認してください。\",\"web.detail.platform_not_found\":\"送信先のプラットフォームインスタンスが見つかりません。UMO 内のプラットフォームインスタンス ID を確認してください。\",\"web.detail.platform_unavailable\":\"送信先のプラットフォームインスタンスを利用できません。接続状態とホストログを確認してください。\",\"web.detail.platform_unsupported\":\"送信先のプラットフォームはこの自動送信方法に対応していません。対応する送信先を指定してください。\",\"web.detail.session_check_failed\":\"送信先セッションの状態を確認できませんでした。AstrBot のセッション設定とログを確認してください。\",\"web.detail.session_disabled\":\"送信先セッションが無効です。AstrBot で有効にしてください。\",\"web.detail.target_invalid\":\"送信先の形式が無効です。全体設定で UMO を確認してください。\",\"web.detail.target_scene_required\":\"QQ 公式の送信先にチャット種別がありません。全体設定で指定するか、送信先で /yql alert targets addhere を実行してください。\",\"web.detail.transport_unavailable\":\"ホストの自動送信 API を利用できません。AstrBot のバージョンとログを確認してください。\",\"web.detail.unknown\":\"停止理由を特定できません。全体設定の送信先、プラットフォームの接続状態、ホストのアラートログを確認してください。\",\"web.field.advanced_options\":\"詳細設定を表示\",\"web.field.aliases\":\"照会用の別名\",\"web.field.amount_path\":\"主残高のパス\",\"web.field.auth_mode\":\"認証方式\",\"web.field.auth_name\":\"認証パラメーター名\",\"web.field.balance_scope\":\"クレジットの範囲\",\"web.field.base_url\":\"サービスのアドレス\",\"web.field.cache_ttl_seconds\":\"成功した結果のキャッシュ時間（秒）\",\"web.field.display_name\":\"表示名\",\"web.field.enabled\":\"アカウントを有効にする\",\"web.field.expires_at_path\":\"有効期限のパス\",\"web.field.expiry_path\":\"旧形式の有効期限のパス\",\"web.field.failure_path\":\"業務処理失敗のパス\",\"web.field.failure_value\":\"業務処理失敗の値\",\"web.field.gateway_origin\":\"サイトのアドレス\",\"web.field.id\":\"アカウント ID\",\"web.field.json_body\":\"固定 JSON リクエスト本文\",\"web.field.kind\":\"残高の種類\",\"web.field.kind_path\":\"種類のパス\",\"web.field.method\":\"リクエストメソッド\",\"web.field.path\":\"API パス\",\"web.field.region\":\"接続リージョン\",\"web.field.remaining_path\":\"残量のパス\",\"web.field.service_profile\":\"サービスの種類\",\"web.field.status_path\":\"状態のパス\",\"web.field.status_values\":\"状態値のマッピング\",\"web.field.success_path\":\"業務処理成功のパス\",\"web.field.success_value\":\"業務処理成功の値\",\"web.field.team_id\":\"チーム ID\",\"web.field.timeout_seconds\":\"アカウントのタイムアウト（秒）\",\"web.field.total_path\":\"合計量のパス\",\"web.field.unit\":\"固定単位\",\"web.field.unit_path\":\"単位のパス\",\"web.field.url\":\"旧形式の完全な URL\",\"web.field.used_path\":\"使用量のパス\",\"web.global.allow_group_queries\":\"グループでの照会を許可\",\"web.global.command_admin_only\":\"残高照会コマンドを管理者に限定\",\"web.global.group_allowed_user_ids\":\"グループ照会のユーザー許可リスト\",\"web.global.max_concurrency\":\"最大同時照会数\",\"web.global.private_allowed_user_ids\":\"プライベートチャットの許可リスト\",\"web.global.timeout_seconds\":\"アカウントごとのタイムアウト（秒）\",\"web.global.total_timeout_seconds\":\"照会全体のタイムアウト（秒）\",\"web.hint.advanced_options\":\"汎用サービスの認証方式、メソッド、レスポンスマッピングを設定します。Grsai のアカウントのクレジットでは固定のプロトコルを使用し、旧マッピングは無視されます。\",\"web.hint.amount_path\":\"必須の JSON Pointer です。例は /data/remaining です。\",\"web.hint.auth_mode\":\"残高 API のドキュメントに従ってください。Grsai のアカウントのクレジットではこの項目を使わず、トークンを常に JSON 本文に入れます。\",\"web.hint.auth_name\":\"認証方式が「リクエストヘッダー」または「クエリパラメーター」の場合に使用します。\",\"web.hint.balance_scope\":\"アカウントのクレジットに対応しています。API キーのポイントは現在照会できません。\",\"web.hint.base_url\":\"API パスを含まない HTTPS のベース URL です。https://api.example.invalid は形式の例で、アクセスできません。\",\"web.hint.expiry_path\":\"旧形式の expires_at_path との互換用です。\",\"web.hint.gateway_origin\":\"サイトの HTTPS オリジンを入力してください。照会用の認証情報はそのサイトにのみ送信されます。\",\"web.hint.json_body\":\"汎用サービス専用です。テンプレートや認証情報は使えません。Grsai のアカウントのクレジットでは空欄にし、既存項目を切り替える際は元の本文を消去してください。\",\"web.hint.kind_path\":\"任意の JSON Pointer です。cash/quota/free_quota/subscription/credits/usage/custom を指定できます。\",\"web.hint.legacy_base_url\":\"HTTPS のベース URL です。API パスと組み合わせて使えます。\",\"web.hint.legacy_json_body\":\"ドキュメントに記載された読み取り専用の POST でのみ使用します。テンプレートや認証情報は使えません。\",\"web.hint.legacy_method\":\"GET、または副作用がないと確認済みの POST を使用してください。\",\"web.hint.meinianda_cache\":\"サイトでは 1 分に 1 回の照会を推奨しています。既定のキャッシュ時間は 60 秒です。\",\"web.hint.method\":\"汎用サービスではドキュメントに従ってください。Grsai のアカウントのクレジットでは POST に固定されます。既存項目を切り替える際は元の GET を消去してください。\",\"web.hint.path\":\"汎用サービスではドキュメントに従ってください。Grsai のアカウントのクレジットでは空欄にするか /client/openapi/getCredits を入力します。既存項目を切り替える際は元のパスを削除してください。/account/balance は入力例です。\",\"web.hint.private_allowlist\":\"aiocqhttp:123456 のような完全な「プラットフォーム名:ユーザー ID」を入力してください。管理者の登録は不要です。上の管理者限定設定は /yql の残高照会にも適用されます。\",\"web.hint.region\":\"中国と海外のどちらも組み込みの公式ノードを使用するため、サーバーアドレスの入力は不要です。\",\"web.hint.service_profile\":\"残高照会は各サービスの専用 API を使用します。新規 Grsai アカウントには Grsai テンプレートを選択してください。このテンプレートの既存項目はアカウントのクレジットのプリセットに切り替えられます。\",\"web.hint.status_values\":\"プロバイダーの状態値を available/unavailable/partial/unknown にマッピングします。\",\"web.hint.unit\":\"CNY/USD/JPY/credit/credits/tokens/requests/custom を指定できます。unit_path を設定する場合は必須です。\",\"web.hint.unit_path\":\"任意の JSON Pointer です。実行時の値は固定の unit と一致する必要があります。\",\"web.hint.url\":\"クエリ、認証情報、フラグメントを含まない完全な HTTPS URL です。\",\"web.language.auto\":\"AstrBot に合わせる\",\"web.language.en-US\":\"English\",\"web.language.ja-JP\":\"日本語\",\"web.language.zh-CN\":\"简体中文\",\"web.language.zh-TW\":\"繁體中文\",\"web.metric.AvailableAmount\":\"利用可能枠\",\"web.metric.AvailableCashAmount\":\"現金残高\",\"web.metric.CreditAmount\":\"与信枠\",\"web.metric.credit\":\"クレジット残高\",\"web.metric.granted_balance\":\"付与分の残高\",\"web.metric.mapped_balance\":\"マッピングで指定した残高\",\"web.metric.monitored\":\"監視対象の残高\",\"web.metric.site_credit\":\"サイト内クォータ\",\"web.metric.topped_up_balance\":\"チャージ残高\",\"web.metric.total_balance\":\"合計残高\",\"web.migration.accounts\":\"アカウント\",\"web.migration.cleanup_hint\":\"ホストの旧設定は移行成功後にのみ削除されます。移行元の設定が変わった場合は、再度プレビューしてください。\",\"web.migration.cleanup_pending\":\"移行は保存されましたが、ホストの旧設定項目が残っています。再度プレビューしてから削除を再試行してください。\",\"web.migration.confirm\":\"旧設定の移行を確認\",\"web.migration.confirm_body\":\"プレビューの {count} 件のアカウントを移行します。平文の認証情報は暗号化して保存し、プラグインの旧設定項目を削除します。認証情報の表示や他サービスへの送信は行いません。\",\"web.migration.confirm_title\":\"旧設定を移行しますか？\",\"web.migration.conflict\":\"暗号化ストレージの内容と異なる旧設定が見つかりました。現在のストレージも新たに見つかった旧設定も保持されます。取得元を手動で確認してください。\",\"web.migration.environment\":\"環境変数参照\",\"web.migration.execute\":\"移行を実行\",\"web.migration.lock_warning\":\"旧設定の移行が必要です。一般設定と認証情報の操作は一時的にロックされています。\",\"web.migration.no_pending\":\"移行待ちの旧設定はありません。\",\"web.migration.open\":\"移行画面を開く\",\"web.migration.overview\":\"旧プラグインの一般設定、認証情報、環境変数参照を専用の管理ストレージに移行します。認証情報は暗号化して保存し、このページには表示しません。\",\"web.migration.pending\":\"旧設定が見つかりました。新しい設定を保存する前に移行を完了してください。\",\"web.migration.plaintext\":\"暗号化する認証情報\",\"web.migration.preview\":\"移行をプレビュー\",\"web.migration.retry_cleanup\":\"旧設定項目の削除を再試行\",\"web.migration.scope\":\"今回の移行範囲\",\"web.migration.title\":\"旧設定の移行\",\"web.navigation.accounts\":\"アカウント管理\",\"web.navigation.back_to_accounts\":\"アカウント一覧に戻る\",\"web.navigation.global\":\"全体設定\",\"web.navigation.leave_action\":\"下書きを破棄して移動\",\"web.navigation.leave_body\":\"未保存の設定と入力した認証情報は消去されます。送信済みのリクエストは取り消せません。結果が不明な場合は再読み込みして確認してください。自動再試行は行いません。\",\"web.navigation.leave_title\":\"この設定画面から移動しますか？\",\"web.navigation.maintenance\":\"設定メンテナンス\",\"web.navigation.mobile\":\"モバイルナビゲーション\",\"web.navigation.primary\":\"メインナビゲーション\",\"web.navigation.reload\":\"状態を再読み込み\",\"web.navigation.reload_action\":\"下書きを破棄して再読み込み\",\"web.navigation.reload_body\":\"未保存の設定と入力した認証情報が消去されます。\",\"web.navigation.reload_title\":\"設定を再読み込みしますか？\",\"web.navigation.skip\":\"メインコンテンツに移動\",\"web.notice.alert_loading\":\"アラートの動作状態を取得中…\",\"web.notice.alert_read_failed\":\"アラートの動作状態を確認できませんでした。しばらくしてから再試行してください。\",\"web.notice.authorization_lost\":\"管理権限の有効期限が切れたため、下書きを消去しました。AstrBot のプラグイン管理から開き直してください。\",\"web.notice.authorization_reopen\":\"管理権限の有効期限が切れました。このページを開き直してください。\",\"web.notice.config_changed\":\"設定が変更されました。再読み込みしてください。\",\"web.notice.connecting\":\"ホストの管理セッションに接続中…\",\"web.notice.discarded\":\"未保存の下書きを破棄しました。\",\"web.notice.invalid_context\":\"ホストの管理コンテキストが無効です。AstrBot のプラグイン管理からこのページを開いてください。\",\"web.notice.invalid_environment\":\"有効な環境変数名を入力してください。変数の値は入力しないでください。\",\"web.notice.left_during_write\":\"前の設定画面から移動しました。送信済みのリクエストは取り消せません。再読み込みして結果を確認してください。\",\"web.notice.legacy_cleanup_incomplete\":\"設定を移行しましたが、ホストに旧項目が残っています。設定メンテナンスで再度プレビューし、削除を完了してください。\",\"web.notice.legacy_cleanup_retry\":\"移行は保存されました。元の旧設定項目の削除を再試行できます。\",\"web.notice.legacy_conflict\":\"旧設定と現在のストレージの内容が一致しません。どちらも保持されます。\",\"web.notice.legacy_not_pending\":\"移行待ちの旧設定はありません。\",\"web.notice.legacy_preview_ready\":\"移行のプレビューができました。実行前に以下の範囲を確認してください。\",\"web.notice.loaded\":\"最新の設定を読み込みました。\",\"web.notice.missing_credential\":\"新しい認証情報を入力してください。空欄にすると既存の認証情報が保持されます。\",\"web.notice.open_in_host\":\"AstrBot のプラグイン管理からこのページを開いてください。\",\"web.notice.read_failed\":\"設定状態を確認できませんでした。再読み込みするか、ホストから開き直してください。\",\"web.notice.reading\":\"最新の状態を読み込み中…\",\"web.notice.revision_conflict\":\"別のページで設定が変更されました。再読み込みして内容を確認してから再送信してください。自動再試行は行いません。\",\"web.notice.saved\":\"設定を保存し、最新の状態を確認しました。\",\"web.notice.saving\":\"送信中です。結果が出るまでお待ちください…\",\"web.notice.session_unavailable\":\"ホストの管理セッションを利用できません。このページを開き直してください。\",\"web.notice.unit_candidate_changed\":\"候補が変わったか、有効期限が切れました。再照会してから確定してください。\",\"web.notice.unit_candidates\":\"最新の候補を取得しました。内容を確認してから選択を確定してください。\",\"web.notice.unit_confirm_uncertain\":\"確定結果が不明です。単位の状態を更新してから操作してください。\",\"web.notice.unit_confirmed\":\"単位を確定しました。\",\"web.notice.unit_current\":\"最新の単位の状態を取得しました。確認済みの単位は引き続き有効です。\",\"web.notice.unit_no_candidates\":\"確認できる候補がありません。再照会の前に認証情報、API の設定、または再試行までの待機状態を確認してください。\",\"web.notice.unit_querying\":\"最新の単位を取得するために残高を照会中…\",\"web.notice.unit_read_failed\":\"単位を取得できませんでした。更新してください。\",\"web.notice.unit_unverified_candidates\":\"信頼できる新しい候補を取得できませんでした。認証情報、API、照会状態を確認してから再照会してください。\",\"web.notice.validation_failed\":\"送信内容の検証に失敗しました。項目と認証情報の種類を確認してください。機密入力は消去済みです。\",\"web.notice.write_uncertain\":\"送信結果を確認できませんでした。機密入力は消去済みです。そのまま再送信せず、再読み込みして状態を確認してください。\",\"web.option.auth.bearer\":\"Bearer トークン\",\"web.option.auth.header\":\"リクエストヘッダー\",\"web.option.auth.query\":\"クエリパラメーター\",\"web.option.profile.generic\":\"OpenAI 互換サービス／サードパーティーサービス\",\"web.option.region.cn\":\"中国（直接接続）\",\"web.option.region.overseas\":\"海外ノード\",\"web.option.scope.account\":\"アカウントのクレジット（プリセット対応）\",\"web.option.scope.api_key\":\"API キーのクレジット（現在は照会不可）\",\"web.option.scope.none\":\"クレジットの範囲を選択\",\"web.provider.alibaba_help\":\"Alibaba Cloud BSS の現金残高、利用可能枠、与信枠を照会します。\",\"web.provider.compatible_help\":\"プロバイダーのドキュメントに沿って、読み取り専用の残高 API を設定してください。\",\"web.provider.compatible_name\":\"その他の互換サービス\",\"web.provider.deepseek_help\":\"DeepSeek 公式の残高です。照会先と解析ルールは組み込み済みです。\",\"web.provider.glm_plan_help\":\"選択した地域の GLM Coding Plan キーで、各期間の使用率を照会します。\",\"web.provider.grsai_help\":\"Grsai のアカウントのクレジットにはリクエストトークンを使います。POST /client/openapi/getCredits に固定され、モデルの API キーは使いません。\",\"web.provider.legacy_name\":\"旧形式の汎用アカウント\",\"web.provider.meinianda_help\":\"Meinianda アカウントのサイト内クォータを照会します。キャッシュは 60 秒以上を推奨します。\",\"web.provider.minimax_plan_help\":\"選択した地域の Token Plan キーで、モデルグループごとの期間クォータと週間クォータを照会します。\",\"web.provider.moonshot_help\":\"選択した地域の Moonshot アカウントの利用可能残高、現金残高、特典残高を照会します。\",\"web.provider.new_api_help\":\"New API のモデルキーと、そのキーが参照できるアカウントのクォータを照会します。サイトのクォータポイントをそのまま表示します。\",\"web.provider.novita_help\":\"Novita AI の利用可能残高、現金残高、与信限度額、未払い請求額を照会します。\",\"web.provider.openrouter_help\":\"管理キーを使って OpenRouter の購入済みクレジットから使用済みクレジットを差し引きます。\",\"web.provider.pollinations_help\":\"account:usage 権限を持つキーで、アカウントの Pollen を照会します。凍結中の枠は別に表示します。\",\"web.provider.stepfun_help\":\"選択した地域の StepFun アカウントを照会します。入金総額と特典総額は別々に表示します。\",\"web.provider.sub2api_help\":\"Sub2API のモデルキーでサイトのウォレット残高、またはキーに明示されたクォータを照会します。\",\"web.provider.venice_help\":\"管理者 API キーで Venice を照会します。米ドル残高、DIEM、各種クレジットを別々に表示します。\",\"web.provider.vercel_gateway_help\":\"AI Gateway 専用のキーで、チームの米ドル残高と累計使用額を照会します。\",\"web.provider.xai_help\":\"チームの管理キーを使用し、xAI の計上済み前払い残高を照会します。\",\"web.runtime.last_checked\":\"前回のチェック：\",\"web.runtime.last_sent\":\"前回の送信試行：\",\"web.runtime.loading\":\"読み込み中…\",\"web.runtime.no_account_record\":\"このアカウントの動作履歴はまだありません。\",\"web.runtime.refresh\":\"アラート状態を更新\",\"web.runtime.running\":\"チェックタスクが動作中です。設定が完了し、個別にアラートを有効にしたアカウントが対象です。\",\"web.runtime.stopped\":\"チェックタスクは停止中です。\",\"web.runtime.storage_unavailable\":\"アラートの状態を保存できないため、アラートは動作していません。\",\"web.runtime.title\":\"動作状態\",\"web.runtime.unknown_status\":\"状態が更新されました。詳細はアラートコマンドで確認してください。\",\"web.settings.access_eyebrow\":\"照会権限\",\"web.settings.access_title\":\"アクセス権限\",\"web.settings.account_alerts\":\"アラートはアカウントごとに有効にできます。\",\"web.settings.admin_access\":\"このページを設定できるのは AstrBot 管理者のみです。照会権限では管理画面にアクセスできません。\",\"web.settings.admin_allowlist\":\"管理者はプライベートチャットの許可リストに登録する必要はありません。\",\"web.settings.appearance\":\"言語設定\",\"web.settings.applies_after_save\":\"保存後に適用されます。\",\"web.settings.command_access\":\"管理者のみの設定は /yql の残高照会に適用されます。アラートコマンドには別の権限ルールがあります。\",\"web.settings.discard\":\"変更を破棄\",\"web.settings.group_access\":\"グループで照会するには、グループ照会を有効にし、ユーザー許可リストの条件を満たす必要があります。\",\"web.settings.language\":\"プラグインの言語\",\"web.settings.language_hint\":\"保存後に適用されます。自動設定では AstrBot が提供する言語を使います。定期アラートなどで利用できる言語情報がない場合は、簡体字中国語を使います。\",\"web.settings.private_format\":\"プライベートチャットの許可リストには「プラットフォーム名:ユーザー ID」の形式を使います。\",\"web.settings.query_access\":\"照会権限\",\"web.settings.query_and_cache\":\"照会とキャッシュ\",\"web.settings.save\":\"設定を保存\",\"web.settings.save_first\":\"先に設定を保存してください。\",\"web.settings.separate_credentials\":\"一般設定と認証情報は別々に保存されます\",\"web.settings.unsaved\":\"未保存の変更があります\",\"web.shell.auth_required\":\"ホストの管理権限が必要です\",\"web.shell.brand_author\":\"如月怜の\",\"web.shell.brand_name\":\"クォータリンク\",\"web.shell.eyebrow\":\"YOMIHIME QUOTA LINK / 管理\",\"web.shell.loading_config\":\"設定を読み込み中\",\"web.shell.open_from_host\":\"AstrBot にログインし、プラグインの詳細ページから「クォータ照会」を開いてください。\",\"web.shell.page_title\":\"クォータ照会\",\"web.shell.project_name\":\"如月怜のクォータリンク\",\"web.shell.revision\":\"設定リビジョン {revision}\",\"web.shell.scope\":\"照会を一元化 · 認証情報は個別管理\",\"web.shell.waiting\":\"管理セッションを待機中\",\"web.status.accepted\":\"送信リクエストが受理されました。到達は未確認です。\",\"web.status.auth_paused\":\"認証情報が拒否されたため、チェックを一時停止しました。\",\"web.status.blocked\":\"アラートの送信は停止中です。下記の理由を確認してください。\",\"web.status.disabled\":\"アラートは無効です\",\"web.status.error\":\"チェックに失敗しました。前回のアラート状態を保持します。\",\"web.status.failed\":\"送信に失敗しました\",\"web.status.incomplete\":\"設定が不完全なため、監視は開始されていません。\",\"web.status.low\":\"残高がしきい値以下のため、アラートが継続しています。\",\"web.status.monitoring\":\"残高を監視中\",\"web.status.normal\":\"残高はしきい値を上回っています\",\"web.status.paused\":\"認証または権限の確認に失敗しました。設定を修正するか、手動で再試行するとチェックが再開されます。\",\"web.status.pending\":\"チェック待ち\",\"web.status.pending_send\":\"通知の集約待ち\",\"web.status.recovered\":\"残高は回復しました\",\"web.status.recovering\":\"残高は上昇しましたが、復旧しきい値には達していません\",\"web.status.stale\":\"結果の期限切れ、または指標や単位が一致しないため、アラート判定には使用しません。\",\"web.status.storage_unavailable\":\"アラートの状態を保存できないため、アラートは動作していません。\",\"web.status.submitted\":\"プラットフォームに送信しました。最終到達は未確認です。\",\"web.status.unit_changed\":\"監視項目または単位が変わりました。確認してください。\",\"web.status.unit_unidentified\":\"単位の検出待ち\",\"web.status.units_ambiguous\":\"複数の候補単位があります\",\"web.status.unknown\":\"送信結果が不明です。再試行前に確認してください。\",\"web.status.waiting\":\"次回のチェック待ち\",\"web.status.waiting_budget\":\"同じ送信先への送信間隔（300 秒／5 分以上）を待機中です。次回以降の有効なチェック時に再試行します。\",\"web.storage.eyebrow\":\"ローカル暗号化\",\"web.storage.key_handling\":\"マスターキーは実行環境が管理します。このページから入力、エクスポート、復元はできません。\",\"web.storage.ready\":\"暗号化ストレージは使用可能です\",\"web.storage.title\":\"ストレージのセキュリティ\",\"web.storage.troubleshooting\":\"ストレージに問題が発生した場合は、ホストログのセキュリティエラーコードを確認してください。公開ログやスクリーンショットにキーを含めないでください。\",\"web.storage.unavailable\":\"暗号化ストレージを利用できません\",\"web.storage.unavailable_warning\":\"暗号化ストレージを利用できません。新しい認証情報を保存する前に実行環境を確認してください。平文での保存は行いません。\",\"web.unit.ambiguous\":\"複数の単位が検出されました。選択してください。\",\"web.unit.awaiting\":\"取得待ち\",\"web.unit.candidates_stale\":\"照会候補の有効期限が切れました。再照会してください。確認済みの単位は保持されます。\",\"web.unit.changed\":\"照会結果の単位が変わりました。再確認してください。\",\"web.unit.choices_expired\":\"候補の有効期限が切れました。再照会してから選択してください。\",\"web.unit.choose\":\"単位を選択\",\"web.unit.confirm\":\"単位を確認\",\"web.unit.confirm_no_threshold\":\"単位を {unit} に変更しますか？しきい値はまだ設定されていません。\",\"web.unit.confirm_observed\":\"照会結果の単位を確認してください。\",\"web.unit.confirm_threshold\":\"単位を {unit} に変更し、しきい値 {threshold} と比較しますか？\",\"web.unit.confirm_title\":\"単位を {unit} に確定しますか？\",\"web.unit.current\":\"単位：{unit}\",\"web.unit.detect_on_account_save\":\"アカウントを保存すると単位が自動で検出されます。\",\"web.unit.detect_on_query\":\"残高を照会すると単位が自動で検出されます。\",\"web.unit.detect_on_save\":\"設定を保存すると単位が再検出されます。\",\"web.unit.finish_credential_before_query\":\"認証情報の入力を完了またはキャンセルしてから再照会してください。\",\"web.unit.loading\":\"処理中…\",\"web.unit.metric_changed\":\"監視項目が「{previous}」から「{current}」に変わりました。単位としきい値を再確認してください。\",\"web.unit.metric_edited\":\"監視項目を「{metric}」に変更しました。保存して再照会し、単位を確認してください。\",\"web.unit.metric_or_unit_changed\":\"監視項目または単位が変わりました。再確認してください。\",\"web.unit.no_choices\":\"確認できる候補がありません。再照会してから選択してください。\",\"web.unit.query\":\"単位を再照会\",\"web.unit.query_changed\":\"照会先のアカウントまたは API が変わりました。単位としきい値を再確認してください。\",\"web.unit.query_edited\":\"照会設定が変わりました。保存すると単位が再検出されます。\",\"web.unit.query_hint\":\"アカウントの残高 API に問い合わせて候補を取得します。アラートは送信されません。\",\"web.unit.read\":\"単位の状態を取得\",\"web.unit.recorded\":\"単位の記録日時：\",\"web.unit.save_before_query\":\"設定を保存すると単位を再照会できます。\",\"web.unit.title\":\"アラートの単位\",\"web.unit.verified\":\"単位を確認済みです。\",\"web.unit.verified_expired\":\"単位は確認済みです。照会候補の有効期限は切れていますが、確認済みの単位は有効です。\",\"web.validation.account_alert\":\"{account}：{message}\",\"web.validation.account_bounds\":\"アカウントのタイムアウトは最大 120 秒、キャッシュは最大 86400 秒です。\",\"web.validation.account_id\":\"アカウント ID は必須で、重複できません。\",\"web.validation.account_name\":\"アカウントの表示名を入力してください。\",\"web.validation.account_positive\":\"アカウントのタイムアウトとキャッシュ時間は正の数で指定してください。\",\"web.validation.alert_fields\":\"アラート設定の項目が無効です。\",\"web.validation.alert_prerequisites\":\"アラートを有効にする前に、アカウントを有効にし、しきい値を入力して、全体設定に送信先を 1 件以上追加してください。\",\"web.validation.decimal_length\":\"整数部は最大 30 桁、小数部は最大 18 桁です。指数表記は使えません。\",\"web.validation.duplicate_umo\":\"UMO が重複しています。1 行にまとめてください。\",\"web.validation.finite_decimal\":\"指数表記を使わず、有限の十進数を入力してください。\",\"web.validation.global_bounds\":\"全体設定が許容範囲を超えています。\",\"web.validation.group_mentions\":\"数値 ID の QQ グループセッションだけが @QQ 番号に対応しています。個別チャットやその他のセッションからは末尾の @ 指定を削除してください。\",\"web.validation.id_limit\":\"QQ 番号は最大 {limit} 件です。\",\"web.validation.interval_input\":\"1～4320 の整数を入力してください。入力値は自動補正されません。\",\"web.validation.interval_range\":\"チェック間隔は 1～4320 分の整数で指定してください。\",\"web.validation.invalid_input\":\"入力内容を確認してください。\",\"web.validation.invisible_chars\":\"制御文字と不可視文字は使用できません。\",\"web.validation.json_object\":\"認証情報を含まない有効な JSON オブジェクトを入力してください。\",\"web.validation.language\":\"対応するプラグインの言語を選択してください。\",\"web.validation.llm_fields\":\"AI メッセージの設定が無効です。\",\"web.validation.llm_ids\":\"モデルとペルソナの ID は 128 文字以内のテキストで指定してください。\",\"web.validation.llm_switch\":\"AI メッセージの有効・無効の設定が無効です。\",\"web.validation.mentions_suffix\":\"UMO の後にスペースで区切った @QQ 番号を入力するか、QQ 公式の場合は scene=qq_group または scene=qq_c2c を指定してください。\",\"web.validation.metric\":\"このプロバイダーが対応する指標を選択してください。\",\"web.validation.private_allowlist\":\"プライベートチャットの許可リストには「プラットフォーム名:ユーザー ID」を使用してください。\",\"web.validation.qq_id\":\"QQ 番号は 1～20 桁の ASCII 数字で、正の整数を入力してください。@all、ニックネーム、CQ コードは使えません。\",\"web.validation.query_parameters\":\"有効な照会パラメーターを入力してください。\",\"web.validation.recovery_order\":\"復旧しきい値は通知しきい値より大きい値を指定してください。\",\"web.validation.repeat_input\":\"0～4320 の整数（分）を入力してください。\",\"web.validation.repeat_range\":\"繰り返し間隔は 0～4320 分の整数で指定してください。0 で繰り返しなしになります。\",\"web.validation.target_fields\":\"各送信先に UMO とメンションのリストが必要です。\",\"web.validation.target_limit\":\"アラートの送信先は最大 20 件です。\",\"web.validation.target_line\":\"{line} 行目：{message}\",\"web.validation.targets_text\":\"アラートの送信先を入力してください。\",\"web.validation.umo_format\":\"完全な UMO を「プラットフォームインスタンス:メッセージ種別:セッション ID」の形式で入力してください。\",\"web.validation.umo_invisible\":\"UMO に制御文字や不可視文字は使用できません。\",\"web.validation.umo_type\":\"メッセージ種別には FriendMessage、GroupMessage、OtherMessage のいずれかを指定してください。\",\"web.validation.unit\":\"単位を 32 文字以内で指定してください。\"}"),
	metadata: {
		display_name: "如月怜のクォータリンク",
		short_desc: "複数の AI API の残高と使用量を監視",
		desc: "AI API の残高、使用量、クォータを照会できます。アカウントの管理とアラートの設定はプラグインのページから行えます。"
	},
	config: { enable_admin_page: {
		description: "プラグインの管理ページを有効にする",
		hint: "アカウント、認証情報、照会権限、タイムアウトはプラグインのページで設定します。旧設定は移行の確認用に保持され、自動では削除されません。"
	} }
}, r = {
	views: { "00-quota-link": { title: "Quota Query" } },
	pages: { "00-quota-link": { title: "Quota Query" } },
	strings: /* @__PURE__ */ JSON.parse("{\"alert.account_missing\":\"The alert account was not found.\",\"alert.account_unqueryable\":\"The account cannot be queried yet. Check that it is enabled and verify its query settings.\",\"alert.admins.count\":\"QQ users: {count} · Private chats only\",\"alert.admins.host_admin_note\":\"AstrBot administrators can also manage alerts.\",\"alert.admins.permissions\":\"Administrative permissions\",\"alert.admins.qq_list\":\"QQ allowlist\",\"alert.admins.separate_permissions\":\"Query and alert delivery permissions are configured separately.\",\"alert.admins.title\":\"QQ alert administrator allowlist\",\"alert.command.account_candidate_required\":\"Specify an account and a candidate ID.\",\"alert.command.account_not_unique\":\"The account is missing or the name is ambiguous. Use the account ID shown on the management page.\",\"alert.command.account_required\":\"Specify an account.\",\"alert.command.admin_required\":\"To manage quota alerts, you must be on the QQ allowlist or be an AstrBot administrator.\",\"alert.command.extra_arguments\":\"This alert command takes no additional arguments.\",\"alert.command.help_syntax\":\"Usage: /yql alert help [account|units|targets].\",\"alert.command.interval_range\":\"The interval must be a whole number of minutes within the allowed range.\",\"alert.command.invalid_arguments\":\"Invalid alert command arguments. Use /yql alert help in a private chat.\",\"alert.command.invalid_target_arguments\":\"Invalid target command arguments.\",\"alert.command.latest_candidate_required\":\"Select a current unit candidate ID.\",\"alert.command.mention_syntax\":\"Use @QQnumber for mentions. Nicknames, @all, and CQ codes are unsupported.\",\"alert.command.parameters_required\":\"Specify an account and the required arguments.\",\"alert.command.private_help\":\"For detailed alert configuration, use /yql alert help in a private chat with the bot.\",\"alert.command.private_status\":\"Detailed alert status and delivery targets are visible only in a private chat. Run this command in a private chat with the bot.\",\"alert.command.qq_not_allowlisted\":\"That QQ number is not on the alert management allowlist.\",\"alert.command.resumed\":\"Checks resumed.\",\"alert.command.save_failed\":\"Alert settings could not be saved. Check usage in a private chat or correct the settings on the management page.\",\"alert.command.saved\":\"Alert settings saved.\",\"alert.command.saved_private\":\"Alert settings saved. View details in a private chat.\",\"alert.command.target_missing\":\"Target ID not found. Use targets list in a private chat.\",\"alert.command.targets_syntax\":\"Use targets list/add/addhere/remove.\",\"alert.command.unsupported_official_scene\":\"This conversation is outside the supported official QQ group and private chats. Channel chats and channel direct messages cannot be added.\",\"alert.command.threshold_syntax\":\"Usage: threshold \\\"account name\\\" amount [metric_ID].\",\"alert.command.too_long\":\"The alert command is too long.\",\"alert.command.unclosed_quote\":\"Unmatched quotation mark. Use double quotes around account names that contain spaces.\",\"alert.command.unit_confirmed\":\"Unit confirmed.\",\"alert.command.unknown\":\"Unknown alert command. Use /yql alert help for usage.\",\"alert.command.untrusted_session\":\"The host did not supply a trusted current session. The target could not be saved.\",\"alert.command.value_required\":\"Specify an account and a value.\",\"alert.delivery.budget\":\"Settings changed or the delivery budget is temporarily unavailable\",\"alert.delivery.cancelled\":\"Settings changed or alerts were stopped\",\"alert.delivery.failed\":\"The platform did not accept the send. Retry after the cooldown\",\"alert.delivery.fixed_hint\":\"The session AI was unavailable or its output did not pass validation. Used the standard notice\",\"alert.delivery.llm_changed\":\"The session model or persona changed. Used the standard notice\",\"alert.delivery.llm_config_unavailable\":\"Session AI settings were unavailable. Used the standard notice\",\"alert.delivery.llm_failed\":\"The AI notice could not be generated or did not pass validation. Used the standard notice\",\"alert.delivery.llm_locale_changed\":\"The language changed while generating the notice, so the standard message was used\",\"alert.delivery.llm_model_unavailable\":\"The session model was unavailable. Used the standard notice\",\"alert.delivery.llm_nonlocal\":\"The current executor does not support this persona notice call. Used the standard notice\",\"alert.delivery.llm_not_called\":\"The target session is disabled or unavailable. Skipped the AI call\",\"alert.delivery.llm_off\":\"Session AI is disabled. Used the standard notice\",\"alert.delivery.llm_persona_unavailable\":\"The session persona was unavailable. Used the standard notice\",\"alert.delivery.llm_session_unavailable\":\"The target session is disabled or unavailable. Omitted the AI notice\",\"alert.delivery.llm_unavailable\":\"Session AI is disabled or unavailable. Used the standard notice\",\"alert.delivery.llm_webchat_persona\":\"The session uses a dedicated WebChat persona. Used the standard notice\",\"alert.delivery.legacy_target_unknown\":\"A legacy send record could not be matched to the destination, so its outcome is unknown. Official QQ alerts resume after the balance recovers and then falls to or below the threshold again\",\"alert.delivery.mention_invalid\":\"Invalid group target or QQ mention format. Check the group identifier and numeric QQ numbers\",\"alert.delivery.mention_unsupported\":\"The adapter or session type does not support QQ mentions. Remove @ mentions or use an aiocqhttp group\",\"alert.delivery.message_components_unavailable\":\"Could not build message components. Check the AstrBot message component API\",\"alert.delivery.note_suffix\":\". {note}\",\"alert.delivery.platform_not_found\":\"Target platform instance not found. Check the platform instance ID in the UMO\",\"alert.delivery.platform_unavailable\":\"The target platform instance is unavailable. Check whether the adapter is running\",\"alert.delivery.platform_unsupported\":\"The target platform does not support this proactive messaging API. Choose a supported platform\",\"alert.delivery.session_check_failed\":\"Could not verify the target session status. Check the AstrBot session status API\",\"alert.delivery.session_disabled\":\"The target session is disabled. Enable it in AstrBot and wait for the next check\",\"alert.delivery.submitted\":\"Submitted to the platform. Check the platform for final delivery\",\"alert.delivery.target_invalid\":\"Invalid target UMO format. Select the session again or enter its full identifier\",\"alert.delivery.target_scene_required\":\"The official QQ destination is missing its chat type. Specify it in Global settings or run /yql alert targets addhere in the destination chat\",\"alert.delivery.transport_unavailable\":\"The host messaging API is unavailable. Check the AstrBot version and platform adapter\",\"alert.delivery.unknown\":\"Delivery result unknown. Automatic retries are disabled to prevent duplicates\",\"alert.fact.line\":\"{name}: {balance}\",\"alert.fact.title\":\"[Quota alert]\",\"alert.help.account_heading\":\"Account alerts\",\"alert.help.account_rules\":\"Account rules\",\"alert.help.account_title\":\"Account alert rules\",\"alert.help.admin_note\":\"Users on the QQ alert allowlist and AstrBot administrators can manage alerts. View detailed status and lists in a private chat.\",\"alert.help.admins\":\"QQ alert allowlist\",\"alert.help.admins_command\":\"/yql alert admins list|add QQ_number|remove QQ_number\",\"alert.help.admins_short\":\"Manage allowlist\",\"alert.help.bind\":\"Confirm unit\",\"alert.help.bind_command\":\"/yql alert bind \\\"account name\\\" candidate_ID\",\"alert.help.common_actions\":\"Common actions\",\"alert.help.confirm_note\":\"Check the unit before confirming. Confirmation keeps the threshold value as entered.\",\"alert.help.delivery_permissions\":\"Delivery and permissions\",\"alert.help.interval\":\"Check interval (minutes)\",\"alert.help.interval_command\":\"/yql alert interval \\\"account name\\\" 15\",\"alert.help.interval_note\":\"Intervals use minutes. Set the repeat interval to 0 to disable repeat alerts.\",\"alert.help.interval_short\":\"Check interval\",\"alert.help.llm\":\"AI notices\",\"alert.help.manage_note\":\"Users on the QQ alert allowlist and AstrBot administrators can manage alerts.\",\"alert.help.more_settings\":\"More settings\",\"alert.help.persona_note\":\"AI notices use the target session's persona.\",\"alert.help.prefix\":\"Command prefix: /yql alert\",\"alert.help.private_notice\":\"Admins only · View details in a private chat\",\"alert.help.recipients_note\":\"Verify recipients and group members first. Saving does not immediately send an alert.\",\"alert.help.recovery\":\"Recovery threshold\",\"alert.help.recovery_command\":\"/yql alert recovery \\\"account name\\\" 12|auto\",\"alert.help.refresh_note\":\"Viewing candidates is read-only. Use refresh to query the balance again.\",\"alert.help.repeat\":\"Repeat interval (0 disables repeats)\",\"alert.help.repeat_command\":\"/yql alert repeat \\\"account name\\\" 0\",\"alert.help.repeat_short\":\"Repeat interval\",\"alert.help.retry\":\"Resume checks after an authentication pause\",\"alert.help.retry_command\":\"/yql alert retry \\\"account name\\\"\",\"alert.help.retry_short\":\"Resume checks\",\"alert.help.return\":\"Back to overview: /yql alert help\",\"alert.help.set_threshold\":\"Set threshold\",\"alert.help.status\":\"Alert status\",\"alert.help.targets_add\":\"Add a specific session\",\"alert.help.targets_add_short\":\"Specific session\",\"alert.help.targets_heading\":\"Targets and permissions\",\"alert.help.targets_here\":\"Add current session\",\"alert.help.targets_here_short\":\"Current session\",\"alert.help.targets_list\":\"View targets\",\"alert.help.targets_remove\":\"Remove a target\",\"alert.help.targets_remove_command\":\"/yql alert targets remove target_ID\",\"alert.help.targets_title\":\"Delivery and administration\",\"alert.help.threshold_command\":\"/yql alert threshold \\\"account name\\\" 10 [metric_ID]\",\"alert.help.threshold_note\":\"An alert triggers when the balance is at or below the trigger threshold. See help units to confirm the unit.\",\"alert.help.threshold_quick_command\":\"threshold \\\"account name\\\" 10\",\"alert.help.title\":\"Quota alert management\",\"alert.help.toggle\":\"Enable or disable\",\"alert.help.toggle_command\":\"/yql alert on|off \\\"account name\\\"\",\"alert.help.toggle_quick_command\":\"on|off \\\"account name\\\"\",\"alert.help.toggle_short\":\"On / Off\",\"alert.help.trigger\":\"Trigger threshold\",\"alert.help.unit_confirmation\":\"Unit confirmation\",\"alert.help.unit_note\":\"Units are detected automatically. Thresholds use the current unit, and AI notices use the target session's persona.\",\"alert.help.units_read\":\"Unit candidates (read only)\",\"alert.help.units_read_command\":\"/yql alert units \\\"account name\\\"\",\"alert.help.units_read_short\":\"View candidates\",\"alert.help.units_refresh\":\"Refresh unit candidates\",\"alert.help.units_refresh_command\":\"/yql alert units \\\"account name\\\" refresh\",\"alert.help.units_refresh_short\":\"Refresh candidates\",\"alert.help.units_title\":\"Detect and confirm units\",\"alert.help.view_status\":\"View status\",\"alert.invalid_unit\":\"The unit choice is invalid or the alert runtime state changed. Refresh and try again.\",\"alert.metric.available\":\"Available quota\",\"alert.metric.available_cash\":\"Cash balance\",\"alert.metric.credit\":\"Credit balance\",\"alert.metric.credit_amount\":\"Credit limit\",\"alert.metric.granted\":\"Granted balance\",\"alert.metric.mapped\":\"Mapped balance\",\"alert.metric.site_credit\":\"Site quota\",\"alert.metric.topped_up\":\"Top-up balance\",\"alert.metric.total\":\"Total balance\",\"alert.metric_changed\":\"The monitored metric changed. Confirm the threshold and unit\",\"alert.no_metric_unit\":\"No valid unit was found for the current metric. Check the query result and metric, then try again.\",\"alert.no_unit\":\"No valid unit was found. Check the query status and try again later.\",\"alert.query_identity_changed\":\"The account query settings changed. Confirm the threshold and unit again\",\"alert.receipt.result\":\"Result\",\"alert.receipt.title\":\"Action completed\",\"alert.runtime_changed\":\"The alert runtime state changed. Refresh and try again.\",\"alert.state.blocked\":\"Alert configuration is incomplete or the destination is unavailable\",\"alert.state.disabled\":\"Alerts are off\",\"alert.state.error\":\"The query failed. The alert state was kept and the balance was not treated as zero\",\"alert.state.failed\":\"The platform did not accept the send request. Try again after the cooldown.\",\"alert.state.low\":\"Balance is at or below the threshold. Waiting until the next send is allowed or the destination is available again.\",\"alert.state.monitoring\":\"Monitoring. No alert has been triggered\",\"alert.state.paused\":\"Authentication or permission check failed. Fix the configuration or retry manually to resume checks\",\"alert.state.recovered\":\"Balance reached the recovery threshold. Waiting for the next low-balance event.\",\"alert.state.recovering\":\"Balance has risen but remains below the recovery threshold.\",\"alert.state.stale\":\"No fresh balance data matched the metric and unit. The previous state was kept.\",\"alert.state.storage_unavailable\":\"Alert state storage is unavailable. Alert checks and delivery have stopped.\",\"alert.state.submitted\":\"Submitted to the platform. Delivery is unconfirmed\",\"alert.state.unit_changed\":\"The monitored metric, unit, or account query settings changed. Confirm before continuing.\",\"alert.state.unit_unidentified\":\"Waiting for a valid query to identify the balance unit\",\"alert.state.units_ambiguous\":\"Multiple or duplicate units were found. Confirm which unit to use.\",\"alert.state.unknown\":\"The delivery result is unknown. The system will not retry automatically to avoid duplicate messages.\",\"alert.state.waiting\":\"Waiting for the next check\",\"alert.state.waiting_budget\":\"Messages to the same destination must be at least 300 seconds apart. Waiting for the next valid check.\",\"alert.status.account_count\":\"Accounts: {count} · Local activity records\",\"alert.status.account_id\":\"Account ID\",\"alert.status.blocked\":\"Check configuration\",\"alert.status.delivery_note\":\"Local records · Check the platform records for final delivery.\",\"alert.status.empty\":\"There are no alert check records to display.\",\"alert.status.empty_heading\":\"No account status\",\"alert.status.failed\":\"Send not accepted\",\"alert.status.last_checked\":\"Last checked\",\"alert.status.last_sent\":\"Last submitted to platform\",\"alert.status.low\":\"Low quota\",\"alert.status.monitoring\":\"Monitoring\",\"alert.status.no_record\":\"No record\",\"alert.status.paused\":\"Checks paused\",\"alert.status.recovered\":\"Recovered\",\"alert.status.recovering\":\"Quota recovering\",\"alert.status.running\":\"Checks are running\",\"alert.status.scheduler\":\"{task} · Status storage: {storage}\",\"alert.status.stale\":\"Waiting for a valid balance\",\"alert.status.stopped\":\"Checks are stopped\",\"alert.status.storage_unavailable\":\"Storage unavailable\",\"alert.status.submitted\":\"Submitted to platform\",\"alert.status.title\":\"Quota alert status\",\"alert.status.unit_changed\":\"Confirmation required again\",\"alert.status.unit_unidentified\":\"Waiting for unit detection\",\"alert.status.units_ambiguous\":\"Unit confirmation pending\",\"alert.status.unknown\":\"Delivery result unknown\",\"alert.status.waiting\":\"Waiting for a check\",\"alert.status.waiting_budget\":\"Waiting for delivery interval\",\"alert.targets.add_note\":\"Use targets add or targets addhere to add verified destinations. When entering an official QQ destination by hand, append scene=qq_group for groups or scene=qq_c2c for private chats after the UMO.\",\"alert.targets.count\":\"Destinations: {count} · Private chats only\",\"alert.targets.empty\":\"No alert targets configured\",\"alert.targets.item\":\"Destination {index} · {key}\",\"alert.targets.mentions\":\"Group mentions\",\"alert.targets.remove_command\":\"Remove command\",\"alert.targets.save_note\":\"Admins should verify recipients and group members before configuring targets. Saving updates the local targets only.\",\"alert.targets.title\":\"Quota alert destinations\",\"alert.targets.umo\":\"Session UMO\",\"alert.unit_changed\":\"The query unit changed. Confirm the threshold and unit again\",\"alert.unit_expired\":\"The unit choice expired or no longer matches. Query the balance, then refresh the unit choices.\",\"alert.units.ambiguous\":\"Multiple units to confirm\",\"alert.units.auto_detect_note\":\"Units are detected automatically after a balance query.\",\"alert.units.bind_command\":\"Confirm with /yql alert bind \\\"account name\\\" candidate_ID\",\"alert.units.binding_valid_note\":\"An existing valid binding remains active after its candidates expire.\",\"alert.units.bound_metric\":\"Bound metric\",\"alert.units.candidate\":\"Candidate {index} · {unit}\",\"alert.units.candidate_id\":\"Candidate ID\",\"alert.units.candidate_updated\":\"Candidates updated\",\"alert.units.candidates_empty\":\"No candidates to confirm\",\"alert.units.candidates_expired\":\"Candidates expired\",\"alert.units.change_reason\":\"Reason for change\",\"alert.units.current_and_bound\":\"Current / bound metric\",\"alert.units.current_metric\":\"Current metric\",\"alert.units.current_unit\":\"Current unit\",\"alert.units.identity_changed\":\"The query identity has changed. Confirm again\",\"alert.units.last_verified\":\"Last verified\",\"alert.units.metric\":\"Metric\",\"alert.units.metric_changed\":\"The metric has changed. Confirm again\",\"alert.units.metric_unknown\":\"Pending detection\",\"alert.units.not_bound\":\"Unbound\",\"alert.units.pending_query\":\"Pending retrieval\",\"alert.units.readonly\":\"Existing query results · Read-only status\",\"alert.units.readonly_note\":\"This list uses existing query results. Expired candidates can be refreshed manually.\",\"alert.units.refresh_command\":\"Use /yql alert units \\\"account name\\\" refresh to refresh candidates explicitly.\",\"alert.units.refreshed\":\"Refresh requested · Latest local status\",\"alert.units.refreshed_note\":\"The account balance was refreshed on request.\",\"alert.units.stale\":\"Unit verification expired\",\"alert.units.threshold_note\":\"Check what the threshold means before confirming. Confirmation keeps its existing numeric value.\",\"alert.units.title\":\"Alert units and candidates\",\"alert.units.unit_changed\":\"The unit has changed. Confirm again\",\"alert.units.verified\":\"Unit verified\",\"balance.expiry\":\"Expiry\",\"balance.expiry_date\":\"Expires {time}\",\"balance.item_expiry\":\"{label} expiry\",\"balance.item_note\":\"{label} notes\",\"balance.kind.cash\":\"Cash balance\",\"balance.kind.credits\":\"Credits\",\"balance.kind.custom\":\"Custom item\",\"balance.kind.free_quota\":\"Free quota\",\"balance.kind.quota\":\"Quota\",\"balance.kind.subscription\":\"Plan\",\"balance.kind.usage\":\"Usage\",\"balance.remaining\":\"Remaining\",\"balance.remaining_amount\":\"Remaining {amount}\",\"balance.semantics\":\"Meaning: {meaning}\",\"balance.site_credit_meaning\":\"The account's site quota is measured in site_credit.\",\"balance.total\":\"Total\",\"balance.total_amount\":\"Total {amount}\",\"balance.unknown_amount\":\"Amount unknown (unit: {unit})\",\"balance.unknown_unit\":\"Unknown unit\",\"balance.unreported\":\"Not reported (unit: {unit})\",\"balance.used\":\"Used\",\"balance.used_amount\":\"Used {amount}\",\"balance.value_separator\":\"; \",\"capability.alibaba\":\"Alibaba Cloud Bailian\",\"capability.alibaba_balance\":\"Alibaba Cloud account balance (BSS: cash balance, available credit, and credit limit)\",\"capability.cash\":\"Cash balance\",\"capability.compatible\":\"OpenAI-compatible service\",\"capability.credential_missing\":\"No usable credentials are configured\",\"capability.credits\":\"Credits\",\"capability.custom\":\"User-configured balance type\",\"capability.deepseek_balance\":\"Multicurrency account balance\",\"capability.endpoint_invalid\":\"The balance endpoint configuration is invalid\",\"capability.free_quota\":\"Free quota\",\"capability.grsai_region\":\"The Grsai endpoint selection is invalid\",\"capability.grsai_token_missing\":\"The Grsai account request token is missing\",\"capability.host_invalid\":\"The Host configuration is invalid\",\"capability.host_missing\":\"The HTTPS service base URL is missing\",\"capability.kind_invalid\":\"The Grsai balance type must map to credits\",\"capability.mapping_invalid\":\"The balance field mapping is missing or invalid\",\"capability.meinianda_balance\":\"Account site credit (site_credit)\",\"capability.path_invalid\":\"The API Path configuration is invalid\",\"capability.path_missing\":\"A relative API Path starting with / is missing\",\"capability.profile_invalid\":\"The service type is invalid\",\"capability.quota\":\"Quota\",\"capability.scope_invalid\":\"The balance scope is invalid\",\"capability.subscription\":\"Subscription quota\",\"capability.unqueryable\":\"The current configuration does not allow queries\",\"capability.usage\":\"Usage\",\"common.empty\":\"Empty\",\"common.field_separator\":\": \",\"common.label_value\":\"{label}: {value}\",\"common.list_separator\":\", \",\"common.none\":\"None\",\"common.unknown\":\"Unknown\",\"config.account_id\":\"An account id must be a nonempty string\",\"config.account_mapping\":\"An account configuration must be an object\",\"config.admin_boolean\":\"command_admin_only must be a boolean. The default was used\",\"config.aliases\":\"aliases must be a list of nonempty strings\",\"config.auth_mapping\":\"auth must be an object\",\"config.balance_scope\":\"The balance scope must be generic, account, or api_key\",\"config.bss_auth\":\"Alibaba Cloud BSS queries require a dedicated AccessKey ID and AccessKey Secret\",\"config.compatible_auth\":\"The compatible API requires an API key\",\"config.conflict\":\"The configuration changed. Refresh and confirm again.\",\"config.conflicting_account\":\"The account name conflicts with another account\",\"config.credential_in_field\":\"General configuration fields cannot contain credentials.\",\"config.credential_operation\":\"Save credentials through the dedicated credential action.\",\"config.display_name\":\"display_name must be a nonempty string\",\"config.duplicate_credential\":\"Credentials cannot duplicate a value in a general configuration field.\",\"config.duplicate_id\":\"Duplicate account id\",\"config.enabled_boolean\":\"enabled must be a boolean. The account was disabled\",\"config.endpoint_mapping\":\"endpoint must be an object\",\"config.group_boolean\":\"allow_group_queries must be a boolean. The default was used\",\"config.group_list\":\"group_allowed_user_ids must be a list of nonempty strings. An empty list was used\",\"config.grsai_account_only\":\"Grsai currently supports account credits only. The API Key credits preset is unavailable.\",\"config.grsai_account_path\":\"Use /client/openapi/getCredits for Grsai account credits.\",\"config.grsai_api_key_scope\":\"The Grsai API Key credits preset is not implemented. Select account credits\",\"config.grsai_credits\":\"Grsai credit queries must map kind to credits\",\"config.grsai_path_scope\":\"Use account for Grsai getCredits and api_key for getAPIKeyCredits\",\"config.grsai_post\":\"This Grsai credits endpoint requires POST\",\"config.grsai_region\":\"Select a direct connection to mainland China or an international endpoint for Grsai.\",\"config.grsai_required\":\"Account or API Key balance scopes require the Grsai service\",\"config.grsai_scope\":\"Grsai currently supports only the account credits preset.\",\"config.grsai_token\":\"Grsai account credits require the request token (token) from your user information.\",\"config.invalid\":\"The configuration is invalid. Check the fields and data types.\",\"config.invalid_amount_mapping\":\"The compatible API requires a valid amount_path mapping\",\"config.invalid_endpoint\":\"The balance endpoint must use a safe HTTPS GET or POST configuration\",\"config.invalid_host\":\"Host must be an HTTPS base URL without a path, query, or fragment\",\"config.invalid_path\":\"API Path must start with a single / and cannot include a full URL, query, or fragment\",\"config.invalid_root\":\"The configuration root must be an object\",\"config.legacy_credential_in_field\":\"A general field in the legacy configuration contains credentials. The original configuration was kept.\",\"config.legacy_credential_shape\":\"The legacy credential structure cannot be migrated safely. The original configuration was kept.\",\"config.migrate_first\":\"Review and migrate the legacy configuration before changing settings.\",\"config.missing_auth\":\"No usable credentials are configured\",\"config.missing_endpoint\":\"The balance query endpoint is missing\",\"config.missing_env\":\"The referenced credential environment variable is unset\",\"config.missing_host\":\"Enter the HTTPS service base URL in Host\",\"config.missing_path\":\"Enter a relative API Path starting with /\",\"config.positive_integer\":\"{path} must be a positive integer. The default was used\",\"config.positive_number\":\"{path} must be positive. The default was used\",\"config.private_list\":\"private_allowed_user_ids must be a list of platform:userID strings. An empty list was used\",\"config.provider_immutable\":\"You cannot change the provider type of an existing account. Create a new account.\",\"config.provider_type\":\"Unknown provider type\",\"config.providers_list\":\"providers must be a list\",\"config.response_mapping\":\"response_mapping must be an object. An empty object was used\",\"config.secret_in_name\":\"An account name cannot contain credentials\",\"config.service_profile\":\"The compatible service type must be generic or grsai\",\"config.storage_unavailable\":\"Secure storage is unavailable. Plaintext storage was not used. Check the key and storage status.\",\"config.template_mismatch\":\"The account template does not match the provider type\",\"config.wallet_origin\":\"Enter the site’s HTTPS origin, such as https://gateway.example.\",\"config.wallet_origin_credential\":\"Clear this account’s query credential before changing the site address.\",\"config.wallet_region\":\"Select the region that issued the query key.\",\"config.wallet_team\":\"Enter the xAI team ID using only letters, numbers, hyphens, and underscores.\",\"credential.encrypted\":\"Encrypted credentials saved\",\"credential.environment\":\"Environment variable references saved\",\"credential.missing\":\"No credentials saved\",\"credential.mixed\":\"Encrypted credentials and environment variable references saved\",\"credential.unknown\":\"Storage status unconfirmed\",\"error.alert_config.account_disabled\":\"Enable the account before turning on alerts.\",\"error.alert_config.decimal_format\":\"{label} must be entered in plain decimal notation. Scientific notation is unsupported.\",\"error.alert_config.duplicate_target\":\"The alert destination UMO is duplicated. Combine the entries into one row.\",\"error.alert_config.group_mention_only\":\"QQ number mentions are available only in QQ group chats with numeric IDs. Remove mentions from private chats.\",\"error.alert_config.integer_range\":\"{label} must be an integer from {low} to {high}.\",\"error.alert_config.invalid_enabled\":\"The alert toggle must be a Boolean value.\",\"error.alert_config.invalid_model_enabled\":\"The alert model toggle must be a Boolean value.\",\"error.alert_config.invalid_model_object\":\"The alert model configuration has an invalid structure.\",\"error.alert_config.invalid_object\":\"The account alert configuration must be an object.\",\"error.alert_config.invalid_admin_id\":\"{label} requires a QQ number or qq_official:UID, not a UMO or everyone mention.\",\"error.alert_config.invalid_qq_id\":\"{label} accepts only QQ numbers written as positive ASCII integers. Mentioning everyone is unavailable.\",\"error.alert_config.invalid_target_fields\":\"Each alert destination needs umo and mentions, with an optional scene.\",\"error.alert_config.invalid_target_scene\":\"For official QQ, use scene=qq_group with GroupMessage or scene=qq_c2c with FriendMessage. Mentions are unavailable for both.\",\"error.alert_config.invalid_text\":\"{label} must be text without control characters.\",\"error.alert_config.invalid_text_format\":\"{label} has an invalid length or format.\",\"error.alert_config.invalid_umo\":\"UMO must use the format platform instance:message type:session ID.\",\"error.alert_config.label.admin_qq\":\"Alert management QQ allowlist\",\"error.alert_config.label.check_interval\":\"Check interval (minutes)\",\"error.alert_config.label.mentions\":\"Group mentions\",\"error.alert_config.label.metric\":\"Alert metric\",\"error.alert_config.label.model\":\"Model ID\",\"error.alert_config.label.persona\":\"Persona ID\",\"error.alert_config.label.recovery_threshold\":\"Recovery threshold\",\"error.alert_config.label.repeat_interval\":\"Repeat interval while the balance stays low (minutes, 0 disables repeats)\",\"error.alert_config.label.threshold\":\"Trigger threshold\",\"error.alert_config.label.unit\":\"Alert unit\",\"error.alert_config.list_limit\":\"{label} must be a list with at most {limit} entries.\",\"error.alert_config.missing_targets\":\"Add at least one destination before turning on alerts.\",\"error.alert_config.missing_threshold_or_metric\":\"Set the threshold and metric.\",\"error.alert_config.recovery_threshold_order\":\"The recovery threshold must be higher than the trigger threshold.\",\"error.alert_config.target_limit\":\"Alert destinations must be a list with at most {limit} entries.\",\"error.alert_config.unknown_fields\":\"The account alert configuration contains unknown fields.\",\"error.alert_config.unsupported_metric\":\"This provider does not support the selected alert metric.\",\"error.query.empty_target\":\"Enter a target name\",\"error.query.invalid_arguments\":\"This command does not accept a target argument\",\"error.query.multiple_targets\":\"Multiple accounts or providers matched. Specify one target\",\"error.query.unknown_target\":\"No matching account or provider found\",\"help.account_command\":\"/yql account <name>\",\"help.alerts\":\"Quota alerts\",\"help.aliyun_note\":\"Alibaba Cloud BSS queries cash balance, available quota, and credit limit. The RAM identity requires at least AliyunBSSReadOnlyAccess.\",\"help.all_accounts\":\"All accounts\",\"help.all_command\":\"/yql or /yql all\",\"help.card_subtitle\":\"Query quotas · View local settings\",\"help.card_title\":\"YQL help\",\"help.card_tool_note\":\"Enable function tools to query quotas in natural language.\",\"help.command_body\":\"Yomihime Quota Link\\nUsage:\\n  /yql                 Query all accounts\\n  /yql help            Show help\\n  /yql status          Show local settings status\\n  /yql all             Query all accounts\\n  /yql <name>          Query an account or provider\\n  /yql account <name>  Query an account\\n  /yql provider <name> Query a provider\\n\",\"help.compatible_note\":\"OpenAI-compatible services use provider-specific balance APIs. Follow the provider's balance API documentation to configure the service URL, endpoint path, advanced authentication, and response mapping.\",\"help.configured_accounts\":\"Configured accounts: {names}\",\"help.enabled_accounts\":\"Enabled accounts · {count}\",\"help.local_config\":\"Local settings\",\"help.local_note\":\"The help and status commands read local information.\",\"help.management_note\":\"Configure provider endpoints and credentials on the management page.\",\"help.name_note\":\"You can also use /yql <name> with a display name, alias, or provider name.\",\"help.no_accounts\":\"No accounts are configured.\",\"help.no_enabled_accounts\":\"No accounts are enabled. Add an account on the management page first.\",\"help.provider_command\":\"/yql provider <name>\",\"help.query\":\"Query quotas\",\"help.select_account\":\"Specific account\",\"help.select_provider\":\"Specific provider\",\"help.status_heading\":\"Help and status\",\"help.tool_note\":\"In AI chats with function tools enabled, ask the model to call yql_query_balance in natural language.\",\"help.usage\":\"Help\",\"provider.alibaba_bailian.authentication\":\"Alibaba Cloud access key authentication failed\",\"provider.alibaba_bailian.available_credit\":\"Available credit\",\"provider.alibaba_bailian.cash_balance\":\"Cash balance\",\"provider.alibaba_bailian.connection\":\"Could not connect to the Alibaba Cloud balance service\",\"provider.alibaba_bailian.credit_limit\":\"Credit limit\",\"provider.alibaba_bailian.fallback_account\":\"Alibaba Cloud account\",\"provider.alibaba_bailian.invalid_credentials\":\"Alibaba Cloud balance query credentials are configured incorrectly\",\"provider.alibaba_bailian.invalid_request\":\"The Alibaba Cloud balance query request is configured incorrectly\",\"provider.alibaba_bailian.invalid_response\":\"The Alibaba Cloud balance response has an unrecognized format\",\"provider.alibaba_bailian.permission\":\"Alibaba Cloud denied access to the account’s cash balance. Grant at least AliyunBSSReadOnlyAccess to the RAM identity that queries the current BSS cash balance. A DashScope model API Key cannot replace this RAM permission. BSS FullAccess is unnecessary.\",\"provider.alibaba_bailian.query_failed\":\"The Alibaba Cloud account cash balance query failed\",\"provider.alibaba_bailian.rate_limited\":\"The Alibaba Cloud balance query was rate-limited. Try again later\",\"provider.alibaba_bailian.request_denied\":\"Alibaba Cloud denied the account cash balance query\",\"provider.alibaba_bailian.source\":\"Alibaba Cloud account balance and credit\",\"provider.alibaba_bailian.timeout\":\"The Alibaba Cloud cash balance query timed out\",\"provider.alibaba_bailian.too_many_requests\":\"Too many Alibaba Cloud balance queries. Try again later\",\"provider.alibaba_bailian.unavailable\":\"The Alibaba Cloud balance service is temporarily unavailable\",\"provider.deepseek.authentication\":\"DeepSeek API key authentication failed\",\"provider.deepseek.connection\":\"Could not connect to the DeepSeek balance service\",\"provider.deepseek.granted_balance\":\"Unexpired promotional balance\",\"provider.deepseek.insufficient_balance\":\"The DeepSeek account balance is too low to call the API\",\"provider.deepseek.invalid_request\":\"The DeepSeek balance query request is configured incorrectly\",\"provider.deepseek.invalid_response\":\"The DeepSeek balance response has an unrecognized format\",\"provider.deepseek.missing_key\":\"The DeepSeek account is missing a valid API key\",\"provider.deepseek.permission\":\"DeepSeek denied the balance query\",\"provider.deepseek.rate_limited\":\"Too many DeepSeek requests. Try again later\",\"provider.deepseek.request_denied\":\"DeepSeek rejected the balance query request\",\"provider.deepseek.source\":\"DeepSeek API\",\"provider.deepseek.timeout\":\"The DeepSeek balance query timed out\",\"provider.deepseek.topped_up_balance\":\"Top-up balance\",\"provider.deepseek.total_balance\":\"Total available balance\",\"provider.deepseek.unavailable\":\"The DeepSeek balance query failed temporarily\",\"provider.glm_plan.credits\":\"Credit usage\",\"provider.glm_plan.five_hours\":\"5-hour window\",\"provider.glm_plan.mcp\":\"MCP usage\",\"provider.glm_plan.monthly\":\"Monthly window\",\"provider.glm_plan.other_window\":\"Window {number}\",\"provider.glm_plan.source\":\"GLM Coding Plan official quota API\",\"provider.glm_plan.tokens\":\"Token usage\",\"provider.glm_plan.weekly\":\"Weekly window\",\"provider.glm_plan.window\":\"{category} · {window}\",\"provider.meinianda.authentication\":\"Meinianda API Key authentication failed\",\"provider.meinianda.connection\":\"Could not connect to the Meinianda balance service\",\"provider.meinianda.invalid_request\":\"The Meinianda balance query request is configured incorrectly\",\"provider.meinianda.invalid_response\":\"The Meinianda balance response has an unrecognized format\",\"provider.meinianda.missing_key\":\"The Meinianda account is missing a valid API Key\",\"provider.meinianda.permission\":\"Meinianda denied the balance query\",\"provider.meinianda.query_failed\":\"Meinianda could not complete the balance query\",\"provider.meinianda.rate_limited\":\"Too many Meinianda requests. Try again later\",\"provider.meinianda.site_credit\":\"Account site credit\",\"provider.meinianda.site_credit_note\":\"Site credit applies to the account and is separate from API Key limits. It is not converted to currency\",\"provider.meinianda.source\":\"Meinianda balance API\",\"provider.meinianda.timeout\":\"The Meinianda balance query timed out\",\"provider.meinianda.unavailable\":\"The Meinianda balance query failed temporarily\",\"provider.minimax_plan.exhausted\":\"{window} (exhausted)\",\"provider.minimax_plan.general\":\"General resources\",\"provider.minimax_plan.interval\":\"{model} · Current window\",\"provider.minimax_plan.not_in_plan\":\"{window} (excluded from plan)\",\"provider.minimax_plan.other_model\":\"Resource group {number}\",\"provider.minimax_plan.source\":\"MiniMax official plan quota API\",\"provider.minimax_plan.unlimited\":\"{window} (unlimited)\",\"provider.minimax_plan.video\":\"Video resources\",\"provider.minimax_plan.weekly\":\"{model} · Weekly window\",\"provider.minimax_plan.weekly_boost\":\"{model} · Weekly quota multiplier\",\"provider.moonshot.cash_balance\":\"Cash balance\",\"provider.moonshot.source\":\"Kimi Open Platform account balance\",\"provider.moonshot.voucher_balance\":\"Voucher balance\",\"provider.new_api.effective_quota\":\"Quota available to this token\",\"provider.new_api.key_quota\":\"Token quota\",\"provider.new_api.source\":\"New API token quota API\",\"provider.new_api.unlimited\":\"Unlimited token quota\",\"provider.new_api.user_quota\":\"Account quota\",\"provider.novita.available\":\"Available account credits\",\"provider.novita.cash\":\"Top-up balance\",\"provider.novita.credit_limit\":\"Borrowing limit\",\"provider.novita.outstanding\":\"Outstanding invoice amount\",\"provider.novita.source\":\"Novita AI account balance API\",\"provider.openai_compatible.authentication\":\"Balance API authentication failed\",\"provider.openai_compatible.business_failure\":\"The balance service reported a query failure\",\"provider.openai_compatible.connection\":\"Could not connect to the balance API\",\"provider.openai_compatible.grsai_authentication\":\"The account credits API returned HTTP 401. Check the authentication settings\",\"provider.openai_compatible.grsai_permission\":\"The account credits API returned HTTP 403. Check the access settings\",\"provider.openai_compatible.grsai_query_failed\":\"The account credits API request failed\",\"provider.openai_compatible.grsai_rate_limited\":\"The account credits API returned HTTP 429. Try again later\",\"provider.openai_compatible.grsai_source\":\"Grsai account credits API\",\"provider.openai_compatible.https_required\":\"The balance API must use HTTPS\",\"provider.openai_compatible.invalid_configuration\":\"The compatible provider’s balance query is configured incorrectly\",\"provider.openai_compatible.invalid_request\":\"The balance API request is configured incorrectly\",\"provider.openai_compatible.invalid_response\":\"The balance API response has an unrecognized format\",\"provider.openai_compatible.not_found\":\"The balance API path or version does not exist\",\"provider.openai_compatible.permission\":\"The balance API denied access\",\"provider.openai_compatible.rate_limited\":\"Too many requests to the balance API. Try again later\",\"provider.openai_compatible.source\":\"OpenAI-compatible balance API\",\"provider.openai_compatible.timeout\":\"The balance API query timed out\",\"provider.openai_compatible.unavailable\":\"The balance API request failed temporarily\",\"provider.openrouter.balance\":\"Available account credits\",\"provider.openrouter.source\":\"OpenRouter account credits API\",\"provider.pollinations.held\":\"Held Quest Pollen\",\"provider.pollinations.paid\":\"Paid Pollen\",\"provider.pollinations.quest\":\"Quest Pollen\",\"provider.pollinations.source\":\"Pollinations official account balance API\",\"provider.pollinations.total\":\"Available Pollen\",\"provider.retry.explicit_throttling\":\"The balance service reported a rate limit. Try again later\",\"provider.stepfun.source\":\"StepFun Open Platform account balance\",\"provider.stepfun.total_cash\":\"Total deposited\",\"provider.stepfun.total_voucher\":\"Total promotional credit\",\"provider.sub2api.key_quota\":\"API key quota\",\"provider.sub2api.source\":\"Sub2API quota query\",\"provider.sub2api.wallet_balance\":\"Wallet balance\",\"provider.venice.available_balance\":\"USD prepaid balance\",\"provider.venice.bundled_credits\":\"Remaining bundled credits\",\"provider.venice.diem_balance\":\"Remaining DIEM this epoch\",\"provider.venice.earned_credits\":\"Remaining earned credits\",\"provider.venice.no_numeric_balance\":\"The API did not report a numeric balance.\",\"provider.venice.source\":\"Venice account balance API\",\"provider.vercel_gateway.balance\":\"Available team credits\",\"provider.vercel_gateway.lifetime_usage\":\"Lifetime credits used\",\"provider.vercel_gateway.source\":\"Vercel AI Gateway team credits API\",\"provider.wallet.authentication\":\"The provider rejected the query credentials.\",\"provider.wallet.available_balance\":\"Available balance\",\"provider.wallet.configuration\":\"Check the query credentials and account settings.\",\"provider.wallet.endpoint\":\"The balance or quota endpoint is unavailable. Check the account settings.\",\"provider.wallet.parse\":\"Could not read the balance or quota from the provider’s response.\",\"provider.wallet.permission\":\"The credentials do not have permission to read this account’s balance or quota.\",\"provider.wallet.rate_limited\":\"Too many requests. Try again later.\",\"provider.wallet.unavailable\":\"The provider could not return the balance or quota.\",\"provider.wallet.unsupported\":\"This endpoint returned an unsupported quota type.\",\"provider.xai.posted_balance\":\"Posted prepaid balance\",\"provider.xai.posted_note\":\"Usage in the current billing cycle may not be deducted until it posts to the ledger.\",\"provider.xai.source\":\"xAI team prepaid ledger\",\"query.account_card_title\":\"Account quota and usage\",\"query.account_incomplete\":\"The account settings are incomplete. A balance query is unavailable.\",\"query.account_outcome_count\":\"{label}: {count}\",\"query.account_timeout\":\"The account query timed out\",\"query.account_title\":\"Account query: {target}\",\"query.accounts_count\":\"Accounts: {count}\",\"query.all_card_title\":\"Quota and usage\",\"query.all_title\":\"Quota and usage query\",\"query.authentication_paused\":\"Paused after an authentication or permission failure. Update the settings or retry manually to resume.\",\"query.available\":\"Available\",\"query.cached\":\" (cached)\",\"query.cached_card\":\" · Cached data\",\"query.client_unconfigured\":\"The query client is not configured\",\"query.cooldown_account\":\"Account query is cooling down. Try again in {seconds} seconds\",\"query.cooldown_provider\":\"Provider query is cooling down. Try again in {seconds} seconds\",\"query.empty_title\":\"No results\",\"query.error_detail\":\"  Query failed: {message}\",\"query.failed\":\"Query failed\",\"query.failed_short\":\"Failed\",\"query.invalid_operation\":\"The operation must be query or list.\",\"query.invalid_provider_result\":\"The provider returned an invalid result for this account.\",\"query.invalid_request\":\"The query request was not recognized.\",\"query.invalid_target\":\"Specify an account, a provider name, or all.\",\"query.matches\":\"{message}\\nMatches: {candidates}\",\"query.no_accounts\":\"No accounts are configured for queries.\",\"query.no_items\":\"No balance or usage items to display\",\"query.no_results\":\"No query results to display.\",\"query.outcome_count\":\"{label}: {count}\",\"query.partial\":\"Partially available\",\"query.partial_data\":\"Partial data retrieved\",\"query.partial_success\":\"Partially succeeded\",\"query.permission_denied\":\"This conversation is not allowed to query balances.\",\"query.provider_card_title\":\"Provider quota and usage\",\"query.provider_title\":\"Provider query: {target}\",\"query.provider_unsupported\":\"Balance queries are not supported for this provider yet\",\"query.queue_timeout\":\"The account’s time limit expired while the query was waiting to start.\",\"query.service_closed\":\"The query service is closed\",\"query.source_time\":\"  Fetched: {time} · Source: {source}\",\"query.source_time_card\":\"Source: {source} · Fetched: {time}\",\"query.status_unavailable\":\"Unavailable\",\"query.success\":\"Query succeeded\",\"query.success_short\":\"Succeeded\",\"query.summary\":\"Query summary: {summary}.\",\"query.summary_separator\":\", \",\"query.target_card\":\"Target: {target}\\n\",\"query.time\":\"Query time: {time}\",\"query.time_card\":\"Queried: {time}\",\"query.total_timeout\":\"The query exceeded its overall time limit\",\"query.unavailable\":\"Queries are temporarily unavailable\",\"query.unknown_status\":\"Status unknown\",\"status.account_list\":\"Accounts:\",\"status.accounts_count\":\"Accounts: {total} total, {enabled} enabled, {ready} queryable\",\"status.add_account\":\"Add an account and credentials on the management page\",\"status.admin_only\":\"Admins only\",\"status.after_save\":\"After saving, use /yql status to view local settings and /yql to query quotas.\",\"status.api_path\":\"Enter a relative API path starting with /\",\"status.card_access\":\"Access and credentials\",\"status.card_counts\":\"Accounts: {total} · Enabled: {enabled} · Configured: {ready}\",\"status.card_incomplete\":\"Missing settings: {reason}\",\"status.card_issues\":\"Configuration issues · {count}\",\"status.card_needs_check\":\"Needs review: {reason}\",\"status.card_needs_setup\":\"Setup needed: {reason}\",\"status.card_no_accounts\":\"No accounts configured\",\"status.card_online_check\":\"Use /yql to check connectivity and balances.\",\"status.card_source\":\"Based on the local account directory and credential records\",\"status.card_title\":\"Local settings status\",\"status.credential_storage\":\"Credential storage\",\"status.credential_storage_state\":\"Credential storage: {state}\",\"status.disabled\":\"Disabled\",\"status.enabled\":\"Enabled\",\"status.group_queries\":\"Group queries\",\"status.group_queries_state\":\"Group queries: {state}\",\"status.incomplete\":\"Incomplete setup: {reason}\",\"status.issue_count\":\"Configuration issues: {count}\",\"status.next_step\":\"Next step\",\"status.no_accounts\":\"No accounts are configured.\",\"status.not_queryable\":\"Cannot query: {reason}\",\"status.off\":\"Off\",\"status.permissions\":\"Command permissions\",\"status.permissions_state\":\"Command permissions: {state}\",\"status.provider\":\"Provider: {provider}\",\"status.queryable\":\"Configured and queryable\",\"status.reason.grsai_account_path_mismatch\":\"Use the Grsai account credit endpoint\",\"status.reason.grsai_balance_scope_mismatch\":\"Select the balance scope for the Grsai endpoint\",\"status.reason.grsai_method_must_post\":\"The Grsai credit API uses POST\",\"status.reason.invalid_api_path\":\"Invalid endpoint path. Enter a relative path starting with / without parameters\",\"status.reason.invalid_balance_kind\":\"Set the Grsai balance kind to credits\",\"status.reason.invalid_balance_scope\":\"Check the balance query scope\",\"status.reason.invalid_base_url\":\"Invalid service URL. Enter an HTTPS base URL without a path, parameters, or credentials\",\"status.reason.invalid_endpoint\":\"Invalid service URL or endpoint path. Use an HTTPS base URL and a path starting with /\",\"status.reason.invalid_grsai_region\":\"Select a valid Grsai region\",\"status.reason.invalid_response_mapping\":\"configure the balance mapping in advanced settings using the provider's response documentation\",\"status.reason.invalid_service_profile\":\"Check the service type\",\"status.reason.missing_api_path\":\"enter an endpoint path starting with /\",\"status.reason.missing_base_url\":\"enter the HTTPS base URL\",\"status.reason.missing_credentials\":\"Missing usable credentials\",\"status.reason.missing_endpoint\":\"enter the service URL and endpoint path from the provider's documentation\",\"status.reason.missing_environment_variable\":\"Credential environment variable is unset\",\"status.reason.missing_grsai_token\":\"Configure the Grsai account request token\",\"status.saved_credentials\":\"Saved credentials\",\"status.session_permissions\":\"Authorized per session\",\"status.source\":\"Source: local settings and credential records. Use /yql to check connectivity and balances.\",\"status.title\":\"Yomihime Quota Link status\",\"status.unknown_reason\":\"Configuration incomplete or query temporarily unavailable\",\"storage.migration_pending\":\"Legacy settings awaiting migration\",\"storage.ready\":\"Secure storage is ready\",\"storage.unavailable\":\"Secure storage needs review\",\"storage.unknown\":\"Credential storage status unconfirmed\",\"web.account.add\":\"Add account\",\"web.account.add_query\":\"Add a query account\",\"web.account.advanced\":\"Advanced endpoint and response mapping\",\"web.account.aliases_hint\":\"Commands and natural language queries use these aliases. Enter one per line and keep them unique across accounts.\",\"web.account.count\":\"Accounts: {count}\",\"web.account.credentials_configured\":\"Credentials configured\",\"web.account.credentials_pending\":\"Credentials needed\",\"web.account.disabled\":\"Disabled\",\"web.account.editor_subtitle\":\"Manage query settings and credentials.\",\"web.account.empty\":\"No query accounts yet\",\"web.account.empty_hint\":\"Choose a provider to add an account, then configure its encrypted credentials separately.\",\"web.account.enabled\":\"Enabled\",\"web.account.id_hint\":\"Choose a stable, unique ID. It cannot be changed after saving.\",\"web.account.id_locked\":\"Existing account IDs are fixed to keep credentials bound to the right account.\",\"web.account.list\":\"Query accounts\",\"web.account.list_subtitle\":\"Manage accounts for AI service balance, usage, and quota queries.\",\"web.account.mapping\":\"Balance response mapping\",\"web.account.mapping_hint\":\"Use JSON Pointer, for example /data/remaining. Keep credentials out of the static body and mappings.\",\"web.account.new\":\"New account\",\"web.account.profile_action\":\"Change and clear thresholds\",\"web.account.profile_body\":\"This clears the thresholds and turns off alerts. Query the balance again to detect the unit.\",\"web.account.profile_title\":\"Change service type and reset alerts?\",\"web.account.protocol\":\"Request protocol\",\"web.account.provider\":\"Provider\",\"web.account.provider_scope\":\"Each provider uses its own balance protocol and query credentials, separate from model chat settings.\",\"web.account.provider_settings\":\"Provider settings\",\"web.account.remove\":\"Remove account\",\"web.account.remove_action\":\"Remove from draft\",\"web.account.remove_body\":\"This removes the account from the draft. Saving applies the removal and deletes its stored credentials. Other accounts are unaffected.\",\"web.account.remove_hint\":\"Removal takes effect after saving.\",\"web.account.remove_title\":\"Remove account “{account}”?\",\"web.account.settings\":\"Account settings\",\"web.alert.admin_list\":\"QQ allowlist for alert administration\",\"web.alert.admin_list_hint\":\"One OneBot QQ number or qq_official:UID per line. Get the official UID from /sid; do not enter a UMO. Listed users and AstrBot admins can manage alerts.\",\"web.alert.admin_list_placeholder\":\"QQ number or qq_official:UID\",\"web.alert.enable_account\":\"Enable alerts for this account\",\"web.alert.hints_title\":\"Alert messages\",\"web.alert.interval\":\"Check interval (minutes)\",\"web.alert.interval_days\":\"{count} d\",\"web.alert.interval_hint\":\"1–4320 minutes. Default: 15.\",\"web.alert.interval_minutes\":\"{count} min\",\"web.alert.interval_set\":\"Set to {count} minutes\",\"web.alert.interval_slider\":\"Check interval slider (minutes)\",\"web.alert.metric\":\"Alert metric\",\"web.alert.metric_hint\":\"Select the balance to monitor.\",\"web.alert.minutes\":\"min\",\"web.alert.permissions\":\"Alert administration permissions\",\"web.alert.query_only\":\"This preset supports manual quota queries.\",\"web.alert.quick_group\":\"Check interval presets\",\"web.alert.quick_label\":\"Presets:\",\"web.alert.recovery\":\"Recovery threshold (optional)\",\"web.alert.recovery_hint\":\"Leave blank to set automatically. Must be above the trigger threshold.\",\"web.alert.recovery_placeholder\":\"Leave blank to set automatically\",\"web.alert.repeat\":\"Repeat low-balance reminder (minutes)\",\"web.alert.repeat_hint\":\"Use 0 to disable repeats. Maximum: 4320 minutes.\",\"web.alert.smart_hint\":\"AI notices\",\"web.alert.smart_hint_help\":\"Uses the target session’s persona to write the whole notice. The plugin fills in the figures.\",\"web.alert.targets\":\"Destination UMO (one per line)\",\"web.alert.targets_hint\":\"Enter one UMO per line. For OneBot groups, append @ followed by a QQ number. For official QQ, use an OpenID and append scene=qq_group for group chats or scene=qq_c2c for private chats. Leave out channels and channel direct messages.\",\"web.alert.targets_title\":\"Quota alert destinations\",\"web.alert.threshold\":\"Trigger threshold\",\"web.alert.threshold_hint\":\"An alert triggers when the balance is at or below this value.\",\"web.alert.threshold_placeholder\":\"Enter the trigger threshold\",\"web.alert.title\":\"Quota alerts\",\"web.common.cancel\":\"Cancel\",\"web.common.choose\":\"Select an option\",\"web.common.off\":\"Off\",\"web.common.on\":\"On\",\"web.common.one_per_line\":\"One entry per line\",\"web.common.time_unavailable\":\"Time unavailable\",\"web.credential.balance_key\":\"Balance query API key\",\"web.credential.cancel_entry\":\"Cancel entry\",\"web.credential.clear\":\"Clear credential\",\"web.credential.clear_body\":\"This removes the credential or reference for “{account}”. Account settings are kept. Configure the credential again before querying.\",\"web.credential.clear_title\":\"Clear {credential}?\",\"web.credential.confirm_clear\":\"Confirm clearing\",\"web.credential.encrypted_status\":\"Configured · Encrypted storage\",\"web.credential.enter_new\":\"Enter new credential\",\"web.credential.environment_hint\":\"Enter only the variable name, such as QUOTA_API_KEY. The runtime supplies its value.\",\"web.credential.environment_name\":\"Environment variable name\",\"web.credential.environment_status\":\"Configured · Environment variable\",\"web.credential.eyebrow\":\"QUERY CREDENTIALS\",\"web.credential.finish_settings\":\"Save or discard settings changes before editing credentials.\",\"web.credential.gateway_key\":\"Site model API key\",\"web.credential.glm_plan\":\"GLM Coding Plan API key\",\"web.credential.grsai_token\":\"Grsai request token\",\"web.credential.legacy_field\":\"Legacy credential ({field})\",\"web.credential.minimax_plan\":\"MiniMax Token Plan key\",\"web.credential.missing\":\"Not configured\",\"web.credential.new_source\":\"New credential source\",\"web.credential.new_value\":\"New credential\",\"web.credential.new_value_hint\":\"Leaving this blank keeps the existing credential. The input is cleared immediately after submission.\",\"web.credential.openrouter_management\":\"OpenRouter management key\",\"web.credential.optional_sts\":\"STS Security Token (optional)\",\"web.credential.replace\":\"Replace credential\",\"web.credential.save_account\":\"Save the new account before adding credentials.\",\"web.credential.save_new\":\"Save new credential\",\"web.credential.saved_hint\":\"Credentials are saved and will be verified when querying the balance.\",\"web.credential.separate\":\"Credentials are saved separately.\",\"web.credential.status_unread\":\"Status not loaded\",\"web.credential.title\":\"Query credentials\",\"web.credential.use_environment\":\"Use environment variable\",\"web.credential.venice_admin\":\"Venice admin API key\",\"web.credential.vercel_gateway\":\"Vercel AI Gateway API key\",\"web.credential.xai_management\":\"xAI management key\",\"web.detail.fixed_hint\":\"Used the standard alert message.\",\"web.detail.legacy_target_unknown\":\"A legacy send record could not be matched to the destination, so its outcome is unknown. Official QQ alerts resume after the balance recovers and then falls to or below the threshold again.\",\"web.detail.mention_invalid\":\"Invalid QQ mention format. Check the group session and @QQ number.\",\"web.detail.mention_unsupported\":\"The destination does not support QQ mentions. Remove the @ suffix or use a supported QQ group.\",\"web.detail.message_components_unavailable\":\"Could not construct the message components. Check the host components and logs.\",\"web.detail.platform_not_found\":\"Destination platform instance was not found. Check the platform instance ID in the UMO.\",\"web.detail.platform_unavailable\":\"The destination platform instance is unavailable. Check the connection and host logs.\",\"web.detail.platform_unsupported\":\"The destination platform does not support this outbound delivery method. Use a supported destination.\",\"web.detail.session_check_failed\":\"Could not verify the destination session. Check AstrBot session settings and logs.\",\"web.detail.session_disabled\":\"The destination session is disabled. Enable it in AstrBot.\",\"web.detail.target_invalid\":\"Invalid alert destination format. Check the UMO in Global settings.\",\"web.detail.target_scene_required\":\"The official QQ destination is missing its chat type. Specify it in Global settings or run /yql alert targets addhere in the destination chat.\",\"web.detail.transport_unavailable\":\"The host outbound delivery API is unavailable. Check the AstrBot version and logs.\",\"web.detail.unknown\":\"No specific reason is available. Check global alert destinations, platform connections, and host alert logs.\",\"web.field.advanced_options\":\"Show advanced settings\",\"web.field.aliases\":\"Query aliases\",\"web.field.amount_path\":\"Primary balance path\",\"web.field.auth_mode\":\"Authentication method\",\"web.field.auth_name\":\"Authentication parameter name\",\"web.field.balance_scope\":\"Credit scope\",\"web.field.base_url\":\"Service address\",\"web.field.cache_ttl_seconds\":\"Successful result cache (seconds)\",\"web.field.display_name\":\"Display name\",\"web.field.enabled\":\"Enable account\",\"web.field.expires_at_path\":\"Expiration time path\",\"web.field.expiry_path\":\"Legacy expiration path\",\"web.field.failure_path\":\"Business failure path\",\"web.field.failure_value\":\"Business failure value\",\"web.field.gateway_origin\":\"Site address\",\"web.field.id\":\"Account ID\",\"web.field.json_body\":\"Static JSON request body\",\"web.field.kind\":\"Balance category\",\"web.field.kind_path\":\"Category path\",\"web.field.method\":\"Request method\",\"web.field.path\":\"API path\",\"web.field.region\":\"Connection region\",\"web.field.remaining_path\":\"Remaining amount path\",\"web.field.service_profile\":\"Service type\",\"web.field.status_path\":\"Status path\",\"web.field.status_values\":\"Status mapping\",\"web.field.success_path\":\"Business success path\",\"web.field.success_value\":\"Business success value\",\"web.field.team_id\":\"Team ID\",\"web.field.timeout_seconds\":\"Account timeout (seconds)\",\"web.field.total_path\":\"Total amount path\",\"web.field.unit\":\"Fixed unit\",\"web.field.unit_path\":\"Unit path\",\"web.field.url\":\"Legacy full URL\",\"web.field.used_path\":\"Used amount path\",\"web.global.allow_group_queries\":\"Allow group queries\",\"web.global.command_admin_only\":\"Restrict balance queries to administrators\",\"web.global.group_allowed_user_ids\":\"Group query user allowlist\",\"web.global.max_concurrency\":\"Maximum concurrent queries\",\"web.global.private_allowed_user_ids\":\"Private chat allowlist\",\"web.global.timeout_seconds\":\"Per-account timeout (seconds)\",\"web.global.total_timeout_seconds\":\"Total query timeout (seconds)\",\"web.hint.advanced_options\":\"Configure authentication, method, and response mapping for generic services. Grsai account credits use a fixed protocol and ignore old mappings.\",\"web.hint.amount_path\":\"Required JSON Pointer, for example /data/remaining.\",\"web.hint.auth_mode\":\"Follow the balance API documentation. Grsai account credits ignore this field and always put the token in the JSON body.\",\"web.hint.auth_name\":\"Used only with request header or query parameter authentication.\",\"web.hint.balance_scope\":\"Account credits are supported. API key credit queries are currently unavailable.\",\"web.hint.base_url\":\"HTTPS base URL without the API path. https://api.example.invalid is an example and cannot be reached.\",\"web.hint.expiry_path\":\"Legacy compatibility for expires_at_path.\",\"web.hint.gateway_origin\":\"Enter the site’s HTTPS origin. The query credential is sent only to that site.\",\"web.hint.json_body\":\"For generic services only. Templates and credentials are unsupported. Leave blank for Grsai account credits and clear any old body when switching an entry.\",\"web.hint.kind_path\":\"Optional JSON Pointer. Allowed: cash/quota/free_quota/subscription/credits/usage/custom.\",\"web.hint.legacy_base_url\":\"HTTPS base URL, optionally combined with an API path.\",\"web.hint.legacy_json_body\":\"Use only for a documented read-only POST. Templates and credentials are unsupported.\",\"web.hint.legacy_method\":\"Use GET or a POST confirmed to have no side effects.\",\"web.hint.meinianda_cache\":\"The site recommends querying once per minute. The default cache is 60 seconds.\",\"web.hint.method\":\"Follow the documentation for generic services. Grsai account credits always use POST. Clear the previous GET method when switching an existing entry.\",\"web.hint.path\":\"Follow the documentation for generic services. For Grsai account credits, leave blank or enter /client/openapi/getCredits. Clear the previous path when switching an existing entry. /account/balance is an example only.\",\"web.hint.private_allowlist\":\"Enter the full platform:userID, for example aiocqhttp:123456. Administrators can query without being listed. The administrator-only switch above also applies to /yql balance queries.\",\"web.hint.region\":\"Both regions use built-in official endpoints. No server address is needed.\",\"web.hint.service_profile\":\"Balance queries use provider-specific endpoints. Use the Grsai template for new Grsai accounts. Existing entries here can switch to the account credit preset.\",\"web.hint.status_values\":\"Map provider status values to available/unavailable/partial/unknown.\",\"web.hint.unit\":\"Allowed: CNY/USD/JPY/credit/credits/tokens/requests/custom. Required when unit_path is set.\",\"web.hint.unit_path\":\"Optional JSON Pointer. The runtime value must match the fixed unit.\",\"web.hint.url\":\"Full HTTPS URL without a query, credentials, or fragment.\",\"web.language.auto\":\"Follow AstrBot\",\"web.language.en-US\":\"English\",\"web.language.ja-JP\":\"日本語\",\"web.language.zh-CN\":\"简体中文\",\"web.language.zh-TW\":\"繁體中文\",\"web.metric.AvailableAmount\":\"Available quota\",\"web.metric.AvailableCashAmount\":\"Cash balance\",\"web.metric.CreditAmount\":\"Credit limit\",\"web.metric.credit\":\"Credits\",\"web.metric.granted_balance\":\"Granted balance\",\"web.metric.mapped_balance\":\"Mapped balance\",\"web.metric.monitored\":\"Monitored balance\",\"web.metric.site_credit\":\"Site credits\",\"web.metric.topped_up_balance\":\"Top-up balance\",\"web.metric.total_balance\":\"Total balance\",\"web.migration.accounts\":\"Accounts\",\"web.migration.cleanup_hint\":\"Legacy host configuration is removed only after migration succeeds. If the source changes, preview again before migrating.\",\"web.migration.cleanup_pending\":\"Migration was saved, but the host’s legacy fields still need cleanup. Preview again before retrying.\",\"web.migration.confirm\":\"Confirm legacy migration\",\"web.migration.confirm_body\":\"Migrate the {count} accounts in the preview. Plaintext credentials will be encrypted before storage, and legacy plugin fields will be cleaned up. Credentials stay hidden and are never sent to other services.\",\"web.migration.confirm_title\":\"Migrate legacy configuration?\",\"web.migration.conflict\":\"Legacy configuration differs from the current encrypted store. Verify the source manually. The existing store and newly detected configuration are kept intact.\",\"web.migration.environment\":\"Environment variable references\",\"web.migration.execute\":\"Run migration\",\"web.migration.lock_warning\":\"Legacy configuration is waiting for migration. Settings and credential changes are temporarily locked.\",\"web.migration.no_pending\":\"No legacy configuration to migrate.\",\"web.migration.open\":\"Open migration\",\"web.migration.overview\":\"Move settings, credentials, and environment variable references from the legacy plugin configuration to managed storage. Credentials are stored encrypted and hidden on this page.\",\"web.migration.pending\":\"Legacy configuration detected. Finish migration before saving new settings.\",\"web.migration.plaintext\":\"Credentials to encrypt\",\"web.migration.preview\":\"Preview migration\",\"web.migration.retry_cleanup\":\"Retry legacy field cleanup\",\"web.migration.scope\":\"Migration scope\",\"web.migration.title\":\"Legacy configuration migration\",\"web.navigation.accounts\":\"Account management\",\"web.navigation.back_to_accounts\":\"Back to accounts\",\"web.navigation.global\":\"Global settings\",\"web.navigation.leave_action\":\"Discard draft and leave\",\"web.navigation.leave_body\":\"Unsaved settings and credential input will be cleared. Requests already sent cannot be withdrawn. Reload to verify an uncertain outcome before trying again.\",\"web.navigation.leave_title\":\"Leave these settings?\",\"web.navigation.maintenance\":\"Configuration maintenance\",\"web.navigation.mobile\":\"Mobile navigation\",\"web.navigation.primary\":\"Main navigation\",\"web.navigation.reload\":\"Reload status\",\"web.navigation.reload_action\":\"Discard draft and reload\",\"web.navigation.reload_body\":\"This clears unsaved settings and credential input.\",\"web.navigation.reload_title\":\"Reload configuration?\",\"web.navigation.skip\":\"Skip to main content\",\"web.notice.alert_loading\":\"Reading alert runtime status…\",\"web.notice.alert_read_failed\":\"Could not verify the alert runtime status. Try again later.\",\"web.notice.authorization_lost\":\"Admin authorization expired. Drafts were cleared. Reopen the page from AstrBot plugin management.\",\"web.notice.authorization_reopen\":\"Admin authorization expired. Reopen this page.\",\"web.notice.config_changed\":\"The configuration changed. Reload to see the current settings.\",\"web.notice.connecting\":\"Connecting to the host admin session…\",\"web.notice.discarded\":\"Unsaved draft discarded.\",\"web.notice.invalid_context\":\"Invalid host admin context. Open this page from AstrBot plugin management.\",\"web.notice.invalid_environment\":\"Enter a valid environment variable name without its value.\",\"web.notice.left_during_write\":\"You left the previous settings. A request already sent cannot be withdrawn. Reload to verify its outcome.\",\"web.notice.legacy_cleanup_incomplete\":\"Configuration migrated, but legacy fields remain. Preview again under Configuration maintenance to finish cleanup.\",\"web.notice.legacy_cleanup_retry\":\"Migration was saved. You can retry cleanup of the original legacy fields.\",\"web.notice.legacy_conflict\":\"Legacy configuration differs from the current store. Both are kept intact.\",\"web.notice.legacy_not_pending\":\"No legacy configuration to migrate.\",\"web.notice.legacy_preview_ready\":\"Migration preview is ready. Review the scope below before proceeding.\",\"web.notice.loaded\":\"Loaded the latest configuration.\",\"web.notice.missing_credential\":\"Enter a new credential. Leaving it blank keeps the existing one.\",\"web.notice.open_in_host\":\"Open this page from AstrBot plugin management.\",\"web.notice.read_failed\":\"Could not verify the configuration state. Reload or reopen from the host.\",\"web.notice.reading\":\"Reading the latest state…\",\"web.notice.revision_conflict\":\"Another page changed the configuration. Reload and review it before submitting again. No automatic retry will occur.\",\"web.notice.saved\":\"Saved and verified the current state.\",\"web.notice.saving\":\"Submitting. Wait for the result before trying again…\",\"web.notice.session_unavailable\":\"The host admin session is unavailable. Reopen this page.\",\"web.notice.unit_candidate_changed\":\"The unit option changed or expired. Query again before confirming.\",\"web.notice.unit_candidates\":\"New unit options are available. Review them and confirm one.\",\"web.notice.unit_confirm_uncertain\":\"Confirmation outcome is unknown. Refresh the unit status before taking further action.\",\"web.notice.unit_confirmed\":\"Unit confirmed.\",\"web.notice.unit_current\":\"Loaded the latest unit status. The confirmed unit remains valid.\",\"web.notice.unit_no_candidates\":\"No unit options are available. Check the credentials, endpoint, and query status before trying again.\",\"web.notice.unit_querying\":\"Querying the balance for the latest unit…\",\"web.notice.unit_read_failed\":\"Could not read the unit. Refresh and try again.\",\"web.notice.unit_unverified_candidates\":\"Could not verify any new unit options. Check the credentials, endpoint, and query status before trying again.\",\"web.notice.validation_failed\":\"Submission failed validation. Check fields and credential types. Sensitive input was cleared.\",\"web.notice.write_uncertain\":\"Submission outcome is unconfirmed. Sensitive input was cleared. Reload to verify the state before resubmitting.\",\"web.option.auth.bearer\":\"Bearer token\",\"web.option.auth.header\":\"Request header\",\"web.option.auth.query\":\"Query parameter\",\"web.option.profile.generic\":\"OpenAI-compatible / third-party service\",\"web.option.region.cn\":\"China endpoint\",\"web.option.region.overseas\":\"Overseas endpoint\",\"web.option.scope.account\":\"Account credits (preset supported)\",\"web.option.scope.api_key\":\"API key credits (queries unavailable)\",\"web.option.scope.none\":\"Select the credit scope\",\"web.provider.alibaba_help\":\"Alibaba Cloud BSS: cash balance, available quota, and credit limit.\",\"web.provider.compatible_help\":\"Configure the provider’s read-only balance endpoint using its documentation.\",\"web.provider.compatible_name\":\"Other compatible service\",\"web.provider.deepseek_help\":\"DeepSeek official balance. The query endpoint and response parsing are built in.\",\"web.provider.glm_plan_help\":\"Use a GLM Coding Plan key for the selected region to query usage percentages for each reported window.\",\"web.provider.grsai_help\":\"Grsai account credits use the request token and the fixed POST /client/openapi/getCredits endpoint. The model API key is unused.\",\"web.provider.legacy_name\":\"Legacy generic account\",\"web.provider.meinianda_help\":\"Queries the Meinianda account’s site credits. A cache of at least 60 seconds is recommended.\",\"web.provider.minimax_plan_help\":\"Use a Token Plan key for the selected region to query each model group’s interval and weekly quotas.\",\"web.provider.moonshot_help\":\"Show the selected Moonshot region’s available, cash, and promotional balances separately.\",\"web.provider.new_api_help\":\"Query the model token’s quota and any account quota it may read. Values stay in the site’s original quota points.\",\"web.provider.novita_help\":\"Query Novita AI’s available balance, cash balance, credit limit, and outstanding invoices.\",\"web.provider.openrouter_help\":\"Use a management key to read purchased and spent OpenRouter credits and calculate the remaining credits.\",\"web.provider.pollinations_help\":\"Use a key with account:usage permission to query the account’s Pollen. Held credits appear separately.\",\"web.provider.stepfun_help\":\"Query the selected StepFun region. Lifetime deposits and promotional credits appear separately.\",\"web.provider.sub2api_help\":\"Use a Sub2API model key to query the site wallet or an explicitly reported key quota.\",\"web.provider.venice_help\":\"Use an admin API key for Venice. USD, DIEM, and other credit balances appear separately.\",\"web.provider.vercel_gateway_help\":\"Use an AI Gateway key to query the team’s USD balance and lifetime spend.\",\"web.provider.xai_help\":\"Use the team’s management key to query its posted xAI prepaid balance.\",\"web.runtime.last_checked\":\"Last checked: \",\"web.runtime.last_sent\":\"Last send attempt: \",\"web.runtime.loading\":\"Loading…\",\"web.runtime.no_account_record\":\"This account has no runtime history yet.\",\"web.runtime.refresh\":\"Refresh alert status\",\"web.runtime.running\":\"Checks are running for accounts with alerts enabled and all required settings in place.\",\"web.runtime.stopped\":\"The check task is inactive.\",\"web.runtime.storage_unavailable\":\"Alert state storage is unavailable. Alerts are inactive.\",\"web.runtime.title\":\"Runtime status\",\"web.runtime.unknown_status\":\"Status updated. Use the alert command for details.\",\"web.settings.access_eyebrow\":\"QUERY ACCESS\",\"web.settings.access_title\":\"Access permissions\",\"web.settings.account_alerts\":\"Alerts can be enabled per account.\",\"web.settings.admin_access\":\"Only AstrBot administrators can open and configure this page.\",\"web.settings.admin_allowlist\":\"Administrators do not need to be on the private chat allowlist.\",\"web.settings.appearance\":\"Language settings\",\"web.settings.applies_after_save\":\"Takes effect after saving.\",\"web.settings.command_access\":\"The administrator-only setting applies to /yql balance queries. Alert commands have separate access rules.\",\"web.settings.discard\":\"Discard changes\",\"web.settings.group_access\":\"Group queries require the group query switch and must meet the user allowlist rules.\",\"web.settings.language\":\"Plugin language\",\"web.settings.language_hint\":\"Applies after saving. Automatic mode uses the language provided by AstrBot. When no supported language is available, such as for scheduled alerts, Quota Link uses Simplified Chinese.\",\"web.settings.private_format\":\"Use the full platform:userID in the private chat allowlist.\",\"web.settings.query_access\":\"Query permissions\",\"web.settings.query_and_cache\":\"Queries and cache\",\"web.settings.save\":\"Save settings\",\"web.settings.save_first\":\"Save settings first.\",\"web.settings.separate_credentials\":\"Settings and credentials are saved separately\",\"web.settings.unsaved\":\"Unsaved changes\",\"web.shell.auth_required\":\"Host admin authorization required\",\"web.shell.brand_author\":\"Yomihime’s\",\"web.shell.brand_name\":\"Quota Link\",\"web.shell.eyebrow\":\"YOMIHIME QUOTA LINK / ADMIN\",\"web.shell.loading_config\":\"Loading configuration\",\"web.shell.open_from_host\":\"Sign in to AstrBot, then open Quota Query from the plugin details page.\",\"web.shell.page_title\":\"Quota Query\",\"web.shell.project_name\":\"Yomihime’s Quota Link\",\"web.shell.revision\":\"Configuration revision {revision}\",\"web.shell.scope\":\"Unified queries · Separate credentials\",\"web.shell.waiting\":\"Waiting for an admin session\",\"web.status.accepted\":\"Send request accepted. Delivery is unconfirmed.\",\"web.status.auth_paused\":\"Credentials were rejected. Checks are paused.\",\"web.status.blocked\":\"Alert delivery is paused. Check the reason below.\",\"web.status.disabled\":\"Alerts are off\",\"web.status.error\":\"Check failed. The previous alert state is retained.\",\"web.status.failed\":\"Delivery failed\",\"web.status.incomplete\":\"Configuration is incomplete. Monitoring has not started.\",\"web.status.low\":\"Balance is at or below the threshold. The alert remains active.\",\"web.status.monitoring\":\"Monitoring balance\",\"web.status.normal\":\"Balance is above the threshold\",\"web.status.paused\":\"Authentication or permission check failed. Correct the settings or retry manually to resume checks.\",\"web.status.pending\":\"Waiting to check\",\"web.status.pending_send\":\"Waiting to combine notifications\",\"web.status.recovered\":\"Balance has recovered\",\"web.status.recovering\":\"Balance has risen and remains below the recovery threshold\",\"web.status.stale\":\"The result expired or its metric or unit differs. It will be skipped for alert evaluation.\",\"web.status.storage_unavailable\":\"Alert state storage is unavailable. Alerts are inactive.\",\"web.status.submitted\":\"Submitted to the platform. Final delivery is unconfirmed.\",\"web.status.unit_changed\":\"Monitored metric or unit changed. Confirm the new unit.\",\"web.status.unit_unidentified\":\"Waiting to identify the unit\",\"web.status.units_ambiguous\":\"Multiple units to confirm\",\"web.status.unknown\":\"Delivery outcome is unknown. Verify before retrying.\",\"web.status.waiting\":\"Waiting for the next check\",\"web.status.waiting_budget\":\"Waiting at least five minutes between sends to the same destination. Delivery will be retried after a later valid check.\",\"web.storage.eyebrow\":\"LOCAL ENCRYPTION\",\"web.storage.key_handling\":\"The runtime manages the master key. It cannot be entered, exported, or restored on this page.\",\"web.storage.ready\":\"Encrypted storage ready\",\"web.storage.title\":\"Storage security\",\"web.storage.troubleshooting\":\"For storage failures, check the host logs for security error codes. Keep keys out of public logs and screenshots.\",\"web.storage.unavailable\":\"Encrypted storage unavailable\",\"web.storage.unavailable_warning\":\"Encrypted storage is unavailable. Check the runtime before saving new credentials. Plaintext storage is disabled.\",\"web.unit.ambiguous\":\"Multiple units were found. Select one.\",\"web.unit.awaiting\":\"Pending\",\"web.unit.candidates_stale\":\"The query candidates expired. Query again. Confirmed unit records are kept.\",\"web.unit.changed\":\"The query unit changed. Confirm it again.\",\"web.unit.choices_expired\":\"The candidates expired. Query again before choosing a unit.\",\"web.unit.choose\":\"Select unit\",\"web.unit.confirm\":\"Confirm unit\",\"web.unit.confirm_no_threshold\":\"Switch to {unit}? No threshold is set yet.\",\"web.unit.confirm_observed\":\"Confirm the unit returned by the query.\",\"web.unit.confirm_threshold\":\"Switch to {unit} and compare against the threshold {threshold}?\",\"web.unit.confirm_title\":\"Confirm {unit} as the unit?\",\"web.unit.current\":\"Unit: {unit}\",\"web.unit.detect_on_account_save\":\"Save the account to detect the unit.\",\"web.unit.detect_on_query\":\"The unit is detected after a balance query.\",\"web.unit.detect_on_save\":\"Save settings to redetect the unit.\",\"web.unit.finish_credential_before_query\":\"Finish or cancel credential entry before querying again.\",\"web.unit.loading\":\"Working…\",\"web.unit.metric_changed\":\"Monitored metric changed from {previous} to {current}. Confirm the unit and thresholds again.\",\"web.unit.metric_edited\":\"The monitored metric changed to “{metric}”. Save, query again, and confirm the unit.\",\"web.unit.metric_or_unit_changed\":\"The monitored metric or unit changed. Confirm again.\",\"web.unit.no_choices\":\"No candidates are available. Query again before choosing a unit.\",\"web.unit.query\":\"Query for units again\",\"web.unit.query_changed\":\"Query settings changed. Confirm the unit and thresholds again.\",\"web.unit.query_edited\":\"Query settings changed. Save them to redetect the unit.\",\"web.unit.query_hint\":\"Queries this account’s balance endpoint for new candidates without sending an alert.\",\"web.unit.read\":\"Read unit status\",\"web.unit.recorded\":\"Unit recorded: \",\"web.unit.save_before_query\":\"Save settings to query the unit again.\",\"web.unit.title\":\"Alert unit\",\"web.unit.verified\":\"Unit verified.\",\"web.unit.verified_expired\":\"Unit verified. Query candidates expired, but the confirmed unit remains valid.\",\"web.validation.account_alert\":\"{account}: {message}\",\"web.validation.account_bounds\":\"The account timeout is capped at 120 seconds and the cache at 86400 seconds.\",\"web.validation.account_id\":\"Account IDs must be present and unique.\",\"web.validation.account_name\":\"Enter an account display name.\",\"web.validation.account_positive\":\"Account timeout and cache values must be positive.\",\"web.validation.alert_fields\":\"Invalid alert settings fields.\",\"web.validation.alert_prerequisites\":\"Before enabling alerts, enable the account, enter a threshold, and add at least one global alert destination.\",\"web.validation.decimal_length\":\"Use up to 30 integer digits and 18 decimal places, without exponent notation.\",\"web.validation.duplicate_umo\":\"Duplicate UMO. Combine the entries into one line.\",\"web.validation.finite_decimal\":\"Enter a finite decimal string without an exponent.\",\"web.validation.global_bounds\":\"Check the limits shown for global settings.\",\"web.validation.group_mentions\":\"Only numeric QQ group sessions support @QQ numbers. Remove the @ suffix from private and other sessions.\",\"web.validation.id_limit\":\"Up to {limit} QQ numbers are allowed.\",\"web.validation.interval_input\":\"Enter a whole number from 1 to 4320. The value is never adjusted automatically.\",\"web.validation.interval_range\":\"Check interval must be a whole number of minutes from 1 to 4320.\",\"web.validation.invalid_input\":\"Check the input.\",\"web.validation.invisible_chars\":\"Remove control and invisible characters.\",\"web.validation.json_object\":\"Enter a valid JSON object without credentials.\",\"web.validation.language\":\"Select a supported plugin language.\",\"web.validation.llm_fields\":\"Invalid AI message configuration.\",\"web.validation.llm_ids\":\"Model and persona IDs must be text up to 128 characters long.\",\"web.validation.llm_switch\":\"Invalid AI message toggle.\",\"web.validation.mentions_suffix\":\"After the UMO, enter space-separated @QQ numbers, or specify scene=qq_group or scene=qq_c2c for official QQ.\",\"web.validation.metric\":\"Choose a metric supported by this provider.\",\"web.validation.private_allowlist\":\"Use platform:userID for the private chat allowlist.\",\"web.validation.qq_id\":\"Use a positive QQ number of 1 to 20 ASCII digits. @all, nicknames, and CQ codes are unsupported.\",\"web.validation.query_parameters\":\"Enter valid query settings.\",\"web.validation.recovery_order\":\"Recovery threshold must be higher than the trigger threshold.\",\"web.validation.repeat_input\":\"Enter a whole number of minutes from 0 to 4320.\",\"web.validation.repeat_range\":\"Repeat interval must be a whole number of minutes from 0 to 4320. Use 0 to disable repeats.\",\"web.validation.target_fields\":\"Each destination needs a UMO and a mention list.\",\"web.validation.target_limit\":\"Up to 20 alert destinations are allowed.\",\"web.validation.target_line\":\"Line {line}: {message}\",\"web.validation.targets_text\":\"Enter alert destinations.\",\"web.validation.umo_format\":\"Enter the full UMO as platform-instance:message-type:session-ID.\",\"web.validation.umo_invisible\":\"UMO cannot contain control or invisible characters.\",\"web.validation.umo_type\":\"Message type must be FriendMessage, GroupMessage, or OtherMessage.\",\"web.validation.unit\":\"Enter a unit of up to 32 characters.\"}"),
	metadata: {
		display_name: "Yomihime’s Quota Link",
		short_desc: "Monitor AI API balances and usage",
		desc: "Query AI API balances, usage, and quotas. Manage accounts and configure quota alerts in one place."
	},
	config: { enable_admin_page: {
		description: "Enable the plugin management page",
		hint: "Manage accounts, credentials, query permissions, and timeouts from the plugin page. Legacy settings are kept until you confirm migration."
	} }
}, i = "zh-CN", a = [
	"zh-CN",
	"zh-TW",
	"ja-JP",
	"en-US"
], o = {
	"zh-CN": e.strings,
	"zh-TW": t.strings,
	"ja-JP": n.strings,
	"en-US": r.strings
};
function s(e) {
	return e === "auto" || a.some((t) => t === e);
}
function c(e, t) {
	let n = a.find((t) => t === e);
	if (n) return n;
	if (typeof t != "string" || t.length > 32) return i;
	let r;
	try {
		r = new Intl.Locale(t.trim().replaceAll("_", "-"));
	} catch {
		return i;
	}
	return r.language === "ja" ? "ja-JP" : r.language === "en" ? "en-US" : r.language === "zh" && (r.script === "Hant" || r.script !== "Hans" && [
		"TW",
		"HK",
		"MO"
	].includes(r.region)) ? "zh-TW" : i;
}
function l(t, n = i, r = {}) {
	let a = Object.hasOwn(o, n) ? o[n] : o[c("auto", n)], s = Object.hasOwn(a, t) ? a[t] : void 0;
	return (typeof s == "string" && s.trim() ? s : Object.hasOwn(e.strings, t) ? e.strings[t] : t).replace(/\{([A-Za-z_][A-Za-z0-9_]*)\}/g, (e, t) => {
		if (!Object.hasOwn(r, t)) return e;
		let i = r[t];
		return i instanceof u ? d(i, n) : String(i);
	});
}
var u = class extends Error {
	constructor(e, t) {
		super(l(e, i, t)), this.id = e, this.args = t;
	}
};
function d(e, t) {
	return e instanceof u ? l(e.id, t, e.args) : l("web.validation.invalid_input", t);
}
//#endregion
//#region node_modules/@vue/shared/dist/shared.esm-bundler.js
// @__NO_SIDE_EFFECTS__
function f(e) {
	let t = /* @__PURE__ */ Object.create(null);
	for (let n of e.split(",")) t[n] = 1;
	return (e) => e in t;
}
var p = {}, m = [], h = () => {}, g = () => !1, _ = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && (e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), v = (e) => e.startsWith("onUpdate:"), y = Object.assign, b = (e, t) => {
	let n = e.indexOf(t);
	n > -1 && e.splice(n, 1);
}, x = Object.prototype.hasOwnProperty, S = (e, t) => x.call(e, t), C = Array.isArray, w = (e) => te(e) === "[object Map]", T = (e) => te(e) === "[object Set]", E = (e) => te(e) === "[object Date]", D = (e) => typeof e == "function", O = (e) => typeof e == "string", k = (e) => typeof e == "symbol", A = (e) => typeof e == "object" && !!e, ee = (e) => (A(e) || D(e)) && D(e.then) && D(e.catch), j = Object.prototype.toString, te = (e) => j.call(e), ne = (e) => te(e).slice(8, -1), re = (e) => te(e) === "[object Object]", ie = (e) => O(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, ae = /* @__PURE__ */ f(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"), oe = (e) => {
	let t = /* @__PURE__ */ Object.create(null);
	return ((n) => t[n] || (t[n] = e(n)));
}, se = /-\w/g, ce = oe((e) => e.replace(se, (e) => e.slice(1).toUpperCase())), le = /\B([A-Z])/g, ue = oe((e) => e.replace(le, "-$1").toLowerCase()), de = oe((e) => e.charAt(0).toUpperCase() + e.slice(1)), fe = oe((e) => e ? `on${de(e)}` : ""), pe = (e, t) => !Object.is(e, t), me = (e, ...t) => {
	for (let n = 0; n < e.length; n++) e[n](...t);
}, he = (e, t, n, r = !1) => {
	Object.defineProperty(e, t, {
		configurable: !0,
		enumerable: !1,
		writable: r,
		value: n
	});
}, ge = (e) => {
	let t = parseFloat(e);
	return isNaN(t) ? e : t;
}, _e = (e) => {
	let t = O(e) ? Number(e) : NaN;
	return isNaN(t) ? e : t;
}, ve, ye = () => ve ||= typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {};
function M(e) {
	if (C(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) {
			let r = e[n], i = O(r) ? Ce(r) : M(r);
			if (i) for (let e in i) t[e] = i[e];
		}
		return t;
	}
	if (O(e) || A(e)) return e;
}
var be = /;(?![^(]*\))/g, xe = /:([^]+)/, Se = /"(?:[^"\\]|\\[^])*"|'(?:[^'\\]|\\[^])*'|\\[^]|\/\*[^]*?\*\//g;
function Ce(e) {
	let t = {};
	return e.replace(Se, (e) => e.startsWith("/*") ? "" : e).split(be).forEach((e) => {
		if (e) {
			let n = e.split(xe);
			n.length > 1 && (t[n[0].trim()] = n[1].trim());
		}
	}), t;
}
function we(e) {
	let t = "";
	if (O(e)) t = e;
	else if (C(e)) for (let n = 0; n < e.length; n++) {
		let r = we(e[n]);
		r && (t += r + " ");
	}
	else if (A(e)) for (let n in e) e[n] && (t += n + " ");
	return t.trim();
}
var Te = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", Ee = /* @__PURE__ */ f(Te);
Te + "";
function De(e) {
	return !!e || e === "";
}
function Oe(e, t, n) {
	if (e.length !== t.length) return !1;
	let r = !0;
	for (let i = 0; r && i < e.length; i++) r = Me(e[i], t[i], n);
	return r;
}
function ke(e, t, n) {
	if (e.size !== t.size) return !1;
	let r = Array.from(t), i = new Uint8Array(r.length);
	for (let t of e) {
		let e = -1;
		for (let a = 0; a < r.length; a++) if (!i[a] && Me(t, r[a], n)) {
			e = a;
			break;
		}
		if (e < 0) return !1;
		i[e] = 1;
	}
	return !0;
}
function Ae(e, t, n) {
	let r = w(e), i = w(t);
	if (r || i || (r = T(e), i = T(t), r || i)) return r && i ? ke(e, t, n) : !1;
	if (Object.keys(e).length !== Object.keys(t).length) return !1;
	for (let r in e) {
		let i = e.hasOwnProperty(r), a = t.hasOwnProperty(r);
		if (i && !a || !i && a || !Me(e[r], t[r], n)) return !1;
	}
	return String(e) === String(t);
}
function je(e, t, n, r) {
	n ||= [/* @__PURE__ */ new Map(), /* @__PURE__ */ new Map()];
	let [i, a] = n;
	if (i.has(e) || a.has(t)) return i.get(e) === t && a.get(t) === e;
	i.set(e, t), a.set(t, e);
	let o = r(e, t, n);
	return i.delete(e), a.delete(t), o;
}
function Me(e, t, n) {
	if (e === t) return !0;
	let r = E(e), i = E(t);
	return r || i ? r && i ? e.getTime() === t.getTime() : !1 : (r = k(e), i = k(t), r || i ? e === t : (r = C(e), i = C(t), r || i ? r && i ? je(e, t, n, Oe) : !1 : (r = A(e), i = A(t), r || i ? !r || !i ? !1 : je(e, t, n, Ae) : String(e) === String(t))));
}
//#endregion
//#region node_modules/@vue/reactivity/dist/reactivity.esm-bundler.js
var Ne, Pe = class {
	constructor(e = !1) {
		this.detached = e, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this._warnOnRun = !0, this.__v_skip = !0, !e && Ne && (Ne.active ? (this.parent = Ne, this.index = (Ne.scopes || (Ne.scopes = [])).push(this) - 1) : (this._active = !1, this._warnOnRun = !1));
	}
	get active() {
		return this._active;
	}
	pause() {
		if (this._active) {
			this._isPaused = !0;
			let e, t;
			if (this.scopes) {
				let n = this.scopes.slice();
				for (e = 0, t = n.length; e < t; e++) n[e].pause();
			}
			for (e = 0, t = this.effects.length; e < t; e++) this.effects[e].pause();
		}
	}
	resume() {
		if (this._active && this._isPaused) {
			this._isPaused = !1;
			let e, t;
			if (this.scopes) {
				let n = this.scopes.slice();
				for (e = 0, t = n.length; e < t; e++) n[e].resume();
			}
			let n = this.effects.slice();
			for (e = 0, t = n.length; e < t; e++) n[e].resume();
		}
	}
	run(e) {
		if (this._active) {
			let t = Ne;
			try {
				return Ne = this, e();
			} finally {
				Ne = t;
			}
		}
	}
	on() {
		++this._on === 1 && (this.prevScope = Ne, Ne = this);
	}
	off() {
		if (this._on > 0 && --this._on === 0) {
			if (Ne === this) Ne = this.prevScope;
			else {
				let e = Ne;
				for (; e;) {
					if (e.prevScope === this) {
						e.prevScope = this.prevScope;
						break;
					}
					e = e.prevScope;
				}
			}
			this.prevScope = void 0;
		}
	}
	stop(e) {
		if (this._active) {
			this._active = !1;
			let t, n;
			for (t = 0, n = this.effects.length; t < n; t++) this.effects[t].stop();
			for (this.effects.length = 0, t = 0, n = this.cleanups.length; t < n; t++) this.cleanups[t]();
			if (this.cleanups.length = 0, this.scopes) {
				let e = this.scopes.slice();
				for (t = 0, n = e.length; t < n; t++) e[t].stop(!0);
				this.scopes.length = 0;
			}
			if (!this.detached && this.parent && !e) {
				let e = this.parent.scopes.pop();
				e && e !== this && (this.parent.scopes[this.index] = e, e.index = this.index);
			}
			this.parent = void 0;
		}
	}
};
function Fe() {
	return Ne;
}
var N, Ie = /* @__PURE__ */ new WeakSet(), Le = class {
	constructor(e) {
		this.fn = e, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, Ne && (Ne.active ? Ne.effects.push(this) : this.flags &= -2);
	}
	pause() {
		this.flags |= 64;
	}
	resume() {
		this.flags & 64 && (this.flags &= -65, Ie.has(this) && (Ie.delete(this), this.trigger()));
	}
	notify() {
		this.flags & 2 && !(this.flags & 32) || this.flags & 8 || Ve(this);
	}
	run() {
		if (!(this.flags & 1)) return this.fn();
		this.flags |= 2, et(this), We(this);
		let e = N, t = Xe;
		N = this, Xe = !0;
		try {
			return this.fn();
		} finally {
			Ge(this), N = e, Xe = t, this.flags &= -3;
		}
	}
	stop() {
		if (this.flags & 1) {
			for (let e = this.deps; e; e = e.nextDep) Je(e);
			this.deps = this.depsTail = void 0, et(this), this.onStop && this.onStop(), this.flags &= -2;
		}
	}
	trigger() {
		this.flags & 64 ? Ie.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
	}
	runIfDirty() {
		Ke(this) && this.run();
	}
	get dirty() {
		return Ke(this);
	}
}, Re = 0, ze, Be;
function Ve(e, t = !1) {
	if (e.flags |= 8, t) {
		e.next = Be, Be = e;
		return;
	}
	e.next = ze, ze = e;
}
function He() {
	Re++;
}
function Ue() {
	if (--Re > 0) return;
	if (Be) {
		let e = Be;
		for (Be = void 0; e;) {
			let t = e.next;
			e.next = void 0, e.flags &= -9, e = t;
		}
	}
	let e;
	for (; ze;) {
		let t = ze;
		for (ze = void 0; t;) {
			let n = t.next;
			if (t.next = void 0, t.flags &= -9, t.flags & 1) try {
				t.trigger();
			} catch (t) {
				e ||= t;
			}
			t = n;
		}
	}
	if (e) throw e;
}
function We(e) {
	for (let t = e.deps; t; t = t.nextDep) t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function Ge(e) {
	let t, n = e.depsTail, r = n;
	for (; r;) {
		let e = r.prevDep;
		r.version === -1 ? (r === n && (n = e), Je(r), Ye(r)) : t = r, r.dep.activeLink = r.prevActiveLink, r.prevActiveLink = void 0, r = e;
	}
	e.deps = t, e.depsTail = n;
}
function Ke(e) {
	for (let t = e.deps; t; t = t.nextDep) if (t.dep.version !== t.version || t.dep.computed && (qe(t.dep.computed) || t.dep.version !== t.version)) return !0;
	return !!e._dirty;
}
function qe(e) {
	if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === tt) || (e.globalVersion = tt, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !Ke(e)))) return;
	e.flags |= 2;
	let t = e.dep, n = N, r = Xe;
	N = e, Xe = !0;
	try {
		We(e);
		let n = e.fn(e._value);
		(t.version === 0 || pe(n, e._value)) && (e.flags |= 128, e._value = n, t.version++);
	} catch (e) {
		throw t.version++, e;
	} finally {
		N = n, Xe = r, Ge(e), e.flags &= -3;
	}
}
function Je(e, t = !1) {
	let { dep: n, prevSub: r, nextSub: i } = e;
	if (r && (r.nextSub = i, e.prevSub = void 0), i && (i.prevSub = r, e.nextSub = void 0), n.subs === e && (n.subs = r, !r && n.computed)) {
		n.computed.flags &= -5;
		for (let e = n.computed.deps; e; e = e.nextDep) Je(e, !0);
	}
	!t && !--n.sc && n.map && n.map.delete(n.key);
}
function Ye(e) {
	let { prevDep: t, nextDep: n } = e;
	t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
var Xe = !0, Ze = [];
function Qe() {
	Ze.push(Xe), Xe = !1;
}
function $e() {
	let e = Ze.pop();
	Xe = e === void 0 || e;
}
function et(e) {
	let { cleanup: t } = e;
	if (e.cleanup = void 0, t) {
		let e = N;
		N = void 0;
		try {
			t();
		} finally {
			N = e;
		}
	}
}
var tt = 0, nt = class {
	constructor(e, t) {
		this.sub = e, this.dep = t, this.version = t.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
	}
}, rt = class {
	constructor(e) {
		this.computed = e, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
	}
	track(e) {
		if (!N || !Xe || N === this.computed) return;
		let t = this.activeLink;
		if (t === void 0 || t.sub !== N) t = this.activeLink = new nt(N, this), N.deps ? (t.prevDep = N.depsTail, N.depsTail.nextDep = t, N.depsTail = t) : N.deps = N.depsTail = t, it(t);
		else if (t.version === -1 && (t.version = this.version, t.nextDep)) {
			let e = t.nextDep;
			e.prevDep = t.prevDep, t.prevDep && (t.prevDep.nextDep = e), t.prevDep = N.depsTail, t.nextDep = void 0, N.depsTail.nextDep = t, N.depsTail = t, N.deps === t && (N.deps = e);
		}
		return t;
	}
	trigger(e) {
		this.version++, tt++, this.notify(e);
	}
	notify(e) {
		He();
		try {
			for (let e = this.subs; e; e = e.prevSub) e.sub.notify() && e.sub.dep.notify();
		} finally {
			Ue();
		}
	}
};
function it(e) {
	if (e.dep.sc++, e.sub.flags & 4) {
		let t = e.dep.computed;
		if (t && !e.dep.subs) {
			t.flags |= 20;
			for (let e = t.deps; e; e = e.nextDep) it(e);
		}
		let n = e.dep.subs;
		n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subs = e;
	}
}
var at = /* @__PURE__ */ new WeakMap(), ot = /* @__PURE__ */ Symbol(""), st = /* @__PURE__ */ Symbol(""), ct = /* @__PURE__ */ Symbol("");
function lt(e, t, n) {
	if (Xe && N) {
		let t = at.get(e);
		t || at.set(e, t = /* @__PURE__ */ new Map());
		let r = t.get(n);
		r || (t.set(n, r = new rt()), r.map = t, r.key = n), r.track();
	}
}
function ut(e, t, n, r, i, a) {
	let o = at.get(e);
	if (!o) {
		tt++;
		return;
	}
	let s = (e) => {
		e && e.trigger();
	};
	if (He(), t === "clear") o.forEach(s);
	else {
		let i = C(e), a = i && ie(n);
		if (i && n === "length") {
			let e = Number(r);
			o.forEach((t, n) => {
				(n === "length" || n === ct || !k(n) && n >= e) && s(t);
			});
		} else switch ((n !== void 0 || o.has(void 0)) && s(o.get(n)), a && s(o.get(ct)), t) {
			case "add":
				i ? a && s(o.get("length")) : (s(o.get(ot)), w(e) && s(o.get(st)));
				break;
			case "delete":
				i || (s(o.get(ot)), w(e) && s(o.get(st)));
				break;
			case "set": w(e) && s(o.get(ot));
		}
	}
	Ue();
}
function dt(e, t) {
	let n = at.get(e);
	return n && n.get(t);
}
function ft(e) {
	let t = /* @__PURE__ */ P(e);
	return t === e || (lt(t, "iterate", ct), /* @__PURE__ */ Zt(e)) ? t : /* @__PURE__ */ Xt(e) ? /* @__PURE__ */ Yt(e) ? t.map((e) => tn(en(e))) : t.map(tn) : t.map(en);
}
function pt(e) {
	return lt(e = /* @__PURE__ */ P(e), "iterate", ct), e;
}
function mt(e, t) {
	return /* @__PURE__ */ Xt(e) ? tn(/* @__PURE__ */ Yt(e) ? en(t) : t) : en(t);
}
var ht = {
	__proto__: null,
	[Symbol.iterator]() {
		return gt(this, Symbol.iterator, (e) => mt(this, e));
	},
	concat(...e) {
		return ft(this).concat(...e.map((e) => C(e) ? ft(e) : e));
	},
	entries() {
		return gt(this, "entries", (e) => (e[1] = mt(this, e[1]), e));
	},
	every(e, t) {
		return vt(this, "every", e, t, void 0, arguments);
	},
	filter(e, t) {
		return vt(this, "filter", e, t, (e) => e.map((e) => mt(this, e)), arguments);
	},
	find(e, t) {
		return vt(this, "find", e, t, (e) => mt(this, e), arguments);
	},
	findIndex(e, t) {
		return vt(this, "findIndex", e, t, void 0, arguments);
	},
	findLast(e, t) {
		return vt(this, "findLast", e, t, (e) => mt(this, e), arguments);
	},
	findLastIndex(e, t) {
		return vt(this, "findLastIndex", e, t, void 0, arguments);
	},
	forEach(e, t) {
		return vt(this, "forEach", e, t, void 0, arguments);
	},
	includes(...e) {
		return bt(this, "includes", e);
	},
	indexOf(...e) {
		return bt(this, "indexOf", e);
	},
	join(e) {
		return ft(this).join(e);
	},
	lastIndexOf(...e) {
		return bt(this, "lastIndexOf", e);
	},
	map(e, t) {
		return vt(this, "map", e, t, void 0, arguments);
	},
	pop() {
		return xt(this, "pop");
	},
	push(...e) {
		return xt(this, "push", e);
	},
	reduce(e, ...t) {
		return yt(this, "reduce", e, t);
	},
	reduceRight(e, ...t) {
		return yt(this, "reduceRight", e, t);
	},
	shift() {
		return xt(this, "shift");
	},
	some(e, t) {
		return vt(this, "some", e, t, void 0, arguments);
	},
	splice(...e) {
		return xt(this, "splice", e);
	},
	toReversed() {
		return ft(this).toReversed();
	},
	toSorted(e) {
		return ft(this).toSorted(e);
	},
	toSpliced(...e) {
		return ft(this).toSpliced(...e);
	},
	unshift(...e) {
		return xt(this, "unshift", e);
	},
	values() {
		return gt(this, "values", (e) => mt(this, e));
	}
};
function gt(e, t, n) {
	let r = pt(e), i = r[t]();
	return r !== e && !/* @__PURE__ */ Zt(e) && (i._next = i.next, i.next = () => {
		let e = i._next();
		return e.done || (e.value = n(e.value)), e;
	}), i;
}
var _t = Array.prototype;
function vt(e, t, n, r, i, a) {
	let o = pt(e), s = o !== e && !/* @__PURE__ */ Zt(e), c = o[t];
	if (c !== _t[t]) {
		let t = c.apply(e, a);
		return s ? en(t) : t;
	}
	let l = n;
	o !== e && (s ? l = function(t, r) {
		return n.call(this, mt(e, t), r, e);
	} : n.length > 2 && (l = function(t, r) {
		return n.call(this, t, r, e);
	}));
	let u = c.call(o, l, r);
	return s && i ? i(u) : u;
}
function yt(e, t, n, r) {
	let i = pt(e), a = i !== e && !/* @__PURE__ */ Zt(e), o = n, s = !1;
	i !== e && (a ? (s = r.length === 0, o = function(t, r, i) {
		return s && (s = !1, t = mt(e, t)), n.call(this, t, mt(e, r), i, e);
	}) : n.length > 3 && (o = function(t, r, i) {
		return n.call(this, t, r, i, e);
	}));
	let c = i[t](o, ...r);
	return s ? mt(e, c) : c;
}
function bt(e, t, n) {
	let r = /* @__PURE__ */ P(e);
	lt(r, "iterate", ct);
	let i = r[t](...n);
	return (i === -1 || i === !1) && /* @__PURE__ */ Qt(n[0]) ? (n[0] = /* @__PURE__ */ P(n[0]), r[t](...n)) : i;
}
function xt(e, t, n = []) {
	Qe(), He();
	let r = (/* @__PURE__ */ P(e))[t].apply(e, n);
	return Ue(), $e(), r;
}
var St = /* @__PURE__ */ f("__proto__,__v_isRef,__isVue"), Ct = new Set(/* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(k));
function wt(e) {
	k(e) || (e = String(e));
	let t = /* @__PURE__ */ P(this);
	return lt(t, "has", e), t.hasOwnProperty(e);
}
var Tt = class {
	constructor(e = !1, t = !1) {
		this._isReadonly = e, this._isShallow = t;
	}
	get(e, t, n) {
		if (t === "__v_skip") return e.__v_skip;
		let r = this._isReadonly, i = this._isShallow;
		if (t === "__v_isReactive") return !r;
		if (t === "__v_isReadonly") return r;
		if (t === "__v_isShallow") return i;
		if (t === "__v_raw") return n === (r ? i ? Ut : Ht : i ? Vt : Bt).get(e) || Object.getPrototypeOf(e) === Object.getPrototypeOf(n) ? e : void 0;
		let a = C(e);
		if (!r) {
			let e;
			if (a && (e = ht[t])) return e;
			if (t === "hasOwnProperty") return wt;
		}
		let o = Reflect.get(e, t, /* @__PURE__ */ nn(e) ? e : n);
		if ((k(t) ? Ct.has(t) : St(t)) || (r || lt(e, "get", t), i)) return o;
		if (/* @__PURE__ */ nn(o)) {
			let e = a && ie(t) ? o : o.value;
			return r && A(e) ? /* @__PURE__ */ qt(e) : e;
		}
		return A(o) ? r ? /* @__PURE__ */ qt(o) : /* @__PURE__ */ Gt(o) : o;
	}
}, Et = class extends Tt {
	constructor(e = !1) {
		super(!1, e);
	}
	set(e, t, n, r) {
		let i = e[t], a = C(e) && ie(t);
		if (!this._isShallow) {
			let e = /* @__PURE__ */ Xt(i);
			if (!/* @__PURE__ */ Zt(n) && !/* @__PURE__ */ Xt(n) && (i = /* @__PURE__ */ P(i), n = /* @__PURE__ */ P(n)), !a && /* @__PURE__ */ nn(i) && !/* @__PURE__ */ nn(n)) return e || (i.value = n), !0;
		}
		let o = a ? Number(t) < e.length : S(e, t), s = Reflect.set(e, t, n, /* @__PURE__ */ nn(e) ? e : r);
		return e === /* @__PURE__ */ P(r) && s && (o ? pe(n, i) && ut(e, "set", t, n, i) : ut(e, "add", t, n)), s;
	}
	deleteProperty(e, t) {
		let n = S(e, t), r = e[t], i = Reflect.deleteProperty(e, t);
		return i && n && ut(e, "delete", t, void 0, r), i;
	}
	has(e, t) {
		let n = Reflect.has(e, t);
		return (!k(t) || !Ct.has(t)) && lt(e, "has", t), n;
	}
	ownKeys(e) {
		return lt(e, "iterate", C(e) ? "length" : ot), Reflect.ownKeys(e);
	}
}, Dt = class extends Tt {
	constructor(e = !1) {
		super(!0, e);
	}
	set(e, t) {
		return !0;
	}
	deleteProperty(e, t) {
		return !0;
	}
}, Ot = /* @__PURE__ */ new Et(), kt = /* @__PURE__ */ new Dt(), At = /* @__PURE__ */ new Et(!0), jt = (e) => e, Mt = (e) => Reflect.getPrototypeOf(e);
function Nt(e, t, n) {
	return function(...r) {
		let i = this.__v_raw, a = /* @__PURE__ */ P(i), o = w(a), s = e === "entries" || e === Symbol.iterator && o, c = e === "keys" && o, l = i[e](...r), u = n ? jt : t ? tn : en;
		return !t && lt(a, "iterate", c ? st : ot), y(Object.create(l), { next() {
			let { value: e, done: t } = l.next();
			return t ? {
				value: e,
				done: t
			} : {
				value: s ? [u(e[0]), u(e[1])] : u(e),
				done: t
			};
		} });
	};
}
function Pt(e) {
	return function(...t) {
		return e === "delete" ? !1 : e === "clear" ? void 0 : this;
	};
}
function Ft(e, t) {
	let n = {
		get(n) {
			let r = this.__v_raw, i = /* @__PURE__ */ P(r), a = /* @__PURE__ */ P(n);
			e || (pe(n, a) && lt(i, "get", n), lt(i, "get", a));
			let { has: o } = Mt(i), s = t ? jt : e ? tn : en;
			if (o.call(i, n)) return s(r.get(n));
			if (o.call(i, a)) return s(r.get(a));
			r !== i && r.get(n);
		},
		get size() {
			let t = this.__v_raw;
			return !e && lt(/* @__PURE__ */ P(t), "iterate", ot), t.size;
		},
		has(t) {
			let n = this.__v_raw, r = /* @__PURE__ */ P(n), i = /* @__PURE__ */ P(t);
			return e || (pe(t, i) && lt(r, "has", t), lt(r, "has", i)), t === i ? n.has(t) : n.has(t) || n.has(i);
		},
		forEach(n, r) {
			let i = this, a = i.__v_raw, o = /* @__PURE__ */ P(a), s = t ? jt : e ? tn : en;
			return !e && lt(o, "iterate", ot), a.forEach((e, t) => n.call(r, s(e), s(t), i));
		}
	};
	return y(n, e ? {
		add: Pt("add"),
		set: Pt("set"),
		delete: Pt("delete"),
		clear: Pt("clear")
	} : {
		add(e) {
			let n = /* @__PURE__ */ P(this), r = Mt(n), i = /* @__PURE__ */ P(e), a = !t && !/* @__PURE__ */ Zt(e) && !/* @__PURE__ */ Xt(e) ? i : e;
			return r.has.call(n, a) || pe(e, a) && r.has.call(n, e) || pe(i, a) && r.has.call(n, i) || (n.add(a), ut(n, "add", a, a)), this;
		},
		set(e, n) {
			!t && !/* @__PURE__ */ Zt(n) && !/* @__PURE__ */ Xt(n) && (n = /* @__PURE__ */ P(n));
			let r = /* @__PURE__ */ P(this), { has: i, get: a } = Mt(r), o = i.call(r, e);
			o ||= (e = /* @__PURE__ */ P(e), i.call(r, e));
			let s = a.call(r, e);
			return r.set(e, n), o ? pe(n, s) && ut(r, "set", e, n, s) : ut(r, "add", e, n), this;
		},
		delete(e) {
			let t = /* @__PURE__ */ P(this), { has: n, get: r } = Mt(t), i = n.call(t, e);
			i ||= (e = /* @__PURE__ */ P(e), n.call(t, e));
			let a = r ? r.call(t, e) : void 0, o = t.delete(e);
			return i && ut(t, "delete", e, void 0, a), o;
		},
		clear() {
			let e = /* @__PURE__ */ P(this), t = e.size !== 0, n = e.clear();
			return t && ut(e, "clear", void 0, void 0, void 0), n;
		}
	}), [
		"keys",
		"values",
		"entries",
		Symbol.iterator
	].forEach((r) => {
		n[r] = Nt(r, e, t);
	}), n;
}
function It(e, t) {
	let n = Ft(e, t);
	return (t, r, i) => r === "__v_isReactive" ? !e : r === "__v_isReadonly" ? e : r === "__v_raw" ? t : Reflect.get(S(n, r) && r in t ? n : t, r, i);
}
var Lt = { get: /* @__PURE__ */ It(!1, !1) }, Rt = { get: /* @__PURE__ */ It(!1, !0) }, zt = { get: /* @__PURE__ */ It(!0, !1) }, Bt = /* @__PURE__ */ new WeakMap(), Vt = /* @__PURE__ */ new WeakMap(), Ht = /* @__PURE__ */ new WeakMap(), Ut = /* @__PURE__ */ new WeakMap();
function Wt(e) {
	switch (e) {
		case "Object":
		case "Array": return 1;
		case "Map":
		case "Set":
		case "WeakMap":
		case "WeakSet": return 2;
		default: return 0;
	}
}
// @__NO_SIDE_EFFECTS__
function Gt(e) {
	return /* @__PURE__ */ Xt(e) ? e : Jt(e, !1, Ot, Lt, Bt);
}
// @__NO_SIDE_EFFECTS__
function Kt(e) {
	return Jt(e, !1, At, Rt, Vt);
}
// @__NO_SIDE_EFFECTS__
function qt(e) {
	return Jt(e, !0, kt, zt, Ht);
}
function Jt(e, t, n, r, i) {
	if (!A(e) || e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e)) return e;
	let a = i.get(e);
	if (a) return a;
	let o = Wt(ne(e));
	if (o === 0) return e;
	let s = new Proxy(e, o === 2 ? r : n);
	return i.set(e, s), s;
}
// @__NO_SIDE_EFFECTS__
function Yt(e) {
	return /* @__PURE__ */ Xt(e) ? /* @__PURE__ */ Yt(e.__v_raw) : !!(e && e.__v_isReactive);
}
// @__NO_SIDE_EFFECTS__
function Xt(e) {
	return !!(e && e.__v_isReadonly);
}
// @__NO_SIDE_EFFECTS__
function Zt(e) {
	return !!(e && e.__v_isShallow);
}
// @__NO_SIDE_EFFECTS__
function Qt(e) {
	return e ? !!e.__v_raw : !1;
}
// @__NO_SIDE_EFFECTS__
function P(e) {
	let t = e && e.__v_raw;
	return t ? /* @__PURE__ */ P(t) : e;
}
function $t(e) {
	return !S(e, "__v_skip") && Object.isExtensible(e) && he(e, "__v_skip", !0), e;
}
var en = (e) => A(e) ? /* @__PURE__ */ Gt(e) : e, tn = (e) => A(e) ? /* @__PURE__ */ qt(e) : e;
// @__NO_SIDE_EFFECTS__
function nn(e) {
	return e ? e.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function F(e) {
	return an(e, !1);
}
// @__NO_SIDE_EFFECTS__
function rn(e) {
	return an(e, !0);
}
function an(e, t) {
	return /* @__PURE__ */ nn(e) ? e : new on(e, t);
}
var on = class {
	constructor(e, t) {
		this.dep = new rt(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = t ? e : /* @__PURE__ */ P(e), this._value = t ? e : en(e), this.__v_isShallow = t;
	}
	get value() {
		return this.dep.track(), this._value;
	}
	set value(e) {
		let t = this._rawValue, n = this.__v_isShallow || /* @__PURE__ */ Zt(e) || /* @__PURE__ */ Xt(e);
		e = n ? e : /* @__PURE__ */ P(e), pe(e, t) && (this._rawValue = e, this._value = n ? e : en(e), this.dep.trigger());
	}
};
function sn(e) {
	return /* @__PURE__ */ nn(e) ? e.value : e;
}
var cn = {
	get: (e, t, n) => t === "__v_raw" ? e : sn(Reflect.get(e, t, n)),
	set: (e, t, n, r) => {
		let i = e[t];
		return /* @__PURE__ */ nn(i) && !/* @__PURE__ */ nn(n) ? (i.value = n, !0) : Reflect.set(e, t, n, r);
	}
};
function ln(e) {
	return /* @__PURE__ */ Yt(e) ? e : new Proxy(e, cn);
}
var un = class {
	constructor(e, t, n) {
		this._object = e, this._defaultValue = n, this.__v_isRef = !0, this._value = void 0, this._key = k(t) ? t : String(t), this._raw = /* @__PURE__ */ P(e);
		let r = !0, i = e;
		if (!C(e) || k(this._key) || !ie(this._key)) do
			r = !/* @__PURE__ */ Qt(i) || /* @__PURE__ */ Zt(i);
		while (r && (i = i.__v_raw));
		this._shallow = r;
	}
	get value() {
		let e = this._object[this._key];
		return this._shallow && (e = sn(e)), this._value = e === void 0 ? this._defaultValue : e;
	}
	set value(e) {
		if (this._shallow && /* @__PURE__ */ nn(this._raw[this._key])) {
			let t = this._object[this._key];
			if (/* @__PURE__ */ nn(t)) {
				t.value = e;
				return;
			}
		}
		this._object[this._key] = e;
	}
	get dep() {
		return dt(this._raw, this._key);
	}
}, dn = class {
	constructor(e) {
		this._getter = e, this.__v_isRef = !0, this.__v_isReadonly = !0, this._value = void 0;
	}
	get value() {
		return this._value = this._getter();
	}
};
// @__NO_SIDE_EFFECTS__
function fn(e, t, n) {
	return /* @__PURE__ */ nn(e) ? e : D(e) ? new dn(e) : A(e) && arguments.length > 1 ? pn(e, t, n) : /* @__PURE__ */ F(e);
}
function pn(e, t, n) {
	return new un(e, t, n);
}
var mn = class {
	constructor(e, t, n) {
		this.fn = e, this.setter = t, this._value = void 0, this.dep = new rt(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = tt - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !t, this.isSSR = n;
	}
	notify() {
		if (this.flags |= 16, !(this.flags & 8) && N !== this) return Ve(this, !0), !0;
	}
	get value() {
		let e = this.dep.track();
		return qe(this), e && (e.version = this.dep.version), this._value;
	}
	set value(e) {
		this.setter && this.setter(e);
	}
};
// @__NO_SIDE_EFFECTS__
function hn(e, t, n = !1) {
	let r, i;
	return D(e) ? r = e : (r = e.get, i = e.set), new mn(r, i, n);
}
var gn = {}, _n = /* @__PURE__ */ new WeakMap(), vn = void 0;
function yn(e, t = !1, n = vn) {
	if (n) {
		let t = _n.get(n);
		t || _n.set(n, t = []), t.push(e);
	}
}
function bn(e, t, n = p) {
	let { immediate: r, deep: i, once: a, scheduler: o, augmentJob: s, call: c } = n, l = (e) => i ? e : /* @__PURE__ */ Zt(e) || i === !1 || i === 0 ? xn(e, 1) : xn(e), u, d, f, m, g = !1, _ = !1;
	if (/* @__PURE__ */ nn(e) ? (d = () => e.value, g = /* @__PURE__ */ Zt(e)) : /* @__PURE__ */ Yt(e) ? (d = () => l(e), g = !0) : C(e) ? (_ = !0, g = e.some((e) => /* @__PURE__ */ Yt(e) || /* @__PURE__ */ Zt(e)), d = () => e.map((e) => {
		if (/* @__PURE__ */ nn(e)) return e.value;
		if (/* @__PURE__ */ Yt(e)) return l(e);
		if (D(e)) return c ? c(e, 2) : e();
	})) : d = D(e) ? t ? c ? () => c(e, 2) : e : () => {
		if (f) {
			Qe();
			try {
				f();
			} finally {
				$e();
			}
		}
		let t = vn;
		vn = u;
		try {
			return c ? c(e, 3, [m]) : e(m);
		} finally {
			vn = t;
		}
	} : h, t && i) {
		let e = d, t = i === !0 ? Infinity : i;
		d = () => xn(e(), t);
	}
	let v = Fe(), y = () => {
		u.stop(), v && v.active && b(v.effects, u);
	};
	if (a && t) {
		let e = t;
		t = (...t) => {
			let n = e(...t);
			return y(), n;
		};
	}
	let x = _ ? Array(e.length).fill(gn) : gn, S = (e) => {
		if (u.flags & 1 && (u.dirty || e)) {
			if (t) {
				let n = u.run();
				if (e || i || g || (_ ? n.some((e, t) => pe(e, x[t])) : pe(n, x))) {
					f && f();
					let e = vn;
					vn = u;
					try {
						let e = [
							n,
							x === gn ? void 0 : _ && x[0] === gn ? [] : x,
							m
						];
						x = n, c ? c(t, 3, e) : t(...e);
					} finally {
						vn = e;
					}
				}
			} else u.run();
		}
	};
	return s && s(S), u = new Le(d), u.scheduler = o ? () => o(S, !1) : S, m = (e) => yn(e, !1, u), f = u.onStop = () => {
		let e = _n.get(u);
		if (e) {
			if (c) c(e, 4);
			else for (let t of e) t();
			_n.delete(u);
		}
	}, t ? r ? S(!0) : x = u.run() : o ? o(S.bind(null, !0), !0) : u.run(), y.pause = u.pause.bind(u), y.resume = u.resume.bind(u), y.stop = y, y;
}
function xn(e, t = Infinity, n) {
	if (t <= 0 || !A(e) || e.__v_skip || (n ||= /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t)) return e;
	if (n.set(e, t), t--, /* @__PURE__ */ nn(e)) xn(e.value, t, n);
	else if (C(e)) for (let r = 0; r < e.length; r++) xn(e[r], t, n);
	else if (T(e) || w(e)) e.forEach((e) => {
		xn(e, t, n);
	});
	else if (re(e)) {
		for (let r in e) xn(e[r], t, n);
		for (let r of Object.getOwnPropertySymbols(e)) Object.prototype.propertyIsEnumerable.call(e, r) && xn(e[r], t, n);
	}
	return e;
}
//#endregion
//#region node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
function Sn(e, t, n, r) {
	try {
		return r ? e(...r) : e();
	} catch (e) {
		wn(e, t, n);
	}
}
function Cn(e, t, n, r) {
	if (D(e)) {
		let i = Sn(e, t, n, r);
		return i && ee(i) && i.catch((e) => {
			wn(e, t, n);
		}), i;
	}
	if (C(e)) {
		let i = [];
		for (let a = 0; a < e.length; a++) i.push(Cn(e[a], t, n, r));
		return i;
	}
}
function wn(e, t, n, r = !0) {
	let i = t ? t.vnode : null, { errorHandler: a, throwUnhandledErrorInProduction: o } = t && t.appContext.config || p;
	if (t) {
		let r = t.parent, i = t.proxy, o = `https://vuejs.org/error-reference/#runtime-${n}`;
		for (; r;) {
			let t = r.ec;
			if (t) {
				for (let n = 0; n < t.length; n++) if (t[n](e, i, o) === !1) return;
			}
			r = r.parent;
		}
		if (a) {
			Qe(), Sn(a, null, 10, [
				e,
				i,
				o
			]), $e();
			return;
		}
	}
	Tn(e, n, i, r, o);
}
function Tn(e, t, n, r = !0, i = !1) {
	if (i) throw e;
	console.error(e);
}
var En = [], Dn = -1, On = [], kn = null, An = 0, jn = /* @__PURE__ */ Promise.resolve(), Mn = null;
function Nn(e) {
	let t = Mn || jn;
	return e ? t.then(this ? e.bind(this) : e) : t;
}
function Pn(e) {
	let t = Dn + 1, n = En.length;
	for (; t < n;) {
		let r = t + n >>> 1, i = En[r], a = Bn(i);
		a < e || a === e && i.flags & 2 ? t = r + 1 : n = r;
	}
	return t;
}
function Fn(e) {
	if (!(e.flags & 1)) {
		let t = Bn(e), n = En[En.length - 1];
		!n || !(e.flags & 2) && t >= Bn(n) ? En.push(e) : En.splice(Pn(t), 0, e), e.flags |= 1, In();
	}
}
function In() {
	Mn ||= jn.then(Vn);
}
function Ln(e) {
	if (!C(e)) kn && e.id === -1 ? kn.splice(An + 1, 0, e) : e.flags & 1 || (On.push(e), e.flags |= 1);
	else for (let t = 0; t < e.length; t++) On.push(e[t]);
	In();
}
function Rn(e, t, n = Dn + 1) {
	for (; n < En.length; n++) {
		let t = En[n];
		if (t && t.flags & 2) {
			if (e && t.id !== e.uid) continue;
			En.splice(n, 1), n--, t.flags & 4 && (t.flags &= -2), t(), t.flags & 4 || (t.flags &= -2);
		}
	}
}
function zn(e) {
	if (On.length) {
		let e = [...new Set(On)].sort((e, t) => Bn(e) - Bn(t));
		if (On.length = 0, kn) {
			for (let t = 0; t < e.length; t++) kn.push(e[t]);
			return;
		}
		for (kn = e, An = 0; An < kn.length; An++) {
			let e = kn[An];
			e.flags & 4 && (e.flags &= -2), e.flags & 8 || e(), e.flags &= -2;
		}
		kn = null, An = 0;
	}
}
var Bn = (e) => e.id == null ? e.flags & 2 ? -1 : Infinity : e.id;
function Vn(e) {
	try {
		for (Dn = 0; Dn < En.length; Dn++) {
			let e = En[Dn];
			e && !(e.flags & 8) && (e.flags & 4 && (e.flags &= -2), Sn(e, e.i, e.i ? 15 : 14), e.flags & 4 || (e.flags &= -2));
		}
	} finally {
		for (; Dn < En.length; Dn++) {
			let e = En[Dn];
			e && (e.flags &= -2);
		}
		Dn = -1, En.length = 0, zn(e), Mn = null, (En.length || On.length) && Vn(e);
	}
}
var Hn = null, Un = null;
function Wn(e) {
	let t = Hn;
	return Hn = e, Un = e && e.type.__scopeId || null, t;
}
function Gn(e, t = Hn, n) {
	if (!t || e._n) return e;
	let r = (...n) => {
		r._d && Vi(-1);
		let i = Wn(t), a = Li.length, o;
		try {
			o = e(...n);
		} finally {
			for (let e = Li.length; e > a; e--) zi();
			Wn(i), r._d && Vi(1);
		}
		return o;
	};
	return r._n = !0, r._c = !0, r._d = !0, r;
}
function Kn(e, t, n, r) {
	let i = e.dirs, a = t && t.dirs;
	for (let o = 0; o < i.length; o++) {
		let s = i[o];
		a && (s.oldValue = a[o].value);
		let c = s.dir[r];
		c && (Qe(), Cn(c, n, 8, [
			e.el,
			s,
			e,
			t
		]), $e());
	}
}
function qn(e, t) {
	if (la) {
		let n = la.provides, r = la.parent && la.parent.provides;
		r === n && (n = la.provides = Object.create(r)), n[e] = t;
	}
}
function Jn(e, t, n = !1) {
	let r = ua();
	if (r || Gr) {
		let i = Gr ? Gr._context.provides : r ? r.parent == null || r.ce ? r.vnode.appContext && r.vnode.appContext.provides : r.parent.provides : void 0;
		if (i && e in i) return i[e];
		if (arguments.length > 1) return n && D(t) ? t.call(r && r.proxy) : t;
	}
}
var Yn = /* @__PURE__ */ Symbol.for("v-scx"), Xn = () => Jn(Yn);
function Zn(e, t) {
	return $n(e, null, t);
}
function Qn(e, t, n) {
	return $n(e, t, n);
}
function $n(e, t, n = p) {
	let { immediate: r, deep: i, flush: a, once: o } = n, s = y({}, n), c = t && r || !t && a !== "post", l;
	if (ga) {
		if (a === "sync") {
			let e = Xn();
			l = e.__watcherHandles ||= [];
		} else if (!c) {
			let e = () => {};
			return e.stop = h, e.resume = h, e.pause = h, e;
		}
	}
	let u = la;
	s.call = (e, t, n) => Cn(e, u, t, n);
	let d = !1;
	a === "post" ? s.scheduler = (e) => {
		bi(e, u && u.suspense);
	} : a !== "sync" && (d = !0, s.scheduler = (e, t) => {
		t ? e() : Fn(e);
	}), s.augmentJob = (e) => {
		t && (e.flags |= 4), d && (e.flags |= 2, u && (e.id = u.uid, e.i = u));
	};
	let f = bn(e, t, s);
	return ga && (l ? l.push(f) : c && f()), f;
}
var er = /* @__PURE__ */ Symbol("_vte"), tr = (e) => e.__isTeleport, nr = /* @__PURE__ */ Symbol("_leaveCb"), rr = /* @__PURE__ */ Symbol("_enterCb");
function ir() {
	let e = {
		isMounted: !1,
		isLeaving: !1,
		isUnmounting: !1,
		leavingVNodes: /* @__PURE__ */ new Map()
	};
	return jr(() => {
		e.isMounted = !0;
	}), Nr(() => {
		e.isUnmounting = !0;
	}), e;
}
var ar = [Function, Array], or = {
	mode: String,
	appear: Boolean,
	persisted: Boolean,
	onBeforeEnter: ar,
	onEnter: ar,
	onAfterEnter: ar,
	onEnterCancelled: ar,
	onBeforeLeave: ar,
	onLeave: ar,
	onAfterLeave: ar,
	onLeaveCancelled: ar,
	onBeforeAppear: ar,
	onAppear: ar,
	onAfterAppear: ar,
	onAppearCancelled: ar
}, sr = (e) => {
	let t = e.subTree;
	return t.component ? sr(t.component) : t;
}, cr = {
	name: "BaseTransition",
	props: or,
	setup(e, { slots: t }) {
		let n = ua(), r = ir();
		return () => {
			let i = t.default && gr(t.default(), !0), a = i && i.length ? lr(i) : n.subTree ? ea() : void 0;
			if (!a) return;
			let o = /* @__PURE__ */ P(e), { mode: s } = o;
			if (r.isLeaving) return pr(a);
			let c = mr(a);
			if (!c) return pr(a);
			let l = fr(c, o, r, n, (e) => l = e);
			c.type !== Fi && hr(c, l);
			let u = n.subTree && mr(n.subTree);
			if (u && u.type !== Fi && !Gi(u, c) && sr(n).type !== Fi) {
				let e = fr(u, o, r, n);
				if (hr(u, e), s === "out-in" && c.type !== Fi) return r.isLeaving = !0, e.afterLeave = () => {
					r.isLeaving = !1, n.job.flags & 8 || n.update(), delete e.afterLeave, u = void 0;
				}, pr(a);
				s === "in-out" && c.type !== Fi ? e.delayLeave = (e, t, n) => {
					let i = dr(r, u);
					i[String(u.key)] = u, e[nr] = () => {
						t(), e[nr] = void 0, delete l.delayedLeave, u = void 0;
					}, l.delayedLeave = () => {
						n(), delete l.delayedLeave, u = void 0;
					};
				} : u = void 0;
			} else u &&= void 0;
			return a;
		};
	}
};
function lr(e) {
	let t = e[0];
	if (e.length > 1) {
		for (let n of e) if (n.type !== Fi) {
			t = n;
			break;
		}
	}
	return t;
}
var ur = cr;
function dr(e, t) {
	let { leavingVNodes: n } = e, r = n.get(t.type);
	return r || (r = /* @__PURE__ */ Object.create(null), n.set(t.type, r)), r;
}
function fr(e, t, n, r, i) {
	let { appear: a, mode: o, persisted: s = !1, onBeforeEnter: c, onEnter: l, onAfterEnter: u, onEnterCancelled: d, onBeforeLeave: f, onLeave: p, onAfterLeave: m, onLeaveCancelled: h, onBeforeAppear: g, onAppear: _, onAfterAppear: v, onAppearCancelled: y } = t, b = String(e.key), x = dr(n, e), S = (e, t) => {
		e && Cn(e, r, 9, t);
	}, w = (e, t) => {
		let n = t[1];
		S(e, t), C(e) ? e.every((e) => e.length <= 1) && n() : e.length <= 1 && n();
	}, T = {
		mode: o,
		persisted: s,
		beforeEnter(t) {
			let r = c;
			if (!n.isMounted) {
				if (a) r = g || c;
				else return;
			}
			t[nr] && t[nr](!0);
			let i = x[b];
			i && Gi(e, i) && i.el[nr] && i.el[nr](), S(r, [t]);
		},
		enter(t) {
			if (x[b] === e) return;
			let r = l, i = u, o = d;
			if (!n.isMounted) {
				if (a) r = _ || l, i = v || u, o = y || d;
				else return;
			}
			let s = !1;
			t[rr] = (e) => {
				s || (s = !0, S(e ? o : i, [t]), T.delayedLeave && T.delayedLeave(), t[rr] = void 0);
			};
			let c = t[rr].bind(null, !1);
			r ? w(r, [t, c]) : c();
		},
		leave(t, r) {
			let i = String(e.key);
			if (t[rr] && t[rr](!0), n.isUnmounting) return r();
			S(f, [t]);
			let a = !1;
			t[nr] = (n) => {
				a || (a = !0, r(), S(n ? h : m, [t]), t[nr] = void 0, x[i] === e && delete x[i]);
			};
			let o = t[nr].bind(null, !1);
			x[i] = e, p ? w(p, [t, o]) : o();
		},
		clone(e) {
			let a = fr(e, t, n, r, i);
			return i && i(a), a;
		}
	};
	return T;
}
function pr(e) {
	if (Cr(e)) return e = Qi(e), e.children = null, e;
}
function mr(e) {
	if (!Cr(e)) return tr(e.type) && e.children ? lr(e.children) : e;
	if (e.component) return e.component.subTree;
	let { shapeFlag: t, children: n } = e;
	if (n) {
		if (t & 16) return n[0];
		if (t & 32 && D(n.default)) return n.default();
	}
}
function hr(e, t) {
	if (e.shapeFlag & 6 && e.component) {
		e.transition = t;
		let n = e.component.subTree;
		hr(tr(n.type) && mr(n) || n, t);
	} else e.shapeFlag & 128 ? (e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback)) : e.transition = t;
}
function gr(e, t = !1, n) {
	let r = [], i = 0;
	for (let a = 0; a < e.length; a++) {
		let o = e[a], s = n == null ? o.key : String(n) + String(o.key == null ? a : o.key);
		o.type === Ni ? (o.patchFlag & 128 && i++, r = r.concat(gr(o.children, t, s))) : (t || o.type !== Fi) && r.push(s == null ? o : Qi(o, { key: s }));
	}
	if (i > 1) for (let e = 0; e < r.length; e++) r[e].patchFlag = -2;
	return r;
}
// @__NO_SIDE_EFFECTS__
function I(e, t) {
	return D(e) ? /* @__PURE__ */ y({ name: e.name }, t, { setup: e }) : e;
}
function _r(e) {
	e.ids = [
		e.ids[0] + e.ids[2]++ + "-",
		0,
		0
	];
}
function vr(e, t) {
	let n;
	return !!((n = Object.getOwnPropertyDescriptor(e, t)) && !n.configurable);
}
var yr = /* @__PURE__ */ new WeakMap();
function br(e, t, n, r, i = !1) {
	if (C(e)) {
		e.forEach((e, a) => br(e, t && (C(t) ? t[a] : t), n, r, i));
		return;
	}
	if (Sr(r) && !i) {
		r.shapeFlag & 512 && r.type.__asyncResolved && r.component.subTree.component && br(e, t, n, r.component.subTree);
		return;
	}
	let a = r.shapeFlag & 4 ? Ca(r.component) : r.el, o = i ? null : a, { i: s, r: c } = e, l = t && t.r, u = s.refs === p ? s.refs = {} : s.refs, d = s.setupState, f = /* @__PURE__ */ P(d), m = d === p ? g : (e) => !vr(u, e) && S(f, e), h = (e, t) => !(t && vr(u, t));
	if (l != null && l !== c) {
		if (xr(t), O(l)) u[l] = null, m(l) && (d[l] = null);
		else if (/* @__PURE__ */ nn(l)) {
			let e = t;
			h(l, e.k) && (l.value = null), e.k && (u[e.k] = null);
		}
	}
	if (D(c)) Sn(c, s, 12, [o, u]);
	else {
		let t = O(c), r = /* @__PURE__ */ nn(c);
		if (t || r) {
			let s = () => {
				if (e.f) {
					let n = t ? m(c) ? d[c] : u[c] : h(c) || !e.k ? c.value : u[e.k];
					if (i) C(n) && b(n, a);
					else if (C(n)) n.includes(a) || n.push(a);
					else if (t) u[c] = [a], m(c) && (d[c] = u[c]);
					else {
						let t = [a];
						h(c, e.k) && (c.value = t), e.k && (u[e.k] = t);
					}
				} else t ? (u[c] = o, m(c) && (d[c] = o)) : r && (h(c, e.k) && (c.value = o), e.k && (u[e.k] = o));
			};
			if (o) {
				let t = () => {
					s(), yr.delete(e);
				};
				t.id = -1, yr.set(e, t), bi(t, n);
			} else xr(e), s();
		}
	}
}
function xr(e) {
	let t = yr.get(e);
	t && (t.flags |= 8, yr.delete(e));
}
ye().requestIdleCallback, ye().cancelIdleCallback;
var Sr = (e) => !!e.type.__asyncLoader, Cr = (e) => e.type.__isKeepAlive;
function wr(e, t) {
	Er(e, "a", t);
}
function Tr(e, t) {
	Er(e, "da", t);
}
function Er(e, t, n = la) {
	let r = e.__wdc ||= () => {
		let t = n;
		for (; t;) {
			if (t.isDeactivated) return;
			t = t.parent;
		}
		return e();
	};
	if (Or(t, r, n), n) {
		let e = n.parent;
		for (; e && e.parent;) Cr(e.parent.vnode) && Dr(r, t, n, e), e = e.parent;
	}
}
function Dr(e, t, n, r) {
	let i = Or(t, e, r, !0);
	Pr(() => {
		b(r[t], i);
	}, n);
}
function Or(e, t, n = la, r = !1) {
	if (n) {
		let i = n[e] || (n[e] = []), a = t.__weh ||= (...r) => {
			Qe();
			let i = pa(n), a = Cn(t, n, e, r);
			return i(), $e(), a;
		};
		return r ? i.unshift(a) : i.push(a), a;
	}
}
var kr = (e) => (t, n = la) => {
	(!ga || e === "sp") && Or(e, (...e) => t(...e), n);
}, Ar = kr("bm"), jr = kr("m"), Mr = kr("u"), Nr = kr("bum"), Pr = kr("um"), Fr = /* @__PURE__ */ Symbol.for("v-ndc");
function Ir(e, t, n, r, i, a) {
	if (n ??= {}, Hn.ce || Hn.parent && Sr(Hn.parent) && Hn.parent.ce) {
		let e = a != null && n.key == null ? y({}, n, { key: a }) : n, i = Object.keys(e).length > 0;
		return t !== "default" && (e.name = t), L(), Ui(Ni, null, [Yi("slot", e, r && r())], i ? -2 : 64);
	}
	let o = e[t];
	o && o._c && (o._d = !1);
	let s = Li.length;
	L();
	let c;
	try {
		let i = o && Lr(o(n)), s = n.key || a || i && i.key;
		c = Ui(Ni, { key: (s && !k(s) ? s : `_${t}`) + (!i && r ? "_fb" : "") }, i || (r ? r() : []), i && e._ === 1 ? 64 : -2);
	} catch (e) {
		for (let e = Li.length; e > s; e--) zi();
		throw e;
	} finally {
		o && o._c && (o._d = !0);
	}
	return !i && c.scopeId && (c.slotScopeIds = [c.scopeId + "-s"]), c;
}
function Lr(e) {
	return e.some((e) => !Wi(e) || !(e.type === Fi || e.type === Ni && !Lr(e.children))) ? e : null;
}
var Rr = (e) => e ? ha(e) ? Ca(e) : Rr(e.parent) : null, zr = /* @__PURE__ */ y(/* @__PURE__ */ Object.create(null), {
	$: (e) => e,
	$el: (e) => e.vnode.el,
	$data: (e) => e.data,
	$props: (e) => e.props,
	$attrs: (e) => e.attrs,
	$slots: (e) => e.slots,
	$refs: (e) => e.refs,
	$parent: (e) => Rr(e.parent),
	$root: (e) => Rr(e.root),
	$host: (e) => e.ce,
	$emit: (e) => e.emit,
	$options: (e) => e.type,
	$forceUpdate: (e) => e.f ||= () => {
		Fn(e.update);
	},
	$nextTick: (e) => e.n ||= Nn.bind(e.proxy),
	$watch: (e) => h
}), Br = (e, t) => e !== p && !e.__isScriptSetup && S(e, t), Vr = {
	get({ _: e }, t) {
		if (t === "__v_skip") return !0;
		let { ctx: n, setupState: r, data: i, props: a, accessCache: o, type: s, appContext: c } = e;
		if (t[0] !== "$") {
			let e = o[t];
			if (e !== void 0) switch (e) {
				case 1: return r[t];
				case 2: return i[t];
				case 4: return n[t];
				case 3: return a[t];
			}
			else if (Br(r, t)) return o[t] = 1, r[t];
			else if (S(a, t)) return o[t] = 3, a[t];
			else if (n !== p && S(n, t)) return o[t] = 4, n[t];
			else o[t] = 0;
		}
		let l = zr[t], u, d;
		if (l) return t === "$attrs" && lt(e.attrs, "get", ""), l(e);
		if ((u = s.__cssModules) && (u = u[t])) return u;
		if (n !== p && S(n, t)) return o[t] = 4, n[t];
		if (d = c.config.globalProperties, S(d, t)) return d[t];
	},
	set({ _: e }, t, n) {
		let { data: r, setupState: i, ctx: a } = e;
		return Br(i, t) ? (i[t] = n, !0) : S(e.props, t) || t[0] === "$" && t.slice(1) in e ? !1 : (a[t] = n, !0);
	},
	has({ _: { data: e, setupState: t, accessCache: n, ctx: r, appContext: i, props: a, type: o } }, s) {
		let c;
		return !!(n[s] || Br(t, s) || S(a, s) || S(r, s) || S(zr, s) || S(i.config.globalProperties, s) || (c = o.__cssModules) && c[s]);
	},
	defineProperty(e, t, n) {
		return n.get == null ? S(n, "value") && this.set(e, t, n.value, null) : e._.accessCache[t] = 0, Reflect.defineProperty(e, t, n);
	}
};
function Hr() {
	return {
		app: null,
		config: {
			isNativeTag: g,
			performance: !1,
			globalProperties: {},
			optionMergeStrategies: {},
			errorHandler: void 0,
			warnHandler: void 0,
			compilerOptions: {}
		},
		mixins: [],
		components: {},
		directives: {},
		provides: /* @__PURE__ */ Object.create(null),
		optionsCache: /* @__PURE__ */ new WeakMap(),
		propsCache: /* @__PURE__ */ new WeakMap(),
		emitsCache: /* @__PURE__ */ new WeakMap()
	};
}
var Ur = 0;
function Wr(e, t) {
	return function(n, r = null) {
		D(n) || (n = y({}, n)), r != null && !A(r) && (r = null);
		let i = Hr(), a = /* @__PURE__ */ new WeakSet(), o = [], s = !1, c = i.app = {
			_uid: Ur++,
			_component: n,
			_props: r,
			_container: null,
			_context: i,
			_instance: null,
			version: Ta,
			get config() {
				return i.config;
			},
			set config(e) {},
			use(e, ...t) {
				return a.has(e) || (e && D(e.install) ? (a.add(e), e.install(c, ...t)) : D(e) && (a.add(e), e(c, ...t))), c;
			},
			mixin(e) {
				return c;
			},
			component(e, t) {
				return t ? (i.components[e] = t, c) : i.components[e];
			},
			directive(e, t) {
				return t ? (i.directives[e] = t, c) : i.directives[e];
			},
			mount(a, o, l) {
				if (!s) {
					let u = c._ceVNode || Yi(n, r);
					return u.appContext = i, l === !0 ? l = "svg" : l === !1 && (l = void 0), o && t ? t(u, a) : e(u, a, l), s = !0, c._container = a, a.__vue_app__ = c, Ca(u.component);
				}
			},
			onUnmount(e) {
				o.push(e);
			},
			unmount() {
				s && (Cn(o, c._instance, 16), e(null, c._container), delete c._container.__vue_app__);
			},
			provide(e, t) {
				return i.provides[e] = t, c;
			},
			runWithContext(e) {
				let t = Gr;
				Gr = c;
				try {
					return e();
				} finally {
					Gr = t;
				}
			}
		};
		return c;
	};
}
var Gr = null, Kr = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${ce(t)}Modifiers`] || e[`${ue(t)}Modifiers`];
function qr(e, t, ...n) {
	if (e.isUnmounted) return;
	let r = e.vnode.props || p, i = n, a = t.startsWith("update:"), o = a && Kr(r, t.slice(7));
	o && (o.trim && (i = n.map((e) => O(e) ? e.trim() : e)), o.number && (i = i.map(ge)));
	let s, c = r[s = fe(t)] || r[s = fe(ce(t))];
	!c && a && (c = r[s = fe(ue(t))]), c && Cn(c, e, 6, i);
	let l = r[s + "Once"];
	if (l) {
		if (!e.emitted) e.emitted = {};
		else if (e.emitted[s]) return;
		e.emitted[s] = !0, Cn(l, e, 6, i);
	}
}
function Jr(e, t, n = !1) {
	let r = t.emitsCache, i = r.get(e);
	if (i !== void 0) return i;
	let a = e.emits, o = {};
	return a ? (C(a) ? a.forEach((e) => o[e] = null) : y(o, a), A(e) && r.set(e, o), o) : (A(e) && r.set(e, null), null);
}
function Yr(e, t) {
	return !e || !_(t) ? !1 : (t = t.slice(2), t = t === "Once" ? t : t.replace(/Once$/, ""), S(e, t[0].toLowerCase() + t.slice(1)) || S(e, ue(t)) || S(e, t));
}
function Xr(e) {
	let { type: t, vnode: n, proxy: r, withProxy: i, propsOptions: [a], slots: o, attrs: s, emit: c, render: l, renderCache: u, props: d, data: f, setupState: p, ctx: m, inheritAttrs: h } = e, g = Wn(e), _, y;
	try {
		if (n.shapeFlag & 4) {
			let e = i || r, t = e;
			_ = ta(l.call(t, e, u, d, p, f, m)), y = s;
		} else {
			let e = t;
			_ = ta(e.length > 1 ? e(d, {
				attrs: s,
				slots: o,
				emit: c
			}) : e(d, null)), y = t.props ? s : Zr(s);
		}
	} catch (t) {
		Li.length = 0, wn(t, e, 1), _ = Yi(Fi);
	}
	let b = _;
	if (y && h !== !1) {
		let e = Object.keys(y), { shapeFlag: t } = b;
		e.length && t & 7 && (a && e.some(v) && (y = Qr(y, a)), b = Qi(b, y, !1, !0));
	}
	return n.dirs && (b = Qi(b, null, !1, !0), b.dirs = b.dirs ? b.dirs.concat(n.dirs) : n.dirs), n.transition && hr(tr(b.type) && mr(b) || b, n.transition), _ = b, Wn(g), _;
}
var Zr = (e) => {
	let t;
	for (let n in e) (n === "class" || n === "style" || _(n)) && ((t ||= {})[n] = e[n]);
	return t;
}, Qr = (e, t) => {
	let n = {};
	for (let r in e) (!v(r) || !(r.slice(9) in t)) && (n[r] = e[r]);
	return n;
};
function $r(e, t, n) {
	let { props: r, children: i, component: a } = e, { props: o, children: s, patchFlag: c } = t, l = a.emitsOptions;
	if (t.dirs || t.transition) return !0;
	if (n && c >= 0) {
		if (c & 1024) return !0;
		if (c & 16) return r ? ei(r, o, l) : !!o;
		if (c & 8) {
			let e = t.dynamicProps;
			for (let t = 0; t < e.length; t++) {
				let n = e[t];
				if (ti(o, r, n) && !Yr(l, n)) return !0;
			}
		}
	} else return (i || s) && (!s || !s.$stable) ? !0 : r === o ? !1 : r ? !o || ei(r, o, l) : !!o;
	return !1;
}
function ei(e, t, n) {
	let r = Object.keys(t);
	if (r.length !== Object.keys(e).length) return !0;
	for (let i = 0; i < r.length; i++) {
		let a = r[i];
		if (ti(t, e, a) && !Yr(n, a)) return !0;
	}
	return !1;
}
function ti(e, t, n) {
	let r = e[n], i = t[n];
	return n === "style" && A(r) && A(i) ? !Me(r, i) : r !== i;
}
function ni({ vnode: e, parent: t, suspense: n }, r) {
	for (; t;) {
		let n = t.subTree;
		if (n.suspense && n.suspense.activeBranch === e && (n.suspense.vnode.el = n.el = r, e = n), n === e) (e = t.vnode).el = r, t = t.parent;
		else break;
	}
	n && n.activeBranch === e && (n.vnode.el = r);
}
var ri = {}, ii = () => Object.create(ri), ai = (e) => Object.getPrototypeOf(e) === ri;
function oi(e, t, n, r = !1) {
	let i = {}, a = ii();
	e.propsDefaults = /* @__PURE__ */ Object.create(null), ci(e, t, i, a);
	for (let t in e.propsOptions[0]) t in i || (i[t] = void 0);
	e.props = n ? r ? i : /* @__PURE__ */ Kt(i) : e.type.props ? i : a, e.attrs = a;
}
function si(e, t, n, r) {
	let { props: i, attrs: a, vnode: { patchFlag: o } } = e, s = /* @__PURE__ */ P(i), [c] = e.propsOptions, l = !1;
	if ((r || o > 0) && !(o & 16)) {
		if (o & 8) {
			let n = e.vnode.dynamicProps;
			for (let r = 0; r < n.length; r++) {
				let o = n[r];
				if (Yr(e.emitsOptions, o)) continue;
				let u = t[o];
				if (c) {
					if (S(a, o)) u !== a[o] && (a[o] = u, l = !0);
					else {
						let t = ce(o);
						i[t] = li(c, s, t, u, e, !1);
					}
				} else u !== a[o] && (a[o] = u, l = !0);
			}
		}
	} else {
		ci(e, t, i, a) && (l = !0);
		let r;
		for (let a in s) (!t || !S(t, a) && ((r = ue(a)) === a || !S(t, r))) && (c ? n && (n[a] !== void 0 || n[r] !== void 0) && (i[a] = li(c, s, a, void 0, e, !0)) : delete i[a]);
		if (a !== s) for (let e in a) (!t || !S(t, e)) && (delete a[e], l = !0);
	}
	l && ut(e.attrs, "set", "");
}
function ci(e, t, n, r) {
	let [i, a] = e.propsOptions, o = !1, s;
	if (t) for (let c in t) {
		if (ae(c)) continue;
		let l = t[c], u;
		i && S(i, u = ce(c)) ? !a || !a.includes(u) ? n[u] = l : (s ||= {})[u] = l : Yr(e.emitsOptions, c) || (!(c in r) || l !== r[c]) && (r[c] = l, o = !0);
	}
	if (a) {
		let t = /* @__PURE__ */ P(n), r = s || p;
		for (let o = 0; o < a.length; o++) {
			let s = a[o];
			n[s] = li(i, t, s, r[s], e, !S(r, s));
		}
	}
	return o;
}
function li(e, t, n, r, i, a) {
	let o = e[n];
	if (o != null) {
		let e = S(o, "default");
		if (e && r === void 0) {
			let e = o.default;
			if (o.type !== Function && !o.skipFactory && D(e)) {
				let { propsDefaults: a } = i;
				if (n in a) r = a[n];
				else {
					let o = pa(i);
					r = a[n] = e.call(null, t), o();
				}
			} else r = e;
			i.ce && i.ce._setProp(n, r);
		}
		o[0] && (a && !e ? r = !1 : o[1] && (r === "" || r === ue(n)) && (r = !0));
	}
	return r;
}
function ui(e, t, n = !1) {
	let r = t.propsCache, i = r.get(e);
	if (i) return i;
	let a = e.props, o = {}, s = [];
	if (!a) return A(e) && r.set(e, m), m;
	if (C(a)) for (let e = 0; e < a.length; e++) {
		let t = ce(a[e]);
		di(t) && (o[t] = p);
	}
	else if (a) for (let e in a) {
		let t = ce(e);
		if (di(t)) {
			let n = a[e], r = o[t] = C(n) || D(n) ? { type: n } : y({}, n), i = r.type, c = !1, l = !0;
			if (C(i)) for (let e = 0; e < i.length; ++e) {
				let t = i[e], n = D(t) && t.name;
				if (n === "Boolean") {
					c = !0;
					break;
				}
				n === "String" && (l = !1);
			}
			else c = D(i) && i.name === "Boolean";
			r[0] = c, r[1] = l, (c || S(r, "default")) && s.push(t);
		}
	}
	let c = [o, s];
	return A(e) && r.set(e, c), c;
}
function di(e) {
	return e[0] !== "$" && !ae(e);
}
var fi = (e) => e === "_" || e === "_ctx" || e === "$stable", pi = (e) => C(e) ? e.map(ta) : [ta(e)], mi = (e, t, n) => {
	if (t._n) return t;
	let r = Gn((...e) => pi(t(...e)), n);
	return r._c = !1, r;
}, hi = (e, t, n) => {
	let r = e._ctx;
	for (let n in e) {
		if (fi(n)) continue;
		let i = e[n];
		if (D(i)) t[n] = mi(n, i, r);
		else if (i != null) {
			let e = pi(i);
			t[n] = () => e;
		}
	}
}, gi = (e, t) => {
	let n = pi(t);
	e.slots.default = () => n;
}, _i = (e, t, n) => {
	for (let r in t) (n || !fi(r)) && (e[r] = t[r]);
}, vi = (e, t, n) => {
	let r = e.slots = ii();
	if (e.vnode.shapeFlag & 32) {
		let e = t._;
		e ? (_i(r, t, n), n && he(r, "_", e, !0)) : hi(t, r);
	} else t && gi(e, t);
}, yi = (e, t, n) => {
	let { vnode: r, slots: i } = e, a = !0, o = p;
	if (r.shapeFlag & 32) {
		let e = t._;
		e ? n && e === 1 ? a = !1 : _i(i, t, n) : (a = !t.$stable, hi(t, i)), o = t;
	} else t && (gi(e, t), o = { default: 1 });
	if (a) for (let e in i) !fi(e) && o[e] == null && delete i[e];
}, bi = Mi;
function xi(e) {
	return Si(e);
}
function Si(e, t) {
	let n = ye();
	n.__VUE__ = !0;
	let { insert: r, remove: i, patchProp: a, createElement: o, createText: s, createComment: c, setText: l, setElementText: u, parentNode: d, nextSibling: f, setScopeId: g = h, insertStaticContent: _ } = e, v = (e, t, n, r = null, i = null, a = null, o = void 0, s = null, c = !!t.dynamicChildren) => {
		if (e === t) return;
		e && !Gi(e, t) && (r = ge(e), ue(e, i, a, !0), e = null), t.patchFlag === -2 && (c = !1, t.dynamicChildren = null), t.dynamicChildren && e && e.dynamicChildren && e.dynamicChildren.hasOnce && (t.dynamicChildren === m && (t.dynamicChildren = []), t.dynamicChildren.hasOnce = !0);
		let { type: l, ref: u, shapeFlag: d } = t;
		switch (l) {
			case Pi:
				y(e, t, n, r);
				break;
			case Fi:
				b(e, t, n, r);
				break;
			case Ii:
				e ?? x(t, n, r, o);
				break;
			case Ni:
				ee(e, t, n, r, i, a, o, s, c);
				break;
			default: d & 1 ? w(e, t, n, r, i, a, o, s, c) : d & 6 ? j(e, t, n, r, i, a, o, s, c) : (d & 64 || d & 128) && l.process(e, t, n, r, i, a, o, s, c, M);
		}
		u != null && i ? br(u, e && e.ref, a, t || e, !t) : u == null && e && e.ref != null && br(e.ref, null, a, e, !0);
	}, y = (e, t, n, i) => {
		if (e == null) r(t.el = s(t.children), n, i);
		else {
			let n = t.el = e.el;
			t.children !== e.children && l(n, t.children);
		}
	}, b = (e, t, n, i) => {
		e == null ? r(t.el = c(t.children || ""), n, i) : t.el = e.el;
	}, x = (e, t, n, r) => {
		[e.el, e.anchor] = _(e.children, t, n, r, e.el, e.anchor);
	}, S = ({ el: e, anchor: t }, n, i) => {
		let a;
		for (; e && e !== t;) a = f(e), r(e, n, i), e = a;
		r(t, n, i);
	}, C = ({ el: e, anchor: t }) => {
		let n;
		for (; e && e !== t;) n = f(e), i(e), e = n;
		i(t);
	}, w = (e, t, n, r, i, a, o, s, c) => {
		if (t.type === "svg" ? o = "svg" : t.type === "math" && (o = "mathml"), e == null) T(t, n, r, i, a, o, s, c);
		else {
			let n = e.el && e.el._isVueCE ? e.el : null;
			try {
				n && n._beginPatch(), O(e, t, i, a, o, s, c);
			} finally {
				n && n._endPatch();
			}
		}
	}, T = (e, t, n, i, s, c, l, d) => {
		let f, p, { props: m, shapeFlag: h, transition: g, dirs: _ } = e;
		if (f = e.el = o(e.type, c, m && m.is, m), h & 8 ? u(f, e.children) : h & 16 && D(e.children, f, null, i, s, Ci(e, c), l, d), _ && Kn(e, null, i, "created"), E(f, e, e.scopeId, l, i), m) {
			for (let e in m) e !== "value" && !ae(e) && a(f, e, null, m[e], c, i);
			"value" in m && a(f, "value", null, m.value, c), (p = m.onVnodeBeforeMount) && aa(p, i, e);
		}
		_ && Kn(e, null, i, "beforeMount");
		let v = Ti(s, g);
		v && g.beforeEnter(f), r(f, t, n), ((p = m && m.onVnodeMounted) || v || _) && bi(() => {
			try {
				p && aa(p, i, e), v && g.enter(f), _ && Kn(e, null, i, "mounted");
			} finally {}
		}, s);
	}, E = (e, t, n, r, i) => {
		if (n && g(e, n), r) for (let t = 0; t < r.length; t++) g(e, r[t]);
		if (i) {
			let n = i.subTree;
			if (t === n || ji(n.type) && (n.ssContent === t || n.ssFallback === t)) {
				let t = i.vnode;
				E(e, t, t.scopeId, t.slotScopeIds, i.parent);
			}
		}
	}, D = (e, t, n, r, i, a, o, s, c = 0) => {
		for (let l = c; l < e.length; l++) {
			let c = e[l] = s ? na(e[l]) : ta(e[l]);
			v(null, c, t, n, r, i, a, o, s);
		}
	}, O = (e, t, n, r, i, o, s) => {
		let c = t.el = e.el, { patchFlag: l, dynamicChildren: d, dirs: f } = t;
		l |= e.patchFlag & 16;
		let m = e.props || p, h = t.props || p, g;
		if (n && wi(n, !1), (g = h.onVnodeBeforeUpdate) && aa(g, n, t, e), f && Kn(t, e, n, "beforeUpdate"), n && wi(n, !0), d && (!e.dynamicChildren || e.dynamicChildren.length !== d.length) && (l = 0, s = !1, d = null), (m.innerHTML && h.innerHTML == null || m.textContent && h.textContent == null) && u(c, ""), d ? k(e.dynamicChildren, d, c, n, r, Ci(t, i), o) : s || oe(e, t, c, null, n, r, Ci(t, i), o, !1), l > 0) {
			if (l & 16) A(c, m, h, n, i);
			else if (l & 2 && m.class !== h.class && a(c, "class", null, h.class, i), l & 4 && a(c, "style", m.style, h.style, i), l & 8) {
				let e = t.dynamicProps;
				for (let t = 0; t < e.length; t++) {
					let r = e[t], o = m[r], s = h[r];
					(s !== o || r === "value") && a(c, r, o, s, i, n);
				}
			}
			l & 1 && e.children !== t.children && u(c, t.children);
		} else !s && d == null && A(c, m, h, n, i);
		((g = h.onVnodeUpdated) || f) && bi(() => {
			g && aa(g, n, t, e), f && Kn(t, e, n, "updated");
		}, r);
	}, k = (e, t, n, r, i, a, o) => {
		for (let s = 0; s < t.length; s++) {
			let c = e[s], l = t[s], u = c.el && (c.type === Ni || !Gi(c, l) || c.shapeFlag & 198) ? d(c.el) : n;
			v(c, l, u, null, r, i, a, o, !0);
		}
	}, A = (e, t, n, r, i) => {
		if (t !== n) {
			if (t !== p) for (let o in t) !ae(o) && !(o in n) && a(e, o, t[o], null, i, r);
			for (let o in n) {
				if (ae(o)) continue;
				let s = n[o], c = t[o];
				s !== c && o !== "value" && a(e, o, c, s, i, r);
			}
			"value" in n && a(e, "value", t.value, n.value, i);
		}
	}, ee = (e, t, n, i, a, o, c, l, u) => {
		let d = t.el = e ? e.el : s(""), f = t.anchor = e ? e.anchor : s(""), { patchFlag: p, dynamicChildren: m, slotScopeIds: h } = t;
		h && (l = l ? l.concat(h) : h), e == null ? (r(d, n, i), r(f, n, i), D(t.children || [], n, f, a, o, c, l, u)) : p > 0 && p & 64 && m && e.dynamicChildren && e.dynamicChildren.length === m.length ? (k(e.dynamicChildren, m, n, a, o, c, l), (t.key != null || a && t === a.subTree) && Ei(e, t, !0)) : oe(e, t, n, f, a, o, c, l, u);
	}, j = (e, t, n, r, i, a, o, s, c) => {
		t.slotScopeIds = s, e == null ? t.shapeFlag & 512 ? i.ctx.activate(t, n, r, o, c) : te(t, n, r, i, a, o, c) : ne(e, t, c);
	}, te = (e, t, n, r, i, a, o) => {
		let s = e.component = ca(e, r, i);
		if (Cr(e) && (s.ctx.renderer = M), _a(s, !1, o), s.asyncDep) {
			if (i && i.registerDep(s, re, o), !e.el) {
				let r = s.subTree = Yi(Fi);
				b(null, r, t, n), e.placeholder = r.el;
			}
		} else re(s, e, t, n, i, a, o);
	}, ne = (e, t, n) => {
		let r = t.component = e.component;
		if ($r(e, t, n)) {
			if (r.asyncDep && !r.asyncResolved) {
				t.el = e.el, ie(r, t, n);
				return;
			}
			r.next = t, r.update();
		} else t.el = e.el, r.vnode = t;
	}, re = (e, t, n, r, i, a, o) => {
		let s = () => {
			if (e.isMounted) {
				let { next: t, bu: n, u: r, parent: s, vnode: c } = e;
				{
					let n = Oi(e);
					if (n) {
						t && (t.el = c.el, ie(e, t, o)), n.asyncDep.then(() => {
							bi(() => {
								e.isUnmounted || l();
							}, i);
						});
						return;
					}
				}
				let u = t, f;
				wi(e, !1), t ? (t.el = c.el, ie(e, t, o)) : t = c, n && me(n), (f = t.props && t.props.onVnodeBeforeUpdate) && aa(f, s, t, c), wi(e, !0);
				let p = Xr(e), m = e.subTree;
				e.subTree = p, v(m, p, d(m.el), ge(m), e, i, a), t.el = p.el, u === null && ni(e, p.el), r && bi(r, i), (f = t.props && t.props.onVnodeUpdated) && bi(() => aa(f, s, t, c), i);
			} else {
				let o, { el: s, props: c } = t, { bm: l, m: u, parent: d, root: f, type: p } = e, m = Sr(t);
				if (wi(e, !1), l && me(l), !m && (o = c && c.onVnodeBeforeMount) && aa(o, d, t), wi(e, !0), s && xe) {
					let t = () => {
						e.subTree = Xr(e), xe(s, e.subTree, e, i, null);
					};
					m && p.__asyncHydrate ? p.__asyncHydrate(s, e, t) : t();
				} else {
					f.ce && f.ce._hasShadowRoot() && f.ce._injectChildStyle(p, e.parent ? e.parent.type : void 0);
					let o = e.subTree = Xr(e);
					v(null, o, n, r, e, i, a), t.el = o.el;
				}
				if (u && bi(u, i), !m && (o = c && c.onVnodeMounted)) {
					let e = t;
					bi(() => aa(o, d, e), i);
				}
				(t.shapeFlag & 256 || d && Sr(d.vnode) && d.vnode.shapeFlag & 256) && e.a && bi(e.a, i), e.isMounted = !0, t = n = r = null;
			}
		};
		e.scope.on();
		let c = e.effect = new Le(s);
		e.scope.off();
		let l = e.update = c.run.bind(c), u = e.job = c.runIfDirty.bind(c);
		u.i = e, u.id = e.uid, c.scheduler = () => Fn(u), wi(e, !0), l();
	}, ie = (e, t, n) => {
		t.component = e;
		let r = e.vnode.props;
		e.vnode = t, e.next = null, si(e, t.props, r, n), yi(e, t.children, n), Qe(), Rn(e), $e();
	}, oe = (e, t, n, r, i, a, o, s, c = !1) => {
		let l = e && e.children, d = e ? e.shapeFlag : 0, f = t.children, { patchFlag: p, shapeFlag: m } = t;
		if (p > 0) {
			if (p & 128) {
				ce(l, f, n, r, i, a, o, s, c);
				return;
			}
			if (p & 256) {
				se(l, f, n, r, i, a, o, s, c);
				return;
			}
		}
		m & 8 ? (d & 16 && he(l, i, a), f !== l && u(n, f)) : d & 16 ? m & 16 ? ce(l, f, n, r, i, a, o, s, c) : he(l, i, a, !0) : (d & 8 && u(n, ""), m & 16 && D(f, n, r, i, a, o, s, c));
	}, se = (e, t, n, r, i, a, o, s, c) => {
		e ||= m, t ||= m;
		let l = e.length, u = t.length, d = Math.min(l, u), f = 0;
		for (; f < d; f++) {
			let r = t[f] = c ? na(t[f]) : ta(t[f]);
			v(e[f], r, n, null, i, a, o, s, c);
		}
		l > u ? he(e, i, a, !0, !1, d) : D(t, n, r, i, a, o, s, c, d);
	}, ce = (e, t, n, r, i, a, o, s, c) => {
		let l = 0, u = t.length, d = e.length - 1, f = u - 1;
		for (; l <= d && l <= f;) {
			let r = e[l], u = t[l] = c ? na(t[l]) : ta(t[l]);
			if (Gi(r, u)) v(r, u, n, null, i, a, o, s, c);
			else break;
			l++;
		}
		for (; l <= d && l <= f;) {
			let r = e[d], l = t[f] = c ? na(t[f]) : ta(t[f]);
			if (Gi(r, l)) v(r, l, n, null, i, a, o, s, c);
			else break;
			d--, f--;
		}
		if (l > d) {
			if (l <= f) {
				let e = f + 1, d = e < u ? t[e].el : r;
				for (; l <= f;) v(null, t[l] = c ? na(t[l]) : ta(t[l]), n, d, i, a, o, s, c), l++;
			}
		} else if (l > f) for (; l <= d;) ue(e[l], i, a, !0), l++;
		else {
			let p = l, h = l, g = /* @__PURE__ */ new Map();
			for (l = h; l <= f; l++) {
				let e = t[l] = c ? na(t[l]) : ta(t[l]);
				e.key != null && g.set(e.key, l);
			}
			let _, y = 0, b = f - h + 1, x = !1, S = 0, C = Array(b);
			for (l = 0; l < b; l++) C[l] = 0;
			for (l = p; l <= d; l++) {
				let r = e[l];
				if (y >= b) {
					ue(r, i, a, !0);
					continue;
				}
				let u;
				if (r.key != null) u = g.get(r.key);
				else for (_ = h; _ <= f; _++) if (C[_ - h] === 0 && Gi(r, t[_])) {
					u = _;
					break;
				}
				u === void 0 ? ue(r, i, a, !0) : (C[u - h] = l + 1, u >= S ? S = u : x = !0, v(r, t[u], n, null, i, a, o, s, c), y++);
			}
			let w = x ? Di(C) : m;
			for (_ = w.length - 1, l = b - 1; l >= 0; l--) {
				let e = h + l, d = t[e], f = t[e + 1], p = e + 1 < u ? f.el || Ai(f) : r;
				C[l] === 0 ? v(null, d, n, p, i, a, o, s, c) : x && (_ < 0 || l !== w[_] ? le(d, n, p, 2) : _--);
			}
		}
	}, le = (e, t, n, a, o = null) => {
		let { el: s, type: c, transition: l, children: u, shapeFlag: d } = e;
		if (d & 6) {
			le(e.component.subTree, t, n, a);
			return;
		}
		if (d & 128) {
			e.suspense.move(t, n, a);
			return;
		}
		if (d & 64) {
			c.move(e, t, n, M);
			return;
		}
		if (c === Ni) {
			r(s, t, n);
			for (let e = 0; e < u.length; e++) le(u[e], t, n, a);
			r(e.anchor, t, n);
			return;
		}
		if (c === Ii) {
			S(e, t, n);
			return;
		}
		if (a !== 2 && d & 1 && l) {
			if (a === 0) l.persisted && !s[nr] ? r(s, t, n) : (l.beforeEnter(s), r(s, t, n), bi(() => l.enter(s), o));
			else {
				let { leave: a, delayLeave: o, afterLeave: c } = l, u = () => {
					e.ctx.isUnmounted ? i(s) : r(s, t, n);
				}, d = () => {
					let e = s._isLeaving || !!s[nr];
					s._isLeaving && s[nr](!0), l.persisted && !e ? u() : a(s, () => {
						u(), c && c();
					});
				};
				o ? o(s, u, d) : d();
			}
		} else r(s, t, n);
	}, ue = (e, t, n, r = !1, i = !1) => {
		let { type: a, props: o, ref: s, children: c, dynamicChildren: l, shapeFlag: u, patchFlag: d, dirs: f, cacheIndex: p, memo: m } = e;
		if ((d === -2 || l && l.hasOnce) && (i = !1), s != null && (Qe(), br(s, null, n, e, !0), $e()), p != null && (!e.ctx || e.ctx === t) && (t.renderCache[p] = void 0), u & 256) {
			t.ctx.deactivate(e);
			return;
		}
		let h = u & 1 && f, g = !Sr(e), _;
		if (g && (_ = o && o.onVnodeBeforeUnmount) && aa(_, t, e), u & 6) pe(e.component, n, r);
		else {
			if (u & 128) {
				e.suspense.unmount(n, r);
				return;
			}
			h && Kn(e, null, t, "beforeUnmount"), u & 64 ? e.type.remove(e, t, n, M, r) : l && !l.hasOnce && (a !== Ni || d > 0 && d & 64) ? he(l, t, n, !1, !0) : (a === Ni && d & 384 || !i && u & 16) && he(c, t, n), r && de(e);
		}
		let v = m != null && p == null;
		(g && (_ = o && o.onVnodeUnmounted) || h || v) && bi(() => {
			_ && aa(_, t, e), h && Kn(e, null, t, "unmounted"), v && (e.el = null);
		}, n);
	}, de = (e) => {
		let { type: t, el: n, anchor: r, transition: a } = e;
		if (t === Ni) {
			fe(n, r);
			return;
		}
		if (t === Ii) {
			C(e), a && !a.persisted && a.afterLeave && a.afterLeave();
			return;
		}
		let o = () => {
			i(n), a && !a.persisted && a.afterLeave && a.afterLeave();
		};
		if (e.shapeFlag & 1 && a && !a.persisted) {
			let { leave: t, delayLeave: r } = a, i = () => t(n, o);
			r ? r(e.el, o, i) : i();
		} else o();
	}, fe = (e, t) => {
		let n;
		for (; e !== t;) n = f(e), i(e), e = n;
		i(t);
	}, pe = (e, t, n) => {
		let { bum: r, scope: i, job: a, subTree: o, um: s, m: c, a: l } = e;
		ki(c), ki(l), r && me(r), i.stop(), a ? (a.flags |= 8, ue(o, e, t, n)) : e.vnode.el && o && (o.transition = e.vnode.transition, ue(o, e, t, n)), s && bi(s, t), bi(() => {
			e.isUnmounted = !0;
		}, t);
	}, he = (e, t, n, r = !1, i = !1, a = 0) => {
		for (let o = a; o < e.length; o++) ue(e[o], t, n, r, i);
	}, ge = (e) => {
		if (e.shapeFlag & 6) return ge(e.component.subTree);
		if (e.shapeFlag & 128) return e.suspense.next();
		let t = f(e.anchor || e.el), n = t && t[er];
		return n ? f(n) : t;
	}, _e = !1, ve = (e, t, n) => {
		let r;
		e == null ? t._vnode && (ue(t._vnode, null, null, !0), r = t._vnode.component) : v(t._vnode || null, e, t, null, null, null, n), t._vnode = e, _e ||= (_e = !0, Rn(r), zn(), !1);
	}, M = {
		p: v,
		um: ue,
		m: le,
		r: de,
		mt: te,
		mc: D,
		pc: oe,
		pbc: k,
		n: ge,
		o: e
	}, be, xe;
	return t && ([be, xe] = t(M)), {
		render: ve,
		hydrate: be,
		createApp: Wr(ve, be)
	};
}
function Ci({ type: e, props: t }, n) {
	return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function wi({ effect: e, job: t }, n) {
	n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function Ti(e, t) {
	return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function Ei(e, t, n = !1) {
	let r = e.children, i = t.children;
	if (C(r) && C(i)) for (let e = 0; e < r.length; e++) {
		let t = r[e], a = i[e];
		a.shapeFlag & 1 && !a.dynamicChildren && ((a.patchFlag <= 0 || a.patchFlag === 32) && (a = i[e] = na(i[e]), a.el = t.el), !n && a.patchFlag !== -2 && Ei(t, a)), a.type === Pi && (a.patchFlag === -1 && (a = i[e] = na(a)), a.el = t.el), a.type === Fi && !a.el && (a.el = t.el);
	}
}
function Di(e) {
	let t = e.slice(), n = [0], r, i, a, o, s, c = e.length;
	for (r = 0; r < c; r++) {
		let c = e[r];
		if (c !== 0) {
			if (i = n[n.length - 1], e[i] < c) {
				t[r] = i, n.push(r);
				continue;
			}
			for (a = 0, o = n.length - 1; a < o;) s = a + o >> 1, e[n[s]] < c ? a = s + 1 : o = s;
			c < e[n[a]] && (a > 0 && (t[r] = n[a - 1]), n[a] = r);
		}
	}
	for (a = n.length, o = n[a - 1]; a-- > 0;) n[a] = o, o = t[o];
	return n;
}
function Oi(e) {
	let t = e.subTree.component;
	if (t) return t.asyncDep && !t.asyncResolved ? t : Oi(t);
}
function ki(e) {
	if (e) for (let t = 0; t < e.length; t++) e[t].flags |= 8;
}
function Ai(e) {
	if (e.placeholder) return e.placeholder;
	let t = e.component;
	return t ? Ai(t.subTree) : null;
}
var ji = (e) => e.__isSuspense;
function Mi(e, t) {
	t && t.pendingBranch ? C(e) ? t.effects.push(...e) : t.effects.push(e) : Ln(e);
}
var Ni = /* @__PURE__ */ Symbol.for("v-fgt"), Pi = /* @__PURE__ */ Symbol.for("v-txt"), Fi = /* @__PURE__ */ Symbol.for("v-cmt"), Ii = /* @__PURE__ */ Symbol.for("v-stc"), Li = [], Ri = null;
function L(e = !1) {
	Li.push(Ri = e ? null : []);
}
function zi() {
	Li.pop(), Ri = Li[Li.length - 1] || null;
}
var Bi = 1;
function Vi(e, t = !1) {
	Bi += e, e < 0 && Ri && t && (Ri.hasOnce = !0);
}
function Hi(e) {
	return e.dynamicChildren = Bi > 0 ? Ri || m : null, zi(), Bi > 0 && Ri && Ri.push(e), e;
}
function R(e, t, n, r, i, a) {
	return Hi(Ji(e, t, n, r, i, a, !0));
}
function Ui(e, t, n, r, i) {
	return Hi(Yi(e, t, n, r, i, !0));
}
function Wi(e) {
	return e ? e.__v_isVNode === !0 : !1;
}
function Gi(e, t) {
	return e.type === t.type && e.key === t.key;
}
var Ki = ({ key: e }) => e ?? null, qi = ({ ref: e, ref_key: t, ref_for: n }) => (typeof e == "number" && (e = "" + e), e == null ? null : O(e) || /* @__PURE__ */ nn(e) || D(e) ? {
	i: Hn,
	r: e,
	k: t,
	f: !!n
} : e);
function Ji(e, t = null, n = null, r = 0, i = null, a = e === Ni ? 0 : 1, o = !1, s = !1) {
	let c = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e,
		props: t,
		key: t && Ki(t),
		ref: t && qi(t),
		scopeId: Un,
		slotScopeIds: null,
		children: n,
		component: null,
		suspense: null,
		ssContent: null,
		ssFallback: null,
		dirs: null,
		transition: null,
		el: null,
		anchor: null,
		target: null,
		targetStart: null,
		targetAnchor: null,
		staticCount: 0,
		shapeFlag: a,
		patchFlag: r,
		dynamicProps: i,
		dynamicChildren: null,
		appContext: null,
		ctx: Hn
	};
	return s ? (ra(c, n), a & 128 && e.normalize(c)) : n && (c.shapeFlag |= O(n) ? 8 : 16), Bi > 0 && !o && Ri && (c.patchFlag > 0 || a & 6) && c.patchFlag !== 32 && Ri.push(c), c;
}
var Yi = Xi;
function Xi(e, t = null, n = null, r = 0, i = null, a = !1) {
	if ((!e || e === Fr) && (e = Fi), Wi(e)) {
		let r = Qi(e, t, !0);
		return n && ra(r, n), Bi > 0 && !a && Ri && (r.shapeFlag & 6 ? Ri[Ri.indexOf(e)] = r : Ri.push(r)), r.patchFlag = -2, r;
	}
	if (wa(e) && (e = e.__vccOpts), t) {
		t = Zi(t);
		let { class: e, style: n } = t;
		e && !O(e) && (t.class = we(e)), A(n) && (/* @__PURE__ */ Qt(n) && !C(n) && (n = y({}, n)), t.style = M(n));
	}
	let o = O(e) ? 1 : ji(e) ? 128 : tr(e) ? 64 : A(e) ? 4 : D(e) ? 2 : 0;
	return Ji(e, t, n, r, i, o, a, !0);
}
function Zi(e) {
	return e ? /* @__PURE__ */ Qt(e) || ai(e) ? y({}, e) : e : null;
}
function Qi(e, t, n = !1, r = !1) {
	let { props: i, ref: a, patchFlag: o, children: s, transition: c } = e, l = t ? ia(i || {}, t) : i, u = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e.type,
		props: l,
		key: l && Ki(l),
		ref: t && t.ref ? n && a ? C(a) ? a.concat(qi(t)) : [a, qi(t)] : qi(t) : a,
		scopeId: e.scopeId,
		slotScopeIds: e.slotScopeIds,
		children: s,
		target: e.target,
		targetStart: e.targetStart,
		targetAnchor: e.targetAnchor,
		staticCount: e.staticCount,
		shapeFlag: e.shapeFlag,
		patchFlag: t && e.type !== Ni ? o === -1 ? 16 : o | 16 : o,
		dynamicProps: e.dynamicProps,
		dynamicChildren: e.dynamicChildren,
		appContext: e.appContext,
		dirs: e.dirs,
		transition: c,
		component: e.component,
		suspense: e.suspense,
		ssContent: e.ssContent && Qi(e.ssContent),
		ssFallback: e.ssFallback && Qi(e.ssFallback),
		placeholder: e.placeholder,
		el: e.el,
		anchor: e.anchor,
		ctx: e.ctx,
		ce: e.ce,
		cacheIndex: e.cacheIndex
	};
	return c && r && hr(u, c.clone(u)), u;
}
function $i(e = " ", t = 0) {
	return Yi(Pi, null, e, t);
}
function ea(e = "", t = !1) {
	return t ? (L(), Ui(Fi, null, e)) : Yi(Fi, null, e);
}
function ta(e) {
	return e == null || typeof e == "boolean" ? Yi(Fi) : C(e) ? Yi(Ni, null, e.slice()) : Wi(e) ? na(e) : Yi(Pi, null, String(e));
}
function na(e) {
	return e.el === null && e.patchFlag !== -1 || e.memo ? e : Qi(e);
}
function ra(e, t) {
	let n = 0, { shapeFlag: r } = e;
	if (t == null) t = null;
	else if (C(t)) n = 16;
	else if (typeof t == "object") {
		if (r & 65) {
			let n = t.default;
			n && (n._c && (n._d = !1), ra(e, n()), n._c && (n._d = !0));
			return;
		}
		{
			n = 32;
			let r = t._;
			!r && !ai(t) ? t._ctx = Hn : r === 3 && Hn && (Hn.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
		}
	} else if (D(t)) {
		if (r & 65) {
			ra(e, { default: t });
			return;
		}
		t = {
			default: t,
			_ctx: Hn
		}, n = 32;
	} else t = String(t), r & 64 ? (n = 16, t = [$i(t)]) : n = 8;
	e.children = t, e.shapeFlag |= n;
}
function ia(...e) {
	let t = {};
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		for (let e in r) if (e === "class") t.class !== r.class && (t.class = we([t.class, r.class]));
		else if (e === "style") t.style = M([t.style, r.style]);
		else if (_(e)) {
			let n = t[e], i = r[e];
			i && n !== i && !(C(n) && n.includes(i)) ? t[e] = n ? [].concat(n, i) : i : i == null && n == null && !v(e) && (t[e] = i);
		} else e !== "" && (t[e] = r[e]);
	}
	return t;
}
function aa(e, t, n, r = null) {
	Cn(e, t, 7, [n, r]);
}
var oa = Hr(), sa = 0;
function ca(e, t, n) {
	let r = e.type, i = (t ? t.appContext : e.appContext) || oa, a = {
		uid: sa++,
		vnode: e,
		type: r,
		parent: t,
		appContext: i,
		root: null,
		next: null,
		subTree: null,
		effect: null,
		update: null,
		job: null,
		scope: new Pe(!0),
		render: null,
		proxy: null,
		exposed: null,
		exposeProxy: null,
		withProxy: null,
		provides: t ? t.provides : Object.create(i.provides),
		ids: t ? t.ids : [
			"",
			0,
			0
		],
		accessCache: null,
		renderCache: [],
		components: null,
		directives: null,
		propsOptions: ui(r, i),
		emitsOptions: Jr(r, i),
		emit: null,
		emitted: null,
		propsDefaults: p,
		inheritAttrs: r.inheritAttrs,
		ctx: p,
		data: p,
		props: p,
		attrs: p,
		slots: p,
		refs: p,
		setupState: p,
		setupContext: null,
		suspense: n,
		suspenseId: n ? n.pendingId : 0,
		asyncDep: null,
		asyncResolved: !1,
		isMounted: !1,
		isUnmounted: !1,
		isDeactivated: !1,
		bc: null,
		c: null,
		bm: null,
		m: null,
		bu: null,
		u: null,
		um: null,
		bum: null,
		da: null,
		a: null,
		rtg: null,
		rtc: null,
		ec: null,
		sp: null
	};
	return a.ctx = { _: a }, a.root = t ? t.root : a, a.emit = qr.bind(null, a), e.ce && e.ce(a), a;
}
var la = null, ua = () => la || Hn, da, fa;
{
	let e = ye(), t = (t, n) => {
		let r;
		return (r = e[t]) || (r = e[t] = []), r.push(n), (e) => {
			r.length > 1 ? r.forEach((t) => t(e)) : r[0](e);
		};
	};
	da = t("__VUE_INSTANCE_SETTERS__", (e) => la = e), fa = t("__VUE_SSR_SETTERS__", (e) => ga = e);
}
var pa = (e) => {
	let t = la;
	return da(e), e.scope.on(), () => {
		e.scope.off(), da(t);
	};
}, ma = () => {
	la && la.scope.off(), da(null);
};
function ha(e) {
	return e.vnode.shapeFlag & 4;
}
var ga = !1;
function _a(e, t = !1, n = !1) {
	t && fa(t);
	let { props: r, children: i } = e.vnode, a = ha(e);
	oi(e, r, a, t), vi(e, i, n || t);
	let o = a ? va(e, t) : void 0;
	return t && fa(!1), o;
}
function va(e, t) {
	let n = e.type;
	e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, Vr);
	let { setup: r } = n;
	if (r) {
		Qe();
		let n = e.setupContext = r.length > 1 ? Sa(e) : null, i = pa(e), a = Sn(r, e, 0, [e.props, n]), o = ee(a);
		if ($e(), i(), (o || e.sp) && !Sr(e) && _r(e), o) {
			if (a.then(ma, ma), t) return a.then((n) => {
				fa(!0);
				try {
					ya(e, n, t);
				} finally {
					fa(!1);
				}
			}).catch((t) => {
				wn(t, e, 0);
			});
			e.asyncDep = a;
		} else ya(e, a, t);
	} else ba(e, t);
}
function ya(e, t, n) {
	D(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : A(t) && (e.setupState = ln(t)), ba(e, n);
}
function ba(e, t, n) {
	let r = e.type;
	e.render ||= r.render || h;
}
var xa = { get(e, t) {
	return lt(e, "get", ""), e[t];
} };
function Sa(e) {
	return {
		attrs: new Proxy(e.attrs, xa),
		slots: e.slots,
		emit: e.emit,
		expose: (t) => {
			e.exposed = t || {};
		}
	};
}
function Ca(e) {
	return e.exposed ? e.exposeProxy ||= new Proxy(ln($t(e.exposed)), {
		get(t, n) {
			if (n in t) return t[n];
			if (n in zr) return zr[n](e);
		},
		has(e, t) {
			return t in e || t in zr;
		}
	}) : e.proxy;
}
function wa(e) {
	return D(e) && "__vccOpts" in e;
}
var z = (e, t) => /* @__PURE__ */ hn(e, t, ga);
function B(e, t, n) {
	try {
		Vi(-1);
		let r = arguments.length;
		return r === 2 ? A(t) && !C(t) ? Wi(t) ? Yi(e, null, [t]) : Yi(e, t) : Yi(e, null, t) : (r > 3 ? n = Array.prototype.slice.call(arguments, 2) : r === 3 && Wi(n) && (n = [n]), Yi(e, t, n));
	} finally {
		Vi(1);
	}
}
var Ta = "3.5.43", Ea = void 0, Da = typeof window < "u" && window.trustedTypes;
if (Da) try {
	Ea = /* @__PURE__ */ Da.createPolicy("vue", { createHTML: (e) => e });
} catch {}
var Oa = Ea ? (e) => Ea.createHTML(e) : (e) => e, ka = "http://www.w3.org/2000/svg", Aa = "http://www.w3.org/1998/Math/MathML", ja = typeof document < "u" ? document : null, Ma = ja && /* @__PURE__ */ ja.createElement("template"), Na = {
	insert: (e, t, n) => {
		t.insertBefore(e, n || null);
	},
	remove: (e) => {
		let t = e.parentNode;
		t && t.removeChild(e);
	},
	createElement: (e, t, n, r) => {
		let i = t === "svg" ? ja.createElementNS(ka, e) : t === "mathml" ? ja.createElementNS(Aa, e) : n ? ja.createElement(e, { is: n }) : ja.createElement(e);
		return e === "select" && r && r.multiple != null && i.setAttribute("multiple", r.multiple), i;
	},
	createText: (e) => ja.createTextNode(e),
	createComment: (e) => ja.createComment(e),
	setText: (e, t) => {
		e.nodeValue = t;
	},
	setElementText: (e, t) => {
		e.textContent = t;
	},
	parentNode: (e) => e.parentNode,
	nextSibling: (e) => e.nextSibling,
	querySelector: (e) => ja.querySelector(e),
	setScopeId(e, t) {
		e.setAttribute(t, "");
	},
	insertStaticContent(e, t, n, r, i, a) {
		let o = n ? n.previousSibling : t.lastChild;
		if (i && (i === a || i.nextSibling)) for (; t.insertBefore(i.cloneNode(!0), n), i !== a && (i = i.nextSibling););
		else {
			Ma.innerHTML = Oa(r === "svg" ? `<svg>${e}</svg>` : r === "mathml" ? `<math>${e}</math>` : e);
			let i = Ma.content;
			if (r === "svg" || r === "mathml") {
				let e = i.firstChild;
				for (; e.firstChild;) i.appendChild(e.firstChild);
				i.removeChild(e);
			}
			t.insertBefore(i, n);
		}
		return [o ? o.nextSibling : t.firstChild, n ? n.previousSibling : t.lastChild];
	}
}, Pa = "transition", Fa = "animation", Ia = /* @__PURE__ */ Symbol("_vtc"), La = {
	name: String,
	type: String,
	css: {
		type: Boolean,
		default: !0
	},
	duration: [
		String,
		Number,
		Object
	],
	enterFromClass: String,
	enterActiveClass: String,
	enterToClass: String,
	appearFromClass: String,
	appearActiveClass: String,
	appearToClass: String,
	leaveFromClass: String,
	leaveActiveClass: String,
	leaveToClass: String
}, Ra = /* @__PURE__ */ y({}, or, La), za = /* @__PURE__ */ ((e) => (e.displayName = "Transition", e.props = Ra, e))((e, { slots: t }) => B(ur, Ha(e), t)), Ba = (e, t = []) => {
	C(e) ? e.forEach((e) => e(...t)) : e && e(...t);
}, Va = (e) => e ? C(e) ? e.some((e) => e.length > 1) : e.length > 1 : !1;
function Ha(e) {
	let t = {};
	for (let n in e) n in La || (t[n] = e[n]);
	if (e.css === !1) return t;
	let { name: n = "v", type: r, duration: i, enterFromClass: a = `${n}-enter-from`, enterActiveClass: o = `${n}-enter-active`, enterToClass: s = `${n}-enter-to`, appearFromClass: c = a, appearActiveClass: l = o, appearToClass: u = s, leaveFromClass: d = `${n}-leave-from`, leaveActiveClass: f = `${n}-leave-active`, leaveToClass: p = `${n}-leave-to` } = e, m = Ua(i), h = m && m[0], g = m && m[1], { onBeforeEnter: _, onEnter: v, onEnterCancelled: b, onLeave: x, onLeaveCancelled: S, onBeforeAppear: C = _, onAppear: w = v, onAppearCancelled: T = b } = t, E = (e, t, n, r) => {
		e._enterCancelled = r, Ka(e, t ? u : s), Ka(e, t ? l : o), n && n();
	}, D = (e, t) => {
		e._isLeaving = !1, Ka(e, d), Ka(e, p), Ka(e, f), t && t();
	}, O = (e) => (t, n) => {
		let i = e ? w : v, o = () => E(t, e, n);
		Ba(i, [t, o]), qa(() => {
			Ka(t, e ? c : a), Ga(t, e ? u : s), Va(i) || Ya(t, r, h, o);
		});
	};
	return y(t, {
		onBeforeEnter(e) {
			Ba(_, [e]), Ga(e, a), Ga(e, o);
		},
		onBeforeAppear(e) {
			Ba(C, [e]), Ga(e, c), Ga(e, l);
		},
		onEnter: O(!1),
		onAppear: O(!0),
		onLeave(e, t) {
			e._isLeaving = !0;
			let n = () => D(e, t);
			Ga(e, d), e._enterCancelled ? (Ga(e, f), $a(e)) : ($a(e), Ga(e, f)), qa(() => {
				e._isLeaving && (Ka(e, d), Ga(e, p), Va(x) || Ya(e, r, g, n));
			}), Ba(x, [e, n]);
		},
		onEnterCancelled(e) {
			E(e, !1, void 0, !0), Ba(b, [e]);
		},
		onAppearCancelled(e) {
			E(e, !0, void 0, !0), Ba(T, [e]);
		},
		onLeaveCancelled(e) {
			D(e), Ba(S, [e]);
		}
	});
}
function Ua(e) {
	if (e == null) return null;
	if (A(e)) return [Wa(e.enter), Wa(e.leave)];
	{
		let t = Wa(e);
		return [t, t];
	}
}
function Wa(e) {
	return _e(e);
}
function Ga(e, t) {
	t.split(/\s+/).forEach((t) => t && e.classList.add(t)), (e[Ia] || (e[Ia] = /* @__PURE__ */ new Set())).add(t);
}
function Ka(e, t) {
	t.split(/\s+/).forEach((t) => t && e.classList.remove(t));
	let n = e[Ia];
	n && (n.delete(t), n.size || (e[Ia] = void 0));
}
function qa(e) {
	requestAnimationFrame(() => {
		requestAnimationFrame(e);
	});
}
var Ja = 0;
function Ya(e, t, n, r) {
	let i = e._endId = ++Ja, a = () => {
		i === e._endId && r();
	};
	if (n != null) return setTimeout(a, n);
	let { type: o, timeout: s, propCount: c } = Xa(e, t);
	if (!o) return r();
	let l = o + "end", u = 0, d = () => {
		e.removeEventListener(l, f), a();
	}, f = (t) => {
		t.target === e && ++u >= c && d();
	};
	setTimeout(() => {
		u < c && d();
	}, s + 1), e.addEventListener(l, f);
}
function Xa(e, t) {
	let n = window.getComputedStyle(e), r = (e) => (n[e] || "").split(", "), i = r(`${Pa}Delay`), a = r(`${Pa}Duration`), o = Za(i, a), s = r(`${Fa}Delay`), c = r(`${Fa}Duration`), l = Za(s, c), u = null, d = 0, f = 0;
	t === Pa ? o > 0 && (u = Pa, d = o, f = a.length) : t === Fa ? l > 0 && (u = Fa, d = l, f = c.length) : (d = Math.max(o, l), u = d > 0 ? o > l ? Pa : Fa : null, f = u ? u === Pa ? a.length : c.length : 0);
	let p = u === Pa && /\b(?:transform|all)(?:,|$)/.test(r(`${Pa}Property`).toString());
	return {
		type: u,
		timeout: d,
		propCount: f,
		hasTransform: p
	};
}
function Za(e, t) {
	for (; e.length < t.length;) e = e.concat(e);
	return Math.max(...t.map((t, n) => Qa(t) + Qa(e[n])));
}
function Qa(e) {
	return e === "auto" ? 0 : Number(e.slice(0, -1).replace(",", ".")) * 1e3;
}
function $a(e) {
	return (e ? e.ownerDocument : document).body.offsetHeight;
}
function eo(e, t, n) {
	let r = e[Ia];
	r && (t = (t ? [t, ...r] : [...r]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t;
}
var to = /* @__PURE__ */ Symbol("_vod"), no = /* @__PURE__ */ Symbol("_vsh"), ro = /* @__PURE__ */ Symbol(""), io = /(?:^|;)\s*display\s*:/;
function ao(e, t, n) {
	let r = e.style, i = O(n), a = !1;
	if (n && !i) {
		if (t) {
			if (O(t)) for (let e of t.split(";")) {
				let t = e.slice(0, e.indexOf(":")).trim();
				n[t] ?? so(r, t, "");
			}
			else for (let e in t) n[e] ?? so(r, e, "");
		}
		for (let i in n) {
			i === "display" && (a = !0);
			let o = n[i];
			o == null ? so(r, i, "") : fo(e, i, !O(t) && t ? t[i] : void 0, o) || so(r, i, o);
		}
	} else if (i) {
		if (t !== n) {
			let e = r[ro];
			e && (n += ";" + e), r.cssText = n, a = io.test(n);
		}
	} else t && e.removeAttribute("style");
	to in e && (e[to] = a ? r.display : "", e[no] && (r.display = "none"));
}
var oo = /\s*!important$/;
function so(e, t, n) {
	if (C(n)) n.forEach((n) => so(e, t, n));
	else if (n ??= "", t.startsWith("--")) oo.test(n) ? e.setProperty(t, n.replace(oo, ""), "important") : e.setProperty(t, n);
	else {
		let r = uo(e, t);
		oo.test(n) ? e.setProperty(ue(r), n.replace(oo, ""), "important") : e[r] = n;
	}
}
var co = [
	"Webkit",
	"Moz",
	"ms"
], lo = {};
function uo(e, t) {
	let n = lo[t];
	if (n) return n;
	let r = ce(t);
	if (r !== "filter" && r in e) return lo[t] = r;
	r = de(r);
	for (let n = 0; n < co.length; n++) {
		let i = co[n] + r;
		if (i in e) return lo[t] = i;
	}
	return t;
}
function fo(e, t, n, r) {
	return e.tagName === "TEXTAREA" && (t === "width" || t === "height") && O(r) && n === r;
}
var po = "http://www.w3.org/1999/xlink";
function mo(e, t, n, r, i, a = Ee(t)) {
	r && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(po, t.slice(6, t.length)) : e.setAttributeNS(po, t, n) : n == null || a && !De(n) ? e.removeAttribute(t) : e.setAttribute(t, a ? "" : k(n) ? String(n) : n);
}
function ho(e, t, n, r, i) {
	if (t === "innerHTML" || t === "textContent") {
		n != null && (e[t] = t === "innerHTML" ? Oa(n) : n);
		return;
	}
	let a = e.tagName;
	if (t === "value" && a !== "PROGRESS" && !a.includes("-")) {
		let r = a === "OPTION" ? e.getAttribute("value") || "" : e.value, i = n == null ? e.type === "checkbox" ? "on" : "" : String(n);
		(r !== i || !("_value" in e)) && (e.value = i), n ?? e.removeAttribute(t), e._value = n;
		return;
	}
	let o = !1;
	if (n === "" || n == null) {
		let r = typeof e[t];
		r === "boolean" ? n = De(n) : n == null && r === "string" ? (n = "", o = !0) : r === "number" && (n = 0, o = !0);
	}
	try {
		e[t] = n;
	} catch {}
	o && e.removeAttribute(i || t);
}
function go(e, t, n, r) {
	e.addEventListener(t, n, r);
}
function _o(e, t, n, r) {
	e.removeEventListener(t, n, r);
}
var vo = /* @__PURE__ */ Symbol("_vei");
function yo(e, t, n, r, i = null) {
	let a = e[vo] || (e[vo] = {}), o = a[t];
	if (r && o) o.value = r;
	else {
		let [n, s] = So(t);
		r ? go(e, n, a[t] = Eo(r, i), s) : o && (_o(e, n, o, s), a[t] = void 0);
	}
}
var bo = /(Once|Passive|Capture)$/, xo = /^on:?(?:Once|Passive|Capture)$/;
function So(e) {
	let t, n;
	for (; (n = e.match(bo)) && !xo.test(e);) t ||= {}, e = e.slice(0, e.length - n[1].length), t[n[1].toLowerCase()] = !0;
	return [e[2] === ":" ? e.slice(3) : ue(e.slice(2)), t];
}
var Co = 0, wo = /* @__PURE__ */ Promise.resolve(), To = () => Co ||= (wo.then(() => Co = 0), Date.now());
function Eo(e, t) {
	let n = (e) => {
		if (!e._vts) e._vts = Date.now();
		else if (e._vts <= n.attached) return;
		let r = n.value;
		if (C(r)) {
			let n = e.stopImmediatePropagation;
			e.stopImmediatePropagation = () => {
				n.call(e), e._stopped = !0;
			};
			let i = r.slice(), a = [e];
			for (let n = 0; n < i.length && !e._stopped; n++) {
				let e = i[n];
				e && Cn(e, t, 5, a);
			}
		} else Cn(r, t, 5, [e]);
	};
	return n.value = e, n.attached = To(), n;
}
var Do = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, Oo = (e, t, n, r, i, a) => {
	let o = i === "svg";
	t === "class" ? eo(e, r, o) : t === "style" ? ao(e, n, r) : _(t) ? v(t) || yo(e, t, n, r, a) : (t[0] === "." ? (t = t.slice(1), 1) : t[0] === "^" ? (t = t.slice(1), 0) : ko(e, t, r, o)) ? (ho(e, t, r), !e.tagName.includes("-") && (t === "value" || t === "checked" || t === "selected") && mo(e, t, r, o, a, t !== "value")) : e._isVueCE && (Ao(e, t) || e._def.__asyncLoader && (/[A-Z]/.test(t) || !O(r))) ? ho(e, ce(t), r, a, t) : (t === "true-value" ? e._trueValue = r : t === "false-value" && (e._falseValue = r), mo(e, t, r, o));
};
function ko(e, t, n, r) {
	if (r) return !!(t === "innerHTML" || t === "textContent" || t in e && Do(t) && D(n));
	if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "sandbox" && e.tagName === "IFRAME" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA") return !1;
	if (t === "width" || t === "height") {
		let t = e.tagName;
		if (t === "IMG" || t === "VIDEO" || t === "CANVAS" || t === "SOURCE") return !1;
	}
	return Do(t) && O(n) ? !1 : t in e;
}
function Ao(e, t) {
	let n = e._def.props;
	if (!n) return !1;
	let r = ce(t);
	return Array.isArray(n) ? n.some((e) => ce(e) === r) : Object.keys(n).some((e) => ce(e) === r);
}
var jo = /* @__PURE__ */ new WeakMap(), Mo = /* @__PURE__ */ new WeakMap(), No = /* @__PURE__ */ Symbol("_moveCb"), Po = /* @__PURE__ */ Symbol("_enterCb"), Fo = /* @__PURE__ */ ((e) => (delete e.props.mode, e))({
	name: "TransitionGroup",
	props: /* @__PURE__ */ y({}, Ra, {
		tag: String,
		moveClass: String
	}),
	setup(e, { slots: t }) {
		let n = ua(), r = ir(), i, a;
		return Mr(() => {
			if (!i.length) return;
			let t = e.moveClass || `${e.name || "v"}-move`;
			if (!Bo(i[0].el, n.vnode.el, t)) {
				i = [];
				return;
			}
			i.forEach(Io), i.forEach(Lo);
			let r = i.filter(Ro);
			$a(n.vnode.el), r.forEach((e) => {
				let n = e.el, r = n.style;
				Ga(n, t), r.transform = r.webkitTransform = r.transitionDuration = "";
				let i = n[No] = (e) => {
					e && e.target !== n || (!e || e.propertyName.endsWith("transform")) && (n.removeEventListener("transitionend", i), n[No] = null, Ka(n, t));
				};
				n.addEventListener("transitionend", i);
			}), i = [];
		}), () => {
			let o = /* @__PURE__ */ P(e), s = Ha(o), c = o.tag || Ni;
			if (i = [], a) for (let e = 0; e < a.length; e++) {
				let t = a[e];
				t.el && t.el instanceof Element && !t.el[no] && (i.push(t), hr(t, fr(t, s, r, n)), jo.set(t, zo(t.el)));
			}
			a = t.default ? gr(t.default()) : [];
			for (let e = 0; e < a.length; e++) {
				let t = a[e];
				t.key != null && hr(t, fr(t, s, r, n));
			}
			return Yi(c, null, a);
		};
	}
});
function Io(e) {
	let t = e.el;
	t[No] && t[No](), t[Po] && t[Po]();
}
function Lo(e) {
	Mo.set(e, zo(e.el));
}
function Ro(e) {
	let t = jo.get(e), n = Mo.get(e), r = t.left - n.left, i = t.top - n.top;
	if (r || i) {
		let t = e.el, n = t.style, a = t.getBoundingClientRect(), o = 1, s = 1;
		return t.offsetWidth && (o = a.width / t.offsetWidth), t.offsetHeight && (s = a.height / t.offsetHeight), (!Number.isFinite(o) || o === 0) && (o = 1), (!Number.isFinite(s) || s === 0) && (s = 1), Math.abs(o - 1) < .01 && (o = 1), Math.abs(s - 1) < .01 && (s = 1), n.transform = n.webkitTransform = `translate(${r / o}px,${i / s}px)`, n.transitionDuration = "0s", e;
	}
}
function zo(e) {
	let t = e.getBoundingClientRect();
	return {
		left: t.left,
		top: t.top
	};
}
function Bo(e, t, n) {
	let r = e.cloneNode(), i = e[Ia];
	i && i.forEach((e) => {
		e.split(/\s+/).forEach((e) => e && r.classList.remove(e));
	}), n.split(/\s+/).forEach((e) => e && r.classList.add(e)), r.style.display = "none";
	let a = t.nodeType === 1 ? t : t.parentNode;
	a.appendChild(r);
	let { hasTransform: o } = Xa(r);
	return a.removeChild(r), o;
}
var Vo = /* @__PURE__ */ y({ patchProp: Oo }, Na), Ho;
function Uo() {
	return Ho ||= xi(Vo);
}
var Wo = ((...e) => {
	let t = Uo().createApp(...e), { mount: n } = t;
	return t.mount = (e) => {
		let r = Ko(e);
		if (!r) return;
		let i = t._component;
		!D(i) && !i.render && !i.template && (i.template = r.innerHTML), r.nodeType === 1 && (r.textContent = "");
		let a = n(r, !1, Go(r));
		return r instanceof Element && (r.removeAttribute("v-cloak"), r.setAttribute("data-v-app", "")), a;
	}, t;
});
function Go(e) {
	if (e instanceof SVGElement) return "svg";
	if (typeof MathMLElement == "function" && e instanceof MathMLElement) return "mathml";
}
function Ko(e) {
	return O(e) ? document.querySelector(e) : e;
}
//#endregion
//#region node_modules/@css-render/plugin-bem/esm/index.js
function qo(e) {
	let t = ".", n = "__", r = "--", i;
	if (e) {
		let i = e.blockPrefix;
		i && (t = i), i = e.elementPrefix, i && (n = i), i = e.modifierPrefix, i && (r = i);
	}
	let a = { install(e) {
		i = e.c;
		let t = e.context;
		t.bem = {}, t.bem.b = null, t.bem.els = null;
	} };
	function o(e) {
		let n, r;
		return {
			before(e) {
				n = e.bem.b, r = e.bem.els, e.bem.els = null;
			},
			after(e) {
				e.bem.b = n, e.bem.els = r;
			},
			$({ context: n, props: r }) {
				return e = typeof e == "string" ? e : e({
					context: n,
					props: r
				}), n.bem.b = e, `${r?.bPrefix || t}${n.bem.b}`;
			}
		};
	}
	function s(e) {
		let r;
		return {
			before(e) {
				r = e.bem.els;
			},
			after(e) {
				e.bem.els = r;
			},
			$({ context: r, props: i }) {
				return e = typeof e == "string" ? e : e({
					context: r,
					props: i
				}), r.bem.els = e.split(",").map((e) => e.trim()), r.bem.els.map((e) => `${i?.bPrefix || t}${r.bem.b}${n}${e}`).join(", ");
			}
		};
	}
	function c(e) {
		return { $({ context: i, props: a }) {
			e = typeof e == "string" ? e : e({
				context: i,
				props: a
			});
			let o = e.split(",").map((e) => e.trim());
			function s(e) {
				return o.map((o) => `&${a?.bPrefix || t}${i.bem.b}${e === void 0 ? "" : `${n}${e}`}${r}${o}`).join(", ");
			}
			let c = i.bem.els;
			return c === null ? s() : s(c[0]);
		} };
	}
	function l(e) {
		return { $({ context: i, props: a }) {
			e = typeof e == "string" ? e : e({
				context: i,
				props: a
			});
			let o = i.bem.els;
			return `&:not(${a?.bPrefix || t}${i.bem.b}${o !== null && o.length > 0 ? `${n}${o[0]}` : ""}${r}${e})`;
		} };
	}
	return Object.assign(a, {
		cB: ((...e) => i(o(e[0]), e[1], e[2])),
		cE: ((...e) => i(s(e[0]), e[1], e[2])),
		cM: ((...e) => i(c(e[0]), e[1], e[2])),
		cNotM: ((...e) => i(l(e[0]), e[1], e[2]))
	}), a;
}
//#endregion
//#region node_modules/css-render/esm/parse.js
function Jo(e) {
	let t = 0;
	for (let n = 0; n < e.length; ++n) e[n] === "&" && ++t;
	return t;
}
var Yo = /\s*,(?![^(]*\))\s*/g, Xo = /\s+/g;
function Zo(e, t) {
	let n = [];
	return t.split(Yo).forEach((t) => {
		let r = Jo(t);
		if (!r) {
			e.forEach((e) => {
				n.push((e && e + " ") + t);
			});
			return;
		}
		if (r === 1) {
			e.forEach((e) => {
				n.push(t.replace("&", e));
			});
			return;
		}
		let i = [t];
		for (; r--;) {
			let t = [];
			i.forEach((n) => {
				e.forEach((e) => {
					t.push(n.replace("&", e));
				});
			}), i = t;
		}
		i.forEach((e) => n.push(e));
	}), n;
}
function Qo(e, t) {
	let n = [];
	return t.split(Yo).forEach((t) => {
		e.forEach((e) => {
			n.push((e && e + " ") + t);
		});
	}), n;
}
function $o(e) {
	let t = [""];
	return e.forEach((e) => {
		e &&= e.trim(), e && (t = e.includes("&") ? Zo(t, e) : Qo(t, e));
	}), t.join(", ").replace(Xo, " ");
}
//#endregion
//#region node_modules/css-render/esm/utils.js
function es(e) {
	/* istanbul ignore if */
	if (!e) return;
	let t = e.parentElement;
	/* istanbul ignore else */
	t && t.removeChild(e);
}
function ts(e, t) {
	return (t ?? document.head).querySelector(`style[cssr-id="${e}"]`);
}
function ns(e) {
	let t = document.createElement("style");
	return t.setAttribute("cssr-id", e), t;
}
function rs(e) {
	return e ? /^\s*@(s|m)/.test(e) : !1;
}
//#endregion
//#region node_modules/css-render/esm/render.js
var is = /[A-Z]/g;
function as(e) {
	return e.replace(is, (e) => "-" + e.toLowerCase());
}
function os(e, t = "  ") {
	return typeof e == "object" && e ? " {\n" + Object.entries(e).map((e) => t + `  ${as(e[0])}: ${e[1]};`).join("\n") + "\n" + t + "}" : `: ${e};`;
}
function ss(e, t, n) {
	return typeof e == "function" ? e({
		context: t.context,
		props: n
	}) : e;
}
function cs(e, t, n, r) {
	if (!t) return "";
	let i = ss(t, n, r);
	if (!i) return "";
	if (typeof i == "string") return `${e} {\n${i}\n}`;
	let a = Object.keys(i);
	if (a.length === 0) return n.config.keepEmptyBlock ? e + " {\n}" : "";
	let o = e ? [e + " {"] : [];
	return a.forEach((e) => {
		let t = i[e];
		if (e === "raw") {
			o.push("\n" + t + "\n");
			return;
		}
		e = as(e), t != null && o.push(`  ${e}${os(t)}`);
	}), e && o.push("}"), o.join("\n");
}
function ls(e, t, n) {
	/* istanbul ignore if */
	e && e.forEach((e) => {
		if (Array.isArray(e)) ls(e, t, n);
		else if (typeof e == "function") {
			let r = e(t);
			Array.isArray(r) ? ls(r, t, n) : r && n(r);
		} else e && n(e);
	});
}
function us(e, t, n, r, i) {
	let a = e.$, o = "";
	if (!a || typeof a == "string") rs(a) ? o = a : t.push(a);
	else if (typeof a == "function") {
		let e = a({
			context: r.context,
			props: i
		});
		rs(e) ? o = e : t.push(e);
	} else if (a.before && a.before(r.context), !a.$ || typeof a.$ == "string") rs(a.$) ? o = a.$ : t.push(a.$);
	else if (a.$) {
		let e = a.$({
			context: r.context,
			props: i
		});
		rs(e) ? o = e : t.push(e);
	}
	let s = $o(t), c = cs(s, e.props, r, i);
	o ? n.push(`${o} {`) : c.length && n.push(c), e.children && ls(e.children, {
		context: r.context,
		props: i
	}, (e) => {
		if (typeof e == "string") {
			let t = cs(s, { raw: e }, r, i);
			n.push(t);
		} else us(e, t, n, r, i);
	}), t.pop(), o && n.push("}"), a && a.after && a.after(r.context);
}
function ds(e, t, n) {
	let r = [];
	return us(e, [], r, t, n), r.join("\n\n");
}
//#endregion
//#region node_modules/@emotion/hash/dist/hash.browser.esm.js
function fs(e) {
	for (var t = 0, n, r = 0, i = e.length; i >= 4; ++r, i -= 4) n = e.charCodeAt(r) & 255 | (e.charCodeAt(++r) & 255) << 8 | (e.charCodeAt(++r) & 255) << 16 | (e.charCodeAt(++r) & 255) << 24, n = (n & 65535) * 1540483477 + ((n >>> 16) * 59797 << 16), n ^= n >>> 24, t = (n & 65535) * 1540483477 + ((n >>> 16) * 59797 << 16) ^ (t & 65535) * 1540483477 + ((t >>> 16) * 59797 << 16);
	switch (i) {
		case 3: t ^= (e.charCodeAt(r + 2) & 255) << 16;
		case 2: t ^= (e.charCodeAt(r + 1) & 255) << 8;
		case 1: t ^= e.charCodeAt(r) & 255, t = (t & 65535) * 1540483477 + ((t >>> 16) * 59797 << 16);
	}
	return t ^= t >>> 13, t = (t & 65535) * 1540483477 + ((t >>> 16) * 59797 << 16), ((t ^ t >>> 15) >>> 0).toString(36);
}
//#endregion
//#region node_modules/css-render/esm/mount.js
typeof window < "u" && (window.__cssrContext = {});
function ps(e, t, n, r) {
	let { els: i } = t;
	if (n === void 0) i.forEach(es), t.els = [];
	else {
		let e = ts(n, r);
		e && i.includes(e) && (es(e), t.els = i.filter((t) => t !== e));
	}
}
function ms(e, t) {
	e.push(t);
}
function hs(e, t, n, r, i, a, o, s, c) {
	let l;
	if (n === void 0 && (l = t.render(r), n = fs(l)), c) {
		c.adapter(n, l ?? t.render(r));
		return;
	}
	s === void 0 && (s = document.head);
	let u = ts(n, s);
	if (u !== null && !a) return u;
	let d = u ?? ns(n);
	if (l === void 0 && (l = t.render(r)), d.textContent = l, u !== null) return u;
	if (o) {
		let e = s.querySelector(`meta[name="${o}"]`);
		if (e) return s.insertBefore(d, e), ms(t.els, d), d;
	}
	return i ? s.insertBefore(d, s.querySelector("style, link")) : s.appendChild(d), ms(t.els, d), d;
}
//#endregion
//#region node_modules/css-render/esm/c.js
function gs(e) {
	return ds(this, this.instance, e);
}
function _s(e = {}) {
	let { id: t, ssr: n, props: r, head: i = !1, force: a = !1, anchorMetaName: o, parent: s } = e;
	return hs(this.instance, this, t, r, i, a, o, s, n);
}
function vs(e = {}) {
	/* istanbul ignore next */
	let { id: t, parent: n } = e;
	ps(this.instance, this, t, n);
}
var ys = function(e, t, n, r) {
	return {
		instance: e,
		$: t,
		props: n,
		children: r,
		els: [],
		render: gs,
		mount: _s,
		unmount: vs
	};
}, bs = function(e, t, n, r) {
	return Array.isArray(t) ? ys(e, { $: null }, null, t) : Array.isArray(n) ? ys(e, t, null, n) : Array.isArray(r) ? ys(e, t, n, r) : ys(e, t, n, null);
};
//#endregion
//#region node_modules/css-render/esm/CssRender.js
function xs(e = {}) {
	let t = {
		c: ((...e) => bs(t, ...e)),
		use: (e, ...n) => e.install(t, ...n),
		find: ts,
		context: {},
		config: e
	};
	return t;
}
//#endregion
//#region node_modules/css-render/esm/exists.js
function Ss(e, t) {
	if (e === void 0) return !1;
	if (t) {
		let { context: { ids: n } } = t;
		return n.has(e);
	}
	return ts(e) !== null;
}
//#endregion
//#region node_modules/naive-ui/es/_utils/cssr/index.mjs
var Cs = ".n-", ws = "__", Ts = "--", Es = xs(), Ds = qo({
	blockPrefix: Cs,
	elementPrefix: ws,
	modifierPrefix: Ts
});
Es.use(Ds);
var { c: V, find: Os } = Es, { cB: H, cE: U, cM: W, cNotM: ks } = Ds;
function As(e) {
	return V(({ props: { bPrefix: e } }) => `${e || Cs}modal, ${e || Cs}drawer`, [e]);
}
function js(e) {
	return V(({ props: { bPrefix: e } }) => `${e || Cs}popover`, [e]);
}
function Ms(e) {
	return V(({ props: { bPrefix: e } }) => `&${e || Cs}modal`, e);
}
function G(e, t) {
	return e + (t === "default" ? "" : t.replace(/^[a-z]/, (e) => e.toUpperCase()));
}
//#endregion
//#region node_modules/naive-ui/es/locales/common/enUS.mjs
var Ns = {
	name: "en-US",
	global: {
		undo: "Undo",
		redo: "Redo",
		confirm: "Confirm",
		clear: "Clear"
	},
	Popconfirm: {
		positiveText: "Confirm",
		negativeText: "Cancel"
	},
	Cascader: {
		placeholder: "Please Select",
		loading: "Loading",
		loadingRequiredMessage: (e) => `Please load all ${e}'s descendants before checking it.`
	},
	Time: {
		dateFormat: "yyyy-MM-dd",
		dateTimeFormat: "yyyy-MM-dd HH:mm:ss"
	},
	DatePicker: {
		yearFormat: "yyyy",
		monthFormat: "MMM",
		dayFormat: "eeeeee",
		yearTypeFormat: "yyyy",
		monthTypeFormat: "yyyy-MM",
		dateFormat: "yyyy-MM-dd",
		dateTimeFormat: "yyyy-MM-dd HH:mm:ss",
		quarterFormat: "yyyy-qqq",
		weekFormat: "YYYY-w",
		clear: "Clear",
		now: "Now",
		confirm: "Confirm",
		selectTime: "Select Time",
		selectDate: "Select Date",
		datePlaceholder: "Select Date",
		datetimePlaceholder: "Select Date and Time",
		monthPlaceholder: "Select Month",
		yearPlaceholder: "Select Year",
		quarterPlaceholder: "Select Quarter",
		weekPlaceholder: "Select Week",
		startDatePlaceholder: "Start Date",
		endDatePlaceholder: "End Date",
		startDatetimePlaceholder: "Start Date and Time",
		endDatetimePlaceholder: "End Date and Time",
		startMonthPlaceholder: "Start Month",
		endMonthPlaceholder: "End Month",
		monthBeforeYear: !0,
		firstDayOfWeek: 6,
		today: "Today"
	},
	DataTable: {
		checkTableAll: "Select all in the table",
		uncheckTableAll: "Unselect all in the table",
		confirm: "Confirm",
		clear: "Clear"
	},
	LegacyTransfer: {
		sourceTitle: "Source",
		targetTitle: "Target"
	},
	Transfer: {
		selectAll: "Select all",
		unselectAll: "Unselect all",
		clearAll: "Clear",
		total: (e) => `Total ${e} items`,
		selected: (e) => `${e} items selected`
	},
	Empty: { description: "No Data" },
	Select: { placeholder: "Please Select" },
	TimePicker: {
		placeholder: "Select Time",
		positiveText: "OK",
		negativeText: "Cancel",
		now: "Now",
		clear: "Clear"
	},
	Pagination: {
		goto: "Goto",
		selectionSuffix: "page"
	},
	DynamicTags: { add: "Add" },
	Log: { loading: "Loading" },
	Input: { placeholder: "Please Input" },
	InputNumber: { placeholder: "Please Input" },
	DynamicInput: { create: "Create" },
	ThemeEditor: {
		title: "Theme Editor",
		clearAllVars: "Clear All Variables",
		clearSearch: "Clear Search",
		filterCompName: "Filter Component Name",
		filterVarName: "Filter Variable Name",
		import: "Import",
		export: "Export",
		restore: "Reset to Default"
	},
	Image: {
		tipPrevious: "Previous picture (←)",
		tipNext: "Next picture (→)",
		tipCounterclockwise: "Counterclockwise",
		tipClockwise: "Clockwise",
		tipZoomOut: "Zoom out",
		tipZoomIn: "Zoom in",
		tipDownload: "Download",
		tipClose: "Close (Esc)",
		tipOriginalSize: "Zoom to original size"
	},
	Heatmap: {
		less: "less",
		more: "more",
		monthFormat: "MMM",
		weekdayFormat: "eee"
	}
}, Ps = {
	name: "ja-JP",
	global: {
		undo: "元に戻す",
		redo: "やり直す",
		confirm: "OK",
		clear: "クリア"
	},
	Popconfirm: {
		positiveText: "OK",
		negativeText: "キャンセル"
	},
	Cascader: {
		placeholder: "選択してください",
		loading: "ロード中",
		loadingRequiredMessage: (e) => `すべての ${e} サブノードをロードしてから選択できます。`
	},
	Time: {
		dateFormat: "yyyy-MM-dd",
		dateTimeFormat: "yyyy-MM-dd HH:mm:ss"
	},
	DatePicker: {
		yearFormat: "yyyy年",
		monthFormat: "MMM",
		dayFormat: "eeeeee",
		yearTypeFormat: "yyyy",
		monthTypeFormat: "yyyy-MM",
		dateFormat: "yyyy-MM-dd",
		dateTimeFormat: "yyyy-MM-dd HH:mm:ss",
		quarterFormat: "yyyy-qqq",
		weekFormat: "YYYY-w",
		clear: "クリア",
		now: "現在",
		confirm: "OK",
		selectTime: "時間を選択",
		selectDate: "日付を選択",
		datePlaceholder: "日付を選択",
		datetimePlaceholder: "選択",
		monthPlaceholder: "月を選択",
		yearPlaceholder: "年を選択",
		quarterPlaceholder: "四半期を選択",
		weekPlaceholder: "週を選択",
		startDatePlaceholder: "開始日",
		endDatePlaceholder: "終了日",
		startDatetimePlaceholder: "開始時間",
		endDatetimePlaceholder: "終了時間",
		startMonthPlaceholder: "開始月",
		endMonthPlaceholder: "終了月",
		monthBeforeYear: !1,
		firstDayOfWeek: 0,
		today: "今日"
	},
	DataTable: {
		checkTableAll: "全選択",
		uncheckTableAll: "全選択取消",
		confirm: "OK",
		clear: "リセット"
	},
	LegacyTransfer: {
		sourceTitle: "元",
		targetTitle: "先"
	},
	Transfer: {
		selectAll: "全選択",
		unselectAll: "全選択取消",
		clearAll: "リセット",
		total: (e) => `合計 ${e} 項目`,
		selected: (e) => `${e} 個の項目を選択`
	},
	Empty: { description: "データなし" },
	Select: { placeholder: "選択してください" },
	TimePicker: {
		placeholder: "選択してください",
		positiveText: "OK",
		negativeText: "キャンセル",
		now: "現在",
		clear: "クリア"
	},
	Pagination: {
		goto: "ページジャンプ",
		selectionSuffix: "ページ"
	},
	DynamicTags: { add: "追加" },
	Log: { loading: "ロード中" },
	Input: { placeholder: "入力してください" },
	InputNumber: { placeholder: "入力してください" },
	DynamicInput: { create: "追加" },
	ThemeEditor: {
		title: "テーマエディタ",
		clearAllVars: "全件変数クリア",
		clearSearch: "検索クリア",
		filterCompName: "コンポネント名をフィルタ",
		filterVarName: "変数をフィルタ",
		import: "インポート",
		export: "エクスポート",
		restore: "デフォルト"
	},
	Image: {
		tipPrevious: "前の画像 (←)",
		tipNext: "次の画像 (→)",
		tipCounterclockwise: "左に回転",
		tipClockwise: "右に回転",
		tipZoomOut: "縮小",
		tipZoomIn: "拡大",
		tipDownload: "ダウンロード",
		tipClose: "閉じる (Esc)",
		tipOriginalSize: "元のサイズに戻す"
	},
	Heatmap: {
		less: "少",
		more: "多",
		monthFormat: "MMM",
		weekdayFormat: "eeeeee"
	}
}, Fs = {
	name: "zh-CN",
	global: {
		undo: "撤销",
		redo: "重做",
		confirm: "确认",
		clear: "清除"
	},
	Popconfirm: {
		positiveText: "确认",
		negativeText: "取消"
	},
	Cascader: {
		placeholder: "请选择",
		loading: "加载中",
		loadingRequiredMessage: (e) => `加载全部 ${e} 的子节点后才可选中`
	},
	Time: {
		dateFormat: "yyyy-MM-dd",
		dateTimeFormat: "yyyy-MM-dd HH:mm:ss"
	},
	DatePicker: {
		yearFormat: "yyyy年",
		monthFormat: "MMM",
		dayFormat: "eeeeee",
		yearTypeFormat: "yyyy",
		monthTypeFormat: "yyyy-MM",
		dateFormat: "yyyy-MM-dd",
		dateTimeFormat: "yyyy-MM-dd HH:mm:ss",
		quarterFormat: "yyyy-qqq",
		weekFormat: "YYYY-w周",
		clear: "清除",
		now: "此刻",
		confirm: "确认",
		selectTime: "选择时间",
		selectDate: "选择日期",
		datePlaceholder: "选择日期",
		datetimePlaceholder: "选择日期时间",
		monthPlaceholder: "选择月份",
		yearPlaceholder: "选择年份",
		quarterPlaceholder: "选择季度",
		weekPlaceholder: "选择周",
		startDatePlaceholder: "开始日期",
		endDatePlaceholder: "结束日期",
		startDatetimePlaceholder: "开始日期时间",
		endDatetimePlaceholder: "结束日期时间",
		startMonthPlaceholder: "开始月份",
		endMonthPlaceholder: "结束月份",
		monthBeforeYear: !1,
		firstDayOfWeek: 0,
		today: "今天"
	},
	DataTable: {
		checkTableAll: "选择全部表格数据",
		uncheckTableAll: "取消选择全部表格数据",
		confirm: "确认",
		clear: "重置"
	},
	LegacyTransfer: {
		sourceTitle: "源项",
		targetTitle: "目标项"
	},
	Transfer: {
		selectAll: "全选",
		clearAll: "清除",
		unselectAll: "取消全选",
		total: (e) => `共 ${e} 项`,
		selected: (e) => `已选 ${e} 项`
	},
	Empty: { description: "无数据" },
	Select: { placeholder: "请选择" },
	TimePicker: {
		placeholder: "请选择时间",
		positiveText: "确认",
		negativeText: "取消",
		now: "此刻",
		clear: "清除"
	},
	Pagination: {
		goto: "跳至",
		selectionSuffix: "页"
	},
	DynamicTags: { add: "添加" },
	Log: { loading: "加载中" },
	Input: { placeholder: "请输入" },
	InputNumber: { placeholder: "请输入" },
	DynamicInput: { create: "添加" },
	ThemeEditor: {
		title: "主题编辑器",
		clearAllVars: "清除全部变量",
		clearSearch: "清除搜索",
		filterCompName: "过滤组件名",
		filterVarName: "过滤变量名",
		import: "导入",
		export: "导出",
		restore: "恢复默认"
	},
	Image: {
		tipPrevious: "上一张（←）",
		tipNext: "下一张（→）",
		tipCounterclockwise: "向左旋转",
		tipClockwise: "向右旋转",
		tipZoomOut: "缩小",
		tipZoomIn: "放大",
		tipDownload: "下载",
		tipClose: "关闭（Esc）",
		tipOriginalSize: "缩放到原始尺寸"
	},
	Heatmap: {
		less: "少",
		more: "多",
		monthFormat: "MMM",
		weekdayFormat: "eeeeee"
	}
}, Is = {
	name: "zh-TW",
	global: {
		undo: "復原",
		redo: "重做",
		confirm: "確定",
		clear: "清除"
	},
	Popconfirm: {
		positiveText: "確定",
		negativeText: "取消"
	},
	Cascader: {
		placeholder: "請選擇",
		loading: "載入中",
		loadingRequiredMessage: (e) => `載入全部 ${e} 的子節點後才可選擇`
	},
	Time: {
		dateFormat: "yyyy-MM-dd",
		dateTimeFormat: "yyyy-MM-dd HH:mm:ss"
	},
	DatePicker: {
		yearFormat: "yyyy 年",
		monthFormat: "MMM",
		dayFormat: "eeeeee",
		yearTypeFormat: "yyyy",
		monthTypeFormat: "yyyy-MM",
		dateFormat: "yyyy-MM-dd",
		dateTimeFormat: "yyyy-MM-dd HH:mm:ss",
		quarterFormat: "yyyy-qqq",
		weekFormat: "YYYY-w",
		clear: "清除",
		now: "現在",
		confirm: "確定",
		selectTime: "選擇時間",
		selectDate: "選擇日期",
		datePlaceholder: "選擇日期",
		datetimePlaceholder: "選擇日期時間",
		monthPlaceholder: "選擇月份",
		yearPlaceholder: "選擇年份",
		quarterPlaceholder: "選擇季度",
		weekPlaceholder: "Select Week",
		startDatePlaceholder: "開始日期",
		endDatePlaceholder: "結束日期",
		startDatetimePlaceholder: "開始日期時間",
		endDatetimePlaceholder: "結束日期時間",
		startMonthPlaceholder: "開始月份",
		endMonthPlaceholder: "結束月份",
		monthBeforeYear: !1,
		firstDayOfWeek: 0,
		today: "今天"
	},
	DataTable: {
		checkTableAll: "選擇全部表格資料",
		uncheckTableAll: "取消選擇全部表格資料",
		confirm: "確定",
		clear: "重設"
	},
	LegacyTransfer: {
		sourceTitle: "來源",
		targetTitle: "目標"
	},
	Transfer: {
		selectAll: "全選",
		unselectAll: "取消全選",
		clearAll: "清除全部",
		total: (e) => `共 ${e} 項`,
		selected: (e) => `已選 ${e} 項`
	},
	Empty: { description: "無資料" },
	Select: { placeholder: "請選擇" },
	TimePicker: {
		placeholder: "請選擇時間",
		positiveText: "確定",
		negativeText: "取消",
		now: "現在",
		clear: "清除"
	},
	Pagination: {
		goto: "跳至",
		selectionSuffix: "頁"
	},
	DynamicTags: { add: "新增" },
	Log: { loading: "載入中" },
	Input: { placeholder: "請輸入" },
	InputNumber: { placeholder: "請輸入" },
	DynamicInput: { create: "新增" },
	ThemeEditor: {
		title: "主題編輯器",
		clearAllVars: "清除全部變數",
		clearSearch: "清除搜尋",
		filterCompName: "過濾組件名稱",
		filterVarName: "過濾變數名稱",
		import: "匯入",
		export: "匯出",
		restore: "恢復預設"
	},
	Image: {
		tipPrevious: "上一張（←）",
		tipNext: "下一張（→）",
		tipCounterclockwise: "向左旋轉",
		tipClockwise: "向右旋轉",
		tipZoomOut: "縮小",
		tipZoomIn: "放大",
		tipDownload: "下載",
		tipClose: "關閉（Esc）",
		tipOriginalSize: "縮放到原始尺寸"
	},
	Heatmap: {
		less: "少",
		more: "多",
		monthFormat: "MMM",
		weekdayFormat: "eeeeee"
	}
};
//#endregion
//#region node_modules/date-fns/locale/_lib/buildFormatLongFn.js
function Ls(e) {
	return (t = {}) => {
		let n = t.width ? String(t.width) : e.defaultWidth;
		return e.formats[n] || e.formats[e.defaultWidth];
	};
}
//#endregion
//#region node_modules/date-fns/locale/_lib/buildLocalizeFn.js
function Rs(e) {
	return (t, n) => {
		let r = n?.context ? String(n.context) : "standalone", i;
		if (r === "formatting" && e.formattingValues) {
			let t = e.defaultFormattingWidth || e.defaultWidth, r = n?.width ? String(n.width) : t;
			i = e.formattingValues[r] || e.formattingValues[t];
		} else {
			let t = e.defaultWidth, r = n?.width ? String(n.width) : e.defaultWidth;
			i = e.values[r] || e.values[t];
		}
		let a = e.argumentCallback ? e.argumentCallback(t) : t;
		return i[a];
	};
}
//#endregion
//#region node_modules/date-fns/locale/_lib/buildMatchFn.js
function zs(e) {
	return (t, n = {}) => {
		let r = n.width, i = r && e.matchPatterns[r] || e.matchPatterns[e.defaultMatchWidth], a = t.match(i);
		if (!a) return null;
		let o = a[0], s = r && e.parsePatterns[r] || e.parsePatterns[e.defaultParseWidth], c = Array.isArray(s) ? Vs(s, (e) => e.test(o)) : Bs(s, (e) => e.test(o)), l;
		l = e.valueCallback ? e.valueCallback(c) : c, l = n.valueCallback ? n.valueCallback(l) : l;
		let u = t.slice(o.length);
		return {
			value: l,
			rest: u
		};
	};
}
function Bs(e, t) {
	for (let n in e) if (Object.prototype.hasOwnProperty.call(e, n) && t(e[n])) return n;
}
function Vs(e, t) {
	for (let n = 0; n < e.length; n++) if (t(e[n])) return n;
}
//#endregion
//#region node_modules/date-fns/locale/_lib/buildMatchPatternFn.js
function Hs(e) {
	return (t, n = {}) => {
		let r = t.match(e.matchPattern);
		if (!r) return null;
		let i = r[0], a = t.match(e.parsePattern);
		if (!a) return null;
		let o = e.valueCallback ? e.valueCallback(a[0]) : a[0];
		o = n.valueCallback ? n.valueCallback(o) : o;
		let s = t.slice(i.length);
		return {
			value: o,
			rest: s
		};
	};
}
//#endregion
//#region node_modules/date-fns/constants.js
var Us = 365.2425, Ws = 86400;
Ws * 7, Ws * Us / 12 * 3;
var Gs = Symbol.for("constructDateFrom");
//#endregion
//#region node_modules/date-fns/constructFrom.js
function Ks(e, t) {
	return typeof e == "function" ? e(t) : e && typeof e == "object" && Gs in e ? e[Gs](t) : e instanceof Date ? new e.constructor(t) : new Date(t);
}
//#endregion
//#region node_modules/date-fns/_lib/normalizeDates.js
function qs(e, ...t) {
	let n = Ks.bind(null, e || t.find((e) => typeof e == "object"));
	return t.map(n);
}
//#endregion
//#region node_modules/date-fns/_lib/defaultOptions.js
var Js = {};
function Ys() {
	return Js;
}
//#endregion
//#region node_modules/date-fns/toDate.js
function Xs(e, t) {
	return Ks(t || e, e);
}
//#endregion
//#region node_modules/date-fns/startOfWeek.js
function Zs(e, t) {
	let n = Ys(), r = t?.weekStartsOn ?? t?.locale?.options?.weekStartsOn ?? n.weekStartsOn ?? n.locale?.options?.weekStartsOn ?? 0, i = Xs(e, t?.in), a = i.getDay(), o = (a < r ? 7 : 0) + a - r;
	return i.setDate(i.getDate() - o), i.setHours(0, 0, 0, 0), i;
}
//#endregion
//#region node_modules/date-fns/isSameWeek.js
function Qs(e, t, n) {
	let [r, i] = qs(n?.in, e, t);
	return +Zs(r, n) == +Zs(i, n);
}
//#endregion
//#region node_modules/date-fns/locale/en-US/_lib/formatDistance.js
var $s = {
	lessThanXSeconds: {
		one: "less than a second",
		other: "less than {{count}} seconds"
	},
	xSeconds: {
		one: "1 second",
		other: "{{count}} seconds"
	},
	halfAMinute: "half a minute",
	lessThanXMinutes: {
		one: "less than a minute",
		other: "less than {{count}} minutes"
	},
	xMinutes: {
		one: "1 minute",
		other: "{{count}} minutes"
	},
	aboutXHours: {
		one: "about 1 hour",
		other: "about {{count}} hours"
	},
	xHours: {
		one: "1 hour",
		other: "{{count}} hours"
	},
	xDays: {
		one: "1 day",
		other: "{{count}} days"
	},
	aboutXWeeks: {
		one: "about 1 week",
		other: "about {{count}} weeks"
	},
	xWeeks: {
		one: "1 week",
		other: "{{count}} weeks"
	},
	aboutXMonths: {
		one: "about 1 month",
		other: "about {{count}} months"
	},
	xMonths: {
		one: "1 month",
		other: "{{count}} months"
	},
	aboutXYears: {
		one: "about 1 year",
		other: "about {{count}} years"
	},
	xYears: {
		one: "1 year",
		other: "{{count}} years"
	},
	overXYears: {
		one: "over 1 year",
		other: "over {{count}} years"
	},
	almostXYears: {
		one: "almost 1 year",
		other: "almost {{count}} years"
	}
}, ec = (e, t, n) => {
	let r, i = $s[e];
	return r = typeof i == "string" ? i : t === 1 ? i.one : i.other.replace("{{count}}", t.toString()), n?.addSuffix ? n.comparison && n.comparison > 0 ? "in " + r : r + " ago" : r;
}, tc = {
	lastWeek: "'last' eeee 'at' p",
	yesterday: "'yesterday at' p",
	today: "'today at' p",
	tomorrow: "'tomorrow at' p",
	nextWeek: "eeee 'at' p",
	other: "P"
}, nc = (e, t, n, r) => tc[e], rc = {
	ordinalNumber: (e, t) => {
		let n = Number(e), r = n % 100;
		if (r > 20 || r < 10) switch (r % 10) {
			case 1: return n + "st";
			case 2: return n + "nd";
			case 3: return n + "rd";
		}
		return n + "th";
	},
	era: Rs({
		values: {
			narrow: ["B", "A"],
			abbreviated: ["BC", "AD"],
			wide: ["Before Christ", "Anno Domini"]
		},
		defaultWidth: "wide"
	}),
	quarter: Rs({
		values: {
			narrow: [
				"1",
				"2",
				"3",
				"4"
			],
			abbreviated: [
				"Q1",
				"Q2",
				"Q3",
				"Q4"
			],
			wide: [
				"1st quarter",
				"2nd quarter",
				"3rd quarter",
				"4th quarter"
			]
		},
		defaultWidth: "wide",
		argumentCallback: (e) => e - 1
	}),
	month: Rs({
		values: {
			narrow: [
				"J",
				"F",
				"M",
				"A",
				"M",
				"J",
				"J",
				"A",
				"S",
				"O",
				"N",
				"D"
			],
			abbreviated: [
				"Jan",
				"Feb",
				"Mar",
				"Apr",
				"May",
				"Jun",
				"Jul",
				"Aug",
				"Sep",
				"Oct",
				"Nov",
				"Dec"
			],
			wide: [
				"January",
				"February",
				"March",
				"April",
				"May",
				"June",
				"July",
				"August",
				"September",
				"October",
				"November",
				"December"
			]
		},
		defaultWidth: "wide"
	}),
	day: Rs({
		values: {
			narrow: [
				"S",
				"M",
				"T",
				"W",
				"T",
				"F",
				"S"
			],
			short: [
				"Su",
				"Mo",
				"Tu",
				"We",
				"Th",
				"Fr",
				"Sa"
			],
			abbreviated: [
				"Sun",
				"Mon",
				"Tue",
				"Wed",
				"Thu",
				"Fri",
				"Sat"
			],
			wide: [
				"Sunday",
				"Monday",
				"Tuesday",
				"Wednesday",
				"Thursday",
				"Friday",
				"Saturday"
			]
		},
		defaultWidth: "wide"
	}),
	dayPeriod: Rs({
		values: {
			narrow: {
				am: "a",
				pm: "p",
				midnight: "mi",
				noon: "n",
				morning: "morning",
				afternoon: "afternoon",
				evening: "evening",
				night: "night"
			},
			abbreviated: {
				am: "AM",
				pm: "PM",
				midnight: "midnight",
				noon: "noon",
				morning: "morning",
				afternoon: "afternoon",
				evening: "evening",
				night: "night"
			},
			wide: {
				am: "a.m.",
				pm: "p.m.",
				midnight: "midnight",
				noon: "noon",
				morning: "morning",
				afternoon: "afternoon",
				evening: "evening",
				night: "night"
			}
		},
		defaultWidth: "wide",
		formattingValues: {
			narrow: {
				am: "a",
				pm: "p",
				midnight: "mi",
				noon: "n",
				morning: "in the morning",
				afternoon: "in the afternoon",
				evening: "in the evening",
				night: "at night"
			},
			abbreviated: {
				am: "AM",
				pm: "PM",
				midnight: "midnight",
				noon: "noon",
				morning: "in the morning",
				afternoon: "in the afternoon",
				evening: "in the evening",
				night: "at night"
			},
			wide: {
				am: "a.m.",
				pm: "p.m.",
				midnight: "midnight",
				noon: "noon",
				morning: "in the morning",
				afternoon: "in the afternoon",
				evening: "in the evening",
				night: "at night"
			}
		},
		defaultFormattingWidth: "wide"
	})
}, ic = {
	ordinalNumber: Hs({
		matchPattern: /^(\d+)(th|st|nd|rd)?/i,
		parsePattern: /\d+/i,
		valueCallback: (e) => parseInt(e, 10)
	}),
	era: zs({
		matchPatterns: {
			narrow: /^(b|a)/i,
			abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
			wide: /^(before christ|before common era|anno domini|common era)/i
		},
		defaultMatchWidth: "wide",
		parsePatterns: { any: [/^b/i, /^(a|c)/i] },
		defaultParseWidth: "any"
	}),
	quarter: zs({
		matchPatterns: {
			narrow: /^[1234]/i,
			abbreviated: /^q[1234]/i,
			wide: /^[1234](th|st|nd|rd)? quarter/i
		},
		defaultMatchWidth: "wide",
		parsePatterns: { any: [
			/1/i,
			/2/i,
			/3/i,
			/4/i
		] },
		defaultParseWidth: "any",
		valueCallback: (e) => e + 1
	}),
	month: zs({
		matchPatterns: {
			narrow: /^[jfmasond]/i,
			abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
			wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i
		},
		defaultMatchWidth: "wide",
		parsePatterns: {
			narrow: [
				/^j/i,
				/^f/i,
				/^m/i,
				/^a/i,
				/^m/i,
				/^j/i,
				/^j/i,
				/^a/i,
				/^s/i,
				/^o/i,
				/^n/i,
				/^d/i
			],
			any: [
				/^ja/i,
				/^f/i,
				/^mar/i,
				/^ap/i,
				/^may/i,
				/^jun/i,
				/^jul/i,
				/^au/i,
				/^s/i,
				/^o/i,
				/^n/i,
				/^d/i
			]
		},
		defaultParseWidth: "any"
	}),
	day: zs({
		matchPatterns: {
			narrow: /^[smtwf]/i,
			short: /^(su|mo|tu|we|th|fr|sa)/i,
			abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
			wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i
		},
		defaultMatchWidth: "wide",
		parsePatterns: {
			narrow: [
				/^s/i,
				/^m/i,
				/^t/i,
				/^w/i,
				/^t/i,
				/^f/i,
				/^s/i
			],
			any: [
				/^su/i,
				/^m/i,
				/^tu/i,
				/^w/i,
				/^th/i,
				/^f/i,
				/^sa/i
			]
		},
		defaultParseWidth: "any"
	}),
	dayPeriod: zs({
		matchPatterns: {
			narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
			any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i
		},
		defaultMatchWidth: "any",
		parsePatterns: { any: {
			am: /^a/i,
			pm: /^p/i,
			midnight: /^mi/i,
			noon: /^no/i,
			morning: /morning/i,
			afternoon: /afternoon/i,
			evening: /evening/i,
			night: /night/i
		} },
		defaultParseWidth: "any"
	})
}, ac = {
	code: "en-US",
	formatDistance: ec,
	formatLong: {
		date: Ls({
			formats: {
				full: "EEEE, MMMM do, y",
				long: "MMMM do, y",
				medium: "MMM d, y",
				short: "MM/dd/yyyy"
			},
			defaultWidth: "full"
		}),
		time: Ls({
			formats: {
				full: "h:mm:ss a zzzz",
				long: "h:mm:ss a z",
				medium: "h:mm:ss a",
				short: "h:mm a"
			},
			defaultWidth: "full"
		}),
		dateTime: Ls({
			formats: {
				full: "{{date}} 'at' {{time}}",
				long: "{{date}} 'at' {{time}}",
				medium: "{{date}}, {{time}}",
				short: "{{date}}, {{time}}"
			},
			defaultWidth: "full"
		})
	},
	formatRelative: nc,
	localize: rc,
	match: ic,
	options: {
		weekStartsOn: 0,
		firstWeekContainsDate: 1
	}
}, oc = {
	lessThanXSeconds: {
		one: "1秒未満",
		other: "{{count}}秒未満",
		oneWithSuffix: "約1秒",
		otherWithSuffix: "約{{count}}秒"
	},
	xSeconds: {
		one: "1秒",
		other: "{{count}}秒"
	},
	halfAMinute: "30秒",
	lessThanXMinutes: {
		one: "1分未満",
		other: "{{count}}分未満",
		oneWithSuffix: "約1分",
		otherWithSuffix: "約{{count}}分"
	},
	xMinutes: {
		one: "1分",
		other: "{{count}}分"
	},
	aboutXHours: {
		one: "約1時間",
		other: "約{{count}}時間"
	},
	xHours: {
		one: "1時間",
		other: "{{count}}時間"
	},
	xDays: {
		one: "1日",
		other: "{{count}}日"
	},
	aboutXWeeks: {
		one: "約1週間",
		other: "約{{count}}週間"
	},
	xWeeks: {
		one: "1週間",
		other: "{{count}}週間"
	},
	aboutXMonths: {
		one: "約1か月",
		other: "約{{count}}か月"
	},
	xMonths: {
		one: "1か月",
		other: "{{count}}か月"
	},
	aboutXYears: {
		one: "約1年",
		other: "約{{count}}年"
	},
	xYears: {
		one: "1年",
		other: "{{count}}年"
	},
	overXYears: {
		one: "1年以上",
		other: "{{count}}年以上"
	},
	almostXYears: {
		one: "1年近く",
		other: "{{count}}年近く"
	}
}, sc = (e, t, n) => {
	n ||= {};
	let r, i = oc[e];
	return r = typeof i == "string" ? i : t === 1 ? n.addSuffix && i.oneWithSuffix ? i.oneWithSuffix : i.one : n.addSuffix && i.otherWithSuffix ? i.otherWithSuffix.replace("{{count}}", String(t)) : i.other.replace("{{count}}", String(t)), n.addSuffix ? n.comparison && n.comparison > 0 ? r + "後" : r + "前" : r;
}, cc = {
	date: Ls({
		formats: {
			full: "y年M月d日EEEE",
			long: "y年M月d日",
			medium: "y/MM/dd",
			short: "y/MM/dd"
		},
		defaultWidth: "full"
	}),
	time: Ls({
		formats: {
			full: "H時mm分ss秒 zzzz",
			long: "H:mm:ss z",
			medium: "H:mm:ss",
			short: "H:mm"
		},
		defaultWidth: "full"
	}),
	dateTime: Ls({
		formats: {
			full: "{{date}} {{time}}",
			long: "{{date}} {{time}}",
			medium: "{{date}} {{time}}",
			short: "{{date}} {{time}}"
		},
		defaultWidth: "full"
	})
}, lc = {
	lastWeek: "先週のeeeeのp",
	yesterday: "昨日のp",
	today: "今日のp",
	tomorrow: "明日のp",
	nextWeek: "翌週のeeeeのp",
	other: "P"
}, uc = {
	code: "ja",
	formatDistance: sc,
	formatLong: cc,
	formatRelative: (e, t, n, r) => lc[e],
	localize: {
		ordinalNumber: (e, t) => {
			let n = Number(e);
			switch (String(t?.unit)) {
				case "year": return `${n}年`;
				case "quarter": return `第${n}四半期`;
				case "month": return `${n}月`;
				case "week": return `第${n}週`;
				case "date": return `${n}日`;
				case "hour": return `${n}時`;
				case "minute": return `${n}分`;
				case "second": return `${n}秒`;
				default: return `${n}`;
			}
		},
		era: Rs({
			values: {
				narrow: ["BC", "AC"],
				abbreviated: ["紀元前", "西暦"],
				wide: ["紀元前", "西暦"]
			},
			defaultWidth: "wide"
		}),
		quarter: Rs({
			values: {
				narrow: [
					"1",
					"2",
					"3",
					"4"
				],
				abbreviated: [
					"Q1",
					"Q2",
					"Q3",
					"Q4"
				],
				wide: [
					"第1四半期",
					"第2四半期",
					"第3四半期",
					"第4四半期"
				]
			},
			defaultWidth: "wide",
			argumentCallback: (e) => Number(e) - 1
		}),
		month: Rs({
			values: {
				narrow: [
					"1",
					"2",
					"3",
					"4",
					"5",
					"6",
					"7",
					"8",
					"9",
					"10",
					"11",
					"12"
				],
				abbreviated: [
					"1月",
					"2月",
					"3月",
					"4月",
					"5月",
					"6月",
					"7月",
					"8月",
					"9月",
					"10月",
					"11月",
					"12月"
				],
				wide: [
					"1月",
					"2月",
					"3月",
					"4月",
					"5月",
					"6月",
					"7月",
					"8月",
					"9月",
					"10月",
					"11月",
					"12月"
				]
			},
			defaultWidth: "wide"
		}),
		day: Rs({
			values: {
				narrow: [
					"日",
					"月",
					"火",
					"水",
					"木",
					"金",
					"土"
				],
				short: [
					"日",
					"月",
					"火",
					"水",
					"木",
					"金",
					"土"
				],
				abbreviated: [
					"日",
					"月",
					"火",
					"水",
					"木",
					"金",
					"土"
				],
				wide: [
					"日曜日",
					"月曜日",
					"火曜日",
					"水曜日",
					"木曜日",
					"金曜日",
					"土曜日"
				]
			},
			defaultWidth: "wide"
		}),
		dayPeriod: Rs({
			values: {
				narrow: {
					am: "午前",
					pm: "午後",
					midnight: "深夜",
					noon: "正午",
					morning: "朝",
					afternoon: "午後",
					evening: "夜",
					night: "深夜"
				},
				abbreviated: {
					am: "午前",
					pm: "午後",
					midnight: "深夜",
					noon: "正午",
					morning: "朝",
					afternoon: "午後",
					evening: "夜",
					night: "深夜"
				},
				wide: {
					am: "午前",
					pm: "午後",
					midnight: "深夜",
					noon: "正午",
					morning: "朝",
					afternoon: "午後",
					evening: "夜",
					night: "深夜"
				}
			},
			defaultWidth: "wide",
			formattingValues: {
				narrow: {
					am: "午前",
					pm: "午後",
					midnight: "深夜",
					noon: "正午",
					morning: "朝",
					afternoon: "午後",
					evening: "夜",
					night: "深夜"
				},
				abbreviated: {
					am: "午前",
					pm: "午後",
					midnight: "深夜",
					noon: "正午",
					morning: "朝",
					afternoon: "午後",
					evening: "夜",
					night: "深夜"
				},
				wide: {
					am: "午前",
					pm: "午後",
					midnight: "深夜",
					noon: "正午",
					morning: "朝",
					afternoon: "午後",
					evening: "夜",
					night: "深夜"
				}
			},
			defaultFormattingWidth: "wide"
		})
	},
	match: {
		ordinalNumber: Hs({
			matchPattern: /^第?\d+(年|四半期|月|週|日|時|分|秒)?/i,
			parsePattern: /\d+/i,
			valueCallback: function(e) {
				return parseInt(e, 10);
			}
		}),
		era: zs({
			matchPatterns: {
				narrow: /^(B\.?C\.?|A\.?D\.?)/i,
				abbreviated: /^(紀元[前後]|西暦)/i,
				wide: /^(紀元[前後]|西暦)/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				narrow: [/^B/i, /^A/i],
				any: [/^(紀元前)/i, /^(西暦|紀元後)/i]
			},
			defaultParseWidth: "any"
		}),
		quarter: zs({
			matchPatterns: {
				narrow: /^[1234]/i,
				abbreviated: /^Q[1234]/i,
				wide: /^第[1234一二三四１２３４]四半期/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: { any: [
				/(1|一|１)/i,
				/(2|二|２)/i,
				/(3|三|３)/i,
				/(4|四|４)/i
			] },
			defaultParseWidth: "any",
			valueCallback: (e) => e + 1
		}),
		month: zs({
			matchPatterns: {
				narrow: /^([123456789]|1[012])/,
				abbreviated: /^([123456789]|1[012])月/i,
				wide: /^([123456789]|1[012])月/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: { any: [
				/^1\D/,
				/^2/,
				/^3/,
				/^4/,
				/^5/,
				/^6/,
				/^7/,
				/^8/,
				/^9/,
				/^10/,
				/^11/,
				/^12/
			] },
			defaultParseWidth: "any"
		}),
		day: zs({
			matchPatterns: {
				narrow: /^[日月火水木金土]/,
				short: /^[日月火水木金土]/,
				abbreviated: /^[日月火水木金土]/,
				wide: /^[日月火水木金土]曜日/
			},
			defaultMatchWidth: "wide",
			parsePatterns: { any: [
				/^日/,
				/^月/,
				/^火/,
				/^水/,
				/^木/,
				/^金/,
				/^土/
			] },
			defaultParseWidth: "any"
		}),
		dayPeriod: zs({
			matchPatterns: { any: /^(AM|PM|午前|午後|正午|深夜|真夜中|夜|朝)/i },
			defaultMatchWidth: "any",
			parsePatterns: { any: {
				am: /^(A|午前)/i,
				pm: /^(P|午後)/i,
				midnight: /^深夜|真夜中/i,
				noon: /^正午/i,
				morning: /^朝/i,
				afternoon: /^午後/i,
				evening: /^夜/i,
				night: /^深夜/i
			} },
			defaultParseWidth: "any"
		})
	},
	options: {
		weekStartsOn: 0,
		firstWeekContainsDate: 1
	}
}, dc = {
	lessThanXSeconds: {
		one: "不到 1 秒",
		other: "不到 {{count}} 秒"
	},
	xSeconds: {
		one: "1 秒",
		other: "{{count}} 秒"
	},
	halfAMinute: "半分钟",
	lessThanXMinutes: {
		one: "不到 1 分钟",
		other: "不到 {{count}} 分钟"
	},
	xMinutes: {
		one: "1 分钟",
		other: "{{count}} 分钟"
	},
	xHours: {
		one: "1 小时",
		other: "{{count}} 小时"
	},
	aboutXHours: {
		one: "大约 1 小时",
		other: "大约 {{count}} 小时"
	},
	xDays: {
		one: "1 天",
		other: "{{count}} 天"
	},
	aboutXWeeks: {
		one: "大约 1 个星期",
		other: "大约 {{count}} 个星期"
	},
	xWeeks: {
		one: "1 个星期",
		other: "{{count}} 个星期"
	},
	aboutXMonths: {
		one: "大约 1 个月",
		other: "大约 {{count}} 个月"
	},
	xMonths: {
		one: "1 个月",
		other: "{{count}} 个月"
	},
	aboutXYears: {
		one: "大约 1 年",
		other: "大约 {{count}} 年"
	},
	xYears: {
		one: "1 年",
		other: "{{count}} 年"
	},
	overXYears: {
		one: "超过 1 年",
		other: "超过 {{count}} 年"
	},
	almostXYears: {
		one: "将近 1 年",
		other: "将近 {{count}} 年"
	}
}, fc = (e, t, n) => {
	let r, i = dc[e];
	return r = typeof i == "string" ? i : t === 1 ? i.one : i.other.replace("{{count}}", String(t)), n?.addSuffix ? n.comparison && n.comparison > 0 ? r + "内" : r + "前" : r;
}, pc = {
	date: Ls({
		formats: {
			full: "y'年'M'月'd'日' EEEE",
			long: "y'年'M'月'd'日'",
			medium: "yyyy-MM-dd",
			short: "yy-MM-dd"
		},
		defaultWidth: "full"
	}),
	time: Ls({
		formats: {
			full: "zzzz a h:mm:ss",
			long: "z a h:mm:ss",
			medium: "a h:mm:ss",
			short: "a h:mm"
		},
		defaultWidth: "full"
	}),
	dateTime: Ls({
		formats: {
			full: "{{date}} {{time}}",
			long: "{{date}} {{time}}",
			medium: "{{date}} {{time}}",
			short: "{{date}} {{time}}"
		},
		defaultWidth: "full"
	})
};
//#endregion
//#region node_modules/date-fns/locale/zh-CN/_lib/formatRelative.js
function mc(e, t, n) {
	return Qs(e, t, n) ? "eeee p" : e.getTime() > t.getTime() ? "'下个'eeee p" : "'上个'eeee p";
}
var hc = {
	lastWeek: mc,
	yesterday: "'昨天' p",
	today: "'今天' p",
	tomorrow: "'明天' p",
	nextWeek: mc,
	other: "PP p"
}, gc = {
	code: "zh-CN",
	formatDistance: fc,
	formatLong: pc,
	formatRelative: (e, t, n, r) => {
		let i = hc[e];
		return typeof i == "function" ? i(t, n, r) : i;
	},
	localize: {
		ordinalNumber: (e, t) => {
			let n = Number(e);
			switch (t?.unit) {
				case "date": return n.toString() + "日";
				case "hour": return n.toString() + "时";
				case "minute": return n.toString() + "分";
				case "second": return n.toString() + "秒";
				default: return "第 " + n.toString();
			}
		},
		era: Rs({
			values: {
				narrow: ["前", "公元"],
				abbreviated: ["前", "公元"],
				wide: ["公元前", "公元"]
			},
			defaultWidth: "wide"
		}),
		quarter: Rs({
			values: {
				narrow: [
					"1",
					"2",
					"3",
					"4"
				],
				abbreviated: [
					"第一季",
					"第二季",
					"第三季",
					"第四季"
				],
				wide: [
					"第一季度",
					"第二季度",
					"第三季度",
					"第四季度"
				]
			},
			defaultWidth: "wide",
			argumentCallback: (e) => e - 1
		}),
		month: Rs({
			values: {
				narrow: [
					"一",
					"二",
					"三",
					"四",
					"五",
					"六",
					"七",
					"八",
					"九",
					"十",
					"十一",
					"十二"
				],
				abbreviated: [
					"1月",
					"2月",
					"3月",
					"4月",
					"5月",
					"6月",
					"7月",
					"8月",
					"9月",
					"10月",
					"11月",
					"12月"
				],
				wide: [
					"一月",
					"二月",
					"三月",
					"四月",
					"五月",
					"六月",
					"七月",
					"八月",
					"九月",
					"十月",
					"十一月",
					"十二月"
				]
			},
			defaultWidth: "wide"
		}),
		day: Rs({
			values: {
				narrow: [
					"日",
					"一",
					"二",
					"三",
					"四",
					"五",
					"六"
				],
				short: [
					"日",
					"一",
					"二",
					"三",
					"四",
					"五",
					"六"
				],
				abbreviated: [
					"周日",
					"周一",
					"周二",
					"周三",
					"周四",
					"周五",
					"周六"
				],
				wide: [
					"星期日",
					"星期一",
					"星期二",
					"星期三",
					"星期四",
					"星期五",
					"星期六"
				]
			},
			defaultWidth: "wide"
		}),
		dayPeriod: Rs({
			values: {
				narrow: {
					am: "上",
					pm: "下",
					midnight: "凌晨",
					noon: "午",
					morning: "早",
					afternoon: "下午",
					evening: "晚",
					night: "夜"
				},
				abbreviated: {
					am: "上午",
					pm: "下午",
					midnight: "凌晨",
					noon: "中午",
					morning: "早晨",
					afternoon: "中午",
					evening: "晚上",
					night: "夜间"
				},
				wide: {
					am: "上午",
					pm: "下午",
					midnight: "凌晨",
					noon: "中午",
					morning: "早晨",
					afternoon: "中午",
					evening: "晚上",
					night: "夜间"
				}
			},
			defaultWidth: "wide",
			formattingValues: {
				narrow: {
					am: "上",
					pm: "下",
					midnight: "凌晨",
					noon: "午",
					morning: "早",
					afternoon: "下午",
					evening: "晚",
					night: "夜"
				},
				abbreviated: {
					am: "上午",
					pm: "下午",
					midnight: "凌晨",
					noon: "中午",
					morning: "早晨",
					afternoon: "中午",
					evening: "晚上",
					night: "夜间"
				},
				wide: {
					am: "上午",
					pm: "下午",
					midnight: "凌晨",
					noon: "中午",
					morning: "早晨",
					afternoon: "中午",
					evening: "晚上",
					night: "夜间"
				}
			},
			defaultFormattingWidth: "wide"
		})
	},
	match: {
		ordinalNumber: Hs({
			matchPattern: /^(第\s*)?\d+(日|时|分|秒)?/i,
			parsePattern: /\d+/i,
			valueCallback: (e) => parseInt(e, 10)
		}),
		era: zs({
			matchPatterns: {
				narrow: /^(前)/i,
				abbreviated: /^(前)/i,
				wide: /^(公元前|公元)/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: { any: [/^(前)/i, /^(公元)/i] },
			defaultParseWidth: "any"
		}),
		quarter: zs({
			matchPatterns: {
				narrow: /^[1234]/i,
				abbreviated: /^第[一二三四]刻/i,
				wide: /^第[一二三四]刻钟/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: { any: [
				/(1|一)/i,
				/(2|二)/i,
				/(3|三)/i,
				/(4|四)/i
			] },
			defaultParseWidth: "any",
			valueCallback: (e) => e + 1
		}),
		month: zs({
			matchPatterns: {
				narrow: /^(一|二|三|四|五|六|七|八|九|十[二一]?)/i,
				abbreviated: /^(一|二|三|四|五|六|七|八|九|十[二一]?|\d|1[0-2])月/i,
				wide: /^(一|二|三|四|五|六|七|八|九|十[二一]?)月/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				narrow: [
					/^一/i,
					/^二/i,
					/^三/i,
					/^四/i,
					/^五/i,
					/^六/i,
					/^七/i,
					/^八/i,
					/^九/i,
					/^十(?!(一|二))/i,
					/^十一/i,
					/^十二/i
				],
				any: [
					/^(一|1(?!\d))/i,
					/^(二|2)/i,
					/^(三|3)/i,
					/^(四|4)/i,
					/^(五|5)/i,
					/^(六|6)/i,
					/^(七|7)/i,
					/^(八|8)/i,
					/^(九|9)/i,
					/^(十(?!(一|二))|10)/i,
					/^(十一|11)/i,
					/^(十二|12)/i
				]
			},
			defaultParseWidth: "any"
		}),
		day: zs({
			matchPatterns: {
				narrow: /^[一二三四五六日]/i,
				short: /^[一二三四五六日]/i,
				abbreviated: /^周[一二三四五六日]/i,
				wide: /^星期[一二三四五六日]/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: { any: [
				/日/i,
				/一/i,
				/二/i,
				/三/i,
				/四/i,
				/五/i,
				/六/i
			] },
			defaultParseWidth: "any"
		}),
		dayPeriod: zs({
			matchPatterns: { any: /^(上午?|下午?|午夜|[中正]午|早上?|下午|晚上?|凌晨|)/i },
			defaultMatchWidth: "any",
			parsePatterns: { any: {
				am: /^上午?/i,
				pm: /^下午?/i,
				midnight: /^午夜/i,
				noon: /^[中正]午/i,
				morning: /^早上/i,
				afternoon: /^下午/i,
				evening: /^晚上?/i,
				night: /^凌晨/i
			} },
			defaultParseWidth: "any"
		})
	},
	options: {
		weekStartsOn: 1,
		firstWeekContainsDate: 4
	}
}, _c = {
	lessThanXSeconds: {
		one: "少於 1 秒",
		other: "少於 {{count}} 秒"
	},
	xSeconds: {
		one: "1 秒",
		other: "{{count}} 秒"
	},
	halfAMinute: "半分鐘",
	lessThanXMinutes: {
		one: "少於 1 分鐘",
		other: "少於 {{count}} 分鐘"
	},
	xMinutes: {
		one: "1 分鐘",
		other: "{{count}} 分鐘"
	},
	xHours: {
		one: "1 小時",
		other: "{{count}} 小時"
	},
	aboutXHours: {
		one: "大約 1 小時",
		other: "大約 {{count}} 小時"
	},
	xDays: {
		one: "1 天",
		other: "{{count}} 天"
	},
	aboutXWeeks: {
		one: "大約 1 個星期",
		other: "大約 {{count}} 個星期"
	},
	xWeeks: {
		one: "1 個星期",
		other: "{{count}} 個星期"
	},
	aboutXMonths: {
		one: "大約 1 個月",
		other: "大約 {{count}} 個月"
	},
	xMonths: {
		one: "1 個月",
		other: "{{count}} 個月"
	},
	aboutXYears: {
		one: "大約 1 年",
		other: "大約 {{count}} 年"
	},
	xYears: {
		one: "1 年",
		other: "{{count}} 年"
	},
	overXYears: {
		one: "超過 1 年",
		other: "超過 {{count}} 年"
	},
	almostXYears: {
		one: "將近 1 年",
		other: "將近 {{count}} 年"
	}
}, vc = (e, t, n) => {
	let r, i = _c[e];
	return r = typeof i == "string" ? i : t === 1 ? i.one : i.other.replace("{{count}}", String(t)), n?.addSuffix ? n.comparison && n.comparison > 0 ? r + "內" : r + "前" : r;
}, yc = {
	date: Ls({
		formats: {
			full: "y'年'M'月'd'日' EEEE",
			long: "y'年'M'月'd'日'",
			medium: "yyyy-MM-dd",
			short: "yy-MM-dd"
		},
		defaultWidth: "full"
	}),
	time: Ls({
		formats: {
			full: "zzzz a h:mm:ss",
			long: "z a h:mm:ss",
			medium: "a h:mm:ss",
			short: "a h:mm"
		},
		defaultWidth: "full"
	}),
	dateTime: Ls({
		formats: {
			full: "{{date}} {{time}}",
			long: "{{date}} {{time}}",
			medium: "{{date}} {{time}}",
			short: "{{date}} {{time}}"
		},
		defaultWidth: "full"
	})
}, bc = {
	lastWeek: "'上個'eeee p",
	yesterday: "'昨天' p",
	today: "'今天' p",
	tomorrow: "'明天' p",
	nextWeek: "'下個'eeee p",
	other: "P"
}, xc = {
	code: "zh-TW",
	formatDistance: vc,
	formatLong: yc,
	formatRelative: (e, t, n, r) => bc[e],
	localize: {
		ordinalNumber: (e, t) => {
			let n = Number(e);
			switch (t?.unit) {
				case "date": return n + "日";
				case "hour": return n + "時";
				case "minute": return n + "分";
				case "second": return n + "秒";
				default: return "第 " + n;
			}
		},
		era: Rs({
			values: {
				narrow: ["前", "公元"],
				abbreviated: ["前", "公元"],
				wide: ["公元前", "公元"]
			},
			defaultWidth: "wide"
		}),
		quarter: Rs({
			values: {
				narrow: [
					"1",
					"2",
					"3",
					"4"
				],
				abbreviated: [
					"第一刻",
					"第二刻",
					"第三刻",
					"第四刻"
				],
				wide: [
					"第一刻鐘",
					"第二刻鐘",
					"第三刻鐘",
					"第四刻鐘"
				]
			},
			defaultWidth: "wide",
			argumentCallback: (e) => e - 1
		}),
		month: Rs({
			values: {
				narrow: [
					"一",
					"二",
					"三",
					"四",
					"五",
					"六",
					"七",
					"八",
					"九",
					"十",
					"十一",
					"十二"
				],
				abbreviated: [
					"1月",
					"2月",
					"3月",
					"4月",
					"5月",
					"6月",
					"7月",
					"8月",
					"9月",
					"10月",
					"11月",
					"12月"
				],
				wide: [
					"一月",
					"二月",
					"三月",
					"四月",
					"五月",
					"六月",
					"七月",
					"八月",
					"九月",
					"十月",
					"十一月",
					"十二月"
				]
			},
			defaultWidth: "wide"
		}),
		day: Rs({
			values: {
				narrow: [
					"日",
					"一",
					"二",
					"三",
					"四",
					"五",
					"六"
				],
				short: [
					"日",
					"一",
					"二",
					"三",
					"四",
					"五",
					"六"
				],
				abbreviated: [
					"週日",
					"週一",
					"週二",
					"週三",
					"週四",
					"週五",
					"週六"
				],
				wide: [
					"星期日",
					"星期一",
					"星期二",
					"星期三",
					"星期四",
					"星期五",
					"星期六"
				]
			},
			defaultWidth: "wide"
		}),
		dayPeriod: Rs({
			values: {
				narrow: {
					am: "上",
					pm: "下",
					midnight: "凌晨",
					noon: "午",
					morning: "早",
					afternoon: "下午",
					evening: "晚",
					night: "夜"
				},
				abbreviated: {
					am: "上午",
					pm: "下午",
					midnight: "凌晨",
					noon: "中午",
					morning: "早晨",
					afternoon: "中午",
					evening: "晚上",
					night: "夜間"
				},
				wide: {
					am: "上午",
					pm: "下午",
					midnight: "凌晨",
					noon: "中午",
					morning: "早晨",
					afternoon: "中午",
					evening: "晚上",
					night: "夜間"
				}
			},
			defaultWidth: "wide",
			formattingValues: {
				narrow: {
					am: "上",
					pm: "下",
					midnight: "凌晨",
					noon: "午",
					morning: "早",
					afternoon: "下午",
					evening: "晚",
					night: "夜"
				},
				abbreviated: {
					am: "上午",
					pm: "下午",
					midnight: "凌晨",
					noon: "中午",
					morning: "早晨",
					afternoon: "中午",
					evening: "晚上",
					night: "夜間"
				},
				wide: {
					am: "上午",
					pm: "下午",
					midnight: "凌晨",
					noon: "中午",
					morning: "早晨",
					afternoon: "中午",
					evening: "晚上",
					night: "夜間"
				}
			},
			defaultFormattingWidth: "wide"
		})
	},
	match: {
		ordinalNumber: Hs({
			matchPattern: /^(第\s*)?\d+(日|時|分|秒)?/i,
			parsePattern: /\d+/i,
			valueCallback: (e) => parseInt(e, 10)
		}),
		era: zs({
			matchPatterns: {
				narrow: /^(前)/i,
				abbreviated: /^(前)/i,
				wide: /^(公元前|公元)/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: { any: [/^(前)/i, /^(公元)/i] },
			defaultParseWidth: "any"
		}),
		quarter: zs({
			matchPatterns: {
				narrow: /^[1234]/i,
				abbreviated: /^第[一二三四]刻/i,
				wide: /^第[一二三四]刻鐘/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: { any: [
				/(1|一)/i,
				/(2|二)/i,
				/(3|三)/i,
				/(4|四)/i
			] },
			defaultParseWidth: "any",
			valueCallback: (e) => e + 1
		}),
		month: zs({
			matchPatterns: {
				narrow: /^(一|二|三|四|五|六|七|八|九|十[二一]?)/i,
				abbreviated: /^(一|二|三|四|五|六|七|八|九|十[二一]?|\d|1[0-2])月/i,
				wide: /^(一|二|三|四|五|六|七|八|九|十[二一]?)月/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				narrow: [
					/^一/i,
					/^二/i,
					/^三/i,
					/^四/i,
					/^五/i,
					/^六/i,
					/^七/i,
					/^八/i,
					/^九/i,
					/^十(?!(一|二))/i,
					/^十一/i,
					/^十二/i
				],
				any: [
					/^(一|1(?!\d))/i,
					/^(二|2)/i,
					/^(三|3)/i,
					/^(四|4)/i,
					/^(五|5)/i,
					/^(六|6)/i,
					/^(七|7)/i,
					/^(八|8)/i,
					/^(九|9)/i,
					/^(十(?!(一|二))|10)/i,
					/^(十一|11)/i,
					/^(十二|12)/i
				]
			},
			defaultParseWidth: "any"
		}),
		day: zs({
			matchPatterns: {
				narrow: /^[一二三四五六日]/i,
				short: /^[一二三四五六日]/i,
				abbreviated: /^週[一二三四五六日]/i,
				wide: /^星期[一二三四五六日]/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: { any: [
				/日/i,
				/一/i,
				/二/i,
				/三/i,
				/四/i,
				/五/i,
				/六/i
			] },
			defaultParseWidth: "any"
		}),
		dayPeriod: zs({
			matchPatterns: { any: /^(上午?|下午?|午夜|[中正]午|早上?|下午|晚上?|凌晨)/i },
			defaultMatchWidth: "any",
			parsePatterns: { any: {
				am: /^上午?/i,
				pm: /^下午?/i,
				midnight: /^午夜/i,
				noon: /^[中正]午/i,
				morning: /^早上/i,
				afternoon: /^下午/i,
				evening: /^晚上?/i,
				night: /^凌晨/i
			} },
			defaultParseWidth: "any"
		})
	},
	options: {
		weekStartsOn: 1,
		firstWeekContainsDate: 4
	}
}, Sc = {
	name: "en-US",
	locale: ac
}, Cc = {
	name: "ja-JP",
	locale: uc
}, wc = {
	name: "zh-CN",
	locale: gc
}, Tc = {
	name: "zh-TW",
	locale: xc
}, Ec = typeof global == "object" && global && global.Object === Object && global, Dc = typeof self == "object" && self && self.Object === Object && self, Oc = Ec || Dc || Function("return this")(), kc = Oc.Symbol, Ac = Object.prototype, jc = Ac.hasOwnProperty, Mc = Ac.toString, Nc = kc ? kc.toStringTag : void 0;
function Pc(e) {
	var t = jc.call(e, Nc), n = e[Nc];
	try {
		e[Nc] = void 0;
		var r = !0;
	} catch {}
	var i = Mc.call(e);
	return r && (t ? e[Nc] = n : delete e[Nc]), i;
}
//#endregion
//#region node_modules/lodash-es/_objectToString.js
var Fc = Object.prototype.toString;
function Ic(e) {
	return Fc.call(e);
}
//#endregion
//#region node_modules/lodash-es/_baseGetTag.js
var Lc = "[object Null]", Rc = "[object Undefined]", zc = kc ? kc.toStringTag : void 0;
function Bc(e) {
	return e == null ? e === void 0 ? Rc : Lc : zc && zc in Object(e) ? Pc(e) : Ic(e);
}
//#endregion
//#region node_modules/lodash-es/isObjectLike.js
function Vc(e) {
	return typeof e == "object" && !!e;
}
//#endregion
//#region node_modules/lodash-es/isSymbol.js
var Hc = "[object Symbol]";
function Uc(e) {
	return typeof e == "symbol" || Vc(e) && Bc(e) == Hc;
}
//#endregion
//#region node_modules/lodash-es/_arrayMap.js
function Wc(e, t) {
	for (var n = -1, r = e == null ? 0 : e.length, i = Array(r); ++n < r;) i[n] = t(e[n], n, e);
	return i;
}
//#endregion
//#region node_modules/lodash-es/isArray.js
var Gc = Array.isArray, Kc = 1 / 0, qc = kc ? kc.prototype : void 0, Jc = qc ? qc.toString : void 0;
function Yc(e) {
	if (typeof e == "string") return e;
	if (Gc(e)) return Wc(e, Yc) + "";
	if (Uc(e)) return Jc ? Jc.call(e) : "";
	var t = e + "";
	return t == "0" && 1 / e == -Kc ? "-0" : t;
}
//#endregion
//#region node_modules/lodash-es/isObject.js
function Xc(e) {
	var t = typeof e;
	return e != null && (t == "object" || t == "function");
}
//#endregion
//#region node_modules/lodash-es/identity.js
function Zc(e) {
	return e;
}
//#endregion
//#region node_modules/lodash-es/isFunction.js
var Qc = "[object AsyncFunction]", $c = "[object Function]", el = "[object GeneratorFunction]", tl = "[object Proxy]";
function nl(e) {
	if (!Xc(e)) return !1;
	var t = Bc(e);
	return t == $c || t == el || t == Qc || t == tl;
}
//#endregion
//#region node_modules/lodash-es/_coreJsData.js
var rl = Oc["__core-js_shared__"], il = function() {
	var e = /[^.]+$/.exec(rl && rl.keys && rl.keys.IE_PROTO || "");
	return e ? "Symbol(src)_1." + e : "";
}();
function al(e) {
	return !!il && il in e;
}
//#endregion
//#region node_modules/lodash-es/_toSource.js
var ol = Function.prototype.toString;
function sl(e) {
	if (e != null) {
		try {
			return ol.call(e);
		} catch {}
		try {
			return e + "";
		} catch {}
	}
	return "";
}
//#endregion
//#region node_modules/lodash-es/_baseIsNative.js
var cl = /[\\^$.*+?()[\]{}|]/g, ll = /^\[object .+?Constructor\]$/, ul = Function.prototype, dl = Object.prototype, fl = ul.toString, pl = dl.hasOwnProperty, ml = RegExp("^" + fl.call(pl).replace(cl, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");
function hl(e) {
	return !Xc(e) || al(e) ? !1 : (nl(e) ? ml : ll).test(sl(e));
}
//#endregion
//#region node_modules/lodash-es/_getValue.js
function gl(e, t) {
	return e?.[t];
}
//#endregion
//#region node_modules/lodash-es/_getNative.js
function _l(e, t) {
	var n = gl(e, t);
	return hl(n) ? n : void 0;
}
//#endregion
//#region node_modules/lodash-es/_baseCreate.js
var vl = Object.create, yl = function() {
	function e() {}
	return function(t) {
		if (!Xc(t)) return {};
		if (vl) return vl(t);
		e.prototype = t;
		var n = new e();
		return e.prototype = void 0, n;
	};
}();
//#endregion
//#region node_modules/lodash-es/_apply.js
function bl(e, t, n) {
	switch (n.length) {
		case 0: return e.call(t);
		case 1: return e.call(t, n[0]);
		case 2: return e.call(t, n[0], n[1]);
		case 3: return e.call(t, n[0], n[1], n[2]);
	}
	return e.apply(t, n);
}
//#endregion
//#region node_modules/lodash-es/_copyArray.js
function xl(e, t) {
	var n = -1, r = e.length;
	for (t ||= Array(r); ++n < r;) t[n] = e[n];
	return t;
}
//#endregion
//#region node_modules/lodash-es/_shortOut.js
var Sl = 800, Cl = 16, wl = Date.now;
function Tl(e) {
	var t = 0, n = 0;
	return function() {
		var r = wl(), i = Cl - (r - n);
		if (n = r, i > 0) {
			if (++t >= Sl) return arguments[0];
		} else t = 0;
		return e.apply(void 0, arguments);
	};
}
//#endregion
//#region node_modules/lodash-es/constant.js
function El(e) {
	return function() {
		return e;
	};
}
//#endregion
//#region node_modules/lodash-es/_defineProperty.js
var Dl = function() {
	try {
		var e = _l(Object, "defineProperty");
		return e({}, "", {}), e;
	} catch {}
}(), Ol = Tl(Dl ? function(e, t) {
	return Dl(e, "toString", {
		configurable: !0,
		enumerable: !1,
		value: El(t),
		writable: !0
	});
} : Zc), kl = 9007199254740991, Al = /^(?:0|[1-9]\d*)$/;
function jl(e, t) {
	var n = typeof e;
	return t ??= kl, !!t && (n == "number" || n != "symbol" && Al.test(e)) && e > -1 && e % 1 == 0 && e < t;
}
//#endregion
//#region node_modules/lodash-es/_baseAssignValue.js
function Ml(e, t, n) {
	t == "__proto__" && Dl ? Dl(e, t, {
		configurable: !0,
		enumerable: !0,
		value: n,
		writable: !0
	}) : e[t] = n;
}
//#endregion
//#region node_modules/lodash-es/eq.js
function Nl(e, t) {
	return e === t || e !== e && t !== t;
}
//#endregion
//#region node_modules/lodash-es/_assignValue.js
var Pl = Object.prototype.hasOwnProperty;
function Fl(e, t, n) {
	var r = e[t];
	(!(Pl.call(e, t) && Nl(r, n)) || n === void 0 && !(t in e)) && Ml(e, t, n);
}
//#endregion
//#region node_modules/lodash-es/_copyObject.js
function Il(e, t, n, r) {
	var i = !n;
	n ||= {};
	for (var a = -1, o = t.length; ++a < o;) {
		var s = t[a], c = r ? r(n[s], e[s], s, n, e) : void 0;
		c === void 0 && (c = e[s]), i ? Ml(n, s, c) : Fl(n, s, c);
	}
	return n;
}
//#endregion
//#region node_modules/lodash-es/_overRest.js
var Ll = Math.max;
function Rl(e, t, n) {
	return t = Ll(t === void 0 ? e.length - 1 : t, 0), function() {
		for (var r = arguments, i = -1, a = Ll(r.length - t, 0), o = Array(a); ++i < a;) o[i] = r[t + i];
		i = -1;
		for (var s = Array(t + 1); ++i < t;) s[i] = r[i];
		return s[t] = n(o), bl(e, this, s);
	};
}
//#endregion
//#region node_modules/lodash-es/_baseRest.js
function zl(e, t) {
	return Ol(Rl(e, t, Zc), e + "");
}
//#endregion
//#region node_modules/lodash-es/isLength.js
var Bl = 9007199254740991;
function Vl(e) {
	return typeof e == "number" && e > -1 && e % 1 == 0 && e <= Bl;
}
//#endregion
//#region node_modules/lodash-es/isArrayLike.js
function Hl(e) {
	return e != null && Vl(e.length) && !nl(e);
}
//#endregion
//#region node_modules/lodash-es/_isIterateeCall.js
function Ul(e, t, n) {
	if (!Xc(n)) return !1;
	var r = typeof t;
	return (r == "number" ? Hl(n) && jl(t, n.length) : r == "string" && t in n) ? Nl(n[t], e) : !1;
}
//#endregion
//#region node_modules/lodash-es/_createAssigner.js
function Wl(e) {
	return zl(function(t, n) {
		var r = -1, i = n.length, a = i > 1 ? n[i - 1] : void 0, o = i > 2 ? n[2] : void 0;
		for (a = e.length > 3 && typeof a == "function" ? (i--, a) : void 0, o && Ul(n[0], n[1], o) && (a = i < 3 ? void 0 : a, i = 1), t = Object(t); ++r < i;) {
			var s = n[r];
			s && e(t, s, r, a);
		}
		return t;
	});
}
//#endregion
//#region node_modules/lodash-es/_isPrototype.js
var Gl = Object.prototype;
function Kl(e) {
	var t = e && e.constructor;
	return e === (typeof t == "function" && t.prototype || Gl);
}
//#endregion
//#region node_modules/lodash-es/_baseTimes.js
function ql(e, t) {
	for (var n = -1, r = Array(e); ++n < e;) r[n] = t(n);
	return r;
}
//#endregion
//#region node_modules/lodash-es/_baseIsArguments.js
var Jl = "[object Arguments]";
function Yl(e) {
	return Vc(e) && Bc(e) == Jl;
}
//#endregion
//#region node_modules/lodash-es/isArguments.js
var Xl = Object.prototype, Zl = Xl.hasOwnProperty, Ql = Xl.propertyIsEnumerable, $l = Yl(function() {
	return arguments;
}()) ? Yl : function(e) {
	return Vc(e) && Zl.call(e, "callee") && !Ql.call(e, "callee");
};
//#endregion
//#region node_modules/lodash-es/stubFalse.js
function eu() {
	return !1;
}
//#endregion
//#region node_modules/lodash-es/isBuffer.js
var tu = typeof exports == "object" && exports && !exports.nodeType && exports, nu = tu && typeof module == "object" && module && !module.nodeType && module, ru = nu && nu.exports === tu ? Oc.Buffer : void 0, iu = (ru ? ru.isBuffer : void 0) || eu, au = "[object Arguments]", ou = "[object Array]", su = "[object Boolean]", cu = "[object Date]", lu = "[object Error]", uu = "[object Function]", du = "[object Map]", fu = "[object Number]", pu = "[object Object]", mu = "[object RegExp]", hu = "[object Set]", gu = "[object String]", _u = "[object WeakMap]", vu = "[object ArrayBuffer]", yu = "[object DataView]", bu = "[object Float32Array]", xu = "[object Float64Array]", Su = "[object Int8Array]", Cu = "[object Int16Array]", wu = "[object Int32Array]", Tu = "[object Uint8Array]", Eu = "[object Uint8ClampedArray]", Du = "[object Uint16Array]", Ou = "[object Uint32Array]", ku = {};
ku[bu] = ku[xu] = ku[Su] = ku[Cu] = ku[wu] = ku[Tu] = ku[Eu] = ku[Du] = ku[Ou] = !0, ku[au] = ku[ou] = ku[vu] = ku[su] = ku[yu] = ku[cu] = ku[lu] = ku[uu] = ku[du] = ku[fu] = ku[pu] = ku[mu] = ku[hu] = ku[gu] = ku[_u] = !1;
function Au(e) {
	return Vc(e) && Vl(e.length) && !!ku[Bc(e)];
}
//#endregion
//#region node_modules/lodash-es/_baseUnary.js
function ju(e) {
	return function(t) {
		return e(t);
	};
}
//#endregion
//#region node_modules/lodash-es/_nodeUtil.js
var Mu = typeof exports == "object" && exports && !exports.nodeType && exports, Nu = Mu && typeof module == "object" && module && !module.nodeType && module, Pu = Nu && Nu.exports === Mu && Ec.process, Fu = function() {
	try {
		return Nu && Nu.require && Nu.require("util").types || Pu && Pu.binding && Pu.binding("util");
	} catch {}
}(), Iu = Fu && Fu.isTypedArray, Lu = Iu ? ju(Iu) : Au, Ru = Object.prototype.hasOwnProperty;
function zu(e, t) {
	var n = Gc(e), r = !n && $l(e), i = !n && !r && iu(e), a = !n && !r && !i && Lu(e), o = n || r || i || a, s = o ? ql(e.length, String) : [], c = s.length;
	for (var l in e) (t || Ru.call(e, l)) && !(o && (l == "length" || i && (l == "offset" || l == "parent") || a && (l == "buffer" || l == "byteLength" || l == "byteOffset") || jl(l, c))) && s.push(l);
	return s;
}
//#endregion
//#region node_modules/lodash-es/_overArg.js
function Bu(e, t) {
	return function(n) {
		return e(t(n));
	};
}
//#endregion
//#region node_modules/lodash-es/_nativeKeysIn.js
function Vu(e) {
	var t = [];
	if (e != null) for (var n in Object(e)) t.push(n);
	return t;
}
//#endregion
//#region node_modules/lodash-es/_baseKeysIn.js
var Hu = Object.prototype.hasOwnProperty;
function Uu(e) {
	if (!Xc(e)) return Vu(e);
	var t = Kl(e), n = [];
	for (var r in e) (r != "constructor" || !t && Hu.call(e, r)) && n.push(r);
	return n;
}
//#endregion
//#region node_modules/lodash-es/keysIn.js
function Wu(e) {
	return Hl(e) ? zu(e, !0) : Uu(e);
}
//#endregion
//#region node_modules/lodash-es/_nativeCreate.js
var Gu = _l(Object, "create");
//#endregion
//#region node_modules/lodash-es/_hashClear.js
function Ku() {
	this.__data__ = Gu ? Gu(null) : {}, this.size = 0;
}
//#endregion
//#region node_modules/lodash-es/_hashDelete.js
function qu(e) {
	var t = this.has(e) && delete this.__data__[e];
	return this.size -= +!!t, t;
}
//#endregion
//#region node_modules/lodash-es/_hashGet.js
var Ju = "__lodash_hash_undefined__", Yu = Object.prototype.hasOwnProperty;
function Xu(e) {
	var t = this.__data__;
	if (Gu) {
		var n = t[e];
		return n === Ju ? void 0 : n;
	}
	return Yu.call(t, e) ? t[e] : void 0;
}
//#endregion
//#region node_modules/lodash-es/_hashHas.js
var Zu = Object.prototype.hasOwnProperty;
function Qu(e) {
	var t = this.__data__;
	return Gu ? t[e] !== void 0 : Zu.call(t, e);
}
//#endregion
//#region node_modules/lodash-es/_hashSet.js
var $u = "__lodash_hash_undefined__";
function ed(e, t) {
	var n = this.__data__;
	return this.size += +!this.has(e), n[e] = Gu && t === void 0 ? $u : t, this;
}
//#endregion
//#region node_modules/lodash-es/_Hash.js
function td(e) {
	var t = -1, n = e == null ? 0 : e.length;
	for (this.clear(); ++t < n;) {
		var r = e[t];
		this.set(r[0], r[1]);
	}
}
td.prototype.clear = Ku, td.prototype.delete = qu, td.prototype.get = Xu, td.prototype.has = Qu, td.prototype.set = ed;
//#endregion
//#region node_modules/lodash-es/_listCacheClear.js
function nd() {
	this.__data__ = [], this.size = 0;
}
//#endregion
//#region node_modules/lodash-es/_assocIndexOf.js
function rd(e, t) {
	for (var n = e.length; n--;) if (Nl(e[n][0], t)) return n;
	return -1;
}
//#endregion
//#region node_modules/lodash-es/_listCacheDelete.js
var id = Array.prototype.splice;
function ad(e) {
	var t = this.__data__, n = rd(t, e);
	return n < 0 ? !1 : (n == t.length - 1 ? t.pop() : id.call(t, n, 1), --this.size, !0);
}
//#endregion
//#region node_modules/lodash-es/_listCacheGet.js
function od(e) {
	var t = this.__data__, n = rd(t, e);
	return n < 0 ? void 0 : t[n][1];
}
//#endregion
//#region node_modules/lodash-es/_listCacheHas.js
function sd(e) {
	return rd(this.__data__, e) > -1;
}
//#endregion
//#region node_modules/lodash-es/_listCacheSet.js
function cd(e, t) {
	var n = this.__data__, r = rd(n, e);
	return r < 0 ? (++this.size, n.push([e, t])) : n[r][1] = t, this;
}
//#endregion
//#region node_modules/lodash-es/_ListCache.js
function ld(e) {
	var t = -1, n = e == null ? 0 : e.length;
	for (this.clear(); ++t < n;) {
		var r = e[t];
		this.set(r[0], r[1]);
	}
}
ld.prototype.clear = nd, ld.prototype.delete = ad, ld.prototype.get = od, ld.prototype.has = sd, ld.prototype.set = cd;
//#endregion
//#region node_modules/lodash-es/_Map.js
var ud = _l(Oc, "Map");
//#endregion
//#region node_modules/lodash-es/_mapCacheClear.js
function dd() {
	this.size = 0, this.__data__ = {
		hash: new td(),
		map: new (ud || ld)(),
		string: new td()
	};
}
//#endregion
//#region node_modules/lodash-es/_isKeyable.js
function fd(e) {
	var t = typeof e;
	return t == "string" || t == "number" || t == "symbol" || t == "boolean" ? e !== "__proto__" : e === null;
}
//#endregion
//#region node_modules/lodash-es/_getMapData.js
function pd(e, t) {
	var n = e.__data__;
	return fd(t) ? n[typeof t == "string" ? "string" : "hash"] : n.map;
}
//#endregion
//#region node_modules/lodash-es/_mapCacheDelete.js
function md(e) {
	var t = pd(this, e).delete(e);
	return this.size -= +!!t, t;
}
//#endregion
//#region node_modules/lodash-es/_mapCacheGet.js
function hd(e) {
	return pd(this, e).get(e);
}
//#endregion
//#region node_modules/lodash-es/_mapCacheHas.js
function gd(e) {
	return pd(this, e).has(e);
}
//#endregion
//#region node_modules/lodash-es/_mapCacheSet.js
function _d(e, t) {
	var n = pd(this, e), r = n.size;
	return n.set(e, t), this.size += n.size == r ? 0 : 1, this;
}
//#endregion
//#region node_modules/lodash-es/_MapCache.js
function vd(e) {
	var t = -1, n = e == null ? 0 : e.length;
	for (this.clear(); ++t < n;) {
		var r = e[t];
		this.set(r[0], r[1]);
	}
}
vd.prototype.clear = dd, vd.prototype.delete = md, vd.prototype.get = hd, vd.prototype.has = gd, vd.prototype.set = _d;
//#endregion
//#region node_modules/lodash-es/toString.js
function yd(e) {
	return e == null ? "" : Yc(e);
}
//#endregion
//#region node_modules/lodash-es/_getPrototype.js
var bd = Bu(Object.getPrototypeOf, Object), xd = "[object Object]", Sd = Function.prototype, Cd = Object.prototype, wd = Sd.toString, Td = Cd.hasOwnProperty, Ed = wd.call(Object);
function Dd(e) {
	if (!Vc(e) || Bc(e) != xd) return !1;
	var t = bd(e);
	if (t === null) return !0;
	var n = Td.call(t, "constructor") && t.constructor;
	return typeof n == "function" && n instanceof n && wd.call(n) == Ed;
}
//#endregion
//#region node_modules/lodash-es/_baseSlice.js
function Od(e, t, n) {
	var r = -1, i = e.length;
	t < 0 && (t = -t > i ? 0 : i + t), n = n > i ? i : n, n < 0 && (n += i), i = t > n ? 0 : n - t >>> 0, t >>>= 0;
	for (var a = Array(i); ++r < i;) a[r] = e[r + t];
	return a;
}
//#endregion
//#region node_modules/lodash-es/_castSlice.js
function kd(e, t, n) {
	var r = e.length;
	return n = n === void 0 ? r : n, !t && n >= r ? e : Od(e, t, n);
}
//#endregion
//#region node_modules/lodash-es/_hasUnicode.js
var Ad = RegExp("[\\u200d\\ud800-\\udfff\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff\\ufe0e\\ufe0f]");
function jd(e) {
	return Ad.test(e);
}
//#endregion
//#region node_modules/lodash-es/_asciiToArray.js
function Md(e) {
	return e.split("");
}
//#endregion
//#region node_modules/lodash-es/_unicodeToArray.js
var Nd = "\\ud800-\\udfff", Pd = "\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff", Fd = "\\ufe0e\\ufe0f", Id = "[" + Nd + "]", Ld = "[" + Pd + "]", Rd = "\\ud83c[\\udffb-\\udfff]", zd = "(?:" + Ld + "|" + Rd + ")", Bd = "[^" + Nd + "]", Vd = "(?:\\ud83c[\\udde6-\\uddff]){2}", Hd = "[\\ud800-\\udbff][\\udc00-\\udfff]", Ud = "\\u200d", Wd = zd + "?", Gd = "[" + Fd + "]?", Kd = "(?:" + Ud + "(?:" + [
	Bd,
	Vd,
	Hd
].join("|") + ")" + Gd + Wd + ")*", qd = Gd + Wd + Kd, Jd = "(?:" + [
	Bd + Ld + "?",
	Ld,
	Vd,
	Hd,
	Id
].join("|") + ")", Yd = RegExp(Rd + "(?=" + Rd + ")|" + Jd + qd, "g");
function Xd(e) {
	return e.match(Yd) || [];
}
//#endregion
//#region node_modules/lodash-es/_stringToArray.js
function Zd(e) {
	return jd(e) ? Xd(e) : Md(e);
}
//#endregion
//#region node_modules/lodash-es/_createCaseFirst.js
function Qd(e) {
	return function(t) {
		t = yd(t);
		var n = jd(t) ? Zd(t) : void 0, r = n ? n[0] : t.charAt(0), i = n ? kd(n, 1).join("") : t.slice(1);
		return r[e]() + i;
	};
}
//#endregion
//#region node_modules/lodash-es/upperFirst.js
var $d = Qd("toUpperCase");
//#endregion
//#region node_modules/lodash-es/_stackClear.js
function ef() {
	this.__data__ = new ld(), this.size = 0;
}
//#endregion
//#region node_modules/lodash-es/_stackDelete.js
function tf(e) {
	var t = this.__data__, n = t.delete(e);
	return this.size = t.size, n;
}
//#endregion
//#region node_modules/lodash-es/_stackGet.js
function nf(e) {
	return this.__data__.get(e);
}
//#endregion
//#region node_modules/lodash-es/_stackHas.js
function rf(e) {
	return this.__data__.has(e);
}
//#endregion
//#region node_modules/lodash-es/_stackSet.js
var af = 200;
function of(e, t) {
	var n = this.__data__;
	if (n instanceof ld) {
		var r = n.__data__;
		if (!ud || r.length < af - 1) return r.push([e, t]), this.size = ++n.size, this;
		n = this.__data__ = new vd(r);
	}
	return n.set(e, t), this.size = n.size, this;
}
//#endregion
//#region node_modules/lodash-es/_Stack.js
function sf(e) {
	var t = this.__data__ = new ld(e);
	this.size = t.size;
}
sf.prototype.clear = ef, sf.prototype.delete = tf, sf.prototype.get = nf, sf.prototype.has = rf, sf.prototype.set = of;
//#endregion
//#region node_modules/lodash-es/_cloneBuffer.js
var cf = typeof exports == "object" && exports && !exports.nodeType && exports, lf = cf && typeof module == "object" && module && !module.nodeType && module, uf = lf && lf.exports === cf ? Oc.Buffer : void 0, df = uf ? uf.allocUnsafe : void 0;
function ff(e, t) {
	if (t) return e.slice();
	var n = e.length, r = df ? df(n) : new e.constructor(n);
	return e.copy(r), r;
}
//#endregion
//#region node_modules/lodash-es/_Uint8Array.js
var pf = Oc.Uint8Array;
//#endregion
//#region node_modules/lodash-es/_cloneArrayBuffer.js
function mf(e) {
	var t = new e.constructor(e.byteLength);
	return new pf(t).set(new pf(e)), t;
}
//#endregion
//#region node_modules/lodash-es/_cloneTypedArray.js
function hf(e, t) {
	var n = t ? mf(e.buffer) : e.buffer;
	return new e.constructor(n, e.byteOffset, e.length);
}
//#endregion
//#region node_modules/lodash-es/_initCloneObject.js
function gf(e) {
	return typeof e.constructor == "function" && !Kl(e) ? yl(bd(e)) : {};
}
//#endregion
//#region node_modules/lodash-es/_createBaseFor.js
function _f(e) {
	return function(t, n, r) {
		for (var i = -1, a = Object(t), o = r(t), s = o.length; s--;) {
			var c = o[e ? s : ++i];
			if (n(a[c], c, a) === !1) break;
		}
		return t;
	};
}
//#endregion
//#region node_modules/lodash-es/_baseFor.js
var vf = _f();
//#endregion
//#region node_modules/lodash-es/_assignMergeValue.js
function yf(e, t, n) {
	(n !== void 0 && !Nl(e[t], n) || n === void 0 && !(t in e)) && Ml(e, t, n);
}
//#endregion
//#region node_modules/lodash-es/isArrayLikeObject.js
function bf(e) {
	return Vc(e) && Hl(e);
}
//#endregion
//#region node_modules/lodash-es/_safeGet.js
function xf(e, t) {
	if ((t !== "constructor" || typeof e[t] != "function") && t != "__proto__") return e[t];
}
//#endregion
//#region node_modules/lodash-es/toPlainObject.js
function Sf(e) {
	return Il(e, Wu(e));
}
//#endregion
//#region node_modules/lodash-es/_baseMergeDeep.js
function Cf(e, t, n, r, i, a, o) {
	var s = xf(e, n), c = xf(t, n), l = o.get(c);
	if (l) {
		yf(e, n, l);
		return;
	}
	var u = a ? a(s, c, n + "", e, t, o) : void 0, d = u === void 0;
	if (d) {
		var f = Gc(c), p = !f && iu(c), m = !f && !p && Lu(c);
		u = c, f || p || m ? Gc(s) ? u = s : bf(s) ? u = xl(s) : p ? (d = !1, u = ff(c, !0)) : m ? (d = !1, u = hf(c, !0)) : u = [] : Dd(c) || $l(c) ? (u = s, $l(s) ? u = Sf(s) : (!Xc(s) || nl(s)) && (u = gf(c))) : d = !1;
	}
	d && (o.set(c, u), i(u, c, r, a, o), o.delete(c)), yf(e, n, u);
}
//#endregion
//#region node_modules/lodash-es/_baseMerge.js
function wf(e, t, n, r, i) {
	e !== t && vf(t, function(a, o) {
		if (i ||= new sf(), Xc(a)) Cf(e, t, o, n, wf, r, i);
		else {
			var s = r ? r(xf(e, o), a, o + "", e, t, i) : void 0;
			s === void 0 && (s = a), yf(e, o, s);
		}
	}, Wu);
}
//#endregion
//#region node_modules/lodash-es/merge.js
var Tf = Wl(function(e, t, n) {
	wf(e, t, n);
});
//#endregion
//#region node_modules/naive-ui/es/_utils/naive/warn.mjs
function Ef(e, t) {
	console.error(`[naive/${e}]: ${t}`);
}
function Df(e, t) {
	throw Error(`[naive/${e}]: ${t}`);
}
//#endregion
//#region node_modules/naive-ui/es/_utils/vue/keysOf.mjs
function Of(e) {
	return Object.keys(e);
}
//#endregion
//#region node_modules/naive-ui/es/_utils/vue/create-injection-key.mjs
function kf(e) {
	return e;
}
//#endregion
//#region node_modules/naive-ui/es/config-provider/src/context.mjs
var Af = kf("n-config-provider");
//#endregion
//#region node_modules/naive-ui/es/_mixins/use-config.mjs
function jf(e = {}, t = { defaultBordered: !0 }) {
	let n = Jn(Af, null);
	return {
		inlineThemeDisabled: n?.inlineThemeDisabled,
		mergedRtlRef: n?.mergedRtlRef,
		mergedComponentPropsRef: n?.mergedComponentPropsRef,
		mergedBreakpointsRef: n?.mergedBreakpointsRef,
		mergedBorderedRef: z(() => {
			let { bordered: r } = e;
			return r === void 0 ? n?.mergedBorderedRef.value ?? t.defaultBordered ?? !0 : r;
		}),
		mergedClsPrefixRef: n ? n.mergedClsPrefixRef : /* @__PURE__ */ rn("n"),
		namespaceRef: z(() => n?.mergedNamespaceRef.value)
	};
}
//#endregion
//#region node_modules/naive-ui/es/_mixins/common.mjs
var Mf = "naive-ui-style", Nf = {
	fontFamily: "v-sans, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\"",
	fontFamilyMono: "v-mono, SFMono-Regular, Menlo, Consolas, Courier, monospace",
	fontWeight: "400",
	fontWeightStrong: "500",
	cubicBezierEaseInOut: "cubic-bezier(.4, 0, .2, 1)",
	cubicBezierEaseOut: "cubic-bezier(0, 0, .2, 1)",
	cubicBezierEaseIn: "cubic-bezier(.4, 0, 1, 1)",
	borderRadius: "3px",
	borderRadiusSmall: "2px",
	fontSize: "14px",
	fontSizeMini: "12px",
	fontSizeTiny: "12px",
	fontSizeSmall: "14px",
	fontSizeMedium: "14px",
	fontSizeLarge: "15px",
	fontSizeHuge: "16px",
	lineHeight: "1.6",
	heightMini: "16px",
	heightTiny: "22px",
	heightSmall: "28px",
	heightMedium: "34px",
	heightLarge: "40px",
	heightHuge: "46px"
}, { fontSize: Pf, fontFamily: Ff, lineHeight: If } = Nf, Lf = V("body", `
 margin: 0;
 font-size: ${Pf};
 font-family: ${Ff};
 line-height: ${If};
 -webkit-text-size-adjust: 100%;
 -webkit-tap-highlight-color: transparent;
`, [V("input", "\n font-family: inherit;\n font-size: inherit;\n ")]), Rf = "@css-render/vue3-ssr";
function zf(e, t) {
	return `<style cssr-id="${e}">\n${t}\n</style>`;
}
function Bf(e, t, n) {
	let { styles: r, ids: i } = n;
	i.has(e) || r !== null && (i.add(e), r.push(zf(e, t)));
}
var Vf = typeof document < "u";
function Hf() {
	if (Vf) return;
	let e = Jn(Rf, null);
	if (e !== null) return {
		adapter: (t, n) => Bf(t, n, e),
		context: e
	};
}
//#endregion
//#region node_modules/naive-ui/es/_mixins/use-style.mjs
function Uf(e, t, n) {
	if (!t) return;
	let r = Hf(), i = Jn(Af, null), a = () => {
		let a = n.value;
		t.mount({
			id: a === void 0 ? e : a + e,
			head: !0,
			anchorMetaName: Mf,
			props: { bPrefix: a ? `.${a}-` : void 0 },
			ssr: r,
			parent: i?.styleMountTarget
		}), i?.preflightStyleDisabled || Lf.mount({
			id: "n-global",
			head: !0,
			anchorMetaName: Mf,
			ssr: r,
			parent: i?.styleMountTarget
		});
	};
	r ? a() : Ar(a);
}
//#endregion
//#region node_modules/naive-ui/es/vue-jsx-vapor/vdom.mjs
var Wf = /* @__PURE__ */ new WeakMap();
function Gf(e) {
	let t = ua();
	if (t) {
		Wf.has(t) || Wf.set(t, {});
		let n = Wf.get(t);
		return n[e] || (n[e] = []);
	}
	return [];
}
function K(e, t = 1) {
	let n = Yi, r = !1;
	return typeof e == "function" && (r = !0, L(), n = Ui, e = e()), Wi(e) ? r ? Ui(Kf(e)) : Kf(e) : Array.isArray(e) ? r ? R(Ni, null, e.map((e) => K(() => e)), -2) : Ji(Ni, null, e.slice()) : e == null || typeof e == "boolean" ? n(Fi) : n(Pi, null, String(e), t);
}
function Kf(e) {
	return e.el === null && e.patchFlag !== -1 || e.memo ? e : Qi(e);
}
var qf = (e) => typeof e == "function" || Object.prototype.toString.call(e) === "[object Object]" && !Wi(e) ? e : { default: Gn(() => [K(() => e)]) }, q = (e) => we(e) || null;
//#endregion
//#region node_modules/seemly/es/dom/get-precise-event-target.js
function Jf(e) {
	return e.composedPath()[0] || null;
}
//#endregion
//#region node_modules/seemly/es/css/index.js
function Yf(e) {
	return typeof e == "string" ? e.endsWith("px") ? Number(e.slice(0, e.length - 2)) : Number(e) : e;
}
function Xf(e) {
	if (e != null) return typeof e == "number" ? `${e}px` : e.endsWith("px") ? e : `${e}px`;
}
function Zf(e, t) {
	let n = e.trim().split(/\s+/g), r = { top: n[0] };
	switch (n.length) {
		case 1:
			r.right = n[0], r.bottom = n[0], r.left = n[0];
			break;
		case 2:
			r.right = n[1], r.left = n[1], r.bottom = n[0];
			break;
		case 3:
			r.right = n[1], r.bottom = n[2], r.left = n[1];
			break;
		case 4:
			r.right = n[1], r.bottom = n[2], r.left = n[3];
			break;
		default: throw Error("[seemly/getMargin]:" + e + " is not a valid value.");
	}
	return t === void 0 ? r : r[t];
}
//#endregion
//#region node_modules/seemly/es/color/colors.js
var Qf = {
	aliceblue: "#F0F8FF",
	antiquewhite: "#FAEBD7",
	aqua: "#0FF",
	aquamarine: "#7FFFD4",
	azure: "#F0FFFF",
	beige: "#F5F5DC",
	bisque: "#FFE4C4",
	black: "#000",
	blanchedalmond: "#FFEBCD",
	blue: "#00F",
	blueviolet: "#8A2BE2",
	brown: "#A52A2A",
	burlywood: "#DEB887",
	cadetblue: "#5F9EA0",
	chartreuse: "#7FFF00",
	chocolate: "#D2691E",
	coral: "#FF7F50",
	cornflowerblue: "#6495ED",
	cornsilk: "#FFF8DC",
	crimson: "#DC143C",
	cyan: "#0FF",
	darkblue: "#00008B",
	darkcyan: "#008B8B",
	darkgoldenrod: "#B8860B",
	darkgray: "#A9A9A9",
	darkgrey: "#A9A9A9",
	darkgreen: "#006400",
	darkkhaki: "#BDB76B",
	darkmagenta: "#8B008B",
	darkolivegreen: "#556B2F",
	darkorange: "#FF8C00",
	darkorchid: "#9932CC",
	darkred: "#8B0000",
	darksalmon: "#E9967A",
	darkseagreen: "#8FBC8F",
	darkslateblue: "#483D8B",
	darkslategray: "#2F4F4F",
	darkslategrey: "#2F4F4F",
	darkturquoise: "#00CED1",
	darkviolet: "#9400D3",
	deeppink: "#FF1493",
	deepskyblue: "#00BFFF",
	dimgray: "#696969",
	dimgrey: "#696969",
	dodgerblue: "#1E90FF",
	firebrick: "#B22222",
	floralwhite: "#FFFAF0",
	forestgreen: "#228B22",
	fuchsia: "#F0F",
	gainsboro: "#DCDCDC",
	ghostwhite: "#F8F8FF",
	gold: "#FFD700",
	goldenrod: "#DAA520",
	gray: "#808080",
	grey: "#808080",
	green: "#008000",
	greenyellow: "#ADFF2F",
	honeydew: "#F0FFF0",
	hotpink: "#FF69B4",
	indianred: "#CD5C5C",
	indigo: "#4B0082",
	ivory: "#FFFFF0",
	khaki: "#F0E68C",
	lavender: "#E6E6FA",
	lavenderblush: "#FFF0F5",
	lawngreen: "#7CFC00",
	lemonchiffon: "#FFFACD",
	lightblue: "#ADD8E6",
	lightcoral: "#F08080",
	lightcyan: "#E0FFFF",
	lightgoldenrodyellow: "#FAFAD2",
	lightgray: "#D3D3D3",
	lightgrey: "#D3D3D3",
	lightgreen: "#90EE90",
	lightpink: "#FFB6C1",
	lightsalmon: "#FFA07A",
	lightseagreen: "#20B2AA",
	lightskyblue: "#87CEFA",
	lightslategray: "#778899",
	lightslategrey: "#778899",
	lightsteelblue: "#B0C4DE",
	lightyellow: "#FFFFE0",
	lime: "#0F0",
	limegreen: "#32CD32",
	linen: "#FAF0E6",
	magenta: "#F0F",
	maroon: "#800000",
	mediumaquamarine: "#66CDAA",
	mediumblue: "#0000CD",
	mediumorchid: "#BA55D3",
	mediumpurple: "#9370DB",
	mediumseagreen: "#3CB371",
	mediumslateblue: "#7B68EE",
	mediumspringgreen: "#00FA9A",
	mediumturquoise: "#48D1CC",
	mediumvioletred: "#C71585",
	midnightblue: "#191970",
	mintcream: "#F5FFFA",
	mistyrose: "#FFE4E1",
	moccasin: "#FFE4B5",
	navajowhite: "#FFDEAD",
	navy: "#000080",
	oldlace: "#FDF5E6",
	olive: "#808000",
	olivedrab: "#6B8E23",
	orange: "#FFA500",
	orangered: "#FF4500",
	orchid: "#DA70D6",
	palegoldenrod: "#EEE8AA",
	palegreen: "#98FB98",
	paleturquoise: "#AFEEEE",
	palevioletred: "#DB7093",
	papayawhip: "#FFEFD5",
	peachpuff: "#FFDAB9",
	peru: "#CD853F",
	pink: "#FFC0CB",
	plum: "#DDA0DD",
	powderblue: "#B0E0E6",
	purple: "#800080",
	rebeccapurple: "#663399",
	red: "#F00",
	rosybrown: "#BC8F8F",
	royalblue: "#4169E1",
	saddlebrown: "#8B4513",
	salmon: "#FA8072",
	sandybrown: "#F4A460",
	seagreen: "#2E8B57",
	seashell: "#FFF5EE",
	sienna: "#A0522D",
	silver: "#C0C0C0",
	skyblue: "#87CEEB",
	slateblue: "#6A5ACD",
	slategray: "#708090",
	slategrey: "#708090",
	snow: "#FFFAFA",
	springgreen: "#00FF7F",
	steelblue: "#4682B4",
	tan: "#D2B48C",
	teal: "#008080",
	thistle: "#D8BFD8",
	tomato: "#FF6347",
	turquoise: "#40E0D0",
	violet: "#EE82EE",
	wheat: "#F5DEB3",
	white: "#FFF",
	whitesmoke: "#F5F5F5",
	yellow: "#FF0",
	yellowgreen: "#9ACD32",
	transparent: "#0000"
};
//#endregion
//#region node_modules/seemly/es/color/convert.js
function $f(e, t, n) {
	t /= 100, n /= 100;
	let r = (r, i = (r + e / 60) % 6) => n - n * t * Math.max(Math.min(i, 4 - i, 1), 0);
	return [
		r(5) * 255,
		r(3) * 255,
		r(1) * 255
	];
}
function ep(e, t, n) {
	t /= 100, n /= 100;
	let r = t * Math.min(n, 1 - n), i = (t, i = (t + e / 30) % 12) => n - r * Math.max(Math.min(i - 3, 9 - i, 1), -1);
	return [
		i(0) * 255,
		i(8) * 255,
		i(4) * 255
	];
}
//#endregion
//#region node_modules/seemly/es/color/index.js
var tp = "^\\s*", np = "\\s*$", rp = "\\s*((\\.\\d+)|(\\d+(\\.\\d*)?))%\\s*", ip = "\\s*((\\.\\d+)|(\\d+(\\.\\d*)?))\\s*", ap = "([0-9A-Fa-f])", op = "([0-9A-Fa-f]{2})", sp = RegExp(`${tp}hsl\\s*\\(${ip},${rp},${rp}\\)${np}`), cp = RegExp(`${tp}hsv\\s*\\(${ip},${rp},${rp}\\)${np}`), lp = RegExp(`${tp}hsla\\s*\\(${ip},${rp},${rp},${ip}\\)${np}`), up = RegExp(`${tp}hsva\\s*\\(${ip},${rp},${rp},${ip}\\)${np}`), dp = RegExp(`${tp}rgb\\s*\\(${ip},${ip},${ip}\\)${np}`), fp = RegExp(`${tp}rgba\\s*\\(${ip},${ip},${ip},${ip}\\)${np}`), pp = RegExp(`${tp}#${ap}${ap}${ap}${np}`), mp = RegExp(`${tp}#${op}${op}${op}${np}`), hp = RegExp(`${tp}#${ap}${ap}${ap}${ap}${np}`), gp = RegExp(`${tp}#${op}${op}${op}${op}${np}`);
function _p(e) {
	return parseInt(e, 16);
}
function vp(e) {
	try {
		let t;
		if (t = lp.exec(e)) return [
			Ep(t[1]),
			Op(t[5]),
			Op(t[9]),
			Tp(t[13])
		];
		if (t = sp.exec(e)) return [
			Ep(t[1]),
			Op(t[5]),
			Op(t[9]),
			1
		];
		throw Error(`[seemly/hsla]: Invalid color value ${e}.`);
	} catch (e) {
		throw e;
	}
}
function yp(e) {
	try {
		let t;
		if (t = up.exec(e)) return [
			Ep(t[1]),
			Op(t[5]),
			Op(t[9]),
			Tp(t[13])
		];
		if (t = cp.exec(e)) return [
			Ep(t[1]),
			Op(t[5]),
			Op(t[9]),
			1
		];
		throw Error(`[seemly/hsva]: Invalid color value ${e}.`);
	} catch (e) {
		throw e;
	}
}
function bp(e) {
	try {
		let t;
		if (t = mp.exec(e)) return [
			_p(t[1]),
			_p(t[2]),
			_p(t[3]),
			1
		];
		if (t = dp.exec(e)) return [
			Dp(t[1]),
			Dp(t[5]),
			Dp(t[9]),
			1
		];
		if (t = fp.exec(e)) return [
			Dp(t[1]),
			Dp(t[5]),
			Dp(t[9]),
			Tp(t[13])
		];
		if (t = pp.exec(e)) return [
			_p(t[1] + t[1]),
			_p(t[2] + t[2]),
			_p(t[3] + t[3]),
			1
		];
		if (t = gp.exec(e)) return [
			_p(t[1]),
			_p(t[2]),
			_p(t[3]),
			Tp(_p(t[4]) / 255)
		];
		if (t = hp.exec(e)) return [
			_p(t[1] + t[1]),
			_p(t[2] + t[2]),
			_p(t[3] + t[3]),
			Tp(_p(t[4] + t[4]) / 255)
		];
		if (e in Qf) return bp(Qf[e]);
		if (sp.test(e) || lp.test(e)) {
			let [t, n, r, i] = vp(e);
			return [...ep(t, n, r), i];
		}
		if (cp.test(e) || up.test(e)) {
			let [t, n, r, i] = yp(e);
			return [...$f(t, n, r), i];
		}
		throw Error(`[seemly/rgba]: Invalid color value ${e}.`);
	} catch (e) {
		throw e;
	}
}
function xp(e) {
	return e > 1 ? 1 : e < 0 ? 0 : e;
}
function Sp(e, t, n, r) {
	return `rgba(${Dp(e)}, ${Dp(t)}, ${Dp(n)}, ${xp(r)})`;
}
function Cp(e, t, n, r, i) {
	return Dp((e * t * (1 - r) + n * r) / i);
}
function J(e, t) {
	Array.isArray(e) || (e = bp(e)), Array.isArray(t) || (t = bp(t));
	let n = e[3], r = t[3], i = Tp(n + r - n * r);
	return Sp(Cp(e[0], n, t[0], r, i), Cp(e[1], n, t[1], r, i), Cp(e[2], n, t[2], r, i), i);
}
function Y(e, t) {
	let [n, r, i, a = 1] = Array.isArray(e) ? e : bp(e);
	return typeof t.alpha == "number" ? Sp(n, r, i, t.alpha) : Sp(n, r, i, a);
}
function wp(e, t) {
	let [n, r, i, a = 1] = Array.isArray(e) ? e : bp(e), { lightness: o = 1, alpha: s = 1 } = t;
	return kp([
		n * o,
		r * o,
		i * o,
		a * s
	]);
}
function Tp(e) {
	let t = Math.round(Number(e) * 100) / 100;
	return t > 1 ? 1 : t < 0 ? 0 : t;
}
function Ep(e) {
	let t = Math.round(Number(e));
	return t >= 360 || t < 0 ? 0 : t;
}
function Dp(e) {
	let t = Math.round(Number(e));
	return t > 255 ? 255 : t < 0 ? 0 : t;
}
function Op(e) {
	let t = Math.round(Number(e));
	return t > 100 ? 100 : t < 0 ? 0 : t;
}
function kp(e) {
	let [t, n, r] = e;
	return 3 in e ? `rgba(${Dp(t)}, ${Dp(n)}, ${Dp(r)}, ${Tp(e[3])})` : `rgba(${Dp(t)}, ${Dp(n)}, ${Dp(r)}, 1)`;
}
//#endregion
//#region node_modules/naive-ui/es/_styles/common/dark.mjs
var X = {
	neutralBase: "#000",
	neutralInvertBase: "#fff",
	neutralTextBase: "#fff",
	neutralPopover: "rgb(72, 72, 78)",
	neutralCard: "rgb(24, 24, 28)",
	neutralModal: "rgb(44, 44, 50)",
	neutralBody: "rgb(16, 16, 20)",
	alpha1: "0.9",
	alpha2: "0.82",
	alpha3: "0.52",
	alpha4: "0.38",
	alpha5: "0.28",
	alphaClose: "0.52",
	alphaDisabled: "0.38",
	alphaDisabledInput: "0.06",
	alphaPending: "0.09",
	alphaTablePending: "0.06",
	alphaTableStriped: "0.05",
	alphaPressed: "0.05",
	alphaAvatar: "0.18",
	alphaRail: "0.2",
	alphaProgressRail: "0.12",
	alphaBorder: "0.24",
	alphaDivider: "0.09",
	alphaInput: "0.1",
	alphaAction: "0.06",
	alphaTab: "0.04",
	alphaScrollbar: "0.2",
	alphaScrollbarHover: "0.3",
	alphaCode: "0.12",
	alphaTag: "0.2",
	primaryHover: "#7fe7c4",
	primaryDefault: "#63e2b7",
	primaryActive: "#5acea7",
	primarySuppl: "rgb(42, 148, 125)",
	infoHover: "#8acbec",
	infoDefault: "#70c0e8",
	infoActive: "#66afd3",
	infoSuppl: "rgb(56, 137, 197)",
	errorHover: "#e98b8b",
	errorDefault: "#e88080",
	errorActive: "#e57272",
	errorSuppl: "rgb(208, 58, 82)",
	warningHover: "#f5d599",
	warningDefault: "#f2c97d",
	warningActive: "#e6c260",
	warningSuppl: "rgb(240, 138, 0)",
	successHover: "#7fe7c4",
	successDefault: "#63e2b7",
	successActive: "#5acea7",
	successSuppl: "rgb(42, 148, 125)"
}, Ap = bp(X.neutralBase), jp = bp(X.neutralInvertBase), Mp = `rgba(${jp.slice(0, 3).join(", ")}, `;
function Z(e) {
	return `${Mp + String(e)})`;
}
function Np(e) {
	let t = Array.from(jp);
	return t[3] = Number(e), J(Ap, t);
}
var Q = {
	name: "common",
	...Nf,
	baseColor: X.neutralBase,
	primaryColor: X.primaryDefault,
	primaryColorHover: X.primaryHover,
	primaryColorPressed: X.primaryActive,
	primaryColorSuppl: X.primarySuppl,
	infoColor: X.infoDefault,
	infoColorHover: X.infoHover,
	infoColorPressed: X.infoActive,
	infoColorSuppl: X.infoSuppl,
	successColor: X.successDefault,
	successColorHover: X.successHover,
	successColorPressed: X.successActive,
	successColorSuppl: X.successSuppl,
	warningColor: X.warningDefault,
	warningColorHover: X.warningHover,
	warningColorPressed: X.warningActive,
	warningColorSuppl: X.warningSuppl,
	errorColor: X.errorDefault,
	errorColorHover: X.errorHover,
	errorColorPressed: X.errorActive,
	errorColorSuppl: X.errorSuppl,
	textColorBase: X.neutralTextBase,
	textColor1: Z(X.alpha1),
	textColor2: Z(X.alpha2),
	textColor3: Z(X.alpha3),
	textColorDisabled: Z(X.alpha4),
	placeholderColor: Z(X.alpha4),
	placeholderColorDisabled: Z(X.alpha5),
	iconColor: Z(X.alpha4),
	iconColorDisabled: Z(X.alpha5),
	iconColorHover: Z(Number(X.alpha4) * 1.25),
	iconColorPressed: Z(Number(X.alpha4) * .8),
	opacity1: X.alpha1,
	opacity2: X.alpha2,
	opacity3: X.alpha3,
	opacity4: X.alpha4,
	opacity5: X.alpha5,
	dividerColor: Z(X.alphaDivider),
	borderColor: Z(X.alphaBorder),
	closeIconColorHover: Z(Number(X.alphaClose)),
	closeIconColor: Z(Number(X.alphaClose)),
	closeIconColorPressed: Z(Number(X.alphaClose)),
	closeColorHover: "rgba(255, 255, 255, .12)",
	closeColorPressed: "rgba(255, 255, 255, .08)",
	clearColor: Z(X.alpha4),
	clearColorHover: wp(Z(X.alpha4), { alpha: 1.25 }),
	clearColorPressed: wp(Z(X.alpha4), { alpha: .8 }),
	scrollbarColor: Z(X.alphaScrollbar),
	scrollbarColorHover: Z(X.alphaScrollbarHover),
	scrollbarWidth: "5px",
	scrollbarHeight: "5px",
	scrollbarBorderRadius: "5px",
	progressRailColor: Z(X.alphaProgressRail),
	railColor: Z(X.alphaRail),
	popoverColor: X.neutralPopover,
	tableColor: X.neutralCard,
	cardColor: X.neutralCard,
	modalColor: X.neutralModal,
	bodyColor: X.neutralBody,
	tagColor: Np(X.alphaTag),
	avatarColor: Z(X.alphaAvatar),
	invertedColor: X.neutralBase,
	inputColor: Z(X.alphaInput),
	codeColor: Z(X.alphaCode),
	tabColor: Z(X.alphaTab),
	actionColor: Z(X.alphaAction),
	tableHeaderColor: Z(X.alphaAction),
	hoverColor: Z(X.alphaPending),
	tableColorHover: Z(X.alphaTablePending),
	tableColorStriped: Z(X.alphaTableStriped),
	pressedColor: Z(X.alphaPressed),
	opacityDisabled: X.alphaDisabled,
	inputColorDisabled: Z(X.alphaDisabledInput),
	buttonColor2: "rgba(255, 255, 255, .08)",
	buttonColor2Hover: "rgba(255, 255, 255, .12)",
	buttonColor2Pressed: "rgba(255, 255, 255, .08)",
	boxShadow1: "0 1px 2px -2px rgba(0, 0, 0, .24), 0 3px 6px 0 rgba(0, 0, 0, .18), 0 5px 12px 4px rgba(0, 0, 0, .12)",
	boxShadow2: "0 3px 6px -4px rgba(0, 0, 0, .24), 0 6px 12px 0 rgba(0, 0, 0, .16), 0 9px 18px 8px rgba(0, 0, 0, .10)",
	boxShadow3: "0 6px 16px -9px rgba(0, 0, 0, .08), 0 9px 28px 0 rgba(0, 0, 0, .05), 0 12px 48px 16px rgba(0, 0, 0, .03)"
}, $ = {
	neutralBase: "#FFF",
	neutralInvertBase: "#000",
	neutralTextBase: "#000",
	neutralPopover: "#fff",
	neutralCard: "#fff",
	neutralModal: "#fff",
	neutralBody: "#fff",
	alpha1: "0.82",
	alpha2: "0.72",
	alpha3: "0.38",
	alpha4: "0.24",
	alpha5: "0.18",
	alphaClose: "0.6",
	alphaDisabled: "0.5",
	alphaDisabledInput: "0.02",
	alphaPending: "0.05",
	alphaTablePending: "0.02",
	alphaPressed: "0.07",
	alphaAvatar: "0.2",
	alphaRail: "0.14",
	alphaProgressRail: ".08",
	alphaBorder: "0.12",
	alphaDivider: "0.06",
	alphaInput: "0",
	alphaAction: "0.02",
	alphaTab: "0.04",
	alphaScrollbar: "0.25",
	alphaScrollbarHover: "0.4",
	alphaCode: "0.05",
	alphaTag: "0.02",
	primaryHover: "#36ad6a",
	primaryDefault: "#18a058",
	primaryActive: "#0c7a43",
	primarySuppl: "#36ad6a",
	infoHover: "#4098fc",
	infoDefault: "#2080f0",
	infoActive: "#1060c9",
	infoSuppl: "#4098fc",
	errorHover: "#de576d",
	errorDefault: "#d03050",
	errorActive: "#ab1f3f",
	errorSuppl: "#de576d",
	warningHover: "#fcb040",
	warningDefault: "#f0a020",
	warningActive: "#c97c10",
	warningSuppl: "#fcb040",
	successHover: "#36ad6a",
	successDefault: "#18a058",
	successActive: "#0c7a43",
	successSuppl: "#36ad6a"
}, Pp = bp($.neutralBase), Fp = bp($.neutralInvertBase), Ip = `rgba(${Fp.slice(0, 3).join(", ")}, `;
function Lp(e) {
	return `${Ip + String(e)})`;
}
function Rp(e) {
	let t = Array.from(Fp);
	return t[3] = Number(e), J(Pp, t);
}
var zp = {
	name: "common",
	...Nf,
	baseColor: $.neutralBase,
	primaryColor: $.primaryDefault,
	primaryColorHover: $.primaryHover,
	primaryColorPressed: $.primaryActive,
	primaryColorSuppl: $.primarySuppl,
	infoColor: $.infoDefault,
	infoColorHover: $.infoHover,
	infoColorPressed: $.infoActive,
	infoColorSuppl: $.infoSuppl,
	successColor: $.successDefault,
	successColorHover: $.successHover,
	successColorPressed: $.successActive,
	successColorSuppl: $.successSuppl,
	warningColor: $.warningDefault,
	warningColorHover: $.warningHover,
	warningColorPressed: $.warningActive,
	warningColorSuppl: $.warningSuppl,
	errorColor: $.errorDefault,
	errorColorHover: $.errorHover,
	errorColorPressed: $.errorActive,
	errorColorSuppl: $.errorSuppl,
	textColorBase: $.neutralTextBase,
	textColor1: "rgb(31, 34, 37)",
	textColor2: "rgb(51, 54, 57)",
	textColor3: "rgb(118, 124, 130)",
	textColorDisabled: Rp($.alpha4),
	placeholderColor: Rp($.alpha4),
	placeholderColorDisabled: Rp($.alpha5),
	iconColor: Rp($.alpha4),
	iconColorHover: wp(Rp($.alpha4), { lightness: .75 }),
	iconColorPressed: wp(Rp($.alpha4), { lightness: .9 }),
	iconColorDisabled: Rp($.alpha5),
	opacity1: $.alpha1,
	opacity2: $.alpha2,
	opacity3: $.alpha3,
	opacity4: $.alpha4,
	opacity5: $.alpha5,
	dividerColor: "rgb(239, 239, 245)",
	borderColor: "rgb(224, 224, 230)",
	closeIconColor: Rp(Number($.alphaClose)),
	closeIconColorHover: Rp(Number($.alphaClose)),
	closeIconColorPressed: Rp(Number($.alphaClose)),
	closeColorHover: "rgba(0, 0, 0, .09)",
	closeColorPressed: "rgba(0, 0, 0, .13)",
	clearColor: Rp($.alpha4),
	clearColorHover: wp(Rp($.alpha4), { lightness: .75 }),
	clearColorPressed: wp(Rp($.alpha4), { lightness: .9 }),
	scrollbarColor: Lp($.alphaScrollbar),
	scrollbarColorHover: Lp($.alphaScrollbarHover),
	scrollbarWidth: "5px",
	scrollbarHeight: "5px",
	scrollbarBorderRadius: "5px",
	progressRailColor: Rp($.alphaProgressRail),
	railColor: "rgb(219, 219, 223)",
	popoverColor: $.neutralPopover,
	tableColor: $.neutralCard,
	cardColor: $.neutralCard,
	modalColor: $.neutralModal,
	bodyColor: $.neutralBody,
	tagColor: "#eee",
	avatarColor: Rp($.alphaAvatar),
	invertedColor: "rgb(0, 20, 40)",
	inputColor: Rp($.alphaInput),
	codeColor: "rgb(244, 244, 248)",
	tabColor: "rgb(247, 247, 250)",
	actionColor: "rgb(250, 250, 252)",
	tableHeaderColor: "rgb(250, 250, 252)",
	hoverColor: "rgb(243, 243, 245)",
	tableColorHover: "rgba(0, 0, 100, 0.03)",
	tableColorStriped: "rgba(0, 0, 100, 0.02)",
	pressedColor: "rgb(237, 237, 239)",
	opacityDisabled: $.alphaDisabled,
	inputColorDisabled: "rgb(250, 250, 252)",
	buttonColor2: "rgba(46, 51, 56, .05)",
	buttonColor2Hover: "rgba(46, 51, 56, .09)",
	buttonColor2Pressed: "rgba(46, 51, 56, .13)",
	boxShadow1: "0 1px 2px -2px rgba(0, 0, 0, .08), 0 3px 6px 0 rgba(0, 0, 0, .06), 0 5px 12px 4px rgba(0, 0, 0, .04)",
	boxShadow2: "0 3px 6px -4px rgba(0, 0, 0, .12), 0 6px 16px 0 rgba(0, 0, 0, .08), 0 9px 28px 8px rgba(0, 0, 0, .05)",
	boxShadow3: "0 6px 16px -9px rgba(0, 0, 0, .08), 0 9px 28px 0 rgba(0, 0, 0, .05), 0 12px 48px 16px rgba(0, 0, 0, .03)"
}, Bp = {
	railInsetHorizontalBottom: "auto 2px 4px 2px",
	railInsetHorizontalTop: "4px 2px auto 2px",
	railInsetVerticalRight: "2px 4px 2px auto",
	railInsetVerticalLeft: "2px auto 2px 4px",
	railColor: "transparent"
};
//#endregion
//#region node_modules/naive-ui/es/_internal/scrollbar/styles/light.mjs
function Vp(e) {
	let { scrollbarColor: t, scrollbarColorHover: n, scrollbarHeight: r, scrollbarWidth: i, scrollbarBorderRadius: a } = e;
	return {
		...Bp,
		height: r,
		width: i,
		borderRadius: a,
		color: t,
		colorHover: n
	};
}
var Hp = {
	name: "Scrollbar",
	common: zp,
	self: Vp
}, Up = {
	name: "Scrollbar",
	common: Q,
	self: Vp
}, Wp = {
	iconSizeTiny: "28px",
	iconSizeSmall: "34px",
	iconSizeMedium: "40px",
	iconSizeLarge: "46px",
	iconSizeHuge: "52px"
};
//#endregion
//#region node_modules/naive-ui/es/empty/styles/light.mjs
function Gp(e) {
	let { textColorDisabled: t, iconColor: n, textColor2: r, fontSizeTiny: i, fontSizeSmall: a, fontSizeMedium: o, fontSizeLarge: s, fontSizeHuge: c } = e;
	return {
		...Wp,
		fontSizeTiny: i,
		fontSizeSmall: a,
		fontSizeMedium: o,
		fontSizeLarge: s,
		fontSizeHuge: c,
		textColor: t,
		iconColor: n,
		extraTextColor: r
	};
}
var Kp = {
	name: "Empty",
	common: zp,
	self: Gp
}, qp = {
	name: "Empty",
	common: Q,
	self: Gp
};
//#endregion
//#region node_modules/naive-ui/es/_mixins/use-css-vars-class.mjs
function Jp(e, t, n, r) {
	n || Df("useThemeClass", "cssVarsRef is not passed");
	let i = Jn(Af, null), a = i?.mergedThemeHashRef, o = i?.styleMountTarget, s = /* @__PURE__ */ F(""), c = Hf(), l, u = `__${e}`, d = () => {
		let e = u, i = t ? t.value : void 0, d = a?.value;
		d && (e += `-${d}`), i && (e += `-${i}`);
		let { themeOverrides: f, builtinThemeOverrides: p } = r;
		f && (e += `-${fs(JSON.stringify(f))}`), p && (e += `-${fs(JSON.stringify(p))}`), s.value = e, l = () => {
			let t = n.value, r = "";
			for (let e in t) r += `${e}: ${t[e]};`;
			V(`.${e}`, r).mount({
				id: e,
				ssr: c,
				parent: o
			}), l = void 0;
		};
	};
	return Zn(() => {
		d();
	}), {
		themeClass: s,
		onRender: () => {
			l?.();
		}
	};
}
//#endregion
//#region node_modules/naive-ui/es/_mixins/use-theme.mjs
function Yp(e) {
	return e;
}
function Xp(e, t, n, r, i, a) {
	let o = Hf(), s = Jn(Af, null);
	if (n) {
		let e = () => {
			let e = a?.value;
			n.mount({
				id: e === void 0 ? t : e + t,
				head: !0,
				props: { bPrefix: e ? `.${e}-` : void 0 },
				anchorMetaName: Mf,
				ssr: o,
				parent: s?.styleMountTarget
			}), s?.preflightStyleDisabled || Lf.mount({
				id: "n-global",
				head: !0,
				anchorMetaName: Mf,
				ssr: o,
				parent: s?.styleMountTarget
			});
		};
		o ? e() : Ar(e);
	}
	return z(() => {
		let { theme: { common: t, self: n, peers: a = {} } = {}, themeOverrides: o = {}, builtinThemeOverrides: c = {} } = i, { common: l, peers: u } = o, { common: d = void 0, [e]: { common: f = void 0, self: p = void 0, peers: m = {} } = {} } = s?.mergedThemeRef.value || {}, { common: h = void 0, [e]: g = {} } = s?.mergedThemeOverridesRef.value || {}, { common: _, peers: v = {} } = g, y = Tf({}, t || f || d || r.common, h, _, l);
		return {
			common: y,
			self: Tf((n || p || r.self)?.(y), c, g, o),
			peers: Tf({}, r.peers, m, a),
			peerOverrides: Tf({}, c.peers, v, u)
		};
	});
}
Xp.props = {
	theme: Object,
	themeOverrides: Object,
	builtinThemeOverrides: Object
};
//#endregion
//#region node_modules/naive-ui/es/_internal/icon/src/styles/index.cssr.mjs
var Zp = H("base-icon", "\n height: 1em;\n width: 1em;\n line-height: 1em;\n text-align: center;\n display: inline-block;\n position: relative;\n fill: currentColor;\n", [V("svg", "\n height: 1em;\n width: 1em;\n ")]), Qp = [
	"onClick",
	"onMousedown",
	"onMouseup",
	"role",
	"aria-label",
	"aria-hidden",
	"aria-disabled"
], $p = /* @__PURE__ */ I({
	name: "BaseIcon",
	props: {
		role: String,
		ariaLabel: String,
		ariaDisabled: {
			type: Boolean,
			default: void 0
		},
		ariaHidden: {
			type: Boolean,
			default: void 0
		},
		clsPrefix: {
			type: String,
			required: !0
		},
		onClick: Function,
		onMousedown: Function,
		onMouseup: Function
	},
	setup(e) {
		Uf("-base-icon", Zp, /* @__PURE__ */ fn(e, "clsPrefix"));
	},
	render() {
		return L(), R("i", {
			class: q(`${this.clsPrefix}-base-icon`),
			onClick: this.onClick,
			onMousedown: this.onMousedown,
			onMouseup: this.onMouseup,
			role: this.role,
			"aria-label": this.ariaLabel,
			"aria-hidden": this.ariaHidden,
			"aria-disabled": this.ariaDisabled
		}, [K(() => this.$slots.default?.())], 42, Qp);
	}
}), em = {
	height: "calc(var(--n-option-height) * 7.6)",
	paddingTiny: "4px 0",
	paddingSmall: "4px 0",
	paddingMedium: "4px 0",
	paddingLarge: "4px 0",
	paddingHuge: "4px 0",
	optionPaddingTiny: "0 12px",
	optionPaddingSmall: "0 12px",
	optionPaddingMedium: "0 12px",
	optionPaddingLarge: "0 12px",
	optionPaddingHuge: "0 12px",
	loadingSize: "18px"
};
//#endregion
//#region node_modules/naive-ui/es/_internal/select-menu/styles/light.mjs
function tm(e) {
	let { borderRadius: t, popoverColor: n, textColor3: r, dividerColor: i, textColor2: a, primaryColorPressed: o, textColorDisabled: s, primaryColor: c, opacityDisabled: l, hoverColor: u, fontSizeTiny: d, fontSizeSmall: f, fontSizeMedium: p, fontSizeLarge: m, fontSizeHuge: h, heightTiny: g, heightSmall: _, heightMedium: v, heightLarge: y, heightHuge: b } = e;
	return {
		...em,
		optionFontSizeTiny: d,
		optionFontSizeSmall: f,
		optionFontSizeMedium: p,
		optionFontSizeLarge: m,
		optionFontSizeHuge: h,
		optionHeightTiny: g,
		optionHeightSmall: _,
		optionHeightMedium: v,
		optionHeightLarge: y,
		optionHeightHuge: b,
		borderRadius: t,
		color: n,
		groupHeaderTextColor: r,
		actionDividerColor: i,
		optionTextColor: a,
		optionTextColorPressed: o,
		optionTextColorDisabled: s,
		optionTextColorActive: c,
		optionOpacityDisabled: l,
		optionCheckColor: c,
		optionColorPending: u,
		optionColorActive: "rgba(0, 0, 0, 0)",
		optionColorActivePending: u,
		actionTextColor: a,
		loadingColor: c
	};
}
var nm = {
	name: "InternalSelectMenu",
	common: Q,
	peers: {
		Scrollbar: Up,
		Empty: qp
	},
	self: tm
}, rm = {
	space: "6px",
	spaceArrow: "10px",
	arrowOffset: "10px",
	arrowOffsetVertical: "10px",
	arrowHeight: "6px",
	padding: "8px 14px"
};
//#endregion
//#region node_modules/naive-ui/es/popover/styles/light.mjs
function im(e) {
	let { boxShadow2: t, popoverColor: n, textColor2: r, borderRadius: i, fontSize: a, dividerColor: o } = e;
	return {
		...rm,
		fontSize: a,
		borderRadius: i,
		color: n,
		dividerColor: o,
		textColor: r,
		boxShadow: t
	};
}
var am = {
	name: "Popover",
	common: Q,
	peers: { Scrollbar: Up },
	self: im
};
//#endregion
//#region node_modules/evtd/es/utils.js
function om(e) {
	return e.composedPath()[0];
}
//#endregion
//#region node_modules/evtd/es/traps.js
var sm = {
	mousemoveoutside: /* @__PURE__ */ new WeakMap(),
	clickoutside: /* @__PURE__ */ new WeakMap()
};
function cm(e, t, n) {
	if (e === "mousemoveoutside") {
		let e = (e) => {
			t.contains(om(e)) || n(e);
		};
		return {
			mousemove: e,
			touchstart: e
		};
	}
	if (e === "clickoutside") {
		let e = !1, r = (n) => {
			e = !t.contains(om(n));
		}, i = (r) => {
			e && (t.contains(om(r)) || n(r));
		};
		return {
			mousedown: r,
			mouseup: i,
			touchstart: r,
			touchend: i
		};
	}
	return console.error(`[evtd/create-trap-handler]: name \`${e}\` is invalid. This could be a bug of evtd.`), {};
}
function lm(e, t, n) {
	let r = sm[e], i = r.get(t);
	i === void 0 && r.set(t, i = /* @__PURE__ */ new WeakMap());
	let a = i.get(n);
	return a === void 0 && i.set(n, a = cm(e, t, n)), a;
}
function um(e, t, n, r) {
	if (e === "mousemoveoutside" || e === "clickoutside") {
		let i = lm(e, t, n);
		return Object.keys(i).forEach((e) => {
			pm(e, document, i[e], r);
		}), !0;
	}
	return !1;
}
function dm(e, t, n, r) {
	if (e === "mousemoveoutside" || e === "clickoutside") {
		let i = lm(e, t, n);
		return Object.keys(i).forEach((e) => {
			mm(e, document, i[e], r);
		}), !0;
	}
	return !1;
}
//#endregion
//#region node_modules/evtd/es/delegate.js
function fm() {
	if (typeof window > "u") return {
		on: () => {},
		off: () => {}
	};
	let e = /* @__PURE__ */ new WeakMap(), t = /* @__PURE__ */ new WeakMap();
	function n() {
		e.set(this, !0);
	}
	function r() {
		e.set(this, !0), t.set(this, !0);
	}
	function i(e, t, n) {
		let r = e[t];
		return e[t] = function() {
			return n.apply(e, arguments), r.apply(e, arguments);
		}, e;
	}
	function a(e, t) {
		e[t] = Event.prototype[t];
	}
	let o = /* @__PURE__ */ new WeakMap(), s = Object.getOwnPropertyDescriptor(Event.prototype, "currentTarget");
	function c() {
		return o.get(this) ?? null;
	}
	function l(e, t) {
		s !== void 0 && Object.defineProperty(e, "currentTarget", {
			configurable: !0,
			enumerable: !0,
			get: t ?? s.get
		});
	}
	let u = {
		bubble: {},
		capture: {}
	}, d = {};
	function f() {
		let s = function(s) {
			let { type: d, eventPhase: f, bubbles: p } = s, m = om(s);
			if (f === 2) return;
			let h = f === 1 ? "capture" : "bubble", g = m, _ = [];
			for (; g === null && (g = window), _.push(g), g !== window;) g = g.parentNode || null;
			let v = u.capture[d], y = u.bubble[d];
			if (i(s, "stopPropagation", n), i(s, "stopImmediatePropagation", r), l(s, c), h === "capture") {
				if (v === void 0) return;
				for (let n = _.length - 1; n >= 0 && !e.has(s); --n) {
					let e = _[n], r = v.get(e);
					if (r !== void 0) {
						o.set(s, e);
						for (let e of r) {
							if (t.has(s)) break;
							e(s);
						}
					}
					if (n === 0 && !p && y !== void 0) {
						let n = y.get(e);
						if (n !== void 0) for (let e of n) {
							if (t.has(s)) break;
							e(s);
						}
					}
				}
			} else if (h === "bubble") {
				if (y === void 0) return;
				for (let n = 0; n < _.length && !e.has(s); ++n) {
					let e = _[n], r = y.get(e);
					if (r !== void 0) {
						o.set(s, e);
						for (let e of r) {
							if (t.has(s)) break;
							e(s);
						}
					}
				}
			}
			a(s, "stopPropagation"), a(s, "stopImmediatePropagation"), l(s);
		};
		return s.displayName = "evtdUnifiedHandler", s;
	}
	function p() {
		let e = function(e) {
			let { type: t, eventPhase: n } = e;
			if (n !== 2) return;
			let r = d[t];
			r !== void 0 && r.forEach((t) => t(e));
		};
		return e.displayName = "evtdUnifiedWindowEventHandler", e;
	}
	let m = f(), h = p();
	function g(e, t) {
		let n = u[e];
		return n[t] === void 0 && (n[t] = /* @__PURE__ */ new Map(), window.addEventListener(t, m, e === "capture")), n[t];
	}
	function _(e) {
		return d[e] === void 0 && (d[e] = /* @__PURE__ */ new Set(), window.addEventListener(e, h)), d[e];
	}
	function v(e, t) {
		let n = e.get(t);
		return n === void 0 && e.set(t, n = /* @__PURE__ */ new Set()), n;
	}
	function y(e, t, n, r) {
		let i = u[t][n];
		if (i !== void 0) {
			let t = i.get(e);
			if (t !== void 0 && t.has(r)) return !0;
		}
		return !1;
	}
	function b(e, t) {
		let n = d[e];
		return !!(n !== void 0 && n.has(t));
	}
	function x(e, t, n, r) {
		let i;
		if (i = typeof r == "object" && r.once === !0 ? (a) => {
			S(e, t, i, r), n(a);
		} : n, um(e, t, i, r)) return;
		let a = v(g(r === !0 || typeof r == "object" && r.capture === !0 ? "capture" : "bubble", e), t);
		if (a.has(i) || a.add(i), t === window) {
			let t = _(e);
			t.has(i) || t.add(i);
		}
	}
	function S(e, t, n, r) {
		if (dm(e, t, n, r)) return;
		let i = r === !0 || typeof r == "object" && r.capture === !0, a = i ? "capture" : "bubble", o = g(a, e), s = v(o, t);
		if (t === window && !y(t, i ? "bubble" : "capture", e, n) && b(e, n)) {
			let t = d[e];
			t.delete(n), t.size === 0 && (window.removeEventListener(e, h), d[e] = void 0);
		}
		s.has(n) && s.delete(n), s.size === 0 && o.delete(t), o.size === 0 && (window.removeEventListener(e, m, a === "capture"), u[a][e] = void 0);
	}
	return {
		on: x,
		off: S
	};
}
var { on: pm, off: mm } = fm();
//#endregion
//#region node_modules/vooks/es/use-memo.js
function hm(e) {
	let t = z(e), n = /* @__PURE__ */ F(t.value);
	return Qn(t, (e) => {
		n.value = e;
	}), typeof e == "function" ? n : {
		__v_isRef: !0,
		get value() {
			return n.value;
		},
		set value(t) {
			e.set(t);
		}
	};
}
//#endregion
//#region node_modules/vooks/es/life-cycle/use-is-mounted.js
function gm() {
	let e = /* @__PURE__ */ F(!1);
	return jr(() => {
		e.value = !0;
	}), /* @__PURE__ */ qt(e);
}
//#endregion
//#region node_modules/vooks/es/use-is-ios.js
var _m = (typeof window > "u" ? !1 : /iPad|iPhone|iPod/.test(navigator.platform) || navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) && !window.MSStream;
function vm() {
	return _m;
}
//#endregion
//#region node_modules/naive-ui/es/_utils/vue/call.mjs
function ym(e, ...t) {
	if (Array.isArray(e)) e.forEach((e) => ym(e, ...t));
	else return e(...t);
}
//#endregion
//#region node_modules/naive-ui/es/_utils/vue/resolve-slot.mjs
function bm(e) {
	return e.some((e) => !Wi(e) || !(e.type === Fi || e.type === Ni && !bm(e.children))) ? e : null;
}
function xm(e, t) {
	return t(e && bm(e()) || null);
}
function Sm(e) {
	return !(e && bm(e()));
}
//#endregion
//#region node_modules/naive-ui/es/_mixins/use-rtl.mjs
function Cm(e, t, n) {
	if (!t) return;
	let r = Hf(), i = z(() => {
		let { value: n } = t;
		if (!n) return;
		let r = n[e];
		if (r) return r;
	}), a = Jn(Af, null), o = () => {
		Zn(() => {
			let { value: t } = n, o = `${t}${e}Rtl`;
			if (Ss(o, r)) return;
			let { value: s } = i;
			s && s.style.mount({
				id: o,
				head: !0,
				anchorMetaName: Mf,
				props: { bPrefix: t ? `.${t}-` : void 0 },
				ssr: r,
				parent: a?.styleMountTarget
			});
		});
	};
	return r ? o() : Ar(o), i;
}
//#endregion
//#region node_modules/naive-ui/es/_utils/composable/use-reactivated.mjs
function wm(e) {
	let t = { isDeactivated: !1 }, n = !1;
	return wr(() => {
		if (t.isDeactivated = !1, !n) {
			n = !0;
			return;
		}
		e();
	}), Tr(() => {
		t.isDeactivated = !0, n ||= !0;
	}), t;
}
//#endregion
//#region node_modules/naive-ui/es/_utils/css/rtl-inset.mjs
function Tm(e) {
	let { left: t, right: n, top: r, bottom: i } = Zf(e);
	return `${r} ${t} ${i} ${n}`;
}
//#endregion
//#region node_modules/naive-ui/es/_utils/vue/wrapper.mjs
var Em = /* @__PURE__ */ I({ render() {
	return this.$slots.default?.();
} }), { cubicBezierEaseInOut: Dm } = Nf;
function Om({ name: e = "fade-in", enterDuration: t = "0.2s", leaveDuration: n = "0.2s", enterCubicBezier: r = Dm, leaveCubicBezier: i = Dm } = {}) {
	return [
		V(`&.${e}-transition-enter-active`, { transition: `all ${t} ${r}!important` }),
		V(`&.${e}-transition-leave-active`, { transition: `all ${n} ${i}!important` }),
		V(`&.${e}-transition-enter-from, &.${e}-transition-leave-to`, { opacity: 0 }),
		V(`&.${e}-transition-leave-from, &.${e}-transition-enter-to`, { opacity: 1 })
	];
}
//#endregion
//#region node_modules/naive-ui/es/_internal/scrollbar/src/styles/index.cssr.mjs
var km = H("scrollbar", "\n overflow: hidden;\n position: relative;\n z-index: auto;\n height: 100%;\n width: 100%;\n", [V(">", [H("scrollbar-container", "\n width: 100%;\n overflow: scroll;\n height: 100%;\n min-height: inherit;\n max-height: inherit;\n scrollbar-width: none;\n ", [V("&::-webkit-scrollbar, &::-webkit-scrollbar-track-piece, &::-webkit-scrollbar-thumb", "\n width: 0;\n height: 0;\n display: none;\n "), V(">", [H("scrollbar-content", "\n box-sizing: border-box;\n min-width: 100%;\n ")])])]), V(">, +", [H("scrollbar-rail", "\n position: absolute;\n pointer-events: none;\n user-select: none;\n background: var(--n-scrollbar-rail-color);\n -webkit-user-select: none;\n ", [
	W("horizontal", "\n height: var(--n-scrollbar-height);\n ", [V(">", [U("scrollbar", "\n height: var(--n-scrollbar-height);\n border-radius: var(--n-scrollbar-border-radius);\n right: 0;\n ")])]),
	W("horizontal--top", "\n top: var(--n-scrollbar-rail-top-horizontal-top); \n right: var(--n-scrollbar-rail-right-horizontal-top); \n bottom: var(--n-scrollbar-rail-bottom-horizontal-top); \n left: var(--n-scrollbar-rail-left-horizontal-top); \n "),
	W("horizontal--bottom", "\n top: var(--n-scrollbar-rail-top-horizontal-bottom); \n right: var(--n-scrollbar-rail-right-horizontal-bottom); \n bottom: var(--n-scrollbar-rail-bottom-horizontal-bottom); \n left: var(--n-scrollbar-rail-left-horizontal-bottom); \n "),
	W("vertical", "\n width: var(--n-scrollbar-width);\n ", [V(">", [U("scrollbar", "\n width: var(--n-scrollbar-width);\n border-radius: var(--n-scrollbar-border-radius);\n bottom: 0;\n ")])]),
	W("vertical--left", "\n top: var(--n-scrollbar-rail-top-vertical-left); \n right: var(--n-scrollbar-rail-right-vertical-left); \n bottom: var(--n-scrollbar-rail-bottom-vertical-left); \n left: var(--n-scrollbar-rail-left-vertical-left); \n "),
	W("vertical--right", "\n top: var(--n-scrollbar-rail-top-vertical-right); \n right: var(--n-scrollbar-rail-right-vertical-right); \n bottom: var(--n-scrollbar-rail-bottom-vertical-right); \n left: var(--n-scrollbar-rail-left-vertical-right); \n "),
	W("disabled", [V(">", [U("scrollbar", "pointer-events: none;")])]),
	V(">", [U("scrollbar", "\n z-index: 1;\n position: absolute;\n cursor: pointer;\n pointer-events: all;\n background-color: var(--n-scrollbar-color);\n transition: background-color .2s var(--n-scrollbar-bezier);\n ", [Om(), V("&:hover", "background-color: var(--n-scrollbar-color-hover);")])])
])])]);
//#endregion
//#region node_modules/vueuc/es/shared/warn.js
function Am(e, t) {
	console.error(`[vueuc/${e}]: ${t}`);
}
//#endregion
//#region node_modules/@juggle/resize-observer/lib/utils/resizeObservers.js
var jm = [], Mm = function() {
	return jm.some(function(e) {
		return e.activeTargets.length > 0;
	});
}, Nm = function() {
	return jm.some(function(e) {
		return e.skippedTargets.length > 0;
	});
}, Pm = "ResizeObserver loop completed with undelivered notifications.", Fm = function() {
	var e;
	typeof ErrorEvent == "function" ? e = new ErrorEvent("error", { message: Pm }) : (e = document.createEvent("Event"), e.initEvent("error", !1, !1), e.message = Pm), window.dispatchEvent(e);
}, Im;
(function(e) {
	e.BORDER_BOX = "border-box", e.CONTENT_BOX = "content-box", e.DEVICE_PIXEL_CONTENT_BOX = "device-pixel-content-box";
})(Im ||= {});
//#endregion
//#region node_modules/@juggle/resize-observer/lib/utils/freeze.js
var Lm = function(e) {
	return Object.freeze(e);
}, Rm = function() {
	function e(e, t) {
		this.inlineSize = e, this.blockSize = t, Lm(this);
	}
	return e;
}(), zm = function() {
	function e(e, t, n, r) {
		return this.x = e, this.y = t, this.width = n, this.height = r, this.top = this.y, this.left = this.x, this.bottom = this.top + this.height, this.right = this.left + this.width, Lm(this);
	}
	return e.prototype.toJSON = function() {
		var e = this;
		return {
			x: e.x,
			y: e.y,
			top: e.top,
			right: e.right,
			bottom: e.bottom,
			left: e.left,
			width: e.width,
			height: e.height
		};
	}, e.fromRect = function(t) {
		return new e(t.x, t.y, t.width, t.height);
	}, e;
}(), Bm = function(e) {
	return e instanceof SVGElement && "getBBox" in e;
}, Vm = function(e) {
	if (Bm(e)) {
		var t = e.getBBox(), n = t.width, r = t.height;
		return !n && !r;
	}
	var i = e, a = i.offsetWidth, o = i.offsetHeight;
	return !(a || o || e.getClientRects().length);
}, Hm = function(e) {
	if (e instanceof Element) return !0;
	var t = e?.ownerDocument?.defaultView;
	return !!(t && e instanceof t.Element);
}, Um = function(e) {
	switch (e.tagName) {
		case "INPUT": if (e.type !== "image") break;
		case "VIDEO":
		case "AUDIO":
		case "EMBED":
		case "OBJECT":
		case "CANVAS":
		case "IFRAME":
		case "IMG": return !0;
	}
	return !1;
}, Wm = typeof window < "u" ? window : {}, Gm = /* @__PURE__ */ new WeakMap(), Km = /auto|scroll/, qm = /^tb|vertical/, Jm = /msie|trident/i.test(Wm.navigator && Wm.navigator.userAgent), Ym = function(e) {
	return parseFloat(e || "0");
}, Xm = function(e, t, n) {
	return e === void 0 && (e = 0), t === void 0 && (t = 0), n === void 0 && (n = !1), new Rm((n ? t : e) || 0, (n ? e : t) || 0);
}, Zm = Lm({
	devicePixelContentBoxSize: Xm(),
	borderBoxSize: Xm(),
	contentBoxSize: Xm(),
	contentRect: new zm(0, 0, 0, 0)
}), Qm = function(e, t) {
	if (t === void 0 && (t = !1), Gm.has(e) && !t) return Gm.get(e);
	if (Vm(e)) return Gm.set(e, Zm), Zm;
	var n = getComputedStyle(e), r = Bm(e) && e.ownerSVGElement && e.getBBox(), i = !Jm && n.boxSizing === "border-box", a = qm.test(n.writingMode || ""), o = !r && Km.test(n.overflowY || ""), s = !r && Km.test(n.overflowX || ""), c = r ? 0 : Ym(n.paddingTop), l = r ? 0 : Ym(n.paddingRight), u = r ? 0 : Ym(n.paddingBottom), d = r ? 0 : Ym(n.paddingLeft), f = r ? 0 : Ym(n.borderTopWidth), p = r ? 0 : Ym(n.borderRightWidth), m = r ? 0 : Ym(n.borderBottomWidth), h = r ? 0 : Ym(n.borderLeftWidth), g = d + l, _ = c + u, v = h + p, y = f + m, b = s ? e.offsetHeight - y - e.clientHeight : 0, x = o ? e.offsetWidth - v - e.clientWidth : 0, S = i ? g + v : 0, C = i ? _ + y : 0, w = r ? r.width : Ym(n.width) - S - x, T = r ? r.height : Ym(n.height) - C - b, E = w + g + x + v, D = T + _ + b + y, O = Lm({
		devicePixelContentBoxSize: Xm(Math.round(w * devicePixelRatio), Math.round(T * devicePixelRatio), a),
		borderBoxSize: Xm(E, D, a),
		contentBoxSize: Xm(w, T, a),
		contentRect: new zm(d, c, w, T)
	});
	return Gm.set(e, O), O;
}, $m = function(e, t, n) {
	var r = Qm(e, n), i = r.borderBoxSize, a = r.contentBoxSize, o = r.devicePixelContentBoxSize;
	switch (t) {
		case Im.DEVICE_PIXEL_CONTENT_BOX: return o;
		case Im.BORDER_BOX: return i;
		default: return a;
	}
}, eh = function() {
	function e(e) {
		var t = Qm(e);
		this.target = e, this.contentRect = t.contentRect, this.borderBoxSize = Lm([t.borderBoxSize]), this.contentBoxSize = Lm([t.contentBoxSize]), this.devicePixelContentBoxSize = Lm([t.devicePixelContentBoxSize]);
	}
	return e;
}(), th = function(e) {
	if (Vm(e)) return Infinity;
	for (var t = 0, n = e.parentNode; n;) t += 1, n = n.parentNode;
	return t;
}, nh = function() {
	var e = Infinity, t = [];
	jm.forEach(function(n) {
		if (n.activeTargets.length !== 0) {
			var r = [];
			n.activeTargets.forEach(function(t) {
				var n = new eh(t.target), i = th(t.target);
				r.push(n), t.lastReportedSize = $m(t.target, t.observedBox), i < e && (e = i);
			}), t.push(function() {
				n.callback.call(n.observer, r, n.observer);
			}), n.activeTargets.splice(0, n.activeTargets.length);
		}
	});
	for (var n = 0, r = t; n < r.length; n++) {
		var i = r[n];
		i();
	}
	return e;
}, rh = function(e) {
	jm.forEach(function(t) {
		t.activeTargets.splice(0, t.activeTargets.length), t.skippedTargets.splice(0, t.skippedTargets.length), t.observationTargets.forEach(function(n) {
			n.isActive() && (th(n.target) > e ? t.activeTargets.push(n) : t.skippedTargets.push(n));
		});
	});
}, ih = function() {
	var e = 0;
	for (rh(e); Mm();) e = nh(), rh(e);
	return Nm() && Fm(), e > 0;
}, ah, oh = [], sh = function() {
	return oh.splice(0).forEach(function(e) {
		return e();
	});
}, ch = function(e) {
	if (!ah) {
		var t = 0, n = document.createTextNode("");
		new MutationObserver(function() {
			return sh();
		}).observe(n, { characterData: !0 }), ah = function() {
			n.textContent = `${t ? t-- : t++}`;
		};
	}
	oh.push(e), ah();
}, lh = function(e) {
	ch(function() {
		requestAnimationFrame(e);
	});
}, uh = 0, dh = function() {
	return !!uh;
}, fh = 250, ph = {
	attributes: !0,
	characterData: !0,
	childList: !0,
	subtree: !0
}, mh = [
	"resize",
	"load",
	"transitionend",
	"animationend",
	"animationstart",
	"animationiteration",
	"keyup",
	"keydown",
	"mouseup",
	"mousedown",
	"mouseover",
	"mouseout",
	"blur",
	"focus"
], hh = function(e) {
	return e === void 0 && (e = 0), Date.now() + e;
}, gh = !1, _h = new (function() {
	function e() {
		var e = this;
		this.stopped = !0, this.listener = function() {
			return e.schedule();
		};
	}
	return e.prototype.run = function(e) {
		var t = this;
		if (e === void 0 && (e = fh), !gh) {
			gh = !0;
			var n = hh(e);
			lh(function() {
				var r = !1;
				try {
					r = ih();
				} finally {
					if (gh = !1, e = n - hh(), !dh()) return;
					r ? t.run(1e3) : e > 0 ? t.run(e) : t.start();
				}
			});
		}
	}, e.prototype.schedule = function() {
		this.stop(), this.run();
	}, e.prototype.observe = function() {
		var e = this, t = function() {
			return e.observer && e.observer.observe(document.body, ph);
		};
		document.body ? t() : Wm.addEventListener("DOMContentLoaded", t);
	}, e.prototype.start = function() {
		var e = this;
		this.stopped && (this.stopped = !1, this.observer = new MutationObserver(this.listener), this.observe(), mh.forEach(function(t) {
			return Wm.addEventListener(t, e.listener, !0);
		}));
	}, e.prototype.stop = function() {
		var e = this;
		this.stopped ||= (this.observer && this.observer.disconnect(), mh.forEach(function(t) {
			return Wm.removeEventListener(t, e.listener, !0);
		}), !0);
	}, e;
}())(), vh = function(e) {
	!uh && e > 0 && _h.start(), uh += e, !uh && _h.stop();
}, yh = function(e) {
	return !Bm(e) && !Um(e) && getComputedStyle(e).display === "inline";
}, bh = function() {
	function e(e, t) {
		this.target = e, this.observedBox = t || Im.CONTENT_BOX, this.lastReportedSize = {
			inlineSize: 0,
			blockSize: 0
		};
	}
	return e.prototype.isActive = function() {
		var e = $m(this.target, this.observedBox, !0);
		return yh(this.target) && (this.lastReportedSize = e), this.lastReportedSize.inlineSize !== e.inlineSize || this.lastReportedSize.blockSize !== e.blockSize;
	}, e;
}(), xh = function() {
	function e(e, t) {
		this.activeTargets = [], this.skippedTargets = [], this.observationTargets = [], this.observer = e, this.callback = t;
	}
	return e;
}(), Sh = /* @__PURE__ */ new WeakMap(), Ch = function(e, t) {
	for (var n = 0; n < e.length; n += 1) if (e[n].target === t) return n;
	return -1;
}, wh = function() {
	function e() {}
	return e.connect = function(e, t) {
		var n = new xh(e, t);
		Sh.set(e, n);
	}, e.observe = function(e, t, n) {
		var r = Sh.get(e), i = r.observationTargets.length === 0;
		Ch(r.observationTargets, t) < 0 && (i && jm.push(r), r.observationTargets.push(new bh(t, n && n.box)), vh(1), _h.schedule());
	}, e.unobserve = function(e, t) {
		var n = Sh.get(e), r = Ch(n.observationTargets, t), i = n.observationTargets.length === 1;
		r >= 0 && (i && jm.splice(jm.indexOf(n), 1), n.observationTargets.splice(r, 1), vh(-1));
	}, e.disconnect = function(e) {
		var t = this, n = Sh.get(e);
		n.observationTargets.slice().forEach(function(n) {
			return t.unobserve(e, n.target);
		}), n.activeTargets.splice(0, n.activeTargets.length);
	}, e;
}(), Th = function() {
	function e(e) {
		if (arguments.length === 0) throw TypeError("Failed to construct 'ResizeObserver': 1 argument required, but only 0 present.");
		if (typeof e != "function") throw TypeError("Failed to construct 'ResizeObserver': The callback provided as parameter 1 is not a function.");
		wh.connect(this, e);
	}
	return e.prototype.observe = function(e, t) {
		if (arguments.length === 0) throw TypeError("Failed to execute 'observe' on 'ResizeObserver': 1 argument required, but only 0 present.");
		if (!Hm(e)) throw TypeError("Failed to execute 'observe' on 'ResizeObserver': parameter 1 is not of type 'Element");
		wh.observe(this, e, t);
	}, e.prototype.unobserve = function(e) {
		if (arguments.length === 0) throw TypeError("Failed to execute 'unobserve' on 'ResizeObserver': 1 argument required, but only 0 present.");
		if (!Hm(e)) throw TypeError("Failed to execute 'unobserve' on 'ResizeObserver': parameter 1 is not of type 'Element");
		wh.unobserve(this, e);
	}, e.prototype.disconnect = function() {
		wh.disconnect(this);
	}, e.toString = function() {
		return "function ResizeObserver () { [polyfill code] }";
	}, e;
}(), Eh = new class {
	constructor() {
		this.handleResize = this.handleResize.bind(this), this.observer = new (typeof window < "u" && window.ResizeObserver || Th)(this.handleResize), this.elHandlersMap = /* @__PURE__ */ new Map();
	}
	handleResize(e) {
		for (let t of e) {
			let e = this.elHandlersMap.get(t.target);
			e !== void 0 && e(t);
		}
	}
	registerHandler(e, t) {
		this.elHandlersMap.set(e, t), this.observer.observe(e);
	}
	unregisterHandler(e) {
		this.elHandlersMap.has(e) && (this.elHandlersMap.delete(e), this.observer.unobserve(e));
	}
}(), Dh = /* @__PURE__ */ I({
	name: "ResizeObserver",
	props: { onResize: Function },
	setup(e) {
		let t = !1, n = ua().proxy;
		function r(t) {
			let { onResize: n } = e;
			n !== void 0 && n(t);
		}
		jr(() => {
			let e = n.$el;
			if (e === void 0) {
				Am("resize-observer", "$el does not exist.");
				return;
			}
			if (e.nextElementSibling !== e.nextSibling && e.nodeType === 3 && e.nodeValue !== "") {
				Am("resize-observer", "$el can not be observed (it may be a text node).");
				return;
			}
			e.nextElementSibling !== null && (Eh.registerHandler(e.nextElementSibling, r), t = !0);
		}), Nr(() => {
			t && Eh.unregisterHandler(n.$el.nextElementSibling);
		});
	},
	render() {
		return Ir(this.$slots, "default");
	}
}), Oh = ["onMousedown"], kh = ["onScroll", "onWheel"], Ah = ["onMousedown"], jh = /* @__PURE__ */ I({
	name: "Scrollbar",
	props: {
		...Xp.props,
		duration: {
			type: Number,
			default: 0
		},
		scrollable: {
			type: Boolean,
			default: !0
		},
		xScrollable: Boolean,
		trigger: {
			type: String,
			default: "hover"
		},
		useUnifiedContainer: Boolean,
		triggerDisplayManually: Boolean,
		container: Function,
		content: Function,
		containerClass: String,
		containerStyle: [String, Object],
		contentClass: [String, Array],
		contentStyle: [String, Object],
		horizontalRailStyle: [String, Object],
		verticalRailStyle: [String, Object],
		onScroll: Function,
		onWheel: Function,
		onResize: Function,
		internalOnUpdateScrollLeft: Function,
		internalHoistYRail: Boolean,
		internalExposeWidthCssVar: Boolean,
		yPlacement: {
			type: String,
			default: "right"
		},
		xPlacement: {
			type: String,
			default: "bottom"
		}
	},
	inheritAttrs: !1,
	setup(e) {
		let { mergedClsPrefixRef: t, inlineThemeDisabled: n, mergedRtlRef: r } = jf(e), i = Cm("Scrollbar", r, t), a = /* @__PURE__ */ F(null), o = /* @__PURE__ */ F(null), s = /* @__PURE__ */ F(null), c = /* @__PURE__ */ F(null), l = /* @__PURE__ */ F(null), u = /* @__PURE__ */ F(null), d = /* @__PURE__ */ F(null), f = /* @__PURE__ */ F(null), p = /* @__PURE__ */ F(null), m = /* @__PURE__ */ F(null), h = /* @__PURE__ */ F(null), g = /* @__PURE__ */ F(0), _ = /* @__PURE__ */ F(0), v = /* @__PURE__ */ F(!1), y = /* @__PURE__ */ F(!1), b = !1, x = !1, S, C, w = 0, T = 0, E = 0, D = 0, O = vm(), k = Xp("Scrollbar", "-scrollbar", km, Hp, e, t), A = z(() => {
			let { value: e } = f, { value: t } = u, { value: n } = m;
			return e === null || t === null || n === null ? 0 : Math.min(e, n * e / t + Yf(k.value.self.width) * 1.5);
		}), ee = z(() => `${A.value}px`), j = z(() => {
			let { value: e } = p, { value: t } = d, { value: n } = h;
			return e === null || t === null || n === null ? 0 : n * e / t + Yf(k.value.self.height) * 1.5;
		}), te = z(() => `${j.value}px`), ne = z(() => {
			let { value: e } = f, { value: t } = g, { value: n } = u, { value: r } = m;
			if (e === null || n === null || r === null) return 0;
			{
				let i = n - e;
				return i ? t / i * (r - A.value) : 0;
			}
		}), re = z(() => `${ne.value}px`), ie = z(() => {
			let { value: e } = p, { value: t } = _, { value: n } = d, { value: r } = h;
			if (e === null || n === null || r === null) return 0;
			{
				let i = n - e;
				return i ? t / i * (r - j.value) : 0;
			}
		}), ae = z(() => `${ie.value}px`), oe = z(() => {
			let { value: e } = f, { value: t } = u;
			return e !== null && t !== null && t > e;
		}), se = z(() => {
			let { value: e } = p, { value: t } = d;
			return e !== null && t !== null && t > e;
		}), ce = z(() => {
			let { trigger: t } = e;
			return t === "none" || v.value;
		}), le = z(() => {
			let { trigger: t } = e;
			return t === "none" || y.value;
		}), ue = z(() => {
			let { container: t } = e;
			return t ? t() : o.value;
		}), de = z(() => {
			let { content: t } = e;
			return t ? t() : s.value;
		}), fe = (t, n) => {
			if (!e.scrollable) return;
			if (typeof t == "number") {
				_e(t, n ?? 0, 0, !1, "auto");
				return;
			}
			let { left: r, top: i, index: a, elSize: o, position: s, behavior: c, el: l, debounce: u = !0 } = t;
			(r !== void 0 || i !== void 0) && _e(r ?? 0, i ?? 0, 0, !1, c), l === void 0 ? a !== void 0 && o !== void 0 ? _e(0, a * o, o, u, c) : s === "bottom" ? _e(0, 2 ** 53 - 1, 0, !1, c) : s === "top" && _e(0, 0, 0, !1, c) : _e(0, l.offsetTop, l.offsetHeight, u, c);
		}, pe = wm(() => {
			e.container || fe({
				top: g.value,
				left: _.value
			});
		}), me = () => {
			pe.isDeactivated || Oe();
		}, he = (t) => {
			if (pe.isDeactivated) return;
			let { onResize: n } = e;
			n && n(t), Oe();
		}, ge = (t, n) => {
			if (!e.scrollable) return;
			let { value: r } = ue;
			r && (typeof t == "object" ? r.scrollBy(t) : r.scrollBy(t, n || 0));
		};
		function _e(e, t, n, r, i) {
			let { value: a } = ue;
			if (a) {
				if (r) {
					let { scrollTop: r, offsetHeight: o } = a;
					if (t > r) {
						t + n <= r + o || a.scrollTo({
							left: e,
							top: t + n - o,
							behavior: i
						});
						return;
					}
				}
				a.scrollTo({
					left: e,
					top: t,
					behavior: i
				});
			}
		}
		function ve() {
			Se(), Ce(), Oe();
		}
		function ye() {
			M();
		}
		function M() {
			be(), xe();
		}
		function be() {
			C !== void 0 && window.clearTimeout(C), C = window.setTimeout(() => {
				y.value = !1;
			}, e.duration);
		}
		function xe() {
			S !== void 0 && window.clearTimeout(S), S = window.setTimeout(() => {
				v.value = !1;
			}, e.duration);
		}
		function Se() {
			S !== void 0 && window.clearTimeout(S), v.value = !0;
		}
		function Ce() {
			C !== void 0 && window.clearTimeout(C), y.value = !0;
		}
		function we(t) {
			let { onScroll: n } = e;
			n && n(t), Te();
		}
		function Te() {
			let { value: e } = ue;
			e && (g.value = e.scrollTop, _.value = e.scrollLeft * (i?.value ? -1 : 1));
		}
		function Ee() {
			let { value: e } = de;
			e && (u.value = e.offsetHeight, d.value = e.offsetWidth);
			let { value: t } = ue;
			t && (f.value = t.offsetHeight, p.value = t.offsetWidth);
			let { value: n } = l, { value: r } = c;
			n && (h.value = n.offsetWidth), r && (m.value = r.offsetHeight);
		}
		function De() {
			let { value: e } = ue;
			e && (g.value = e.scrollTop, _.value = e.scrollLeft * (i?.value ? -1 : 1), f.value = e.offsetHeight, p.value = e.offsetWidth, u.value = e.scrollHeight, d.value = e.scrollWidth);
			let { value: t } = l, { value: n } = c;
			t && (h.value = t.offsetWidth), n && (m.value = n.offsetHeight);
		}
		function Oe() {
			e.scrollable && (e.useUnifiedContainer ? De() : (Ee(), Te()));
		}
		function ke(e) {
			return !a.value?.contains(Jf(e));
		}
		function Ae(e) {
			e.preventDefault(), e.stopPropagation(), x = !0, pm("mousemove", window, je, !0), pm("mouseup", window, Me, !0), T = _.value, E = i?.value ? window.innerWidth - e.clientX : e.clientX;
		}
		function je(t) {
			if (!x) return;
			S !== void 0 && window.clearTimeout(S), C !== void 0 && window.clearTimeout(C);
			let { value: n } = p, { value: r } = d, { value: a } = j;
			if (n === null || r === null) return;
			let o = (i?.value ? window.innerWidth - t.clientX - E : t.clientX - E) * (r - n) / (n - a), s = r - n, c = T + o;
			c = Math.min(s, c), c = Math.max(c, 0);
			let { value: l } = ue;
			if (l) {
				l.scrollLeft = c * (i?.value ? -1 : 1);
				let { internalOnUpdateScrollLeft: t } = e;
				t && t(c);
			}
		}
		function Me(e) {
			e.preventDefault(), e.stopPropagation(), mm("mousemove", window, je, !0), mm("mouseup", window, Me, !0), x = !1, Oe(), ke(e) && M();
		}
		function Ne(e) {
			e.preventDefault(), e.stopPropagation(), b = !0, pm("mousemove", window, Pe, !0), pm("mouseup", window, Fe, !0), w = g.value, D = e.clientY;
		}
		function Pe(e) {
			if (!b) return;
			S !== void 0 && window.clearTimeout(S), C !== void 0 && window.clearTimeout(C);
			let { value: t } = f, { value: n } = u, { value: r } = A;
			if (t === null || n === null) return;
			let i = (e.clientY - D) * (n - t) / (t - r), a = n - t, o = w + i;
			o = Math.min(a, o), o = Math.max(o, 0);
			let { value: s } = ue;
			s && (s.scrollTop = o);
		}
		function Fe(e) {
			e.preventDefault(), e.stopPropagation(), mm("mousemove", window, Pe, !0), mm("mouseup", window, Fe, !0), b = !1, Oe(), ke(e) && M();
		}
		Zn(() => {
			let { value: e } = se, { value: n } = oe, { value: r } = t, { value: i } = l, { value: a } = c;
			i && (e ? i.classList.remove(`${r}-scrollbar-rail--disabled`) : i.classList.add(`${r}-scrollbar-rail--disabled`)), a && (n ? a.classList.remove(`${r}-scrollbar-rail--disabled`) : a.classList.add(`${r}-scrollbar-rail--disabled`));
		}), jr(() => {
			e.container || Oe();
		}), Nr(() => {
			S !== void 0 && window.clearTimeout(S), C !== void 0 && window.clearTimeout(C), mm("mousemove", window, Pe, !0), mm("mouseup", window, Fe, !0);
		});
		let N = z(() => {
			let { common: { cubicBezierEaseInOut: e }, self: { color: t, colorHover: n, height: r, width: a, borderRadius: o, railInsetHorizontalTop: s, railInsetHorizontalBottom: c, railInsetVerticalRight: l, railInsetVerticalLeft: u, railColor: d } } = k.value, { top: f, right: p, bottom: m, left: h } = Zf(s), { top: g, right: _, bottom: v, left: y } = Zf(c), { top: b, right: x, bottom: S, left: C } = Zf(i?.value ? Tm(l) : l), { top: w, right: T, bottom: E, left: D } = Zf(i?.value ? Tm(u) : u);
			return {
				"--n-scrollbar-bezier": e,
				"--n-scrollbar-color": t,
				"--n-scrollbar-color-hover": n,
				"--n-scrollbar-border-radius": o,
				"--n-scrollbar-width": a,
				"--n-scrollbar-height": r,
				"--n-scrollbar-rail-top-horizontal-top": f,
				"--n-scrollbar-rail-right-horizontal-top": p,
				"--n-scrollbar-rail-bottom-horizontal-top": m,
				"--n-scrollbar-rail-left-horizontal-top": h,
				"--n-scrollbar-rail-top-horizontal-bottom": g,
				"--n-scrollbar-rail-right-horizontal-bottom": _,
				"--n-scrollbar-rail-bottom-horizontal-bottom": v,
				"--n-scrollbar-rail-left-horizontal-bottom": y,
				"--n-scrollbar-rail-top-vertical-right": b,
				"--n-scrollbar-rail-right-vertical-right": x,
				"--n-scrollbar-rail-bottom-vertical-right": S,
				"--n-scrollbar-rail-left-vertical-right": C,
				"--n-scrollbar-rail-top-vertical-left": w,
				"--n-scrollbar-rail-right-vertical-left": T,
				"--n-scrollbar-rail-bottom-vertical-left": E,
				"--n-scrollbar-rail-left-vertical-left": D,
				"--n-scrollbar-rail-color": d
			};
		}), Ie = n ? Jp("scrollbar", void 0, N, e) : void 0;
		return {
			scrollTo: fe,
			scrollBy: ge,
			sync: Oe,
			syncUnifiedContainer: De,
			handleMouseEnterWrapper: ve,
			handleMouseLeaveWrapper: ye,
			mergedClsPrefix: t,
			rtlEnabled: i,
			containerScrollTop: g,
			wrapperRef: a,
			containerRef: o,
			contentRef: s,
			yRailRef: c,
			xRailRef: l,
			needYBar: oe,
			needXBar: se,
			yBarSizePx: ee,
			xBarSizePx: te,
			yBarTopPx: re,
			xBarLeftPx: ae,
			isShowXBar: ce,
			isShowYBar: le,
			isIos: O,
			handleScroll: we,
			handleContentResize: me,
			handleContainerResize: he,
			handleYScrollMouseDown: Ne,
			handleXScrollMouseDown: Ae,
			containerWidth: p,
			cssVars: n ? void 0 : N,
			themeClass: Ie?.themeClass,
			onRender: Ie?.onRender
		};
	},
	render() {
		let { $slots: e, mergedClsPrefix: t, triggerDisplayManually: n, rtlEnabled: r, internalHoistYRail: i, yPlacement: a, xPlacement: o, xScrollable: s } = this;
		if (!this.scrollable) return e.default?.();
		let c = this.trigger === "none", l = (e, n) => (L(), R("div", {
			ref: "yRailRef",
			class: q([
				`${t}-scrollbar-rail`,
				`${t}-scrollbar-rail--vertical`,
				`${t}-scrollbar-rail--vertical--${a}`,
				e
			]),
			"data-scrollbar-rail": !0,
			style: M([n || "", this.verticalRailStyle]),
			"aria-hidden": !0
		}, [K(() => B(c ? Em : za, c ? null : { name: "fade-in-transition" }, { default: () => this.needYBar && this.isShowYBar && !this.isIos ? (L(), R("div", {
			key: 1,
			class: q(`${t}-scrollbar-rail__scrollbar`),
			style: M({
				height: this.yBarSizePx,
				top: this.yBarTopPx
			}),
			onMousedown: this.handleYScrollMouseDown
		}, null, 46, Oh)) : null }))], 6)), u = () => (this.onRender?.(), B("div", ia(this.$attrs, {
			role: "none",
			ref: "wrapperRef",
			class: [
				`${t}-scrollbar`,
				this.themeClass,
				r && `${t}-scrollbar--rtl`
			],
			style: this.cssVars,
			onMouseenter: n ? void 0 : this.handleMouseEnterWrapper,
			onMouseleave: n ? void 0 : this.handleMouseLeaveWrapper
		}), [
			this.container ? e.default?.() : (L(), R("div", {
				key: 2,
				role: "none",
				ref: "containerRef",
				class: q([`${t}-scrollbar-container`, this.containerClass]),
				style: M([this.containerStyle, this.internalExposeWidthCssVar ? { "--n-scrollbar-current-width": Xf(this.containerWidth) } : void 0]),
				onScroll: this.handleScroll,
				onWheel: this.onWheel
			}, [(L(), Ui(Dh, { onResize: this.handleContentResize }, { default: () => (L(), R("div", {
				ref: "contentRef",
				role: "none",
				style: M([{ width: this.xScrollable ? "fit-content" : null }, this.contentStyle]),
				class: q([`${t}-scrollbar-content`, this.contentClass])
			}, [K(() => e.default?.())], 6)) }, 1032, ["onResize"]))], 46, kh)),
			i ? null : l(void 0, void 0),
			s && (L(), R("div", {
				ref: "xRailRef",
				class: q([
					`${t}-scrollbar-rail`,
					`${t}-scrollbar-rail--horizontal`,
					`${t}-scrollbar-rail--horizontal--${o}`
				]),
				style: M(this.horizontalRailStyle),
				"data-scrollbar-rail": !0,
				"aria-hidden": !0
			}, [K(() => B(c ? Em : za, c ? null : { name: "fade-in-transition" }, { default: () => this.needXBar && this.isShowXBar && !this.isIos ? (L(), R("div", {
				key: 3,
				class: q(`${t}-scrollbar-rail__scrollbar`),
				style: M({
					width: this.xBarSizePx,
					right: r ? this.xBarLeftPx : void 0,
					left: r ? void 0 : this.xBarLeftPx
				}),
				onMousedown: this.handleXScrollMouseDown
			}, null, 46, Ah)) : null }))], 6))
		])), d = this.container ? u() : (L(), Ui(Dh, {
			key: 4,
			onResize: this.handleContainerResize
		}, { default: u }, 1032, ["onResize"]));
		return i ? (L(), R(Ni, { key: 5 }, [K(() => d), K(() => l(this.themeClass, this.cssVars))], 64)) : d;
	}
}), Mh = {
	closeIconSizeTiny: "12px",
	closeIconSizeSmall: "12px",
	closeIconSizeMedium: "14px",
	closeIconSizeLarge: "14px",
	closeSizeTiny: "16px",
	closeSizeSmall: "16px",
	closeSizeMedium: "18px",
	closeSizeLarge: "18px",
	padding: "0 7px",
	closeMargin: "0 0 0 4px"
}, Nh = {
	name: "Tag",
	common: Q,
	self(e) {
		let { textColor2: t, primaryColorHover: n, primaryColorPressed: r, primaryColor: i, infoColor: a, successColor: o, warningColor: s, errorColor: c, baseColor: l, borderColor: u, tagColor: d, opacityDisabled: f, closeIconColor: p, closeIconColorHover: m, closeIconColorPressed: h, closeColorHover: g, closeColorPressed: _, borderRadiusSmall: v, fontSizeMini: y, fontSizeTiny: b, fontSizeSmall: x, fontSizeMedium: S, heightMini: C, heightTiny: w, heightSmall: T, heightMedium: E, buttonColor2Hover: D, buttonColor2Pressed: O, fontWeightStrong: k } = e;
		return {
			...Mh,
			closeBorderRadius: v,
			heightTiny: C,
			heightSmall: w,
			heightMedium: T,
			heightLarge: E,
			borderRadius: v,
			opacityDisabled: f,
			fontSizeTiny: y,
			fontSizeSmall: b,
			fontSizeMedium: x,
			fontSizeLarge: S,
			fontWeightStrong: k,
			textColorCheckable: t,
			textColorHoverCheckable: t,
			textColorPressedCheckable: t,
			textColorChecked: l,
			colorCheckable: "#0000",
			colorHoverCheckable: D,
			colorPressedCheckable: O,
			colorChecked: i,
			colorCheckedHover: n,
			colorCheckedPressed: r,
			border: `1px solid ${u}`,
			textColor: t,
			color: d,
			colorBordered: "#0000",
			closeIconColor: p,
			closeIconColorHover: m,
			closeIconColorPressed: h,
			closeColorHover: g,
			closeColorPressed: _,
			borderPrimary: `1px solid ${Y(i, { alpha: .3 })}`,
			textColorPrimary: i,
			colorPrimary: Y(i, { alpha: .16 }),
			colorBorderedPrimary: "#0000",
			closeIconColorPrimary: wp(i, { lightness: .7 }),
			closeIconColorHoverPrimary: wp(i, { lightness: .7 }),
			closeIconColorPressedPrimary: wp(i, { lightness: .7 }),
			closeColorHoverPrimary: Y(i, { alpha: .16 }),
			closeColorPressedPrimary: Y(i, { alpha: .12 }),
			borderInfo: `1px solid ${Y(a, { alpha: .3 })}`,
			textColorInfo: a,
			colorInfo: Y(a, { alpha: .16 }),
			colorBorderedInfo: "#0000",
			closeIconColorInfo: wp(a, { alpha: .7 }),
			closeIconColorHoverInfo: wp(a, { alpha: .7 }),
			closeIconColorPressedInfo: wp(a, { alpha: .7 }),
			closeColorHoverInfo: Y(a, { alpha: .16 }),
			closeColorPressedInfo: Y(a, { alpha: .12 }),
			borderSuccess: `1px solid ${Y(o, { alpha: .3 })}`,
			textColorSuccess: o,
			colorSuccess: Y(o, { alpha: .16 }),
			colorBorderedSuccess: "#0000",
			closeIconColorSuccess: wp(o, { alpha: .7 }),
			closeIconColorHoverSuccess: wp(o, { alpha: .7 }),
			closeIconColorPressedSuccess: wp(o, { alpha: .7 }),
			closeColorHoverSuccess: Y(o, { alpha: .16 }),
			closeColorPressedSuccess: Y(o, { alpha: .12 }),
			borderWarning: `1px solid ${Y(s, { alpha: .3 })}`,
			textColorWarning: s,
			colorWarning: Y(s, { alpha: .16 }),
			colorBorderedWarning: "#0000",
			closeIconColorWarning: wp(s, { alpha: .7 }),
			closeIconColorHoverWarning: wp(s, { alpha: .7 }),
			closeIconColorPressedWarning: wp(s, { alpha: .7 }),
			closeColorHoverWarning: Y(s, { alpha: .16 }),
			closeColorPressedWarning: Y(s, { alpha: .11 }),
			borderError: `1px solid ${Y(c, { alpha: .3 })}`,
			textColorError: c,
			colorError: Y(c, { alpha: .16 }),
			colorBorderedError: "#0000",
			closeIconColorError: wp(c, { alpha: .7 }),
			closeIconColorHoverError: wp(c, { alpha: .7 }),
			closeIconColorPressedError: wp(c, { alpha: .7 }),
			closeColorHoverError: Y(c, { alpha: .16 }),
			closeColorPressedError: Y(c, { alpha: .12 })
		};
	}
};
//#endregion
//#region node_modules/naive-ui/es/_utils/css/color-to-class.mjs
function Ph(e) {
	return e.replace(/#|\(|\)|,|\s|\./g, "_");
}
//#endregion
//#region node_modules/naive-ui/es/_internal/icons/replaceable.mjs
function Fh(e, t) {
	let n = /* @__PURE__ */ I({ render() {
		return t();
	} });
	return /* @__PURE__ */ I({
		name: $d(e),
		setup() {
			let t = Jn(Af, null)?.mergedIconsRef;
			return () => {
				let r = t?.value?.[e];
				return r ? r() : (L(), Ui(n, { key: 1 }));
			};
		}
	});
}
//#endregion
//#region node_modules/naive-ui/es/_internal/icons/Close.mjs
var Ih = Fh("close", () => (() => {
	let e = Gf("6b30a2290cd08d4");
	return e[0] ||= Ji("svg", {
		viewBox: "0 0 12 12",
		version: "1.1",
		xmlns: "http://www.w3.org/2000/svg",
		"aria-hidden": !0
	}, [Ji("g", {
		stroke: "none",
		"stroke-width": "1",
		fill: "none",
		"fill-rule": "evenodd"
	}, [Ji("g", {
		fill: "currentColor",
		"fill-rule": "nonzero"
	}, [Ji("path", { d: "M2.08859116,2.2156945 L2.14644661,2.14644661 C2.32001296,1.97288026 2.58943736,1.95359511 2.7843055,2.08859116 L2.85355339,2.14644661 L6,5.293 L9.14644661,2.14644661 C9.34170876,1.95118446 9.65829124,1.95118446 9.85355339,2.14644661 C10.0488155,2.34170876 10.0488155,2.65829124 9.85355339,2.85355339 L6.707,6 L9.85355339,9.14644661 C10.0271197,9.32001296 10.0464049,9.58943736 9.91140884,9.7843055 L9.85355339,9.85355339 C9.67998704,10.0271197 9.41056264,10.0464049 9.2156945,9.91140884 L9.14644661,9.85355339 L6,6.707 L2.85355339,9.85355339 C2.65829124,10.0488155 2.34170876,10.0488155 2.14644661,9.85355339 C1.95118446,9.65829124 1.95118446,9.34170876 2.14644661,9.14644661 L5.293,6 L2.14644661,2.85355339 C1.97288026,2.67998704 1.95359511,2.41056264 2.08859116,2.2156945 L2.14644661,2.14644661 L2.08859116,2.2156945 Z" })])])], -1);
})()), Lh = H("base-close", "\n display: flex;\n align-items: center;\n justify-content: center;\n cursor: pointer;\n background-color: transparent;\n color: var(--n-close-icon-color);\n border-radius: var(--n-close-border-radius);\n height: var(--n-close-size);\n width: var(--n-close-size);\n font-size: var(--n-close-icon-size);\n outline: none;\n border: none;\n position: relative;\n padding: 0;\n", [
	W("absolute", "\n height: var(--n-close-icon-size);\n width: var(--n-close-icon-size);\n "),
	V("&::before", "\n content: \"\";\n position: absolute;\n width: var(--n-close-size);\n height: var(--n-close-size);\n left: 50%;\n top: 50%;\n transform: translateY(-50%) translateX(-50%);\n transition: inherit;\n border-radius: inherit;\n "),
	ks("disabled", [
		V("&:hover", "\n color: var(--n-close-icon-color-hover);\n "),
		V("&:hover::before", "\n background-color: var(--n-close-color-hover);\n "),
		V("&:focus::before", "\n background-color: var(--n-close-color-hover);\n "),
		V("&:active", "\n color: var(--n-close-icon-color-pressed);\n "),
		V("&:active::before", "\n background-color: var(--n-close-color-pressed);\n ")
	]),
	W("disabled", "\n cursor: not-allowed;\n color: var(--n-close-icon-color-disabled);\n background-color: transparent;\n "),
	W("round", [V("&::before", "\n border-radius: 50%;\n ")])
]), Rh = /* @__PURE__ */ I({
	name: "BaseClose",
	props: {
		isButtonTag: {
			type: Boolean,
			default: !0
		},
		clsPrefix: {
			type: String,
			required: !0
		},
		disabled: {
			type: Boolean,
			default: void 0
		},
		focusable: {
			type: Boolean,
			default: !0
		},
		round: Boolean,
		onClick: Function,
		absolute: Boolean
	},
	setup(e) {
		return Uf("-base-close", Lh, /* @__PURE__ */ fn(e, "clsPrefix")), () => {
			let { clsPrefix: t, disabled: n, absolute: r, round: i, isButtonTag: a } = e, o = a ? "button" : "div";
			return (() => {
				let s = Gf("b5bdc9fe09f5ae00");
				return L(), Ui(o, {
					type: a ? "button" : void 0,
					tabindex: n || !e.focusable ? -1 : 0,
					"aria-disabled": n,
					"aria-label": "close",
					role: a ? void 0 : "button",
					disabled: n,
					class: q([
						`${t}-base-close`,
						r && `${t}-base-close--absolute`,
						n && `${t}-base-close--disabled`,
						i && `${t}-base-close--round`
					]),
					onMousedown: s[0] ||= (t) => {
						e.focusable || t.preventDefault();
					},
					onClick: e.onClick
				}, {
					default: Gn(() => [(L(), Ui($p, { clsPrefix: t }, { default: () => (L(), Ui(Ih)) }, 1032, ["clsPrefix"]))]),
					_: 2
				}, 1032, [
					"type",
					"tabindex",
					"aria-disabled",
					"role",
					"disabled",
					"class",
					"onClick"
				]);
			})();
		};
	}
}), zh = {
	paddingSingle: "0 26px 0 12px",
	paddingMultiple: "3px 26px 0 12px",
	clearSize: "16px",
	arrowSize: "16px"
}, Bh = {
	name: "InternalSelection",
	common: Q,
	peers: { Popover: am },
	self(e) {
		let { borderRadius: t, textColor2: n, textColorDisabled: r, inputColor: i, inputColorDisabled: a, primaryColor: o, primaryColorHover: s, warningColor: c, warningColorHover: l, errorColor: u, errorColorHover: d, iconColor: f, iconColorDisabled: p, clearColor: m, clearColorHover: h, clearColorPressed: g, placeholderColor: _, placeholderColorDisabled: v, fontSizeTiny: y, fontSizeSmall: b, fontSizeMedium: x, fontSizeLarge: S, heightTiny: C, heightSmall: w, heightMedium: T, heightLarge: E, fontWeight: D } = e;
		return {
			...zh,
			fontWeight: D,
			fontSizeTiny: y,
			fontSizeSmall: b,
			fontSizeMedium: x,
			fontSizeLarge: S,
			heightTiny: C,
			heightSmall: w,
			heightMedium: T,
			heightLarge: E,
			borderRadius: t,
			textColor: n,
			textColorDisabled: r,
			placeholderColor: _,
			placeholderColorDisabled: v,
			color: i,
			colorDisabled: a,
			colorActive: Y(o, { alpha: .1 }),
			border: "1px solid #0000",
			borderHover: `1px solid ${s}`,
			borderActive: `1px solid ${o}`,
			borderFocus: `1px solid ${s}`,
			boxShadowHover: "none",
			boxShadowActive: `0 0 8px 0 ${Y(o, { alpha: .4 })}`,
			boxShadowFocus: `0 0 8px 0 ${Y(o, { alpha: .4 })}`,
			caretColor: o,
			arrowColor: f,
			arrowColorDisabled: p,
			loadingColor: o,
			borderWarning: `1px solid ${c}`,
			borderHoverWarning: `1px solid ${l}`,
			borderActiveWarning: `1px solid ${c}`,
			borderFocusWarning: `1px solid ${l}`,
			boxShadowHoverWarning: "none",
			boxShadowActiveWarning: `0 0 8px 0 ${Y(c, { alpha: .4 })}`,
			boxShadowFocusWarning: `0 0 8px 0 ${Y(c, { alpha: .4 })}`,
			colorActiveWarning: Y(c, { alpha: .1 }),
			caretColorWarning: c,
			borderError: `1px solid ${u}`,
			borderHoverError: `1px solid ${d}`,
			borderActiveError: `1px solid ${u}`,
			borderFocusError: `1px solid ${d}`,
			boxShadowHoverError: "none",
			boxShadowActiveError: `0 0 8px 0 ${Y(u, { alpha: .4 })}`,
			boxShadowFocusError: `0 0 8px 0 ${Y(u, { alpha: .4 })}`,
			colorActiveError: Y(u, { alpha: .1 }),
			caretColorError: u,
			clearColor: m,
			clearColorHover: h,
			clearColorPressed: g
		};
	}
}, Vh = {
	iconMargin: "11px 8px 0 12px",
	iconMarginRtl: "11px 12px 0 8px",
	iconSize: "24px",
	closeIconSize: "16px",
	closeSize: "20px",
	closeMargin: "13px 14px 0 0",
	closeMarginRtl: "13px 0 0 14px",
	padding: "13px"
}, Hh = {
	name: "Alert",
	common: Q,
	self(e) {
		let { lineHeight: t, borderRadius: n, fontWeightStrong: r, dividerColor: i, inputColor: a, textColor1: o, textColor2: s, closeColorHover: c, closeColorPressed: l, closeIconColor: u, closeIconColorHover: d, closeIconColorPressed: f, infoColorSuppl: p, successColorSuppl: m, warningColorSuppl: h, errorColorSuppl: g, fontSize: _ } = e;
		return {
			...Vh,
			fontSize: _,
			lineHeight: t,
			titleFontWeight: r,
			borderRadius: n,
			border: `1px solid ${i}`,
			color: a,
			titleTextColor: o,
			iconColor: s,
			contentTextColor: s,
			closeBorderRadius: n,
			closeColorHover: c,
			closeColorPressed: l,
			closeIconColor: u,
			closeIconColorHover: d,
			closeIconColorPressed: f,
			borderInfo: `1px solid ${Y(p, { alpha: .35 })}`,
			colorInfo: Y(p, { alpha: .25 }),
			titleTextColorInfo: o,
			iconColorInfo: p,
			contentTextColorInfo: s,
			closeColorHoverInfo: c,
			closeColorPressedInfo: l,
			closeIconColorInfo: u,
			closeIconColorHoverInfo: d,
			closeIconColorPressedInfo: f,
			borderSuccess: `1px solid ${Y(m, { alpha: .35 })}`,
			colorSuccess: Y(m, { alpha: .25 }),
			titleTextColorSuccess: o,
			iconColorSuccess: m,
			contentTextColorSuccess: s,
			closeColorHoverSuccess: c,
			closeColorPressedSuccess: l,
			closeIconColorSuccess: u,
			closeIconColorHoverSuccess: d,
			closeIconColorPressedSuccess: f,
			borderWarning: `1px solid ${Y(h, { alpha: .35 })}`,
			colorWarning: Y(h, { alpha: .25 }),
			titleTextColorWarning: o,
			iconColorWarning: h,
			contentTextColorWarning: s,
			closeColorHoverWarning: c,
			closeColorPressedWarning: l,
			closeIconColorWarning: u,
			closeIconColorHoverWarning: d,
			closeIconColorPressedWarning: f,
			borderError: `1px solid ${Y(g, { alpha: .35 })}`,
			colorError: Y(g, { alpha: .25 }),
			titleTextColorError: o,
			iconColorError: g,
			contentTextColorError: s,
			closeColorHoverError: c,
			closeColorPressedError: l,
			closeIconColorError: u,
			closeIconColorHoverError: d,
			closeIconColorPressedError: f
		};
	}
}, Uh = /* @__PURE__ */ I({
	name: "FadeInExpandTransition",
	props: {
		appear: Boolean,
		group: Boolean,
		mode: String,
		onLeave: Function,
		onAfterLeave: Function,
		onAfterEnter: Function,
		width: Boolean,
		reverse: Boolean
	},
	setup(e, { slots: t }) {
		function n(t) {
			e.width ? t.style.maxWidth = `${t.offsetWidth}px` : t.style.maxHeight = `${t.offsetHeight}px`, t.offsetWidth;
		}
		function r(t) {
			e.width ? t.style.maxWidth = "0" : t.style.maxHeight = "0", t.offsetWidth;
			let { onLeave: n } = e;
			n && n();
		}
		function i(t) {
			e.width ? t.style.maxWidth = "" : t.style.maxHeight = "";
			let { onAfterLeave: n } = e;
			n && n();
		}
		function a(t) {
			if (t.style.transition = "none", e.width) {
				let e = t.offsetWidth;
				t.style.maxWidth = "0", t.offsetWidth, t.style.transition = "", t.style.maxWidth = `${e}px`;
			} else if (e.reverse) t.style.maxHeight = `${t.offsetHeight}px`, t.offsetHeight, t.style.transition = "", t.style.maxHeight = "0";
			else {
				let e = t.offsetHeight;
				t.style.maxHeight = "0", t.offsetWidth, t.style.transition = "", t.style.maxHeight = `${e}px`;
			}
			t.offsetWidth;
		}
		function o(t) {
			e.width ? t.style.maxWidth = "" : e.reverse || (t.style.maxHeight = ""), e.onAfterEnter?.();
		}
		return () => {
			let { group: s, width: c, appear: l, mode: u } = e, d = s ? Fo : za, f = {
				name: c ? "fade-in-width-expand-transition" : "fade-in-height-expand-transition",
				appear: l,
				onEnter: a,
				onAfterEnter: o,
				onBeforeLeave: n,
				onLeave: r,
				onAfterLeave: i
			};
			return s || (f.mode = u), B(d, f, t);
		};
	}
}), Wh = {
	linkFontSize: "13px",
	linkPadding: "0 0 0 16px",
	railWidth: "4px"
};
//#endregion
//#region node_modules/naive-ui/es/anchor/styles/light.mjs
function Gh(e) {
	let { borderRadius: t, railColor: n, primaryColor: r, primaryColorHover: i, primaryColorPressed: a, textColor2: o } = e;
	return {
		...Wh,
		borderRadius: t,
		railColor: n,
		railColorActive: r,
		linkColor: Y(r, { alpha: .15 }),
		linkTextColor: o,
		linkTextColorHover: i,
		linkTextColorPressed: a,
		linkTextColorActive: r
	};
}
//#endregion
//#region node_modules/naive-ui/es/anchor/styles/dark.mjs
var Kh = {
	name: "Anchor",
	common: Q,
	self: Gh
}, qh = {
	paddingTiny: "0 8px",
	paddingSmall: "0 10px",
	paddingMedium: "0 12px",
	paddingLarge: "0 14px",
	clearSize: "16px"
};
//#endregion
//#region node_modules/naive-ui/es/input/styles/dark.mjs
function Jh(e) {
	let { textColor2: t, textColor3: n, textColorDisabled: r, primaryColor: i, primaryColorHover: a, inputColor: o, inputColorDisabled: s, warningColor: c, warningColorHover: l, errorColor: u, errorColorHover: d, borderRadius: f, lineHeight: p, fontSizeTiny: m, fontSizeSmall: h, fontSizeMedium: g, fontSizeLarge: _, heightTiny: v, heightSmall: y, heightMedium: b, heightLarge: x, clearColor: S, clearColorHover: C, clearColorPressed: w, placeholderColor: T, placeholderColorDisabled: E, iconColor: D, iconColorDisabled: O, iconColorHover: k, iconColorPressed: A, fontWeight: ee } = e;
	return {
		...qh,
		fontWeight: ee,
		countTextColorDisabled: r,
		countTextColor: n,
		heightTiny: v,
		heightSmall: y,
		heightMedium: b,
		heightLarge: x,
		fontSizeTiny: m,
		fontSizeSmall: h,
		fontSizeMedium: g,
		fontSizeLarge: _,
		lineHeight: p,
		lineHeightTextarea: p,
		borderRadius: f,
		iconSize: "16px",
		groupLabelColor: o,
		textColor: t,
		textColorDisabled: r,
		textDecorationColor: t,
		groupLabelTextColor: t,
		caretColor: i,
		placeholderColor: T,
		placeholderColorDisabled: E,
		color: o,
		colorHover: o,
		colorDisabled: s,
		colorFocus: Y(i, { alpha: .1 }),
		groupLabelBorder: "1px solid #0000",
		border: "1px solid #0000",
		borderHover: `1px solid ${a}`,
		borderDisabled: "1px solid #0000",
		borderFocus: `1px solid ${a}`,
		boxShadowFocus: `0 0 8px 0 ${Y(i, { alpha: .3 })}`,
		loadingColor: i,
		loadingColorWarning: c,
		borderWarning: `1px solid ${c}`,
		borderHoverWarning: `1px solid ${l}`,
		colorFocusWarning: Y(c, { alpha: .1 }),
		borderFocusWarning: `1px solid ${l}`,
		boxShadowFocusWarning: `0 0 8px 0 ${Y(c, { alpha: .3 })}`,
		caretColorWarning: c,
		loadingColorError: u,
		borderError: `1px solid ${u}`,
		borderHoverError: `1px solid ${d}`,
		colorFocusError: Y(u, { alpha: .1 }),
		borderFocusError: `1px solid ${d}`,
		boxShadowFocusError: `0 0 8px 0 ${Y(u, { alpha: .3 })}`,
		caretColorError: u,
		clearColor: S,
		clearColorHover: C,
		clearColorPressed: w,
		iconColor: D,
		iconColorDisabled: O,
		iconColorHover: k,
		iconColorPressed: A,
		suffixTextColor: t
	};
}
var Yh = Yp({
	name: "Input",
	common: Q,
	peers: { Scrollbar: Up },
	self: Jh
}), Xh = kf("n-form-item");
function Zh(e, { defaultSize: t = "medium", mergedSize: n, mergedDisabled: r } = {}) {
	let i = Jn(Xh, null);
	qn(Xh, null);
	let a = z(n ? () => n(i) : () => {
		let { size: n } = e;
		if (n) return n;
		if (i) {
			let { mergedSize: e } = i;
			if (e.value !== void 0) return e.value;
		}
		return t;
	}), o = z(r ? () => r(i) : () => {
		let { disabled: t } = e;
		return t === void 0 ? i ? i.disabled.value : !1 : t;
	}), s = z(() => {
		let { status: t } = e;
		return t || i?.mergedValidationStatus.value;
	});
	return Nr(() => {
		i && i.restoreValidation();
	}), {
		mergedSizeRef: a,
		mergedDisabledRef: o,
		mergedStatusRef: s,
		nTriggerFormBlur() {
			i && i.handleContentBlur();
		},
		nTriggerFormChange() {
			i && i.handleContentChange();
		},
		nTriggerFormFocus() {
			i && i.handleContentFocus();
		},
		nTriggerFormInput() {
			i && i.handleContentInput();
		}
	};
}
//#endregion
//#region node_modules/naive-ui/es/_internal/icon-switch-transition/src/IconSwitchTransition.mjs
var Qh = /* @__PURE__ */ I({
	name: "BaseIconSwitchTransition",
	setup(e, { slots: t }) {
		let n = gm();
		return () => (L(), Ui(za, {
			name: "icon-switch-transition",
			appear: n.value
		}, qf(t), 1032, ["appear"]));
	}
}), { cubicBezierEaseInOut: $h } = Nf;
function eg({ originalTransform: e = "", left: t = 0, top: n = 0, transition: r = `all .3s ${$h} !important` } = {}) {
	return [
		V("&.icon-switch-transition-enter-from, &.icon-switch-transition-leave-to", {
			transform: `${e} scale(0.75)`,
			left: t,
			top: n,
			opacity: 0
		}),
		V("&.icon-switch-transition-enter-to, &.icon-switch-transition-leave-from", {
			transform: `scale(1) ${e}`,
			left: t,
			top: n,
			opacity: 1
		}),
		V("&.icon-switch-transition-enter-active, &.icon-switch-transition-leave-active", {
			transformOrigin: "center",
			position: "absolute",
			left: t,
			top: n,
			transition: r
		})
	];
}
//#endregion
//#region node_modules/naive-ui/es/_internal/loading/src/styles/index.cssr.mjs
var tg = V([V("@keyframes rotator", "\n 0% {\n -webkit-transform: rotate(0deg);\n transform: rotate(0deg);\n }\n 100% {\n -webkit-transform: rotate(360deg);\n transform: rotate(360deg);\n }"), H("base-loading", "\n position: relative;\n line-height: 0;\n width: 1em;\n height: 1em;\n ", [
	U("transition-wrapper", "\n position: absolute;\n width: 100%;\n height: 100%;\n ", [eg()]),
	U("placeholder", "\n position: absolute;\n left: 50%;\n top: 50%;\n transform: translateX(-50%) translateY(-50%);\n ", [eg({
		left: "50%",
		top: "50%",
		originalTransform: "translateX(-50%) translateY(-50%)"
	})]),
	U("container", "\n animation: rotator 3s linear infinite both;\n ", [U("icon", "\n height: 1em;\n width: 1em;\n ")])
])]), ng = ["viewBox"], rg = ["values", "dur"], ig = [
	"stroke-width",
	"cx",
	"cy",
	"r",
	"stroke-dasharray",
	"stroke-dashoffset"
], ag = ["values", "dur"], og = ["values", "dur"], sg = "1.6s", cg = /* @__PURE__ */ I({
	name: "BaseLoading",
	props: {
		clsPrefix: {
			type: String,
			required: !0
		},
		show: {
			type: Boolean,
			default: !0
		},
		strokeWidth: {
			type: Number,
			default: 28
		},
		stroke: {
			type: String,
			default: void 0
		},
		scale: {
			type: Number,
			default: 1
		},
		radius: {
			type: Number,
			default: 100
		}
	},
	setup(e) {
		Uf("-base-loading", tg, /* @__PURE__ */ fn(e, "clsPrefix"));
	},
	render() {
		let { clsPrefix: e, radius: t, strokeWidth: n, stroke: r, scale: i } = this, a = t / i;
		return L(), R("div", {
			class: q(`${e}-base-loading`),
			role: "img",
			"aria-label": "loading"
		}, [Yi(Qh, null, { default: () => this.show ? (L(), R("div", {
			key: "icon",
			class: q(`${e}-base-loading__transition-wrapper`)
		}, [Ji("div", { class: q(`${e}-base-loading__container`) }, [(L(), R("svg", {
			class: q(`${e}-base-loading__icon`),
			viewBox: `0 0 ${2 * a} ${2 * a}`,
			xmlns: "http://www.w3.org/2000/svg",
			style: M({ color: r })
		}, [Ji("g", null, [Ji("animateTransform", {
			attributeName: "transform",
			type: "rotate",
			values: `0 ${a} ${a};270 ${a} ${a}`,
			begin: "0s",
			dur: sg,
			fill: "freeze",
			repeatCount: "indefinite"
		}, null, 8, rg), Ji("circle", {
			class: q(`${e}-base-loading__icon`),
			fill: "none",
			stroke: "currentColor",
			"stroke-width": n,
			"stroke-linecap": "round",
			cx: a,
			cy: a,
			r: t - n / 2,
			"stroke-dasharray": 5.67 * t,
			"stroke-dashoffset": 18.48 * t
		}, [Ji("animateTransform", {
			attributeName: "transform",
			type: "rotate",
			values: `0 ${a} ${a};135 ${a} ${a};450 ${a} ${a}`,
			begin: "0s",
			dur: sg,
			fill: "freeze",
			repeatCount: "indefinite"
		}, null, 8, ag), Ji("animate", {
			attributeName: "stroke-dashoffset",
			values: `${5.67 * t};${1.42 * t};${5.67 * t}`,
			begin: "0s",
			dur: sg,
			fill: "freeze",
			repeatCount: "indefinite"
		}, null, 8, og)], 10, ig)])], 14, ng))], 2)], 2)) : (L(), R("div", {
			key: "placeholder",
			class: q(`${e}-base-loading__placeholder`)
		}, [K(() => this.$slots.default?.())], 2)) }, 1024)], 2);
	}
}), lg = typeof document < "u" && typeof window < "u", ug = lg && "chrome" in window;
lg && navigator.userAgent.includes("Firefox");
var dg = lg && navigator.userAgent.includes("Safari") && !ug;
//#endregion
//#region node_modules/naive-ui/es/auto-complete/styles/light.mjs
function fg(e) {
	let { boxShadow2: t } = e;
	return { menuBoxShadow: t };
}
//#endregion
//#region node_modules/naive-ui/es/auto-complete/styles/dark.mjs
var pg = {
	name: "AutoComplete",
	common: Q,
	peers: {
		InternalSelectMenu: nm,
		Input: Yh
	},
	self: fg
};
//#endregion
//#region node_modules/naive-ui/es/avatar/styles/light.mjs
function mg(e) {
	let { borderRadius: t, avatarColor: n, cardColor: r, fontSize: i, heightTiny: a, heightSmall: o, heightMedium: s, heightLarge: c, heightHuge: l, modalColor: u, popoverColor: d } = e;
	return {
		borderRadius: t,
		fontSize: i,
		border: `2px solid ${r}`,
		heightTiny: a,
		heightSmall: o,
		heightMedium: s,
		heightLarge: c,
		heightHuge: l,
		color: J(r, n),
		colorModal: J(u, n),
		colorPopover: J(d, n)
	};
}
var hg = {
	name: "Avatar",
	common: Q,
	self: mg
};
//#endregion
//#region node_modules/naive-ui/es/avatar-group/styles/light.mjs
function gg() {
	return { gap: "-12px" };
}
//#endregion
//#region node_modules/naive-ui/es/back-top/styles/_common.mjs
var _g = {
	width: "44px",
	height: "44px",
	borderRadius: "22px",
	iconSize: "26px"
}, vg = {
	name: "BackTop",
	common: Q,
	self(e) {
		let { popoverColor: t, textColor2: n, primaryColorHover: r, primaryColorPressed: i } = e;
		return {
			..._g,
			color: t,
			textColor: n,
			iconColor: n,
			iconColorHover: r,
			iconColorPressed: i,
			boxShadow: "0 2px 8px 0px rgba(0, 0, 0, .12)",
			boxShadowHover: "0 2px 12px 0px rgba(0, 0, 0, .18)",
			boxShadowPressed: "0 2px 12px 0px rgba(0, 0, 0, .18)"
		};
	}
}, yg = {
	name: "Badge",
	common: Q,
	self(e) {
		let { errorColorSuppl: t, infoColorSuppl: n, successColorSuppl: r, warningColorSuppl: i, fontFamily: a } = e;
		return {
			color: t,
			colorInfo: n,
			colorSuccess: r,
			colorError: t,
			colorWarning: i,
			fontSize: "12px",
			fontFamily: a
		};
	}
}, { cubicBezierEaseInOut: bg } = Nf;
function xg({ duration: e = ".2s", delay: t = ".1s" } = {}) {
	return [
		V("&.fade-in-width-expand-transition-leave-from, &.fade-in-width-expand-transition-enter-to", { opacity: 1 }),
		V("&.fade-in-width-expand-transition-leave-to, &.fade-in-width-expand-transition-enter-from", "\n opacity: 0!important;\n margin-left: 0!important;\n margin-right: 0!important;\n "),
		V("&.fade-in-width-expand-transition-leave-active", `
 overflow: hidden;
 transition:
 opacity ${e} ${bg},
 max-width ${e} ${bg} ${t},
 margin-left ${e} ${bg} ${t},
 margin-right ${e} ${bg} ${t};
 `),
		V("&.fade-in-width-expand-transition-enter-active", `
 overflow: hidden;
 transition:
 opacity ${e} ${bg} ${t},
 max-width ${e} ${bg},
 margin-left ${e} ${bg},
 margin-right ${e} ${bg};
 `)
	];
}
//#endregion
//#region node_modules/naive-ui/es/_internal/wave/src/styles/index.cssr.mjs
var Sg = H("base-wave", "\n position: absolute;\n left: 0;\n right: 0;\n top: 0;\n bottom: 0;\n border-radius: inherit;\n"), Cg = /* @__PURE__ */ I({
	name: "BaseWave",
	props: { clsPrefix: {
		type: String,
		required: !0
	} },
	setup(e) {
		Uf("-base-wave", Sg, /* @__PURE__ */ fn(e, "clsPrefix"));
		let t = /* @__PURE__ */ F(null), n = /* @__PURE__ */ F(!1), r = null;
		return Nr(() => {
			r !== null && window.clearTimeout(r);
		}), {
			active: n,
			selfRef: t,
			play() {
				r !== null && (window.clearTimeout(r), n.value = !1, r = null), Nn(() => {
					t.value?.offsetHeight, n.value = !0, r = window.setTimeout(() => {
						n.value = !1, r = null;
					}, 1e3);
				});
			}
		};
	},
	render() {
		let { clsPrefix: e } = this;
		return L(), R("div", {
			ref: "selfRef",
			"aria-hidden": !0,
			class: q([`${e}-base-wave`, this.active && `${e}-base-wave--active`])
		}, null, 2);
	}
}), wg = { fontWeightActive: "400" };
//#endregion
//#region node_modules/naive-ui/es/breadcrumb/styles/light.mjs
function Tg(e) {
	let { fontSize: t, textColor3: n, textColor2: r, borderRadius: i, buttonColor2Hover: a, buttonColor2Pressed: o } = e;
	return {
		...wg,
		fontSize: t,
		itemLineHeight: "1.25",
		itemTextColor: n,
		itemTextColorHover: r,
		itemTextColorPressed: r,
		itemTextColorActive: r,
		itemBorderRadius: i,
		itemColorHover: a,
		itemColorPressed: o,
		separatorColor: n
	};
}
//#endregion
//#region node_modules/naive-ui/es/breadcrumb/styles/dark.mjs
var Eg = {
	name: "Breadcrumb",
	common: Q,
	self: Tg
}, Dg = {
	paddingTiny: "0 6px",
	paddingSmall: "0 10px",
	paddingMedium: "0 14px",
	paddingLarge: "0 18px",
	paddingRoundTiny: "0 10px",
	paddingRoundSmall: "0 14px",
	paddingRoundMedium: "0 18px",
	paddingRoundLarge: "0 22px",
	iconMarginTiny: "6px",
	iconMarginSmall: "6px",
	iconMarginMedium: "6px",
	iconMarginLarge: "6px",
	iconSizeTiny: "14px",
	iconSizeSmall: "18px",
	iconSizeMedium: "18px",
	iconSizeLarge: "20px",
	rippleDuration: ".6s"
};
//#endregion
//#region node_modules/naive-ui/es/button/styles/light.mjs
function Og(e) {
	let { heightTiny: t, heightSmall: n, heightMedium: r, heightLarge: i, borderRadius: a, fontSizeTiny: o, fontSizeSmall: s, fontSizeMedium: c, fontSizeLarge: l, opacityDisabled: u, textColor2: d, textColor3: f, primaryColorHover: p, primaryColorPressed: m, borderColor: h, primaryColor: g, baseColor: _, infoColor: v, infoColorHover: y, infoColorPressed: b, successColor: x, successColorHover: S, successColorPressed: C, warningColor: w, warningColorHover: T, warningColorPressed: E, errorColor: D, errorColorHover: O, errorColorPressed: k, fontWeight: A, buttonColor2: ee, buttonColor2Hover: j, buttonColor2Pressed: te, fontWeightStrong: ne } = e;
	return {
		...Dg,
		heightTiny: t,
		heightSmall: n,
		heightMedium: r,
		heightLarge: i,
		borderRadiusTiny: a,
		borderRadiusSmall: a,
		borderRadiusMedium: a,
		borderRadiusLarge: a,
		fontSizeTiny: o,
		fontSizeSmall: s,
		fontSizeMedium: c,
		fontSizeLarge: l,
		opacityDisabled: u,
		colorOpacitySecondary: "0.16",
		colorOpacitySecondaryHover: "0.22",
		colorOpacitySecondaryPressed: "0.28",
		colorSecondary: ee,
		colorSecondaryHover: j,
		colorSecondaryPressed: te,
		colorTertiary: ee,
		colorTertiaryHover: j,
		colorTertiaryPressed: te,
		colorQuaternary: "#0000",
		colorQuaternaryHover: j,
		colorQuaternaryPressed: te,
		color: "#0000",
		colorHover: "#0000",
		colorPressed: "#0000",
		colorFocus: "#0000",
		colorDisabled: "#0000",
		textColor: d,
		textColorTertiary: f,
		textColorHover: p,
		textColorPressed: m,
		textColorFocus: p,
		textColorDisabled: d,
		textColorText: d,
		textColorTextHover: p,
		textColorTextPressed: m,
		textColorTextFocus: p,
		textColorTextDisabled: d,
		textColorGhost: d,
		textColorGhostHover: p,
		textColorGhostPressed: m,
		textColorGhostFocus: p,
		textColorGhostDisabled: d,
		border: `1px solid ${h}`,
		borderHover: `1px solid ${p}`,
		borderPressed: `1px solid ${m}`,
		borderFocus: `1px solid ${p}`,
		borderDisabled: `1px solid ${h}`,
		rippleColor: g,
		colorPrimary: g,
		colorHoverPrimary: p,
		colorPressedPrimary: m,
		colorFocusPrimary: p,
		colorDisabledPrimary: g,
		textColorPrimary: _,
		textColorHoverPrimary: _,
		textColorPressedPrimary: _,
		textColorFocusPrimary: _,
		textColorDisabledPrimary: _,
		textColorTextPrimary: g,
		textColorTextHoverPrimary: p,
		textColorTextPressedPrimary: m,
		textColorTextFocusPrimary: p,
		textColorTextDisabledPrimary: d,
		textColorGhostPrimary: g,
		textColorGhostHoverPrimary: p,
		textColorGhostPressedPrimary: m,
		textColorGhostFocusPrimary: p,
		textColorGhostDisabledPrimary: g,
		borderPrimary: `1px solid ${g}`,
		borderHoverPrimary: `1px solid ${p}`,
		borderPressedPrimary: `1px solid ${m}`,
		borderFocusPrimary: `1px solid ${p}`,
		borderDisabledPrimary: `1px solid ${g}`,
		rippleColorPrimary: g,
		colorInfo: v,
		colorHoverInfo: y,
		colorPressedInfo: b,
		colorFocusInfo: y,
		colorDisabledInfo: v,
		textColorInfo: _,
		textColorHoverInfo: _,
		textColorPressedInfo: _,
		textColorFocusInfo: _,
		textColorDisabledInfo: _,
		textColorTextInfo: v,
		textColorTextHoverInfo: y,
		textColorTextPressedInfo: b,
		textColorTextFocusInfo: y,
		textColorTextDisabledInfo: d,
		textColorGhostInfo: v,
		textColorGhostHoverInfo: y,
		textColorGhostPressedInfo: b,
		textColorGhostFocusInfo: y,
		textColorGhostDisabledInfo: v,
		borderInfo: `1px solid ${v}`,
		borderHoverInfo: `1px solid ${y}`,
		borderPressedInfo: `1px solid ${b}`,
		borderFocusInfo: `1px solid ${y}`,
		borderDisabledInfo: `1px solid ${v}`,
		rippleColorInfo: v,
		colorSuccess: x,
		colorHoverSuccess: S,
		colorPressedSuccess: C,
		colorFocusSuccess: S,
		colorDisabledSuccess: x,
		textColorSuccess: _,
		textColorHoverSuccess: _,
		textColorPressedSuccess: _,
		textColorFocusSuccess: _,
		textColorDisabledSuccess: _,
		textColorTextSuccess: x,
		textColorTextHoverSuccess: S,
		textColorTextPressedSuccess: C,
		textColorTextFocusSuccess: S,
		textColorTextDisabledSuccess: d,
		textColorGhostSuccess: x,
		textColorGhostHoverSuccess: S,
		textColorGhostPressedSuccess: C,
		textColorGhostFocusSuccess: S,
		textColorGhostDisabledSuccess: x,
		borderSuccess: `1px solid ${x}`,
		borderHoverSuccess: `1px solid ${S}`,
		borderPressedSuccess: `1px solid ${C}`,
		borderFocusSuccess: `1px solid ${S}`,
		borderDisabledSuccess: `1px solid ${x}`,
		rippleColorSuccess: x,
		colorWarning: w,
		colorHoverWarning: T,
		colorPressedWarning: E,
		colorFocusWarning: T,
		colorDisabledWarning: w,
		textColorWarning: _,
		textColorHoverWarning: _,
		textColorPressedWarning: _,
		textColorFocusWarning: _,
		textColorDisabledWarning: _,
		textColorTextWarning: w,
		textColorTextHoverWarning: T,
		textColorTextPressedWarning: E,
		textColorTextFocusWarning: T,
		textColorTextDisabledWarning: d,
		textColorGhostWarning: w,
		textColorGhostHoverWarning: T,
		textColorGhostPressedWarning: E,
		textColorGhostFocusWarning: T,
		textColorGhostDisabledWarning: w,
		borderWarning: `1px solid ${w}`,
		borderHoverWarning: `1px solid ${T}`,
		borderPressedWarning: `1px solid ${E}`,
		borderFocusWarning: `1px solid ${T}`,
		borderDisabledWarning: `1px solid ${w}`,
		rippleColorWarning: w,
		colorError: D,
		colorHoverError: O,
		colorPressedError: k,
		colorFocusError: O,
		colorDisabledError: D,
		textColorError: _,
		textColorHoverError: _,
		textColorPressedError: _,
		textColorFocusError: _,
		textColorDisabledError: _,
		textColorTextError: D,
		textColorTextHoverError: O,
		textColorTextPressedError: k,
		textColorTextFocusError: O,
		textColorTextDisabledError: d,
		textColorGhostError: D,
		textColorGhostHoverError: O,
		textColorGhostPressedError: k,
		textColorGhostFocusError: O,
		textColorGhostDisabledError: D,
		borderError: `1px solid ${D}`,
		borderHoverError: `1px solid ${O}`,
		borderPressedError: `1px solid ${k}`,
		borderFocusError: `1px solid ${O}`,
		borderDisabledError: `1px solid ${D}`,
		rippleColorError: D,
		waveOpacity: "0.6",
		fontWeight: A,
		fontWeightStrong: ne
	};
}
var kg = {
	name: "Button",
	common: zp,
	self: Og
}, Ag = {
	name: "Button",
	common: Q,
	self(e) {
		let t = Og(e);
		return t.waveOpacity = "0.8", t.colorOpacitySecondary = "0.16", t.colorOpacitySecondaryHover = "0.2", t.colorOpacitySecondaryPressed = "0.12", t;
	}
};
//#endregion
//#region node_modules/naive-ui/es/_utils/color/index.mjs
function jg(e) {
	return J(e, [
		255,
		255,
		255,
		.16
	]);
}
function Mg(e) {
	return J(e, [
		0,
		0,
		0,
		.12
	]);
}
//#endregion
//#region node_modules/naive-ui/es/button-group/src/context.mjs
var Ng = kf("n-button-group"), Pg = V([
	H("button", "\n margin: 0;\n font-weight: var(--n-font-weight);\n line-height: 1;\n font-family: inherit;\n padding: var(--n-padding);\n height: var(--n-height);\n font-size: var(--n-font-size);\n border-radius: var(--n-border-radius);\n color: var(--n-text-color);\n background-color: var(--n-color);\n width: var(--n-width);\n white-space: nowrap;\n outline: none;\n position: relative;\n z-index: auto;\n border: none;\n display: inline-flex;\n flex-wrap: nowrap;\n flex-shrink: 0;\n align-items: center;\n justify-content: center;\n user-select: none;\n -webkit-user-select: none;\n text-align: center;\n cursor: pointer;\n text-decoration: none;\n transition:\n color .3s var(--n-bezier),\n background-color .3s var(--n-bezier),\n opacity .3s var(--n-bezier),\n border-color .3s var(--n-bezier);\n ", [
		W("color", [
			U("border", { borderColor: "var(--n-border-color)" }),
			W("disabled", [U("border", { borderColor: "var(--n-border-color-disabled)" })]),
			ks("disabled", [
				V("&:focus", [U("state-border", { borderColor: "var(--n-border-color-focus)" })]),
				V("&:hover", [U("state-border", { borderColor: "var(--n-border-color-hover)" })]),
				V("&:active", [U("state-border", { borderColor: "var(--n-border-color-pressed)" })]),
				W("pressed", [U("state-border", { borderColor: "var(--n-border-color-pressed)" })])
			])
		]),
		W("disabled", {
			backgroundColor: "var(--n-color-disabled)",
			color: "var(--n-text-color-disabled)"
		}, [U("border", { border: "var(--n-border-disabled)" })]),
		ks("disabled", [
			V("&:focus", {
				backgroundColor: "var(--n-color-focus)",
				color: "var(--n-text-color-focus)"
			}, [U("state-border", { border: "var(--n-border-focus)" })]),
			V("&:hover", {
				backgroundColor: "var(--n-color-hover)",
				color: "var(--n-text-color-hover)"
			}, [U("state-border", { border: "var(--n-border-hover)" })]),
			V("&:active", {
				backgroundColor: "var(--n-color-pressed)",
				color: "var(--n-text-color-pressed)"
			}, [U("state-border", { border: "var(--n-border-pressed)" })]),
			W("pressed", {
				backgroundColor: "var(--n-color-pressed)",
				color: "var(--n-text-color-pressed)"
			}, [U("state-border", { border: "var(--n-border-pressed)" })])
		]),
		W("loading", "cursor: wait;"),
		H("base-wave", "\n pointer-events: none;\n top: 0;\n right: 0;\n bottom: 0;\n left: 0;\n animation-iteration-count: 1;\n animation-duration: var(--n-ripple-duration);\n animation-timing-function: var(--n-bezier-ease-out), var(--n-bezier-ease-out);\n ", [W("active", {
			zIndex: 1,
			animationName: "button-wave-spread, button-wave-opacity"
		})]),
		lg && "MozBoxSizing" in document.createElement("div").style ? V("&::moz-focus-inner", { border: 0 }) : null,
		U("border, state-border", "\n position: absolute;\n left: 0;\n top: 0;\n right: 0;\n bottom: 0;\n border-radius: inherit;\n transition: border-color .3s var(--n-bezier);\n pointer-events: none;\n "),
		U("border", "\n border: var(--n-border);\n "),
		U("state-border", "\n border: var(--n-border);\n border-color: #0000;\n z-index: 1;\n "),
		U("icon", "\n margin: var(--n-icon-margin);\n margin-left: 0;\n height: var(--n-icon-size);\n width: var(--n-icon-size);\n max-width: var(--n-icon-size);\n font-size: var(--n-icon-size);\n position: relative;\n flex-shrink: 0;\n ", [H("icon-slot", "\n height: var(--n-icon-size);\n width: var(--n-icon-size);\n position: absolute;\n left: 0;\n top: 50%;\n transform: translateY(-50%);\n display: flex;\n align-items: center;\n justify-content: center;\n ", [eg({
			top: "50%",
			originalTransform: "translateY(-50%)"
		})]), xg()]),
		U("content", "\n display: flex;\n align-items: center;\n flex-wrap: nowrap;\n min-width: 0;\n ", [V("~", [U("icon", {
			margin: "var(--n-icon-margin)",
			marginRight: 0
		})])]),
		W("block", "\n display: flex;\n width: 100%;\n "),
		W("dashed", [U("border, state-border", { borderStyle: "dashed !important" })]),
		W("disabled", {
			cursor: "not-allowed",
			opacity: "var(--n-opacity-disabled)"
		})
	]),
	V("@keyframes button-wave-spread", {
		from: { boxShadow: "0 0 0.5px 0 var(--n-ripple-color)" },
		to: { boxShadow: "0 0 0.5px 4.5px var(--n-ripple-color)" }
	}),
	V("@keyframes button-wave-opacity", {
		from: { opacity: "var(--n-wave-opacity)" },
		to: { opacity: 0 }
	})
]), Fg = /* @__PURE__ */ I({
	name: "Button",
	props: {
		...Xp.props,
		color: String,
		textColor: String,
		text: Boolean,
		block: Boolean,
		loading: Boolean,
		disabled: Boolean,
		circle: Boolean,
		size: String,
		ghost: Boolean,
		round: Boolean,
		secondary: Boolean,
		tertiary: Boolean,
		quaternary: Boolean,
		strong: Boolean,
		focusable: {
			type: Boolean,
			default: !0
		},
		keyboard: {
			type: Boolean,
			default: !0
		},
		tag: {
			type: String,
			default: "button"
		},
		type: {
			type: String,
			default: "default"
		},
		dashed: Boolean,
		renderIcon: Function,
		iconPlacement: {
			type: String,
			default: "left"
		},
		attrType: {
			type: String,
			default: "button"
		},
		bordered: {
			type: Boolean,
			default: !0
		},
		onClick: [Function, Array],
		nativeFocusBehavior: {
			type: Boolean,
			default: !dg
		},
		spinProps: Object
	},
	slots: Object,
	setup(e) {
		let t = /* @__PURE__ */ F(null), n = /* @__PURE__ */ F(null), r = /* @__PURE__ */ F(!1), i = hm(() => !e.quaternary && !e.tertiary && !e.secondary && !e.text && (!e.color || e.ghost || e.dashed) && e.bordered), a = Jn(Ng, {}), { inlineThemeDisabled: o, mergedClsPrefixRef: s, mergedRtlRef: c, mergedComponentPropsRef: l } = jf(e), { mergedSizeRef: u } = Zh({}, {
			defaultSize: "medium",
			mergedSize: (t) => {
				let { size: n } = e;
				if (n) return n;
				let { size: r } = a;
				if (r) return r;
				let { mergedSize: i } = t || {};
				return i ? i.value : l?.value?.Button?.size || "medium";
			}
		}), d = z(() => e.focusable && !e.disabled), f = (n) => {
			d.value || n.preventDefault(), !e.nativeFocusBehavior && (n.preventDefault(), !e.disabled && d.value && t.value?.focus({ preventScroll: !0 }));
		}, p = (t) => {
			if (!e.disabled && !e.loading) {
				let { onClick: r } = e;
				r && ym(r, t), e.text || n.value?.play();
			}
		}, m = (t) => {
			if (t.key === "Enter") {
				if (!e.keyboard) return;
				r.value = !1;
			}
		}, h = (t) => {
			if (t.key === "Enter") {
				if (!e.keyboard || e.loading) {
					t.preventDefault();
					return;
				}
				r.value = !0;
			}
		}, g = () => {
			r.value = !1;
		}, _ = Xp("Button", "-button", Pg, kg, e, s), v = Cm("Button", c, s), y = z(() => {
			let { common: { cubicBezierEaseInOut: t, cubicBezierEaseOut: n }, self: r } = _.value, { rippleDuration: i, opacityDisabled: a, fontWeight: o, fontWeightStrong: s } = r, c = u.value, { dashed: l, type: d, ghost: f, text: p, color: m, round: h, circle: g, textColor: v, secondary: y, tertiary: b, quaternary: x, strong: S } = e, C = { "--n-font-weight": S ? s : o }, w = {
				"--n-color": "initial",
				"--n-color-hover": "initial",
				"--n-color-pressed": "initial",
				"--n-color-focus": "initial",
				"--n-color-disabled": "initial",
				"--n-ripple-color": "initial",
				"--n-text-color": "initial",
				"--n-text-color-hover": "initial",
				"--n-text-color-pressed": "initial",
				"--n-text-color-focus": "initial",
				"--n-text-color-disabled": "initial"
			}, T = d === "tertiary", E = d === "default", D = T ? "default" : d;
			if (p) {
				let e = v || m;
				w = {
					"--n-color": "#0000",
					"--n-color-hover": "#0000",
					"--n-color-pressed": "#0000",
					"--n-color-focus": "#0000",
					"--n-color-disabled": "#0000",
					"--n-ripple-color": "#0000",
					"--n-text-color": e || r[G("textColorText", D)],
					"--n-text-color-hover": e ? jg(e) : r[G("textColorTextHover", D)],
					"--n-text-color-pressed": e ? Mg(e) : r[G("textColorTextPressed", D)],
					"--n-text-color-focus": e ? jg(e) : r[G("textColorTextHover", D)],
					"--n-text-color-disabled": e || r[G("textColorTextDisabled", D)]
				};
			} else if (f || l) {
				let e = v || m;
				w = {
					"--n-color": "#0000",
					"--n-color-hover": "#0000",
					"--n-color-pressed": "#0000",
					"--n-color-focus": "#0000",
					"--n-color-disabled": "#0000",
					"--n-ripple-color": m || r[G("rippleColor", D)],
					"--n-text-color": e || r[G("textColorGhost", D)],
					"--n-text-color-hover": e ? jg(e) : r[G("textColorGhostHover", D)],
					"--n-text-color-pressed": e ? Mg(e) : r[G("textColorGhostPressed", D)],
					"--n-text-color-focus": e ? jg(e) : r[G("textColorGhostHover", D)],
					"--n-text-color-disabled": e || r[G("textColorGhostDisabled", D)]
				};
			} else if (y) {
				let e = E ? r.textColor : T ? r.textColorTertiary : r[G("color", D)], t = m || e, n = d !== "default" && d !== "tertiary";
				w = {
					"--n-color": n ? Y(t, { alpha: Number(r.colorOpacitySecondary) }) : r.colorSecondary,
					"--n-color-hover": n ? Y(t, { alpha: Number(r.colorOpacitySecondaryHover) }) : r.colorSecondaryHover,
					"--n-color-pressed": n ? Y(t, { alpha: Number(r.colorOpacitySecondaryPressed) }) : r.colorSecondaryPressed,
					"--n-color-focus": n ? Y(t, { alpha: Number(r.colorOpacitySecondaryHover) }) : r.colorSecondaryHover,
					"--n-color-disabled": r.colorSecondary,
					"--n-ripple-color": "#0000",
					"--n-text-color": t,
					"--n-text-color-hover": t,
					"--n-text-color-pressed": t,
					"--n-text-color-focus": t,
					"--n-text-color-disabled": t
				};
			} else if (b || x) {
				let e = E ? r.textColor : T ? r.textColorTertiary : r[G("color", D)], t = m || e;
				b ? (w["--n-color"] = r.colorTertiary, w["--n-color-hover"] = r.colorTertiaryHover, w["--n-color-pressed"] = r.colorTertiaryPressed, w["--n-color-focus"] = r.colorSecondaryHover, w["--n-color-disabled"] = r.colorTertiary) : (w["--n-color"] = r.colorQuaternary, w["--n-color-hover"] = r.colorQuaternaryHover, w["--n-color-pressed"] = r.colorQuaternaryPressed, w["--n-color-focus"] = r.colorQuaternaryHover, w["--n-color-disabled"] = r.colorQuaternary), w["--n-ripple-color"] = "#0000", w["--n-text-color"] = t, w["--n-text-color-hover"] = t, w["--n-text-color-pressed"] = t, w["--n-text-color-focus"] = t, w["--n-text-color-disabled"] = t;
			} else w = {
				"--n-color": m || r[G("color", D)],
				"--n-color-hover": m ? jg(m) : r[G("colorHover", D)],
				"--n-color-pressed": m ? Mg(m) : r[G("colorPressed", D)],
				"--n-color-focus": m ? jg(m) : r[G("colorFocus", D)],
				"--n-color-disabled": m || r[G("colorDisabled", D)],
				"--n-ripple-color": m || r[G("rippleColor", D)],
				"--n-text-color": v || (m ? r.textColorPrimary : T ? r.textColorTertiary : r[G("textColor", D)]),
				"--n-text-color-hover": v || (m ? r.textColorHoverPrimary : r[G("textColorHover", D)]),
				"--n-text-color-pressed": v || (m ? r.textColorPressedPrimary : r[G("textColorPressed", D)]),
				"--n-text-color-focus": v || (m ? r.textColorFocusPrimary : r[G("textColorFocus", D)]),
				"--n-text-color-disabled": v || (m ? r.textColorDisabledPrimary : r[G("textColorDisabled", D)])
			};
			let O = {
				"--n-border": "initial",
				"--n-border-hover": "initial",
				"--n-border-pressed": "initial",
				"--n-border-focus": "initial",
				"--n-border-disabled": "initial"
			};
			O = p ? {
				"--n-border": "none",
				"--n-border-hover": "none",
				"--n-border-pressed": "none",
				"--n-border-focus": "none",
				"--n-border-disabled": "none"
			} : {
				"--n-border": r[G("border", D)],
				"--n-border-hover": r[G("borderHover", D)],
				"--n-border-pressed": r[G("borderPressed", D)],
				"--n-border-focus": r[G("borderFocus", D)],
				"--n-border-disabled": r[G("borderDisabled", D)]
			};
			let { [G("height", c)]: k, [G("fontSize", c)]: A, [G("padding", c)]: ee, [G("paddingRound", c)]: j, [G("iconSize", c)]: te, [G("borderRadius", c)]: ne, [G("iconMargin", c)]: re, waveOpacity: ie } = r, ae = {
				"--n-width": g && !p ? k : "initial",
				"--n-height": p ? "initial" : k,
				"--n-font-size": A,
				"--n-padding": g || p ? "initial" : h ? j : ee,
				"--n-icon-size": te,
				"--n-icon-margin": re,
				"--n-border-radius": p ? "initial" : g || h ? k : ne
			};
			return {
				"--n-bezier": t,
				"--n-bezier-ease-out": n,
				"--n-ripple-duration": i,
				"--n-opacity-disabled": a,
				"--n-wave-opacity": ie,
				...C,
				...w,
				...O,
				...ae
			};
		}), b = o ? Jp("button", z(() => {
			let t = "", { dashed: n, type: r, ghost: i, text: a, color: o, round: s, circle: c, textColor: l, secondary: d, tertiary: f, quaternary: p, strong: m } = e;
			n && (t += "a"), i && (t += "b"), a && (t += "c"), s && (t += "d"), c && (t += "e"), d && (t += "f"), f && (t += "g"), p && (t += "h"), m && (t += "i"), o && (t += `j${Ph(o)}`), l && (t += `k${Ph(l)}`);
			let { value: h } = u;
			return t += `l${h[0]}`, t += `m${r[0]}`, t;
		}), y, e) : void 0;
		return {
			selfElRef: t,
			waveElRef: n,
			mergedClsPrefix: s,
			mergedFocusable: d,
			mergedSize: u,
			showBorder: i,
			enterPressed: r,
			rtlEnabled: v,
			handleMousedown: f,
			handleKeydown: h,
			handleBlur: g,
			handleKeyup: m,
			handleClick: p,
			customColorCssVars: z(() => {
				let { color: t } = e;
				if (!t) return null;
				let n = jg(t);
				return {
					"--n-border-color": t,
					"--n-border-color-hover": n,
					"--n-border-color-pressed": Mg(t),
					"--n-border-color-focus": n,
					"--n-border-color-disabled": t
				};
			}),
			cssVars: o ? void 0 : y,
			themeClass: b?.themeClass,
			onRender: b?.onRender
		};
	},
	render() {
		let { mergedClsPrefix: e, tag: t, onRender: n } = this;
		n?.();
		let r = xm(this.$slots.default, (t) => t && (L(), R("span", { class: q(`${e}-button__content`) }, [K(() => t)], 2)));
		return L(), Ui(t, {
			ref: "selfElRef",
			class: q([
				this.themeClass,
				`${e}-button`,
				`${e}-button--${this.type}-type`,
				`${e}-button--${this.mergedSize}-type`,
				this.rtlEnabled && `${e}-button--rtl`,
				this.disabled && `${e}-button--disabled`,
				this.block && `${e}-button--block`,
				this.enterPressed && `${e}-button--pressed`,
				!this.text && this.dashed && `${e}-button--dashed`,
				this.color && `${e}-button--color`,
				this.secondary && `${e}-button--secondary`,
				this.loading && `${e}-button--loading`,
				this.ghost && `${e}-button--ghost`
			]),
			tabindex: this.mergedFocusable ? 0 : -1,
			type: this.attrType,
			style: M(this.cssVars),
			disabled: this.disabled,
			onClick: this.handleClick,
			onBlur: this.handleBlur,
			onMousedown: this.handleMousedown,
			onKeyup: this.handleKeyup,
			onKeydown: this.handleKeydown
		}, {
			default: Gn(() => [
				K(() => this.iconPlacement === "right" && r),
				Yi(Uh, { width: !0 }, { default: () => xm(this.$slots.icon, (t) => (this.loading || this.renderIcon || t) && (L(), R("span", {
					class: q(`${e}-button__icon`),
					style: M({ margin: Sm(this.$slots.default) ? "0" : "" })
				}, [Yi(Qh, null, { default: () => this.loading ? (L(), Ui(cg, ia({
					clsPrefix: e,
					key: "loading",
					class: `${e}-icon-slot`,
					strokeWidth: 20
				}, this.spinProps), null, 16, ["clsPrefix", "class"])) : (L(), R("div", {
					key: "icon",
					class: q(`${e}-icon-slot`),
					role: "none"
				}, [this.renderIcon ? (L(), R(Ni, { key: 0 }, [K(() => this.renderIcon())], 64)) : (L(), R(Ni, { key: 1 }, [K(() => t)], 64))], 2)) }, 1024)], 6))) }, 1024),
				K(() => this.iconPlacement === "left" && r),
				this.text ? K(() => null) : (L(), Ui(Cg, {
					key: 0,
					ref: "waveElRef",
					clsPrefix: e
				}, null, 8, ["clsPrefix"])),
				this.showBorder ? (L(), R("div", {
					key: 2,
					"aria-hidden": !0,
					class: q(`${e}-button__border`),
					style: M(this.customColorCssVars)
				}, null, 6)) : K(() => null),
				this.showBorder ? (L(), R("div", {
					key: 4,
					"aria-hidden": !0,
					class: q(`${e}-button__state-border`),
					style: M(this.customColorCssVars)
				}, null, 6)) : K(() => null)
			]),
			_: 2
		}, 1032, [
			"class",
			"tabindex",
			"type",
			"style",
			"disabled",
			"onClick",
			"onBlur",
			"onMousedown",
			"onKeyup",
			"onKeydown"
		]);
	}
}), Ig = { titleFontSize: "22px" };
//#endregion
//#region node_modules/naive-ui/es/calendar/styles/light.mjs
function Lg(e) {
	let { borderRadius: t, fontSize: n, lineHeight: r, textColor2: i, textColor1: a, textColorDisabled: o, dividerColor: s, fontWeightStrong: c, primaryColor: l, baseColor: u, hoverColor: d, cardColor: f, modalColor: p, popoverColor: m } = e;
	return {
		...Ig,
		borderRadius: t,
		borderColor: J(f, s),
		borderColorModal: J(p, s),
		borderColorPopover: J(m, s),
		textColor: i,
		titleFontWeight: c,
		titleTextColor: a,
		dayTextColor: o,
		fontSize: n,
		lineHeight: r,
		dateColorCurrent: l,
		dateTextColorCurrent: u,
		cellColorHover: J(f, d),
		cellColorHoverModal: J(p, d),
		cellColorHoverPopover: J(m, d),
		cellColor: f,
		cellColorModal: p,
		cellColorPopover: m,
		barColor: l
	};
}
//#endregion
//#region node_modules/naive-ui/es/card/styles/_common.mjs
var Rg = {
	paddingSmall: "12px 16px 12px",
	paddingMedium: "19px 24px 20px",
	paddingLarge: "23px 32px 24px",
	paddingHuge: "27px 40px 28px",
	titleFontSizeSmall: "16px",
	titleFontSizeMedium: "18px",
	titleFontSizeLarge: "18px",
	titleFontSizeHuge: "18px",
	closeIconSize: "18px",
	closeSize: "22px"
};
//#endregion
//#region node_modules/naive-ui/es/card/styles/light.mjs
function zg(e) {
	let { primaryColor: t, borderRadius: n, lineHeight: r, fontSize: i, cardColor: a, textColor2: o, textColor1: s, dividerColor: c, fontWeightStrong: l, closeIconColor: u, closeIconColorHover: d, closeIconColorPressed: f, closeColorHover: p, closeColorPressed: m, modalColor: h, boxShadow1: g, popoverColor: _, actionColor: v } = e;
	return {
		...Rg,
		lineHeight: r,
		color: a,
		colorModal: h,
		colorPopover: _,
		colorTarget: t,
		colorEmbedded: v,
		colorEmbeddedModal: v,
		colorEmbeddedPopover: v,
		textColor: o,
		titleTextColor: s,
		borderColor: c,
		actionColor: v,
		titleFontWeight: l,
		closeColorHover: p,
		closeColorPressed: m,
		closeBorderRadius: n,
		closeIconColor: u,
		closeIconColorHover: d,
		closeIconColorPressed: f,
		fontSizeSmall: i,
		fontSizeMedium: i,
		fontSizeLarge: i,
		fontSizeHuge: i,
		boxShadow: g,
		borderRadius: n
	};
}
var Bg = {
	name: "Card",
	common: zp,
	self: zg
}, Vg = {
	name: "Card",
	common: Q,
	self(e) {
		let t = zg(e), { cardColor: n, modalColor: r, popoverColor: i } = e;
		return t.colorEmbedded = n, t.colorEmbeddedModal = r, t.colorEmbeddedPopover = i, t;
	}
}, Hg = H("card-content", "\n flex: 1;\n min-width: 0;\n box-sizing: border-box;\n padding: 0 var(--n-padding-left) var(--n-padding-bottom) var(--n-padding-left);\n font-size: var(--n-font-size);\n"), Ug = V([
	H("card", "\n font-size: var(--n-font-size);\n line-height: var(--n-line-height);\n display: flex;\n flex-direction: column;\n width: 100%;\n box-sizing: border-box;\n position: relative;\n border-radius: var(--n-border-radius);\n background-color: var(--n-color);\n color: var(--n-text-color);\n word-break: break-word;\n transition: \n color .3s var(--n-bezier),\n background-color .3s var(--n-bezier),\n box-shadow .3s var(--n-bezier),\n border-color .3s var(--n-bezier);\n ", [
		Ms({ background: "var(--n-color-modal)" }),
		W("hoverable", [V("&:hover", "box-shadow: var(--n-box-shadow);")]),
		W("content-segmented", [V(">", [H("card-content", "\n padding-top: var(--n-padding-bottom);\n "), U("content-scrollbar", [V(">", [H("scrollbar-container", [V(">", [H("card-content", "\n padding-top: var(--n-padding-bottom);\n ")])])])])])]),
		W("content-soft-segmented", [V(">", [H("card-content", "\n margin: 0 var(--n-padding-left);\n padding: var(--n-padding-bottom) 0;\n "), U("content-scrollbar", [V(">", [H("scrollbar-container", [V(">", [H("card-content", "\n margin: 0 var(--n-padding-left);\n padding: var(--n-padding-bottom) 0;\n ")])])])])])]),
		W("footer-segmented", [V(">", [U("footer", "\n padding-top: var(--n-padding-bottom);\n ")])]),
		W("footer-soft-segmented", [V(">", [U("footer", "\n padding: var(--n-padding-bottom) 0;\n margin: 0 var(--n-padding-left);\n ")])]),
		V(">", [
			H("card-header", "\n box-sizing: border-box;\n display: flex;\n align-items: center;\n font-size: var(--n-title-font-size);\n padding:\n var(--n-padding-top)\n var(--n-padding-left)\n var(--n-padding-bottom)\n var(--n-padding-left);\n ", [
				U("main", "\n font-weight: var(--n-title-font-weight);\n transition: color .3s var(--n-bezier);\n flex: 1;\n min-width: 0;\n color: var(--n-title-text-color);\n "),
				U("extra", "\n display: flex;\n align-items: center;\n font-size: var(--n-font-size);\n font-weight: 400;\n transition: color .3s var(--n-bezier);\n color: var(--n-text-color);\n "),
				U("close", "\n margin: 0 0 0 8px;\n transition:\n background-color .3s var(--n-bezier),\n color .3s var(--n-bezier);\n ")
			]),
			U("action", "\n box-sizing: border-box;\n transition:\n background-color .3s var(--n-bezier),\n border-color .3s var(--n-bezier);\n background-clip: padding-box;\n background-color: var(--n-action-color);\n "),
			Hg,
			H("card-content", [V("&:first-child", "\n padding-top: var(--n-padding-bottom);\n ")]),
			U("content-scrollbar", "\n display: flex;\n flex-direction: column;\n ", [V(">", [H("scrollbar-container", [V(">", [Hg])])]), V("&:first-child >", [H("scrollbar-container", [V(">", [H("card-content", "\n padding-top: var(--n-padding-bottom);\n ")])])])]),
			U("footer", "\n box-sizing: border-box;\n padding: 0 var(--n-padding-left) var(--n-padding-bottom) var(--n-padding-left);\n font-size: var(--n-font-size);\n ", [V("&:first-child", "\n padding-top: var(--n-padding-bottom);\n ")]),
			U("action", "\n background-color: var(--n-action-color);\n padding: var(--n-padding-bottom) var(--n-padding-left);\n border-bottom-left-radius: var(--n-border-radius);\n border-bottom-right-radius: var(--n-border-radius);\n ")
		]),
		H("card-cover", "\n overflow: hidden;\n width: 100%;\n border-radius: var(--n-border-radius) var(--n-border-radius) 0 0;\n ", [V("img", "\n display: block;\n width: 100%;\n ")]),
		W("bordered", "\n border: 1px solid var(--n-border-color);\n ", [V("&:target", "border-color: var(--n-color-target);")]),
		W("action-segmented", [V(">", [U("action", [V("&:not(:first-child)", "\n border-top: 1px solid var(--n-border-color);\n ")])])]),
		W("content-segmented, content-soft-segmented", [V(">", [H("card-content", "\n transition: border-color 0.3s var(--n-bezier);\n ", [V("&:not(:first-child)", "\n border-top: 1px solid var(--n-border-color);\n ")]), U("content-scrollbar", "\n transition: border-color 0.3s var(--n-bezier);\n ", [V("&:not(:first-child)", "\n border-top: 1px solid var(--n-border-color);\n ")])])]),
		W("footer-segmented, footer-soft-segmented", [V(">", [U("footer", "\n transition: border-color 0.3s var(--n-bezier);\n ", [V("&:not(:first-child)", "\n border-top: 1px solid var(--n-border-color);\n ")])])]),
		W("embedded", "\n background-color: var(--n-color-embedded);\n ")
	]),
	As(H("card", "\n background: var(--n-color-modal);\n ", [W("embedded", "\n background-color: var(--n-color-embedded-modal);\n ")])),
	js(H("card", "\n background: var(--n-color-popover);\n ", [W("embedded", "\n background-color: var(--n-color-embedded-popover);\n ")]))
]), Wg = {
	title: [String, Function],
	contentClass: String,
	contentStyle: [Object, String],
	contentScrollable: Boolean,
	headerClass: String,
	headerStyle: [Object, String],
	headerExtraClass: String,
	headerExtraStyle: [Object, String],
	footerClass: String,
	footerStyle: [Object, String],
	embedded: Boolean,
	segmented: {
		type: [Boolean, Object],
		default: !1
	},
	size: String,
	bordered: {
		type: Boolean,
		default: !0
	},
	closable: Boolean,
	hoverable: Boolean,
	role: String,
	onClose: [Function, Array],
	tag: {
		type: String,
		default: "div"
	},
	cover: Function,
	content: [String, Function],
	footer: Function,
	action: Function,
	headerExtra: Function,
	closeFocusable: Boolean
};
Of(Wg);
var Gg = /* @__PURE__ */ I({
	name: "Card",
	props: {
		...Xp.props,
		...Wg
	},
	slots: Object,
	setup(e) {
		let t = () => {
			let { onClose: t } = e;
			t && ym(t);
		}, { inlineThemeDisabled: n, mergedClsPrefixRef: r, mergedRtlRef: i, mergedComponentPropsRef: a } = jf(e), o = Xp("Card", "-card", Ug, Bg, e, r), s = Cm("Card", i, r), c = z(() => e.size || a?.value?.Card?.size || "medium"), l = z(() => {
			let e = c.value, { self: { color: t, colorModal: n, colorTarget: r, textColor: i, titleTextColor: a, titleFontWeight: s, borderColor: l, actionColor: u, borderRadius: d, lineHeight: f, closeIconColor: p, closeIconColorHover: m, closeIconColorPressed: h, closeColorHover: g, closeColorPressed: _, closeBorderRadius: v, closeIconSize: y, closeSize: b, boxShadow: x, colorPopover: S, colorEmbedded: C, colorEmbeddedModal: w, colorEmbeddedPopover: T, [G("padding", e)]: E, [G("fontSize", e)]: D, [G("titleFontSize", e)]: O }, common: { cubicBezierEaseInOut: k } } = o.value, { top: A, left: ee, bottom: j } = Zf(E);
			return {
				"--n-bezier": k,
				"--n-border-radius": d,
				"--n-color": t,
				"--n-color-modal": n,
				"--n-color-popover": S,
				"--n-color-embedded": C,
				"--n-color-embedded-modal": w,
				"--n-color-embedded-popover": T,
				"--n-color-target": r,
				"--n-text-color": i,
				"--n-line-height": f,
				"--n-action-color": u,
				"--n-title-text-color": a,
				"--n-title-font-weight": s,
				"--n-close-icon-color": p,
				"--n-close-icon-color-hover": m,
				"--n-close-icon-color-pressed": h,
				"--n-close-color-hover": g,
				"--n-close-color-pressed": _,
				"--n-border-color": l,
				"--n-box-shadow": x,
				"--n-padding-top": A,
				"--n-padding-bottom": j,
				"--n-padding-left": ee,
				"--n-font-size": D,
				"--n-title-font-size": O,
				"--n-close-size": b,
				"--n-close-icon-size": y,
				"--n-close-border-radius": v
			};
		}), u = n ? Jp("card", z(() => c.value[0]), l, e) : void 0;
		return {
			rtlEnabled: s,
			mergedClsPrefix: r,
			mergedTheme: o,
			handleCloseClick: t,
			cssVars: n ? void 0 : l,
			themeClass: u?.themeClass,
			onRender: u?.onRender
		};
	},
	render() {
		let { segmented: e, bordered: t, hoverable: n, mergedClsPrefix: r, rtlEnabled: i, onRender: a, embedded: o, tag: s, $slots: c } = this;
		return a?.(), L(), Ui(s, {
			class: q([
				`${r}-card`,
				this.themeClass,
				o && `${r}-card--embedded`,
				{
					[`${r}-card--rtl`]: i,
					[`${r}-card--content-scrollable`]: this.contentScrollable,
					[`${r}-card--content${typeof e != "boolean" && e.content === "soft" ? "-soft" : ""}-segmented`]: e === !0 || e !== !1 && e.content,
					[`${r}-card--footer${typeof e != "boolean" && e.footer === "soft" ? "-soft" : ""}-segmented`]: e === !0 || e !== !1 && e.footer,
					[`${r}-card--action-segmented`]: e === !0 || e !== !1 && e.action,
					[`${r}-card--bordered`]: t,
					[`${r}-card--hoverable`]: n
				}
			]),
			style: M(this.cssVars),
			role: this.role
		}, {
			default: Gn(() => [
				K(() => xm(c.cover, (e) => {
					let t = this.cover ? bm([this.cover()]) : e;
					return t && (L(), R("div", {
						class: q(`${r}-card-cover`),
						role: "none"
					}, [K(() => t)], 2));
				})),
				K(() => xm(c.header, (e) => {
					let { title: t } = this, n = t ? bm(typeof t == "function" ? [t()] : [t]) : e;
					return n || this.closable ? (L(), R("div", {
						key: 1,
						class: q([`${r}-card-header`, this.headerClass]),
						style: M(this.headerStyle),
						role: "heading"
					}, [
						Ji("div", {
							class: q(`${r}-card-header__main`),
							role: "heading"
						}, [K(() => n)], 2),
						K(() => xm(c["header-extra"], (e) => {
							let t = this.headerExtra ? bm([this.headerExtra()]) : e;
							return t && (L(), R("div", {
								class: q([`${r}-card-header__extra`, this.headerExtraClass]),
								style: M(this.headerExtraStyle)
							}, [K(() => t)], 6));
						})),
						K(() => this.closable && (L(), Ui(Rh, {
							clsPrefix: r,
							class: q(`${r}-card-header__close`),
							onClick: this.handleCloseClick,
							focusable: this.closeFocusable,
							absolute: !0
						}, null, 8, [
							"clsPrefix",
							"class",
							"onClick",
							"focusable"
						])))
					], 6)) : null;
				})),
				K(() => xm(c.default, (e) => {
					let { content: t } = this, n = t ? bm(typeof t == "function" ? [t()] : [t]) : e;
					return n ? this.contentScrollable ? (L(), Ui(jh, {
						key: 2,
						class: q(`${r}-card__content-scrollbar`),
						contentClass: [`${r}-card-content`, this.contentClass],
						contentStyle: this.contentStyle
					}, { default: () => n }, 1032, [
						"class",
						"contentClass",
						"contentStyle"
					])) : (L(), R("div", {
						key: 3,
						class: q([`${r}-card-content`, this.contentClass]),
						style: M(this.contentStyle),
						role: "none"
					}, [K(() => n)], 6)) : null;
				})),
				K(() => xm(c.footer, (e) => {
					let t = this.footer ? bm([this.footer()]) : e;
					return t && (L(), R("div", {
						class: q([`${r}-card__footer`, this.footerClass]),
						style: M(this.footerStyle),
						role: "none"
					}, [K(() => t)], 6));
				})),
				K(() => xm(c.action, (e) => {
					let t = this.action ? bm([this.action()]) : e;
					return t && (L(), R("div", {
						class: q(`${r}-card__action`),
						role: "none"
					}, [K(() => t)], 2));
				}))
			]),
			_: 2
		}, 1032, [
			"class",
			"style",
			"role"
		]);
	}
});
//#endregion
//#region node_modules/naive-ui/es/carousel/styles/light.mjs
function Kg() {
	return {
		dotSize: "8px",
		dotColor: "rgba(255, 255, 255, .3)",
		dotColorActive: "rgba(255, 255, 255, 1)",
		dotColorFocus: "rgba(255, 255, 255, .5)",
		dotLineWidth: "16px",
		dotLineWidthActive: "24px",
		arrowColor: "#eee"
	};
}
//#endregion
//#region node_modules/naive-ui/es/checkbox/styles/_common.mjs
var qg = {
	sizeSmall: "14px",
	sizeMedium: "16px",
	sizeLarge: "18px",
	labelPadding: "0 8px",
	labelFontWeight: "400"
};
//#endregion
//#region node_modules/naive-ui/es/checkbox/styles/light.mjs
function Jg(e) {
	let { baseColor: t, inputColorDisabled: n, cardColor: r, modalColor: i, popoverColor: a, textColorDisabled: o, borderColor: s, primaryColor: c, textColor2: l, fontSizeSmall: u, fontSizeMedium: d, fontSizeLarge: f, borderRadiusSmall: p, lineHeight: m } = e;
	return {
		...qg,
		labelLineHeight: m,
		fontSizeSmall: u,
		fontSizeMedium: d,
		fontSizeLarge: f,
		borderRadius: p,
		color: t,
		colorChecked: c,
		colorDisabled: n,
		colorDisabledChecked: n,
		colorTableHeader: r,
		colorTableHeaderModal: i,
		colorTableHeaderPopover: a,
		checkMarkColor: t,
		checkMarkColorDisabled: o,
		checkMarkColorDisabledChecked: o,
		border: `1px solid ${s}`,
		borderDisabled: `1px solid ${s}`,
		borderDisabledChecked: `1px solid ${s}`,
		borderChecked: `1px solid ${c}`,
		borderFocus: `1px solid ${c}`,
		boxShadowFocus: `0 0 0 2px ${Y(c, { alpha: .3 })}`,
		textColor: l,
		textColorDisabled: o
	};
}
var Yg = {
	name: "Checkbox",
	common: Q,
	self(e) {
		let { cardColor: t } = e, n = Jg(e);
		return n.color = "#0000", n.checkMarkColor = t, n;
	}
};
//#endregion
//#region node_modules/naive-ui/es/cascader/styles/light.mjs
function Xg(e) {
	let { borderRadius: t, boxShadow2: n, popoverColor: r, textColor2: i, textColor3: a, primaryColor: o, textColorDisabled: s, dividerColor: c, hoverColor: l, fontSizeMedium: u, heightMedium: d } = e;
	return {
		menuBorderRadius: t,
		menuColor: r,
		menuBoxShadow: n,
		menuDividerColor: c,
		menuHeight: "calc(var(--n-option-height) * 6.6)",
		optionArrowColor: a,
		optionHeight: d,
		optionFontSize: u,
		optionColorHover: l,
		optionTextColor: i,
		optionTextColorActive: o,
		optionTextColorDisabled: s,
		optionCheckMarkColor: o,
		loadingColor: o,
		columnWidth: "180px"
	};
}
//#endregion
//#region node_modules/naive-ui/es/cascader/styles/dark.mjs
var Zg = {
	name: "Cascader",
	common: Q,
	peers: {
		InternalSelectMenu: nm,
		InternalSelection: Bh,
		Scrollbar: Up,
		Checkbox: Yg,
		Empty: Kp
	},
	self: Xg
}, Qg = {
	name: "Code",
	common: Q,
	self(e) {
		let { textColor2: t, fontSize: n, fontWeightStrong: r, textColor3: i } = e;
		return {
			textColor: t,
			fontSize: n,
			fontWeightStrong: r,
			"mono-3": "#5c6370",
			"hue-1": "#56b6c2",
			"hue-2": "#61aeee",
			"hue-3": "#c678dd",
			"hue-4": "#98c379",
			"hue-5": "#e06c75",
			"hue-5-2": "#be5046",
			"hue-6": "#d19a66",
			"hue-6-2": "#e6c07b",
			lineNumberTextColor: i
		};
	}
};
//#endregion
//#region node_modules/naive-ui/es/collapse/styles/light.mjs
function $g(e) {
	let { fontWeight: t, textColor1: n, textColor2: r, textColorDisabled: i, dividerColor: a, fontSize: o } = e;
	return {
		titleFontSize: o,
		titleFontWeight: t,
		dividerColor: a,
		titleTextColor: n,
		titleTextColorDisabled: i,
		fontSize: o,
		textColor: r,
		arrowColor: r,
		arrowColorDisabled: i,
		itemMargin: "16px 0 0 0",
		titlePadding: "16px 0 0 0"
	};
}
//#endregion
//#region node_modules/naive-ui/es/collapse/styles/dark.mjs
var e_ = {
	name: "Collapse",
	common: Q,
	self: $g
};
//#endregion
//#region node_modules/naive-ui/es/collapse-transition/styles/light.mjs
function t_(e) {
	let { cubicBezierEaseInOut: t } = e;
	return { bezier: t };
}
//#endregion
//#region node_modules/naive-ui/es/color-picker/styles/light.mjs
function n_(e) {
	let { fontSize: t, boxShadow2: n, popoverColor: r, textColor2: i, borderRadius: a, borderColor: o, heightSmall: s, heightMedium: c, heightLarge: l, fontSizeSmall: u, fontSizeMedium: d, fontSizeLarge: f, dividerColor: p } = e;
	return {
		panelFontSize: t,
		boxShadow: n,
		color: r,
		textColor: i,
		borderRadius: a,
		border: `1px solid ${o}`,
		heightSmall: s,
		heightMedium: c,
		heightLarge: l,
		fontSizeSmall: u,
		fontSizeMedium: d,
		fontSizeLarge: f,
		dividerColor: p
	};
}
var r_ = /* @__PURE__ */ I({
	name: "ConfigProvider",
	alias: ["App"],
	props: {
		abstract: Boolean,
		bordered: {
			type: Boolean,
			default: void 0
		},
		clsPrefix: String,
		locale: Object,
		dateLocale: Object,
		namespace: String,
		rtl: Array,
		tag: {
			type: String,
			default: "div"
		},
		hljs: Object,
		katex: Object,
		theme: Object,
		themeOverrides: Object,
		componentOptions: Object,
		icons: Object,
		breakpoints: Object,
		preflightStyleDisabled: Boolean,
		styleMountTarget: Object,
		inlineThemeDisabled: {
			type: Boolean,
			default: void 0
		},
		as: {
			type: String,
			validator: () => (Ef("config-provider", "`as` is deprecated, please use `tag` instead."), !0),
			default: void 0
		}
	},
	setup(e) {
		let t = Jn(Af, null), n = z(() => {
			let { theme: n } = e;
			if (n === null) return;
			let r = t?.mergedThemeRef.value;
			return n === void 0 ? r : r === void 0 ? n : Object.assign({}, r, n);
		}), r = z(() => {
			let { themeOverrides: n } = e;
			if (n !== null) {
				if (n === void 0) return t?.mergedThemeOverridesRef.value;
				{
					let e = t?.mergedThemeOverridesRef.value;
					return e === void 0 ? n : Tf({}, e, n);
				}
			}
		}), i = hm(() => {
			let { namespace: n } = e;
			return n === void 0 ? t?.mergedNamespaceRef.value : n;
		}), a = hm(() => {
			let { bordered: n } = e;
			return n === void 0 ? t?.mergedBorderedRef.value : n;
		}), o = z(() => {
			let { icons: n } = e;
			return n === void 0 ? t?.mergedIconsRef.value : n;
		}), s = z(() => {
			let { componentOptions: n } = e;
			return n === void 0 ? t?.mergedComponentPropsRef.value : n;
		}), c = z(() => {
			let { clsPrefix: n } = e;
			return n === void 0 ? t ? t.mergedClsPrefixRef.value : "n" : n;
		}), l = z(() => {
			let { rtl: n } = e;
			if (n === void 0) return t?.mergedRtlRef.value;
			let r = {};
			for (let e of n) r[e.name] = $t(e), e.peers?.forEach((e) => {
				e.name in r || (r[e.name] = $t(e));
			});
			return r;
		}), u = z(() => e.breakpoints || t?.mergedBreakpointsRef.value), d = e.inlineThemeDisabled || t?.inlineThemeDisabled, f = e.preflightStyleDisabled || t?.preflightStyleDisabled, p = e.styleMountTarget || t?.styleMountTarget;
		return qn(Af, {
			mergedThemeHashRef: z(() => {
				let { value: e } = n, { value: t } = r, i = t && Object.keys(t).length !== 0, a = e?.name;
				return a ? i ? `${a}-${fs(JSON.stringify(r.value))}` : a : i ? fs(JSON.stringify(r.value)) : "";
			}),
			mergedBreakpointsRef: u,
			mergedRtlRef: l,
			mergedIconsRef: o,
			mergedComponentPropsRef: s,
			mergedBorderedRef: a,
			mergedNamespaceRef: i,
			mergedClsPrefixRef: c,
			mergedLocaleRef: z(() => {
				let { locale: n } = e;
				if (n !== null) return n === void 0 ? t?.mergedLocaleRef.value : n;
			}),
			mergedDateLocaleRef: z(() => {
				let { dateLocale: n } = e;
				if (n !== null) return n === void 0 ? t?.mergedDateLocaleRef.value : n;
			}),
			mergedHljsRef: z(() => {
				let { hljs: n } = e;
				return n === void 0 ? t?.mergedHljsRef.value : n;
			}),
			mergedKatexRef: z(() => {
				let { katex: n } = e;
				return n === void 0 ? t?.mergedKatexRef.value : n;
			}),
			mergedThemeRef: n,
			mergedThemeOverridesRef: r,
			inlineThemeDisabled: d || !1,
			preflightStyleDisabled: f || !1,
			styleMountTarget: p
		}), {
			mergedClsPrefix: c,
			mergedBordered: a,
			mergedNamespace: i,
			mergedTheme: n,
			mergedThemeOverrides: r
		};
	},
	render() {
		return this.abstract ? this.$slots.default?.() : B(this.as || this.tag, { class: `${this.mergedClsPrefix || "n"}-config-provider` }, this.$slots.default?.());
	}
}), i_ = {
	name: "Popselect",
	common: Q,
	peers: {
		Popover: am,
		InternalSelectMenu: nm
	}
};
//#endregion
//#region node_modules/naive-ui/es/select/styles/light.mjs
function a_(e) {
	let { boxShadow2: t } = e;
	return { menuBoxShadow: t };
}
var o_ = {
	name: "Select",
	common: Q,
	peers: {
		InternalSelection: Bh,
		InternalSelectMenu: nm
	},
	self: a_
}, s_ = {
	itemPaddingSmall: "0 4px",
	itemMarginSmall: "0 0 0 8px",
	itemMarginSmallRtl: "0 8px 0 0",
	itemPaddingMedium: "0 4px",
	itemMarginMedium: "0 0 0 8px",
	itemMarginMediumRtl: "0 8px 0 0",
	itemPaddingLarge: "0 4px",
	itemMarginLarge: "0 0 0 8px",
	itemMarginLargeRtl: "0 8px 0 0",
	buttonIconSizeSmall: "14px",
	buttonIconSizeMedium: "16px",
	buttonIconSizeLarge: "18px",
	inputWidthSmall: "60px",
	selectWidthSmall: "unset",
	inputMarginSmall: "0 0 0 8px",
	inputMarginSmallRtl: "0 8px 0 0",
	selectMarginSmall: "0 0 0 8px",
	prefixMarginSmall: "0 8px 0 0",
	suffixMarginSmall: "0 0 0 8px",
	inputWidthMedium: "60px",
	selectWidthMedium: "unset",
	inputMarginMedium: "0 0 0 8px",
	inputMarginMediumRtl: "0 8px 0 0",
	selectMarginMedium: "0 0 0 8px",
	prefixMarginMedium: "0 8px 0 0",
	suffixMarginMedium: "0 0 0 8px",
	inputWidthLarge: "60px",
	selectWidthLarge: "unset",
	inputMarginLarge: "0 0 0 8px",
	inputMarginLargeRtl: "0 8px 0 0",
	selectMarginLarge: "0 0 0 8px",
	prefixMarginLarge: "0 8px 0 0",
	suffixMarginLarge: "0 0 0 8px"
};
//#endregion
//#region node_modules/naive-ui/es/pagination/styles/light.mjs
function c_(e) {
	let { textColor2: t, primaryColor: n, primaryColorHover: r, primaryColorPressed: i, inputColorDisabled: a, textColorDisabled: o, borderColor: s, borderRadius: c, fontSizeTiny: l, fontSizeSmall: u, fontSizeMedium: d, heightTiny: f, heightSmall: p, heightMedium: m } = e;
	return {
		...s_,
		buttonColor: "#0000",
		buttonColorHover: "#0000",
		buttonColorPressed: "#0000",
		buttonBorder: `1px solid ${s}`,
		buttonBorderHover: `1px solid ${s}`,
		buttonBorderPressed: `1px solid ${s}`,
		buttonIconColor: t,
		buttonIconColorHover: t,
		buttonIconColorPressed: t,
		itemTextColor: t,
		itemTextColorHover: r,
		itemTextColorPressed: i,
		itemTextColorActive: n,
		itemTextColorDisabled: o,
		itemColor: "#0000",
		itemColorHover: "#0000",
		itemColorPressed: "#0000",
		itemColorActive: "#0000",
		itemColorActiveHover: "#0000",
		itemColorDisabled: a,
		itemBorder: "1px solid #0000",
		itemBorderHover: "1px solid #0000",
		itemBorderPressed: "1px solid #0000",
		itemBorderActive: `1px solid ${n}`,
		itemBorderDisabled: `1px solid ${s}`,
		itemBorderRadius: c,
		itemSizeSmall: f,
		itemSizeMedium: p,
		itemSizeLarge: m,
		itemFontSizeSmall: l,
		itemFontSizeMedium: u,
		itemFontSizeLarge: d,
		jumperFontSizeSmall: l,
		jumperFontSizeMedium: u,
		jumperFontSizeLarge: d,
		jumperTextColor: t,
		jumperTextColorDisabled: o
	};
}
var l_ = {
	name: "Pagination",
	common: Q,
	peers: {
		Select: o_,
		Input: Yh,
		Popselect: i_
	},
	self(e) {
		let { primaryColor: t, opacity3: n } = e, r = Y(t, { alpha: Number(n) }), i = c_(e);
		return i.itemBorderActive = `1px solid ${r}`, i.itemBorderDisabled = "1px solid #0000", i;
	}
}, u_ = {
	padding: "4px 0",
	optionIconSizeSmall: "14px",
	optionIconSizeMedium: "16px",
	optionIconSizeLarge: "16px",
	optionIconSizeHuge: "18px",
	optionSuffixWidthSmall: "14px",
	optionSuffixWidthMedium: "14px",
	optionSuffixWidthLarge: "16px",
	optionSuffixWidthHuge: "16px",
	optionIconSuffixWidthSmall: "32px",
	optionIconSuffixWidthMedium: "32px",
	optionIconSuffixWidthLarge: "36px",
	optionIconSuffixWidthHuge: "36px",
	optionPrefixWidthSmall: "14px",
	optionPrefixWidthMedium: "14px",
	optionPrefixWidthLarge: "16px",
	optionPrefixWidthHuge: "16px",
	optionIconPrefixWidthSmall: "36px",
	optionIconPrefixWidthMedium: "36px",
	optionIconPrefixWidthLarge: "40px",
	optionIconPrefixWidthHuge: "40px"
};
//#endregion
//#region node_modules/naive-ui/es/dropdown/styles/light.mjs
function d_(e) {
	let { primaryColor: t, textColor2: n, dividerColor: r, hoverColor: i, popoverColor: a, invertedColor: o, borderRadius: s, fontSizeSmall: c, fontSizeMedium: l, fontSizeLarge: u, fontSizeHuge: d, heightSmall: f, heightMedium: p, heightLarge: m, heightHuge: h, textColor3: g, opacityDisabled: _ } = e;
	return {
		...u_,
		optionHeightSmall: f,
		optionHeightMedium: p,
		optionHeightLarge: m,
		optionHeightHuge: h,
		borderRadius: s,
		fontSizeSmall: c,
		fontSizeMedium: l,
		fontSizeLarge: u,
		fontSizeHuge: d,
		optionTextColor: n,
		optionTextColorHover: n,
		optionTextColorActive: t,
		optionTextColorChildActive: t,
		color: a,
		dividerColor: r,
		suffixColor: n,
		prefixColor: n,
		optionColorHover: i,
		optionColorActive: Y(t, { alpha: .1 }),
		groupHeaderTextColor: g,
		optionTextColorInverted: "#BBB",
		optionTextColorHoverInverted: "#FFF",
		optionTextColorActiveInverted: "#FFF",
		optionTextColorChildActiveInverted: "#FFF",
		colorInverted: o,
		dividerColorInverted: "#BBB",
		suffixColorInverted: "#BBB",
		prefixColorInverted: "#BBB",
		optionColorHoverInverted: t,
		optionColorActiveInverted: t,
		groupHeaderTextColorInverted: "#AAA",
		optionOpacityDisabled: _
	};
}
var f_ = {
	name: "Dropdown",
	common: Q,
	peers: { Popover: am },
	self(e) {
		let { primaryColorSuppl: t, primaryColor: n, popoverColor: r } = e, i = d_(e);
		return i.colorInverted = r, i.optionColorActive = Y(n, { alpha: .15 }), i.optionColorActiveInverted = t, i.optionColorHoverInverted = t, i;
	}
}, p_ = { padding: "8px 14px" }, m_ = {
	name: "Tooltip",
	common: Q,
	peers: { Popover: am },
	self(e) {
		let { borderRadius: t, boxShadow2: n, popoverColor: r, textColor2: i } = e;
		return {
			...p_,
			borderRadius: t,
			boxShadow: n,
			color: r,
			textColor: i
		};
	}
}, h_ = {
	radioSizeSmall: "14px",
	radioSizeMedium: "16px",
	radioSizeLarge: "18px",
	labelPadding: "0 8px",
	labelFontWeight: "400"
}, g_ = {
	name: "Radio",
	common: Q,
	self(e) {
		let { borderColor: t, primaryColor: n, baseColor: r, textColorDisabled: i, inputColorDisabled: a, textColor2: o, opacityDisabled: s, borderRadius: c, fontSizeSmall: l, fontSizeMedium: u, fontSizeLarge: d, heightSmall: f, heightMedium: p, heightLarge: m, lineHeight: h } = e;
		return {
			...h_,
			labelLineHeight: h,
			buttonHeightSmall: f,
			buttonHeightMedium: p,
			buttonHeightLarge: m,
			fontSizeSmall: l,
			fontSizeMedium: u,
			fontSizeLarge: d,
			boxShadow: `inset 0 0 0 1px ${t}`,
			boxShadowActive: `inset 0 0 0 1px ${n}`,
			boxShadowFocus: `inset 0 0 0 1px ${n}, 0 0 0 2px ${Y(n, { alpha: .3 })}`,
			boxShadowHover: `inset 0 0 0 1px ${n}`,
			boxShadowDisabled: `inset 0 0 0 1px ${t}`,
			color: "#0000",
			colorDisabled: a,
			colorActive: "#0000",
			textColor: o,
			textColorDisabled: i,
			dotColorActive: n,
			dotColorDisabled: t,
			buttonBorderColor: t,
			buttonBorderColorActive: n,
			buttonBorderColorHover: n,
			buttonColor: "#0000",
			buttonColorActive: n,
			buttonTextColor: o,
			buttonTextColorActive: r,
			buttonTextColorHover: n,
			opacityDisabled: s,
			buttonBoxShadowFocus: `inset 0 0 0 1px ${n}, 0 0 0 2px ${Y(n, { alpha: .3 })}`,
			buttonBoxShadowHover: `inset 0 0 0 1px ${n}`,
			buttonBoxShadow: "inset 0 0 0 1px #0000",
			buttonBorderRadius: c
		};
	}
}, __ = {
	name: "Ellipsis",
	common: Q,
	peers: { Tooltip: m_ }
}, v_ = {
	thPaddingSmall: "8px",
	thPaddingMedium: "12px",
	thPaddingLarge: "12px",
	tdPaddingSmall: "8px",
	tdPaddingMedium: "12px",
	tdPaddingLarge: "12px",
	sorterSize: "15px",
	resizableContainerSize: "8px",
	resizableSize: "2px",
	filterSize: "15px",
	paginationMargin: "12px 0 0 0",
	emptyPadding: "48px 0",
	actionPadding: "8px 12px",
	actionButtonMargin: "0 8px 0 0"
};
//#endregion
//#region node_modules/naive-ui/es/data-table/styles/light.mjs
function y_(e) {
	let { cardColor: t, modalColor: n, popoverColor: r, textColor2: i, textColor1: a, tableHeaderColor: o, tableColorHover: s, iconColor: c, primaryColor: l, fontWeightStrong: u, borderRadius: d, lineHeight: f, fontSizeSmall: p, fontSizeMedium: m, fontSizeLarge: h, dividerColor: g, heightSmall: _, opacityDisabled: v, tableColorStriped: y } = e;
	return {
		...v_,
		actionDividerColor: g,
		lineHeight: f,
		borderRadius: d,
		fontSizeSmall: p,
		fontSizeMedium: m,
		fontSizeLarge: h,
		borderColor: J(t, g),
		tdColorHover: J(t, s),
		tdColorSorting: J(t, s),
		tdColorStriped: J(t, y),
		thColor: J(t, o),
		thColorHover: J(J(t, o), s),
		thColorSorting: J(J(t, o), s),
		tdColor: t,
		tdTextColor: i,
		thTextColor: a,
		thFontWeight: u,
		thButtonColorHover: s,
		thIconColor: c,
		thIconColorActive: l,
		borderColorModal: J(n, g),
		tdColorHoverModal: J(n, s),
		tdColorSortingModal: J(n, s),
		tdColorStripedModal: J(n, y),
		thColorModal: J(n, o),
		thColorHoverModal: J(J(n, o), s),
		thColorSortingModal: J(J(n, o), s),
		tdColorModal: n,
		borderColorPopover: J(r, g),
		tdColorHoverPopover: J(r, s),
		tdColorSortingPopover: J(r, s),
		tdColorStripedPopover: J(r, y),
		thColorPopover: J(r, o),
		thColorHoverPopover: J(J(r, o), s),
		thColorSortingPopover: J(J(r, o), s),
		tdColorPopover: r,
		boxShadowBefore: "inset -12px 0 8px -12px rgba(0, 0, 0, .18)",
		boxShadowAfter: "inset 12px 0 8px -12px rgba(0, 0, 0, .18)",
		loadingColor: l,
		loadingSize: _,
		opacityLoading: v
	};
}
//#endregion
//#region node_modules/naive-ui/es/data-table/styles/dark.mjs
var b_ = {
	name: "DataTable",
	common: Q,
	peers: {
		Button: Ag,
		Checkbox: Yg,
		Radio: g_,
		Pagination: l_,
		Scrollbar: Up,
		Empty: qp,
		Popover: am,
		Ellipsis: __,
		Dropdown: f_
	},
	self(e) {
		let t = y_(e);
		return t.boxShadowAfter = "inset 12px 0 8px -12px rgba(0, 0, 0, .36)", t.boxShadowBefore = "inset -12px 0 8px -12px rgba(0, 0, 0, .36)", t;
	}
};
//#endregion
//#region node_modules/naive-ui/es/icon/styles/light.mjs
function x_(e) {
	let { textColorBase: t, opacity1: n, opacity2: r, opacity3: i, opacity4: a, opacity5: o } = e;
	return {
		color: t,
		opacity1Depth: n,
		opacity2Depth: r,
		opacity3Depth: i,
		opacity4Depth: a,
		opacity5Depth: o
	};
}
//#endregion
//#region node_modules/naive-ui/es/icon/styles/dark.mjs
var S_ = {
	name: "Icon",
	common: Q,
	self: x_
}, C_ = {
	itemFontSize: "12px",
	itemHeight: "36px",
	itemWidth: "52px",
	panelActionPadding: "8px 0"
};
//#endregion
//#region node_modules/naive-ui/es/time-picker/styles/light.mjs
function w_(e) {
	let { popoverColor: t, textColor2: n, primaryColor: r, hoverColor: i, dividerColor: a, opacityDisabled: o, boxShadow2: s, borderRadius: c, iconColor: l, iconColorDisabled: u } = e;
	return {
		...C_,
		panelColor: t,
		panelBoxShadow: s,
		panelDividerColor: a,
		itemTextColor: n,
		itemTextColorActive: r,
		itemColorHover: i,
		itemOpacityDisabled: o,
		itemBorderRadius: c,
		borderRadius: c,
		iconColor: l,
		iconColorDisabled: u
	};
}
var T_ = {
	name: "TimePicker",
	common: Q,
	peers: {
		Scrollbar: Up,
		Button: Ag,
		Input: Yh
	},
	self: w_
}, E_ = {
	itemSize: "24px",
	itemCellWidth: "38px",
	itemCellHeight: "32px",
	scrollItemWidth: "80px",
	scrollItemHeight: "40px",
	panelExtraFooterPadding: "8px 12px",
	panelActionPadding: "8px 12px",
	calendarTitlePadding: "0",
	calendarTitleHeight: "28px",
	arrowSize: "14px",
	panelHeaderPadding: "8px 12px",
	calendarDaysHeight: "32px",
	calendarTitleGridTempateColumns: "28px 28px 1fr 28px 28px",
	calendarLeftPaddingDate: "6px 12px 4px 12px",
	calendarLeftPaddingDatetime: "4px 12px",
	calendarLeftPaddingDaterange: "6px 12px 4px 12px",
	calendarLeftPaddingDatetimerange: "4px 12px",
	calendarLeftPaddingMonth: "0",
	calendarLeftPaddingYear: "0",
	calendarLeftPaddingQuarter: "0",
	calendarLeftPaddingMonthrange: "0",
	calendarLeftPaddingQuarterrange: "0",
	calendarLeftPaddingYearrange: "0",
	calendarLeftPaddingWeek: "6px 12px 4px 12px",
	calendarRightPaddingDate: "6px 12px 4px 12px",
	calendarRightPaddingDatetime: "4px 12px",
	calendarRightPaddingDaterange: "6px 12px 4px 12px",
	calendarRightPaddingDatetimerange: "4px 12px",
	calendarRightPaddingMonth: "0",
	calendarRightPaddingYear: "0",
	calendarRightPaddingQuarter: "0",
	calendarRightPaddingMonthrange: "0",
	calendarRightPaddingQuarterrange: "0",
	calendarRightPaddingYearrange: "0",
	calendarRightPaddingWeek: "0"
};
//#endregion
//#region node_modules/naive-ui/es/date-picker/styles/light.mjs
function D_(e) {
	let { hoverColor: t, fontSize: n, textColor2: r, textColorDisabled: i, popoverColor: a, primaryColor: o, borderRadiusSmall: s, iconColor: c, iconColorDisabled: l, textColor1: u, dividerColor: d, boxShadow2: f, borderRadius: p, fontWeightStrong: m } = e;
	return {
		...E_,
		itemFontSize: n,
		calendarDaysFontSize: n,
		calendarTitleFontSize: n,
		itemTextColor: r,
		itemTextColorDisabled: i,
		itemTextColorActive: a,
		itemTextColorCurrent: o,
		itemColorIncluded: Y(o, { alpha: .1 }),
		itemColorHover: t,
		itemColorDisabled: t,
		itemColorActive: o,
		itemBorderRadius: s,
		panelColor: a,
		panelTextColor: r,
		arrowColor: c,
		calendarTitleTextColor: u,
		calendarTitleColorHover: t,
		calendarDaysTextColor: r,
		panelHeaderDividerColor: d,
		calendarDaysDividerColor: d,
		calendarDividerColor: d,
		panelActionDividerColor: d,
		panelBoxShadow: f,
		panelBorderRadius: p,
		calendarTitleFontWeight: m,
		scrollItemBorderRadius: p,
		iconColor: c,
		iconColorDisabled: l
	};
}
//#endregion
//#region node_modules/naive-ui/es/date-picker/styles/dark.mjs
var O_ = {
	name: "DatePicker",
	common: Q,
	peers: {
		Input: Yh,
		Button: Ag,
		TimePicker: T_,
		Scrollbar: Up
	},
	self(e) {
		let { popoverColor: t, hoverColor: n, primaryColor: r } = e, i = D_(e);
		return i.itemColorDisabled = J(t, n), i.itemColorIncluded = Y(r, { alpha: .15 }), i.itemColorHover = J(t, n), i;
	}
}, k_ = {
	thPaddingBorderedSmall: "8px 12px",
	thPaddingBorderedMedium: "12px 16px",
	thPaddingBorderedLarge: "16px 24px",
	thPaddingSmall: "0",
	thPaddingMedium: "0",
	thPaddingLarge: "0",
	tdPaddingBorderedSmall: "8px 12px",
	tdPaddingBorderedMedium: "12px 16px",
	tdPaddingBorderedLarge: "16px 24px",
	tdPaddingSmall: "0 0 8px 0",
	tdPaddingMedium: "0 0 12px 0",
	tdPaddingLarge: "0 0 16px 0"
};
//#endregion
//#region node_modules/naive-ui/es/descriptions/styles/light.mjs
function A_(e) {
	let { tableHeaderColor: t, textColor2: n, textColor1: r, cardColor: i, modalColor: a, popoverColor: o, dividerColor: s, borderRadius: c, fontWeightStrong: l, lineHeight: u, fontSizeSmall: d, fontSizeMedium: f, fontSizeLarge: p } = e;
	return {
		...k_,
		lineHeight: u,
		fontSizeSmall: d,
		fontSizeMedium: f,
		fontSizeLarge: p,
		titleTextColor: r,
		thColor: J(i, t),
		thColorModal: J(a, t),
		thColorPopover: J(o, t),
		thTextColor: r,
		thFontWeight: l,
		tdTextColor: n,
		tdColor: i,
		tdColorModal: a,
		tdColorPopover: o,
		borderColor: J(i, s),
		borderColorModal: J(a, s),
		borderColorPopover: J(o, s),
		borderRadius: c
	};
}
//#endregion
//#region node_modules/naive-ui/es/descriptions/styles/dark.mjs
var j_ = {
	name: "Descriptions",
	common: Q,
	self: A_
}, M_ = {
	titleFontSize: "18px",
	padding: "16px 28px 20px 28px",
	iconSize: "28px",
	actionSpace: "12px",
	contentMargin: "8px 0 16px 0",
	iconMargin: "0 4px 0 0",
	iconMarginIconTop: "4px 0 8px 0",
	closeSize: "22px",
	closeIconSize: "18px",
	closeMargin: "20px 26px 0 0",
	closeMarginIconTop: "10px 16px 0 0"
};
//#endregion
//#region node_modules/naive-ui/es/dialog/styles/light.mjs
function N_(e) {
	let { textColor1: t, textColor2: n, modalColor: r, closeIconColor: i, closeIconColorHover: a, closeIconColorPressed: o, closeColorHover: s, closeColorPressed: c, infoColor: l, successColor: u, warningColor: d, errorColor: f, primaryColor: p, dividerColor: m, borderRadius: h, fontWeightStrong: g, lineHeight: _, fontSize: v } = e;
	return {
		...M_,
		fontSize: v,
		lineHeight: _,
		border: `1px solid ${m}`,
		titleTextColor: t,
		textColor: n,
		color: r,
		closeColorHover: s,
		closeColorPressed: c,
		closeIconColor: i,
		closeIconColorHover: a,
		closeIconColorPressed: o,
		closeBorderRadius: h,
		iconColor: p,
		iconColorInfo: l,
		iconColorSuccess: u,
		iconColorWarning: d,
		iconColorError: f,
		borderRadius: h,
		titleFontWeight: g
	};
}
var P_ = {
	name: "Dialog",
	common: Q,
	peers: { Button: Ag },
	self: N_
};
//#endregion
//#region node_modules/naive-ui/es/modal/styles/light.mjs
function F_(e) {
	let { modalColor: t, textColor2: n, boxShadow3: r } = e;
	return {
		color: t,
		textColor: n,
		boxShadow: r
	};
}
//#endregion
//#region node_modules/naive-ui/es/modal/styles/dark.mjs
var I_ = {
	name: "Modal",
	common: Q,
	peers: {
		Scrollbar: Up,
		Dialog: P_,
		Card: Vg
	},
	self: F_
}, L_ = {
	name: "LoadingBar",
	common: Q,
	self(e) {
		let { primaryColor: t } = e;
		return {
			colorError: "red",
			colorLoading: t,
			height: "2px"
		};
	}
}, R_ = {
	margin: "0 0 8px 0",
	padding: "10px 20px",
	maxWidth: "720px",
	minWidth: "420px",
	iconMargin: "0 10px 0 0",
	closeMargin: "0 0 0 10px",
	closeSize: "20px",
	closeIconSize: "16px",
	iconSize: "20px",
	fontSize: "14px"
};
//#endregion
//#region node_modules/naive-ui/es/message/styles/light.mjs
function z_(e) {
	let { textColor2: t, closeIconColor: n, closeIconColorHover: r, closeIconColorPressed: i, infoColor: a, successColor: o, errorColor: s, warningColor: c, popoverColor: l, boxShadow2: u, primaryColor: d, lineHeight: f, borderRadius: p, closeColorHover: m, closeColorPressed: h } = e;
	return {
		...R_,
		closeBorderRadius: p,
		textColor: t,
		textColorInfo: t,
		textColorSuccess: t,
		textColorError: t,
		textColorWarning: t,
		textColorLoading: t,
		color: l,
		colorInfo: l,
		colorSuccess: l,
		colorError: l,
		colorWarning: l,
		colorLoading: l,
		boxShadow: u,
		boxShadowInfo: u,
		boxShadowSuccess: u,
		boxShadowError: u,
		boxShadowWarning: u,
		boxShadowLoading: u,
		iconColor: t,
		iconColorInfo: a,
		iconColorSuccess: o,
		iconColorWarning: c,
		iconColorError: s,
		iconColorLoading: d,
		closeColorHover: m,
		closeColorPressed: h,
		closeIconColor: n,
		closeIconColorHover: r,
		closeIconColorPressed: i,
		closeColorHoverInfo: m,
		closeColorPressedInfo: h,
		closeIconColorInfo: n,
		closeIconColorHoverInfo: r,
		closeIconColorPressedInfo: i,
		closeColorHoverSuccess: m,
		closeColorPressedSuccess: h,
		closeIconColorSuccess: n,
		closeIconColorHoverSuccess: r,
		closeIconColorPressedSuccess: i,
		closeColorHoverError: m,
		closeColorPressedError: h,
		closeIconColorError: n,
		closeIconColorHoverError: r,
		closeIconColorPressedError: i,
		closeColorHoverWarning: m,
		closeColorPressedWarning: h,
		closeIconColorWarning: n,
		closeIconColorHoverWarning: r,
		closeIconColorPressedWarning: i,
		closeColorHoverLoading: m,
		closeColorPressedLoading: h,
		closeIconColorLoading: n,
		closeIconColorHoverLoading: r,
		closeIconColorPressedLoading: i,
		loadingColor: d,
		lineHeight: f,
		borderRadius: p,
		border: "0"
	};
}
//#endregion
//#region node_modules/naive-ui/es/message/styles/dark.mjs
var B_ = {
	name: "Message",
	common: Q,
	self: z_
}, V_ = {
	closeMargin: "16px 12px",
	closeSize: "20px",
	closeIconSize: "16px",
	width: "365px",
	padding: "16px",
	titleFontSize: "16px",
	metaFontSize: "12px",
	descriptionFontSize: "12px"
};
//#endregion
//#region node_modules/naive-ui/es/notification/styles/light.mjs
function H_(e) {
	let { textColor2: t, successColor: n, infoColor: r, warningColor: i, errorColor: a, popoverColor: o, closeIconColor: s, closeIconColorHover: c, closeIconColorPressed: l, closeColorHover: u, closeColorPressed: d, textColor1: f, textColor3: p, borderRadius: m, fontWeightStrong: h, boxShadow2: g, lineHeight: _, fontSize: v } = e;
	return {
		...V_,
		borderRadius: m,
		lineHeight: _,
		fontSize: v,
		headerFontWeight: h,
		iconColor: t,
		iconColorSuccess: n,
		iconColorInfo: r,
		iconColorWarning: i,
		iconColorError: a,
		color: o,
		textColor: t,
		closeIconColor: s,
		closeIconColorHover: c,
		closeIconColorPressed: l,
		closeBorderRadius: m,
		closeColorHover: u,
		closeColorPressed: d,
		headerTextColor: f,
		descriptionTextColor: p,
		actionTextColor: t,
		boxShadow: g
	};
}
//#endregion
//#region node_modules/naive-ui/es/notification/styles/dark.mjs
var U_ = {
	name: "Notification",
	common: Q,
	peers: { Scrollbar: Up },
	self: H_
};
//#endregion
//#region node_modules/naive-ui/es/divider/styles/light.mjs
function W_(e) {
	let { textColor1: t, dividerColor: n, fontWeightStrong: r } = e;
	return {
		textColor: t,
		color: n,
		fontWeight: r
	};
}
//#endregion
//#region node_modules/naive-ui/es/divider/styles/dark.mjs
var G_ = {
	name: "Divider",
	common: Q,
	self: W_
};
//#endregion
//#region node_modules/naive-ui/es/drawer/styles/light.mjs
function K_(e) {
	let { modalColor: t, textColor1: n, textColor2: r, boxShadow3: i, lineHeight: a, fontWeightStrong: o, dividerColor: s, closeColorHover: c, closeColorPressed: l, closeIconColor: u, closeIconColorHover: d, closeIconColorPressed: f, borderRadius: p, primaryColorHover: m } = e;
	return {
		bodyPadding: "16px 24px",
		borderRadius: p,
		headerPadding: "16px 24px",
		footerPadding: "16px 24px",
		color: t,
		textColor: r,
		titleTextColor: n,
		titleFontSize: "18px",
		titleFontWeight: o,
		boxShadow: i,
		lineHeight: a,
		headerBorderBottom: `1px solid ${s}`,
		footerBorderTop: `1px solid ${s}`,
		closeIconColor: u,
		closeIconColorHover: d,
		closeIconColorPressed: f,
		closeSize: "22px",
		closeIconSize: "18px",
		closeColorHover: c,
		closeColorPressed: l,
		closeBorderRadius: p,
		resizableTriggerColorHover: m
	};
}
//#endregion
//#region node_modules/naive-ui/es/drawer/styles/dark.mjs
var q_ = {
	name: "Drawer",
	common: Q,
	peers: { Scrollbar: Up },
	self: K_
}, J_ = {
	actionMargin: "0 0 0 20px",
	actionMarginRtl: "0 20px 0 0"
}, Y_ = {
	name: "DynamicInput",
	common: Q,
	peers: {
		Input: Yh,
		Button: Ag
	},
	self() {
		return J_;
	}
}, X_ = {
	gapSmall: "4px 8px",
	gapMedium: "8px 12px",
	gapLarge: "12px 16px"
}, Z_ = {
	name: "Space",
	self() {
		return X_;
	}
}, Q_ = {
	name: "DynamicTags",
	common: Q,
	peers: {
		Input: Yh,
		Button: Ag,
		Tag: Nh,
		Space: Z_
	},
	self() {
		return { inputWidth: "64px" };
	}
}, $_ = {
	name: "Element",
	common: Q
}, ev = {
	gapSmall: "4px 8px",
	gapMedium: "8px 12px",
	gapLarge: "12px 16px"
}, tv = {
	name: "Flex",
	self() {
		return ev;
	}
}, nv = {
	name: "ButtonGroup",
	common: Q
}, rv = {
	feedbackPadding: "4px 0 0 2px",
	feedbackHeightSmall: "24px",
	feedbackHeightMedium: "24px",
	feedbackHeightLarge: "26px",
	feedbackFontSizeSmall: "13px",
	feedbackFontSizeMedium: "14px",
	feedbackFontSizeLarge: "14px",
	labelFontSizeLeftSmall: "14px",
	labelFontSizeLeftMedium: "14px",
	labelFontSizeLeftLarge: "15px",
	labelFontSizeTopSmall: "13px",
	labelFontSizeTopMedium: "14px",
	labelFontSizeTopLarge: "14px",
	labelHeightSmall: "24px",
	labelHeightMedium: "26px",
	labelHeightLarge: "28px",
	labelPaddingVertical: "0 0 6px 2px",
	labelPaddingHorizontal: "0 12px 0 0",
	labelTextAlignVertical: "left",
	labelTextAlignHorizontal: "right",
	labelFontWeight: "400"
};
//#endregion
//#region node_modules/naive-ui/es/form/styles/light.mjs
function iv(e) {
	let { heightSmall: t, heightMedium: n, heightLarge: r, textColor1: i, errorColor: a, warningColor: o, lineHeight: s, textColor3: c } = e;
	return {
		...rv,
		blankHeightSmall: t,
		blankHeightMedium: n,
		blankHeightLarge: r,
		lineHeight: s,
		labelTextColor: i,
		asteriskColor: a,
		feedbackTextColorError: a,
		feedbackTextColorWarning: o,
		feedbackTextColor: c
	};
}
//#endregion
//#region node_modules/naive-ui/es/form/styles/dark.mjs
var av = {
	name: "Form",
	common: Q,
	self: iv
}, ov = {
	name: "GradientText",
	common: Q,
	self(e) {
		let { primaryColor: t, successColor: n, warningColor: r, errorColor: i, infoColor: a, primaryColorSuppl: o, successColorSuppl: s, warningColorSuppl: c, errorColorSuppl: l, infoColorSuppl: u, fontWeightStrong: d } = e;
		return {
			fontWeight: d,
			rotate: "252deg",
			colorStartPrimary: t,
			colorEndPrimary: o,
			colorStartInfo: a,
			colorEndInfo: u,
			colorStartWarning: r,
			colorEndWarning: c,
			colorStartError: i,
			colorEndError: l,
			colorStartSuccess: n,
			colorEndSuccess: s
		};
	}
}, sv = {
	name: "InputNumber",
	common: Q,
	peers: {
		Button: Ag,
		Input: Yh
	},
	self(e) {
		let { textColorDisabled: t } = e;
		return { iconColorDisabled: t };
	}
};
//#endregion
//#region node_modules/naive-ui/es/input-otp/styles/light.mjs
function cv() {
	return {
		inputWidthSmall: "24px",
		inputWidthMedium: "30px",
		inputWidthLarge: "36px",
		gapSmall: "8px",
		gapMedium: "8px",
		gapLarge: "8px"
	};
}
//#endregion
//#region node_modules/naive-ui/es/input-otp/styles/dark.mjs
var lv = {
	name: "InputOtp",
	common: Q,
	peers: { Input: Yh },
	self: cv
}, uv = {
	name: "Layout",
	common: Q,
	peers: { Scrollbar: Up },
	self(e) {
		let { textColor2: t, bodyColor: n, popoverColor: r, cardColor: i, dividerColor: a, scrollbarColor: o, scrollbarColorHover: s } = e;
		return {
			textColor: t,
			textColorInverted: t,
			color: n,
			colorEmbedded: n,
			headerColor: i,
			headerColorInverted: i,
			footerColor: i,
			footerColorInverted: i,
			headerBorderColor: a,
			headerBorderColorInverted: a,
			footerBorderColor: a,
			footerBorderColorInverted: a,
			siderBorderColor: a,
			siderBorderColorInverted: a,
			siderColor: i,
			siderColorInverted: i,
			siderToggleButtonBorder: "1px solid transparent",
			siderToggleButtonColor: r,
			siderToggleButtonIconColor: t,
			siderToggleButtonIconColorInverted: t,
			siderToggleBarColor: J(n, o),
			siderToggleBarColorHover: J(n, s),
			__invertScrollbar: "false"
		};
	}
};
//#endregion
//#region node_modules/naive-ui/es/list/styles/light.mjs
function dv(e) {
	let { textColor2: t, cardColor: n, modalColor: r, popoverColor: i, dividerColor: a, borderRadius: o, fontSize: s, hoverColor: c } = e;
	return {
		textColor: t,
		color: n,
		colorHover: c,
		colorModal: r,
		colorHoverModal: J(r, c),
		colorPopover: i,
		colorHoverPopover: J(i, c),
		borderColor: a,
		borderColorModal: J(r, a),
		borderColorPopover: J(i, a),
		borderRadius: o,
		fontSize: s
	};
}
//#endregion
//#region node_modules/naive-ui/es/list/styles/dark.mjs
var fv = {
	name: "List",
	common: Q,
	self: dv
}, pv = {
	name: "Log",
	common: Q,
	peers: {
		Scrollbar: Up,
		Code: Qg
	},
	self(e) {
		let { textColor2: t, inputColor: n, fontSize: r, primaryColor: i } = e;
		return {
			loaderFontSize: r,
			loaderTextColor: t,
			loaderColor: n,
			loaderBorder: "1px solid #0000",
			loadingColor: i
		};
	}
}, mv = {
	name: "Mention",
	common: Q,
	peers: {
		InternalSelectMenu: nm,
		Input: Yh
	},
	self(e) {
		let { boxShadow2: t } = e;
		return { menuBoxShadow: t };
	}
};
//#endregion
//#region node_modules/naive-ui/es/menu/styles/light.mjs
function hv(e, t, n, r) {
	return {
		itemColorHoverInverted: "#0000",
		itemColorActiveInverted: t,
		itemColorActiveHoverInverted: t,
		itemColorActiveCollapsedInverted: t,
		itemTextColorInverted: e,
		itemTextColorHoverInverted: n,
		itemTextColorChildActiveInverted: n,
		itemTextColorChildActiveHoverInverted: n,
		itemTextColorActiveInverted: n,
		itemTextColorActiveHoverInverted: n,
		itemTextColorHorizontalInverted: e,
		itemTextColorHoverHorizontalInverted: n,
		itemTextColorChildActiveHorizontalInverted: n,
		itemTextColorChildActiveHoverHorizontalInverted: n,
		itemTextColorActiveHorizontalInverted: n,
		itemTextColorActiveHoverHorizontalInverted: n,
		itemIconColorInverted: e,
		itemIconColorHoverInverted: n,
		itemIconColorActiveInverted: n,
		itemIconColorActiveHoverInverted: n,
		itemIconColorChildActiveInverted: n,
		itemIconColorChildActiveHoverInverted: n,
		itemIconColorCollapsedInverted: e,
		itemIconColorHorizontalInverted: e,
		itemIconColorHoverHorizontalInverted: n,
		itemIconColorActiveHorizontalInverted: n,
		itemIconColorActiveHoverHorizontalInverted: n,
		itemIconColorChildActiveHorizontalInverted: n,
		itemIconColorChildActiveHoverHorizontalInverted: n,
		arrowColorInverted: e,
		arrowColorHoverInverted: n,
		arrowColorActiveInverted: n,
		arrowColorActiveHoverInverted: n,
		arrowColorChildActiveInverted: n,
		arrowColorChildActiveHoverInverted: n,
		groupTextColorInverted: r
	};
}
function gv(e) {
	let { borderRadius: t, textColor3: n, primaryColor: r, textColor2: i, textColor1: a, fontSize: o, dividerColor: s, hoverColor: c, primaryColorHover: l } = e;
	return {
		borderRadius: t,
		color: "#0000",
		groupTextColor: n,
		itemColorHover: c,
		itemColorActive: Y(r, { alpha: .1 }),
		itemColorActiveHover: Y(r, { alpha: .1 }),
		itemColorActiveCollapsed: Y(r, { alpha: .1 }),
		itemTextColor: i,
		itemTextColorHover: i,
		itemTextColorActive: r,
		itemTextColorActiveHover: r,
		itemTextColorChildActive: r,
		itemTextColorChildActiveHover: r,
		itemTextColorHorizontal: i,
		itemTextColorHoverHorizontal: l,
		itemTextColorActiveHorizontal: r,
		itemTextColorActiveHoverHorizontal: r,
		itemTextColorChildActiveHorizontal: r,
		itemTextColorChildActiveHoverHorizontal: r,
		itemIconColor: a,
		itemIconColorHover: a,
		itemIconColorActive: r,
		itemIconColorActiveHover: r,
		itemIconColorChildActive: r,
		itemIconColorChildActiveHover: r,
		itemIconColorCollapsed: a,
		itemIconColorHorizontal: a,
		itemIconColorHoverHorizontal: l,
		itemIconColorActiveHorizontal: r,
		itemIconColorActiveHoverHorizontal: r,
		itemIconColorChildActiveHorizontal: r,
		itemIconColorChildActiveHoverHorizontal: r,
		itemHeight: "42px",
		arrowColor: i,
		arrowColorHover: i,
		arrowColorActive: r,
		arrowColorActiveHover: r,
		arrowColorChildActive: r,
		arrowColorChildActiveHover: r,
		colorInverted: "#0000",
		borderColorHorizontal: "#0000",
		fontSize: o,
		dividerColor: s,
		...hv("#BBB", r, "#FFF", "#AAA")
	};
}
//#endregion
//#region node_modules/naive-ui/es/menu/styles/dark.mjs
var _v = {
	name: "Menu",
	common: Q,
	peers: {
		Tooltip: m_,
		Dropdown: f_
	},
	self(e) {
		let { primaryColor: t, primaryColorSuppl: n } = e, r = gv(e);
		return r.itemColorActive = Y(t, { alpha: .15 }), r.itemColorActiveHover = Y(t, { alpha: .15 }), r.itemColorActiveCollapsed = Y(t, { alpha: .15 }), r.itemColorActiveInverted = n, r.itemColorActiveHoverInverted = n, r.itemColorActiveCollapsedInverted = n, r;
	}
}, vv = { iconSize: "22px" };
//#endregion
//#region node_modules/naive-ui/es/popconfirm/styles/light.mjs
function yv(e) {
	let { fontSize: t, warningColor: n } = e;
	return {
		...vv,
		fontSize: t,
		iconColor: n
	};
}
//#endregion
//#region node_modules/naive-ui/es/popconfirm/styles/dark.mjs
var bv = {
	name: "Popconfirm",
	common: Q,
	peers: {
		Button: Ag,
		Popover: am
	},
	self: yv
};
//#endregion
//#region node_modules/naive-ui/es/progress/styles/light.mjs
function xv(e) {
	let { infoColor: t, successColor: n, warningColor: r, errorColor: i, textColor2: a, progressRailColor: o, fontSize: s, fontWeight: c } = e;
	return {
		fontSize: s,
		fontSizeCircle: "28px",
		fontWeightCircle: c,
		railColor: o,
		railHeight: "8px",
		iconSizeCircle: "36px",
		iconSizeLine: "18px",
		iconColor: t,
		iconColorInfo: t,
		iconColorSuccess: n,
		iconColorWarning: r,
		iconColorError: i,
		textColorCircle: a,
		textColorLineInner: "rgb(255, 255, 255)",
		textColorLineOuter: a,
		fillColor: t,
		fillColorInfo: t,
		fillColorSuccess: n,
		fillColorWarning: r,
		fillColorError: i,
		lineBgProcessing: "linear-gradient(90deg, rgba(255, 255, 255, .3) 0%, rgba(255, 255, 255, .5) 100%)"
	};
}
var Sv = {
	name: "Progress",
	common: Q,
	self(e) {
		let t = xv(e);
		return t.textColorLineInner = "rgb(0, 0, 0)", t.lineBgProcessing = "linear-gradient(90deg, rgba(255, 255, 255, .3) 0%, rgba(255, 255, 255, .5) 100%)", t;
	}
}, Cv = {
	name: "Rate",
	common: Q,
	self(e) {
		let { railColor: t } = e;
		return {
			itemColor: t,
			itemColorActive: "#CCAA33",
			itemSize: "20px",
			sizeSmall: "16px",
			sizeMedium: "20px",
			sizeLarge: "24px"
		};
	}
}, wv = {
	titleFontSizeSmall: "26px",
	titleFontSizeMedium: "32px",
	titleFontSizeLarge: "40px",
	titleFontSizeHuge: "48px",
	fontSizeSmall: "14px",
	fontSizeMedium: "14px",
	fontSizeLarge: "15px",
	fontSizeHuge: "16px",
	iconSizeSmall: "64px",
	iconSizeMedium: "80px",
	iconSizeLarge: "100px",
	iconSizeHuge: "125px",
	iconColor418: void 0,
	iconColor404: void 0,
	iconColor403: void 0,
	iconColor500: void 0
};
//#endregion
//#region node_modules/naive-ui/es/result/styles/light.mjs
function Tv(e) {
	let { textColor2: t, textColor1: n, errorColor: r, successColor: i, infoColor: a, warningColor: o, lineHeight: s, fontWeightStrong: c } = e;
	return {
		...wv,
		lineHeight: s,
		titleFontWeight: c,
		titleTextColor: n,
		textColor: t,
		iconColorError: r,
		iconColorSuccess: i,
		iconColorInfo: a,
		iconColorWarning: o
	};
}
//#endregion
//#region node_modules/naive-ui/es/result/styles/dark.mjs
var Ev = {
	name: "Result",
	common: Q,
	self: Tv
}, Dv = {
	railHeight: "4px",
	railWidthVertical: "4px",
	handleSize: "18px",
	dotHeight: "8px",
	dotWidth: "8px",
	dotBorderRadius: "4px"
}, Ov = {
	name: "Slider",
	common: Q,
	self(e) {
		let { railColor: t, modalColor: n, primaryColorSuppl: r, popoverColor: i, textColor2: a, cardColor: o, borderRadius: s, fontSize: c, opacityDisabled: l } = e;
		return {
			...Dv,
			fontSize: c,
			markFontSize: c,
			railColor: t,
			railColorHover: t,
			fillColor: r,
			fillColorHover: r,
			opacityDisabled: l,
			handleColor: "#FFF",
			dotColor: o,
			dotColorModal: n,
			dotColorPopover: i,
			handleBoxShadow: "0px 2px 4px 0 rgba(0, 0, 0, 0.4)",
			handleBoxShadowHover: "0px 2px 4px 0 rgba(0, 0, 0, 0.4)",
			handleBoxShadowActive: "0px 2px 4px 0 rgba(0, 0, 0, 0.4)",
			handleBoxShadowFocus: "0px 2px 4px 0 rgba(0, 0, 0, 0.4)",
			indicatorColor: i,
			indicatorBoxShadow: "0 2px 8px 0 rgba(0, 0, 0, 0.12)",
			indicatorTextColor: a,
			indicatorBorderRadius: s,
			dotBorder: `2px solid ${t}`,
			dotBorderActive: `2px solid ${r}`,
			dotBoxShadow: ""
		};
	}
};
//#endregion
//#region node_modules/naive-ui/es/spin/styles/light.mjs
function kv(e) {
	let { opacityDisabled: t, heightTiny: n, heightSmall: r, heightMedium: i, heightLarge: a, heightHuge: o, primaryColor: s, fontSize: c } = e;
	return {
		fontSize: c,
		textColor: s,
		sizeTiny: n,
		sizeSmall: r,
		sizeMedium: i,
		sizeLarge: a,
		sizeHuge: o,
		color: s,
		opacitySpinning: t
	};
}
//#endregion
//#region node_modules/naive-ui/es/spin/styles/dark.mjs
var Av = {
	name: "Spin",
	common: Q,
	self: kv
};
//#endregion
//#region node_modules/naive-ui/es/statistic/styles/light.mjs
function jv(e) {
	let { textColor2: t, textColor3: n, fontSize: r, fontWeight: i } = e;
	return {
		labelFontSize: r,
		labelFontWeight: i,
		valueFontWeight: i,
		valueFontSize: "24px",
		labelTextColor: n,
		valuePrefixTextColor: t,
		valueSuffixTextColor: t,
		valueTextColor: t
	};
}
//#endregion
//#region node_modules/naive-ui/es/statistic/styles/dark.mjs
var Mv = {
	name: "Statistic",
	common: Q,
	self: jv
}, Nv = {
	stepHeaderFontSizeSmall: "14px",
	stepHeaderFontSizeMedium: "16px",
	indicatorIndexFontSizeSmall: "14px",
	indicatorIndexFontSizeMedium: "16px",
	indicatorSizeSmall: "22px",
	indicatorSizeMedium: "28px",
	indicatorIconSizeSmall: "14px",
	indicatorIconSizeMedium: "18px"
};
//#endregion
//#region node_modules/naive-ui/es/steps/styles/light.mjs
function Pv(e) {
	let { fontWeightStrong: t, baseColor: n, textColorDisabled: r, primaryColor: i, errorColor: a, textColor1: o, textColor2: s } = e;
	return {
		...Nv,
		stepHeaderFontWeight: t,
		indicatorTextColorProcess: n,
		indicatorTextColorWait: r,
		indicatorTextColorFinish: i,
		indicatorTextColorError: a,
		indicatorBorderColorProcess: i,
		indicatorBorderColorWait: r,
		indicatorBorderColorFinish: i,
		indicatorBorderColorError: a,
		indicatorColorProcess: i,
		indicatorColorWait: "#0000",
		indicatorColorFinish: "#0000",
		indicatorColorError: "#0000",
		splitorColorProcess: r,
		splitorColorWait: r,
		splitorColorFinish: i,
		splitorColorError: r,
		headerTextColorProcess: o,
		headerTextColorWait: r,
		headerTextColorFinish: r,
		headerTextColorError: a,
		descriptionTextColorProcess: s,
		descriptionTextColorWait: r,
		descriptionTextColorFinish: r,
		descriptionTextColorError: a
	};
}
//#endregion
//#region node_modules/naive-ui/es/steps/styles/dark.mjs
var Fv = {
	name: "Steps",
	common: Q,
	self: Pv
}, Iv = {
	buttonHeightSmall: "14px",
	buttonHeightMedium: "18px",
	buttonHeightLarge: "22px",
	buttonWidthSmall: "14px",
	buttonWidthMedium: "18px",
	buttonWidthLarge: "22px",
	buttonWidthPressedSmall: "20px",
	buttonWidthPressedMedium: "24px",
	buttonWidthPressedLarge: "28px",
	railHeightSmall: "18px",
	railHeightMedium: "22px",
	railHeightLarge: "26px",
	railWidthSmall: "32px",
	railWidthMedium: "40px",
	railWidthLarge: "48px"
}, Lv = {
	name: "Switch",
	common: Q,
	self(e) {
		let { primaryColorSuppl: t, opacityDisabled: n, borderRadius: r, primaryColor: i, textColor2: a, baseColor: o } = e;
		return {
			...Iv,
			iconColor: o,
			textColor: a,
			loadingColor: t,
			opacityDisabled: n,
			railColor: "rgba(255, 255, 255, .20)",
			railColorActive: t,
			buttonBoxShadow: "0px 2px 4px 0 rgba(0, 0, 0, 0.4)",
			buttonColor: "#FFF",
			railBorderRadiusSmall: r,
			railBorderRadiusMedium: r,
			railBorderRadiusLarge: r,
			buttonBorderRadiusSmall: r,
			buttonBorderRadiusMedium: r,
			buttonBorderRadiusLarge: r,
			boxShadowFocus: `0 0 8px 0 ${Y(i, { alpha: .3 })}`
		};
	}
}, Rv = {
	thPaddingSmall: "6px",
	thPaddingMedium: "12px",
	thPaddingLarge: "12px",
	tdPaddingSmall: "6px",
	tdPaddingMedium: "12px",
	tdPaddingLarge: "12px"
};
//#endregion
//#region node_modules/naive-ui/es/table/styles/light.mjs
function zv(e) {
	let { dividerColor: t, cardColor: n, modalColor: r, popoverColor: i, tableHeaderColor: a, tableColorStriped: o, textColor1: s, textColor2: c, borderRadius: l, fontWeightStrong: u, lineHeight: d, fontSizeSmall: f, fontSizeMedium: p, fontSizeLarge: m } = e;
	return {
		...Rv,
		fontSizeSmall: f,
		fontSizeMedium: p,
		fontSizeLarge: m,
		lineHeight: d,
		borderRadius: l,
		borderColor: J(n, t),
		borderColorModal: J(r, t),
		borderColorPopover: J(i, t),
		tdColor: n,
		tdColorModal: r,
		tdColorPopover: i,
		tdColorStriped: J(n, o),
		tdColorStripedModal: J(r, o),
		tdColorStripedPopover: J(i, o),
		thColor: J(n, a),
		thColorModal: J(r, a),
		thColorPopover: J(i, a),
		thTextColor: s,
		tdTextColor: c,
		thFontWeight: u
	};
}
//#endregion
//#region node_modules/naive-ui/es/table/styles/dark.mjs
var Bv = {
	name: "Table",
	common: Q,
	self: zv
}, Vv = {
	tabFontSizeSmall: "14px",
	tabFontSizeMedium: "14px",
	tabFontSizeLarge: "16px",
	tabGapSmallLine: "36px",
	tabGapMediumLine: "36px",
	tabGapLargeLine: "36px",
	tabGapSmallLineVertical: "8px",
	tabGapMediumLineVertical: "8px",
	tabGapLargeLineVertical: "8px",
	tabPaddingSmallLine: "6px 0",
	tabPaddingMediumLine: "10px 0",
	tabPaddingLargeLine: "14px 0",
	tabPaddingVerticalSmallLine: "6px 12px",
	tabPaddingVerticalMediumLine: "8px 16px",
	tabPaddingVerticalLargeLine: "10px 20px",
	tabGapSmallBar: "36px",
	tabGapMediumBar: "36px",
	tabGapLargeBar: "36px",
	tabGapSmallBarVertical: "8px",
	tabGapMediumBarVertical: "8px",
	tabGapLargeBarVertical: "8px",
	tabPaddingSmallBar: "4px 0",
	tabPaddingMediumBar: "6px 0",
	tabPaddingLargeBar: "10px 0",
	tabPaddingVerticalSmallBar: "6px 12px",
	tabPaddingVerticalMediumBar: "8px 16px",
	tabPaddingVerticalLargeBar: "10px 20px",
	tabGapSmallCard: "4px",
	tabGapMediumCard: "4px",
	tabGapLargeCard: "4px",
	tabGapSmallCardVertical: "4px",
	tabGapMediumCardVertical: "4px",
	tabGapLargeCardVertical: "4px",
	tabPaddingSmallCard: "8px 16px",
	tabPaddingMediumCard: "10px 20px",
	tabPaddingLargeCard: "12px 24px",
	tabPaddingSmallSegment: "4px 0",
	tabPaddingMediumSegment: "6px 0",
	tabPaddingLargeSegment: "8px 0",
	tabPaddingVerticalLargeSegment: "0 8px",
	tabPaddingVerticalSmallCard: "8px 12px",
	tabPaddingVerticalMediumCard: "10px 16px",
	tabPaddingVerticalLargeCard: "12px 20px",
	tabPaddingVerticalSmallSegment: "0 4px",
	tabPaddingVerticalMediumSegment: "0 6px",
	tabGapSmallSegment: "0",
	tabGapMediumSegment: "0",
	tabGapLargeSegment: "0",
	tabGapSmallSegmentVertical: "0",
	tabGapMediumSegmentVertical: "0",
	tabGapLargeSegmentVertical: "0",
	panePaddingSmall: "8px 0 0 0",
	panePaddingMedium: "12px 0 0 0",
	panePaddingLarge: "16px 0 0 0",
	closeSize: "18px",
	closeIconSize: "14px"
};
//#endregion
//#region node_modules/naive-ui/es/tabs/styles/light.mjs
function Hv(e) {
	let { textColor2: t, primaryColor: n, textColorDisabled: r, closeIconColor: i, closeIconColorHover: a, closeIconColorPressed: o, closeColorHover: s, closeColorPressed: c, tabColor: l, baseColor: u, dividerColor: d, fontWeight: f, textColor1: p, borderRadius: m, fontSize: h, fontWeightStrong: g } = e;
	return {
		...Vv,
		colorSegment: l,
		tabFontSizeCard: h,
		tabTextColorLine: p,
		tabTextColorActiveLine: n,
		tabTextColorHoverLine: n,
		tabTextColorDisabledLine: r,
		tabTextColorSegment: p,
		tabTextColorActiveSegment: t,
		tabTextColorHoverSegment: t,
		tabTextColorDisabledSegment: r,
		tabTextColorBar: p,
		tabTextColorActiveBar: n,
		tabTextColorHoverBar: n,
		tabTextColorDisabledBar: r,
		tabTextColorCard: p,
		tabTextColorHoverCard: p,
		tabTextColorActiveCard: n,
		tabTextColorDisabledCard: r,
		barColor: n,
		closeIconColor: i,
		closeIconColorHover: a,
		closeIconColorPressed: o,
		closeColorHover: s,
		closeColorPressed: c,
		closeBorderRadius: m,
		tabColor: l,
		tabColorSegment: u,
		tabBorderColor: d,
		tabFontWeightActive: f,
		tabFontWeight: f,
		tabBorderRadius: m,
		paneTextColor: t,
		fontWeightStrong: g
	};
}
//#endregion
//#region node_modules/naive-ui/es/tabs/styles/dark.mjs
var Uv = {
	name: "Tabs",
	common: Q,
	peers: { Button: Ag },
	self(e) {
		let t = Hv(e), { inputColor: n } = e;
		return t.colorSegment = n, t.tabColorSegment = n, t;
	}
};
//#endregion
//#region node_modules/naive-ui/es/thing/styles/light.mjs
function Wv(e) {
	let { textColor1: t, textColor2: n, fontWeightStrong: r, fontSize: i } = e;
	return {
		fontSize: i,
		titleTextColor: t,
		textColor: n,
		titleFontWeight: r
	};
}
//#endregion
//#region node_modules/naive-ui/es/thing/styles/dark.mjs
var Gv = {
	name: "Thing",
	common: Q,
	self: Wv
}, Kv = {
	titleMarginMedium: "0 0 6px 0",
	titleMarginLarge: "-2px 0 6px 0",
	titleFontSizeMedium: "14px",
	titleFontSizeLarge: "16px",
	iconSizeMedium: "14px",
	iconSizeLarge: "14px"
}, qv = {
	name: "Timeline",
	common: Q,
	self(e) {
		let { textColor3: t, infoColorSuppl: n, errorColorSuppl: r, successColorSuppl: i, warningColorSuppl: a, textColor1: o, textColor2: s, railColor: c, fontWeightStrong: l, fontSize: u } = e;
		return {
			...Kv,
			contentFontSize: u,
			titleFontWeight: l,
			circleBorder: `2px solid ${t}`,
			circleBorderInfo: `2px solid ${n}`,
			circleBorderError: `2px solid ${r}`,
			circleBorderSuccess: `2px solid ${i}`,
			circleBorderWarning: `2px solid ${a}`,
			iconColor: t,
			iconColorInfo: n,
			iconColorError: r,
			iconColorSuccess: i,
			iconColorWarning: a,
			titleTextColor: o,
			contentTextColor: s,
			metaTextColor: t,
			lineColor: c
		};
	}
}, Jv = {
	extraFontSizeSmall: "12px",
	extraFontSizeMedium: "12px",
	extraFontSizeLarge: "14px",
	titleFontSizeSmall: "14px",
	titleFontSizeMedium: "16px",
	titleFontSizeLarge: "16px",
	closeSize: "20px",
	closeIconSize: "16px",
	headerHeightSmall: "44px",
	headerHeightMedium: "44px",
	headerHeightLarge: "50px"
}, Yv = {
	name: "Transfer",
	common: Q,
	peers: {
		Checkbox: Yg,
		Scrollbar: Up,
		Input: Yh,
		Empty: qp,
		Button: Ag
	},
	self(e) {
		let { fontWeight: t, fontSizeLarge: n, fontSizeMedium: r, fontSizeSmall: i, heightLarge: a, heightMedium: o, borderRadius: s, inputColor: c, tableHeaderColor: l, textColor1: u, textColorDisabled: d, textColor2: f, textColor3: p, hoverColor: m, closeColorHover: h, closeColorPressed: g, closeIconColor: _, closeIconColorHover: v, closeIconColorPressed: y, dividerColor: b } = e;
		return {
			...Jv,
			itemHeightSmall: o,
			itemHeightMedium: o,
			itemHeightLarge: a,
			fontSizeSmall: i,
			fontSizeMedium: r,
			fontSizeLarge: n,
			borderRadius: s,
			dividerColor: b,
			borderColor: "#0000",
			listColor: c,
			headerColor: l,
			titleTextColor: u,
			titleTextColorDisabled: d,
			extraTextColor: p,
			extraTextColorDisabled: d,
			itemTextColor: f,
			itemTextColorDisabled: d,
			itemColorPending: m,
			titleFontWeight: t,
			closeColorHover: h,
			closeColorPressed: g,
			closeIconColor: _,
			closeIconColorHover: v,
			closeIconColorPressed: y
		};
	}
};
//#endregion
//#region node_modules/naive-ui/es/tree/styles/light.mjs
function Xv(e) {
	let { borderRadiusSmall: t, dividerColor: n, hoverColor: r, pressedColor: i, primaryColor: a, textColor3: o, textColor2: s, textColorDisabled: c, fontSize: l } = e;
	return {
		fontSize: l,
		lineHeight: "1.5",
		nodeHeight: "30px",
		nodeWrapperPadding: "3px 0",
		nodeBorderRadius: t,
		nodeColorHover: r,
		nodeColorPressed: i,
		nodeColorActive: Y(a, { alpha: .1 }),
		arrowColor: o,
		nodeTextColor: s,
		nodeTextColorDisabled: c,
		loadingColor: a,
		dropMarkColor: a,
		lineColor: n
	};
}
//#endregion
//#region node_modules/naive-ui/es/tree/styles/dark.mjs
var Zv = {
	name: "Tree",
	common: Q,
	peers: {
		Checkbox: Yg,
		Scrollbar: Up,
		Empty: qp
	},
	self(e) {
		let { primaryColor: t } = e, n = Xv(e);
		return n.nodeColorActive = Y(t, { alpha: .15 }), n;
	}
}, Qv = {
	name: "TreeSelect",
	common: Q,
	peers: {
		Tree: Zv,
		Empty: qp,
		InternalSelection: Bh
	}
}, $v = {
	headerFontSize1: "30px",
	headerFontSize2: "22px",
	headerFontSize3: "18px",
	headerFontSize4: "16px",
	headerFontSize5: "16px",
	headerFontSize6: "16px",
	headerMargin1: "28px 0 20px 0",
	headerMargin2: "28px 0 20px 0",
	headerMargin3: "28px 0 20px 0",
	headerMargin4: "28px 0 18px 0",
	headerMargin5: "28px 0 18px 0",
	headerMargin6: "28px 0 18px 0",
	headerPrefixWidth1: "16px",
	headerPrefixWidth2: "16px",
	headerPrefixWidth3: "12px",
	headerPrefixWidth4: "12px",
	headerPrefixWidth5: "12px",
	headerPrefixWidth6: "12px",
	headerBarWidth1: "4px",
	headerBarWidth2: "4px",
	headerBarWidth3: "3px",
	headerBarWidth4: "3px",
	headerBarWidth5: "3px",
	headerBarWidth6: "3px",
	pMargin: "16px 0 16px 0",
	liMargin: ".25em 0 0 0",
	olPadding: "0 0 0 2em",
	ulPadding: "0 0 0 2em"
};
//#endregion
//#region node_modules/naive-ui/es/typography/styles/light.mjs
function ey(e) {
	let { primaryColor: t, textColor2: n, borderColor: r, lineHeight: i, fontSize: a, borderRadiusSmall: o, dividerColor: s, fontWeightStrong: c, textColor1: l, textColor3: u, infoColor: d, warningColor: f, errorColor: p, successColor: m, codeColor: h } = e;
	return {
		...$v,
		aTextColor: t,
		blockquoteTextColor: n,
		blockquotePrefixColor: r,
		blockquoteLineHeight: i,
		blockquoteFontSize: a,
		codeBorderRadius: o,
		liTextColor: n,
		liLineHeight: i,
		liFontSize: a,
		hrColor: s,
		headerFontWeight: c,
		headerTextColor: l,
		pTextColor: n,
		pTextColor1Depth: l,
		pTextColor2Depth: n,
		pTextColor3Depth: u,
		pLineHeight: i,
		pFontSize: a,
		headerBarColor: t,
		headerBarColorPrimary: t,
		headerBarColorInfo: d,
		headerBarColorError: p,
		headerBarColorWarning: f,
		headerBarColorSuccess: m,
		textColor: n,
		textColor1Depth: l,
		textColor2Depth: n,
		textColor3Depth: u,
		textColorPrimary: t,
		textColorInfo: d,
		textColorSuccess: m,
		textColorWarning: f,
		textColorError: p,
		codeTextColor: n,
		codeColor: h,
		codeBorder: "1px solid #0000"
	};
}
//#endregion
//#region node_modules/naive-ui/es/typography/styles/dark.mjs
var ty = {
	name: "Typography",
	common: Q,
	self: ey
};
//#endregion
//#region node_modules/naive-ui/es/upload/styles/light.mjs
function ny(e) {
	let { iconColor: t, primaryColor: n, errorColor: r, textColor2: i, successColor: a, opacityDisabled: o, actionColor: s, borderColor: c, hoverColor: l, lineHeight: u, borderRadius: d, fontSize: f } = e;
	return {
		fontSize: f,
		lineHeight: u,
		borderRadius: d,
		draggerColor: s,
		draggerBorder: `1px dashed ${c}`,
		draggerBorderHover: `1px dashed ${n}`,
		itemColorHover: l,
		itemColorHoverError: Y(r, { alpha: .06 }),
		itemTextColor: i,
		itemTextColorError: r,
		itemTextColorSuccess: a,
		itemIconColor: t,
		itemDisabledOpacity: o,
		itemBorderImageCardError: `1px solid ${r}`,
		itemBorderImageCard: `1px solid ${c}`
	};
}
//#endregion
//#region node_modules/naive-ui/es/upload/styles/dark.mjs
var ry = {
	name: "Upload",
	common: Q,
	peers: {
		Button: Ag,
		Progress: Sv
	},
	self(e) {
		let { errorColor: t } = e, n = ny(e);
		return n.itemColorHoverError = Y(t, { alpha: .09 }), n;
	}
}, iy = {
	name: "Watermark",
	common: Q,
	self(e) {
		let { fontFamily: t } = e;
		return { fontFamily: t };
	}
};
//#endregion
//#region node_modules/naive-ui/es/heatmap/styles/light.mjs
function ay(e) {
	let { borderRadius: t, fontSizeMini: n, fontSizeTiny: r, fontSizeSmall: i, fontWeight: a, textColor2: o, cardColor: s, buttonColor2Hover: c } = e;
	return {
		activeColors: [
			"#9be9a8",
			"#40c463",
			"#30a14e",
			"#216e39"
		],
		borderRadius: t,
		borderColor: s,
		textColor: o,
		mininumColor: c,
		fontWeight: a,
		loadingColorStart: "rgba(0, 0, 0, 0.06)",
		loadingColorEnd: "rgba(0, 0, 0, 0.12)",
		rectSizeSmall: "10px",
		rectSizeMedium: "11px",
		rectSizeLarge: "12px",
		borderRadiusSmall: "2px",
		borderRadiusMedium: "2px",
		borderRadiusLarge: "2px",
		xGapSmall: "2px",
		xGapMedium: "3px",
		xGapLarge: "3px",
		yGapSmall: "2px",
		yGapMedium: "3px",
		yGapLarge: "3px",
		fontSizeSmall: r,
		fontSizeMedium: n,
		fontSizeLarge: i
	};
}
//#endregion
//#region node_modules/naive-ui/es/icon-wrapper/styles/light.mjs
function oy(e) {
	let { primaryColor: t, baseColor: n } = e;
	return {
		color: t,
		iconColor: n
	};
}
//#endregion
//#region node_modules/naive-ui/es/legacy-transfer/styles/_common.mjs
var sy = {
	extraFontSize: "12px",
	width: "440px"
};
//#endregion
//#region node_modules/naive-ui/es/marquee/styles/light.mjs
function cy() {
	return {};
}
//#endregion
//#region node_modules/naive-ui/es/page-header/styles/_common.mjs
var ly = {
	titleFontSize: "18px",
	backSize: "22px"
};
//#endregion
//#region node_modules/naive-ui/es/page-header/styles/light.mjs
function uy(e) {
	let { textColor1: t, textColor2: n, textColor3: r, fontSize: i, fontWeightStrong: a, primaryColorHover: o, primaryColorPressed: s } = e;
	return {
		...ly,
		titleFontWeight: a,
		fontSize: i,
		titleTextColor: t,
		backColor: n,
		backColorHover: o,
		backColorPressed: s,
		subtitleTextColor: r
	};
}
//#endregion
//#region node_modules/naive-ui/es/themes/dark.mjs
var dy = {
	name: "dark",
	common: Q,
	Alert: Hh,
	Anchor: Kh,
	AutoComplete: pg,
	Avatar: hg,
	AvatarGroup: {
		name: "AvatarGroup",
		common: Q,
		peers: { Avatar: hg },
		self: gg
	},
	BackTop: vg,
	Badge: yg,
	Breadcrumb: Eg,
	Button: Ag,
	ButtonGroup: nv,
	Calendar: {
		name: "Calendar",
		common: Q,
		peers: { Button: Ag },
		self: Lg
	},
	Card: Vg,
	Carousel: {
		name: "Carousel",
		common: Q,
		self: Kg
	},
	Cascader: Zg,
	Checkbox: Yg,
	Code: Qg,
	Collapse: e_,
	CollapseTransition: {
		name: "CollapseTransition",
		common: Q,
		self: t_
	},
	ColorPicker: {
		name: "ColorPicker",
		common: Q,
		peers: {
			Input: Yh,
			Button: Ag
		},
		self: n_
	},
	DataTable: b_,
	DatePicker: O_,
	Descriptions: j_,
	Dialog: P_,
	Divider: G_,
	Drawer: q_,
	Dropdown: f_,
	DynamicInput: Y_,
	DynamicTags: Q_,
	Element: $_,
	Empty: qp,
	Ellipsis: __,
	Equation: {
		name: "Equation",
		common: Q,
		self: () => ({})
	},
	Flex: tv,
	Form: av,
	GradientText: ov,
	Heatmap: {
		name: "Heatmap",
		common: Q,
		self(e) {
			return {
				...ay(e),
				activeColors: [
					"#0d4429",
					"#006d32",
					"#26a641",
					"#39d353"
				],
				mininumColor: "rgba(255, 255, 255, 0.1)",
				loadingColorStart: "rgba(255, 255, 255, 0.12)",
				loadingColorEnd: "rgba(255, 255, 255, 0.18)"
			};
		}
	},
	Icon: S_,
	IconWrapper: {
		name: "IconWrapper",
		common: Q,
		self: oy
	},
	Image: {
		name: "Image",
		common: Q,
		peers: { Tooltip: m_ },
		self: (e) => {
			let { textColor2: t } = e;
			return {
				toolbarIconColor: t,
				toolbarColor: "rgba(0, 0, 0, .35)",
				toolbarBoxShadow: "none",
				toolbarBorderRadius: "24px"
			};
		}
	},
	Input: Yh,
	InputNumber: sv,
	InputOtp: lv,
	LegacyTransfer: {
		name: "Transfer",
		common: Q,
		peers: {
			Checkbox: Yg,
			Scrollbar: Up,
			Input: Yh,
			Empty: qp,
			Button: Ag
		},
		self(e) {
			let { iconColorDisabled: t, iconColor: n, fontWeight: r, fontSizeLarge: i, fontSizeMedium: a, fontSizeSmall: o, heightLarge: s, heightMedium: c, heightSmall: l, borderRadius: u, inputColor: d, tableHeaderColor: f, textColor1: p, textColorDisabled: m, textColor2: h, hoverColor: g } = e;
			return {
				...sy,
				itemHeightSmall: l,
				itemHeightMedium: c,
				itemHeightLarge: s,
				fontSizeSmall: o,
				fontSizeMedium: a,
				fontSizeLarge: i,
				borderRadius: u,
				borderColor: "#0000",
				listColor: d,
				headerColor: f,
				titleTextColor: p,
				titleTextColorDisabled: m,
				extraTextColor: h,
				filterDividerColor: "#0000",
				itemTextColor: h,
				itemTextColorDisabled: m,
				itemColorPending: g,
				titleFontWeight: r,
				iconColor: n,
				iconColorDisabled: t
			};
		}
	},
	Layout: uv,
	List: fv,
	LoadingBar: L_,
	Log: pv,
	Menu: _v,
	Mention: mv,
	Message: B_,
	Modal: I_,
	Notification: U_,
	PageHeader: {
		name: "PageHeader",
		common: Q,
		self: uy
	},
	Pagination: l_,
	Popconfirm: bv,
	Popover: am,
	Popselect: i_,
	Progress: Sv,
	QrCode: {
		name: "QrCode",
		common: Q,
		self: (e) => ({ borderRadius: e.borderRadius })
	},
	Radio: g_,
	Rate: Cv,
	Result: Ev,
	Row: {
		name: "Row",
		common: Q
	},
	Scrollbar: Up,
	Select: o_,
	Skeleton: {
		name: "Skeleton",
		common: Q,
		self(e) {
			let { heightSmall: t, heightMedium: n, heightLarge: r, borderRadius: i } = e;
			return {
				color: "rgba(255, 255, 255, 0.12)",
				colorEnd: "rgba(255, 255, 255, 0.18)",
				borderRadius: i,
				heightSmall: t,
				heightMedium: n,
				heightLarge: r
			};
		}
	},
	Slider: Ov,
	Space: Z_,
	Spin: Av,
	Statistic: Mv,
	Steps: Fv,
	Switch: Lv,
	Table: Bv,
	Tabs: Uv,
	Tag: Nh,
	Thing: Gv,
	TimePicker: T_,
	Timeline: qv,
	Tooltip: m_,
	Transfer: Yv,
	Tree: Zv,
	TreeSelect: Qv,
	Typography: ty,
	Upload: ry,
	Watermark: iy,
	Split: {
		name: "Split",
		common: Q
	},
	FloatButton: {
		name: "FloatButton",
		common: Q,
		self(e) {
			let { popoverColor: t, textColor2: n, buttonColor2Hover: r, buttonColor2Pressed: i, primaryColor: a, primaryColorHover: o, primaryColorPressed: s, baseColor: c, borderRadius: l } = e;
			return {
				color: t,
				textColor: n,
				boxShadow: "0 2px 8px 0px rgba(0, 0, 0, .12)",
				boxShadowHover: "0 2px 12px 0px rgba(0, 0, 0, .18)",
				boxShadowPressed: "0 2px 12px 0px rgba(0, 0, 0, .18)",
				colorHover: r,
				colorPressed: i,
				colorPrimary: a,
				colorPrimaryHover: o,
				colorPrimaryPressed: s,
				textColorPrimary: c,
				borderRadiusSquare: l
			};
		}
	},
	FloatButtonGroup: {
		name: "FloatButtonGroup",
		common: Q,
		self(e) {
			let { popoverColor: t, dividerColor: n, borderRadius: r } = e;
			return {
				color: t,
				buttonBorderColor: n,
				borderRadiusSquare: r,
				boxShadow: "0 2px 8px 0px rgba(0, 0, 0, .12)"
			};
		}
	},
	Marquee: {
		name: "Marquee",
		common: Q,
		self: cy
	}
}, fy = {
	"zh-CN": [Fs, wc],
	"zh-TW": [Is, Tc],
	"ja-JP": [Ps, Cc],
	"en-US": [Ns, Sc]
}, py = /* @__PURE__ */ I({
	props: {
		theme: {
			type: String,
			default: "light"
		},
		locale: {
			type: String,
			default: "zh-CN"
		},
		styleMountTarget: {
			type: Object,
			required: !0
		}
	},
	setup(e, { slots: t }) {
		return () => {
			let n = e.theme === "dark", [r, i] = fy[e.locale] ?? fy["zh-CN"];
			return B(r_, {
				theme: n ? dy : null,
				locale: r,
				dateLocale: i,
				styleMountTarget: e.styleMountTarget,
				preflightStyleDisabled: !0,
				inlineThemeDisabled: !0,
				themeOverrides: { common: {
					heightMedium: "40px",
					borderRadius: "2px",
					primaryColor: n ? "#c4ad78" : "#655071",
					primaryColorHover: n ? "#d7c497" : "#796087",
					primaryColorPressed: n ? "#ae9460" : "#503d5c",
					bodyColor: n ? "#211e26" : "#f7f4ed",
					cardColor: n ? "#2a2630" : "#efebe4",
					textColorBase: n ? "#eae6df" : "#302c30"
				} }
			}, { default: () => B("div", {
				class: "ui-page",
				"data-theme": e.theme
			}, t.default?.()) });
		};
	}
}), my = /* @__PURE__ */ I({ setup(e, { slots: t }) {
	return () => B("div", {
		class: "ui-settings-layout",
		"data-has-aside": !!t.aside
	}, [B("div", { class: "ui-settings-main" }, t.default?.()), t.aside ? B("aside", { class: "ui-settings-aside" }, t.aside()) : null]);
} }), hy = /* @__PURE__ */ I({
	props: {
		title: String,
		eyebrow: String
	},
	setup(e, { slots: t }) {
		return () => B("section", { class: "ui-surface" }, [
			e.eyebrow ? B("p", { class: "ui-eyebrow" }, e.eyebrow) : null,
			e.title ? B("h2", e.title) : null,
			t.default?.()
		]);
	}
}), gy = /* @__PURE__ */ I({
	props: {
		title: {
			type: String,
			required: !0
		},
		titleId: String,
		eyebrow: String,
		subtitle: String
	},
	setup(e, { slots: t }) {
		return () => B("header", { class: "ui-page-header" }, [B("div", [
			e.eyebrow ? B("p", { class: "ui-eyebrow" }, e.eyebrow) : null,
			B("h1", { id: e.titleId }, e.title),
			e.subtitle ? B("p", { class: "ui-subtitle" }, e.subtitle) : null
		]), t.default?.()]);
	}
}), _y = /* @__PURE__ */ I({
	props: {
		title: {
			type: String,
			required: !0
		},
		fieldset: Boolean,
		number: String
	},
	setup(e, { slots: t }) {
		return () => B(e.fieldset ? "fieldset" : "section", { class: "ui-settings-group" }, [e.fieldset ? B("legend", { class: "ui-group-legend" }, e.title) : B("header", { class: "ui-group-heading" }, [B("h2", [e.number ? B("span", {
			class: "ui-section-number",
			"aria-hidden": "true"
		}, e.number) : null, e.title]), t.heading?.()]), t.default?.()]);
	}
}), vy = /* @__PURE__ */ I({ setup(e, { slots: t }) {
	return () => B("div", { class: "ui-action-bar" }, t.default?.());
} }), yy = /* @__PURE__ */ I({
	props: {
		tone: {
			type: String,
			default: "neutral"
		},
		role: {
			type: String,
			default: "status"
		}
	},
	setup(e, { slots: t }) {
		return () => B("p", {
			class: "ui-status-hint",
			"data-tone": e.tone,
			role: e.role === "none" ? void 0 : e.role,
			"aria-live": e.role === "none" ? void 0 : e.role === "alert" ? "assertive" : "polite"
		}, t.default?.());
	}
}), by = /* @__PURE__ */ I({
	props: {
		controlId: {
			type: String,
			required: !0
		},
		label: {
			type: String,
			required: !0
		},
		labelId: String,
		hint: String,
		error: String,
		hintId: String,
		errorId: String,
		layout: {
			type: String,
			default: "stacked"
		}
	},
	slots: Object,
	setup(e, { slots: t }) {
		return () => {
			let n = e.labelId || e.controlId + "-label", r = e.hintId || e.controlId + "-hint", i = e.errorId || e.controlId + "-error", a = [e.hint ? r : null, e.error ? i : null].filter(Boolean).join(" ") || void 0;
			return B("div", { class: ["ui-form-field", e.layout === "row" ? "ui-settings-row" : "ui-form-field-stacked"] }, [
				B("label", {
					id: n,
					for: e.controlId,
					onClick: (t) => t.currentTarget.ownerDocument.getElementById(e.controlId)?.focus()
				}, e.label),
				t.default?.({ controlAttrs: {
					id: e.controlId,
					"aria-labelledby": n,
					"aria-describedby": a,
					"aria-invalid": !!e.error
				} }),
				t.actions?.(),
				e.hint ? B("p", {
					id: r,
					class: "ui-field-hint field-hint"
				}, e.hint) : null,
				B("p", {
					id: i,
					class: "ui-field-error field-detail",
					hidden: !e.error
				}, e.error || "")
			]);
		};
	}
}), xy = /* @__PURE__ */ I({
	props: { columns: {
		type: Number,
		default: 2
	} },
	setup(e, { slots: t }) {
		return () => B("div", {
			class: "ui-form-grid",
			"data-columns": e.columns
		}, t.default?.());
	}
});
//#endregion
//#region src/confirmation.ts
function Sy(e, t) {
	let n = /* @__PURE__ */ rn(null), r = 0, i = !1, a = null;
	function o(t, o, s = !1) {
		if (n.value !== t) return;
		let c = !!a?.contains(e.activeElement);
		n.value = null, t.resolve(o && t.isCurrent()), s && c && Nn().then(() => Nn()).then(() => {
			!i && r === t.id && !n.value && (t.canRestoreFocus ?? t.isCurrent)() && e.activeElement === e.body && t.trigger?.isConnected && t.trigger.focus({ preventScroll: !0 });
		});
	}
	function s(e = !1) {
		n.value && o(n.value, !1, e);
	}
	return {
		ask(t) {
			return s(), i || !t.isCurrent() ? Promise.resolve(!1) : new Promise((i) => {
				let o = {
					...t,
					id: ++r,
					trigger: t.trigger ?? e.activeElement,
					resolve: i
				};
				n.value = o, Nn().then(() => {
					n.value === o && o.isCurrent() && a?.querySelector("[data-confirm-cancel]")?.focus({ preventScroll: !0 });
				});
			});
		},
		cancel: s,
		invalidate() {
			n.value && !n.value.isCurrent() && s();
		},
		dispose() {
			s(), i = !0;
		},
		render() {
			let e = n.value;
			if (!e) return null;
			let [r, i, s] = e.copy();
			return B("section", {
				key: e.id,
				role: "group",
				"aria-label": r,
				"data-unload-confirm": e.kind === "unload" ? e.owner : void 0,
				"data-confirmation": e.kind,
				ref: (e) => {
					a = e;
				},
				onKeydown: (t) => {
					t.key === "Escape" && (t.preventDefault(), o(e, !1, !0));
				}
			}, [B(Gg, { title: r }, { default: () => [
				B("p", i),
				B(Fg, {
					"data-action": "confirm-" + e.kind,
					onClick: () => o(e, !0)
				}, () => s),
				B(Fg, {
					"data-action": "cancel-" + e.kind,
					"data-confirm-cancel": "",
					onClick: () => o(e, !1, !0)
				}, t)
			] })]);
		}
	};
}
//#endregion
//#region src/alert-config.js
var Cy = (e) => typeof e == "object" && !!e && !Array.isArray(e) && [Object.prototype, null].includes(Object.getPrototypeOf(e)), wy = /[\p{Cc}\p{Cf}\p{Cs}]/u, Ty = /^[1-9][0-9]{0,19}$/, Ey = () => ({
	enabled: !1,
	check_interval_minutes: 15,
	metric: "",
	unit: "",
	threshold: null,
	recovery_threshold: null,
	repeat_minutes: 0
}), Dy = () => ({ enabled: !0 }), Oy = /* @__PURE__ */ new Set([
	"moonshot",
	"stepfun",
	"openrouter",
	"novita",
	"venice",
	"vercel_gateway",
	"pollinations"
]);
function ky(e) {
	return Ay(e)[0] ?? "";
}
function Ay(e) {
	return Oy.has(e.type) ? ["available_balance"] : e.type === "xai" ? ["posted_prepaid_balance"] : e.type === "alibaba_bailian" ? [
		"AvailableAmount",
		"AvailableCashAmount",
		"CreditAmount"
	] : e.type === "deepseek" ? [
		"total_balance",
		"granted_balance",
		"topped_up_balance"
	] : e.type === "grsai" || e.type === "openai_compatible" && e.service_profile === "grsai" ? ["credit"] : e.type === "meinianda" ? ["site_credit"] : e.type === "openai_compatible" ? ["mapped_balance"] : [];
}
var jy = {
	AvailableAmount: "web.metric.AvailableAmount",
	AvailableCashAmount: "web.metric.AvailableCashAmount",
	CreditAmount: "web.metric.CreditAmount",
	total_balance: "web.metric.total_balance",
	granted_balance: "web.metric.granted_balance",
	topped_up_balance: "web.metric.topped_up_balance",
	credit: "web.metric.credit",
	site_credit: "web.metric.site_credit",
	mapped_balance: "web.metric.mapped_balance",
	available_balance: "provider.wallet.available_balance",
	posted_prepaid_balance: "provider.xai.posted_balance"
}, My = {
	credit: "web.metric.credit",
	site_credit: "web.metric.site_credit"
}, Ny = (e, t) => Object.hasOwn(My, e) ? l(My[e], t) : e, Py = (e, t) => l(Object.hasOwn(jy, e) ? jy[e] : "web.metric.monitored", t);
function Fy(e, t = "zh-CN") {
	let n = new Date(e);
	if (!Number.isFinite(n.getTime())) return l("web.common.time_unavailable", t);
	let r = {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hourCycle: "h23",
		timeZoneName: "short"
	};
	try {
		return new Intl.DateTimeFormat(t, r).format(n);
	} catch {
		return new Intl.DateTimeFormat("zh-CN", r).format(n);
	}
}
var Iy = {
	session_disabled: "web.detail.session_disabled",
	session_check_failed: "web.detail.session_check_failed",
	fixed_hint: "web.detail.fixed_hint",
	legacy_target_unknown: "web.detail.legacy_target_unknown",
	target_invalid: "web.detail.target_invalid",
	target_scene_required: "web.detail.target_scene_required",
	platform_not_found: "web.detail.platform_not_found",
	platform_unavailable: "web.detail.platform_unavailable",
	platform_unsupported: "web.detail.platform_unsupported",
	mention_unsupported: "web.detail.mention_unsupported",
	mention_invalid: "web.detail.mention_invalid",
	transport_unavailable: "web.detail.transport_unavailable",
	message_components_unavailable: "web.detail.message_components_unavailable"
}, Ly = (e, t) => l(Object.hasOwn(Iy, e) ? Iy[e] : "web.detail.unknown", t);
function Ry(e) {
	let t = ky(e);
	return t === "credit" ? "credit" : t === "site_credit" ? "site_credit" : null;
}
function zy(e) {
	let t = (e, t) => typeof e == "string" && e.length > 0 && [...e].length <= t && !wy.test(e), n = (e) => t(e, 32) && !/\s/u.test(e), r = (e) => e === null || typeof e == "string" && e.length <= 64 && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(e) && Number.isFinite(Date.parse(e));
	if (!Cy(e) || !Array.isArray(e.accounts) || e.accounts.length > 100) throw Error("invalid_response");
	let i = /* @__PURE__ */ new Set();
	return { accounts: e.accounts.map((e) => {
		if (!Cy(e) || !t(e.account_id, 128) || i.has(e.account_id) || ![
			"unidentified",
			"verified",
			"ambiguous",
			"changed",
			"stale"
		].includes(e.unit_state) || !(e.unit === null || n(e.unit)) || !r(e.observed_at) || !Array.isArray(e.choices) || e.choices.length > 20 || e.unit_state === "verified" && !e.unit) throw Error("invalid_response");
		i.add(e.account_id);
		let a = /* @__PURE__ */ new Set();
		for (let n of ["metric", "binding_metric"]) if (e[n] !== void 0 && (n !== "binding_metric" || e[n] !== null) && (!t(e[n], 64) || /\s/u.test(e[n]))) throw Error("invalid_response");
		if (e.change_reason !== void 0 && ![
			"",
			"metric_changed",
			"query_identity_changed",
			"unit_changed"
		].includes(e.change_reason) || e.choices_state !== void 0 && ![
			"fresh",
			"expired",
			"unavailable"
		].includes(e.choices_state) || e.choices_observed_at !== void 0 && !r(e.choices_observed_at) || e.choices_state && e.choices_state !== "fresh" && e.choices.length) throw Error("invalid_response");
		return {
			account_id: e.account_id,
			unit_state: e.unit_state,
			unit: e.unit,
			observed_at: e.observed_at,
			...Object.fromEntries([
				"metric",
				"binding_metric",
				"change_reason",
				"choices_state",
				"choices_observed_at"
			].filter((t) => e[t] !== void 0).map((t) => [t, e[t]])),
			choices: e.choices.map((e) => {
				if (!Cy(e) || typeof e.id != "string" || !/^[0-9a-f]{64}$/.test(e.id) || a.has(e.id) || !t(e.metric, 64) || /\s/u.test(e.metric) || !n(e.unit)) throw Error("invalid_response");
				return a.add(e.id), {
					id: e.id,
					metric: e.metric,
					unit: e.unit
				};
			})
		};
	}) };
}
function By(e) {
	if (typeof e != "string" || wy.test(e)) throw new u("web.validation.umo_invisible");
	let t = e.trim(), n = t.indexOf(":"), r = t.indexOf(":", n + 1);
	if ([...t].length > 512 || /\s/u.test(t) || n <= 0 || r <= n + 1 || r === t.length - 1) throw new u("web.validation.umo_format");
	let i = t.slice(n + 1, r), a = t.slice(r + 1);
	if (![
		"FriendMessage",
		"GroupMessage",
		"OtherMessage"
	].includes(i)) throw new u("web.validation.umo_type");
	return {
		umo: t,
		type: i,
		session: a
	};
}
function Vy(e, t = 100) {
	if (!Array.isArray(e) || e.length > t) throw new u("web.validation.id_limit", { limit: t });
	let n = [];
	for (let t of e) {
		if (typeof t != "string" || wy.test(t) || !Ty.test(t.trim())) throw new u("web.validation.qq_id");
		let e = t.trim();
		n.includes(e) || n.push(e);
	}
	return n;
}
function Hy(e) {
	if (!Array.isArray(e) || e.length > 100) throw new u("web.validation.id_limit", { limit: 100 });
	let t = [];
	for (let n of e) {
		if (typeof n != "string" || wy.test(n) || !(Ty.test(n.trim()) || /^qq_official(?:_webhook)?:[A-Za-z0-9_-]{1,128}$/.test(n.trim()))) throw new u("error.alert_config.invalid_admin_id", { label: "" });
		let e = n.trim();
		t.includes(e) || t.push(e);
	}
	return t;
}
function Uy(e) {
	if (!Array.isArray(e) || e.length > 20) throw new u("web.validation.target_limit");
	let t = /* @__PURE__ */ new Set();
	return e.map((e) => {
		if (!Cy(e) || Object.keys(e).some((e) => ![
			"umo",
			"mentions",
			"scene"
		].includes(e)) || !Object.hasOwn(e, "umo") || !Object.hasOwn(e, "mentions")) throw new u("web.validation.target_fields");
		let n = By(e.umo), r = Vy(e.mentions, 20), i = Object.hasOwn(e, "scene"), a = e.scene;
		if (i) {
			let e = a === "qq_group" && n.type === "GroupMessage", t = a === "qq_c2c" && n.type === "FriendMessage";
			if (!(e || t) || r.length) throw new u("error.alert_config.invalid_target_scene");
		} else if (r.length && (n.type !== "GroupMessage" || !Ty.test(n.session.split("_").at(-1)))) throw new u("web.validation.group_mentions");
		if (t.has(n.umo)) throw new u("web.validation.duplicate_umo");
		return t.add(n.umo), {
			umo: n.umo,
			mentions: r,
			...i ? { scene: a } : {}
		};
	});
}
function Wy(e) {
	if (typeof e != "string") throw new u("web.validation.targets_text");
	let t = [], n = /* @__PURE__ */ new Set();
	for (let [r, i] of e.split(/\r\n|\r|\n/).entries()) try {
		if (/[\p{Cc}\p{Cf}\p{Cs}]/u.test(i.replaceAll("	", ""))) throw new u("web.validation.invisible_chars");
		if (!i.trim()) continue;
		let [e, ...r] = i.trim().split(/\s+/u), [a] = r, o;
		if (a?.startsWith("scene=")) {
			if (r.length !== 1) throw new u("error.alert_config.invalid_target_scene");
			o = {
				umo: e,
				mentions: [],
				scene: a.slice(6)
			};
		} else {
			if (r.some((e) => !e.startsWith("@"))) throw new u("web.validation.mentions_suffix");
			o = {
				umo: e,
				mentions: r.map((e) => e.slice(1))
			};
		}
		let s = Uy([o])[0];
		if (n.has(s.umo)) throw new u("web.validation.duplicate_umo");
		if (n.add(s.umo), t.push(s), t.length > 20) throw new u("web.validation.target_limit");
	} catch (e) {
		throw new u("web.validation.target_line", {
			line: r + 1,
			message: e instanceof u ? e : new u("web.validation.invalid_input")
		});
	}
	return t;
}
function Gy(e) {
	return Array.isArray(e) ? e.map((e) => {
		let t = e.scene ? ["scene=" + e.scene] : e.mentions.map((e) => "@" + e);
		return [e.umo, ...t].join(" ");
	}).join("\n") : "";
}
function Ky(e) {
	if (typeof e != "string" || wy.test(e)) throw new u("web.validation.finite_decimal");
	let t = e.trim();
	if (t.length > 50 || !/^-?(?:0|[1-9][0-9]{0,29})(?:\.[0-9]{1,18})?$/.test(t)) throw new u("web.validation.decimal_length");
	return /^-?0(?:\.0+)?$/.test(t) ? "0" : t;
}
function qy(e) {
	let t = Ky(e), [n, r = ""] = t.split(".");
	return {
		n: BigInt(n.replace("-", "") + r) * (t.startsWith("-") ? -1n : 1n),
		scale: r.length
	};
}
function Jy(e, t) {
	let n = qy(e), r = qy(t), i = Math.max(n.scale, r.scale);
	return n.n * 10n ** BigInt(i - n.scale) - r.n * 10n ** BigInt(i - r.scale);
}
function Yy(e, t) {
	if (e === void 0) return {
		...Ey(),
		metric: ky(t)
	};
	if (!Cy(e) || Object.keys(e).some((e) => !Object.hasOwn(Ey(), e))) throw new u("web.validation.alert_fields");
	let n = {
		...Ey(),
		...e
	};
	if (typeof n.enabled != "boolean" || !Number.isInteger(n.check_interval_minutes) || n.check_interval_minutes < 1 || n.check_interval_minutes > 4320) throw new u("web.validation.interval_range");
	if (!Number.isInteger(n.repeat_minutes) || n.repeat_minutes < 0 || n.repeat_minutes > 4320) throw new u("web.validation.repeat_range");
	if (typeof n.metric != "string" || wy.test(n.metric) || n.metric.trim() && !Ay(t).includes(n.metric.trim())) throw new u("web.validation.metric");
	if (n.metric = n.metric.trim() || ky(t), typeof n.unit != "string" || [...n.unit.trim()].length > 32 || wy.test(n.unit) || /\s/u.test(n.unit.trim())) throw new u("web.validation.unit");
	n.unit = n.unit.trim();
	for (let e of ["threshold", "recovery_threshold"]) n[e] !== null && (n[e] = Ky(n[e]));
	if (n.recovery_threshold !== null && (n.threshold === null || Jy(n.recovery_threshold, n.threshold) <= 0n)) throw new u("web.validation.recovery_order");
	return n;
}
function Xy(e) {
	if (e === void 0) return Dy();
	if (!Cy(e) || Object.keys(e).some((e) => ![
		"enabled",
		"provider_id",
		"persona_id"
	].includes(e))) throw new u("web.validation.llm_fields");
	let t = {
		...Dy(),
		...e
	};
	if (typeof t.enabled != "boolean") throw new u("web.validation.llm_switch");
	for (let e of ["provider_id", "persona_id"]) if (Object.hasOwn(t, e)) {
		if (typeof t[e] != "string" || [...t[e].trim()].length > 128 || wy.test(t[e])) throw new u("web.validation.llm_ids");
		t[e] = t[e].trim();
	}
	return t;
}
function Zy(e, t) {
	let n = [], r = [];
	try {
		r = Uy(e.balance_alert_targets === void 0 ? [] : e.balance_alert_targets);
	} catch (e) {
		n.push(d(e, t));
	}
	try {
		Hy(e.balance_alert_admin_qq_ids === void 0 ? [] : e.balance_alert_admin_qq_ids);
	} catch (e) {
		n.push(d(e, t));
	}
	try {
		Xy(e.balance_alert_llm);
	} catch (e) {
		n.push(d(e, t));
	}
	for (let i of e.providers || []) try {
		let e = Yy(i.balance_alert, i);
		if (e.enabled && (i.enabled !== void 0 && i.enabled !== !0 || e.threshold === null || !e.metric || r.length === 0)) throw new u("web.validation.alert_prerequisites");
	} catch (e) {
		n.push(l("web.validation.account_alert", t, {
			account: i.display_name || i.id,
			message: d(e, t)
		}));
	}
	return n;
}
function Qy(e) {
	if (!Cy(e) || typeof e.running != "boolean" || typeof e.storage_available != "boolean" || !Array.isArray(e.accounts) || e.accounts.length > 100) throw Error("invalid_response");
	return {
		running: e.running,
		storage_available: e.storage_available,
		accounts: e.accounts.map((e) => {
			if (!Cy(e) || typeof e.account_id != "string" || e.account_id.length > 128 || typeof e.status != "string" || !/^[a-z_]{1,64}$/.test(e.status) || e.detail_code !== void 0 && (typeof e.detail_code != "string" || !/^[a-z_]{0,64}$/.test(e.detail_code))) throw Error("invalid_response");
			return {
				account_id: e.account_id,
				status: e.status,
				...e.detail_code ? { detail_code: e.detail_code } : {},
				...Object.fromEntries(["last_checked_at", "last_sent_at"].filter((t) => typeof e[t] == "string" && e[t].length <= 64 && !wy.test(e[t])).map((t) => [t, e[t]]))
			};
		})
	};
}
var $y = {
	timeout_seconds: {
		description: "单个账户查询的最长等待秒数",
		type: "float",
		default: 8,
		invisible: !0
	},
	total_timeout_seconds: {
		description: "一次查询所有目标的最长等待秒数",
		type: "float",
		default: 30,
		invisible: !0
	},
	cache_ttl_seconds: {
		description: "成功查询结果的缓存秒数",
		type: "float",
		default: 60,
		invisible: !0
	},
	max_concurrency: {
		description: "同时查询的账户数上限",
		type: "int",
		default: 4,
		invisible: !0
	},
	command_admin_only: {
		description: "仅管理员可查询额度",
		type: "bool",
		default: !0,
		invisible: !0
	},
	private_allowed_user_ids: {
		description: "私聊白名单",
		type: "list",
		default: [],
		hint: "填写完整 平台名:用户ID，例如 aiocqhttp:123456；管理员无需加入。/yql 余额查询还受上方管理员开关限制。",
		invisible: !0
	},
	allow_group_queries: {
		description: "是否允许在群聊查询",
		type: "bool",
		default: !1,
		invisible: !0
	},
	group_allowed_user_ids: {
		description: "群聊查询白名单用户 ID",
		type: "list",
		default: [],
		invisible: !0
	},
	providers: /* @__PURE__ */ JSON.parse("{\"description\":\"查询账户\",\"type\":\"template_list\",\"default\":[],\"templates\":{\"deepseek\":{\"name\":\"DeepSeek\",\"hint\":\"官方余额\",\"display_item\":\"display_name\",\"hide_hint_in_list\":true,\"items\":{\"id\":{\"description\":\"账户唯一 ID\",\"type\":\"string\",\"default\":\"\"},\"display_name\":{\"description\":\"显示名称\",\"type\":\"string\",\"default\":\"\"},\"aliases\":{\"description\":\"用于命令和自然语言匹配的其他名称\",\"type\":\"list\",\"default\":[]},\"enabled\":{\"description\":\"启用此账户\",\"type\":\"bool\",\"default\":true},\"timeout_seconds\":{\"description\":\"账户查询超时秒数\",\"type\":\"float\",\"default\":8.0},\"cache_ttl_seconds\":{\"description\":\"账户成功结果缓存秒数\",\"type\":\"float\",\"default\":60.0},\"type\":{\"description\":\"供应商类型\",\"type\":\"string\",\"default\":\"deepseek\",\"invisible\":true},\"auth\":{\"description\":\"余额查询 API Key\",\"type\":\"object\",\"items\":{\"api_key\":{\"description\":\"DeepSeek API Key\",\"type\":\"string\",\"default\":\"\",\"secret\":true}}},\"balance_alert\":{\"description\":\"账户额度预警\",\"type\":\"object\",\"items\":{\"enabled\":{\"description\":\"启用预警\",\"type\":\"bool\",\"default\":false},\"check_interval_minutes\":{\"description\":\"检查间隔（1–4320 分钟）\",\"type\":\"int\",\"default\":15},\"metric\":{\"description\":\"指标 ID（空为供应商默认）\",\"type\":\"string\",\"default\":\"\"},\"unit\":{\"description\":\"旧版单位参考（自动识别后验证）\",\"type\":\"string\",\"default\":\"\",\"invisible\":true},\"threshold\":{\"description\":\"触发阈值\",\"type\":\"string\",\"default\":null,\"hint\":\"填写普通十进制文本；未设置为 null，启用前必须明确设置。\"},\"recovery_threshold\":{\"description\":\"恢复阈值（空为自动滞回）\",\"type\":\"string\",\"default\":null},\"repeat_minutes\":{\"description\":\"持续低额重复间隔（0 表示不重复）\",\"type\":\"int\",\"default\":0}}}}},\"alibaba_bailian\":{\"name\":\"阿里云百炼\",\"hint\":\"账户现金余额\",\"display_item\":\"display_name\",\"hide_hint_in_list\":true,\"items\":{\"id\":{\"description\":\"账户唯一 ID\",\"type\":\"string\",\"default\":\"\"},\"display_name\":{\"description\":\"显示名称\",\"type\":\"string\",\"default\":\"\"},\"aliases\":{\"description\":\"用于命令和自然语言匹配的其他名称\",\"type\":\"list\",\"default\":[]},\"enabled\":{\"description\":\"启用此账户\",\"type\":\"bool\",\"default\":true},\"timeout_seconds\":{\"description\":\"账户查询超时秒数\",\"type\":\"float\",\"default\":8.0},\"cache_ttl_seconds\":{\"description\":\"账户成功结果缓存秒数\",\"type\":\"float\",\"default\":60.0},\"type\":{\"description\":\"供应商类型\",\"type\":\"string\",\"default\":\"alibaba_bailian\",\"invisible\":true},\"auth\":{\"description\":\"阿里云 RAM 只读查询凭据\",\"type\":\"object\",\"items\":{\"access_key_id\":{\"description\":\"RAM AccessKey ID\",\"hint\":\"查询阿里云 BSS 现金余额、可用额度、信用额度。RAM 身份至少需 AliyunBSSReadOnlyAccess；不能用 DashScope 模型 API Key。\",\"type\":\"string\",\"default\":\"\",\"secret\":true},\"access_key_secret\":{\"description\":\"RAM AccessKey Secret\",\"type\":\"string\",\"default\":\"\",\"secret\":true},\"security_token\":{\"description\":\"STS Security Token\",\"hint\":\"可选；仅临时凭据需要。\",\"type\":\"string\",\"default\":\"\",\"secret\":true}}},\"balance_alert\":{\"description\":\"账户额度预警\",\"type\":\"object\",\"items\":{\"enabled\":{\"description\":\"启用预警\",\"type\":\"bool\",\"default\":false},\"check_interval_minutes\":{\"description\":\"检查间隔（1–4320 分钟）\",\"type\":\"int\",\"default\":15},\"metric\":{\"description\":\"指标 ID（空为供应商默认）\",\"type\":\"string\",\"default\":\"\"},\"unit\":{\"description\":\"旧版单位参考（自动识别后验证）\",\"type\":\"string\",\"default\":\"\",\"invisible\":true},\"threshold\":{\"description\":\"触发阈值\",\"type\":\"string\",\"default\":null,\"hint\":\"填写普通十进制文本；未设置为 null，启用前必须明确设置。\"},\"recovery_threshold\":{\"description\":\"恢复阈值（空为自动滞回）\",\"type\":\"string\",\"default\":null},\"repeat_minutes\":{\"description\":\"持续低额重复间隔（0 表示不重复）\",\"type\":\"int\",\"default\":0}}}}},\"grsai\":{\"name\":\"Grsai\",\"hint\":\"账户积分\",\"display_item\":\"display_name\",\"hide_hint_in_list\":true,\"items\":{\"id\":{\"description\":\"账户唯一 ID\",\"type\":\"string\",\"default\":\"\"},\"display_name\":{\"description\":\"显示名称\",\"type\":\"string\",\"default\":\"\"},\"aliases\":{\"description\":\"用于命令和自然语言匹配的其他名称\",\"type\":\"list\",\"default\":[]},\"enabled\":{\"description\":\"启用此账户\",\"type\":\"bool\",\"default\":true},\"timeout_seconds\":{\"description\":\"账户查询超时秒数\",\"type\":\"float\",\"default\":8.0},\"cache_ttl_seconds\":{\"description\":\"账户成功结果缓存秒数\",\"type\":\"float\",\"default\":60.0},\"type\":{\"description\":\"供应商类型\",\"type\":\"string\",\"default\":\"grsai\",\"invisible\":true},\"service_profile\":{\"description\":\"Grsai 账户积分预设\",\"type\":\"string\",\"default\":\"grsai\",\"invisible\":true},\"balance_scope\":{\"description\":\"账户积分\",\"type\":\"string\",\"default\":\"account\",\"invisible\":true},\"auth\":{\"description\":\"Grsai 账户积分请求令牌\",\"type\":\"object\",\"items\":{\"token\":{\"description\":\"请求令牌 token\",\"hint\":\"从 Grsai 用户信息栏取得请求令牌 token；请勿填写模型 API Key 或 Bearer 令牌。插件固定 POST /client/openapi/getCredits，读取 data.credits。\",\"type\":\"string\",\"default\":\"\",\"secret\":true}}},\"region\":{\"description\":\"连接区域\",\"hint\":\"国内与海外均使用内置官方节点，无需手填服务器地址。\",\"type\":\"string\",\"default\":\"china\",\"options\":[\"china\",\"global\"],\"labels\":[\"国内直连\",\"海外节点\"]},\"balance_alert\":{\"description\":\"账户额度预警\",\"type\":\"object\",\"items\":{\"enabled\":{\"description\":\"启用预警\",\"type\":\"bool\",\"default\":false},\"check_interval_minutes\":{\"description\":\"检查间隔（1–4320 分钟）\",\"type\":\"int\",\"default\":15},\"metric\":{\"description\":\"指标 ID（空为供应商默认）\",\"type\":\"string\",\"default\":\"\"},\"unit\":{\"description\":\"旧版单位参考（自动识别后验证）\",\"type\":\"string\",\"default\":\"\",\"invisible\":true},\"threshold\":{\"description\":\"触发阈值\",\"type\":\"string\",\"default\":null,\"hint\":\"填写普通十进制文本；未设置为 null，启用前必须明确设置。\"},\"recovery_threshold\":{\"description\":\"恢复阈值（空为自动滞回）\",\"type\":\"string\",\"default\":null},\"repeat_minutes\":{\"description\":\"持续低额重复间隔（0 表示不重复）\",\"type\":\"int\",\"default\":0}}}}},\"meinianda\":{\"name\":\"Meinianda\",\"hint\":\"账户站内额度\",\"display_item\":\"display_name\",\"hide_hint_in_list\":true,\"items\":{\"id\":{\"description\":\"账户唯一 ID\",\"type\":\"string\",\"default\":\"\"},\"display_name\":{\"description\":\"显示名称\",\"type\":\"string\",\"default\":\"\"},\"aliases\":{\"description\":\"用于命令和自然语言匹配的其他名称\",\"type\":\"list\",\"default\":[]},\"enabled\":{\"description\":\"启用此账户\",\"type\":\"bool\",\"default\":true},\"timeout_seconds\":{\"description\":\"账户查询超时秒数\",\"type\":\"float\",\"default\":8.0},\"cache_ttl_seconds\":{\"description\":\"账户成功结果缓存秒数\",\"hint\":\"站点建议每分钟查询一次，默认缓存 60 秒。\",\"type\":\"float\",\"default\":60.0},\"type\":{\"description\":\"供应商类型\",\"type\":\"string\",\"default\":\"meinianda\",\"invisible\":true},\"auth\":{\"description\":\"余额查询 API Key\",\"type\":\"object\",\"items\":{\"api_key\":{\"description\":\"Meinianda API Key\",\"hint\":\"查询 meinianda.top 的账户站内额度（site_credit）。地址与解析已内置，无需填写。\",\"type\":\"string\",\"default\":\"\",\"secret\":true}}},\"balance_alert\":{\"description\":\"账户额度预警\",\"type\":\"object\",\"items\":{\"enabled\":{\"description\":\"启用预警\",\"type\":\"bool\",\"default\":false},\"check_interval_minutes\":{\"description\":\"检查间隔（1–4320 分钟）\",\"type\":\"int\",\"default\":15},\"metric\":{\"description\":\"指标 ID（空为供应商默认）\",\"type\":\"string\",\"default\":\"\"},\"unit\":{\"description\":\"旧版单位参考（自动识别后验证）\",\"type\":\"string\",\"default\":\"\",\"invisible\":true},\"threshold\":{\"description\":\"触发阈值\",\"type\":\"string\",\"default\":null,\"hint\":\"填写普通十进制文本；未设置为 null，启用前必须明确设置。\"},\"recovery_threshold\":{\"description\":\"恢复阈值（空为自动滞回）\",\"type\":\"string\",\"default\":null},\"repeat_minutes\":{\"description\":\"持续低额重复间隔（0 表示不重复）\",\"type\":\"int\",\"default\":0}}}}},\"openai_compatible\":{\"name\":\"其他兼容服务\",\"hint\":\"自定义余额接口\",\"display_item\":\"display_name\",\"hide_hint_in_list\":true,\"items\":{\"id\":{\"description\":\"账户唯一 ID\",\"type\":\"string\",\"default\":\"\"},\"display_name\":{\"description\":\"显示名称\",\"type\":\"string\",\"default\":\"\"},\"aliases\":{\"description\":\"用于命令和自然语言匹配的其他名称\",\"type\":\"list\",\"default\":[]},\"enabled\":{\"description\":\"启用此账户\",\"type\":\"bool\",\"default\":true},\"timeout_seconds\":{\"description\":\"账户查询超时秒数\",\"type\":\"float\",\"default\":8.0},\"cache_ttl_seconds\":{\"description\":\"账户成功结果缓存秒数\",\"type\":\"float\",\"default\":60.0},\"type\":{\"description\":\"供应商类型\",\"type\":\"string\",\"default\":\"openai_compatible\",\"invisible\":true},\"service_profile\":{\"description\":\"服务类型\",\"hint\":\"余额查询使用服务商专属接口。新 Grsai 账户请直接添加 Grsai 模板；本模板旧条目可切换账户积分预设。\",\"type\":\"string\",\"default\":\"generic\",\"options\":[\"generic\",\"grsai\"],\"labels\":[\"OpenAI 兼容服务 / 第三方服务\",\"Grsai\"]},\"balance_scope\":{\"description\":\"积分范围\",\"hint\":\"账户积分已支持；API Key 积分暂不可查询。\",\"type\":\"string\",\"default\":\"generic\",\"options\":[\"generic\",\"account\",\"api_key\"],\"labels\":[\"请选择积分范围\",\"账户积分（已支持预设）\",\"API Key 积分（暂不可查询）\"],\"condition\":{\"service_profile\":\"grsai\"}},\"auth\":{\"description\":\"余额查询凭据\",\"hint\":\"Grsai 账户积分填请求令牌 token；其他兼容服务按余额文档填写 API Key。\",\"type\":\"object\",\"items\":{\"token\":{\"description\":\"Grsai 请求令牌 token\",\"hint\":\"从 Grsai 用户信息栏取得请求令牌 token；请勿填写模型 API Key 或 Bearer 令牌。\",\"type\":\"string\",\"default\":\"\",\"secret\":true,\"condition\":{\"service_profile\":\"grsai\",\"balance_scope\":\"account\"}},\"api_key\":{\"description\":\"兼容服务 API Key\",\"hint\":\"Grsai 账户积分预设忽略此栏；旧 Key 不会用于账户积分请求。\",\"type\":\"string\",\"default\":\"\",\"secret\":true}}},\"endpoint\":{\"description\":\"余额接口\",\"hint\":\"余额查询使用服务商专属接口，请依据其余额文档填写。\",\"type\":\"object\",\"items\":{\"base_url\":{\"description\":\"服务地址\",\"hint\":\"HTTPS 服务根地址，不含 API 路径。https://api.example.invalid 仅为不可访问的格式示例。\",\"type\":\"string\",\"default\":\"\"},\"path\":{\"description\":\"接口路径\",\"hint\":\"通用服务按文档填写。Grsai 账户积分留空或填 /client/openapi/getCredits；旧条目切换时清除原路径。/account/balance 仅为占位示例。\",\"type\":\"string\",\"default\":\"\"},\"method\":{\"description\":\"请求方法\",\"hint\":\"通用服务按文档填写。Grsai 账户积分固定 POST；旧条目切换时清除原 GET。\",\"type\":\"string\",\"default\":\"\",\"options\":[\"GET\",\"POST\"],\"condition\":{\"advanced_options\":true}},\"auth_mode\":{\"description\":\"认证方式\",\"hint\":\"按余额文档确认；Grsai 账户积分忽略此栏，token 固定放入 JSON 请求体。\",\"type\":\"string\",\"default\":\"\",\"options\":[\"bearer\",\"header\",\"query\"],\"labels\":[\"Bearer 令牌\",\"请求头\",\"查询参数\"],\"condition\":{\"advanced_options\":true}},\"auth_name\":{\"description\":\"认证参数名\",\"hint\":\"仅认证方式为「请求头」或「查询参数」时使用。\",\"type\":\"string\",\"default\":\"\",\"condition\":{\"advanced_options\":true}},\"json_body\":{\"description\":\"静态 JSON 请求体\",\"hint\":\"仅供通用服务使用，不支持模板或凭据。Grsai 账户积分留空；旧条目切换时清除旧请求体。\",\"type\":\"dict\",\"items\":{},\"default\":{},\"condition\":{\"advanced_options\":true}}}},\"advanced_options\":{\"description\":\"高级设置\",\"hint\":\"通用服务配置认证、方法与响应映射；Grsai 账户积分使用固定协议并忽略旧映射。\",\"type\":\"bool\",\"default\":false},\"response_mapping\":{\"description\":\"响应映射\",\"hint\":\"通用服务按文档填写 JSON Pointer，amount_path 必需；Grsai 账户积分忽略旧映射，固定解析 code=0 与 data.credits。\",\"type\":\"dict\",\"items\":{\"amount_path\":{\"description\":\"主余额路径\",\"hint\":\"必需的 JSON Pointer，例如 /data/remaining。\",\"type\":\"string\",\"default\":\"\"},\"total_path\":{\"description\":\"可选总量路径\",\"type\":\"string\",\"default\":\"\"},\"remaining_path\":{\"description\":\"可选剩余量路径\",\"type\":\"string\",\"default\":\"\"},\"used_path\":{\"description\":\"可选已用量路径\",\"type\":\"string\",\"default\":\"\"},\"unit\":{\"description\":\"固定单位\",\"hint\":\"可用 CNY/USD/JPY/credit/credits/tokens/requests/custom；设置 unit_path 时必填。\",\"type\":\"string\",\"default\":\"custom\"},\"unit_path\":{\"description\":\"单位路径\",\"hint\":\"可选 JSON Pointer；运行时值必须与固定 unit 一致。\",\"type\":\"string\",\"default\":\"\"},\"kind\":{\"description\":\"固定余额类别\",\"type\":\"string\",\"default\":\"custom\"},\"kind_path\":{\"description\":\"余额类别路径\",\"hint\":\"可选 JSON Pointer；仅接受 cash/quota/free_quota/subscription/credits/usage/custom。\",\"type\":\"string\",\"default\":\"\"},\"status_path\":{\"description\":\"可选账户状态 JSON Pointer\",\"type\":\"string\",\"default\":\"\"},\"status_values\":{\"description\":\"状态值映射\",\"hint\":\"将供应商状态值映射到 available/unavailable/partial/unknown。\",\"type\":\"dict\",\"items\":{},\"default\":{}},\"expires_at_path\":{\"description\":\"可选到期时间 JSON Pointer\",\"type\":\"string\",\"default\":\"\"},\"expiry_path\":{\"description\":\"到期时间别名\",\"hint\":\"兼容旧版 expires_at_path。\",\"type\":\"string\",\"default\":\"\"},\"success_path\":{\"description\":\"可选业务成功字段路径\",\"type\":\"string\",\"default\":\"\"},\"success_value\":{\"description\":\"success_path 对应的成功值\",\"type\":\"string\",\"default\":\"\"},\"failure_path\":{\"description\":\"可选业务失败字段路径\",\"type\":\"string\",\"default\":\"\"},\"failure_value\":{\"description\":\"failure_path 对应的失败值\",\"type\":\"string\",\"default\":\"\"}},\"default\":{},\"condition\":{\"advanced_options\":true}},\"balance_alert\":{\"description\":\"账户额度预警\",\"type\":\"object\",\"items\":{\"enabled\":{\"description\":\"启用预警\",\"type\":\"bool\",\"default\":false},\"check_interval_minutes\":{\"description\":\"检查间隔（1–4320 分钟）\",\"type\":\"int\",\"default\":15},\"metric\":{\"description\":\"指标 ID（空为供应商默认）\",\"type\":\"string\",\"default\":\"\"},\"unit\":{\"description\":\"旧版单位参考（自动识别后验证）\",\"type\":\"string\",\"default\":\"\",\"invisible\":true},\"threshold\":{\"description\":\"触发阈值\",\"type\":\"string\",\"default\":null,\"hint\":\"填写普通十进制文本；未设置为 null，启用前必须明确设置。\"},\"recovery_threshold\":{\"description\":\"恢复阈值（空为自动滞回）\",\"type\":\"string\",\"default\":null},\"repeat_minutes\":{\"description\":\"持续低额重复间隔（0 表示不重复）\",\"type\":\"int\",\"default\":0}}}}},\"provider_account\":{\"name\":\"旧版通用账户\",\"hint\":\"仅供旧配置编辑\",\"display_item\":\"display_name\",\"items\":{\"id\":{\"description\":\"账户唯一 ID\",\"type\":\"string\",\"default\":\"\"},\"type\":{\"description\":\"供应商类型\",\"hint\":\"本旧模板没有 Grsai 账户积分的切换字段。迁移时请新建 Grsai 条目并禁用旧条目。\",\"type\":\"string\",\"default\":\"deepseek\",\"options\":[\"alibaba_bailian\",\"deepseek\",\"openai_compatible\"]},\"display_name\":{\"description\":\"显示名称\",\"type\":\"string\",\"default\":\"\"},\"aliases\":{\"description\":\"用于命令和自然语言匹配的其他名称\",\"type\":\"list\",\"default\":[]},\"enabled\":{\"description\":\"启用此账户\",\"type\":\"bool\",\"default\":true},\"timeout_seconds\":{\"description\":\"账户查询超时秒数\",\"type\":\"float\",\"default\":8.0},\"cache_ttl_seconds\":{\"description\":\"账户成功结果缓存秒数\",\"type\":\"float\",\"default\":60.0},\"auth\":{\"description\":\"账户凭据\",\"type\":\"object\",\"items\":{\"api_key\":{\"description\":\"余额 API Key\",\"hint\":\"用于 DeepSeek 或兼容余额接口，不用于阿里云 BSS。\",\"type\":\"string\",\"default\":\"\",\"secret\":true},\"access_key_id\":{\"description\":\"RAM AccessKey ID\",\"hint\":\"与 DashScope 模型 API Key 不同。\",\"type\":\"string\",\"default\":\"\",\"secret\":true},\"access_key_secret\":{\"description\":\"RAM AccessKey Secret\",\"type\":\"string\",\"default\":\"\",\"secret\":true},\"security_token\":{\"description\":\"STS Security Token\",\"hint\":\"可选；仅临时凭据需要。\",\"type\":\"string\",\"default\":\"\",\"secret\":true}}},\"endpoint\":{\"description\":\"余额接口\",\"hint\":\"只读余额端点，必须使用 HTTPS。\",\"type\":\"object\",\"items\":{\"url\":{\"description\":\"余额 URL\",\"hint\":\"完整 HTTPS 地址，不含 query、凭据或 fragment。\",\"type\":\"string\",\"default\":\"\"},\"base_url\":{\"description\":\"服务地址\",\"hint\":\"HTTPS 服务根地址，可与接口路径配合。\",\"type\":\"string\",\"default\":\"\"},\"path\":{\"description\":\"经文档确认的只读余额路径\",\"type\":\"string\",\"default\":\"\"},\"method\":{\"description\":\"请求方法\",\"hint\":\"只允许 GET 或已确认无副作用的 POST。\",\"type\":\"string\",\"default\":\"GET\",\"options\":[\"GET\",\"POST\"]},\"auth_mode\":{\"description\":\"API Key 认证位置\",\"type\":\"string\",\"default\":\"bearer\",\"options\":[\"bearer\",\"header\",\"query\"],\"labels\":[\"Bearer 令牌\",\"请求头\",\"查询参数\"]},\"auth_name\":{\"description\":\"认证参数名\",\"hint\":\"仅认证方式为「请求头」或「查询参数」时使用。\",\"type\":\"string\",\"default\":\"\"},\"json_body\":{\"description\":\"静态 JSON 请求体\",\"hint\":\"仅用于有文档依据的只读 POST，不支持模板或凭据。\",\"type\":\"dict\",\"items\":{},\"default\":{}}}},\"response_mapping\":{\"description\":\"响应映射\",\"hint\":\"使用 JSON Pointer 映射余额和可选状态字段；amount_path 必需。\",\"type\":\"dict\",\"items\":{\"amount_path\":{\"description\":\"主余额路径\",\"hint\":\"必需的 JSON Pointer，例如 /data/remaining。\",\"type\":\"string\",\"default\":\"\"},\"total_path\":{\"description\":\"可选总量路径\",\"type\":\"string\",\"default\":\"\"},\"remaining_path\":{\"description\":\"可选剩余量路径\",\"type\":\"string\",\"default\":\"\"},\"used_path\":{\"description\":\"可选已用量路径\",\"type\":\"string\",\"default\":\"\"},\"unit\":{\"description\":\"固定单位\",\"hint\":\"可用 CNY/USD/JPY/credit/credits/tokens/requests/custom；设置 unit_path 时必填。\",\"type\":\"string\",\"default\":\"custom\"},\"unit_path\":{\"description\":\"单位路径\",\"hint\":\"可选 JSON Pointer；运行时值必须与固定 unit 一致。\",\"type\":\"string\",\"default\":\"\"},\"kind\":{\"description\":\"固定余额类别\",\"type\":\"string\",\"default\":\"custom\"},\"kind_path\":{\"description\":\"余额类别路径\",\"hint\":\"可选 JSON Pointer；仅接受 cash/quota/free_quota/subscription/credits/usage/custom。\",\"type\":\"string\",\"default\":\"\"},\"status_path\":{\"description\":\"可选账户状态 JSON Pointer\",\"type\":\"string\",\"default\":\"\"},\"status_values\":{\"description\":\"状态值映射\",\"hint\":\"将供应商状态值映射到 available/unavailable/partial/unknown。\",\"type\":\"dict\",\"items\":{},\"default\":{}},\"expires_at_path\":{\"description\":\"可选到期时间 JSON Pointer\",\"type\":\"string\",\"default\":\"\"},\"expiry_path\":{\"description\":\"到期时间别名\",\"hint\":\"兼容旧版 expires_at_path。\",\"type\":\"string\",\"default\":\"\"},\"success_path\":{\"description\":\"可选业务成功字段路径\",\"type\":\"string\",\"default\":\"\"},\"success_value\":{\"description\":\"success_path 对应的成功值\",\"type\":\"string\",\"default\":\"\"},\"failure_path\":{\"description\":\"可选业务失败字段路径\",\"type\":\"string\",\"default\":\"\"},\"failure_value\":{\"description\":\"failure_path 对应的失败值\",\"type\":\"string\",\"default\":\"\"}},\"default\":{}},\"balance_alert\":{\"description\":\"账户额度预警\",\"type\":\"object\",\"items\":{\"enabled\":{\"description\":\"启用预警\",\"type\":\"bool\",\"default\":false},\"check_interval_minutes\":{\"description\":\"检查间隔（1–4320 分钟）\",\"type\":\"int\",\"default\":15},\"metric\":{\"description\":\"指标 ID（空为供应商默认）\",\"type\":\"string\",\"default\":\"\"},\"unit\":{\"description\":\"旧版单位参考（自动识别后验证）\",\"type\":\"string\",\"default\":\"\",\"invisible\":true},\"threshold\":{\"description\":\"触发阈值\",\"type\":\"string\",\"default\":null,\"hint\":\"填写普通十进制文本；未设置为 null，启用前必须明确设置。\"},\"recovery_threshold\":{\"description\":\"恢复阈值（空为自动滞回）\",\"type\":\"string\",\"default\":null},\"repeat_minutes\":{\"description\":\"持续低额重复间隔（0 表示不重复）\",\"type\":\"int\",\"default\":0}}}},\"hide_hint_in_list\":true}},\"invisible\":true}"),
	balance_alert_targets: {
		description: "额度预警推送目标",
		type: "list",
		default: [],
		hint: "由插件页面管理，每项含 umo 与 mentions；不会自动测试发送。",
		invisible: !0
	},
	balance_alert_admin_qq_ids: {
		description: "预警管理 QQ 白名单",
		type: "list",
		default: [],
		hint: "可信 QQ 身份命中此列表或 AstrBot 内置管理员可管理预警；推送目标不赋予管理权限。",
		invisible: !0
	},
	balance_alert_llm: {
		description: "智能提示",
		type: "object",
		invisible: !0,
		items: {
			enabled: {
				description: "智能提示",
				type: "bool",
				default: !0
			},
			provider_id: {
				description: "旧版配置（不再使用）",
				type: "string",
				default: "",
				invisible: !0
			},
			persona_id: {
				description: "旧版配置（不再使用）",
				type: "string",
				default: "",
				invisible: !0
			}
		}
	}
}, eb = $y.providers.templates, tb = {
	moonshot: "Moonshot",
	stepfun: "StepFun",
	openrouter: "OpenRouter",
	novita: "Novita AI",
	xai: "xAI",
	venice: "Venice",
	vercel_gateway: "Vercel AI Gateway",
	pollinations: "Pollinations",
	minimax_plan: "MiniMax Token Plan",
	glm_plan: "GLM Coding Plan",
	new_api: "New API",
	sub2api: "Sub2API"
}, nb = /* @__PURE__ */ new Set([
	"moonshot",
	"stepfun",
	"minimax_plan",
	"glm_plan"
]), rb = /* @__PURE__ */ new Set(["new_api", "sub2api"]), ib = {
	type: "string",
	default: ""
}, ab = Object.fromEntries(Object.entries(tb).map(([e, t]) => {
	let n = {
		...eb.deepseek.items,
		type: {
			...eb.deepseek.items.type,
			default: e
		}
	};
	return nb.has(e) && (n.region = { ...eb.grsai.items.region }), e === "xai" && (n.team_id = {
		type: "string",
		default: ""
	}), rb.has(e) && (n.endpoint = {
		type: "object",
		items: { base_url: ib }
	}), [e, {
		name: t,
		items: n
	}];
})), ob = {
	...eb,
	...ab
}, sb = [
	"deepseek",
	"alibaba_bailian",
	"grsai",
	"meinianda",
	...Object.keys(tb),
	"openai_compatible"
];
function cb(e) {
	return Object.hasOwn(tb, e) ? "web.provider." + e + "_help" : e === "alibaba_bailian" ? "web.provider.alibaba_help" : [
		"deepseek",
		"grsai",
		"meinianda"
	].includes(e) ? "web.provider." + e + "_help" : "web.provider.compatible_help";
}
var lb = (e) => rb.has(e), ub = Object.fromEntries(Object.entries($y).filter(([e]) => e !== "providers")), db = {
	type: "string",
	default: "auto",
	options: ["auto", ...a]
}, fb = [{
	title: "web.settings.query_and_cache",
	number: "01",
	keys: [
		"timeout_seconds",
		"total_timeout_seconds",
		"cache_ttl_seconds",
		"max_concurrency"
	]
}, {
	title: "web.settings.query_access",
	number: "02",
	keys: [
		"command_admin_only",
		"private_allowed_user_ids",
		"allow_group_queries",
		"group_allowed_user_ids"
	]
}];
function pb(e) {
	return JSON.parse(JSON.stringify(e));
}
function mb(e) {
	return Object.fromEntries(Object.entries(e).filter(([e, t]) => e !== "auth" && !t.secret && !(["provider_id", "persona_id"].includes(e) && t.invisible)).map(([e, t]) => [e, t.items && t.type === "object" ? mb(t.items) : pb(Object.hasOwn(t, "default") ? t.default : "")]));
}
function hb(e, t) {
	let n = {
		...mb(ob[e].items),
		__template_key: e,
		id: "",
		display_name: _b(e, t)
	};
	return n.balance_alert = Yy(n.balance_alert, n), n;
}
function gb(e) {
	return (Object.hasOwn(ob, e?.__template_key) ? ob[e.__template_key] : null) || (Object.hasOwn(ob, e?.type) ? ob[e.type] : null) || ob.provider_account;
}
function _b(e, t) {
	return e === "openai_compatible" ? l("web.provider.compatible_name", t) : e === "provider_account" ? l("web.provider.legacy_name", t) : Object.hasOwn(ob, e) ? ob[e].name : e;
}
var vb = ob.openai_compatible.items, yb = ob.provider_account.items, bb = new Map([
	[ub.private_allowed_user_ids, "web.hint.private_allowlist"],
	[ob.meinianda.items.cache_ttl_seconds, "web.hint.meinianda_cache"],
	[ob.grsai.items.region, "web.hint.region"],
	[vb.service_profile, "web.hint.service_profile"],
	[vb.balance_scope, "web.hint.balance_scope"],
	[vb.advanced_options, "web.hint.advanced_options"],
	[vb.endpoint.items.base_url, "web.hint.base_url"],
	[vb.endpoint.items.path, "web.hint.path"],
	[vb.endpoint.items.method, "web.hint.method"],
	[vb.endpoint.items.auth_mode, "web.hint.auth_mode"],
	[vb.endpoint.items.auth_name, "web.hint.auth_name"],
	[vb.endpoint.items.json_body, "web.hint.json_body"],
	[yb.endpoint.items.url, "web.hint.url"],
	[yb.endpoint.items.base_url, "web.hint.legacy_base_url"],
	[yb.endpoint.items.method, "web.hint.legacy_method"],
	[yb.endpoint.items.auth_name, "web.hint.auth_name"],
	[yb.endpoint.items.json_body, "web.hint.legacy_json_body"],
	...[
		"amount_path",
		"unit",
		"unit_path",
		"kind_path",
		"status_values",
		"expiry_path"
	].map((e) => [yb.response_mapping.items[e], "web.hint." + e])
]);
function xb(e, t) {
	let n = bb.get(e);
	return n ? l(n, t) : void 0;
}
var Sb = {
	region: {
		china: "web.option.region.cn",
		global: "web.option.region.overseas"
	},
	service_profile: { generic: "web.option.profile.generic" },
	balance_scope: {
		generic: "web.option.scope.none",
		account: "web.option.scope.account",
		api_key: "web.option.scope.api_key"
	},
	auth_mode: {
		bearer: "web.option.auth.bearer",
		header: "web.option.auth.header",
		query: "web.option.auth.query"
	}
};
function Cb(e, t, n) {
	if (e === "language") return l("web.language." + t, n);
	let r = Object.hasOwn(Sb, e) ? Sb[e] : void 0;
	return r && Object.hasOwn(r, t) ? l(r[t], n) : e === "service_profile" && t === "grsai" ? "Grsai" : t;
}
function wb(e, t) {
	let n = (e) => l(e, t);
	if (e?.type === "alibaba_bailian") return [
		{
			key: "access_key_id",
			label: "RAM AccessKey ID"
		},
		{
			key: "access_key_secret",
			label: "RAM AccessKey Secret"
		},
		{
			key: "security_token",
			label: n("web.credential.optional_sts")
		}
	];
	if (e?.type === "grsai" || e?.service_profile === "grsai" && e?.balance_scope === "account") return [{
		key: "token",
		label: n("web.credential.grsai_token")
	}];
	let r = {
		openrouter: "web.credential.openrouter_management",
		venice: "web.credential.venice_admin",
		xai: "web.credential.xai_management",
		vercel_gateway: "web.credential.vercel_gateway",
		minimax_plan: "web.credential.minimax_plan",
		glm_plan: "web.credential.glm_plan",
		new_api: "web.credential.gateway_key",
		sub2api: "web.credential.gateway_key"
	};
	return Object.hasOwn(r, e?.type) ? [{
		key: "api_key",
		label: n(r[e.type])
	}] : [{
		key: "api_key",
		label: e?.type === "deepseek" ? "DeepSeek API Key" : e?.type === "meinianda" ? "Meinianda API Key" : n("web.credential.balance_key")
	}];
}
var Tb = {
	timeout_seconds: "web.field.timeout_seconds",
	cache_ttl_seconds: "web.field.cache_ttl_seconds",
	id: "web.field.id",
	display_name: "web.field.display_name",
	aliases: "web.field.aliases",
	enabled: "web.field.enabled",
	type: "web.account.provider",
	base_url: "web.field.base_url",
	path: "web.field.path",
	url: "web.field.url",
	method: "web.field.method",
	auth_mode: "web.field.auth_mode",
	auth_name: "web.field.auth_name",
	json_body: "web.field.json_body",
	amount_path: "web.field.amount_path",
	total_path: "web.field.total_path",
	remaining_path: "web.field.remaining_path",
	used_path: "web.field.used_path",
	unit: "web.field.unit",
	unit_path: "web.field.unit_path",
	kind: "web.field.kind",
	kind_path: "web.field.kind_path",
	status_path: "web.field.status_path",
	status_values: "web.field.status_values",
	expires_at_path: "web.field.expires_at_path",
	expiry_path: "web.field.expiry_path",
	success_path: "web.field.success_path",
	success_value: "web.field.success_value",
	failure_path: "web.field.failure_path",
	failure_value: "web.field.failure_value",
	service_profile: "web.field.service_profile",
	balance_scope: "web.field.balance_scope",
	region: "web.field.region",
	advanced_options: "web.field.advanced_options"
}, Eb = {
	timeout_seconds: "web.global.timeout_seconds",
	total_timeout_seconds: "web.global.total_timeout_seconds",
	cache_ttl_seconds: "web.field.cache_ttl_seconds",
	max_concurrency: "web.global.max_concurrency",
	command_admin_only: "web.global.command_admin_only",
	private_allowed_user_ids: "web.global.private_allowed_user_ids",
	allow_group_queries: "web.global.allow_group_queries",
	group_allowed_user_ids: "web.global.group_allowed_user_ids"
}, Db = /* @__PURE__ */ new Set(["__template_key", ...Object.values(ob).flatMap((e) => Object.keys(e.items).filter((e) => e !== "auth"))]), Ob = new Set(Object.keys(ob.provider_account.items.endpoint.items)), kb = new Set(Object.keys(ob.provider_account.items.response_mapping.items)), Ab = /* @__PURE__ */ new Set([
	"auth",
	"api_key",
	"access_key_id",
	"access_key_secret",
	"security_token",
	"token",
	"secret",
	"password",
	"credentials"
]), jb = (e) => typeof e == "object" && !!e && !Array.isArray(e) && [Object.prototype, null].includes(Object.getPrototypeOf(e));
function Mb(e, t = 0) {
	if (t > 12) throw Error("invalid_response");
	if (e !== null && typeof e != "boolean" && typeof e != "string" && !(typeof e == "number" && Number.isFinite(e))) {
		if (Array.isArray(e)) {
			e.forEach((e) => Mb(e, t + 1));
			return;
		}
		if (!jb(e)) throw Error("invalid_response");
		for (let [n, r] of Object.entries(e)) {
			if (Ab.has(n.toLowerCase()) || [
				"__proto__",
				"prototype",
				"constructor"
			].includes(n)) throw Error("invalid_response");
			Mb(r, t + 1);
		}
	}
}
function Nb(e) {
	if (!jb(e) || e.providers !== void 0 && !Array.isArray(e.providers) || Array.isArray(e.providers) && e.providers.length > 100 || Object.keys(e).some((e) => e !== "providers" && e !== "language" && !Object.hasOwn(ub, e))) throw Error("invalid_response");
	Mb(e), e = pb({
		...mb(ub),
		...e,
		providers: e.providers || []
	}), e.language !== void 0 && !s(e.language) && (e.language = "auto");
	for (let t of e.providers) if (jb(t) && t.type === void 0 && sb.includes(t.__template_key) && (t.type = t.__template_key), !jb(t) || typeof t.id != "string" || typeof t.type != "string" || Object.keys(t).some((e) => !Db.has(e)) || t.endpoint && (!jb(t.endpoint) || Object.keys(t.endpoint).some((e) => !Ob.has(e))) || t.response_mapping && (!jb(t.response_mapping) || Object.keys(t.response_mapping).some((e) => !kb.has(e)))) throw Error("invalid_response");
	e.balance_alert_targets = Uy(e.balance_alert_targets), e.balance_alert_admin_qq_ids = Hy(e.balance_alert_admin_qq_ids), e.balance_alert_llm = Xy(e.balance_alert_llm);
	for (let t of e.providers) t.balance_alert = Yy(t.balance_alert, t);
	return pb(e);
}
function Pb(e) {
	if (!jb(e) || !Number.isSafeInteger(e.revision) || e.revision < 0) throw Error("invalid_response");
	let t = Nb(e.config);
	if (!jb(e.credentials) || !jb(e.encryption) || typeof e.encryption.ready != "boolean" || !jb(e.migration) || typeof e.migration.pending != "boolean") throw Error("invalid_response");
	let n = Object.create(null);
	for (let [t, r] of Object.entries(e.credentials)) {
		if (!jb(r)) throw Error("invalid_response");
		n[t] = Object.create(null);
		for (let [e, i] of Object.entries(r)) {
			if (![
				"api_key",
				"token",
				"access_key_id",
				"access_key_secret",
				"security_token",
				"secret",
				"key"
			].includes(e) || !jb(i) || typeof i.configured != "boolean" || ![
				"encrypted",
				"environment",
				"missing"
			].includes(i.source) || i.configured !== (i.source !== "missing") || Object.keys(i).some((e) => !["configured", "source"].includes(e))) throw Error("invalid_response");
			n[t][e] = {
				configured: i.configured,
				source: i.source
			};
		}
	}
	return {
		revision: e.revision,
		config: t,
		credentials: n,
		encryption: {
			ready: e.encryption.ready,
			state: typeof e.encryption.state == "string" ? e.encryption.state : "unknown",
			reason_code: typeof e.encryption.reason_code == "string" ? e.encryption.reason_code : null
		},
		migration: {
			pending: e.migration.pending,
			account_count: Number.isSafeInteger(e.migration.account_count) ? e.migration.account_count : 0,
			cleanup_pending: e.migration.cleanup_pending === !0,
			legacy_conflict: e.migration.legacy_conflict === !0
		}
	};
}
function Fb(e) {
	if (!jb(e) || typeof e.pending != "boolean" || typeof e.plan_id != "string" || !e.plan_id || ![
		"account_count",
		"plaintext_count",
		"environment_count"
	].every((t) => Number.isSafeInteger(e[t]) && e[t] >= 0)) throw Error("invalid_response");
	return {
		plan_id: e.plan_id,
		pending: e.pending,
		cleanup_pending: e.cleanup_pending === !0,
		legacy_conflict: e.legacy_conflict === !0,
		account_count: e.account_count,
		plaintext_count: e.plaintext_count,
		environment_count: e.environment_count
	};
}
function Ib(e, t) {
	let n = (e) => l(e, t), r = [];
	e.language !== void 0 && !s(e.language) && r.push(n("web.validation.language"));
	for (let t of [
		"timeout_seconds",
		"total_timeout_seconds",
		"cache_ttl_seconds",
		"max_concurrency"
	]) (!(typeof e[t] == "number" && Number.isFinite(e[t]) && e[t] > 0) || t === "max_concurrency" && !Number.isInteger(e[t])) && r.push(n("web.validation.query_parameters"));
	let i = /* @__PURE__ */ new Set();
	for (let t of e.providers) {
		(!t.id?.trim() || i.has(t.id.trim())) && r.push(n("web.validation.account_id")), i.add(t.id?.trim()), t.display_name?.trim() || r.push(n("web.validation.account_name"));
		for (let e of ["timeout_seconds", "cache_ttl_seconds"]) t[e] !== void 0 && !(typeof t[e] == "number" && Number.isFinite(t[e]) && t[e] > 0) && r.push(n("web.validation.account_positive"));
	}
	for (let t of e.providers) if (t.type === "xai" && !/^[A-Za-z0-9_-]{1,128}$/.test(t.team_id ?? "") && r.push(n("config.wallet_team")), rb.has(t.type)) {
		let e = t.endpoint?.base_url;
		try {
			if (typeof e != "string" || !/^https:\/\/(?:[A-Za-z0-9.-]+|\[[0-9A-Fa-f:]+\])(?::[0-9]{1,5})?\/?$/i.test(e) || new URL(e).port === "0") throw TypeError();
		} catch {
			r.push(n("config.wallet_origin"));
		}
	}
	return e.private_allowed_user_ids?.some((e) => !/^\S+:\S+$/.test(e)) && r.push(n("web.validation.private_allowlist")), (e.timeout_seconds > 120 || e.total_timeout_seconds > 300 || e.cache_ttl_seconds > 86400 || e.max_concurrency > 32) && r.push(n("web.validation.global_bounds")), e.providers.some((e) => e.timeout_seconds > 120 || e.cache_ttl_seconds > 86400) && r.push(n("web.validation.account_bounds")), [.../* @__PURE__ */ new Set([...r, ...Zy(e, t)])];
}
//#endregion
//#region src/controller.js
var Lb = /* @__PURE__ */ new Set([
	"isDark",
	"theme",
	"locale",
	"i18n",
	"displayName",
	"pageTitle"
]), Rb = /* @__PURE__ */ new Set([
	"read",
	"update",
	"credential-status",
	"credential-replace",
	"credential-clear",
	"legacy-config-plan",
	"legacy-config-execute"
]), zb = (e) => {
	let t = [
		e?.code,
		e?.error_code,
		e?.message,
		e?.error?.code
	];
	return [e?.status, e?.response?.status].some((e) => e === 401 || e === 403) || t.some((e) => [
		"admin_authorization_denied",
		"page_revoked",
		"asset_revoked",
		"stale_context",
		"unauthorized",
		"forbidden"
	].includes(e)) ? "auth" : [e?.status, e?.response?.status].includes(409) || t.some((e) => [
		"revision_conflict",
		"stale_revision",
		"conflict"
	].includes(e)) ? "conflict" : [e?.status, e?.response?.status].includes(400) || t.some((e) => [
		"validation_error",
		"invalid_config",
		"invalid_request",
		"invalid_credential",
		"invalid_environment",
		"invalid_field",
		"invalid_account"
	].includes(e)) ? "validation" : "unknown";
};
function Bb(e) {
	if (!e || typeof e != "object" || Array.isArray(e) || e.pluginName !== "astrbot_plugin_yomihime_quota_link" || e.pageName !== "00-quota-link") throw Error("invalid_context");
	let t = (e, n = 0) => {
		if (n > 16) throw Error("invalid_context");
		if (e === null || ["string", "boolean"].includes(typeof e) || typeof e == "number" && Number.isFinite(e)) return e;
		if (Array.isArray(e)) return e.map((e) => t(e, n + 1));
		if (e && typeof e == "object" && [Object.prototype, null].includes(Object.getPrototypeOf(e))) return Object.fromEntries(Object.keys(e).sort().map((r) => [r, t(e[r], n + 1)]));
		throw Error("invalid_context");
	};
	return JSON.stringify(t(Object.fromEntries(Object.entries(e).filter(([e]) => !Lb.has(e)))));
}
function Vb(e, t = () => {}) {
	let n, r = "web.notice.connecting", i = "", a = "", o = (e) => typeof e == "function" ? e(s.locale) : e ? l(e, s.locale) : "", s = {
		get locale() {
			return c(s.snapshot?.config.language, n);
		},
		get notice() {
			return o(r);
		},
		get alertNotice() {
			return o(i);
		},
		get unitsNotice() {
			return o(a);
		},
		units: null,
		unitsBusy: !1,
		unitsUnknown: !1,
		alertStatus: null,
		alertBusy: !1,
		ready: !1,
		theme: "light",
		snapshot: null,
		draft: null,
		secret: null,
		plan: null,
		busy: !1,
		stale: !0,
		unknown: !1,
		tone: "neutral",
		edit: 0,
		route: "accounts",
		selected: null
	}, u = 0, d = 0, f = 0, p = 0, m = null, h = !1, g = !1, _, v = null, y = () => t(), b = (e, t = "neutral") => {
		r = e, s.tone = t;
	}, x = () => !!s.snapshot && !!s.draft && JSON.stringify(s.snapshot.config) !== JSON.stringify(s.draft);
	function S() {
		s.snapshot && (s.draft = pb(s.snapshot.config));
	}
	function C() {
		s.secret && (s.secret.value = "", s.secret.environment = ""), s.secret = null;
	}
	function w() {
		u++, d++, s.units = null, s.unitsBusy = !1, s.unitsUnknown = !1, a = "", s.alertStatus = null, s.alertBusy = !1, i = "", C(), s.plan = null, s.draft = null, s.edit++;
	}
	function T(e) {
		f++, v = null, s.busy = !1, w(), s.snapshot = null, s.ready = !1, s.stale = !0, m = null, b(e, "error"), y();
	}
	let E = (e) => !g && s.ready && e.epoch === f && v === e;
	function D(e) {
		u++, d++, s.alertBusy = !1, s.units = null, s.unitsBusy = !1, s.unitsUnknown = !1, a = "", s.alertStatus = null, i = "", s.snapshot = e, S(), s.stale = !1, s.unknown = !1, s.plan = null, s.edit++;
	}
	async function O(t, n, r) {
		if (!Rb.has(t) || !E(r)) throw Error("stale_context");
		let i = await e.apiPost("admin/" + t, n);
		if (!E(r)) throw Error("stale_context");
		return i;
	}
	async function k(e, t, { write: n = !1, plan: r = !1 } = {}) {
		if (g || !s.ready || s.busy || n && (s.stale || !s.snapshot || s.snapshot.migration.pending && e !== "legacy-config-execute")) return !1;
		let i = {
			epoch: f,
			serial: ++p,
			write: n
		};
		v = i, s.busy = !0, C(), s.plan = null, b(n ? "web.notice.saving" : "web.notice.reading"), y();
		try {
			let a = await O(e, t, i);
			if (!E(i)) return !1;
			if (r) s.plan = Fb(a), b(s.plan.legacy_conflict ? "web.notice.legacy_conflict" : s.plan.cleanup_pending ? "web.notice.legacy_cleanup_retry" : s.plan.pending ? "web.notice.legacy_preview_ready" : "web.notice.legacy_not_pending");
			else {
				let r = Pb(a);
				if (n && (r.revision < t.revision || e !== "legacy-config-execute" && r.revision === t.revision)) throw Error("invalid_response");
				D(r), b(r.migration.cleanup_pending ? "web.notice.legacy_cleanup_incomplete" : n ? "web.notice.saved" : "web.notice.loaded", r.migration.cleanup_pending ? "warning" : "success");
			}
			return !0;
		} catch (e) {
			if (!E(i)) return !1;
			let t = zb(e);
			return C(), t === "auth" ? (T("web.notice.authorization_lost"), !1) : (t === "conflict" ? (s.stale = !0, s.unknown = !1, b("web.notice.revision_conflict", "warning")) : t === "validation" ? b("web.notice.validation_failed", "error") : (s.stale = !0, s.unknown = n, b(n ? "web.notice.write_uncertain" : "web.notice.read_failed", "warning")), !1);
		} finally {
			E(i) && (s.busy = !1, v = null, y());
		}
	}
	async function A() {
		return !s.ready || s.busy ? !1 : (C(), k("read", {}));
	}
	async function ee() {
		if (g || !s.ready || s.busy || s.alertBusy) return !1;
		let t = {
			epoch: f,
			revision: s.snapshot?.revision,
			serial: ++d
		};
		s.alertBusy = !0, i = "web.notice.alert_loading", y();
		let n = () => !g && s.ready && t.epoch === f && t.revision === s.snapshot?.revision && t.serial === d;
		try {
			let t = await e.apiPost("admin/alert-status", {});
			return n() ? (s.alertStatus = Qy(t), i = "", !0) : !1;
		} catch (e) {
			return n() ? zb(e) === "auth" ? (T("web.notice.authorization_lost"), !1) : (s.alertStatus = null, i = "web.notice.alert_read_failed", !1) : !1;
		} finally {
			n() && (s.alertBusy = !1, y());
		}
	}
	async function j() {
		if (g || !s.ready || !s.snapshot || s.busy || s.unitsBusy) return !1;
		let t = {
			epoch: f,
			revision: s.snapshot.revision,
			serial: ++u,
			selected: s.selected
		};
		s.unitsBusy = !0, a = "", y();
		let n = () => !g && s.ready && t.epoch === f && t.serial === u && t.revision === s.snapshot?.revision && t.selected === s.selected;
		try {
			let t = await e.apiPost("admin/alert-units", {});
			return n() ? (s.units = zy(t), s.unitsUnknown = !1, !0) : !1;
		} catch (e) {
			return n() ? (s.units = null, zb(e) === "auth" ? T("web.notice.authorization_reopen") : a = "web.notice.unit_read_failed", !1) : !1;
		} finally {
			n() && (s.unitsBusy = !1, y());
		}
	}
	async function te(t) {
		if (g || !s.ready || s.stale || s.busy || s.unitsBusy || !s.snapshot || x() || s.secret || s.snapshot.migration.pending || s.route !== "accounts" || s.selected !== t || !s.snapshot.config.providers.some((e) => e.id === t)) return !1;
		let n = {
			epoch: f,
			serial: ++p,
			write: !1
		};
		v = n, u++, s.busy = !0, s.unitsBusy = !0, a = "web.notice.unit_querying", y();
		try {
			let r = await e.apiPost("admin/alert-refresh-units", {
				revision: s.snapshot.revision,
				account_id: t
			});
			if (!E(n)) return !1;
			s.units = zy(r), s.unitsUnknown = !1;
			let i = s.units.accounts.find((e) => e.account_id === t);
			return a = i?.unit_state === "verified" ? "web.notice.unit_current" : i?.choices.length ? "web.notice.unit_candidates" : "web.notice.unit_no_candidates", !0;
		} catch (e) {
			if (!E(n)) return !1;
			s.units = null;
			let t = zb(e);
			return t === "auth" ? T("web.notice.authorization_reopen") : t === "conflict" ? (s.stale = !0, a = "web.notice.config_changed", b("web.notice.config_changed", "warning")) : a = "web.notice.unit_unverified_candidates", !1;
		} finally {
			E(n) && (s.busy = !1, s.unitsBusy = !1, v = null, y());
		}
	}
	async function ne(t, n) {
		if (g || !s.ready || s.stale || s.busy || s.unitsBusy || s.unitsUnknown || !s.snapshot || x() || s.route !== "accounts" || s.selected !== t) return !1;
		let r = s.snapshot.config.providers.find((e) => e.id === t), i = s.units?.accounts.find((e) => e.account_id === t), o = i?.choices.find((e) => e.id === n && e.metric === r?.balance_alert?.metric);
		if (!i || i.choices_state && i.choices_state !== "fresh" || !(["ambiguous", "changed"].includes(i.unit_state) || i.unit_state === "unidentified" && i.choices.filter((e) => e.metric === r?.balance_alert?.metric).length === 1) || !o || s.snapshot.migration.pending) return !1;
		let c = {
			epoch: f,
			serial: ++p,
			write: !0
		};
		v = c, u++, s.busy = !0, s.unitsBusy = !0, a = "", C(), y();
		try {
			let n = await e.apiPost("admin/alert-bind-unit", {
				revision: s.snapshot.revision,
				account_id: t,
				choice_id: o.id
			});
			return E(c) ? (s.units = zy(n), s.unitsUnknown = !1, a = "web.notice.unit_confirmed", !0) : !1;
		} catch (e) {
			if (!E(c)) return !1;
			s.units = null;
			let t = zb(e);
			return t === "auth" ? (T("web.notice.authorization_reopen"), !1) : (t === "conflict" ? (s.stale = !0, a = "web.notice.config_changed", b("web.notice.config_changed", "warning")) : t === "validation" ? a = "web.notice.unit_candidate_changed" : (s.unitsUnknown = !0, a = "web.notice.unit_confirm_uncertain"), !1);
		} finally {
			E(c) && (s.busy = !1, s.unitsBusy = !1, v = null, y());
		}
	}
	function re(e) {
		if (g) return;
		h = !0, s.theme = e?.isDark === !0 || e?.theme === "dark" ? "dark" : "light", n = e?.locale;
		let t;
		try {
			t = Bb(e);
		} catch {
			T("web.notice.invalid_context");
			return;
		}
		if (s.ready && t === m) {
			y();
			return;
		}
		f++, v = null, s.busy = !1, w(), s.snapshot = null, s.stale = !0, s.unknown = !1, s.ready = !0, m = t, y(), A();
	}
	function ie(e) {
		s.ready && !s.stale && !s.busy && s.draft && (e(s.draft), s.edit++, s.plan = null, y());
	}
	function ae(e, t = null) {
		let n = v?.write;
		f++, u++, d++, s.units = null, s.unitsBusy = !1, a = "", s.alertBusy = !1, v = null, s.busy = !1, C(), s.plan = null, s.edit++, s.route = e, s.selected = t, S(), n && (s.stale = !0, s.unknown = !0, b("web.notice.left_during_write", "warning")), y();
	}
	async function oe() {
		if (!s.draft) return !1;
		if (Ib(s.draft, s.locale).length) {
			let e = pb(s.draft);
			return b((t) => Ib(e, t).join(" "), "error"), y(), !1;
		}
		return k("update", {
			revision: s.snapshot?.revision,
			config: pb(s.draft)
		}, { write: !0 });
	}
	function se(e, t, n = "value") {
		!s.stale && !s.busy && s.ready && s.snapshot && (C(), s.secret = {
			account: e,
			field: t,
			mode: n,
			value: "",
			environment: ""
		}, s.edit++, y());
	}
	function ce(e, t) {
		s.secret && !s.busy && (s.secret[e] = t, s.edit++, y());
	}
	async function le() {
		let e = s.secret;
		if (!e || x()) return !1;
		let t = e.mode === "environment" ? e.environment : e.value;
		return !t.trim() || e.mode === "environment" && !/^[A-Za-z_][A-Za-z0-9_]*$/.test(t) ? (b(e.mode === "environment" ? "web.notice.invalid_environment" : "web.notice.missing_credential", "error"), y(), !1) : k("credential-replace", {
			revision: s.snapshot.revision,
			account_id: e.account,
			field: e.field,
			...e.mode === "environment" ? { environment: t } : { value: t }
		}, { write: !0 });
	}
	async function ue(e, t) {
		return !x() && k("credential-clear", {
			revision: s.snapshot?.revision,
			account_id: e,
			field: t
		}, { write: !0 });
	}
	function de() {
		C(), s.edit++, y();
	}
	function fe() {
		C(), s.plan = null, S(), s.edit++, b("web.notice.discarded"), y();
	}
	function pe() {
		g || (g = !0, f++, v = null, s.busy = !1, w(), s.snapshot = null, s.ready = !1, _?.(), y());
	}
	function me() {
		if (!e || typeof e.apiPost != "function" || typeof e.ready != "function" || typeof e.onContext != "function") {
			b("web.notice.open_in_host", "warning"), y();
			return;
		}
		_ = e.onContext(re), Promise.resolve(e.ready()).then((e) => {
			h || re(e);
		}).catch(() => {
			!h && !g && T("web.notice.session_unavailable");
		});
	}
	return {
		state: s,
		start: me,
		accept: re,
		close: pe,
		refresh: A,
		refreshUnits: j,
		queryUnits: te,
		bindUnit: ne,
		refreshAlerts: ee,
		save: oe,
		dirty: x,
		edit: ie,
		navigate: ae,
		beginSecret: se,
		changeSecret: ce,
		replace: le,
		clear: ue,
		cancelSecret: de,
		discard: fe,
		interactionKey: () => JSON.stringify([
			f,
			s.edit,
			s.route,
			s.selected,
			s.snapshot?.revision,
			s.busy,
			s.ready,
			s.stale,
			u
		]),
		plan: () => k("legacy-config-plan", {}, { plan: !0 }),
		migrate: () => (s.plan?.pending || s.plan?.cleanup_pending) && !s.plan?.legacy_conflict && !x() ? k("legacy-config-execute", {
			revision: s.snapshot?.revision,
			plan_id: s.plan.plan_id,
			confirm: !0
		}, { write: !0 }) : Promise.resolve(!1)
	};
}
//#endregion
//#region src/provider-logo-data.js
var Hb = {
	deepseek: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAACXBIWXMAAAsTAAALEwEAmpwYAAAK0ElEQVR4nO2deZDcRRXHO973fR9AWd53iVLesVTCstM9S8SNpVJSULrZeT0bClHxAKJiKQHjBYh4gAdaKCoaLwovqqKgKFWiYimCBBITCATxiJFs3j7r+5sJ2ezuzPTvmF//frvvU9V/zvTx3q+P1++9NkZRFEVRFEVRFEVRFEVRFEVRFEVRFEVRFEVRFEVRFEVRFEVRFEVRljrL18o9Gi05eHxc7h67LUoEHPHnnJ8R6/mjKoCKMk7yANeS5zbb8lrbljfYljjbkhfZCblfnv+1bXm6JeauAvxrZEruXVyrlcwsP1ruAyE7z2c74t9Zz3sgpHmF+D9QiLxf/77/kxEVW8S12HmxjvhCfI0LCnxOsZ7/bL28JEt9ExNyT+v5jv3/k79cfM+WAHZCHuHa8jLXktc5LxPWy/ss8Wn7irzbenlrw8vKRlsOGTtOHoLfYeMFATri9c7zthChu33C/3SeKdu2ZPkCM8q09fKCQgdnsQGhuUl5cVfIP3Web00juLsESHxz1t86zxfl7YcjOaGHYm11JM8qZrQWEd0N07pkgDIJraBCPN1YLY/P3R/Pn+2jYDstyUkjU/IgMwTWrpW7Oc+fTD4CklWmymD3bYm/6zzPRBX8PgW4qpB+EX87YKa53ZG8d/x4ua8piGTZI/7i7BnHVJEjvDzcef7S3mNSZQoVpgA/DK3Ter4Jp5K8dWLP4oi/Oee/d5uqgc1cZ42ugMDnCoOYR6bkCXn7aD1/J1W9yVFUJrLW1/DyKkt8zQKzzCZTFbpr0+mxhRygBN9DW/P01Xo+P33dPNP00uz1n4d7ear1cozzcqIjORnWRUd8nvX81z6K9TNTBWBVw8DGFm5wIT4rzzHQEX8oW928aXa9GDfXlndhmcikzJ7PNLHBJsd5/kl0oaYfvKsbbXlelj432zKetd4GyevxH4lJOu+pqC1HmZiMr5V7OeJLYgszsxIQ32m9vCNtv0dJDsyheOfDjpB/g8wzdo0cYGLiPH8mthCLKXxB2uMaZpBMdRFPF9Jm4l+bmDRI3hZfcIUqwZVpjEQ448dsb9PLcSYWzSl5piP+X3yhFa4EmxzJk0PGYMXx8jDcKEZpJ/GO5rHyQBPtuEd8eXxhDadYz1uh4CFjYYk/HEcB5GQTC0w9sYU0/AHm7aMkzx80FskxzvP1pSoo8TXRnE9wdWs9/zu6gMoZ6NtCjondK+lSlkNL/N+mlxeWI+2FOkt8WmzBlFqIt495ec6gcWm05C3DvvDCsRE+ESYWI1PyyKXy9bvZA+/5lpA7/ibJsT3dz3IX3pXHfa0QLO1ZG1sY0ZSA+ObRljxj0Bg5kjFL/I9C6ye+MavrWoHIsrI3O9UrvA2OLYNGqtGSJ1nPfyxA6dgSfyracW82TZJXxhdAFQpvCzkdJD6OWeuAbQG3gAHKVhqO+Jz4g1+NYj3fgRiDfuPVIHlzSoFflYwxySrEMZiq4Yj/Envgq1Ss5z3w++vlVzDXc6d3gZOILDNVZuWEPLZ3B/h2BGDgXqDZkgZ8ALEGNibl2WMteWmDZLR73/01GDAq5yLmcyoC8S/Q13nGoUATcaMtrzBVB8ePHp3nUJPpfr6CJKss8ect8d8XhRJ43o04A1wRJ+Pl5cjQ3+KjMVXHev5gj45vzR0j4OXQxHl0EdgXrOfdjvji5EIp9Hd1CCfD9N2jw7cUVcf4hDwYvnClxg0Qb4czCAJFYfJ1JG/sLlV3ltUGLJOm6uCevMcAThe9gem4Pksrsb4N26zakoMXasPYajmoLBc3WFdN1ennsIg78WHUiaga5/kjMIEOZ/B5Z7/Ina6H89lDVQDizaYO4Fas55c05GDI5qQ8zRJfMaRZ4LokXK0lBMPNQrOZ83zq8JSAN5g6gCvIXp2Ad+yw6+9uFk8c/pUrb0BugQX6v25IM8AHTB3od3a3Xk4pqx2IKnaetxQogGkEeVriS2cpwfsXVMAUoWDBM1BbjjB1oF/CBYRIldmWUZLHOM8bCxGA5y/MCrhMbBJQhoXqRU4C3MoVqQDYbJo60N9gw1vKbk9yUvB8UX4h8GVJpo81csBdljviC3vVC/t/cU4fvK3yJuC9IJVKv8401shTym5T96s9twBB3IoTwaxZoW+2L8wahSgA8XmmLiAAse9USrI6TstkmSX+RJHTsvP8sYHpbIh35K2njM1zYczLhjV/0H4Qr3WJEnylKAWwxD8etmcUTMawfJq6kBzBBnQopkUL63hhu3Ti6UGewOhrviMpX2bqBDxRBw+ctGO28dAT5P7ICVjILOD5pkG3nHmOo5bknaZONL08LmDqvCJ2OxHSVZhDJvGOThj3/jt1t0YejavfPDMM/CtM3Rh8BuaZ0Ji6YYIMHEX651vivyEBZCcrGG/M6/ZtPX/L1BHr+esB2n2WqQCO+IyiFMAVXGxLVpg6EhYKzruwXMRuKwxFlvj3sYXt5s8m1+XNTRSNlZPyqLDpr/85uizgul2mY4cLKZE3yrnB8SVAAXZCWUwFQDraynz9nm+ofTp5aHCYpvN6UwG65uKh+BK4uiVzKgJYr0KcN2EYComjKwPcU8y29bs4X//VtV375xJ6BkYm8KrcdlkvPqLw99TC8TNVbqDgc7ZMmUogy6znH0VRAuIzzGIDd+ZhA8C75kbNxI1uyvq+QNbCf1rIxaz2JCZXBEGEfQHXNlryUFMBOi+SzJQl/J1Zs5DWAlj9gtdB4kvxpk+e+jpv9MgplvjjeBso6zt9rqTEltbLm8xiJsmRl+qdHr4gz064Y+Pff3pFjGHa/xzpWAl/M1QFqMgxeOjAqzXVV0F8blYl6HUljSNW2vQpoyQH9ot1yCn8i5fUK6K94gb7DNBXMZ1nS8688OkjMVETr0+T69e2ZEVhOXv3teNXeR+jrB1dd+l0ySOIL9n79FsaHPHPB/zvtZbk5aH/Z5PHGYq5OsZFT1VM4FFsA6GPNc4WVtrcAkkCisGCYLxaEjrLWJKTChD+bXjtwyxluu8Epcv+kfjip3tHBw6ogdPxL8da8sSQ/7Sez8ynBHy9JXlNVSyf0UBYd7YplTeEpmlHSHeaLxMpagI9i9flXwqQGIJPjREnURng8Jhp8Ij/CdMxXiDp9//I2JlSKDNIbxtih3Be3pNfCTp1YqYalEls0ZLnHh4ZOXHhhF367HRpOD42vByWPVsZbwxZElzydnGglTOkP51j6jG19wVICx57znvM6m7otnTW2N4h6mlmGetlctBskDwMTby9KCXo1r05+vs+ZYNXsWLfxfcQxo3Ji+R9MnFithgUEpd+NpBJs9RA3sBqJ5nkLdbz9zvpYJCSJnm0sY33gBAoWmTiZ7z+aZYiSHYcfoVcrWIT+4Ycbb28PWsC6K6lsh7ZQIYJ8ukXEVlb4uzwh7nLRGdpkCOR/RQ3iwgmxQzXSW+XZE3dhBA1S/wNvC6KnMG1jAQaFjCX4j4gvnBn+m8+ic9BvGHs8Vq0uLa8uoovj9kMt4tKDmxbDscLmBUQ/A3YpWe5qVQKygCWJJAuPWcwX4lNngq+SieGthzV8TMo3onTdoxLv8UGrVIvcijzScy/bTkEmTyThFDElwefy5HBg3gzlhdENsM8DcPUiiGltlVKBHZ13B7C6xbXsFg+cEuIAh8DFbKiKIqiKIqiKIqiKIqiKIqiKIqiKIqiKIqiKIqiKIqiKIqiKIqyKPk/zIqpnUn7qr4AAAAASUVORK5CYII=",
	alibaba_bailian: "data:image/png;base64,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",
	grsai: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAACXBIWXMAAAsTAAALEwEAmpwYAAAHK0lEQVR4nO2deYgcRRTGXw4TdWenvq9mD1dX1iOK4hFvxUTwNkYDCqJRlKBoojF/iGI0KigeSGJQBMWIEVE88D7+UPDCI6Ao4i1KjGfUGIl4RmOyaSlcIYSdmZ6Zmu7qqfeD77+ZoapedU931fdeiSiKoiiKoiiKoiiKoiiKoiiKoiiKoiiKoiiKoihKtgCYQfKymNXb21uKct5Za7cD8AfJJFYBeFRiheR9eQeA+ervcrk8SWLEGLMvyeEAgpDkqBskVki+GkAAkrwEYJW1tiwxYq09Je8AMP8JMEsiZQLJ5XkHgPnqHREZKzFCcn4AAUhy1EYAh0mMlEqlXpK/BBCEJC8BeFBiBcAdkQd/LYAhiRFr7e4k1+cdBOarayRWADwX+dW/sr+/v0tihOTxeQeA+esMiZRxAD6M/Op/Q0TGSIwAmJt3AJivNlprD5IYcUudbskzgCAkOepeiRUANwUQgCQvAfi9UqlsKzFijNnJbXdGPgGukFgB8JjnwXzIWnt0uwVgqac2fzk4OLiVxAjJQ93Dj8fg/9rb27tNRs0fA2Bxq212O54SKWNJvu35dnpx1p3gf369Zifssphf+2Z5Dv5yEZmYU1/mNXEnGy6XywdIjLj/PADfeJ4A0/PsE8nZjVjXANwlseI2O3wGH8ALEgAkTyf5T4r2/tbT0zMgMdIGi7fbOdxDAgHAiQD+qtPmSyVWfFu8AdwsgWGMOcIt7lRp84q8nlVCYKJ7VfM4AX4yxkAChOTU0fpqjDlJYgbAVR4nwBwJGGPMfm6SbtLelyR23BsAya883Po/EpHxUgCHE4CVJDcA2Dvv9gSBMz20OgGMMYdLQSiXy5MAXJl3O0LCLaMua+HqfyTvDigtYq09uJl9APeKZYzZQQPQATjvexN3gOvybrfSwBN/rd05a+0ggD8buPpXRlskoWgYY3Z0t2uX5FHrc+6KbmACnJldD5SWcBUtRgK3geRe1T7nrmgA36UIfryO2Q4werxY6/PGmLPrTIB4HbMFZCyAt0YJ4rQWzCH3ZNh+pR1GDwCf1Fq5q2YPi9oxWzQGBga2rmP0OL/W90k+Psp3Lm+2PcaYowDcGaJIXiCdBslr6/yXryZpGrCIrxgaGtqy2fa4ncLNNmNC0nqSe0qERo8ba/0OgEX/f9YYc3Kr7QJwYQDBTkJ2MnmB5P0pO76uXC7vXO13KpVKN4AfPG6dhp50Ol1iW9d3yRu1fo/kebXWDpp5Fggg0EkNN/MEKTBjSL7eYKfdZJmaZSNDLjxhjLlIigrJmc10GsCbWa7sjZSeqevYZT76uVQq9UjRcE/oLrethY7PzLK9JG8LINhJFd0uRcO5XFrptFszcGsHWbW3XC5bkmsCCHYyimrumQRHX19fvyeHb9MLPc3g8gcDCHZSRcUxjQK420enXZZMhhm9jgkAPgsg2EmV8ZghoeOMHD5LuNfzDPjGefPzDjSr6/NCJI4AeL7I/3+e25941iUSOi4fz3NFz5qeAd8AmDwy8ZLQlMPfYnMAWOK589Mybv/SvINdYxIskdDx/VpVzzPgm66urj7PuYo+5TKJJkvotOG1qqZnwDcAFgQQ7Gp6WQrAFgA+9djpmp6BAFczk3bKx5Z42yF5gueO1/QMhAzJ0zyPRTHqCQB41mOna3oGQofka54nwXwJnUqlspvP3bZ6noEC1AUY9jgWxagpRPJWj7M+c89A4KVwwq8qZoyhTxNm1p6BwIthFaOuYBtMmJl6BnwC4GrPd4FCVBYdR/IDj53O1DPQhnI4X/ucBIWoLWyMOdLzXSBTz4BPXEaz57H4opVcicwg+VR0myNtKIdTZTwWSGwHQWTtGfCJtfYQz2Xxi5EvuWmWT3Seuc1w6xqe/wrCz5geyfL5vqieAZ80Wg4nhYYrlcqBEjokz/U884MSgIUNjMX1RT8gI5STQULSuu7u7l3SDMRIORwvd0QA3xbm9dj32UAB6om0Y2GtPSfKBTIADwcQqLbJWntMVnfEQhbMIrm954eg0PSeWwVNORZTWrgjuu9NkSLSSE3Agmp2A2MxWjmcNHpAiop7aPG9Nh6YfkxrZ2tmoQzAWgBDUmQAnBVAoNomAIsaGIuFMdZJ9r42HpjW9fT07JpmIDYph5NmYq1yp6xLJ2CM2d+nZSpAPZl2LNyxN2l+01VTlU7Ct2UqNFlrj23AP/F+nd97170+SicxYpmqdrRa4QXg47RZTvX8E+60culEPJ8gFqLmpB0Lks+0uspYOELPymHrWp32XEOXBzHKa2HqfYbCQvLUAAKVtEsAFjcwFrc0+91CQ/KVvAPFAF4LN7PVr3HZ1xIDxph9Qi3WQD96Ou1YAJg3cvXPlZhwmS8BBCppo45LORTj3XE7LutaYsLtE7j18U5VqbFKoJ31zq8oiqIoiqIoiqIoiqIoiqIoiqIoiqIoiqIoiqIoiqJIW/kXHBAt4Sv9vTkAAAAASUVORK5CYII=",
	meinianda: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAACXBIWXMAAAsTAAALEwEAmpwYAAAgAElEQVR4nO19CVRUyZomb3ped0/3nOnumTOvl3mznenlnD5vevq0r8zUwqIyXZ5laZWaoFZZVe5arigIsu8Jyb4lCZmQSbIl+6qgoCAKKC6ICqKAIqC4FO6iLGr+c/5I7s0VyP1Clfec75DcyMiIP/7vRvzxxx9xHRysfLks+fR/8LjsYWcuGz6CbfM24HFZrzdwWX/tMBuunfPm/ZrHYZ37qHi2vcmf6DAbLh6XnfJR+Wy793w8Dnt8PWfh/2FU+c5c1oaPymczNuzxOKxcxpTvwln4T85c1quPBGAzSAD2hzVOC35nd+V/t/Rf/pzHYd/4qHw28yTgsrPtTgBnLkvKtOAfwaaGgfdrl7D+wW7K53HY6z42PntWEZDHZYvtonwXJ/bffxz32bMPHNbYmqULfmNT5QcGOvw7Zy7rDOPCfgQY7AU4LH+bEsCFw/L62Pjs2UzABy4u//zHtlE+d/4/87is0Vkg5Edwp2mDxeyN1le+i8sf8bjsyx8bnz3rycfjsC5YnwBclivTgn0E2+g2WOM0n2095Tt98jc8DvvFRwWw5xAJWQqrEcCZyypiXqC5g5285YzXgcdlT6xxmv9bi5W/lrPgM6aFmWvIiwtmvA6TCLHG098yCwSZU+hrroFvljkyXg8el/3Qoikh7/P5XzMtxFyD2w88+NB/Hdw3OTNeF4TLYtZ6Czx+7KtMC2AJ1i1ZYPcyzxZKQTnQARlh3ozLT8BhnzWLAGs/Z/EYr7yFEAW627W8fd98Be/vXicEOFcqZ1x+Ci5L2P/XZAIgc5iuuCXY8tUSeHi5wa5lXqzMJcpHjN9ph22rlzHeDggeh5VmkvJdnBb+K9OVthQJPgeIInx2fGu33kY5qXwK+fFhs4MAXNZrlyXz/sJoAvC4bBnTlbYU108UESWcyk2zeVl71q2EN90X9QjwqqsVtq/5A+NtQcBh7zdK+V87Of3lXF/wcd24mljiqISx3iuwy3mFzcra9vVSuH/hlJ7yKcweW4B108HB4VczEgBXkpivrGVoKZFrKaEhT2yTcjat4pI5/1TKpyCL8GW8TRA8LuuLn73bN2T/Vj0FYG8gcNtldXfv7TPHZlQ+Vb4wwI3xtuFx2HXTKn/58uV/MpdDvXC8/an9jEElvO66YDXnTJjrdnh2vdko5atJcA1KUiJh/dKFjLbRGs78/zclAdZyWCuYVqK5+OYPi+BWQ+W0Snh98yIE7d1idhm7Xb6ExoJ02r4wBzfrK8Bz63oG24olnZIAOF+0ZeFJfodA6G/9rnDr6iXQdarM6O74TGEGHN7kYrQ30W/X99CYLyFze3MVr4u2Y/lkuNqw1M5rBhzWmAuX/d8M6f9Xzlz2PVsV/N0KJ3h6rYlY5d5WnJvjPB8dPuYo4eGlBjhflgXV0kQoSAgDSZgXpIV4giT0CJSJouBiRQ6ZyllL6YbwpvsStJZngzjEE/Z/8zW4LLa9+5rHYcfoaX8Nl/1vtioQhaJ85JTQQXs2W/Sb6GU7mSMiY6stFaS0M0Z72wgx0cDsOV0FV48XweWqPNIDZQr8YMday2MNeBz2iIuj43/Vsf7Zgea6XI9s2wBbvl465XcKk8L1BEWfeUVaDOkZjC0LDSgcw5uKpDDRZ73uWDnHCGLpw6MiAStYmwAc1kVTn+piYQStCFRoa3kO7F2/iv7Ot8sXwWmFZEbDrEoSB2Gu28i8WotcXy8lwsoj/YmfHXsOphWgnEUk8P1htfkE4LKeqbv/RfP+1pnLVpryA+l8b4OVQyXhNCnGcx88bms0WTg0tHDK9q7v59W1K62Ju1fh/YVjAPU5ELiZZzYJNK3/HaZkjHDdDh+ay0DZ1WSwgpZMk4xF6IFtsPELJxq+OzfapfGv1hRqlYvAe3ZTflczQGMBUT5i9HQBFCVHmBWBpNn9VxmbCbued221dAWguWRKItgSODXTrNfhzS52KbftWL5em+A9m5fdfx3gUrW63etz4EN9Lvmr7L1EprZmEcCFzf4Pzhz2G2OVP9p9CaBRoVURgqZiUHaeIRX9SIAO67fB9QaV0hvyYOK0AkYbC2H8dAFAgwKUkzOhvRtWmU4A3uIFK43N0FlbSsYfaC6lFT9xOh/e1+epiXCl9iMBBqys/NuXAU7nwXhjAVE8BUKAi+r1CIyBMJ0AJnj/cFWNFNZ3FeBsEVH4uwYVGxETDfmgPK0ApR2maL+YIaD/OsC5ctLWqHCaAKcLSU+ANoElBDDJ+xd+aKe6Yl1NqvEHDRENZr5vyLNLL/CLIcB1VddPCNBYQPAeFY/jv0b3j/DatsE0Apjq/UO/OC5mUAVCUwk9Lo035qsJcOGozRUx3H4Whi6eojE8xSqguU+dsqNhyjm4ZrkIvGczWdtPadtaDQqA85WgvFYPyl51FNKLjvMmrzSa5f3DFTF6yfVmi9aU5ENDLoFmxeYergNcPgrQnAfKu7PE23i9QaXw7gug7Df8HUVciEl6pAhwydRMCPRHd9aVqZ+WW+cBLp8AOFMA0Hp07iu/KY9AecOKvYoN0dt41Dw/gKneP11XMHr7bpwsUzt+8O/dq4w3iMnoawNlZwPAhVJa+QSXpo8vYAoYgNpRVwKVklhi+OF6jDk6RAKANYBBl3Fe+6E8LRoaFGLit6c2SMxqdDYAXCzXVromcBi4c4XxeuKQSyl7/7fWWzK2GgEMId77wKz354MhpbcWAzQr1P+fLwFlH7MkkEX42URHNiUA4oRcODcIcK4AoP8SwNtBgHePAK7VaJPiSjWj9cRAkTlJgBQDu2VmE6D9OCi7z6ss6+FelfIRfS3aBGgzLvrXFhi6cMpm+rE5ATw2r2NcyUbjwU01AX66MWsIcDQ9fu4SAAMerRlIaVMMdgJMPFQRYOyBqmeg0MtcIIqux3NOEQDRdaqceeUaCXhzj+4FlENdjNcHvYy2DBK1CwFwM8ScIcCLu2oCDPcyXh9zvHuzjgAY68d0QxqNYQ1D8GU/o3XBaGdbbmq1GwE2Lv/Mtosl1sR9DUNwdIjRuuCeBFvrxi4EQGC0MOPKNRIw/lA9DNzrZKweGOP4syEA7oydMwQYGVQT4HE3I3XAzSD20IvdCLB51eI5Mx2EZ33qYeBZHyN1CNy9yW4EMHs10FRg1CrTyjUKj7vVBBgZtHv57dUFdtHHJAFY7+xVWMDu75lXrjG416kmwPhDUA7Yzw7AXVZ4vI3dCGDvs4D6W+wTMWwpYGxIwyF0027llqVG200XKgJw2CP2LDD2yN65QYCX/XZ3COGavykbZa1FgJf2LBDdmn1NMx+qxDie2NchhMEzlpxcYjYBnDmsx/YuNEIztHwurAyO2t4hpIgPtbvyJwnA7pkNx7jN6pXBd+gQumGzsq7XFjNyqDWPwzqH08BWJgiA+/6fd55jXtEDUwPeaDiEHnXbbLUPD5pkQgf4xne0AYqZKVxlENpjG7nZBHiusTJoA4fQk6tNZI8FE23P47Du75w379d4JnAEUwRA4AkjTCtaORV+6lHbAa+t6xAauXXR6FPKbAF8+adqaziH/S2TBNA9PGpW4f4NHYeQdX73eUcLeG5Zx1ib8zispy7L2P9ZdTSM0/zfMkkA6hwhPAWLcYUP6ANGH6iHgfuWO4Tw9C9T9/BbHZ+z9ugcDsnuYpoE65d+So5Bm3UEeDVgNYdQT+NR5l8gwWFfwzfA6h4P58k0AajhAA9nnFXn/g3fVg8DrwbM+g00dPEgylnxFrHFrM/1D4hcuuA3+EYJpiunefLnvdY65pU/0AHKIQ07YOIhKAdN38MX57WP8TYlyueyRYaOh508JIrtzXQFdQ9+lkf6kaNlmSYBjA6Z7A/AXgz3SO5y/mKWKJ/VvsnJ6U+nPSYev8R0RQ0ZiBl8b0ZXEUEjUhie983Y3V8+qmB0imcAD9Yv+/1/d5jpwi/hl2dBhQ0Cj6OtkSVZ9ySQARMDRKZYF8B1fDw/CV8ayXQ7aYHDfjLt+wF0LxcOa95ceGEEPmEYM4+xc2+7L9thXeCRxnSwi37a8bgcfEEkHlfPdJsYem2sScqnLt7nCxbbO07AEuC5OOhYwaNr8fRwPGV7wsrxhzCisWPoSS80F0ltHrNvkfI5rOtrOQv+p8nK1+wJeBzWENOCmIuDG9dYtxd4ekfLLVyXncK4jFNAyeOyU1aunPdnDpZeqxd/8l+YXCyyBLif3mbxARMPobuxinEZ9cHqMDjPt/TiceYvwy7lF02AAYwTVLuFRwev2+XNHsaAx2F38xazNzk5Of17Bxtev1rLZa/icdn1PA77wy+SAC/VcYI4NcTXxjGmdC7rrTOHVY7vAcS3vDvY81rvxPpfuJzozGGf5nHY47YUdP3SRbDj+63gutcDvD0CwG3fIXBZ8umM+fC9PzbdODo2NOV7gdct+RRcXQPAzSMC9m7bA999ZR2i8LisXh6XlYRKxwO+HWbD5eLk9B8nD5tOVL1tnPXcUkG/W7UU9m/fAb5+seB6JBEOeCaAd7AEElNLCcIFabB57VfTHk5lkxPK7mm4hSfPD9Ddvv3D6pVwxC+J1BkRGpVN6hyTkAuBAVFwaLcrbNkw/XGuaHxjT+vMYQldOKzda7nzOeiud5grFy4xuyxmL+dx2Id4HFY8j8POR3LwuKzbpOuaQnBUalhIHOQU1EGyuIw0HtWQmgRAJKQUg9vBgAmXZYue4atPKCT5HXxhy+Pp4O19jengbXIPSYBPfaBPCMSnFJG66hKAQryohNw/5JWkdD8S83L/9j2V3yx38sLwLJ7TJ7/fuHz+f3L4uV9orHzr6PhXLkvn/+81Tgt+53ooIMLDL3kkOFKujEsphsy848CPyQHf0HQ46J1E4BmYCiFRWVrw8E8BNx/hO59gyUH8XRjs2PChv+O9rZSvJGFifQa3jbU2NI5J5EdJvbCuVL1RBs06B0fJ6TQE3osVFkykZFT08AVyZ4df0pWQoPhrT//UQTffZED4hqVDdHIBSHOqISBCCkeC0sh9hEeAiKRr4jASYDK9sqiq60P/9Q8zK7ETxgdumI+H3TAx9lCF0Ycwfq+LTjvf2AyChFwIiZZDUKSUwC9cqldvqs6UzDGTMvuFZ4BPiOQnr+BUocPP/QqLkq/x50tfajZGfGohPH36FMqPnTWZAMECKVw53Tg2EwFeDnbD7fv37Yb6c20mEYCS2d0vZdwnKM3D4ed2AcCv4kVFHpHxee8E8Qpw9UokiIjLhpHXrwA+jMOb169AJK2AgHAZnY4Ng9/XhIe/iE4PisyE2ORCqD/RqHxzu30KInTCwL0BuxLg9v37IMk6Stc5Ii6PrjMC76WkV0BRxWkoO3oG/PlSOs07WKyMSSmSRGdn/7nDz+GKzyz/S2FaaU1yWhlQOOSdRJT/6uULonwKwz8NQ6ywkKQj/ELT6TwUfILT6HRBQh6IMiogr+gkZOfUwK3z5+BNTzuN0dvX4HnfTbhzfxDu9t0yiP4p7k/7vTu3oLeni0ZPdxfcutUJt26q0H3rBpxruUDXOTGtlK4zAu+lZx2D+/cfELk7bvSAX6iEpAXyM1T5Uktvp0irnBzm8hWdUPC7jOzqn1BBmkiTVUJReT0o349pEQDx9MlTkCuOk+9kZFdr5UNkZB0jaYis/BNaaTiToNIkmVX0/TJFOQDf0a54F8Gly88tVMlMAe+da72uJffbN6+hrr6VDAsa+ZSZecfPZGRU/J3DXLsCoyT/6h+WMRaXUgTizKNaCAqXEXTe6NEjAOLxo8cQnYjdZ55e3vCYHDo/PllICEKM7GoQpVfQaSGRmXSeYonM7gQAviNIZeWk/DRZFV0vRE5BLYyPjhiU/XjdeT2ZQyOzxn1D0sUOc+Xy54s5bt7J71w9EyA4MhMSRCVawPuI8JgseP9u1GBDPBkehoTUIr28RwJS1fljc0AoLiNPWKq0EqITC+g0d+8kOk9pYjwzBBCqZMdpLlUvxJ2+QYMyvxl5BeEx2Xoye/ilkHye/qJHfiGyf3CYzVdcXM7feviLxiiLFw256Szi6rpmg42BwKckr6h2ylmAV4gYQiLlpNsMj88Fn1AJnebuJ6TzFIT5MkIAIT9SS+aMrEoYHLw/pbxlVQ3gaXDmI6Tl8g4Wj4XFZv/gMBsvgUDwFwHhsnsohLEE8AtLh57bd6dsFOWHcWg61w6BApnZBKjiuzNCgEx+ECk/u+D4tIpHdPf2kTrPSACUOVquTJGUNunF+jN5FRUV/VGiuOQuVtgUAuD/iWklxPibroEeP/4JRNIyswhQH7ZPX0ERjgCpjgByRwCpI0C09QnQlBFNW/rT4eWL5xAkkJJ6G0OA0OgsIrMgPu92YmLi7HAjZ+Ydl2fl1xHfN07fKL94cKRcyy+OoNIQ6CcXy45CSWUjmQZO11Af3o1BU8sV8ApMJXnD43IhRVKumllIqyAmqZD+XTfvJLq8q7E6BAh3BChdBHBiEUDd5wCXXABOcgGSF1mVAO/P5c6o/PHRNyDOrKTrjW2n215oA1DplA8BZU7NqIAYYeFZgUDyW0aVnygqZUtzjr+3hAAoEM6NHz58NGOjjbx+CaUV9SBIUBhFgO6YbdrKkTpOKt8JoG0DwLXvVX+rP1P1DFYiwIvKuBmUPwJF5adJG5lLgKjEAnD3Fb4NDM/6R0aULxLl/VWCqLRPlnMcLCUArgaigJevdM5IAqrrbGpph8KyhmkJMBj1jVoxcY4ANZNPftt6lfKvbgSoX6Iihch6BHgo956y7i+eP4djJ1ogMa3MYgLg/cO+KW9CQ2Uz7wOw9uUfJr2GlbQWAajlYHzCp5oi6mJsdATartwEXJkzRIBhwWp11182+fSf5ABc+QagfSPAqUnlI+TWGwbuJe/UN2rfj8ONrtsgz1M5sQRxCtjjFkNgCQEQHgGpT2Jji+wXNOITki487JdCKoUOC2nOcfLZO1hM+7bRz63rz8f7+z3iJ9cD8ojis/JriTCaawHJkhLiFDKGBKrGHSPWdHZ+DbETqPJeh/9BpZSMSeWfXaFCy1fqJ59CrvV6gEHBehgfe0PXb2DgHiSmFdFKRJn3HY6DTbtCYetuPrUWoNde2MZUm+BSMjrXMG98SjGERmfTae6+QoiIyz2HBrnNlR+YrPg7N99kJVqoxJIXlxKPlzGzgB8PRhGhd7qq5smRiYopl4P9w6Vw/GSLVkMag4mxN3DjZi8UY0/Cd1IppXxSydjtU6j9TJsA2dbrAR7zV8LN7jvQdfM2pMnKDK4G/ngomrTF5t1hJs8C+DHZ4B2iP/MJEshLbE4Az4DUfizUHAJs2xtOhMa/MxGAyhOdrIBrHbcMrh9Mi7fP1EqpmoIAOBycXwPQvEplIFqJACP8JeDPz5h2OXiPewxpC4S1COAbmq4MjsoiATM2uQL52atdvZPJ6hVG6ITFZEOqtALSs6vJZ+8g9YodVgjvaWLrHj4RePu+CNKFJYiKQa44gd0X+IVl0HmPBKbp5Y1NVsDVazfJWGoUAZ7cVStFMTkEnF+txrmvAa59pyaEYpnVCKDkLwJ+TBaRUXM1EOVIEpcSmQ96JdIEwDRsO12ZsY2pvIERMohKyid5kURBAjmdhgSg8vBjc0eihSXm7xKa7uLH5l6kDQ+/FDDVCNzyY5iKAHsjpjQCDcUEInAtANNikhRwq/vOzD3CYLtaKbGTMwDNLv8UV2UMXuQB1C1RGYp860EsyqVjAimgHOly1SIW9ngUAfYfjrfICEQbQCuGMrWkxurKl+XU7JHl1EByWimBKL0csvNryYIMAj+LZZV0Os7t8Z4mcLwjXZ53MmQpaiGnQLX8mV1QBxlZ1XTeNGmlXl4UmkrHbrCk8gxc7+yBsbeGV9eg54y2UhI1hgIKxA7gAJwMABhoAnjSaRzunAYo9QQI/2xKAlRkKYiMVJ0RKEdOoUrmsKgsmgAxifmk7XRlxjam8mLbYztRy9+ZucfptJT0Mr28EnlVpFUje9KzqvvR4o9KVBDECQvJ05+dXwe5BSfJ56S0Ujo9Jb2c3KOQnlWjHvO8k0GaUwNZCtWUCIXBAA8qb0JqiVZeBEbgUuloc2TmTsYEFJ6Es83tcO/ekBYB3p4v1ldMhCNAmiNAziIAxSKAik0Aj9oA3g2bh/4mANE6gwSozpAQGak6I1S9ZS2pNz86m24PXMLGttOVGduYyottnzk5hZTnoYKP0WkYHaWbNymtbDwwSv4vViFAgqhsJXYt2A2ZOwTEJBfSAu88EGn2EDCdKzggPAOOHT8Lz58+g4cVSVM+ndcCF0JL2ubJ00CGIa8uDV697NNSbvutBuNI8PouQNZOvTKOJUVNOwQECTLp9tjjFmvVIQARECYFr8C0LqsQIEgg6wsUZIIfPwMO+SQT4OIM3hOml4NYfpR8RuONSkcrFe9RwJBpSuDdh2LIvRjsRXJryBzXOySdzusRmKqVF3HYX0Sno4HJj80hedEw8g+X0WluvkLy/fORBhaC+Cqk87+EQ+iseTcMA0PtwHX7FB49vkErtae/FVb5LIMPE4/1FD5BjpLTIQG+gFLyrVYZlRHepB5UvRD4f7yomNRb0wbY6xFH2k5f5hQ6L7Y9LnxhXgyY8eNL6TR3P5UuNIG/j2k+IeLtFik/OC7ra2paglMRauph6jQQp3a0wO6xRk8DzY0HuMzfYlD5D6OXQe7ReFi47/dQ06IA16Qd8GPsJqi/WAb9Q1eIQiPzAiChKIz0CpoYezsE8YWh0HCpXIsAe+I2w3DfWYBILl1OXdj+aaeBHoEa7XE41jrTQA3gfgWVnkQjFhEgUJB51hoEOOwnpAVGL5itCXCTr7EOoIHiHA9g7/k3gyhtzIS3I4OkRzCUnlsrgoyj8cDzX6HVE3AOfar6vzGZLqeZv3NaAhwJStUYAmJsRgBVe0mCzVJ+Zmbmn0YnF7yMTioERFhMDtm/h8DxCe+hMYLGCX72CZHQ6QERMnKPAs7zNXsAHMNwTEOLNlZYBEERcjqvV5BYKy/CE0PCJtNDorNIyBTZViYph4g4BZ3m5pNMvj8kcNEnQMJKePKkC272nSPwSXeF1PIo+v8XL+5A+Zks2CL4BrKPCwlWei8hvQF+xqFh9M19WBf0FTx4hO8aGiZ5VhzhTtoD/QBRi0lZnVHbiYxUvRBYr1RpFak3usKp9th1MIq0na7MJCRsMi+2PRrHmBcNRn5sHp3m7qvShVZ7h2bQ6X5h6bfNIkCCqMxF07CwxAhEo0RNgDibGIGai0HPI1bqE+BkDFFU+Rk5UegP4S7gL3Unn692N5K0M22V0Npxgn661/h9AY+Hu7S6/Nev7sLgg6skX2IxH770WkwTZqLMm5TVH/X9tEZgbEqxllFsCyOQSg8Kz1QmiEp/ZwYBShXWIoBPcLrWEGBrAoyFq55ELfScJApcethJr3vPPymmFYwKx94BsegACzzT9pHPbbfqSQ9x4nwhHGtR6P0G2hUf2vJJWY8EztMSICG1DDb/qGqPHQcENiVAcEQmJKSWZpuk/MCioj9OTC15bi0C4Cod7fnyiLcpAZJT0QdgYHHn2S2tJ/m7MB703busZ9Vf6zkDTq5s8vSjUnHMR+SeENHKfv0KD5AYhogcX/jK5w/wfhw3kQ4D3DtPynoZsWJaAmA8wJZJx9iO/XYggKh0wiQCRMcVfYkOBk3gLl7XIwkEHn5Ccg/j89EGwM++xAZQpaPvWjOvu4/aCMT06KQCEs+PYxo6eYIFmXRetAF0yz4SIKLTw6KzIHFyPEQiRMbn0WlIgLQkw/sBhh600082gnNwIbin/Ej/f+VmPT0M+EhcydQQFa/u+vvh3sNrpFdQTvxEDD8c/5e4fwZnrlSqvvfkBilrIpxDZKTqhUA5kLBY7zhhEWzdE067xrHtdGXGNqbyYtsnpU3aPWmlqm1nk2lIAN28/qHpal3wpeSeSQQIisws1bUsLZkF7HbTXv2y5SwgKSzaIAE6btTRTzMCn+S1fur/z7RVwMXOWkguCQc34S7S3bsEriL3EM+e9WoZfTgM7EvYCuKKGDg46VeAx+o1iKCwtGk3h1Kro7g4ZstZAM448J5JBAgIl/VbkwA/HlStf2/ZzbcZAWIEqVArk8JpcbxBP/1gZw1RKgK9f9jNU/8jaluLppwiIi501hLH0bcha+Hps15Y7smB5qvVpKdw3D8fhh53APSepMuLCkuYlgCoeBIUsjd8dhFALL7864Bw2QR245rAH9HyBEbIQCgpU3kCI2RwJDBVwxMo1sq7y1UVDLJlD5+kYwQQNobKEygnAlF5sfK6ZePuYCrdJzSdNALmlYkV0JAjh6Fj2TBan0tjrDoF3ku2avsAstymVXBH71n6aUeklEUSRxH1Pw4BLddqYHvURnI/QOZODw/uKbtBVBYJUK/ejZQaHqPtCYyQkeEO6407nDEwhhBgD5+0na7Mmp5AbPvwOJX3UxCfq+WVJZ5AnbyUJ5DoIlilC6MJEC8uZukaFZYagVQEDAo7XUygKUZgU+VReHNKrXRDUMZ/RSvkddq3cP/RdaJEfPp5/l+CX8YhuP+og+DDuLbrt+CUhAwHmve67jQTGwAJgNNB6v65azVQ11oAIFxLl1eWFDutEYgOICoqyNZGIN4zmgDp8up43HSpC9yHh8EbiOjEfHKPWuLEz/GiIjodAx8081I9AAqN6elZ1XSAJC51Yk9C5UUDSbds7C2o9JSMCmgpL4O3Uym+IQ/Gz1XARPspeF8cRCvkXZgjHC0MIF13fGEIme8v3Pt7iC0IhufPb+vNBtIqosncXve+Z+o++HTfJ7AxdC14iQ+Ab/pBEOT6weUydVmIhtQous4IlAOXiFFmaXYNuPskqwjwYyhpO12ZsY2pvNj2uGpKVk/zTpBhl0rDFUHdvImiYrUucDNtdrXxBJArjrfjWr0usGBc5kXgdme8R8UD4GdkN5WOS6GaeXfsExBhDx5JJOlkbXtybRwJhIGlVF4cUgJnN54AAALDSURBVHTLFsuq6PQrVaVTK/xWKyg13kLy4U4bgNCZKMTL/RNYuGcexGd50As9xQ0ZRJlfUN48DQhy/aGqKUfv/sjrAeISxl4AexE0IJe7L4JTQZMxiJO4KA6l64yg2kslcx34BItpw1iSqS8ztjGVF9ueip/A5Xe5opZOQ3Lo5sUHjNZFdjW5ZzQBMN7f2kMAFQyyfZ/A7CHAwzsRLuXJtJQ/3loFH263TX9WUE8rQMo6qPNjw93ghQDxKwAGW2iFolev4my2nqJl1Ym0h3BKjD4CuNMMyrYqUPZeACjyoglwIdZ92iEAI3opAvgEiWfHEBAoyv5NWHS2Ujc+DYGGBBWHZkpMIPruab+3axRJNzUmUBCRBncrs9SKbyqF97fOG3/qV3cLQJE3QOzyyeCQzwEahZNHwZkRDDIyRM4ONFhWcw5A7Aq4LNg5ZUwgPy4HDhxJoNsFlW2NmEAK2LvQugiVkHtGESAkSv6d7pTC0mmgV4h67RuNQVOngTKhFJ7V5qis+8YCeNfRCMp+M49/678OygslajIkrAQ4K1I5cDC4wxg8uKY1zBjudc7DPQV/2mngfs94rSipWTENDI7MFFmbALpLn8YSALeQH5fLJ429PJhoqwXlXSu+ZazvCkBFyLSxfXrI3EXyGVvGjaZGCA4XGySA5hCAUcKzggCRCfmF6GY0BBzXsaII7LLwHiofDT78jPNNKh3nqVQ+nPNrRgNhenisyjolO4MS8iGAL6Xz4hCA7t3LxSaM85bgciVA8lqrK5/Cm952KMxGqzwPhJJyIjNucMWdP3RouE+SXntjG1Ntgm2PB2mRnUHCIhJFRaUhAXTz+gZL1LoITSf3jCJAgqi02ZABaIkRqBkBiwSYyQgMDJVAT1U+jDWVwPuuFtspfsCE3sBM5Wui71IrKPJVUzk0AvGBUQ8B6j2NtjIC/z+w6XLcg5TfYQAAAABJRU5ErkJggg==",
	openai_compatible: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAACXBIWXMAAAsTAAALEwEAmpwYAAAExUlEQVR4nO2dzWoUQRSFZ6ExWSn+PIIm+hLRnTtD7JvoKrts8wiN1cxMQtUQsgzoW+QRhIjRl9C9EXQrSjUqg5hMdae66t5b54OGgRG5P5WarlOnukcjAAAAAAAAAAAAAAAAAAAAAAAomvW6vrbpxmv+8p9zxwMSsVPXy2TNtHLmC7nmp7/az9ZM/XdohGJoNlupXPP2T+P/vdrvZrOV3HGCgSBrphc1/+9lzRQNUMju8fF1ss354gHQnPt/mzteEJmt2asnC5v/+9p2kwdogDLINZPQAbB5YO7njhdEhqw5CxoAtvlGdb2EBihiYzK5U7nmR9gMYE5yxwsiU1nzInT6J2f20ABlVLZ5E3wDeGge5o4XRKay5lPgAPiM4iuD7PhRh+n/de54QWTImb3wAdBsowHKIGdOQprfrhKOxvdyxwsiQnW91K7rg9b/5gzFV7bf/tw2jztM/xNp+bGE0347dZB//WCRlh87nh3WtyprTrnst1Nk+Xehn8CaU1+DUbHNd817LvvtL119N7b8G+In8DUobhDQ/v5Ncs27wGJ/TbHfXkWWf33M89P+5YPAfKRZfXtUAt2an26/vYos/9KBWe2SYxGDoE/zU+23V5HlXz9ou+apehD0bX4KyxUNIP/6pV7oT4D6QRB8w5fpJpAGkn+DTKXabwyv0vx2iZhgGUgd5F+/Wgj+f/0y8JJlrvpB0HvaTzgV0sDyr4QaDIKUxLc6uH8ra8aaaxENSQnTAPKv9JpcCWmJkms+BMb2/enR0Y2SaqM+wY0M7l9pNVKdWJXJ/SuxVioTqjK6f6XWTFUiVWb3r+TaiU+Ai/uXpNZQbOAM3b8krZbiAhbg/iUpNRUTqED3L3GvLfsAGcm/6mrMNjDG8q+aWrMLSJD8K77mbAIp8OEPlLv22QMYAGkPf6BcPdDYfKkPf6DUvdDafA7yb1+S9URz87nIv30ZvDfaTYyc5F+WJlvtNuah3L8qbPZdzrJJmva5y7/pfw4uOGvZ9SybpL/8oR/+IG4mODCrxZ1l4y7/Zj9rqf0smwT5N/tZS603gUM8/EHlWUuty0C/pJMk/2Y9a6lRCJIo//4PqIGFyb/zYD+gUPnXgx3BguVfyv2TnD0AZe5fkbVnE0hB8i9xqzm7gIS7f0XWmm1giuRf4l5j9gEKln9JSm0lBCrJ/SulpqICluT+Jea1FBm4FPmXGNdQdAIS5F9iWjvxiUiQf4lZzVQlxF3+JUa1UpkYZ/mXmNRIbYKc5V/S3nwOiXKVf6mU5udOmKP8S6U1P2fi3ORfKrX5OV4Ywc39S0pNtmxfGcPN/UtKbfY8zrIxl393lZ+1TDoIQt8byEn+pV5nLRU3/yqDIOS9gdzk3+2OZy2LaH6vQRD43kBu8u96h7OWRTV/qJdHc3z4A+Hl0WleH89V/iW8Pn4xO3W97P9S5qfL9rM1U/+d9Ic/7ETIrwj8b+amG6/5y3+WLv/GzA8Ik39BQqS5f0HB7l8wAJzkX5ABTvIvSAw3+Rckhpv8CxLD2f0LBoar/AsS0WW/ndPDH0CG/XYuD38AEfEeAe8ViOUnAAIJMl12MJUCYSzcbw/0EwDBYL8dtGC/HQAAAAAAAAAAAAAAAAAAAAAARnP8AtTdz0dACw5OAAAAAElFTkSuQmCC",
	moonshot: "data:image/png;base64,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",
	openrouter: "data:image/png;base64,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",
	novita: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAEQ0lEQVR4AezbgW3UQBAF0BWVUAp0ApUgKoFOoBRKYebkUSwr9m3O9u6f+T+ys3cJut35/+mkRORT0wd1AgJAXX9rAiAA5AmQj693AAEgT4B8fL0DCAB5AqTjx9h6B4gkSFcBIC0+xhaASIJ0FQDS4mNsAYgkSFcBIC0+xhaASIJ0FQCy4rfjCsA2EbLnAkBW+HZcAdgmQvZcAMgK344rANtEyJ4LAFnh23EFYJsI2XMBICl8b0wB2EuG5OsCQFL03pgCsJcMydcrAfhsnflti67eBKoB+GWDC4GF0HtVAuAzf7FPQmAh9F7VAPjcQuApdN4VAfjoQuAptNaeLVUB+NxC4Ck8uSsD8NGFwFM4uKsD8NGFwFPYuRkA+OhC4Cm8c7MA8NGFwFPY3EwAfHQh8BRWNxsAH10IPIXlZgTgo5dH4EP23KwAPBshsBSYAdj4jR4BO4BmH9QIBMAE2EWLQACs/eWiRCAAS/vLQodAAJbmVwsVAgFYNb96mBbBaoauhwKwHxMFAgHYB+DfKY9AALzm47s0AgE4Lj++WxaBAETFz9eSCATgefHrf1EOQSUAP9ZN3fi4FIIqAP5Y4V6MLUMu3wvqL5BenboCgNHlR9YlEGQHMKv8MggyA5hdfgkEWQGglJ8eQUYAaOWnRpANAGr5aRFkAoBefkoEWQBkKX84gtjw1TUDgGzlRxcpfk+ADiBr+WkQIAPIXn4KBKgAqpQPjwARQLXyoRGgAahaPiwCJABny/9nKfttC/QF9dMBCoCz5XvjXv5Xe+CrLdDXaQRXTYcA4IryIw8vXwgijY51NoAry49xhSCS6FhnArij/BhZCCKJJ+ssAHeWHyMLQSRxsM4AMKL8GFkIIomddTSAkeXHyEIQSbyzjgQwo/wYWQgiic06CsDM8mPkEghimKvWEQAQyo+8hCCSWNa7ASCVv4zchKC9fdwJALH8mFwIliTuAoBc/jJ6E4LW2h0AMpRvoz8uegRXA8hU/kOAfaJGcCWAjOVb/4+LFsFVADKX/xBgn6AR2PnW12X/n+AKABXKj3DpEJwFUKl8SgRnAFQsnw7BqwAql0+F4BUADOXTIPgoAKbyKRB8BABj+eUR9AJgLn8qgtj8g2v37wl6AHyzzf3n49+2It9/7Xx3X56D/90Bcg5xNj+rQzjMpAeAv+B3exX0+6edccTlwaJnEefz7g4z6QFw+AL6Zu4EBCB3f6dPLwCnI8z9AgKQu7/TpxeA0xHmfgEBAO1v1LEEYFTSoPsIAGgxo44lAKOSBt1HAECLGXUsARiVNOg+AgBazKhjCcCopEH3EQCwYkYfRwBGJw62nwCAFTL6OAIwOnGw/QQArJDRxxGA0YmD7ScAYIWMPo4AjE4cbD8BAClk1jEEYFbyIPsKAEgRs44hALOSB9lXAECKmHUMAZiVPMi+AgBSxKxjCMCs5EH2FYDJRcze/j8AAAD//6CloEcAAAAGSURBVAMAFKj7AT49r54AAAAASUVORK5CYII=",
	venice: "data:image/png;base64,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",
	vercel_gateway: "data:image/png;base64,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",
	new_api: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAQAElEQVR4AexdbYxsSVl+njrdM9P3A/dKiPKLnh8mQKJRDInLqtutGNkokYVoIATujAaz/iAucEkWjZkefwh6F7ghGG4QmF4ThWSBXfkIGsHuTXQB/UGCP8VMJ8bww+jssntvz+7tPuXz1jnd0/N1+3T3Od09e2/deuutt6pOVZ2q96vqzMx1uBvu6BW4ywB39PYDdxngLgPc4Stwh7/+XQ1wlwHu8BW4w1//rga4ywB3+Arcoa8/eO2XrAa457m92j3P720Idu65sbcj3Lr0/F5L+d1LN/Z2jb6nu1cdLMSdil8SDKDN3PhxbfKlm3st21yBp0OLxI5gg8CGcA1EjR4d77D5zIVL9Wcqlzq4w8OZZACT3OGm39jz2twdr02GRw3AiVKt+qaPUd9LNr6NuyGswJligJdLpZuUM8bucNPDa9wmIdqS+Poz5y9tPnPx0t2NP7JUS88AwZabepekx1LpPpHy4WuIHuYtI0k3FED5xt65S6bqJ9747ru+tPHC5S/tdN/9pd39BLywH9Ddd325tS8QvdXdeLzW3XjiRM0TJrLEydIygNR8LUi72XJT7+kiyp6nuQRJEySZNA31B1K/nRZnQtrE2v5lbezlL8usUGaFGwSroAAENBhTWtmaLtJrohv0UYux392//ESr+64nNtRPFWckLB0DmMSbty4138IRac+yptNKfffdT2zJQdSYrMFTQ41AZho1McaO5p4ww8YT5pNgmcPSMIAkvmqevHnvkLc+xaKZd2+2fiKpt3Fe3Hhig2SDGhhUKggYBJQnU4wUZ6HBmvNs7V9+siWNsDSMgCNhKRjApN6kRtK7ccymq3B0zqfUd/bOX1rXsa492jZLXptTjT13rG0YSomikQhYieIstI6ey8sIC2eAoO5l58MKKzHhEhrGsTTQts0fPjBhxsXuMkyyBRRAAwYMpcrDAAQEFEB0wFCqPAxAQEABRAcMpcrDAASCRnDSCF8xjbA0PsLCGMCk3i5stDbTq0evzde5HjMEmfcNaBJQ8EexKlWsaBsIaYQjeKp6L40Q7XY3vrIUzuJCGEC2fivYei3ttFFb0bRLnWmfHz5HVyUJakIkgRQXTTtwhyjtmAnCAoOb99i6wWt5oIE0HLPpafkAnVgvyf+/85c2B21mwpqMImwcwxJzi3OhNW/TBjIJX60pv5A4NwYwLz+c6494+JTQjb75ERIn1HdykfzBoGSH0D8NpBRIMWkU50C7qgNbL2x8XRdK35i7b+Awh2D23rx8idasnB6OenlOWVvc9qCmdtjGew3iVS6kunnU+4ZDfLm7MV8mKJwBTPJlVlu2kLOC7vQ3ddTL9QsewadIpZokuViMcBfh5RfkzwSnrX2hDGCbjz52Rwc3WzsNreds8yc+54+OdVJ+pfkbTfXdESR230sTLBA0x5r0zdyYoDAGsM03tS+h0jsdxGloAk19v28e9JJvjmCTpARwaaCm6cg5LF4TFMIAg83PaZs6uXn8p0xotfnAtoRepkWyF9osHmsadjwtnAkKYQB65GLztQimlie+27fnJgV615QKAPWJDxK/ZcAkjQkKNQcOOQed83fgMTzOmG3FSJCkjVCJvR0tOFSv836Rqn903NXmr28jRiOMr0QReg+LC8UAaw52XY1CQq4MINVvtktXqwdzJQ/yljtCmrBZ8RBG632EfC57hr3fPmNMQLADTZoklgY7Nl743X/cQgEhNwbQ5lfl9OWn+oFG3ke+LOsX+35d7ToCxQNfQISimEIpcICDphihEUIR9b5RxB1Bbgwgu78T3j2n5Jnzl+Zi+49Ot9J8oBPHZTGB60BagKlPgFPwPOudK8spbA3NKzKEcU3cuAZZ6u+5sbclY1mDwjGbn4iIapKYpV6PDL8VJE/NN60062KCqK536mguELZ4CIcZqVLxUPmALqQeqDrX15VxfkwwMwOEa15guGESGoyGaehFSf/ovI0JVj/3xnXqjiBoAnsRAUkYPQAyocnDuKh69bvhXHwZOYWZGCDY/ZEf5shpTp2c+smlm9XP/eqmxL8hUH/aZC+EBWNdGXc38tECMzGAi5EbJ9qyGshELMT229ingZhAc3LScuxA3wxgDCDMFC+CjiLofmB2JnCYMpj0SxgaXsloF0dIu8gZrcaY+s68zv2HJpWBWP1cfVuO7rbetzNofuxdBhUpLrJefdecw8wCODUD6NIkDE6mb5uiIyQmqdezzbSbpUQrn6s3IwfdTbADvRhJzVOQYlJ5CAwLSOUHtDA5QitPjtBT1IPcmNUUTMUAJv2aulSi3j/HGMd4KsfuCumq/Jl6O+77OuyXTKFVGBnFD2mVezscCBdYD1KngtluCadigCJsP4DOWfndPTshxGUxAZloAmgZR3wCgsCQpqgC6x0a3YeO+wLIGDSzjC1Hmom5h9IvmzhSI65X5WhB1nq164w+t+z5yvV6J450axg0QTLbwasfxoPbRK1N0kzKI8kk7Wavd71SMMdJr5OlEzNAuPQZGYMcIZSdmiZy/2EPFByMCVY/e/866MS8BEmNyOMYPLl80H7m+um1gNPMJop6laH0T/TgmMbLcPkzZoqnVseRbg1lDrzX6qiVT0RbJ6CUVplFX2D9tFpgIgawn+e3F8kdCEkQzmyoXL9X5iCqU0wgAM3+ByAO6EHesFO5geUNRvMDerRsNH9qvXyBb0/8ncBNsur62lcToAiYZB7L2NaYQPPa9vqc7JXxShSDFjgZJz6Bl1bIqz7qxzUNPVHMzAA/ubdXdTFrUQxEMQU54j7OnP3HCWHlr+5rysNrEvpHwZwx4O4/YVq3LcrMAOqlGvU9XB/IHfdwpk0ARsLqZ+7b9jIFJtUQAxgewICGgpUh93psdB+azAxkZgDXw/2J5FPSny+UzsAFECYIsYP8AdeBaYEATllCiaJho92QZuovILSdrd5N+H1Gs0CmIMlvCOB6HjRNIJwXXVqQBrBP2ZlefsJG5g/42Idrbe91zvey94bVT6ADVqIY6Bzr6TGRH5CJAao/3Ksm0o9E+vtMcJwP3XnlpQ4WEBhhqygmWP3MvfqCyA5JCXYKOIwxoAdtBnSKp6kHXW0SM5CJAaT+Lwdpl/03HKXY8gaz0lhUMGlxmNhxyjpdOrcp4Q7N54mjfpRZC2RjAM/E+w+SjwPpz4nGAsI9z++Fn17myF8gy3sa5euv1+nGNSSVIDXS0Na7YukJmNpleemoh5oLUu9RAF6I+td7B8n3HlX7uim6kLj66ddve/iOlw8AqYG5YPtTdhnfZiwDvHp3YP+ZSn7eGAsJEsigJoVt/Ilv0OyhrEC4NklI7BXngEH5Ad/L9E4O48I+gtSfdvZ3diKQdpi+ftwE8q9PJX64QJMenSadEekfm/SZWduX0Bu+3+36GssAZUSJ/T/l9q90Svng1JCl/nYTLKJOTmuQ/kHfnjhEI+cQfAG6NuQDAFR0QM74aH8y1vkwQNTzrzK7zx6CJsgf+7n7ADEw/H7uPXRIlx/w3F6hTKBBHoONpeESTBUZIQjlOdMewcdR77eNxoq3bVDSakliZP8hoEDYVL6VD6R/JpqZOBV5hhGJJ/Ps+PS+Vq7/fBO6IoZpAWrQIWgLhnkrz4t2mdbVnT7lpIZ91mQjdf8PaQCf4BgJlv035pixPtNEkVMYHP+OdUdsHSvLuYBAE3MKUiqZ1nUsA0RhsynJF4Rzf/74F763l2myyCGs3cL9qy8QAV5Msei1F1nVF89CmaB8/eeS20E4vQmlEFJcAK3eM62pzUCTOT3Ky6+aDyAsDQCBFxzg8F1AJmCWeuikcfoM8qmp/tderfrfe1trN7ix1gUC3BS+6ZN8F9W1m2yoza5gy66/8xn5WC9tnxYF/0P5oujuQ+OPgmMZoBRT3wGQaID4OFa96o6XR6l/kKW+rJMGcg52f/Ha/3x26zU/eKb1mh886ysvuNa5rmtU9olKN4FzhvfdYbrrqhVrd4Ot1/7g2Z1X/8dezs6hC3+VDPIFSAIFYmQIYxkgkX6kUl8MFrO8KsNcxzb5WZmS1/37s1uv+/6zu+eec7trN9Go3GStIomvmLSnOBvN6loXG2KalvUn2Hnd938Uro/HTuQ2DVau/0xTEt+BEkUUiW8zjWHVWAaITpD6KJXu3HAfU0vZL/7bc7X7/vVHOwJ//la0W+nSpLw6lPSBxM+C92n9bVT2sXPfd3+0q7Fab/jus1uYOjjZf4Ky/eRsmDz9eWAN44Ib2yCc/32qAYSLoWtvau1lclqOzrf0fK+z2mVH0t4WoHDoemi89rmbbvrfYvIIfoDXyxQJ6n5sHMsAiZRTxz5BkPwUD04Eg7IZaUwZ2vVLnX+6/+L2t2ovq1/sltfPdbFZ2WdbmgDnUqmfHbuO+mtY/9+q/di6jffN+sX2lFMGHJ8iHEgCKWaK86SRIbhxbeTldxI/QNJ/G2//tFNA5vIXp//tlsE7PPlApfPVB17W/NqbLtYv7JfW17rcrNxkc+0mtYFSiPIDKvID1sbi0L692kXjaw9c5FffdGFdePtJ9T8YaxbMOA5/ecSk3/qx04DlDfKkra9xMJYBSrGT9EOePo/j+JRyMUqiOSapx9R+AE4IX3iw0nn8wQvNx992YfPxt15YP/9Cab1i3n3w/Jl4/qmGqFiZwb7rnL+BurV//K0X61988OL2CV3PXFS+/tPh6yBTqScJUpAzXbn+mg7GhLEM4Ppxav9xHPdOKNPmJxpDdZPV197yjen8gDHvGKqb76h0/vqd57fXdNZfkwZYkyaopNjyBue6frv5rhlUexgpW+I9h1rAg3YYGIF86CwzGc8AMTuHpHkg9QVgd6u8hYLDuefdY+ck7QaVrguawPIG13/vwtyuaumY/LzgQOpzxoAbK/221M6S24HrUz6AT6W/cLzx9ie6U50GkDFce1+ls9ZlW4C1LpBoAVp+bps/nKpHkHpLlA1EXlgWJR8GKMd4KtEATPyAgddfEI7j3vBTLQoKsvnhlCCMSnoTONOxbop5erADOpCEEkXD2Wny9u1D/xgf3NgmsU81gE+0QM/wAAD7PQGnr4IJzE5HPW68/fPdQrXAShdPmR8QpF/fAgyX9zH9sQ5TBM/wkPeGZPMDlhIIeHaaHh1kCGMZ4Au/fbEdNEA45+NACxRGo1pGP9cTwdF1WNtHJ9wN6BSgq17dF6D5oY9UMi3Y0b6mpmlPUpLvlMkfQz6FOh4bbfTxjfqQFgBcf25QqBl43zX5ATfRNi1gfsDazUzLMHadJmnACX5yd5J+h20dMt1UZnrzUp/SAkilX/iQ9OdPu5i1jZ1izcCajnxBC+hEcP5WXMh5H7cLwYYTKAojW8jEAOj7p4L0B/sPaQLzAYQLpCP0d7K9wnStLjyPzkADvKM5Z/VvU05tvZ0AAMr4QyEf7HXHUP7kT2XyaTIxwErPp3cBTLXAXHDt9z97YwsFhQefrHTSbwbzP/7ZO+kEANv4AjDt4RkHAgAAChhJREFUZw+RLWRigOvvudiWBkj9AC8NAMFccOOhTxVnCio3qK96yGQrsy1n9lbeo8CTDjNJPxQyMYDaSfJx2A+IaWWCYnGefxkbR8LafumxentlIRqAjlVJKkAqMjNWY8Xbty9/cj2zT5OZAXgrfkxaQJKPwzDZff/hZ+1UMeb56BYa7/3L52f+SRycEO79Dud79Evn0H14t2q233siwaqQT5AHrW4meqfMDPDJ915sR7oWjrRpUYyDL4OWNwjlTMtzru+7rYc/XpwpwJxDqYcq6IaSbHkRioQSgQtAjtJUFVVucHo97X8/Q/agniZo7H3zsBbwRyS6IDr2VYf4cvaZLnvL5I85SVo1UW2oUkC3f7AwoINyUMGAzlofT+TTTMQAK7F7LIqZ2v2548aVj3a38FIIzmm7CZJ6G56IVXpiOaAaPacUJAEQJAEQlPcv+5/ZAYSCE2SOH9GXNN35d1yw2x7zxlHfNx652i30mjjzYszS0KNm0h9svvrxRgRMpYDRVuTNR1CJNyLgMfUxJ3ZoJ2IAzUE23m1HMVItMH8sBmw98uFu1eZyVkGSWuOID2B5HKGtjCQgoOogIA9oKyMPaKi+VCpN/GvoEzPAn32o0pQj2DFfQBiGBzAvuhz7VuOMMoF/+IdVE+gBaIdheSgkOLH1ljcAEhoKo7TlDTCs9w1ee+VEJwAoTMwAegYlqZqTtIDu8KUZIKDgOM6rXv1U/S20Go2zpwl6cXyZpLZNMMAJBVJlEBzFIFQKMqTHMYiSm1z6oTAVA2z9SWVbUt9h36ca4GRcaL1OBpKNs8cEnjWz6V6LP8SWN1Ch4ogPIH/AygegSsXj9Z7taaRf3Wb8aGwtj0CiBSifQDB6MghfCkfKiqWrpT52P3xGNIGpf5nqof2nCJLgjLgUcRNThqk0gI31x39a2Y56kC9wIP2JD+DFFJBmOMDSFofoo+1mrZc52P3wH3ULuS20d80LejEu+6Fnz9DtzDQ4tfTbBKZmAHsYMTYjSX8phjadh+1+kHyVz6nexdj580eW+56ApKSfAAjlAcyOS8TU0g+FmRjgQx+p6HoYTfYgCRekeFG0NEvj6pXu1ocf6S7dMdHL+wdQMxsufMTzx7R0Z1rbb3MwmIkBrIPoFralATqRaQFJu+FSiqNTcKH1Ho21W9j5+MPLxQS92F2G2XoQeWHPaCbph8LMDGA/Xycbnn4j8IkmOHI60A3eieW61Anl+dejpmVeKiYg2YCCNwYQRooD7aFAgWmCBGNMvRejl6+9YqJrX5wQZmYA6/MPr8khjNFIJJ7yBZYCauWYrWXQBP2H/2cLJACCJABBisk0b1jlpGhhpJgUPQAQJAE5fuVP/ETmb/64TciFAaz/936iorsBn54KvCTbAAEn9wEHdCL5B3SB9dWVW9j91EOLNQcS8IbAlmlaWz98Dp6d0rVX1ENnOSS5MYDNhX3UI/uZgZipFkA4HSQ238oS+kBTJHTR9Y5cGBPcevh/t6DrFoJADtjTz2z3NZFhzJUB/uB6Rc6gD/5A1NfrjsDCaZmDRWgCAsH2IzAAFFSiFFPQ0iKNPOw+RkKuDGD9vufTFZ0K2LANTyQdiTYQMyyS1o1hdbXHnZ2N+ZmD/sN7WyBxGpCn19kz5EE97Vv/tZfnYvcxEnJnAOt78zOr2+yzmfzeIGCYYgDDOjEskEYNI38nWPnCon94ryp13YBPhzgBh6KQqM0JOBSFRGvomZvd12jDWAgDWO+bzdVN59lMpJ6JFhj6BoukXWMeWkAXoTuUzTdJ1vbhJMyM9V6bz2uXJv7UiwyhMAawsd/92Oqmzvg6GUDOoIdJv+iF45VbbsvmVxQE1Q999QsDMKTAcZwI9/FyhMCgPLxHvXzt0szn/dDlCUmhDGDjvfNv1tYjj1QTINUEC8cbn397Mb7ArSt7NTjXAKlIKFGcHOsh+CgqdPOh4ASFx7f/7eqm66FpGiD4AuYPpLAoOurnrwXM7rPvWpJamPjOgn3s6uVHLxYm+YNNnwsD2GC/8/iqvhxCt4U4rAXECFFsZQZU3RFcUL3zrCLn0I9KOyAVCSWKWt4paB85SX7xmw8FzVDpnOLbvri6HfXQ0E1g8AuE5Rsg+AROG31A+7TMF1YvX6T2xFvyMwO99z3XktTrlGG2m1pRw0IwnI2W2uh4x7lIvs3MYK4MYAM++OTqdsm7TX2/16URJfEpyG2O7JQwwJYfhUH5AI/WWX5QPsBWNgqD8gFWHXIK/fff2GL6rZ/acOUtxSRYjdvRx162Xp6D2h997bkzgA3+5ifL7d/6u9X1xC/wEIZJ/0ALBHr0bw+EnzNQu1RL5FVf6pVmNgO99z+/4eHDXb/ZfPPsJ8ZAu/TRC3Vbm3mDm/eAo+P95tdXdEx09ShGog20wZEkM4qRaIaC6Td/rdwenc+k+f4HbuxIyg0kwBQ4geEBZKDBxqI2397XWbJIeODvy+0HvrGyzhhNMwtOmz4f8DNdrPQ+cLMFUNJPmf4EoOCR5A2LHNadQLdjsh597Hzu17s2blZYOAMMJvqmf1jZdH3qpMB2FFMaAILisIvd1F/V4ivdFnXRAyqFIMVIMakyEEgxSdg/pJg0qT8nZ69yTANhzmFpGMDe+9e+WW6/8ZvletRDXXa+fcgvCJrBy1eAYDas/hs2lo05KfQ+0G3FHjWvBye29R5t8XY9erSyUKnX1IdxqRhgMKt6u9z+lfZKnboDl1nQLSISH0GrF80I1p/6n3gDbl3p1vpX9j3JmkDCzMyghm1P1EsfrSyF1A/W2fBSMoBNzEAb1a49tbJ5/1Mr666PuqDNnh/eIYieQBtAGgV168/6ngR6V/Zb9M5sPrx2EpCdz4ClJdoxfL306NrSbTzSsNQMkM4xoF/653JbUP/lf1lZL8lElGI2oj7akf0NQ/sppL7rKG8g3wG6QGJbbeRYuk0d99btWcFENtdfuSWpf1Fb7YLUAwRJAARJAARJAARJAARJITY93VJvPNLgUnym0L3fKbfvfbq8/YZvl+sJlNbf8O0BlPmGpwWqu/fp0uZ9T5eak/4tIP9It9q78mJL0tuSFIe1GYfh0RGnbLpSfz26urJZfnS2I2YYdA7JmWSAotbFP+Kr/Q/2duJ+aZey9aAD9Q9UKggYBJQnDbsmwYYrldejj66sl66uNDnvvzmM2YKb7fGXxtMHG9/flSRvAAQkzghB+ZSW/W+DUu/gZnS1zOhqaTN6tLzNj3CmO4UwzIKSO5oBbOPjD/ZaPo7NwasRri3BbgNsImw0Np2cOBdF69GjJZYeLdVt00tXS03kHBbVnVvUwMswrkmuu1qqu7/QBl+N1t1VVzc6uhpJwqNN22jKllu7ZZhvEXO4oxmgiAU9a33eZYCztmM5z/cuA+S8oGetu7sMcNZ2LOf53mWAnBf0rHV3lwHO2o7lPN+7DJDzgk7a3aLb/z8AAAD//8qQ0VUAAAAGSURBVAMAof3THq6zXjIAAAAASUVORK5CYII=",
	sub2api: "data:image/png;base64,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",
	glm_plan_global: "data:image/png;base64,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",
	pollinations: "data:image/png;base64,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"
}, Ub = {
	deepseek: {
		asset: "deepseek",
		classification: "brand_reference"
	},
	alibaba_bailian: {
		asset: "alibaba_bailian",
		classification: "brand_reference"
	},
	grsai: {
		asset: "grsai",
		classification: "brand_reference"
	},
	meinianda: {
		asset: "meinianda",
		classification: "user_reference"
	},
	openai_compatible: {
		asset: "openai_compatible",
		classification: "generic_interface"
	},
	moonshot: {
		asset: "moonshot",
		classification: "brand_reference"
	},
	openrouter: {
		asset: "openrouter",
		classification: "brand_reference"
	},
	novita: {
		asset: "novita",
		classification: "brand_reference"
	},
	venice: {
		asset: "venice",
		classification: "brand_reference"
	},
	vercel_gateway: {
		asset: "vercel_gateway",
		classification: "brand_reference"
	},
	new_api: {
		asset: "new_api",
		classification: "gateway_project"
	},
	sub2api: {
		asset: "sub2api",
		classification: "gateway_project"
	},
	glm_plan_global: {
		asset: "glm_plan_global",
		classification: "brand_reference"
	},
	pollinations: {
		asset: "pollinations",
		classification: "brand_reference"
	},
	stepfun: {
		asset: "openai_compatible",
		classification: "generic_pending_permission"
	},
	minimax_plan: {
		asset: "openai_compatible",
		classification: "generic_pending_permission"
	},
	xai: {
		asset: "openai_compatible",
		classification: "generic_pending_current_identity"
	},
	glm_plan: {
		asset: "openai_compatible",
		classification: "generic_pending_current_asset"
	}
};
function Wb(e = {}) {
	let t = typeof e?.type == "string" ? e.type : "";
	t === "openai_compatible" && e.service_profile === "grsai" && (t = "grsai"), t === "glm_plan" && e.region === "global" && (t = "glm_plan_global");
	let n = Object.hasOwn(Ub, t), r = n ? Ub[t] : {
		asset: "openai_compatible",
		classification: "generic_unknown"
	};
	return {
		key: n ? t : "openai_compatible",
		src: Hb[r.asset],
		classification: r.classification
	};
}
//#endregion
//#region src/main.ts
var Gb = /* @__PURE__ */ I({
	props: { account: {
		type: Object,
		required: !0
	} },
	setup(e) {
		let t = /* @__PURE__ */ F(null);
		return () => {
			let n = Wb(e.account), r = t.value === n.src;
			return B("span", {
				class: "workspace-emblem quota-provider-emblem",
				"aria-hidden": "true",
				"data-provider-logo": n.key,
				"data-logo-kind": r ? "load-error" : n.classification
			}, [r ? B("span", { class: "quota-provider-emblem-fallback" }, "API") : B("img", {
				key: n.src,
				src: n.src,
				alt: "",
				width: 32,
				height: 32,
				draggable: !1,
				onError: () => {
					t.value = n.src;
				}
			})]);
		};
	}
}), Kb = Wo(/* @__PURE__ */ I({ setup() {
	let e = /* @__PURE__ */ F(0), t = /* @__PURE__ */ F(null), n = /* @__PURE__ */ F(null), r = /* @__PURE__ */ F("deepseek"), i = /* @__PURE__ */ F({}), a = /* @__PURE__ */ F({}), o = /* @__PURE__ */ F({}), s = Sy(document, () => g("web.common.cancel")), c = /* @__PURE__ */ F(Object.create(null)), f, p, m = Vb(window.AstrBotPluginView, () => {
		f !== m.state.draft && (i.value = {}, a.value = {}, o.value = {}, f = m.state.draft), p !== m.state.units && (c.value = Object.create(null), p = m.state.units), s.invalidate(), e.value++;
	}), h = m.state, g = (e, t) => l(e, h.locale, t), _ = (e) => Ny(e, h.locale), v = (e) => Py(e, h.locale), y = (e) => a.value[e] ? d(a.value[e], h.locale) : void 0, b = (e, t = {}) => B(Fg, {
		size: "large",
		...t
	}, () => e), x = () => !h.ready || h.busy || h.stale || !!h.snapshot?.migration.pending, S = () => x() || m.dirty() || !h.snapshot?.encryption.ready, C = async (e, t, n) => {
		let r = m.interactionKey();
		await s.ask({
			kind: e,
			copy: t,
			isCurrent: () => r === m.interactionKey() && h.ready
		}) && await n();
	}, w = async (e, t = null) => {
		let n = () => {
			m.navigate(e, t), e === "accounts" && t && h.snapshot?.config.providers.some((e) => e.id === t) && m.refreshUnits();
		};
		m.dirty() || h.secret || h.busy ? await C("navigation", () => [
			g("web.navigation.leave_title"),
			g("web.navigation.leave_body"),
			g("web.navigation.leave_action")
		], n) : n();
	}, T = async () => {
		let e = async () => {
			await m.refresh() && h.route === "accounts" && h.selected && await m.refreshUnits();
		};
		m.dirty() || h.secret ? await C("navigation", () => [
			g("web.navigation.reload_title"),
			g("web.navigation.reload_body"),
			g("web.navigation.reload_action")
		], e) : await e();
	}, E = (e) => B("svg", {
		class: "shell-icon",
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		"stroke-width": 1.5,
		"aria-hidden": "true"
	}, e === "account" ? [B("rect", {
		x: 3,
		y: 5,
		width: 18,
		height: 14,
		rx: 2
	}), B("path", { d: "M3 10h18M7 15h4" })] : e === "settings" ? [B("circle", {
		cx: 12,
		cy: 12,
		r: 4
	}), B("path", { d: "M12 2v3m0 14v3M2 12h3m14 0h3M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2" })] : [B("path", { d: "M4 12a8 8 0 1 1 2 6M4 12V5m0 7h7" })]), D = (e, t, n) => B("a", {
		href: "#/" + t,
		"aria-current": h.route === t ? "page" : void 0,
		onClick: (e) => {
			e.preventDefault(), w(t);
		}
	}, [E(n), B("span", e)]), O = () => B("div", { class: "shell-brand" }, [B("span", {
		class: "shell-brand-mark",
		"aria-hidden": "true"
	}, "✧"), B("span", [B("span", { class: "shell-brand-line" }, g("web.shell.brand_author")), B("span", { class: "shell-brand-line" }, g("web.shell.brand_name"))])]), k = (e, t) => t.reduce((e, t) => e?.[t], e), A = (e, t, n) => m.edit((r) => {
		let i = n === null ? r : r.providers[n];
		for (let t of e.slice(0, -1)) (!i[t] || typeof i[t] != "object") && (i[t] = {}), i = i[t];
		i[e.at(-1)] = t, n !== null && e.length === 1 && e[0] === "id" && (h.selected = String(t));
	}), ee = async (e, t) => {
		let n = h.draft?.providers[e];
		if (!n || t === n.service_profile) return;
		let r = n.balance_alert, i = r?.threshold !== null && r?.threshold !== void 0 || r?.recovery_threshold !== null && r?.recovery_threshold !== void 0 || r?.enabled, a = () => m.edit((n) => {
			let r = n.providers[e];
			r.service_profile = t, r.balance_alert = {
				...r.balance_alert,
				enabled: !1,
				metric: ky(r),
				threshold: null,
				recovery_threshold: null
			};
		});
		i ? await C("maintenance", () => [
			g("web.account.profile_title"),
			g("web.account.profile_body"),
			g("web.account.profile_action")
		], a) : a();
	};
	function j(e, t, n, r = [e], o = {}) {
		let s = n === null ? h.draft : h.draft?.providers[n];
		if (!s) return null;
		let c = "field-" + (n === null ? "global" : n) + "-" + r.join("-"), l = k(s, r) ?? t.default ?? "", d = o.label ?? g(e === "language" ? "web.settings.language" : (n === null ? Eb : Tb)[e]), f = o.locked || x(), p = (t) => {
			if (delete a.value[c], n !== null && r.length === 1 && e === "service_profile") {
				ee(n, String(t));
				return;
			}
			A(r, t, n);
		}, m;
		return m = t.type === "bool" ? (e) => B("label", { class: "ui-check-label" }, [B("input", {
			...e,
			type: "checkbox",
			checked: !!l,
			disabled: f,
			onChange: (e) => p(e.target.checked)
		}), B("span", g(l ? "web.common.on" : "web.common.off"))]) : t.options ? (n) => B("select", {
			...n,
			class: "ui-control",
			value: l,
			disabled: f,
			onChange: (e) => p(e.target.value)
		}, [t.options.includes(l) ? [] : [B("option", { value: l }, l || g("web.common.choose"))], ...t.options.map((t) => B("option", { value: t }, Cb(e, t, h.locale)))]) : t.type === "list" ? (e) => B("textarea", {
			...e,
			class: "ui-control",
			rows: 3,
			value: i.value[c] ?? (Array.isArray(l) ? l.join("\n") : ""),
			disabled: f,
			placeholder: g("web.common.one_per_line"),
			onInput: (e) => {
				let t = e.target.value;
				i.value[c] = t, p(t.split("\n").map((e) => e.trim()).filter(Boolean));
			}
		}) : t.type === "dict" ? (e) => B("textarea", {
			...e,
			class: "ui-control quota-json",
			rows: 4,
			value: i.value[c] ?? JSON.stringify(l || {}, null, 2),
			disabled: f,
			spellcheck: !1,
			onInput: (e) => {
				let t = e.target.value;
				i.value[c] = t;
				try {
					let e = JSON.parse(t || "{}");
					if (!e || typeof e != "object" || Array.isArray(e)) throw Error();
					p(e);
				} catch {
					a.value[c] = new u("web.validation.json_object");
				}
			}
		}) : (n) => B("input", {
			...n,
			class: "ui-control",
			type: ["float", "int"].includes(t.type) ? "number" : "text",
			min: t.type === "int" ? 1 : t.type === "float" ? .001 : void 0,
			max: e === "max_concurrency" ? 32 : e === "total_timeout_seconds" ? 300 : e === "timeout_seconds" ? 120 : e === "cache_ttl_seconds" ? 86400 : void 0,
			step: t.type === "int" ? 1 : t.type === "float" ? "any" : void 0,
			value: l,
			disabled: f,
			autocomplete: "off",
			onInput: (e) => {
				let n = e.target.value;
				p(["float", "int"].includes(t.type) ? n === "" ? "" : Number(n) : n);
			}
		}), B(by, {
			key: c,
			controlId: c,
			label: d,
			hint: o.hint ?? xb(t, h.locale),
			error: y(c),
			class: t.type === "list" || t.type === "dict" ? "ui-field-wide" : void 0
		}, { default: ({ controlAttrs: e }) => m(e) });
	}
	let te = (e) => h.snapshot?.config.providers.find((t) => t.id === e), ne = () => B(vy, {}, () => [
		b(g("web.settings.save"), {
			type: "primary",
			"data-action": "save",
			disabled: x() || !m.dirty() || Object.keys(a.value).length > 0,
			onClick: async () => {
				await m.save() && h.route === "accounts" && h.selected && await m.refreshUnits();
			}
		}),
		b(g("web.settings.discard"), {
			disabled: x() || !m.dirty(),
			onClick: () => m.discard()
		}),
		m.dirty() ? B("span", { class: "dirty-indicator" }, g("web.settings.unsaved")) : B("span", { class: "quota-muted" }, g("web.settings.separate_credentials"))
	]), re = (e) => B(hy, {
		title: g("web.credential.title"),
		eyebrow: g("web.credential.eyebrow")
	}, { default: () => [
		B(yy, {}, () => g("web.credential.separate")),
		te(e.id) ? null : B(yy, { tone: "warning" }, () => g("web.credential.save_account")),
		m.dirty() ? B(yy, { tone: "warning" }, () => g("web.credential.finish_settings")) : null,
		...[...wb(e, h.locale), ...Object.entries(h.snapshot?.credentials[e.id] || {}).filter(([t, n]) => n.configured && !wb(e, h.locale).some((e) => e.key === t)).map(([e]) => ({
			key: e,
			label: g("web.credential.legacy_field", { field: e })
		}))].map(({ key: t, label: n }) => {
			let r = h.snapshot?.credentials[e.id]?.[t], i = h.secret?.account === e.id && h.secret?.field === t;
			return B("section", {
				class: "quota-credential",
				key: t
			}, [
				B("h3", n),
				B("p", {
					class: "ui-badge",
					"data-testid": "credential-status"
				}, r ? r.configured ? r.source === "environment" ? g("web.credential.environment_status") : g("web.credential.encrypted_status") : g("web.credential.missing") : g("web.credential.status_unread")),
				r?.configured ? B(yy, {}, () => g("web.credential.saved_hint")) : null,
				i ? B("form", {
					autocomplete: "off",
					onSubmit: (e) => {
						e.preventDefault(), m.replace();
					}
				}, [
					B("div", {
						class: "ui-segmented",
						"aria-label": g("web.credential.new_source")
					}, [b(g("web.credential.enter_new"), {
						"aria-pressed": h.secret?.mode === "value",
						disabled: h.busy,
						onClick: () => m.beginSecret(e.id, t, "value")
					}), b(g("web.credential.use_environment"), {
						"aria-pressed": h.secret?.mode === "environment",
						disabled: h.busy,
						onClick: () => m.beginSecret(e.id, t, "environment")
					})]),
					B(by, {
						controlId: "credential-new-value",
						label: h.secret?.mode === "environment" ? g("web.credential.environment_name") : g("web.credential.new_value"),
						hint: h.secret?.mode === "environment" ? g("web.credential.environment_hint") : g("web.credential.new_value_hint")
					}, { default: ({ controlAttrs: e }) => B("input", {
						...e,
						class: "ui-control",
						type: h.secret?.mode === "environment" ? "text" : "password",
						value: h.secret?.mode === "environment" ? h.secret?.environment : h.secret?.value,
						autocomplete: "new-password",
						spellcheck: !1,
						autocapitalize: "none",
						maxlength: 8192,
						disabled: S(),
						onInput: (e) => m.changeSecret(h.secret?.mode === "environment" ? "environment" : "value", e.target.value)
					}) }),
					B(vy, {}, () => [b(g("web.credential.save_new"), {
						type: "primary",
						attrType: "submit",
						"data-action": "credential-save",
						disabled: S()
					}), b(g("web.credential.cancel_entry"), {
						disabled: h.busy,
						onClick: () => m.cancelSecret()
					})])
				]) : B(vy, {}, () => [b(g("web.credential.replace"), {
					"data-action": "credential-replace",
					disabled: S() || !te(e.id),
					onClick: () => m.beginSecret(e.id, t)
				}), b(g("web.credential.clear"), {
					"data-action": "credential-clear",
					disabled: x() || m.dirty() || !r?.configured,
					onClick: () => void C("credential-clear", () => [
						g("web.credential.clear_title", { credential: wb(e, h.locale).find((e) => e.key === t)?.label ?? g("web.credential.legacy_field", { field: t }) }),
						g("web.credential.clear_body", { account: e.display_name }),
						g("web.credential.confirm_clear")
					], () => m.clear(e.id, t))
				})])
			]);
		}),
		B("p", { class: "quota-muted" }, "")
	] }), ie = {
		unit_unidentified: "web.status.unit_unidentified",
		units_ambiguous: "web.status.units_ambiguous",
		unit_changed: "web.status.unit_changed",
		waiting_budget: "web.status.waiting_budget",
		disabled: "web.status.disabled",
		waiting: "web.status.waiting",
		monitoring: "web.status.monitoring",
		recovering: "web.status.recovering",
		submitted: "web.status.submitted",
		storage_unavailable: "web.status.storage_unavailable",
		ready: "web.status.waiting",
		normal: "web.status.normal",
		low: "web.status.low",
		recovered: "web.status.recovered",
		pending: "web.status.pending",
		pending_send: "web.status.pending_send",
		sent: "web.status.accepted",
		accepted: "web.status.accepted",
		unknown: "web.status.unknown",
		send_unknown: "web.status.unknown",
		failed: "web.status.failed",
		send_failed: "web.status.failed",
		paused: "web.status.paused",
		auth_paused: "web.status.auth_paused",
		blocked: "web.status.blocked",
		incomplete: "web.status.incomplete",
		error: "web.status.error",
		stale: "web.status.stale"
	}, ae = (e) => {
		let t = h.alertStatus, n = e ? t?.accounts.find((t) => t.account_id === e) : null;
		return B("div", { class: "quota-alert-runtime" }, [
			B("div", { class: "quota-alert-runtime-heading" }, [B("strong", g("web.runtime.title")), b(h.alertBusy ? g("web.runtime.loading") : g("web.runtime.refresh"), {
				text: !0,
				"data-action": "alert-status",
				disabled: !h.ready || h.busy || h.alertBusy,
				onClick: () => void m.refreshAlerts()
			})]),
			h.alertNotice ? B("p", { class: "quota-muted" }, h.alertNotice) : null,
			t ? B(yy, { tone: !t.storage_available || n?.status === "storage_unavailable" || n?.status === "failed" ? "error" : !t.running || n && [
				"low",
				"recovering",
				"unknown",
				"error",
				"stale",
				"blocked",
				"paused",
				"units_ambiguous",
				"unit_changed",
				"waiting_budget"
			].includes(n.status) ? "warning" : "neutral" }, () => t.storage_available ? t.running ? g(e ? n ? Object.hasOwn(ie, n.status) ? ie[n.status] : "web.runtime.unknown_status" : "web.runtime.no_account_record" : "web.runtime.running") : g("web.runtime.stopped") : g("web.runtime.storage_unavailable")) : null,
			n?.detail_code || n?.status === "blocked" ? B(yy, { tone: "warning" }, () => Ly(n?.detail_code, h.locale)) : null,
			n?.last_checked_at ? B("p", { class: "quota-muted" }, [g("web.runtime.last_checked"), B("time", { datetime: n.last_checked_at }, Fy(n.last_checked_at, h.locale))]) : null,
			n?.last_sent_at ? B("p", { class: "quota-muted" }, [g("web.runtime.last_sent"), B("time", { datetime: n.last_sent_at }, Fy(n.last_sent_at, h.locale))]) : null
		]);
	}, oe = (e, t) => {
		let n = te(e.id), r = !!n && [
			"type",
			"service_profile",
			"balance_scope",
			"prefer_split_endpoint",
			"response_mapping",
			"endpoint",
			"region",
			"team_id"
		].every((t) => JSON.stringify(e[t]) === JSON.stringify(n[t])) && e.balance_alert?.metric === n.balance_alert?.metric, i = r ? h.units?.accounts.find((t) => t.account_id === e.id) : void 0, a = i?.choices.filter((t) => t.metric === (e.balance_alert?.metric || ky(e))) || [], o = !!i && (["ambiguous", "changed"].includes(i.unit_state) || i.unit_state === "unidentified" && a.length === 1), l = i?.unit || Ry(e), u = c.value[e.id] || "", d = a.find((e) => e.id === u), f = i?.unit_state === "ambiguous" ? g("web.unit.ambiguous") : i?.unit_state === "changed" ? i.change_reason === "metric_changed" ? g("web.unit.metric_changed", {
			previous: v(i.binding_metric),
			current: v(i.metric)
		}) : i.change_reason === "query_identity_changed" ? g("web.unit.query_changed") : i.change_reason === "unit_changed" ? g("web.unit.changed") : g("web.unit.metric_or_unit_changed") : i?.unit_state === "stale" ? g("web.unit.candidates_stale") : null, p = x() || h.unitsBusy || !n || !r || m.dirty() || !!h.secret;
		return B("section", {
			class: "quota-alert-unit",
			"aria-label": g("web.unit.title")
		}, [
			B("div", { class: "quota-alert-runtime-heading" }, [B("strong", { "data-testid": "alert-unit" }, g("web.unit.current", { unit: l ? _(l) : g("web.unit.awaiting") })), b(h.unitsBusy ? g("web.unit.loading") : g("web.unit.read"), {
				text: !0,
				"data-action": "alert-units",
				disabled: !h.ready || h.busy || h.unitsBusy || !n,
				onClick: () => void m.refreshUnits()
			})]),
			i?.unit_state === "verified" ? B("p", { class: "quota-muted" }, i.choices_state === "expired" ? g("web.unit.verified_expired") : g("web.unit.verified")) : null,
			!l && !f ? B("p", { class: "quota-muted" }, g(r ? o ? "web.unit.confirm_observed" : "web.unit.detect_on_query" : n ? "web.unit.detect_on_save" : "web.unit.detect_on_account_save")) : null,
			n && !r ? B("p", { class: "quota-muted" }, e.balance_alert?.metric === n.balance_alert?.metric ? g("web.unit.query_edited") : g("web.unit.metric_edited", { metric: v(e.balance_alert?.metric) })) : null,
			i?.observed_at ? B("p", { class: "quota-muted" }, [g("web.unit.recorded"), B("time", { datetime: i.observed_at }, Fy(i.observed_at, h.locale))]) : null,
			f ? B(yy, { tone: "warning" }, () => f) : null,
			o && !a.length ? B("p", { class: "quota-muted" }, i?.choices_state === "expired" ? g("web.unit.choices_expired") : g("web.unit.no_choices")) : null,
			h.unitsNotice ? B(yy, { tone: h.unitsUnknown ? "warning" : "neutral" }, () => h.unitsNotice) : null,
			o && a.length ? B(by, {
				controlId: "field-" + t + "-unit-choice",
				label: g("web.unit.choose"),
				hint: m.dirty() ? g("web.settings.save_first") : void 0
			}, { default: ({ controlAttrs: t }) => B("div", { class: "quota-unit-choice" }, [B("select", {
				...t,
				class: "ui-control",
				value: u,
				disabled: x() || h.unitsBusy || m.dirty() || h.unitsUnknown,
				onChange: (t) => {
					s.cancel(), c.value[e.id] = t.target.value;
				}
			}, [B("option", { value: "" }, g("web.common.choose")), ...a.map((e) => B("option", { value: e.id }, _(e.unit)))]), b(g("web.unit.confirm"), {
				"data-action": "alert-bind-unit",
				disabled: x() || h.unitsBusy || h.unitsUnknown || m.dirty() || !d,
				onClick: () => void C("maintenance", () => [
					g("web.unit.confirm_title", { unit: _(d?.unit) }),
					e.balance_alert?.threshold !== null && e.balance_alert?.threshold !== void 0 ? g("web.unit.confirm_threshold", {
						unit: _(d?.unit),
						threshold: e.balance_alert.threshold
					}) : g("web.unit.confirm_no_threshold", { unit: _(d?.unit) }),
					g("web.unit.confirm")
				], () => m.bindUnit(e.id, u))
			})]) }) : null,
			n ? B("div", { class: "quota-unit-query" }, [b(g("web.unit.query"), {
				"data-action": "alert-refresh-units",
				disabled: p,
				onClick: () => void m.queryUnits(e.id)
			}), B("p", { class: "quota-muted" }, m.dirty() ? g("web.unit.save_before_query") : h.secret ? g("web.unit.finish_credential_before_query") : g("web.unit.query_hint"))]) : null
		]);
	}, se = (e, t) => {
		let n = {
			...Ey(),
			...e.balance_alert
		}, r = "field-" + t + "-balance_alert-", i = x(), s = (e, n) => A(["balance_alert", e], n, t), c = (t, o, c, l = "") => B(by, {
			controlId: r + t,
			label: o,
			hint: c,
			error: y(r + t)
		}, { default: ({ controlAttrs: o }) => B("input", {
			...o,
			class: "ui-control",
			type: "text",
			inputmode: t.includes("threshold") ? "decimal" : void 0,
			value: n[t] ?? "",
			placeholder: l,
			disabled: i,
			autocomplete: "off",
			spellcheck: !1,
			onInput: (i) => {
				let o = i.target.value;
				s(t, t.includes("threshold") && o === "" ? null : o);
				for (let e of ["threshold", "recovery_threshold"]) delete a.value[r + e];
				try {
					Yy({
						...n,
						[t]: t.includes("threshold") && o === "" ? null : o
					}, e);
				} catch (e) {
					a.value[r + t] = e;
				}
			}
		}) }), l = n.check_interval_minutes, d = Number.isInteger(l) && l >= 1 && l <= 4320;
		d && (o.value[r] = l);
		let f = d ? l : o.value[r] ?? 15, p = (e) => {
			let t = /^[0-9]+$/.test(e) ? Number(e) : NaN;
			Number.isInteger(t) && t >= 1 && t <= 4320 ? (s("check_interval_minutes", t), delete a.value[r + "check_interval_minutes"]) : (s("check_interval_minutes", e), a.value[r + "check_interval_minutes"] = new u("web.validation.interval_input"));
		}, m = Zy({
			...h.draft,
			providers: [e]
		}, h.locale);
		return B(_y, {
			title: g("web.alert.title"),
			number: "03"
		}, { default: () => [
			B(by, {
				controlId: r + "enabled",
				label: g("web.alert.enable_account"),
				hint: g("web.settings.applies_after_save")
			}, { default: ({ controlAttrs: e }) => B("label", { class: "ui-check-label" }, [B("input", {
				...e,
				type: "checkbox",
				checked: n.enabled === !0,
				disabled: i,
				onChange: (e) => s("enabled", e.target.checked)
			}), B("span", n.enabled ? g("web.common.on") : g("web.common.off"))]) }),
			m.length ? B(yy, { tone: "warning" }, () => m.join(" ")) : null,
			B(by, {
				controlId: r + "check_interval_minutes",
				label: g("web.alert.interval"),
				hint: g("web.alert.interval_hint"),
				error: y(r + "check_interval_minutes")
			}, { default: ({ controlAttrs: e }) => B("div", { class: "quota-alert-interval" }, [B("div", { class: "quota-alert-interval-controls" }, [
				B("input", {
					type: "range",
					id: r + "interval-slider",
					"aria-label": g("web.alert.interval_slider"),
					min: 1,
					max: 4320,
					step: 1,
					value: f,
					disabled: i,
					onInput: (e) => p(e.target.value)
				}),
				B("input", {
					...e,
					class: "ui-control",
					type: "number",
					min: 1,
					max: 4320,
					step: 1,
					value: l,
					disabled: i,
					onInput: (e) => p(e.target.value)
				}),
				B("span", g("web.alert.minutes"))
			]), B("div", {
				class: "quota-alert-quick-values",
				role: "group",
				"aria-label": g("web.alert.quick_group")
			}, [B("span", { class: "quota-muted" }, g("web.alert.quick_label")), ...[
				1,
				15,
				60,
				1440,
				4320
			].map((e) => b(e >= 1440 ? g("web.alert.interval_days", { count: e / 1440 }) : g("web.alert.interval_minutes", { count: e }), {
				size: "small",
				"aria-label": g("web.alert.interval_set", { count: e }),
				"aria-pressed": l === e,
				disabled: i,
				onClick: () => p(String(e))
			}))])]) }),
			B(xy, {}, () => [
				B(by, {
					controlId: r + "metric",
					label: g("web.alert.metric"),
					hint: g("web.alert.metric_hint")
				}, { default: ({ controlAttrs: t }) => B("select", {
					...t,
					class: "ui-control",
					value: n.metric || ky(e),
					disabled: i,
					onChange: (e) => s("metric", e.target.value)
				}, Ay(e).map((e) => B("option", { value: e }, v(e)))) }),
				oe(e, t),
				c("threshold", g("web.alert.threshold"), g("web.alert.threshold_hint"), g("web.alert.threshold_placeholder")),
				c("recovery_threshold", g("web.alert.recovery"), g("web.alert.recovery_hint"), g("web.alert.recovery_placeholder")),
				B(by, {
					controlId: r + "repeat_minutes",
					label: g("web.alert.repeat"),
					hint: g("web.alert.repeat_hint"),
					error: y(r + "repeat_minutes")
				}, { default: ({ controlAttrs: e }) => B("input", {
					...e,
					class: "ui-control",
					type: "number",
					min: 0,
					max: 4320,
					step: 1,
					value: n.repeat_minutes,
					disabled: i,
					onInput: (e) => {
						let t = e.target.value, n = /^[0-9]+$/.test(t) ? Number(t) : NaN;
						s("repeat_minutes", Number.isInteger(n) ? n : t), !Number.isInteger(n) || n < 0 || n > 4320 ? a.value[r + "repeat_minutes"] = new u("web.validation.repeat_input") : delete a.value[r + "repeat_minutes"];
					}
				}) })
			]),
			ae(e.id)
		] });
	}, ce = () => B(_y, {
		title: g("web.alert.targets_title"),
		number: "03"
	}, { default: () => [B(by, {
		controlId: "field-global-balance_alert_targets",
		label: g("web.alert.targets"),
		hint: g("web.alert.targets_hint"),
		error: y("field-global-balance_alert_targets")
	}, { default: ({ controlAttrs: e }) => B("textarea", {
		...e,
		class: "ui-control quota-targets",
		rows: 5,
		spellcheck: !1,
		autocomplete: "off",
		value: i.value["field-global-balance_alert_targets"] ?? Gy(h.draft?.balance_alert_targets),
		placeholder: [
			"Synthetic-QQ:FriendMessage:10001",
			"Synthetic-QQ:GroupMessage:10002 @10003 @10004",
			"Official-QQ:GroupMessage:ExampleGroupOpenID scene=qq_group",
			"Official-QQ:FriendMessage:ExampleUserOpenID scene=qq_c2c"
		].join("\n"),
		disabled: x(),
		onInput: (e) => {
			let t = e.target.value;
			i.value["field-global-balance_alert_targets"] = t;
			try {
				A(["balance_alert_targets"], Wy(t), null), delete a.value["field-global-balance_alert_targets"];
			} catch (e) {
				A(["balance_alert_targets"], t, null), a.value["field-global-balance_alert_targets"] = e;
			}
		}
	}) }), ae()] }), le = () => B(_y, {
		title: g("web.alert.permissions"),
		number: "04"
	}, { default: () => [B(by, {
		controlId: "field-global-balance_alert_admin_qq_ids",
		label: g("web.alert.admin_list"),
		hint: g("web.alert.admin_list_hint"),
		error: y("field-global-balance_alert_admin_qq_ids")
	}, { default: ({ controlAttrs: e }) => B("textarea", {
		...e,
		class: "ui-control",
		rows: 3,
		value: i.value["field-global-balance_alert_admin_qq_ids"] ?? (Array.isArray(h.draft?.balance_alert_admin_qq_ids) ? h.draft?.balance_alert_admin_qq_ids.join("\n") : ""),
		placeholder: g("web.alert.admin_list_placeholder"),
		disabled: x(),
		onInput: (e) => {
			let t = e.target.value;
			i.value["field-global-balance_alert_admin_qq_ids"] = t;
			try {
				if (/[\p{Cc}\p{Cf}\p{Cs}]/u.test(t.replace(/[\r\n\t]/g, ""))) throw new u("web.validation.invisible_chars");
				let e = Hy(t.split(/\s+/u).filter(Boolean));
				A(["balance_alert_admin_qq_ids"], e, null), delete a.value["field-global-balance_alert_admin_qq_ids"];
			} catch (e) {
				A(["balance_alert_admin_qq_ids"], t, null), a.value["field-global-balance_alert_admin_qq_ids"] = e;
			}
		}
	}) })] }), ue = () => B(_y, {
		title: g("web.alert.hints_title"),
		number: "05"
	}, { default: () => [B(by, {
		controlId: "field-global-balance_alert_llm-enabled",
		label: g("web.alert.smart_hint"),
		hint: g("web.alert.smart_hint_help")
	}, { default: ({ controlAttrs: e }) => B("label", { class: "ui-check-label" }, [B("input", {
		...e,
		type: "checkbox",
		checked: h.draft?.balance_alert_llm?.enabled !== !1,
		disabled: x(),
		onChange: (e) => A(["balance_alert_llm", "enabled"], e.target.checked, null)
	}), B("span", h.draft?.balance_alert_llm?.enabled === !1 ? g("web.common.off") : g("web.common.on"))]) })] });
	function de(t, n) {
		let r = gb(t).items, i = !!te(t.id), a = t.type === "openai_compatible", o = r.endpoint?.items || ob.provider_account.items.endpoint.items, s = ob.provider_account.items.response_mapping.items, c = h.snapshot?.credentials?.[t.id]?.api_key?.configured === !0;
		return B(my, {}, {
			default: () => [
				B(_y, {
					title: g("web.account.settings"),
					number: "01"
				}, { default: () => B(xy, {}, () => [
					j("id", r.id, n, void 0, {
						locked: i,
						hint: g(i ? "web.account.id_locked" : "web.account.id_hint")
					}),
					j("display_name", r.display_name, n),
					j("aliases", r.aliases, n, void 0, { hint: g("web.account.aliases_hint") }),
					j("enabled", r.enabled, n),
					B("div", { class: "quota-provider-readonly" }, [B("span", g("web.account.provider")), B("strong", _b(t.type, h.locale))]),
					j("timeout_seconds", r.timeout_seconds, n),
					j("cache_ttl_seconds", r.cache_ttl_seconds, n)
				]) }),
				B(_y, {
					title: g("web.account.provider_settings"),
					number: "02"
				}, { default: () => [B(yy, {}, () => g(cb(t.type))), B(xy, {}, () => [
					...r.region ? [j("region", r.region, n)] : [],
					...r.team_id ? [j("team_id", r.team_id, n, void 0, { label: g("web.field.team_id") })] : [],
					...lb(t.type) ? [j("base_url", o.base_url, n, ["endpoint", "base_url"], {
						label: g("web.field.gateway_origin"),
						locked: c,
						hint: g(c ? "config.wallet_origin_credential" : "web.hint.gateway_origin")
					})] : [],
					...a ? [
						j("service_profile", ob.openai_compatible.items.service_profile, n),
						...t.service_profile === "grsai" ? [j("balance_scope", ob.openai_compatible.items.balance_scope, n)] : [],
						...t.endpoint?.url ? [j("url", ob.provider_account.items.endpoint.items.url, n, ["endpoint", "url"])] : [],
						j("base_url", o.base_url, n, ["endpoint", "base_url"]),
						j("path", o.path, n, ["endpoint", "path"])
					] : []
				])] }),
				Ay(t).length ? se(t, n) : B(yy, {}, () => g("web.alert.query_only")),
				a ? B(_y, {
					title: g("web.account.advanced"),
					number: "04"
				}, { default: () => [j("advanced_options", ob.openai_compatible.items.advanced_options, n), t.advanced_options ? B("div", { class: "quota-advanced" }, [
					B("h3", g("web.account.protocol")),
					B(xy, {}, () => [
						"method",
						"auth_mode",
						"auth_name",
						"json_body"
					].map((e) => j(e, o[e], n, ["endpoint", e]))),
					B("h3", g("web.account.mapping")),
					B(yy, {}, () => g("web.account.mapping_hint")),
					B(xy, {}, () => Object.keys(s).map((e) => j(e, s[e], n, ["response_mapping", e])))
				]) : null] }) : null,
				ne(),
				B("div", { class: "quota-danger-row" }, [b(g("web.account.remove"), {
					disabled: x(),
					onClick: () => void C("maintenance", () => [
						g("web.account.remove_title", { account: t.display_name }),
						g("web.account.remove_body"),
						g("web.account.remove_action")
					], () => {
						m.cancelSecret(), m.edit((e) => e.providers.splice(n, 1)), h.selected = null, e.value++;
					})
				}), B("span", { class: "quota-muted" }, g("web.account.remove_hint"))])
			],
			aside: () => re(t)
		});
	}
	let fe = () => {
		let e = h.draft?.providers || [], t = h.selected === null ? -1 : e.findIndex((e) => e.id === h.selected), n = e[t];
		return n ? de(n, t) : B("section", { class: "workspace-index quota-directory" }, [B("aside", {
			class: "workspace-aside",
			"aria-label": g("web.account.add_query")
		}, [
			B("h2", { class: "shell-eyebrow" }, g("web.account.new")),
			B("label", { for: "new-provider" }, g("web.account.provider")),
			B("select", {
				id: "new-provider",
				class: "ui-control",
				value: r.value,
				disabled: x(),
				onChange: (e) => r.value = e.target.value
			}, sb.map((e) => B("option", { value: e }, _b(e, h.locale)))),
			b(g("web.account.add"), {
				type: "primary",
				disabled: x() || m.dirty(),
				onClick: () => {
					if (m.dirty()) return;
					let t = hb(r.value, h.locale), n = 1;
					for (; e.some((e) => e.id === r.value + "-" + n);) n++;
					t.id = r.value + "-" + n, m.navigate("accounts", t.id), m.edit((e) => e.providers.push(t));
				}
			}),
			B("p", { class: "workspace-scope-note" }, g("web.account.provider_scope"))
		]), B("div", { class: "workspace-catalog" }, [
			B("div", { class: "workspace-index-heading" }, [B("h2", { class: "shell-eyebrow" }, g("web.account.list")), B("span", { class: "workspace-count" }, g("web.account.count", { count: e.length }))]),
			e.length ? null : B("div", { class: "shell-empty" }, [B("h2", g("web.account.empty")), B("p", g("web.account.empty_hint"))]),
			B("div", { class: "workspace-package-grid" }, e.map((e) => B("article", {
				class: "workspace-module",
				key: e.id
			}, [B("div", { class: "workspace-module-heading" }, [B(Gb, { account: e }), B("div", [B("div", { class: "workspace-module-title" }, [B("h2", [B("a", {
				href: "#/accounts/" + encodeURIComponent(e.id),
				onClick: (t) => {
					t.preventDefault(), w("accounts", e.id);
				}
			}, e.display_name || e.id)]), B("span", { class: "workspace-state" }, e.enabled === !1 ? g("web.account.disabled") : g("web.account.enabled"))]), B("p", { class: "workspace-module-summary" }, _b(e.type, h.locale) + " · " + e.id)])]), B("div", { class: "quota-account-meta" }, [B("span", wb(e).every(({ key: t }) => h.snapshot?.credentials[e.id]?.[t]?.configured || t === "security_token") ? g("web.account.credentials_configured") : g("web.account.credentials_pending")), b(g("web.account.settings"), {
				text: !0,
				disabled: !h.ready,
				onClick: () => void w("accounts", e.id)
			})])]))),
			m.dirty() ? ne() : null
		])]);
	}, pe = () => B(my, {}, {
		default: () => [
			...fb.map((e) => B(_y, {
				title: g(e.title),
				number: e.number
			}, { default: () => B(xy, {}, () => e.keys.map((e) => j(e, ub[e], null))) })),
			ce(),
			le(),
			ue(),
			B(_y, {
				title: g("web.settings.appearance"),
				number: "06"
			}, { default: () => B(xy, {}, () => j("language", db, null, void 0, { hint: g("web.settings.language_hint") })) }),
			ne()
		],
		aside: () => B(hy, {
			title: g("web.settings.access_title"),
			eyebrow: g("web.settings.access_eyebrow")
		}, { default: () => [
			B("p", g("web.settings.admin_access")),
			B("ul", { class: "quota-guidance" }, [
				B("li", g("web.settings.admin_allowlist")),
				B("li", g("web.settings.private_format")),
				B("li", g("web.settings.command_access")),
				B("li", g("web.settings.group_access"))
			]),
			B(yy, {}, () => g("web.settings.account_alerts"))
		] })
	}), me = () => B(my, {}, {
		default: () => B(_y, {
			title: g("web.migration.title"),
			number: "01"
		}, { default: () => [
			B("p", g("web.migration.overview")),
			B(yy, { tone: h.snapshot?.migration.pending || h.snapshot?.migration.cleanup_pending || h.snapshot?.migration.legacy_conflict ? "warning" : "success" }, () => h.snapshot?.migration.legacy_conflict ? g("web.migration.conflict") : h.snapshot?.migration.cleanup_pending ? g("web.migration.cleanup_pending") : h.snapshot?.migration.pending ? g("web.migration.pending") : g("web.migration.no_pending")),
			b(g("web.migration.preview"), {
				disabled: !h.ready || h.busy || h.stale || m.dirty(),
				onClick: () => void m.plan()
			}),
			h.plan ? B("div", { class: "quota-migration-plan" }, [
				B("h3", g("web.migration.scope")),
				B("dl", [
					B("dt", g("web.migration.accounts")),
					B("dd", String(h.plan.account_count)),
					B("dt", g("web.migration.plaintext")),
					B("dd", String(h.plan.plaintext_count)),
					B("dt", g("web.migration.environment")),
					B("dd", String(h.plan.environment_count))
				]),
				B("p", g("web.migration.cleanup_hint")),
				b(h.plan.cleanup_pending ? g("web.migration.retry_cleanup") : g("web.migration.confirm"), {
					type: "primary",
					disabled: !h.plan.pending && !h.plan.cleanup_pending || h.plan.legacy_conflict || !h.snapshot?.encryption.ready || h.busy,
					onClick: () => void C("legacy-config", () => [
						g("web.migration.confirm_title"),
						g("web.migration.confirm_body", { count: h.plan.account_count }),
						g("web.migration.execute")
					], () => m.migrate())
				})
			]) : null
		] }),
		aside: () => B(hy, {
			title: g("web.storage.title"),
			eyebrow: g("web.storage.eyebrow")
		}, { default: () => [
			B("p", { class: "ui-badge" }, h.snapshot?.encryption.ready ? g("web.storage.ready") : g("web.storage.unavailable")),
			B("p", g("web.storage.key_handling")),
			B(yy, {}, () => g("web.storage.troubleshooting"))
		] })
	}), he = () => {
		let e = window.location.hash;
		window.history.replaceState(null, "", window.location.pathname + window.location.search);
		let t = /^#\/(accounts|global|maintenance)(?:\/([^/]+))?$/.exec(e);
		t && w(t[1], t[2] ? decodeURIComponent(t[2]) : null);
	}, ge = () => m.close(), _e = (e) => {
		(m.dirty() || h.secret || h.busy) && (e.preventDefault(), e.returnValue = "");
	};
	return jr(() => {
		m.start(), window.addEventListener("pagehide", ge), window.addEventListener("beforeunload", _e), window.addEventListener("hashchange", he);
	}), Nr(() => {
		s.dispose(), m.close(), window.removeEventListener("pagehide", ge), window.removeEventListener("beforeunload", _e), window.removeEventListener("hashchange", he);
	}), () => {
		e.value, document.documentElement.dataset.theme = h.theme, document.documentElement.lang = h.locale, document.title = g("web.shell.page_title");
		let r = h.draft?.providers.find((e) => e.id === h.selected), i = h.route === "global" ? g("web.navigation.global") : h.route === "maintenance" ? g("web.navigation.maintenance") : r ? r.display_name : g("web.navigation.accounts");
		return B(py, {
			theme: h.theme,
			locale: h.locale,
			styleMountTarget: document.head
		}, { default: () => B("div", {
			ref: t,
			class: "game-shell quota-shell",
			"data-theme": h.theme
		}, [
			B("button", {
				class: "ui-button skip-button",
				onClick: () => n.value?.focus()
			}, g("web.navigation.skip")),
			B("aside", { class: "shell-sidebar" }, [
				O(),
				B("p", { class: "shell-nav-label" }, "QUOTA LINK"),
				B("nav", { "aria-label": g("web.navigation.primary") }, [D(g("web.navigation.accounts"), "accounts", "account"), D(g("web.navigation.global"), "global", "settings")]),
				B("div", { class: "shell-settings-slot" }, [D(g("web.navigation.maintenance"), "maintenance", "maintenance"), B("p", { class: "shell-note" }, [
					g("web.shell.scope"),
					B("br"),
					"YOMIHIME SERIES"
				])])
			]),
			B("div", { class: "shell-content" }, [
				B("div", { class: "shell-mobile" }, [O(), B("nav", { "aria-label": g("web.navigation.mobile") }, [
					D(g("web.navigation.accounts"), "accounts", "account"),
					D(g("web.navigation.global"), "global", "settings"),
					D(g("web.navigation.maintenance"), "maintenance", "maintenance")
				])]),
				B("div", { class: "shell-topbar" }, [
					B("span", g("web.shell.brand_name")),
					B("span", "/"),
					B("span", i),
					B("span", { class: "quota-revision" }, h.snapshot ? g("web.shell.revision", { revision: h.snapshot.revision }) : g("web.shell.waiting"))
				]),
				B("main", {
					ref: n,
					id: "main",
					tabindex: -1
				}, [
					B(gy, {
						class: "shell-heading",
						title: i,
						eyebrow: g("web.shell.eyebrow"),
						subtitle: h.route === "accounts" ? g(r ? "web.account.editor_subtitle" : "web.account.list_subtitle") : void 0
					}, { default: () => B("div", { class: "quota-header-actions" }, [r ? b(g("web.navigation.back_to_accounts"), { onClick: () => void w("accounts") }) : null, b(g("web.navigation.reload"), {
						disabled: !h.ready || h.busy,
						onClick: () => void T()
					})]) }),
					B(yy, {
						tone: h.tone,
						role: h.tone === "error" ? "alert" : "status",
						class: "shell-status",
						"data-testid": "status"
					}, () => h.notice),
					s.render(),
					h.snapshot && !h.snapshot.encryption.ready ? B("div", {
						class: "quota-warning",
						role: "status"
					}, g("web.storage.unavailable_warning")) : null,
					h.snapshot?.migration.pending && h.route !== "maintenance" ? B("div", { class: "quota-warning" }, [B("span", g("web.migration.lock_warning")), b(g("web.migration.open"), { onClick: () => void w("maintenance") })]) : null,
					h.snapshot ? h.route === "global" ? pe() : h.route === "maintenance" ? me() : fe() : B("section", { class: "shell-empty" }, [B("h2", h.ready ? g("web.shell.loading_config") : g("web.shell.auth_required")), B("p", g("web.shell.open_from_host"))])
				]),
				B("footer", { class: "shell-footer" }, [B("a", {
					class: "shell-project-link",
					href: "https://github.com/yomihime/astrbot_plugin_yomihime_quota_link",
					target: "_blank",
					rel: "noopener noreferrer"
				}, [B("span", g("web.shell.project_name")), B("span", { class: "shell-project-english" }, [" / Yomihime Quota Link ", B("span", {
					class: "shell-project-spark",
					"aria-hidden": "true"
				}, "✧")])])])
			])
		]) });
	};
} }));
Kb.mount("#app"), window.addEventListener("pagehide", () => Kb.unmount(), { once: !0 });
//#endregion
