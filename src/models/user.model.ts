import { prop, getModelForClass, modelOptions, pre } from '@typegoose/typegoose';

// Define the User class with Typegoose
@modelOptions({
  schemaOptions: {
    timestamps: true, // Automatically adds createdAt & updatedAt fields
    collection: 'users', // Optional: sets the collection name
  }
})

export class User {
  @prop({
    required: true,
    trim: true,
    minlength: 2,
    maxlength : 50
  })
  name!: string;

  @prop({
    required: true,
    match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, // Regex for basic email validation
    unique: true,
  })
  email!: string;

  @prop({
    required: true,
    minlength: 6, // Example minimum password length
  })
  password!: string;

}

// Create and export the model
export const UserModel = getModelForClass(User);
