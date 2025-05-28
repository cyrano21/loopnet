import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Property, { IProperty } from "@/models/Property";
import mongoose from "mongoose";

// Type for lean property document
type LeanProperty = IProperty & { _id: mongoose.Types.ObjectId };

// Builder Pattern for Property Lookup
class PropertyLookupBuilder {
  private query: any = {};
  private populateFields: string = "";
  private shouldIncrementViews: boolean = false;

  constructor(private identifier: string) {}

  buildQuery() {
    // Check if identifier is a valid ObjectId
    if (mongoose.Types.ObjectId.isValid(this.identifier)) {
      this.query = { _id: this.identifier };
    } else {
      // Assume it's a slug
      this.query = { slug: this.identifier };
    }
    return this;
  }

  withPopulate(fields: string) {
    this.populateFields = fields;
    return this;
  }

  withViewIncrement() {
    this.shouldIncrementViews = true;
    return this;
  }

  async execute(): Promise<LeanProperty | null> {
    let propertyQuery = Property.findOne(this.query);

    if (this.populateFields) {
      propertyQuery = propertyQuery.populate("owner", this.populateFields);
    }

    const property = (await propertyQuery.lean()) as LeanProperty | null;

    if (!property) {
      return null;
    }

    // Increment view count if requested
    if (this.shouldIncrementViews) {
      await Property.findByIdAndUpdate(property._id, { $inc: { views: 1 } });
    }

    return property;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    // Use Builder Pattern for flexible property lookup
    const property = await new PropertyLookupBuilder(id)
      .buildQuery()
      .withPopulate("name email company role avatar")
      .withViewIncrement()
      .execute();

    if (!property) {
      return NextResponse.json(
        { success: false, error: "Property not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: property,
    });
  } catch (error) {
    console.error("Property Detail API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch property" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await request.json();

    // First, find the property to get its actual ObjectId
    const existingProperty = await new PropertyLookupBuilder(id)
      .buildQuery()
      .execute();

    if (!existingProperty) {
      return NextResponse.json(
        { success: false, error: "Property not found" },
        { status: 404 }
      );
    }

    // TODO: Add authentication check - user should own this property or be admin

    // Update property using the actual ObjectId
    const updatedProperty = await Property.findByIdAndUpdate(
      existingProperty._id,
      { ...body, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate("owner", "name email company role");

    return NextResponse.json({
      success: true,
      data: updatedProperty,
      message: "Property updated successfully",
    });
  } catch (error) {
    console.error("Property Update API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update property" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    // First, find the property to get its actual ObjectId
    const existingProperty = await new PropertyLookupBuilder(id)
      .buildQuery()
      .execute();

    if (!existingProperty) {
      return NextResponse.json(
        { success: false, error: "Property not found" },
        { status: 404 }
      );
    }

    // TODO: Add authentication check - user should own this property or be admin

    // Delete property using the actual ObjectId
    const deletedProperty = await Property.findByIdAndDelete(
      existingProperty._id
    );

    // TODO: Delete images from Cloudinary
    // for (const image of deletedProperty.images) {
    //   await deleteFromCloudinary(image.publicId)
    // }

    return NextResponse.json({
      success: true,
      message: "Property deleted successfully",
    });
  } catch (error) {
    console.error("Property Delete API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete property" },
      { status: 500 }
    );
  }
}
