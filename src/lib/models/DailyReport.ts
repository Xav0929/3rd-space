// lib/models/DailyReport.ts
import mongoose from "mongoose";

const DailyReportSchema = new mongoose.Schema({}, { strict: false });
export const DailyReport =
  mongoose.models.DailyReport ||
  mongoose.model("DailyReport", DailyReportSchema);
