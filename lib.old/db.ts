import { getDb } from "./mongodb"
import type { Property, User } from "../models/Property"
import { ObjectId } from "mongodb"

export class Database {
  private static instance: Database
  private db: any

  private constructor() {}

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database()
    }
    return Database.instance
  }

  public async connect() {
    if (!this.db) {
      this.db = await getDb()
    }
    return this.db
  }

  // Properties
  public async getProperties(filters: any = {}, options: any = {}) {
    const db = await this.connect()
    const { skip = 0, limit = 10, sort = { createdAt: -1 } } = options

    const properties = await db.collection("properties").find(filters).sort(sort).skip(skip).limit(limit).toArray()

    const total = await db.collection("properties").countDocuments(filters)

    return { properties, total }
  }

  public async createProperty(property: Omit<Property, "_id" | "createdAt" | "updatedAt">) {
    const db = await this.connect()
    const now = new Date()

    const result = await db.collection("properties").insertOne({
      ...property,
      createdAt: now,
      updatedAt: now,
    })

    return result
  }

  public async getPropertyById(id: string) {
    const db = await this.connect()

    return await db.collection("properties").findOne({ _id: new ObjectId(id) })
  }

  // Users
  public async getUserByEmail(email: string) {
    const db = await this.connect()
    return await db.collection("users").findOne({ email })
  }

  public async createUser(user: Omit<User, "_id" | "createdAt" | "updatedAt">) {
    const db = await this.connect()
    const now = new Date()

    const result = await db.collection("users").insertOne({
      ...user,
      createdAt: now,
      updatedAt: now,
    })

    return result
  }

  // Favorites
  public async addFavorite(userId: string, propertyId: string) {
    const db = await this.connect()

    const result = await db.collection("favorites").insertOne({
      userId: new ObjectId(userId),
      propertyId: new ObjectId(propertyId),
      createdAt: new Date(),
    })

    return result
  }

  public async removeFavorite(userId: string, propertyId: string) {
    const db = await this.connect()

    const result = await db.collection("favorites").deleteOne({
      userId: new ObjectId(userId),
      propertyId: new ObjectId(propertyId),
    })

    return result
  }

  public async getUserFavorites(userId: string) {
    const db = await this.connect()

    return await db
      .collection("favorites")
      .find({ userId: new ObjectId(userId) })
      .toArray()
  }
}

export const db = Database.getInstance()

// Create a fake prisma object for compatibility
export const prisma = {
  property: {
    findMany: async (options: any) => {
      const database = Database.getInstance()
      const filters: any = {}

      if (options.where) {
        // Convert Prisma filters to MongoDB filters
        if (options.where.OR) {
          filters.$or = options.where.OR.map((condition: any) => {
            const mongoCondition: any = {}
            Object.keys(condition).forEach((key) => {
              if (condition[key].contains) {
                mongoCondition[key] = { $regex: condition[key].contains, $options: "i" }
              }
            })
            return mongoCondition
          })
        }
      }

      const { properties } = await database.getProperties(filters, {
        skip: options.skip || 0,
        limit: options.take || 10,
        sort: options.orderBy || { createdAt: -1 },
      })

      return properties
    },

    count: async (options: any) => {
      const database = Database.getInstance()
      const filters: any = {}

      if (options.where) {
        if (options.where.OR) {
          filters.$or = options.where.OR.map((condition: any) => {
            const mongoCondition: any = {}
            Object.keys(condition).forEach((key) => {
              if (condition[key].contains) {
                mongoCondition[key] = { $regex: condition[key].contains, $options: "i" }
              }
            })
            return mongoCondition
          })
        }
      }

      const { total } = await database.getProperties(filters)
      return total
    },

    create: async (options: any) => {
      const database = Database.getInstance()
      return await database.createProperty(options.data)
    },
  },
}
