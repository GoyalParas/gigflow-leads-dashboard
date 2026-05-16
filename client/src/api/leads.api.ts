import api from './axios';
import type { Lead, ApiResponse, LeadFilters } from '../types';

export const leadsApi = {
  getLeads: async (filters: LeadFilters) => {
    const response = await api.get<ApiResponse<Lead[]>>('/leads', { params: filters });
    return response.data;
  },
  getLeadById: async (id: string) => {
    const response = await api.get<ApiResponse<Lead>>(`/leads/${id}`);
    return response.data;
  },
  createLead: async (data: any) => {
    const response = await api.post<ApiResponse<Lead>>('/leads', data);
    return response.data;
  },
  updateLead: async (id: string, data: any) => {
    const response = await api.put<ApiResponse<Lead>>(`/leads/${id}`, data);
    return response.data;
  },
  deleteLead: async (id: string) => {
    const response = await api.delete<ApiResponse<null>>(`/leads/${id}`);
    return response.data;
  },
  exportCSV: async (filters: LeadFilters) => {
    const response = await api.get('/leads/export', { 
      params: filters,
      responseType: 'blob' 
    });
    return response.data;
  },
};
