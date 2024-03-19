<?php
    try{
        require('./active-record.php');
        require('./get-record.php');

        $post_data = json_decode(file_get_contents('php://input'), true);
        $db = new GetRecord('./../db/db.sqlite3');
        
        $err_msg = $db->recordValidate('calendar', $post_data);
        $json = [];
        if(is_null($err_msg)){
            $now = date("Y-m-d H:i");
            $stmt = $db->pdo->prepare('
                INSERT INTO calendar(
                    scheduled_at, alerted_at, title, content, created_at, updated_at
                ) VALUES(
                    :scheduled_at, :alerted_at, :title, :content, :created_at, :updated_at
                )
            ');
            $stmt->bindParam(':scheduled_at', $post_data['scheduled_at'], PDO::PARAM_STR);
            $stmt->bindParam(':alerted_at', $post_data['alerted_at'], PDO::PARAM_STR);
            $stmt->bindParam(':title', $post_data['title'], PDO::PARAM_STR);
            $stmt->bindParam(':content', $post_data['content'], PDO::PARAM_STR);
            $stmt->bindParam(':created_at', $now, PDO::PARAM_STR);
            $stmt->bindParam(':updated_at', $now, PDO::PARAM_STR);
            if($stmt->execute()){
                $id = $db->pdo->lastInsertId();
                $json['calendar'] = $db->getSingleRecord('calendar', $id);
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
