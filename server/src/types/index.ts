import { Request } from 'express';
import { IUser } from '../models/User';

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AuthRequest extends Request {
  user?: IUser;
}

export type LeadFilters = {
  status?: string;
  source?: string;
  search?: string;
  sortBy?: string;
  page?: string;
  limit?: string;
};
