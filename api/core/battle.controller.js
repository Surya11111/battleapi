var controller =  {};
var async  =  require("async");
var Battle = require("../../models/battle");

var getmostActive =  function(cb){
  let mostActive = {attacker_king:"",defender_king:"",region:""};
  async.series([
    function(cb){
      Battle.aggregate( [
          { $group:
            {
               _id:"$attacker_king",
              count: {$sum: 1}
            }
          },
          { "$sort": { "count": -1 } },
          { "$limit": 1 }
         ]
      ).then(function(result){
          console.log(result[0]._id);
          mostActive.attacker_king =result[0]._id;
           cb(null,result[0]._id);
       });
     },function(cb){
       Battle.aggregate( [
           { $group:
             {
                _id:"$defender_king",
               count: {$sum: 1}
             }
           },
           { "$sort": { "count": -1 } },
           { "$limit": 1 }
          ]
       ).then(function(result){
           console.log(result[0]._id);
           mostActive.defender_king=result[0]._id;
            cb(null,result[0]._id);
        });
      },
      function(cb){
        Battle.aggregate( [
            { $group:
              {
                 _id:"$region",
                count: {$sum: 1}
              }
            },
            { "$sort": { "count": -1 } },
            { "$limit": 1 }
           ]
        ).then(function(result){
            console.log(result[0]._id);
            mostActive.region =result[0]._id;
             cb(null);
         });
       }
  ],function(err){
       if(!err) {
        //  console.log(results);
        cb(null,mostActive);
      }
      else {
        cb(err);
      }
  });

}

 var defenderSize  =  function(cb){
   Battle.aggregate(
      [
        {
          $group:
            {
              _id: null,
              max: { $max: "$defender_size" },
              min: { $min: "$defender_size" },
   	    average: { $avg: "$defender_size" },
            }
        }
      ]
   ).then(function(result){
        let defSize = {min:0,max:0,average:0.0};
        if(result.length>0){
         defSize = {min:result[0].min,max:result[0].max,average:result[0].average};
         cb(null,defSize);
        }

   }).catch(function(err){
      console.log("error in defenderSize",err);
      cb(err);
   });

 }
var attackerOutcome = function(cb){
Battle.aggregate(
   [
     {
       $group:
         {
          _id:"$attacker_outcome",
          count: {$sum: 1}
         }
     }
   ]
 ).then(function(result){
      let attackerOutcome = {win:0,loss:0};
     if(result.length>0){
      result.forEach(function(obj){
        if(obj['_id']=='win'){
          attackerOutcome['win'] =obj.count;
        }
        else if(obj['_id']=='loss'){
          attackerOutcome['loss']=obj.count;
        }
      });
      cb(null,attackerOutcome);
     }
 }).catch(function(err){

 })

 }

 var distinctBattle =  function(cb) {

   Battle.distinct('battle_type').then(
      function (result) {
         cb(null,result);
        })
       .catch(
        function(err){
         console.log("distinct battle error ",err);
         cb(err);
        }
      )


 }
controller.getAllBattles = function(req,res){
Battle.find().then(function(battles){
  console.log("battles",battles);
   res.status(200).json({battles:battles});
}).catch(function(err){
   res.status(400).json({ error: 'something went wrong'});
})
};

controller.list = function(req,res){

 const query = Battle.find(); // `query` is an instance of `Query`
 query.select('name')
 query.where('location').ne(null)
 .exec().then(function(result){
    res.status(200).json({names:result});
 }).catch(function(err){
   console.log("error while fetching list",err);
    res.status(400).json({ error: 'something went wrong'});
 });
};

controller.count = function(req,res){

   Battle.find({}).count().then(function(count){
     res.status(200).json({count:count});
   }).catch(function(err){
     console.log("error while counting record",err);
     res.status(400).json({ error: 'something went wrong'});
   })

};

 controller.stats = function(req,res){
    async.parallel([function(cb){
     getmostActive(cb);

   },function(cb){
     defenderSize(cb);
   },function(cb){
      distinctBattle(cb);
   },function(cb){
     attackerOutcome(cb);
    }
    ],function(err,output){
      if(err){
        console.log("final error at stats",err);
        res.status(400).json({ error: 'something went wrong'});
      }
      else {
        let stats = {most_active:output[0],
                    attacker_outcome:output[3],
                    battle_type:output[2],
                    defender_size:output[1]
                  }
          res.status(200).json(stats);
      }
  });
 };
 controller.search = function(req,res){
    let len=0;
   for(let key in req.query){
       len++;
    }
    if(len>1){
       Battle.find({$and:[{attacker_king:req.query.king||""},{location:req.query.location||""},{battle_type:req.query.type||""}
       ]})
      .then(function(result){
       res.status(200).json(result);
      }).catch(function(err){
       console.log("search error");
       res.status(400).json({error:"something went wrong"});
      });
    }else {
      console.log(len==1);
      Battle.find().or([{attacker_king:req.query.king},{ defender_king:req.query.king}])
     .then(function(result){
       res.status(200).json(result);
     }).catch(function(err){
       console.log("search error");
       res.status(400).json({error:"something went wrong"});
     });
    }
 }
 exports = module.exports = controller;
