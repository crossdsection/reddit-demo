# mongoimport --db test --collection inventory ^
#           --authenticationDatabase admin --username <user> --password <password> ^
#           --drop --file ~\downloads\inventory.crud.json --jsonArray

mongoimport --db reddit-demo --collection reactiontypes --drop --file ./threeReactions.json --jsonArray
