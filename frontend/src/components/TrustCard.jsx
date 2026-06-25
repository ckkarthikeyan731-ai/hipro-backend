import React from 'react';

export const TrustCard = ({ icon: Icon, title, description, highlight }) => (
    <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
            <Icon className="text-blue-600" size={24} />
        </div>
        <span className="text-xs font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider">
            {highlight}
        </span>
        <h3 className="text-xl font-bold mt-4 mb-2">{title}</h3>
        <p className="text-slate-500 leading-relaxed">{description}</p>
    </div>
);