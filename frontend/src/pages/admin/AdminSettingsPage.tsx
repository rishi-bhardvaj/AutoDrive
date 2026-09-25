import React from 'react';
import { BUSINESS_NAME, BUSINESS_PHONE, BUSINESS_EMAIL, BUSINESS_ADDRESS } from '../../config/business';

export const AdminSettingsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Portal & Business Settings</h1>
      <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4 max-w-xl text-xs">
        <h3 className="font-bold text-sm text-slate-900">Current Business Configuration</h3>
        <p className="text-slate-500">Edit business details in <code>src/config/business.ts</code>.</p>
        <div className="space-y-2 pt-2">
          <div><span className="text-slate-400 block">Business Name:</span> <strong>{BUSINESS_NAME}</strong></div>
          <div><span className="text-slate-400 block">Phone:</span> <strong>{BUSINESS_PHONE}</strong></div>
          <div><span className="text-slate-400 block">Email:</span> <strong>{BUSINESS_EMAIL}</strong></div>
          <div><span className="text-slate-400 block">Address:</span> <strong>{BUSINESS_ADDRESS}</strong></div>
        </div>
      </div>
    </div>
  );
};