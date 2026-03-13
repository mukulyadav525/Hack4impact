"use client";

import { 
  CheckCircle2, 
  XCircle, 
  ExternalLink, 
  AlertCircle,
  Clock,
  Search
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const mockQueue = [
  { 
    id: "sub_1", 
    employee: "Rahul Sharma", 
    task: "Pothole Repair", 
    time: "45m ago", 
    confidence: 0.65, 
    risk: 0.12,
    before: "https://images.unsplash.com/photo-1599423300746-b62533397364?w=400",
    after: "https://images.unsplash.com/photo-1517649763962-0c6234977a33?w=400"
  },
  { 
    id: "sub_2", 
    employee: "Priya Singh", 
    task: "Garbage Collection", 
    time: "1h 12m ago", 
    confidence: 0.42, 
    risk: 0.45,
    before: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400",
    after: "https://images.unsplash.com/photo-1621459537572-ef9a11ce39ea?w=400"
  },
];

export default function ReviewQueuePage() {
  const [selected, setSelected] = useState<any>(null);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Review Queue</h1>
          <p className="text-gray-500 dark:text-zinc-400">Manual audit required for AI-flagged low-confidence submissions.</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search employee..." 
              className="pl-10 pr-4 py-2 rounded-xl border border-gray-100 dark:border-zinc-900 bg-white dark:bg-black focus:ring-2 focus:ring-blue-600 outline-none transition-all"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* List View */}
        <div className="lg:col-span-1 space-y-4">
          {mockQueue.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelected(item)}
              className={cn(
                "w-full text-left p-6 rounded-2xl border transition-all",
                selected?.id === item.id 
                  ? "bg-blue-50 border-blue-200 dark:bg-blue-900/10 dark:border-blue-800" 
                  : "bg-white border-gray-100 dark:bg-black dark:border-zinc-900 hover:border-blue-100"
              )}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-lg">{item.employee}</span>
                <span className="text-xs text-gray-400 font-medium">{item.time}</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-zinc-400 mb-4">{item.task}</p>
              
              <div className="flex items-center gap-4">
                <Badge label={`AI: ${(item.confidence * 100).toFixed(0)}%`} color={item.confidence > 0.6 ? "blue" : "orange"} />
                <Badge label={`Risk: ${(item.risk * 100).toFixed(0)}%`} color={item.risk < 0.2 ? "green" : "red"} />
              </div>
            </button>
          ))}
        </div>

        {/* Detailed View */}
        <div className="lg:col-span-2">
          {selected ? (
            <div className="bg-white dark:bg-black rounded-3xl border border-gray-100 dark:border-zinc-900 p-8 sticky top-8">
               <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold">Submission Details</h2>
                  <div className="flex gap-3">
                    <button className="px-6 py-2 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-all flex items-center gap-2">
                      <XCircle size={18} /> Reject
                    </button>
                    <button className="px-6 py-2 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 shadow-lg shadow-green-500/10 transition-all flex items-center gap-2">
                      <CheckCircle2 size={18} /> Approve
                    </button>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-6 mb-8">
                  <ImagePanel src={selected.before} label="Before" />
                  <ImagePanel src={selected.after} label="After" />
               </div>

               <div className="space-y-6">
                 <div className="grid grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">AI Analysis Result</h4>
                      <div className="p-4 rounded-2xl bg-gray-50 dark:bg-zinc-900 space-y-3">
                         <div className="flex justify-between text-sm">
                           <span>Verification Score</span>
                           <span className="font-bold">{(selected.confidence * 100).toFixed(0)}%</span>
                         </div>
                         <div className="flex justify-between text-sm text-red-500">
                           <span>Fraud Risk</span>
                           <span className="font-bold">{(selected.risk * 100).toFixed(0)}%</span>
                         </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Internal Comment</h4>
                      <textarea 
                        placeholder="Add a reason for your decision..."
                        className="w-full h-24 p-4 rounded-2xl border border-gray-100 dark:border-zinc-900 dark:bg-zinc-900/50 outline-none text-sm"
                      />
                    </div>
                 </div>
               </div>
            </div>
          ) : (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 bg-gray-50/50 dark:bg-zinc-900/20 rounded-3xl border border-dashed border-gray-200 dark:border-zinc-800">
              <Clock size={48} className="text-gray-300 mb-4" />
              <h3 className="text-lg font-bold text-gray-500">Select a submission to review</h3>
              <p className="text-sm text-gray-400 max-w-xs mt-2">All submissions pending manual audit will appear here alphabetically by employee name.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Badge({ label, color }: any) {
  const colors: any = {
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
    orange: "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400",
    green: "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400",
    red: "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400",
  };
  return (
    <span className={cn("px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider", colors[color])}>
      {label}
    </span>
  );
}

function ImagePanel({ src, label }: any) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</span>
        <button className="text-gray-400 hover:text-blue-600 transition-all"><ExternalLink size={14} /></button>
      </div>
      <div className="relative aspect-video rounded-2xl overflow-hidden border border-gray-100 dark:border-zinc-900">
        <img src={src} className="w-full h-full object-cover" />
      </div>
    </div>
  );
}
