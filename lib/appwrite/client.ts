"use client"

import { Client, Account, Storage, Databases } from "appwrite"

let appwriteClient: Client | null = null
let appwriteAccount: Account | null = null
let appwriteStorage: Storage | null = null
let appwriteDatabases: Databases | null = null

export type AppwriteClients = {
  client: Client
  account: Account
  storage: Storage
  databases: Databases
}

export function getAppwriteClients(): AppwriteClients {
  if (!appwriteClient) {
    const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT
    const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID

    if (!endpoint || !projectId) {
      throw new Error("Missing Appwrite env: NEXT_PUBLIC_APPWRITE_ENDPOINT or NEXT_PUBLIC_APPWRITE_PROJECT_ID")
    }

    appwriteClient = new Client().setEndpoint(endpoint).setProject(projectId)
    appwriteAccount = new Account(appwriteClient)
    appwriteStorage = new Storage(appwriteClient)
    appwriteDatabases = new Databases(appwriteClient)
  }

  // Non-null assertion after initialization
  return {
    client: appwriteClient!,
    account: appwriteAccount!,
    storage: appwriteStorage!,
    databases: appwriteDatabases!,
  }
}


