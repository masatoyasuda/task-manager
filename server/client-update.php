<?php
    try{
        require('./active-record.php');
        require('./get-record.php');

        $patch_data = json_decode(file_get_contents('php://input'), true);
        $db = new GetRecord('./../db/db.sqlite3');
        
        $err_msg = $db->recordValidate('work', $patch_data);
        $json = [];
        if(is_null($err_msg)){
            $stmt = $db->pdo->prepare('
                UPDATE client
                SET name = :name
                WHERE id = :id
            ');
            $stmt->bindParam(':name', $patch_data['name'], PDO::PARAM_STR);
            $stmt->bindParam(':id', $patch_data['id'], PDO::PARAM_INT);
            if($stmt->execute()){
                $json['client'] = $db->getSingleRecord('client', $patch_data['id']);
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
