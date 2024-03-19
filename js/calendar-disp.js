import {Calendar} from './calendar.js';
export class CalendarDisp extends Calendar
{
    //カレンダー表示とアラートを全て初期化
    allInit()
    {
        this.calendarInit();
        this.alertInit();
    }

    //カレンダー表示を初期化
    calendarInit()
    {
        this.infoDateRemake();
        if(this.disp_type === 'month'){
            this.calendarMonthRemake();
        } else {
            this.calendarDayRemake();
        }
    }

    //カレンダーの上の中央部の日付を初期化
    infoDateRemake()
    {
        if(this.disp_type === 'month'){
            DOM.info_date.textContent = this.current_date.format('YYYY年MM月');
        } else {
            DOM.info_date.textContent = this.current_date.format('YYYY年MM月DD日');
        }
    }

    //月表示のカレンダーの初期化
    calendarMonthRemake()
    {
        DOM.day_wrap.classList.add('hidden');
        DOM.month_wrap.classList.remove('hidden');
        DOM.month_ul.innerHTML = '';
        //最終的にカレンダーに入れる日付をmomentオブジェクトで格納する
        const days_cel_arr = [];
        //現在月の月初
        const current_month_start = this.current_date.clone();
        current_month_start.startOf('month');
        //現在月の月末
        const current_month_end = this.current_date.clone();
        current_month_end.endOf('month');
        //現在月の日数
        const current_month_days = current_month_end.diff(current_month_start, 'days') + 1;
        //先月の月末
        const last_month_end = this.current_date.clone();
        last_month_end.subtract(1, 'month').endOf('month');
        //来月の月初
        const next_month_start = current_month_start.clone();
        next_month_start.add(1, 'month');
        //日曜日始まりで今月の月初の足りない曜日を先月で埋める
        for(let i = 0; i < current_month_start.day(); i++){
            days_cel_arr.push(last_month_end.clone());
            last_month_end.subtract(1, 'days');
        }
        //上記処理で先月の[30日, 29日, 28日]となっているので、順番を入れ替える
        days_cel_arr.reverse();
        //今月の1日から末日まで配列に格納
        for(let i = 0; i < current_month_days; i++){
            days_cel_arr.push(current_month_start.clone());
            current_month_start.add(1, 'days');
        }
        //最終的に合計7日 * 6行 = 42セルになるように来月で埋める
        const max_cel_num = 42 - days_cel_arr.length;
        for(let i = 0; i < max_cel_num; i++){
            days_cel_arr.push(next_month_start.clone());
            next_month_start.add(1, 'days');
        }
        days_cel_arr.forEach(cel_date => {
            DOM.month_ul.insertAdjacentHTML('beforeend', this._calendarMonthContentInsert(cel_date));
        });
    }

    /*
        @param cel_date momentobj
        return str
    */
    _calendarMonthContentInsert(cel_date)
    {
        //日曜を赤、土曜を青にする
        let bg_color = cel_date.days() === 0 ? 'bg-danger':cel_date.days() === 6 ? 'bg-info':'';
        //先月と来月をグレーにする
        if(!cel_date.isSame(this.current_date, 'month')){
            bg_color = 'bg-gray';
        }
        const task_filter = DB.taskDateGet(cel_date);
        const task_len = task_filter.length > 0 ? `<strong class="red">${task_filter.length}件</strong>`:'<div>　</div>';
        const today_flg = cel_date.isSame(moment(), 'day');
        const res = `<li class="${bg_color}" onclick="CD.dayClick('${cel_date.format('YYYY-MM-DD HH:mm')}');">
            <div class="calendar-month-date">
                ${today_flg ? `<span class="glyphicon glyphicon-fire"></span>`:''}
                ${cel_date.format('D')}日(${cel_date.format('dd')})
                ${today_flg ? `<span class="glyphicon glyphicon-fire"></span>`:''}
            </div>
            ${task_len}
        </li>`;
        return res;
    }

    //日表示のカレンダーの初期化
    calendarDayRemake()
    {
        DOM.month_wrap.classList.add('hidden');
        DOM.day_wrap.classList.remove('hidden');
        DOM.today_task_list.innerHTML = '';
        const task_filter = DB.taskDateGet(this.current_date);
        //タスクを予定時間順にソート
        const task_filter_sort = task_filter.sort((a, b) => {
            a = moment(a.scheduled_at);
            b = moment(b.scheduled_at);
            if(b.isBefore(a)){
                return 1;
            } else if(a.isBefore(b)) {
                return -1;
            } else {
                return 0;
            }
        });
        task_filter_sort.forEach(task => {
            DOM.today_task_list.insertAdjacentHTML('beforeend', this._calendarDayTaskInsert(task));
        });
    }

    /*
        @param task momentobj
        return str
    */
    _calendarDayTaskInsert(task)
    {
        const res = `<li onclick="CD.taskShow(${task.id})">
            <div class="task-list-item">
                <div class="task-item-at">
                    <div>${TEXT_MSG.schedule_at}</div>
                    <div>${moment(task.scheduled_at).format('HH時mm分')}</div>
                </div>
                <div class="task-item-at">
                    <div>${TEXT_MSG.alerted_at}</div>
                    <div>${task.alerted_at ? moment(task.alerted_at).format('HH時mm分'):'　'}</div>
                </div>
                <div class="task-item-title">${subStr(task.title, 30)}</div>
            </div>
        </li>`;
        return res;
    }

    /*
        @param id str
        詳細モーダル表示
    */
    taskShow(id)
    {
        const task = DB.singleDataGet('calendar', id);
        DOM.task_scheduled_at.textContent = moment(task.scheduled_at).format('YYYY年MM月DD日 HH時mm分');
        DOM.task_alerted_at.textContent = task.alerted_at ? moment(task.alerted_at).format('YYYY年MM月DD日 HH時mm分'):'';
        DOM.task_title.textContent = task.title;
        DOM.task_content.innerHTML = makeLink(task.content);
        DOM.task_id.value = id;
        $(DOM.task_show_modal).modal();
    }

    /*
        編集モーダル表示
    */
    taskEdit()
    {
        const task = DB.singleDataGet('calendar', DOM.task_id.value);
        DOM.task_edit_form.scheduled_at.value = task.scheduled_at;
        DOM.task_edit_form.alerted_at.value = task.alerted_at;
        DOM.task_edit_form.title.value = task.title;
        DOM.task_edit_form.content.value = task.content;
        DOM.task_edit_form.id.value = task.id;
        //詳細モーダルが消えきっていない状態で編集モーダルが開くと挙動がおかしくなるので
        //詳細モーダルをフェードアウトではなく即時消えるように処理
        DOM.task_show_modal.classList.remove('fade');
        $(DOM.task_show_modal).modal('hide');
        $(DOM.task_edit_modal).modal({backdrop: 'static'});
        DOM.task_show_modal.classList.add('fade');
    }
}
