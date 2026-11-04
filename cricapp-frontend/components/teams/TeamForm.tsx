"use client";
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTeamStore } from "@/lib/store/teamStore";
import { ArrowLeft } from "lucide-react";
import Link from 'next/link';

const formSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(40, "Name cannot exceed 40 characters"),
  logoUrl: z.string().url("Must be a valid URL").optional().or(z.literal('')),
});

type FormData = z.infer<typeof formSchema>;

interface TeamFormProps {
  teamId?: number;
}

export function TeamForm({ teamId }: TeamFormProps) {
  const router = useRouter();
  const { teams, addTeam, updateTeam, isHydrated, setHydrated } = useTeamStore();

  const isEditing = !!teamId;
  const existingTeam = isEditing ? teams.find(t => t.id === teamId) : null;

  useEffect(() => {
    setHydrated();
  }, [setHydrated]);

  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      logoUrl: "",
    }
  });

  useEffect(() => {
    if (existingTeam) {
      reset({
        name: existingTeam.name,
        logoUrl: existingTeam.logoUrl || "",
      });
    }
  }, [existingTeam, reset]);

  const logoUrlValue = watch("logoUrl");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  if (!isHydrated) {
    return <div className="p-8 text-center text-slate-500 animate-pulse">Loading form...</div>;
  }

  if (isEditing && !existingTeam) {
    return (
      <div className="container max-w-xl mx-auto p-4 sm:p-6 text-center">
        <h1 className="text-2xl font-bold mt-12 mb-4">Team not found</h1>
        <Link href="/teams" className="text-blue-600 hover:underline">&larr; Back to Teams</Link>
      </div>
    );
  }

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      if (isEditing) {
        await updateTeam(teamId!, { name: data.name, logoUrl: data.logoUrl || undefined });
        router.push(`/teams/${teamId}`);
      } else {
        await addTeam({ name: data.name, logoUrl: data.logoUrl || undefined });
        router.push('/teams');
      }
    } catch (err: any) {
      console.error("Team form submission failed:", err);
      const msg = err?.response?.data?.message || err?.message || "Failed to save team. Please try again.";
      setSubmitError(msg);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-xl mx-auto p-4 sm:p-6">
      <Link href={isEditing ? `/teams/${teamId}` : "/teams"} className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-6 transition-colors">
        <ArrowLeft size={16} /> Back
      </Link>
      
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">
          {isEditing ? `Edit Team` : 'Create New Team'}
        </h1>

        {submitError && (
          <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            {submitError}
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-slate-700">Team Name</label>
            <input 
              {...register("name")}
              type="text" 
              disabled={isSubmitting}
              className={`w-full border rounded-lg p-2.5 focus:outline-none focus:ring-2 ${errors.name ? 'border-red-300 focus:ring-red-500' : 'border-slate-300 focus:ring-blue-500'} disabled:bg-slate-50 disabled:text-slate-500`} 
              placeholder="Enter team name" 
            />
            {errors.name && <p className="text-red-500 text-xs mt-1.5">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5 text-slate-700">Logo URL (Optional)</label>
            <input 
              {...register("logoUrl")}
              type="text" 
              disabled={isSubmitting}
              className={`w-full border rounded-lg p-2.5 focus:outline-none focus:ring-2 ${errors.logoUrl ? 'border-red-300 focus:ring-red-500' : 'border-slate-300 focus:ring-blue-500'} disabled:bg-slate-50 disabled:text-slate-500`} 
              placeholder="https://example.com/logo.png" 
            />
            {errors.logoUrl && <p className="text-red-500 text-xs mt-1.5">{errors.logoUrl.message}</p>}
          </div>

          {logoUrlValue && !errors.logoUrl && (
            <div className="mt-2">
              <p className="text-sm font-medium text-slate-700 mb-2">Preview:</p>
              <div className="w-16 h-16 rounded-full overflow-hidden border bg-slate-100 flex items-center justify-center">
                <img src={logoUrlValue} alt="Logo preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
              </div>
            </div>
          )}

          <div className="pt-4 border-t mt-6 flex justify-end gap-3">
            <Link 
              href={isEditing ? `/teams/${teamId}` : "/teams"} 
              className="px-4 py-2 text-sm font-medium rounded-lg border text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </Link>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 transition-colors flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                isEditing ? 'Save Changes' : 'Create Team'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
