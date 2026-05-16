import { useEffect, useState, useCallback } from 'react';
import { Layout } from '../components/layout/Layout';
import { leadsApi } from '../api/leads.api';
import type { Lead, LeadFilters } from '../types';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { LeadForm } from '../components/leads/LeadForm';
import { useAuth } from '../context/AuthContext';
import { useDebounce } from '../hooks/useDebounce';
import { Search, Plus, Filter, Download, Trash2, Edit2 } from 'lucide-react';

export const LeadsPage: React.FC = () => {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [filters, setFilters] = useState<LeadFilters>({
    status: '',
    source: '',
    search: '',
    sortBy: 'latest',
    page: 1,
    limit: 10,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const debouncedSearch = useDebounce(filters.search, 500);

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      const res = await leadsApi.getLeads({ ...filters, search: debouncedSearch });
      setLeads(res.data);
      if (res.pagination) {
        setPagination(res.pagination);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [filters.status, filters.source, filters.sortBy, filters.page, debouncedSearch]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleFilterChange = (key: keyof LeadFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: key === 'page' ? value : 1,
    }));
  };

  const handleCreateLead = async (data: any) => {
    try {
      setFormLoading(true);
      await leadsApi.createLead(data);
      setIsModalOpen(false);
      fetchLeads();
    } catch (error) {
      console.error(error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateLead = async (data: any) => {
    if (!editingLead) return;
    try {
      setFormLoading(true);
      await leadsApi.updateLead(editingLead._id, data);
      setIsModalOpen(false);
      setEditingLead(null);
      fetchLeads();
    } catch (error) {
      console.error(error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteLead = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    try {
      await leadsApi.deleteLead(id);
      fetchLeads();
    } catch (error) {
      console.error(error);
    }
  };

  const handleExportCSV = async () => {
    try {
      const blob = await leadsApi.exportCSV({ ...filters, search: debouncedSearch });
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'leads_export.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout title="Leads Management">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search by name or email..."
              className="pl-10"
              value={filters.search}
              onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value, page: 1 }))}
            />
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={handleExportCSV}>
              <Download className="mr-2 h-4 w-4" /> Export CSV
            </Button>
            <Button onClick={() => { setEditingLead(null); setIsModalOpen(true); }}>
              <Plus className="mr-2 h-4 w-4" /> Add Lead
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 rounded-xl bg-white p-4 shadow-sm dark:bg-slate-900">
          <div className="flex items-center text-sm font-medium text-slate-500">
            <Filter className="mr-2 h-4 w-4" /> Filters:
          </div>
          <Select
            className="w-40"
            options={[
              { label: 'All Statuses', value: '' },
              { label: 'New', value: 'New' },
              { label: 'Contacted', value: 'Contacted' },
              { label: 'Qualified', value: 'Qualified' },
              { label: 'Lost', value: 'Lost' },
            ]}
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          />
          <Select
            className="w-40"
            options={[
              { label: 'All Sources', value: '' },
              { label: 'Website', value: 'Website' },
              { label: 'Instagram', value: 'Instagram' },
              { label: 'Referral', value: 'Referral' },
            ]}
            value={filters.source}
            onChange={(e) => handleFilterChange('source', e.target.value)}
          />
          <Select
            className="w-40"
            options={[
              { label: 'Latest First', value: 'latest' },
              { label: 'Oldest First', value: 'oldest' },
            ]}
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
          />
        </div>

        <div className="overflow-hidden rounded-xl bg-white shadow-sm dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-100 bg-slate-50/50 text-slate-500 dark:border-slate-800 dark:bg-slate-800/50">
                <tr>
                  <th className="px-6 py-4 font-semibold">Name</th>
                  <th className="px-6 py-4 font-semibold">Email</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Source</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {loading ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={6} className="px-6 py-4">
                        <div className="h-4 w-full animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
                      </td>
                    </tr>
                  ))
                ) : leads.length > 0 ? (
                  leads.map((lead) => (
                    <tr key={lead._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">{lead.name}</td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{lead.email}</td>
                      <td className="px-6 py-4">
                        <Badge variant={
                          lead.status === 'Qualified' ? 'success' : 
                          lead.status === 'Lost' ? 'error' : 
                          lead.status === 'New' ? 'info' : 'warning'
                        }>
                          {lead.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="default">{lead.source}</Badge>
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => { setEditingLead(lead); setIsModalOpen(true); }}
                            className="rounded-md p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            <Edit2 size={16} />
                          </button>
                          {user?.role === 'admin' && (
                            <button
                              onClick={() => handleDeleteLead(lead._id)}
                              className="rounded-md p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                      No leads found match your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 dark:border-slate-800">
            <p className="text-sm text-slate-500">
              Showing <span className="font-medium">{(filters.page! - 1) * 10 + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(filters.page! * 10, pagination.total)}
              </span>{' '}
              of <span className="font-medium">{pagination.total}</span> results
            </p>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                disabled={filters.page === 1}
                onClick={() => handleFilterChange('page', filters.page! - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={filters.page === pagination.totalPages}
                onClick={() => handleFilterChange('page', filters.page! + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingLead(null); }}
        title={editingLead ? 'Edit Lead' : 'Add New Lead'}
      >
        <LeadForm
          initialData={editingLead || undefined}
          onSubmit={editingLead ? handleUpdateLead : handleCreateLead}
          isLoading={formLoading}
        />
      </Modal>
    </Layout>
  );
};
