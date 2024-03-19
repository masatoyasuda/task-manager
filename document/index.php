<!DOCTYPE html>
<html lang="ja">
    <head>
        <meta charset="utf-8">
        <title>ドキュメントまとめ</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css" rel="stylesheet">
        <style>
            #cp_inp, #cp_txt, .cp-msg {
                position: fixed;
                top: -2000px;
            }
            .copy {
                color: #00f;
                font-weight: 600;
                cursor: pointer;
            }
            .red {
                color: #f00;
            }
            .disp {
                z-index: 2000;
                top: 30%;
                left: 50%;
                right: 50%;
                transform: translate(-50%);
                width: 200px;
                height: 100px;
                text-align: center;
                line-height: 100px;
                background-color: #eee;
                border: 1px solid #000;
            }
            label {
                cursor: pointer;
            }
            .badge {
                background-color: #b92c28;
            }
        </style>
    </head>
    <body>
        <input id="cp_inp">
        <textarea id="cp_txt"></textarea>
        <div id="cp_msg" class="cp-msg">コピーしました！！</div>
        <div class="container" style="padding-bottom: 80px;">
            <h3>ドキュメントまとめ</h3>
            <form onsubmit="textSearch(event.target); return false;">
                <div class="form-group form-inline">
                    <input type="text" class="form-control" name="s_word" autocomplete="off">
                    <input type="submit" class="btn btn-primary" value="検索" style="margin: 0 10px;">
                    <button type="button" class="btn btn-danger" onclick="searchReset();">リセット</button>
                </div>
                <div class="form-group form-inline">
                    <label>
                        <input class="radio" type="radio" name="s_type" value="and" checked>AND
                    </label>
                    <label style="margin: 0 10px;">
                        <input class="radio" type="radio" name="s_type" value="or">OR
                    </label>
                </div>
            </form>
            <main>
                <ul class="nav nav-tabs">
                    <li class="active"><a href="#kyotu" class="tab-list" data-id="kyotu" data-toggle="tab">共通 </a></li>
                    <li><a href="#aaa" class="tab-list" data-id="raiten" data-toggle="tab">AAA </a></li>
                    <li><a href="#bbb" class="tab-list" data-id="denwa" data-toggle="tab">BBB </a></li>
                    <li><a href="#ccc" class="tab-list" data-id="online" data-toggle="tab">CCC </a></li>
                </ul>
                <div class="tab-content">
                    <!-- 共通 -->
                    <?php require('./view/kyotu.html') ?>
                    <!-- AAA -->
                    <?php require('./view/aaa.html') ?>
                    <!-- BBB -->
                    <?php require('./view/bbb.html') ?>
                    <!-- CCC -->
                    <?php require('./view/ccc.html') ?>
                </div>
            </main>
        </div>
        <script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/js/bootstrap.min.js"></script>
        <script>
            /*
                @param e obj event
                @param type str 'inp' or 'txt'
                @param msg str or null
            */
            const textCopy = (e, type, msg) =>
            {
                const cp_inp = document.getElementById('cp_inp');
                const cp_txt = document.getElementById('cp_txt');
                const cp_msg = document.getElementById('cp_msg');
                if(type === 'inp'){
                    cp_inp.value = e.target.textContent;
                    cp_inp.select();
                } else {
                    cp_txt.value = msg;
                    cp_txt.select();
                }
                document.execCommand('Copy');
                // コピーしました!!を表示して1秒で消す
                cp_msg.classList.add('disp');
                setTimeout(() => {
                    cp_msg.classList.remove('disp');
                }, 1000);
            }

            /*
                文字検索
                @param form dom
            */
            const textSearch = form =>
            {
                const s_type = form.s_type.value;
                // 検索文字列をスペースかカンマで区切って配列に格納
                const s_word_arr = form.s_word.value.replace(/ |　/g, ',').split(',');
                const panels = document.getElementsByClassName('panel');
                // バッジ処理用のタブ毎のカウント初期化
                const s_count_obj = {
                    'kyotu': 0,
                    'aaa': 0,
                    'bbb': 0,
                    'ccc': 0
                };
                Array.from(panels).forEach(panel => {
                    const panel_text = panel.textContent;
                    let flg;
                    if(s_type === 'and'){
                        flg = true;
                        // 1つでも一致しない文字列があればflg=false
                        s_word_arr.forEach(str => {
                            if(panel_text.search(str) === -1){
                                flg = false;
                            }
                        });
                    } else {
                        flg = false;
                        // １つでも一致する文字列があればflg=true
                        s_word_arr.forEach(str => {
                            if(panel_text.search(str) !== -1){
                                flg = true;
                            }
                        });
                    }
                    if(flg){
                        panel.classList.remove('hidden');
                        s_count_obj[panel.parentNode.getAttribute('id')]++;
                    } else {
                        panel.classList.add('hidden');
                    }
                });
                const tab_lists = document.getElementsByClassName('tab-list');
                const badges = document.getElementsByClassName('badge');
                Array.from(badges).forEach(badge => {
                    badge.remove();
                })
                Array.from(tab_lists).forEach(li => {
                    if(s_count_obj[li.dataset.id] > 0){
                        li.innerHTML = `${li.textContent}<span class="badge">${s_count_obj[li.dataset.id]}</span>`;
                    }
                });
            }

            /*
                文字検索リセット
            */
            const searchReset = () =>
            {
                const panels = document.getElementsByClassName('panel');
                Array.from(panels).forEach(panel => {
                    panel.classList.remove('hidden');
                });
                const badges = document.getElementsByClassName('badge');
                Array.from(badges).forEach(badge => {
                    badge.remove();
                })
            }
        </script>
    </body>
</html>
