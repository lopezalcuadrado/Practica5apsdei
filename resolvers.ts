import { MongoClient, Bson } from "https://deno.land/x/mongo@v0.32.0/mod.ts";

  
  const connect = async () => {
    const client = new MongoClient();
  
    try {
      await client.connect({
        db: "discotek",
        tls: true,
        servers: [
          {
            host: "ac-ufedh1f-shard-00-02.kgslutw.mongodb.net",
            port: 27017,
          },
        ],
        credential: {
          username: "Lopezalcuadrado",
          password: "EAZHz1NiTOeHn8Jz",
          db: "discotek",
          mechanism: "SCRAM-SHA-1",
        },
      });
  
      return client;
    } catch (error) {
      console.error("Error during database connection:", error);
      throw error; 
    }
  };
  
  
    // Defining schema interface
    interface UserSchema {
        _id: Bson.ObjectID;
        name: string;
        mail: string;
        collection?: ComicCollectionSchema;
      }

      interface ComicSchema {
        _id: Bson.ObjectID;
        title: string;
        description: string;
        formato: string;
      }
      
      interface ComicCollectionSchema {
        _id: Bson.ObjectID;
        name: string;
        comics: Bson.ObjectID[];
      }

      const userWithCollection = async (args: any) => {
        const client = await connect();
      
        try {
          const db = client.database("test");
          const users = db.collection<UserSchema>("users");
          const collections = db.collection<ComicCollectionSchema>("collections");
      
          const user = await users.findOne({ _id: new Bson.ObjectID(args.id) });
      
          if (!user) {
            throw new Error(`No se encontró un usuario con ID ${args.id}`);
          }
      
          const collection = user.collection;
          
          if (!collection) {
            throw new Error(`El usuario con ID ${args.id} no tiene una colección asociada`);
          }
      
          // Obtén la información completa de los cómics en la colección
          const comics = await Promise.all(collection.comics.map(async (comicId: Bson.ObjectID) => {
            return await comics.findOne({ _id: comicId });
          }));
      
          return {
            ...user,
            collection: {
              ...collection,
              comics: comics,
            },
          };
        } catch (error) {
          console.error("Error durante la consulta de usuario con colección:", error);
          throw error;
        } finally {
          await client.close();
        }
      };
      


      const createUser = async (args: any) => {
        const client = await connect();
      
        try {
          const db = client.database("test");
          const users = db.collection<UserSchema>("users");
      
          const insertResult = await users.insertOne({
            name: args.username,
            mail: args.mail,
          });
      
          const insertId = insertResult.insertedId;
      
          return users.findOne({ _id: insertId }, { noCursorTimeout: false });
        } catch (error) {
          console.error("Error during user insertion:", error);
          throw error;
        } finally {
          await client.close();
        }
      };

      const updateUser = async (args: any) => {
  const client = await connect();

  try {
    const db = client.database("test");
    const users = db.collection<UserSchema>("users");

    const { id, name, mail } = args;

    const updateResult = await users.updateOne(
      { _id: new Bson.ObjectID(id) },
      { $set: { name, mail } }
    );

    if (updateResult.matchedCount === 1) {
      // Si se actualizó correctamente, devuelve el usuario actualizado
      return users.findOne({ _id: new Bson.ObjectID(id) });
    } else {
      // Si no se encontró un usuario para actualizar, puedes manejar esto de acuerdo a tus necesidades
      throw new Error(`No se encontró un usuario con ID ${id}`);
    }
  } catch (error) {
    console.error("Error during user update:", error);
    throw error;
  } finally {
    await client.close();
  }
};
    const deleteUser = async (args: any) => {
    const client = await connect();
  
    try {
      const db = client.database("test");
      const users = db.collection<UserSchema>("users");
  
      const { id } = args;
  
      const deletedUser = await users.findOneAndDelete({
        _id: new Bson.ObjectID(id),
      });
  
      if (deletedUser.value) {
        // Si se eliminó correctamente, devuelve el usuario eliminado
        return deletedUser.value;
      } else {
        // Si no se encontró un usuario para eliminar, puedes manejar esto de acuerdo a tus necesidades
        throw new Error(`No se encontró un usuario con ID ${id}`);
      }
    } catch (error) {
      console.error("Error during user deletion:", error);
      throw error;
    } finally {
      await client.close();
    }
  };
  

  const createComic = async (args: any) => {
    const client = await connect();
  
    try {
      const db = client.database("test");
      const comics = db.collection<ComicSchema>("comics");
  
      const insertResult = await comics.insertOne({
        title: args.title,
        description: args.description,
        formato: args.formato,
      });
  
      const insertId = insertResult.insertedId;
  
      return comics.findOne({ _id: insertId }, { noCursorTimeout: false });
    } catch (error) {
      console.error("Error during comic creation:", error);
      throw error;
    } finally {
      await client.close();
    }
  };
  
  const updateComic = async (args: any) => {
    const client = await connect();
  
    try {
      const db = client.database("test");
      const comics = db.collection<ComicSchema>("comics");
  
      const { id, title, description, formato } = args;
  
      const updateResult = await comics.updateOne(
        { _id: new Bson.ObjectID(id) },
        { $set: { title, description, formato } }
      );
  
      if (updateResult.matchedCount === 1) {
        return comics.findOne({ _id: new Bson.ObjectID(id) });
      } else {
        throw new Error(`No se encontró un cómic con ID ${id}`);
      }
    } catch (error) {
      console.error("Error during comic update:", error);
      throw error;
    } finally {
      await client.close();
    }
  };
  
  const deleteComic = async (args: any) => {
    const client = await connect();
  
    try {
      const db = client.database("test");
      const comics = db.collection<ComicSchema>("comics");
  
      const { id } = args;
  
      const deletedComic = await comics.findOneAndDelete({
        _id: new Bson.ObjectID(id),
      });
  
      if (deletedComic.value) {
        return deletedComic.value;
      } else {
        throw new Error(`No se encontró un cómic con ID ${id}`);
      }
    } catch (error) {
      console.error("Error during comic deletion:", error);
      throw error;
    } finally {
      await client.close();
    }
  };
  
  
const createComicCollection = async (args: any) => {
    const client = await connect();
  
    try {
      const db = client.database("test");
      const collections = db.collection<ComicCollectionSchema>("collections");
  
      const insertResult = await collections.insertOne({
        name: args.name,
        comics: [], // Puedes inicializar la lista de cómics vacía
      });
  
      const insertId = insertResult.insertedId;
  
      return collections.findOne({ _id: insertId }, { noCursorTimeout: false });
    } catch (error) {
      console.error("Error during comic collection creation:", error);
      throw error;
    } finally {
      await client.close();
    }
  };
  
  const updateComicCollection = async (args: any) => {
    const client = await connect();
  
    try {
      const db = client.database("test");
      const collections = db.collection<ComicCollectionSchema>("collections");
  
      const { id, name } = args;
  
      const updateResult = await collections.updateOne(
        { _id: new Bson.ObjectID(id) },
        { $set: { name } }
      );
  
      if (updateResult.matchedCount === 1) {
        return collections.findOne({ _id: new Bson.ObjectID(id) });
      } else {
        throw new Error(`No se encontró una colección con ID ${id}`);
      }
    } catch (error) {
      console.error("Error during comic collection update:", error);
      throw error;
    } finally {
      await client.close();
    }
  };
  const deleteComicCollection = async (args: any) => {
    const client = await connect();
  
    try {
      const db = client.database("test");
      const collections = db.collection<ComicCollectionSchema>("collections");
  
      const { id } = args;
  
      const deletedCollection = await collections.findOneAndDelete({
        _id: new Bson.ObjectID(id),
      });
  
      if (deletedCollection.value) {
        return deletedCollection.value;
      } else {
        throw new Error(`No se encontró una colección con ID ${id}`);
      }
    } catch (error) {
      console.error("Error during comic collection deletion:", error);
      throw error;
    } finally {
      await client.close();
    }
  };
  
  const addComicToCollection = async (args: any) => {
    const client = await connect();
  
    try {
      const db = client.database("test");
      const collections = db.collection<ComicCollectionSchema>("collections");
  
      const { collectionId, comicId } = args;
  
      // Asegúrate de convertir los IDs a ObjectID si es necesario
      const collectionObjectId = new Bson.ObjectID(collectionId);
      const comicObjectId = new Bson.ObjectID(comicId);
  
      // Actualiza la colección agregando el cómic
      await collections.updateOne(
        { _id: collectionObjectId },
        { $addToSet: { comics: comicObjectId } }
      );
  
      // Devuelve la colección actualizada
      return collections.findOne({ _id: collectionObjectId });
    } catch (error) {
      console.error("Error during adding comic to collection:", error);
      throw error;
    } finally {
      await client.close();
    }
  };
  
  const removeComicFromCollection = async (args: any) => {
    const client = await connect();
  
    try {
      const db = client.database("test");
      const collections = db.collection<ComicCollectionSchema>("collections");
  
      const { collectionId, comicId } = args;
  
      // Asegúrate de convertir los IDs a ObjectID si es necesario
      const collectionObjectId = new Bson.ObjectID(collectionId);
      const comicObjectId = new Bson.ObjectID(comicId);
  
      // Actualiza la colección eliminando el cómic
      await collections.updateOne(
        { _id: collectionObjectId },
        { $pull: { comics: comicObjectId } }
      );
  
      // Devuelve la colección actualizada
      return collections.findOne({ _id: collectionObjectId });
    } catch (error) {
      console.error("Error during removing comic from collection:", error);
      throw error;
    } finally {
      await client.close();
    }
  };

  const getUsuarios = async () => {
    const client = await connect();
  
    try {
      const db = client.database("test");
      const users = db.collection<UserSchema>("users");
      return await users.find().toArray();
    } catch (error) {
      console.error("Error durante la consulta de usuarios:", error);
      throw error;
    } finally {
      await client.close();
    }
  };
  
  const getUsuario = async (args: any) => {
    const client = await connect();
  
    try {
      const db = client.database("test");
      const users = db.collection<UserSchema>("users");
      return await users.findOne({ _id: new Bson.ObjectID(args.id) });
    } catch (error) {
      console.error("Error durante la consulta de usuario:", error);
      throw error;
    } finally {
      await client.close();
    }
  };
  
  const getComics = async () => {
    const client = await connect();
  
    try {
      const db = client.database("test");
      const comics = db.collection<ComicSchema>("comics");
      return await comics.find().toArray();
    } catch (error) {
      console.error("Error durante la consulta de cómics:", error);
      throw error;
    } finally {
      await client.close();
    }
  };
  
  const getComic = async (args: any) => {
    const client = await connect();
  
    try {
      const db = client.database("test");
      const comics = db.collection<ComicSchema>("comics");
      return await comics.findOne({ _id: new Bson.ObjectID(args.id) });
    } catch (error) {
      console.error("Error durante la consulta de cómic:", error);
      throw error;
    } finally {
      await client.close();
    }
  };
  
  const getColecciones = async () => {
    const client = await connect();
  
    try {
      const db = client.database("test");
      const collections = db.collection<ComicCollectionSchema>("collections");
      return await collections.find().toArray();
    } catch (error) {
      console.error("Error durante la consulta de colecciones:", error);
      throw error;
    } finally {
      await client.close();
    }
  };
  
  const getColeccion = async (args: any) => {
    const client = await connect();
  
    try {
      const db = client.database("test");
      const collections = db.collection<ComicCollectionSchema>("collections");
      return await collections.findOne({ _id: new Bson.ObjectID(args.id) });
    } catch (error) {
      console.error("Error durante la consulta de colección:", error);
      throw error;
    } finally {
      await client.close();
    }
  };
      
      const resolvers = {
       
      Query: {
              users: () => getUsuarios(),
              user: (_: any, args: any) => getUsuario(args),
              comics: () => getComics(),
              comic: (_: any, args: any) => getComic(args),
              colecciones: () => getColecciones(),
              coleccion: (_: any, args: any) => getColeccion(args),
              userWithCollection: (_: any, args: any) => userWithCollection(args),
            },
        Mutation: {
          // Usuarios
          createUser: (_: any, args: any) => createUser(args),
          updateUser: (_: any, args: any) => updateUser(args),
          deleteUser: (_: any, args: any) => deleteUser(args),
      
          // Cómics
          createComic: (_: any, args: any) => createComic(args),
          updateComic: (_: any, args: any) => updateComic(args),
          deleteComic: (_: any, args: any) => deleteComic(args),
      
          // Colecciones de Cómics
          createComicCollection: (_: any, args: any) => createComicCollection(args),
          updateComicCollection: (_: any, args: any) => updateComicCollection(args),
          deleteComicCollection: (_: any, args: any) => deleteComicCollection(args),
          addComicToCollection: (_: any, args: any) => addComicToCollection(args),
          removeComicFromCollection: (_: any, args: any) => removeComicFromCollection(args),
        },
        
      };
      
      export { resolvers };