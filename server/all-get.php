<?php
    require('./active-record.php');
    require('./get-record.php');

    $post_data = json_decode(file_get_contents('php://input'), true);
    $db = new GetRecord('./../db/db.sqlite3');
    $json[$post_data['table']] = $db->getAll($post_data['table'], $post_data['limit'], $post_data['offset']);

    echo json_encode($json);
?>
