import { Request, Response, NextFunction } from 'express';
import { LeadService } from '../services/lead.service';
import { AuthRequest, LeadFilters } from '../types';
import { Parser } from 'json2csv';

export const createLead = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const lead = await LeadService.createLead(req.body, req.user!._id);
    res.status(201).json({ success: true, data: lead });
  } catch (error) {
    next(error);
  }
};

export const getLeads = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters: LeadFilters = req.query;
    const { leads, pagination } = await LeadService.getLeads(filters);
    res.status(200).json({ success: true, data: leads, pagination });
  } catch (error) {
    next(error);
  }
};

export const getLeadById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const lead = await LeadService.getLeadById(req.params.id);
    res.status(200).json({ success: true, data: lead });
  } catch (error) {
    next(error);
  }
};

export const updateLead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const lead = await LeadService.updateLead(req.params.id, req.body);
    res.status(200).json({ success: true, data: lead });
  } catch (error) {
    next(error);
  }
};

export const deleteLead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await LeadService.deleteLead(req.params.id);
    res.status(200).json({ success: true, message: 'Lead deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const exportLeads = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters: LeadFilters = req.query;
    const leads = await LeadService.getAllLeadsForExport(filters);
    
    const fields = ['name', 'email', 'status', 'source', 'createdAt'];
    const opts = { fields };
    const parser = new Parser(opts);
    const csv = parser.parse(leads);

    res.header('Content-Type', 'text/csv');
    res.attachment('leads.csv');
    return res.send(csv);
  } catch (error) {
    next(error);
  }
};
