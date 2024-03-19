<?php
    class GetRecord extends ActiveRecord
    {
        /*
            @param $table str
            @param $id int or str
        */
        public function getSingleRecord($table, $id)
        {
            $sql = "SELECT * FROM {$table} WHERE id = :id";
            $stmt = $this->pdo->prepare($sql);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->fetch(PDO::FETCH_ASSOC);
        }

        /*
            @param $table str
        */
        public function getAllCount($table)
        {
            $sql = "SELECT COUNT(id) AS cnt FROM {$table}";
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute();
            return $stmt->fetch(PDO::FETCH_ASSOC);
        }

        /*
            @param $table str
            @param $limit int
            @param $offset int
        */
        public function getAll($table, $limit, $offset)
        {
            $sql = "SELECT * FROM {$table} LIMIT :limit OFFSET :offset";
            $stmt = $this->pdo->prepare($sql);
            $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
            $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }
    }
?>
