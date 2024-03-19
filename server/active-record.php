<?php
    class ActiveRecord
    {
        public $pdo;
        private $err_msg = '';
        private $err_flg = false;
        private $validate_rules = [
            'calendar' => [
                'scheduled_at' => [
                    'at' => true,
                    'require' => true
                ],
                'title' => [
                    'require' => true,
                    'maxlen' => 100
                ],
                'content' => [
                    'maxlen' => 3000
                ],
                'alerted_at' => [
                    'at' => true
                ],
                'alert_open' => [
                    'bool' => true
                ]
            ],
            'work' => [
                'started_date' => [
                    'date' => 'true'
                ],
                'completed_date' => [
                    'date' => 'true'
                ],
                'progress' => [
                    'min' => 0,
                    'max' => 100
                ],
                'title' => [
                    'require' => true,
                    'maxlen' => 100
                ],
                'content' => [
                    'maxlen' => 3000
                ],
            ],
            'client' => [
                'name' => [
                    'require' => 'true',
                    'maxlen' => 30
                ]
            ]
        ];

        /*
            @param $db_path str
        */
        function __construct($db_path)
        {
            $this->pdo = new PDO("sqlite:{$db_path}");
            $this->pdo->exec('PRAGMA foreign_keys=true');
        }

        /*
            @param $table str
            @param data obj
            return str or null
            バリデーション
        */
        public function recordValidate($table, $data)
        {
            foreach($data as $column => $val){
                if(isset($this->validate_rules[$table][$column]['at'])){
                    $this->errMsgMold($this->atValidate($column, $val));
                }
                if(isset($this->validate_rules[$table][$column]['date'])){
                    $this->errMsgMold($this->dateValidate($column, $val));
                }
                if(isset($this->validate_rules[$table][$column]['maxlen'])){
                    $this->errMsgMold($this->maxLenValidate($column, $val, $this->validate_rules[$table][$column]['maxlen']));
                }
                if(isset($this->validate_rules[$table][$column]['min'])){
                    $this->errMsgMold($this->minValidate($column, $val, $this->validate_rules[$table][$column]['min']));
                }
                if(isset($this->validate_rules[$table][$column]['max'])){
                    $this->errMsgMold($this->maxValidate($column, $val, $this->validate_rules[$table][$column]['max']));
                }
                if(isset($this->validate_rules[$table][$column]['require'])){
                    $this->errMsgMold($this->requireValidate($column, $val));
                }
                if(isset($this->validate_rules[$table][$column]['bool'])){
                    $this->errMsgMold($this->boolValidate($column, $val));
                }
            }
            if($this->err_flg){
                return $this->err_msg;
            } else {
                return NULL;
            }
        }

        /*
            @param $res_msg str or null
            エラーメッセージ成形
        */
        private function errMsgMold($res_msg)
        {
            if(!is_null($res_msg)){
                $this->err_msg = $this->err_msg.$res_msg.'　';
                $this->err_flg = true;
            }
        }

        /*
            @param $column str
            @param $val str
        */
        private function atValidate($column, $val)
        {
            $err_msg = NULL;
            $regex = '/^[12][0-9]{3}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])[ |T]([01][0-9]|2[0-3]):[0-5][0-9]$/';
            if(!preg_match($regex, $val)){
                $err_msg = $column.'が日時型になってません';
            }
            if(mb_strlen($val) === 0){
                $err_msg = NULL;
            }
            return $err_msg;
        }

        /*
            @param $column str
            @param $val str
        */
        private function dateValidate($column, $val)
        {
            $err_msg = NULL;
            $regex = '/^[12][0-9]{3}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/';
            if(!preg_match($regex, $val)){
                $err_msg = $column.'が日付型になってません';
            }
            if(mb_strlen($val) === 0){
                $err_msg = NULL;
            }
            return $err_msg;
        }

        /*
            @param $column str
            @param $val str
            @param $max int
        */
        private function maxLenValidate($column, $val, $max)
        {
            $err_msg = NULL;
            if(mb_strlen($val) > $max){
                $err_msg = $column."の文字数は{$max}文字以内にしてください";
            }
            return $err_msg;
        }

        /*
            @param $column str
            @param $val str
            @param $min int
        */
        private function minValidate($column, $val, $min)
        {
            $err_msg = NULL;
            if($val < (int)$min){
                $err_msg = $column."は{$min}以上にしてください";
            }
            return $err_msg;
        }

        /*
            @param $column str
            @param $val str
            @param $max int
        */
        private function maxValidate($column, $val, $max)
        {
            $err_msg = NULL;
            if($val > (int)$max){
                $err_msg = $column."は{$max}以下にしてください";
            }
            return $err_msg;
        }

        /*
            @param $column str
            @param $val str
        */
        private function requireValidate($column, $val)
        {
            $err_msg = NULL;
            $regex = '/^[ 　]$/';
            if(preg_match($regex, $val) || empty($val)){
                $err_msg = $column.'は入力必須です';
            }
            return $err_msg;
        }

        /*
            @param $column str
            @param $val str
        */
        private function boolValidate($column, $val)
        {
            $err_msg = NULL;
            if($val !== 0 && $val !== 1){
                $err_msg = $column.'は0か1しか保存できません';
            }
            return $err_msg;
        }
    }
?>
