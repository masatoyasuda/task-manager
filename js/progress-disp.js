import {Progress} from './progress.js';
export class ProgressDisp extends Progress
{
    //案件と作業を全て初期化
    allInit()
    {
        DOM.client.innerHTML = '';
        DB.client.forEach((client, i) => {
            if(i === 0){
                DOM.client.insertAdjacentHTML('beforeend', `<option value="${client.id}" selected>
                    ${client.name}
                </option>`);
            } else {
                DOM.client.insertAdjacentHTML('beforeend', `<option value="${client.id}">
                    ${client.name}
                </option>`);
            }
        });
        this.workInit();
    }

    //作業を初期化
    workInit()
    {
        //選択されている案件を取得
        const select_client_id = DOM.client.value;
        const work_list = DB.workListGet(select_client_id);
        this._chartRemake(work_list.work);
        this._workIndexRemake(work_list.work);
        this._nonTermRemake(work_list.non_term);
    }

    /*
        @param work_list obj
        チャート表示
    */
    _chartRemake(work_list)
    {
        const gantt_items = work_list.map(v => {
            const obj = {
                id: v.id,
                name: v.title,
                start: v.started_date,
                end: v.completed_date,
                progress: v.progress
            };
            return obj;
        });
        DOM.chart_wrap.innerHTML = '';
        if(gantt_items.length > 0){
            this.gantt = new Gantt('#chart_wrap', gantt_items, {
                language: 'zh',
                bar_height: 30,
                custom_popup_html: work => {
                    return `<ul style="width: 250px;">
                        <li>${work.name}</li>
                        <li>進捗：${work.progress}%</li>
                        <li>開始日：${work.start}</li>
                        <li>終了日：${work.end}</li>
                    </ul>`;
                },
                on_date_change: (work, start, end) => {
                    this.dateUpdate(work, start, end);
                },
                on_progress_change: (work, prg) => {
                    this.prgUpdate(work, prg);
                },
                on_click: work => {
                    PD.workEdit(work.id);
                }
            });
        }
        
    }

    /*
        @param work_list obj
        作業一覧
    */
    _workIndexRemake(work_list)
    {
        DOM.work_index_tbody.innerHTML = '';
        work_list.forEach(work => {
            DOM.work_index_tbody.insertAdjacentHTML('beforeend', this._tableInsert(work));
        });
    }

    /*
        @param work_list obj
        期間未指定の作業一覧
    */
    _nonTermRemake(work_list)
    {
        DOM.non_term_tbody.innerHTML = '';
        work_list.forEach(work => {
            DOM.non_term_tbody.insertAdjacentHTML('beforeend', this._tableInsert(work));
        });
    }

    /*
        @param work obj
        return str
    */
    _tableInsert(work)
    {
        return `<tr onclick="PD.workShow(${work.id})">
            <td>${work.started_date ? moment(work.started_date).format('YYYY年MM月DD日'):''}</td>
            <td>${work.completed_date ? moment(work.completed_date).format('YYYY年MM月DD日'):''}</td>
            <td>${work.progress}%</td>
            <td>${subStr(work.title, 25)}</td>
        </tr>`;
    }

    /*
        @param id str
        作業詳細モーダル表示
    */
    workShow(id)
    {
        const work = DB.singleDataGet('work', id);
        DOM.work_started_date.textContent = work.started_date ? moment(work.started_date).format('YYYY年MM月DD日'):'';
        DOM.work_completed_date.textContent = work.completed_date ? moment(work.completed_date).format('YYYY年MM月DD日'):'';
        DOM.work_progress.textContent = `${work.progress}%`;
        DOM.work_title.textContent = work.title;
        DOM.work_content.innerHTML = makeLink(work.content);
        DOM.work_id.value = id;
        $(DOM.work_show_modal).modal();
    }

    /*
        @param id str
        作業編集モーダル表示
        idが渡されなかった場合、詳細モーダルからidを取得する
        チャートのダブルクリックの時はidが渡ってくるが、一覧⇒詳細モーダル⇒編集モーダルの時は値が渡ってこない
    */
    workEdit(id = DOM.work_id.value)
    {
        const work = DB.singleDataGet('work', id);
        DOM.work_edit_form.started_date.value = work.started_date;
        DOM.work_edit_form.completed_date.value = work.completed_date;
        DOM.work_edit_form.progress.value = work.progress;
        DOM.work_edit_form.title.value = work.title;
        DOM.work_edit_form.content.value = work.content;
        DOM.work_edit_form.id.value = work.id;
        //詳細モーダルが消えきっていない状態で編集モーダルが開くと挙動がおかしくなるので
        //詳細モーダルをフェードアウトではなく即時消えるように処理
        DOM.work_show_modal.classList.remove('fade');
        $(DOM.work_show_modal).modal('hide');
        $(DOM.work_edit_modal).modal({backdrop: 'static'});
        DOM.work_show_modal.classList.add('fade');
    }

    /*
        @param id str
        案件編集モーダル表示
    */
    clientEdit(id)
    {
        const client = DB.singleDataGet('client', id);
        DOM.client_edit_form.name.value = client.name;
        DOM.client_edit_form.id.value = id;
        $(DOM.client_edit_modal).modal({backdrop: 'static'});
    }
}
