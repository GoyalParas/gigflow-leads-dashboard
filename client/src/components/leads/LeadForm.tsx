import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import type { Lead } from '../../types';

const leadSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  status: z.enum(['New', 'Contacted', 'Qualified', 'Lost']),
  source: z.enum(['Website', 'Instagram', 'Referral']),
});

type LeadFormData = z.infer<typeof leadSchema>;

interface LeadFormProps {
  initialData?: Lead;
  onSubmit: (data: LeadFormData) => Promise<void>;
  isLoading?: boolean;
}

export const LeadForm: React.FC<LeadFormProps> = ({ initialData, onSubmit, isLoading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: initialData || {
      status: 'New',
      source: 'Website',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Name"
        {...register('name')}
        error={errors.name?.message}
        placeholder="Lead Name"
      />
      <Input
        label="Email"
        type="email"
        {...register('email')}
        error={errors.email?.message}
        placeholder="lead@example.com"
      />
      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Status"
          options={[
            { label: 'New', value: 'New' },
            { label: 'Contacted', value: 'Contacted' },
            { label: 'Qualified', value: 'Qualified' },
            { label: 'Lost', value: 'Lost' },
          ]}
          {...register('status')}
          error={errors.status?.message}
        />
        <Select
          label="Source"
          options={[
            { label: 'Website', value: 'Website' },
            { label: 'Instagram', value: 'Instagram' },
            { label: 'Referral', value: 'Referral' },
          ]}
          {...register('source')}
          error={errors.source?.message}
        />
      </div>
      <div className="mt-6 flex justify-end">
        <Button type="submit" isLoading={isLoading}>
          {initialData ? 'Update Lead' : 'Create Lead'}
        </Button>
      </div>
    </form>
  );
};
