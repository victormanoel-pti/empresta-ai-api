import fs from "fs";

const filePath = `/src/databases/groups.json`;

const crudGroups = {
    addGroup(data, id = ""){
        let fileData = JSON.parse(fs.readFileSync(`${process.cwd()}${filePath}`));

        
            for(let i =0; i < fileData.groups.length; i++){
                if(fileData.groups[i].id === data.id){
                    fileData.groups[i] = data;
                }
            }
        
        fileData.groups.push(data);
        fs.writeFileSync(`${process.cwd()}${filePath}`, JSON.stringify(fileData, null, 2));
    },

    findGroupsByUserId(userId){
        let fileData = JSON.parse(fs.readFileSync(`${process.cwd()}${filePath}`));

        if(fileData.groups.length === undefined || fileData.groups.length === "undefined"){
            return false;
        }

        for (let i = 0; i < fileData.groups.length; i++) {
            if(fileData.groups[i].userId === userId){
                return fileData.groups[i];
            }else{
                return -1;
            }
        }        
    },

    deleteGroupById(groupId, userId){
        let fileData = JSON.parse(fs.readFileSync(`${process.cwd()}${filePath}`));
        const {groups} = fileData;
        for(let i = 0; i < groups.length; i++) {
            if(groups[i].userId === userId && groups[i].id === groupId) {
                groups.splice(i, 1);
                fileData.groups = groups;
                fs.writeFileSync(`${process.cwd()}${filePath}`, JSON.stringify(fileData, null, 2));
                return true;
            }
        }
        return false;
    }
}

export default crudGroups;