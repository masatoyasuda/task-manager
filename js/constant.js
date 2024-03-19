'use strict';
//JSで使用する静的DOMはあらかじめ取得しておく
const DOM = {
    alert: document.getElementById('alert'),
    flash: document.getElementById('flash'),
    loading: document.getElementById('loading'),
    info_date: document.getElementById('info_date'),
    disp_type_day: document.getElementById('disp_type_day'),
    month_wrap: document.getElementById('month_wrap'),
    month_ul: document.getElementById('month_ul'),
    day_wrap: document.getElementById('day_wrap'),
    task_create_modal: document.getElementById('task_create_modal'),
    task_create_form: document.getElementById('task_create_form'),
    task_show_modal: document.getElementById('task_show_modal'),
    task_scheduled_at: document.getElementById('task_scheduled_at'),
    task_alerted_at: document.getElementById('task_alerted_at'),
    task_title: document.getElementById('task_title'),
    task_content: document.getElementById('task_content'),
    task_id: document.getElementById('task_id'),
    task_edit_modal: document.getElementById('task_edit_modal'),
    task_edit_form: document.getElementById('task_edit_form'),
    today_task_list: document.getElementById('today_task_list'),
    client: document.getElementById('client'),
    daterange: document.getElementById('daterange'),
    chart_wrap: document.getElementById('chart_wrap'),
    work_index_tbody: document.getElementById('work_index_tbody'),
    non_term_tbody: document.getElementById('non_term_tbody'),
    work_create_modal: document.getElementById('work_create_modal'),
    work_create_form: document.getElementById('work_create_form'),
    work_show_modal: document.getElementById('work_show_modal'),
    work_started_date: document.getElementById('work_started_date'),
    work_completed_date: document.getElementById('work_completed_date'),
    work_progress: document.getElementById('work_progress'),
    work_title: document.getElementById('work_title'),
    work_content: document.getElementById('work_content'),
    work_id: document.getElementById('work_id'),
    work_edit_modal: document.getElementById('work_edit_modal'),
    work_edit_form: document.getElementById('work_edit_form'),
    client_create_modal: document.getElementById('client_create_modal'),
    client_create_form: document.getElementById('client_create_form'),
    client_edit_modal: document.getElementById('client_edit_modal'),
    client_edit_form: document.getElementById('client_edit_form')
};

//JSで使用するテキストはあらかじめ格納しておく
const ERR_MSG = {
    validate_require: 'この項目は必須です',
    validate_datetime: '日時型にしてください',
    validate_date: '日付型にしてください',
    validate_dateorder_start: '終了日よりも前を指定してください',
    validate_dateorder_comp: '開始日よりも後を指定してください',
    validate_maxlength: num => `${num}文字以内にしてください`,
    validate_min: num => `${num}以上にしてください`,
    validate_max: num => `${num}以下にしてください`
};

const SUCCESS_MSG = {
    create: '追加に成功しました',
    update: '変更の保存に成功しました',
    delete: '削除に成功しました'
};

const TEXT_MSG = {
    delete_confirm_simple: '本当に削除しますか？',
    delete_confirm: item => `関連する${item}も全て削除され、\n元に戻せません。\n本当に削除しますか？`,
    notification_alert: '通知を許可してページを開きなおしてください',
    push_title: 'タスク通知',
    schedule_at: '予定日時',
    alerted_at: '通知日時'
};
