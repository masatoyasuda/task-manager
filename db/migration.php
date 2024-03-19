<?php
    try{
        $db = new PDO('sqlite:./db.sqlite3');

        //カレンダー
        $sql = "CREATE TABLE calendar(
            id integer primary key autoincrement,
            scheduled_at text not null,
            title text not null,
            content text,
            alerted_at text,
            alert_open integer not null default 0,
            created_at text not null,
            updated_at text not null
        )";
        $db->exec($sql);

        //案件
        $sql = "CREATE TABLE client(
            id integer primary key autoincrement,
            name text not null 
        )";
        $db->exec($sql);

        //作業
        $sql = "CREATE TABLE work(
            id integer primary key autoincrement,
            client_id integer not null,
            title text not null,
            content text,
            started_date text,
            completed_date text,
            progress integer not null default 0,
            created_at text not null,
            updated_at text not null,
            foreign key(client_id) references client(id) on delete cascade
        )";
        $db->exec($sql);

        echo 'OK';
    } catch(PDOException $e){
        echo $e->getMessage();
    }
?>
