<?php
    try{
        require('./active-record.php');
        require('./get-record.php');

        $post_data = json_decode(file_get_contents('php://input'), true);
        $db = new GetRecord('./../db/db.sqlite3');
        
        $err_msg = $db->recordValidate('client', $post_data);
        $json = [];
        if(is_null($err_msg)){
            $stmt = $db->pdo->prepare('
                INSERT INTO client(
                    name
                ) VALUES(
                    :name
                )
            ');
            $stmt->bindParam(':name', $post_data['name'], PDO::PARAM_STR);
            if($stmt->execute()){
                $id = $db->pdo->lastInsertId();
                $json['client'] = $db->getSingleRecord('client', $id);
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
