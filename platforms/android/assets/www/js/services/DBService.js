/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
//(function () {
    
    function ok ()
    {
    }
    
    function error (transaction, error) 
    {
      alert ("DB error : " + error.message);
      return false;
    }
    
    var DBService = function (reset){

        this.db = openDatabase ("MyDB", "1.0", "MyDB", 65535);
        
        if(reset){
            this.db.transaction (function (transaction) 
            {
              var sql = "DROP TABLE status";
              transaction.executeSql (sql, undefined, ok, error);
            });
            
            this.db.transaction (function (transaction) 
            {
              var sql = "DROP TABLE sephirah";
              transaction.executeSql (sql, undefined, ok, error);
            });
        }
        
        
        //Create the status table
        this.db.transaction (function (transaction) 
        {
          var sql = "CREATE TABLE IF NOT EXISTS status " +
              " (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, " +
              "property VARCHAR(100) NOT NULL, " + 
              "value VARCHAR(100) NOT NULL)";
          transaction.executeSql (sql, undefined, ok, error);
        });

        //Create the spherira table
        this.db.transaction (function (transaction) 
        {
          var sql = "CREATE TABLE IF NOT EXISTS sephirah " +
              " (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, " +
              "name VARCHAR(100) NOT NULL, " + 
              "description TEXT)";
          transaction.executeSql (sql, undefined, ok, error);
        });

    };
        
    DBService.prototype.fillDB = function (){

        //Can retrieve information from a distant db my synchronization..
        var sephiroh = new Array();
        sephiroh[0] = ["Kether",1,"Couronne"];
        sephiroh[1] = ["Chokmah",2,"Sagesse"];
        sephiroh[2] = ["Binah",3,"Compréhension"];
        sephiroh[3] = ["Chesed",4,"Compassion"];
        sephiroh[4] = ["Geburah",5,"Sévérité"];
        
        //Here just put the data hardcoded..
        var name;
        var description;
        
        this.db.transaction (function (transaction) 
        {
            for (var i=0;i<sephiroh.length;i++){
                name = sephiroh[i][0];
                description = sephiroh[i][2];
                var sql = "INSERT INTO sephirah (name, description) VALUES (?, ?)";
                transaction.executeSql (sql, [name, description],ok, error);
            }                    
        });

        //Set the data status
        this.db.transaction (function (transaction) 
        {
            var sql = "INSERT INTO status (property, value) VALUES (?, ?)";
            transaction.executeSql (sql, ["synchronized", "true"],ok, error);
        });

    };
    
    DBService.prototype.initialize = function(){
        var current = this;
        
        this.db.transaction (function (transaction) 
        {
            var sql = "SELECT value FROM status WHERE property=?";
            transaction.executeSql (sql, ["synchronized"],
            function(transaction, result){
                if (result.rows.length){
                    if(result.rows.item(0).value=="true"){
                        return;
                    }
                }else {                        
                     current.fillDB();
                }
            }
            , error);
        });
    }

    DBService.prototype.getShephiraDescription = function (){
        
    };
    
    
//}());
