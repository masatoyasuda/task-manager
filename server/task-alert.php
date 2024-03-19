<?php
    try{
        require('./active-record.php');
        require('./get-record.php');

        $patch_data = json_decode(file_get_contents('php://input'), true);
        $db = new GetRecord('./../db/db.sqlite3');

        $stmt = $db->pdo->prepare('
            UPDATE calendar
            SET alert_open = 1
            WHERE id = :id
        ');
        $stmt->bindParam(':id', $patch_data['id'], PDO::PARAM_INT);
        $stmt->execute();
        echo json_encode(['res' => 'OK']);
    } catch(PDOException $e){
        echo json_encode(['err' => $e->getMessage()]);
    }
?>
