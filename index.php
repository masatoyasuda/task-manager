<!DOCTYPE html>
<html lang="ja">
    <head>
        <meta charset="utf-8">
        <title>タスク管理</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="./frappe-gantt.css" rel="stylesheet">
        <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css" rel="stylesheet">
        <link href="./style.css" rel="stylesheet">
    </head>
    <body>
        <div class="alert hidden" id="flash"></div>
        <div class="loading-wrap" id="loading">
            <div class="spinner-box">
                <div class="blue-orbit leo"></div>
                <div class="green-orbit leo"></div>
                <div class="red-orbit leo"></div>
                <div class="white-orbit w1 leo"></div>
                <div class="white-orbit w2 leo"></div>
                <div class="white-orbit w3 leo"></div>
            </div>
        </div>
        <?php require('./view/modal.html');?>
        <div class="container">
            <h3>タスク管理</h3>
            <ul class="nav nav-tabs">
                <li class="active">
                    <a href="#calendar" class="tab-list" data-id="calendar" data-toggle="tab">カレンダー</a>
                </li>
                <li>
                    <a href="#progress" class="tab-list" data-id="progress" data-toggle="tab">進捗状況</a>
                </li>
            </ul>
            <div class="tab-content">
                <?php require('./view/calendar.html'); ?>
                <?php require('./view/progress.html'); ?>
            </div>
        </div>
        <script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.30.1/moment.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.30.1/locale/ja.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-validate/1.20.0/jquery.validate.min.js"></script>
        <script src="./js/frappe-gantt/0.6.1/frappe-gantt.js"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/js/bootstrap.min.js"></script>
        <script src="./js/constant.js"></script>
        <script src="./js/common.js"></script>
        <script type="module">
            //各種JSモジュール読み込み
            import {Api} from './js/api.js';
            import {Database} from './js/database.js';
            import {CalendarDisp} from './js/calendar-disp.js';
            import {ProgressDisp} from './js/progress-disp.js';

            //インスタンス作成
            window.API = new Api();
            window.DB = new Database();
            window.CD = new CalendarDisp();
            window.PD = new ProgressDisp();

            const initCountGet = () =>
            {
                //各種レコード数カウント
                API.get('./server/all-get-count.php').then(count_data => {
                    initDataGet(count_data);
                });
            }

            const initDataGet = count_data =>
            {
                //各種レコードをサーバーから取得し、DBクラスのインスタンスに格納
                API.allGet('./server/all-get.php', count_data).then(all_data => {
                    //複数回で取得して複数に分かれている配列を1つにまとめる
                    all_data.forEach(data => {
                        Object.keys(data).forEach(data_name => {
                            DB[data_name] = DB[data_name].concat(data[data_name]);
                        });
                    });
                    CD.allInit();
                    PD.allInit();
                    loading(false);
                });
            }

            //各種初期化処理を実行させる
            initCountGet();
        </script>
    </body>
</html>
