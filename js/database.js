export class Database
{
    calendar = []
    client = []
    work = []

    /*
        @param task_date momentObj
        return obj
        選択している日のタスクレコードの抽出
    */
    taskDateGet(task_date)
    {
        return this.calendar.filter(v => task_date.isSame(v.scheduled_at, 'day'));
    }

    /*
        return obj
        アラートを鳴らすタスクレコードを抽出
    */
    alertTaskGet()
    {
        const today = moment();
        //alerted_atに値が入っていて、alerted_atが今日以前で、alert_openが0のものを抽出
        const alert_filter = this.calendar.filter(v => {
            if(!v.alerted_at){return false}
            if(moment(v.alerted_at).isSameOrBefore(today, 'day') && v.alert_open === '0'){
                return true;
            } else {
                return false;
            }
        });
        return alert_filter;
    }

    /*
        @param table str
        @param id int or str
        return obj
        単一のレコードを抽出
    */
    singleDataGet(table, id)
    {
        return this[table].find(v => v.id === String(id));
    }

    /*
        @param table str
        @param update_data obj
        単一のレコードを更新
    */
    singleDataUpdate(table, update_data)
    {
        this[table] = this[table].map(v => {
            if(v.id === update_data.id){
                return update_data;
            }
            return v;
        });
    }

    /*
        @param table str
        @param id int or str
        単一のレコードを削除
    */
    singleDataDelete(table, id)
    {
        this[table] = this[table].filter(v => v.id !== String(id));
    }

    /*
        @param client_id str
        return obj
        チャートに表示する作業と右側（期間未指定）に表示する作業をそれぞれ抽出
    */
    workListGet(client_id)
    {
        const res = {};
        //開始日と終了日の両方が入っているレコードを抽出
        res.work = this.work.filter(v => v.client_id === client_id && v.started_date && v.completed_date);
        //開始日もしくは終了日が入っていないレコードを抽出
        res.non_term = this.work.filter(v => v.client_id === client_id && (!v.started_date || !v.completed_date));
        return res;
    }

    /*
        @param update_data obj
        return obj
        作業の開始日と終了日を更新
    */
    workDateUpdate(update_data)
    {
        const work_data = this.work.find(v => v.id === update_data.id);
        work_data.started_date = update_data.started_date;
        work_data.completed_date = update_data.completed_date;
    }

    /*
        @param update_data obj
        return obj
        作業の進捗を更新
    */
    workPrgUpdate(update_data)
    {
        const work_data = this.work.find(v => v.id === update_data.id);
        work_data.progress = update_data.progress;
    }

    /*
        @param id int or str
        return obj
        案件を削除し、その案件に紐づく作業を削除
    */
    clientDelete(id)
    {
        this.client = this.client.filter(v => v.id !== String(id));
        this.work = this.work.filter(v => v.client_id !== String(id));
    }
}
