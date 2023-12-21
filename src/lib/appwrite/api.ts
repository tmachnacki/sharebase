import { ID, Query } from "appwrite";
import type { INewUser } from "@/types";
import { account, appwriteconfig, avatars, databases } from "./config";

export async function createUserAccount(user: INewUser) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    );

    if(!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(user.name);
    
    const newUser = await saveUserToDB({
      accountId: newAccount.$id,
      name: newAccount.name,
      email: newAccount.email,
      username: user.username,
      iamgeUrl: avatarUrl
    })

    return newUser;
  } 
  catch (error) {
    console.error(error);
    return error;
  }
}

export async function saveUserToDB(user: {
  accountId: string;
  email: string;
  name: string;
  iamgeUrl: URL;
  username?: string;
}) {
  
  try {
    const newUser = await databases.createDocument(
      appwriteconfig.databaseId,
      appwriteconfig.usersCollectionId,
      ID.unique(),
      user,
    );

    return newUser;
  }
  catch (error) {
    console.error(error);
  }
}

export async function login(user: {email: string; password: string}) {
  try {
    const session = await account.createEmailSession(user.email, user.password);
    return session;
  } catch (error) {
    console.error(error);
  }
}

export async function getCurrentUser() {
  try {
    const currentAccount = await account.get();

    if(!currentAccount) {
      throw Error;
    }

    const currentUser = await databases.listDocuments(
      appwriteconfig.databaseId,
      appwriteconfig.usersCollectionId,
      [Query.equal('accountId', currentAccount.$id)]
    )

    if(!currentUser) {
      throw Error;
    }

    return currentUser.documents[0];

  } catch (error) {
    console.error(error); 
  }
}