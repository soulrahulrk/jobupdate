import { CompanyForm } from "@/components/admin/company-form";

export default function NewCompanyPage() {
  return (
    <div>
      <h1 className="mb-5 text-2xl font-bold">New company</h1>
      <CompanyForm />
    </div>
  );
}
