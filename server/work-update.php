<?php
    try{
        require('./active-record.php');
        require('./get-record.php');

        $patch_data = json_decode(file_get_contents('php://input'), true);
        $db = new GetRecord('./../db/db.sqlite3');
        
        $err_msg = $db->recordValidate('work', $patch_data);
        $json = [];
        if(is_null($err_msg)){
            $now = date("Y-m-d H:i");
            $stmt = $db->pdo->prepare('
                UPDATE work
                SET started_date = :started_date, completed_date = :completed_date, progress = :progress, title = :title, content = :content, updated_at = :updated_at
                WHERE id = :id
            ');
            $stmt->bindParam(':started_date', $patch_data['started_date'], PDO::PARAM_STR);
            $stmt->bindParam(':completed_date', $patch_data['completed_date'], PDO::PARAM_STR);
            $stmt->bindParam(':progress', $patch_data['progress'], PDO::PARAM_INT);
            $stmt->bindParam(':title', $patch_data['title'], PDO::PARAM_STR);
            $stmt->bindParam(':content', $patch_data['content'], PDO::PARAM_STR);
            $stmt->bindParam(':updated_at', $now, PDO::PARAM_STR);
            $stmt->bindParam(':id', $patch_data['id'], PDO::PARAM_INT);
            if($stmt->execute()){
                $json['work'] = $db->getSingleRecord('work', $patch_data['id']);
            } else {
                throw new PDOException('保存に失敗しました');
            }
        } else {
            $json['err'] = $err_msg;
        }
        echo json_encode($json);
    } catch(PDOException $e){
        echo json_encode(['err' => $e->getMessage()]);
    }
?>
