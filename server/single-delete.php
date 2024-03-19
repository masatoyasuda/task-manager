<?php
    try{
        require('./active-record.php');
        require('./get-record.php');

        $delete_data = json_decode(file_get_contents('php://input'), true);
        $db = new GetRecord('./../db/db.sqlite3');
        
        $json = [];
        $sql = "DELETE FROM {$delete_data['table']} WHERE id = :id";
        $stmt = $db->pdo->prepare($sql);
        $stmt->bindParam(':id', $delete_data['id'], PDO::PARAM_INT);
        if($stmt->execute()){
            $json['id'] = $delete_data['id'];
        } else {
            throw new PDOException('削除に失敗しました');
        }
        echo json_encode($json);
    } catch(PDOException $e){
        echo json_encode(['err' => $e->getMessage()]);
    }
?>
