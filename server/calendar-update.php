<?php
    try{
        require('./active-record.php');
        require('./get-record.php');

        $patch_data = json_decode(file_get_contents('php://input'), true);
        $db = new GetRecord('./../db/db.sqlite3');
        
        $err_msg = $db->recordValidate('calendar', $patch_data);
        $json = [];
        if(is_null($err_msg)){
            $now = date("Y-m-d H:i");
            $stmt = $db->pdo->prepare('
                UPDATE calendar
                SET scheduled_at = :scheduled_at, alerted_at = :alerted_at, alert_open = :alert_open, title = :title, content = :content, updated_at = :updated_at
                WHERE id = :id
            ');
            $stmt->bindParam(':scheduled_at', $patch_data['scheduled_at'], PDO::PARAM_STR);
            $stmt->bindParam(':alerted_at', $patch_data['alerted_at'], PDO::PARAM_STR);
            $stmt->bindParam(':alert_open', $patch_data['alert_open'], PDO::PARAM_INT);
            $stmt->bindParam(':title', $patch_data['title'], PDO::PARAM_STR);
            $stmt->bindParam(':content', $patch_data['content'], PDO::PARAM_STR);
            $stmt->bindParam(':updated_at', $now, PDO::PARAM_STR);
            $stmt->bindParam(':id', $patch_data['id'], PDO::PARAM_INT);
            if($stmt->execute()){
                $json['calendar'] = $db->getSingleRecord('calendar', $patch_data['id']);
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
