from pymongo import MongoClient

MONGO_URI = ("mongodb+srv://andrielleduarte_db_user:60j7nZazALtovhQD@projeto-upload.2jn6o30.mongodb.net/"
             "projeto_upload_db?retryWrites=true&w=majority"
             )
client = MongoClient(MONGO_URI)
db = client['projeto_upload_db']
collection = db['votantes']
