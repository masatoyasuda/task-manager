export class Calendar
{
    current_date = moment()
    disp_type = 'month'
    alert_list = []
    rules = {
        scheduled_at: {
            required: true,
            datetime: true
        },
        title: {
            required: true,
            maxlength: 100
        },
        content: {
            maxlength: 3000
        },
        alerted_at: {
            datetime: true
        }
    }
    messages = {
        scheduled_at: {
            required: ERR_MSG.validate_require
        },
        title: {
            required: ERR_MSG.validate_require,
            maxlength: ERR_MSG.validate_maxlength(100)
        },
        content: {
            maxlength: ERR_MSG.validate_maxlength(3000)
        }
    }

    constructor()
    {
        //通知の許可がされていなければ許可をするよう促す
        switch(Notification.permission){
            case('default'):
                Notification.requestPermission();
            break;
            case('denied'):
                alert(TEXT_MSG.notification_alert);
            break;
        }
        this._addValidateMethod();
        this._createValidate();
        this._editValidate();
    }

    /*
        @param val str
        月と日の表示変更
    */
    dispTypeChange(val)
    {
        this.disp_type = val;
        this.calendarInit();
    }

    /*
        @param val str
        return str
        月のカレンダーで日付をクリックした時の処理
    */
    dayClick(val)
    {
        this.current_date = moment(val);
        DOM.disp_type_day.click();
    }

    /*
        @param num int
        画面上部の左右の矢印をクリックした時の処理
    */
    dateChange(num)
    {
        if(this.disp_type === 'month'){
            this.current_date.add(num, 'month');
        } else {
            this.current_date.add(num, 'days');
        }
        this.calendarInit();
    }

    //今日ボタンをクリックした時の処理
    dateChangeToday()
    {
        this.current_date = moment();
        this.calendarInit();
    }

    //validate.jsにmethod追加
    _addValidateMethod()
    {
        //値が入っている場合に日時型かどうか判別
        $.validator.addMethod('datetime', val => {
            let flg = false;
            const regex = /^[12][0-9]{3}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])[ |T]([01][0-9]|2[0-3]):[0-5][0-9]$/;
            if(regex.test(val)){
                flg = true;
            } else {
                flg = false;
            }
            if(!val){
                flg = true;
            }
            return flg;
        }, ERR_MSG.validate_datetime);
    }

    //新規作成バリデーション＆保存処理
    _createValidate()
    {
        this.create_validate = $(DOM.task_create_form).validate({
            rules: this.rules,
            messages: this.messages,
            errorPlacement: (err, elem) => {
                err.insertBefore(elem);
            },
            submitHandler: form => {
                loading(true);
                const post_data = {
                    scheduled_at: form.scheduled_at.value,
                    alerted_at: form.alerted_at.value,
                    title: form.title.value,
                    content: form.content.value
                };
                API.post('./server/calendar-create.php', post_data).then(res => {
                    if(res.calendar){
                        DB.calendar.push(res.calendar);
                        this.calendarInit();
                        this.alertInit();
                        form.scheduled_at.value = '';
                        form.alerted_at.value = '';
                        form.title.value = '';
                        form.content.value = '';
                        $(DOM.task_create_modal).modal('hide');
                        flash('success', SUCCESS_MSG.create);
                    } else {
                        flash('danger', res.err);
                    }
                }).finally(() => {
                    loading(false);
                });
            }
        });
    }

    //編集バリデーション＆保存処理
    _editValidate()
    {
        this.edit_validate = $(DOM.task_edit_form).validate({
            rules: this.rules,
            messages: this.messages,
            errorPlacement: (err, elem) => {
                err.insertBefore(elem);
            },
            submitHandler: form => {
                loading(true);
                const patch_data = {
                    scheduled_at: form.scheduled_at.value,
                    alerted_at: form.alerted_at.value,
                    title: form.title.value,
                    content: form.content.value,
                    id: form.id.value
                };
                //アラート日時が変更されていた場合、アラートオープンを0に戻す
                const task = DB.singleDataGet('calendar', patch_data.id);
                if(patch_data.alerted_at === task.alerted_at){
                    patch_data.alert_open = Number(task.alert_open);
                } else {
                    patch_data.alert_open = 0;
                }
                API.patch('./server/calendar-update.php', patch_data).then(res => {
                    if(res.calendar){
                        DB.singleDataUpdate('calendar', res.calendar);
                        this.calendarInit();
                        this.alertInit();
                        $(DOM.task_edit_modal).modal('hide');
                        flash('success', SUCCESS_MSG.update);
                    } else {
                        flash('danger', res.err);
                    }
                }).finally(() => {
                    loading(false);
                });
            }
        });
    }

    //モーダルを閉じるボタンで閉じたときにはバリデーションをリセット
    validateReset()
    {
        this.create_validate.resetForm();
        this.edit_validate.resetForm();
    }

    //削除確認＆保存処理
    deleteConfirm()
    {
        if(confirm(TEXT_MSG.delete_confirm_simple)){
            loading(true);
            const delete_data = {
                id: task_edit_form.id.value,
                table: 'calendar'
            };
            API.delete('./server/single-delete.php', delete_data).then(res => {
                if(res.id){
                    DB.singleDataDelete('calendar', res.id);
                    this.calendarInit();
                    this.alertInit();
                    $(DOM.task_edit_modal).modal('hide');
                    flash('success', SUCCESS_MSG.delete);
                } else {
                    flash('danger', res.err);
                }
            }).finally(() => {
                loading(false);
            });
        }
    }

    //アラートの設定
    alertInit()
    {
        const alert_tasks = DB.alertTaskGet();
        //セットされてるアラートを初期化
        this.alert_list.forEach(alert_id => {
            clearTimeout(alert_id);
        });
        this.alert_list = [];
        const now = moment();
        alert_tasks.forEach(task => {
            //アラート時刻と現在時刻の差分計算
            const diff = moment(task.alerted_at).diff(now);
            this.alert_list.push(setTimeout(() => {
                this._alertPush(task.title, task.id);
            }, diff));
        });
    }

    _alertPush(title, id)
    {
        const push = new Notification(TEXT_MSG.push_title, {body: title});
        const patch_data = {
            id: id
        };
        API.patch('./server/task-alert.php', patch_data);
    }
}
