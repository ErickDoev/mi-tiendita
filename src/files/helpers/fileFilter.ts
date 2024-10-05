export const fileFilter = (request: Express.Request, file: Express.Multer.File, callback: Function) => {
    
    if(!file ) return callback(new Error('File is empty'), false);

    const fileExtension = file.mimetype.split('/')[1];
    const validExtension = ['jpg','jpeg','png','gif'];
    if(validExtension.includes(fileExtension)) {
        return callback(null, true);
    }
    callback(null, false);
}

export const filesFilter = (request: Express.Request, files: Express.Multer.File[], callback: Function) => {

    if(!files ) return callback(new Error('File is empty'), false);

    files.forEach((file) => {
        const fileExtension = file.mimetype.split('/')[1];
        const validExtension = ['jpg','jpeg','png','gif'];
        if(validExtension.includes(fileExtension)) {
            return callback(null, true);
        }
        callback(null, false);
    });
    callback(null, true);
}