import mongoose from "mongoose";
import { v4 as uuid } from "uuid";


export type IConsentRecord = {
  _id: string;
  categories: string[];
  createdAt: Date;
  updatedAt: Date;
};

export type IConsentRecordModel = mongoose.Model<IConsentRecord>;

const consentRecordSchema = new mongoose.Schema<IConsentRecord, IConsentRecordModel>({
  _id: {
    type: String,
    default: uuid,
  },
  categories: [{
    type: String,
    required: true,
  }],
}, {
  timestamps: true,
  strict: true,
  strictQuery: true,
});


const ConsentRecord = (mongoose.models?.ConsentRecord as IConsentRecordModel) || mongoose.model("ConsentRecord", consentRecordSchema);

export default ConsentRecord;