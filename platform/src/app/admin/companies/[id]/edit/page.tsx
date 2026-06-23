import { notFound } from "next/navigation";
import { getCompanyForEdit } from "@/features/admin/queries";
import { CompanyForm } from "@/components/admin/company-form";

export default async function EditCompanyPage({ params }: { params: { id: string } }) {
  const company = await getCompanyForEdit(params.id);
  if (!company) notFound();
  return (
    <div>
      <h1 className="mb-5 text-2xl font-bold">Edit company</h1>
      <CompanyForm company={company} />
    </div>
  );
}
