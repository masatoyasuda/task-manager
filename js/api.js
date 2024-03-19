export class Api
{
    //一度にAPIで取得するレコード数の上限
    api_limit = 3000

    /*
        @param url str
        return Promiseobj
        GET-API
    */
    async get(url)
    {
        const res = await fetch(url);
        return res.json();
    }

    /*
        @param url str
        @param post_data obj
        return Promiseobj
        POST-API
    */
    async post(url, post_data)
    {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(post_data)
        });
        return res.json();
    }

    /*
        @param url str
        @param patch_data obj
        return Promiseobj
        PATCH-API
    */
    async patch(url, patch_data)
    {
        const res = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(patch_data)
        });
        return res.json();
    }

    /*
        @param url str
        @param delete_data obj
        return Promiseobj
        DELETE-API
    */
        async delete(url, delete_data)
        {
            const res = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(delete_data)
            });
            return res.json();
        }

    /*
        @param url str
        @param all_count obj
        return Promiseobj
        カレンダー、案件、作業それぞれの内容を繰り返し処理でPOST-APIする
    */
    async allGet(url, all_count)
    {
        const promise_arr = [];
        Object.keys(all_count).forEach(key => {
            const loop_count = Math.ceil(Number(all_count[key].cnt) / this.api_limit);
            for(let i = 0; i < loop_count; i++){
                const post_data = {
                    limit: this.api_limit,
                    offset: this.api_limit * i,
                    table: key
                };
                promise_arr.push(this.post(url, post_data));
            }
        });
        return Promise.all(promise_arr);
    }
}
