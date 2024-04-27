function response(success, message){
    return((success) ? {"success" : success, data: message} : {"success" : success, "message": message});
}

export default response;