import fs from "fs";

const filePath = `/src/databases/users.json`;

const friendService = {
    
    findFriends(userId){
        let fileData = JSON.parse(fs.readFileSync(`${process.cwd()}${filePath}`));
        const {users} = fileData;
        for(let i = 0; i < users.length; i++){
            if(users[i].id === userId){
                return users[i].amigos;
            }
            return false;
        }
    },

    deleteFriendById(friendId, userId){
        let fileData = JSON.parse(fs.readFileSync(`${process.cwd()}${filePath}`));
        const {users} = fileData;
        for(let i = 0; i < users.length; i++){
            if(users[i].id === userId){
                for(let j = 0; j < users[i].amigos.length; j++){
                    let index = users[i].amigos.findIndex(element => element.id === friendId);
                    if(index !== -1){
                        users[i].amigos.splice(index, 1)
                        let newObj = fileData.users[i].amigos;
                        fileData.users[i].amigos = newObj;
                        return fileData.users[i];
                    }else{
                        return -1;
                    }
                }
            }
            return false;
        }
    }

}

export default friendService;