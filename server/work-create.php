<?php
    try{
        require('./active-record.php');
        require('./get-record.php');

        $post_data = json_decode(file_get_contents('php://input'), true);
        $db = new GetRecord('./../db/db.sqlite3');
        
        $err_msg = $db->recordValidate('work', $post_data);
        $json = [];
        if(is_null($err_msg)){
            $now = date("Y-m-d H:i");
            $stmt = $db->pdo->prepare('
                INSERT INTO work(
                    client_id, started_date, completed_date, progress, title, content, created_at, updated_at
                ) VALUES(
                    :client_id, :started_date, :completed_date, :progress, :title, :content, :created_at, :updated_at
                )
            ');
            $stmt->bindParam(':client_id', $post_data['client_id'], PDO::PARAM_INT);
            $stmt->bindParam(':started_date', $post_data['started_date'], PDO::PARAM_STR);
            $stmt->bindParam(':completed_date', $post_data['completed_date'], PDO::PARAM_STR);
            $stmt->bindParam(':progress', $post_data['progress'], PDO::PARAM_INT);
            $stmt->bindParam(':title', $post_data['title'], PDO::PARAM_STR);
            $stmt->bindParam(':content', $post_data['content'], PDO::PARAM_STR);
            $stmt->bindParam(':created_at', $now, PDO::PARAM_STR);
            $stmt->bindParam(':updated_at', $now, PDO::PARAM_STR);
            if($stmt->execute()){
                $id = $db->pdo->lastInsertId();
                $json['work'] = $db->getSingleRecord('work', $id);
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
