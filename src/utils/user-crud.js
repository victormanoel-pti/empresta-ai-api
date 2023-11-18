import fs from "fs";

const filePath = `/src/utils/users.json`;

const crud = {
    updateUsers(data, id = ""){
        let fileData = JSON.parse(fs.readFileSync(`${process.cwd()}${filePath}`));
        for(let i =0; i < fileData.users.length; i++){
            if(fileData.users[i].id === data.id){
                fileData.users[i] = data;
            }
        }
        fileData.users.push(data);
        fs.writeFileSync(`${process.cwd()}${filePath}`, JSON.stringify(fileData, null, 2));
    },

    findUserByEmail(email){
        let fileData = JSON.parse(fs.readFileSync(`${process.cwd()}${filePath}`));
        if(fileData.users.length === undefined || fileData.users.length === "undefined"){
            return {
                "found": false,
                "user": fileData.users[i]
            }
        }
        for (let i = 0; i < fileData.users.length; i++) {
            if(fileData.users[i].email === email){
                return {
                    "found": true,
                    "user": fileData.users[i]
                }
            }else{
                return -1;
            }
        }
        
    },

    findUserById(id){
        let fileData = JSON.parse(fs.readFileSync(`${process.cwd()}${filePath}`));
        if(fileData.users.length === undefined || fileData.users.length === "undefined"){
            return false;
        }
        for (let i = 0; i < fileData.users.length; i++) {
            if(fileData.users[i].id === id){
                return fileData.users[i];
            }else{
                return -1;
            }
        }
        
    },

    findLogin(email, password){
        let fileData = JSON.parse(fs.readFileSync(`${process.cwd()}${filePath}`));
        const {users} = fileData;
        for(let i = 0; i < users.length; i++){
            if(users[i].email === email && users[i].senha === password){
                return users[i];
            }
            return false;
        }
    }

}

export default crud;