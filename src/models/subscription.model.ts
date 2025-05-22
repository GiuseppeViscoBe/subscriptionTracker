import {
  prop,
  getModelForClass,
  modelOptions,
  pre,
  Ref,
} from "@typegoose/typegoose"; // Define the User class with Typegoose
import { User } from "./user.model";
@modelOptions({
  schemaOptions: {
    timestamps: true, // Automatically adds createdAt & updatedAt fields
    collection: "users", // Optional: sets the collection name
  },
})


@pre<Subscription>('save', async function () {

  //Auto-calculate renewal date if missing
  if(!this.renewalDate){
    const renewalPeriods = {
      daily : 1,
      weekly : 7,
      monthly : 30,
      yearly : 365
    }

    this.renewalDate = new Date(this.startDate)
    this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency as keyof typeof renewalPeriods])
  }

  //Auto-update the status if renewal date has passed 
  if(this.renewalDate < new Date()){
    this.status = 'expired'
  }
})


export class Subscription {
  @prop({
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100,
  })
  name!: string;

  @prop({
    required: true,
    min: 0,
  })
  price!: number;

  @prop({
    enum: ["USD", "EUR", "GBP"],
    default: "EUR",
  })
  currency!: string;

  @prop({
    enum: ["daily", "weekly", "monthly", "yearly"],
    default: "EUR",
  })
  frequency!: string;

  @prop({
    enum: ["sports", "news", "finance", "politics", "other"],
    required: true,
  })
  category!: string;

  @prop({
    trim: true,
    required: true,
  })
  paymentMethod!: string;

  @prop({
    enum: ["active", "cancelled", "expired"],
    default: "active",
  })
  status!: string;

  @prop({
    required: true,
    validate: {
      validator: (value: Date) => {
        // Check if the startDate is in the future (not in the past)
        return value >= new Date();
      },
      message: "Start date must not be in the past",
    },
  })
  startDate!: Date;

  @prop({
    required: true,
    validate: {
      validator: function (value: Date) {
        // Check if the startDate is in the future (not in the past)
        return value > this.startDate;
      },
      message: "Renewal date must not be in the past",
    },
  })
  renewalDate!: Date;

  @prop({ required: true, ref: () => User }) // Reference to the User model
  user!: Ref<User>;
}

export const SubscriptionModel = getModelForClass(Subscription);
