import { Lead, ILead } from '../models/Lead';
import { LeadFilters } from '../types';
import { AppError } from '../utils/AppError';
import mongoose from 'mongoose';

export class LeadService {
  static async createLead(data: Partial<ILead>, userId: string) {
    return await Lead.create({ ...data, createdBy: userId });
  }

  static async getLeads(filters: LeadFilters) {
    const { status, source, search, sortBy, page = '1', limit = '10' } = filters;
    
    const query: any = {};
    
    if (status) query.status = status;
    if (source) query.source = source;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    let sort: any = { createdAt: -1 };
    if (sortBy === 'oldest') sort = { createdAt: 1 };
    else if (sortBy === 'latest') sort = { createdAt: -1 };

    const leads = await Lead.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .populate('createdBy', 'name email');

    const total = await Lead.countDocuments(query);

    return {
      leads,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    };
  }

  static async getLeadById(id: string) {
    const lead = await Lead.findById(id).populate('createdBy', 'name email');
    if (!lead) throw new AppError('Lead not found', 404);
    return lead;
  }

  static async updateLead(id: string, data: Partial<ILead>) {
    const lead = await Lead.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!lead) throw new AppError('Lead not found', 404);
    return lead;
  }

  static async deleteLead(id: string) {
    const lead = await Lead.findByIdAndDelete(id);
    if (!lead) throw new AppError('Lead not found', 404);
    return lead;
  }

  static async getAllLeadsForExport(filters: LeadFilters) {
    const { status, source, search } = filters;
    const query: any = {};
    
    if (status) query.status = status;
    if (source) query.source = source;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    return await Lead.find(query).sort({ createdAt: -1 });
  }
}
