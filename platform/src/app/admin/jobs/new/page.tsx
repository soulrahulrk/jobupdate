import { companyOptions } from "@/features/admin/queries";
import { JobForm } from "@/components/admin/job-form";

export default async function NewJobPage() {
  const companies = await companyOptions();
  return (
    <div>
      <h1 className="mb-5 text-2xl font-bold">New job</h1>
      <JobForm companies={companies} />
    </div>
  );
}
