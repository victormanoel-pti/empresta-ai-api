import fs from "fs";

const filePath = `/src/utils/users.json`;

const crudFriends = {
    
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
                for(let j = 0; j < users[i].amigos.length; i++){
                    console.log(users[i].amigos);
                    users[i].amigos.filter(amigo => {
                        return amigo.id !== friendId;
                    })
                }
            }
            return false;
        }
    }

}

export default crudFriends;