export class Progress
{
    gantt
    rules = {
        started_date: {
            date: true,
            dateorder_start: true
        },
        completed_date: {
            date: true,
            dateorder_comp: true
        },
        progress: {
            required: true,
            min: 0,
            max: 100
        },
        title: {
            required: true,
            maxlength: 100
        },
        content: {
            maxlength: 3000
        },
        name: {
            required: true,
            maxlength: 30
        }
    }
    messages = {
        progress: {
            required: ERR_MSG.validate_require,
            min: ERR_MSG.validate_min(0),
            max: ERR_MSG.validate_max(100)
        },
        title: {
            required: ERR_MSG.validate_require,
            maxlength: ERR_MSG.validate_maxlength(100)
        },
        content: {
            maxlength: ERR_MSG.validate_maxlength(3000)
        },
        name: {
            required: ERR_MSG.validate_require,
            maxlength: ERR_MSG.validate_maxlength(30)
        }
    }

    constructor()
    {
        this._addValidateMethod();
        this._createValidate();
        this._editValidate();
        this._clientCreateValidate();
        this._clientEditValidate();
    }

    //validate.jsにmethod追加
    _addValidateMethod()
    {
        //値が入っている場合に日付型か判別
        $.validator.addMethod('date', (val, elem) => {
            let flg = false;
            const regex = /^[12][0-9]{3}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
            if(regex.test(val)){
                flg = true;
            } else {
                flg = false;
            }
            if(!val){
                flg = true;
            }
            return flg;
        }, ERR_MSG.validate_date);

        //開始日にも終了日にも値が入っている場合に開始日よりも後か判別
        $.validator.addMethod('dateorder_comp', (val, elem) => {
            let flg = true;
            const started_date = elem.parentElement.parentElement.previousElementSibling.firstElementChild.lastElementChild.value;
            if(val && started_date){
                if(moment(val).isSameOrBefore(moment(started_date), 'day')){
                    flg = false;
                }
            }
            return flg;
        }, ERR_MSG.validate_dateorder_comp);

        //開始日にも終了日にも値が入っている場合に終了日よりも前か判別
        $.validator.addMethod('dateorder_start', (val, elem) => {
            let flg = true;
            const completed_date = elem.parentElement.parentElement.nextElementSibling.firstElementChild.lastElementChild.value;
            if(val && completed_date){
                if(moment(completed_date).isSameOrBefore(moment(val), 'day')){
                    flg = false;
                }
            }
            return flg;
        }, ERR_MSG.validate_dateorder_start);
    }

    //作業新規作成バリデーション＆保存処理
    _createValidate()
    {
        this.create_validate = $(DOM.work_create_form).validate({
            rules: this.rules,
            messages: this.messages,
            errorPlacement: (err, elem) => {
                err.insertBefore(elem);
            },
            submitHandler: form => {
                loading(true);
                const post_data = {
                    client_id: DOM.client.value,
                    started_date: form.started_date.value,
                    completed_date: form.completed_date.value,
                    progress: form.progress.value,
                    title: form.title.value,
                    content: form.content.value
                };
                API.post('./server/work-create.php', post_data).then(res => {
                    if(res.work){
                        DB.work.push(res.work);
                        this.workInit();
                        form.started_date.value = '';
                        form.completed_date.value = '';
                        form.progress.value = '';
                        form.title.value = '';
                        form.content.value = '';
                        $(DOM.work_create_modal).modal('hide');
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

    //作業編集バリデーション＆保存処理
    _editValidate()
    {
        this.edit_validate = $(DOM.work_edit_form).validate({
            rules: this.rules,
            messages: this.messages,
            errorPlacement: (err, elem) => {
                err.insertBefore(elem);
            },
            submitHandler: form => {
                loading(true);
                const patch_data = {
                    started_date: form.started_date.value,
                    completed_date: form.completed_date.value,
                    progress: form.progress.value,
                    title: form.title.value,
                    content: form.content.value,
                    id: form.id.value
                };
                API.patch('./server/work-update.php', patch_data).then(res => {
                    if(res.work){
                        DB.singleDataUpdate('work', res.work);
                        this.workInit();
                        $(DOM.work_edit_modal).modal('hide');
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
        this.client_create_validate.resetForm();
        this.client_edit_validate.resetForm();

    }

    //作業削除確認＆保存処理
    deleteConfirm()
    {
        if(confirm(TEXT_MSG.delete_confirm_simple)){
            loading(true);
            const delete_data = {
                id: work_edit_form.id.value,
                table: 'work'
            };
            API.delete('./server/single-delete.php', delete_data).then(res => {
                if(res.id){
                    DB.singleDataDelete('work', res.id);
                    this.workInit();
                    $(DOM.work_edit_modal).modal('hide');
                    flash('success', SUCCESS_MSG.delete);
                } else {
                    flash('danger', res.err);
                }
            }).finally(() => {
                loading(false);
            });
        }
    }

    /*
        @param work obj
        @param start str
        @param end str
        チャート上での日付変更保存
    */
    dateUpdate(work, start, end)
    {
        const patch_data = {
            id: work.id,
            started_date: moment(start).format('YYYY-MM-DD'),
            completed_date: moment(end).format('YYYY-MM-DD')
        };
        DB.workDateUpdate(patch_data);
        this.workInit();
        API.patch('./server/work-date-update.php', patch_data);
    }

    /*
        @param work obj
        @param prg int
        チャート上での進捗変更保存
    */
    prgUpdate(work, prg)
    {
        const patch_data = {
            id: work.id,
            progress: prg
        };
        DB.workPrgUpdate(patch_data);
        this.workInit();
        API.patch('./server/work-progress-update.php', patch_data);
    }

    //案件新規作成バリデーション＆保存処理
    _clientCreateValidate()
    {
        this.client_create_validate = $(DOM.client_create_form).validate({
            rules: this.rules,
            messages: this.messages,
            errorPlacement: (err, elem) => {
                err.insertBefore(elem);
            },
            submitHandler: form => {
                loading(true);
                const post_data = {
                    name: form.name.value
                };
                API.post('./server/client-create.php', post_data).then(res => {
                    if(res.client){
                        DB.client.push(res.client);
                        this.allInit();
                        form.name.value = '';
                        $(DOM.client_create_modal).modal('hide');
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

    //案件編集バリデーション＆保存処理
    _clientEditValidate()
    {
        this.client_edit_validate = $(DOM.client_edit_form).validate({
            rules: this.rules,
            messages: this.messages,
            errorPlacement: (err, elem) => {
                err.insertBefore(elem);
            },
            submitHandler: form => {
                loading(true);
                const patch_data = {
                    name: form.name.value,
                    id: form.id.value
                };
                API.patch('./server/client-update.php', patch_data).then(res => {
                    if(res.client){
                        DB.singleDataUpdate('client', res.client);
                        this.allInit();
                        $(DOM.client_edit_modal).modal('hide');
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

    //案件削除確認＆保存処理
    clientDeleteConfirm()
    {
        if(confirm(TEXT_MSG.delete_confirm('作業'))){
            loading(true);
            const delete_data = {
                id: client_edit_form.id.value,
                table: 'client'
            };
            API.delete('./server/single-delete.php', delete_data).then(res => {
                if(res.id){
                    DB.clientDelete(res.id);
                    this.allInit();
                    $(DOM.client_edit_modal).modal('hide');
                    flash('success', SUCCESS_MSG.delete);
                } else {
                    flash('danger', res.err);
                }
            }).finally(() => {
                loading(false);
            });
        }
    }
}
