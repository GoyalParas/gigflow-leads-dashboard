import React, { useEffect, useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { leadsApi } from '../api/leads.api';
import type { Lead } from '../types';
import { Users, UserPlus, CheckCircle, XCircle, TrendingUp } from 'lucide-react';
import { Badge } from '../components/ui/Badge';

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    contacted: 0,
    qualified: 0,
    lost: 0,
  });
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await leadsApi.getLeads({ limit: 5 });
        const allLeads = await leadsApi.getLeads({ limit: 1000 }); // To calculate stats
        
        setRecentLeads(res.data);
        
        const counts = allLeads.data.reduce((acc: any, lead: Lead) => {
          acc.total++;
          acc[lead.status.toLowerCase()]++;
          return acc;
        }, { total: 0, new: 0, contacted: 0, qualified: 0, lost: 0 });
        
        setStats(counts);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statCards = [
    { label: 'Total Leads', value: stats.total, icon: Users, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/20' },
    { label: 'New Leads', value: stats.new, icon: UserPlus, color: 'text-sky-500', bg: 'bg-sky-100 dark:bg-sky-900/20' },
    { label: 'Qualified', value: stats.qualified, icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-900/20' },
    { label: 'Lost', value: stats.lost, icon: XCircle, color: 'text-rose-500', bg: 'bg-rose-100 dark:bg-rose-900/20' },
  ];

  return (
    <Layout title="Dashboard">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <div key={card.label} className="flex items-center rounded-xl bg-white p-6 shadow-sm dark:bg-slate-900">
            <div className={cn('rounded-lg p-3', card.bg)}>
              <card.icon className={cn('h-6 w-6', card.color)} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{card.label}</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Recent Leads</h3>
            <TrendingUp className="h-5 w-5 text-slate-400" />
          </div>
          <div className="space-y-4">
            {loading ? (
              Array(5).fill(0).map((_, i) => (
                <div key={i} className="h-12 w-full animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
              ))
            ) : recentLeads.length > 0 ? (
              recentLeads.map((lead) => (
                <div key={lead._id} className="flex items-center justify-between rounded-lg border border-slate-100 p-3 dark:border-slate-800">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-slate-100">{lead.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{lead.email}</p>
                  </div>
                  <Badge variant={
                    lead.status === 'Qualified' ? 'success' : 
                    lead.status === 'Lost' ? 'error' : 
                    lead.status === 'New' ? 'info' : 'warning'
                  }>
                    {lead.status}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-center text-sm text-slate-500">No leads found</p>
            )}
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-slate-900">
          <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">Lead Status Distribution</h3>
          <div className="space-y-6 py-4">
            {['New', 'Contacted', 'Qualified', 'Lost'].map((status) => {
              const count = stats[status.toLowerCase() as keyof typeof stats] || 0;
              const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
              return (
                <div key={status} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-slate-700 dark:text-slate-300">{status}</span>
                    <span className="text-slate-500">{count} ({Math.round(percentage)}%)</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800">
                    <div 
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        status === 'New' ? 'bg-sky-500' :
                        status === 'Contacted' ? 'bg-amber-500' :
                        status === 'Qualified' ? 'bg-emerald-500' : 'bg-rose-500'
                      )}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
};

import { cn } from '../components/ui/Button';
