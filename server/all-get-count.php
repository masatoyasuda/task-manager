<?php
    require('./active-record.php');
    require('./get-record.php');

    $db = new GetRecord('./../db/db.sqlite3');
    $json['calendar'] = $db->getAllCount('calendar');
    $json['client'] = $db->getAllCount('client');
    $json['work'] = $db->getAllCount('work');

    echo json_encode($json);
?>
