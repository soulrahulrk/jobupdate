import { notFound } from "next/navigation";
import { getJobForEdit, companyOptions } from "@/features/admin/queries";
import { JobForm } from "@/components/admin/job-form";

export default async function EditJobPage({ params }: { params: { id: string } }) {
  const [job, companies] = await Promise.all([getJobForEdit(params.id), companyOptions()]);
  if (!job) notFound();
  return (
    <div>
      <h1 className="mb-5 text-2xl font-bold">Edit job</h1>
      <JobForm companies={companies} job={job} />
    </div>
  );
}
