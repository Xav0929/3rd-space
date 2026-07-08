// lib/models/ShiftReport.ts
import mongoose from "mongoose";

const ShiftReportSchema = new mongoose.Schema({}, { strict: false });
export const ShiftReport =
  mongoose.models.ShiftReport ||
  mongoose.model("ShiftReport", ShiftReportSchema);
