'use client'
import { useState } from "react";
//import { signOut } from "next-auth/react";
import { useEffect } from "react";
import RevenueChart from "@/components/dashboard/RevenueChart";

const Dashboard=()=>{

    const [dashboard, setDashboard] = useState<any>(null);
    const url = process.env.NEXT_PUBLIC_API_URL;

    const [user,setUser]=useState<any>(null)

    const [period, setPeriod] = useState("6_months");

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPeriod(e.target.value);
    };

    const formatRelativeDate = (dateString: string) => {
        const date = new Date(dateString);

        const today = new Date();
        const yesterday = new Date();

        yesterday.setDate(today.getDate() - 1);

        const isToday =
            date.toDateString() === today.toDateString();

        const isYesterday =
            date.toDateString() === yesterday.toDateString();

        if (isToday) return "Aujourd'hui";
        if (isYesterday) return "Hier";

        return date.toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    const getInvoiceStatusClass = (status: string) => {
    switch (status) {
        case "PAID":
        return "bg-green-100 text-green-700";

        case "PENDING":
        return "bg-yellow-100 text-yellow-700";

        case "OVERDUE":
        return "bg-red-100 text-red-700";

        case "CANCELLED":
        return "bg-gray-100 text-gray-700";

        default:
        return "bg-blue-100 text-blue-700";
    }
    };

    const getInvoiceStatusLabel = (status: string) => {
    switch (status) {
        case "PAID":
        return "Payée";

        case "PENDING":
        return "En attente";

        case "OVERDUE":
        return "En retard";

        case "CANCELLED":
        return "Annulée";

        default:
        return status;
    }
    };

    const getInvoiceIcon = (status: string) => {
    switch (status) {
        case "PAID":
        return "check_circle";

        case "PENDING":
        return "schedule";

        case "OVERDUE":
        return "warning";

        case "CANCELLED":
        return "cancel";

        default:
        return "receipt";
    }
    };

    useEffect(() => {
        const fetchDashboard = async (userId: string, period: string) => {
            const token = localStorage.getItem("token");

            const res = await fetch(
                `${url}/dashboard/${userId}?period=${period}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            setDashboard(data);
        };
        if(user){
            fetchDashboard(user.id,period);
        }
    }, [user,period]);

    useEffect(() => {
        const userString = localStorage.getItem("user");

        if(userString){
            setUser(JSON.parse(userString));
        }
    },[]);

    useEffect(() => {
        // ici tu peux appeler ton API ou filtrer tes données
        console.log("Période sélectionnée :", period);

        // exemple :
        // fetch(`/api/data?period=${period}`)
    }, [period]);

return(
<>
<div className="mb-xl">
<h2 className="font-h1 text-h1 text-on-surface">Tableau de bord</h2>
<p className="font-body-md text-body-md text-secondary">Bienvenue, voici l'état de vos finances pour ce mois-ci.</p>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-lg mb-xl">
<div className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl flex flex-col gap-sm shadow-sm hover:shadow-md transition-shadow">
<div className="flex justify-between items-center">
<span className="material-symbols-outlined text-primary bg-primary-fixed p-sm rounded-lg" data-icon="payments">payments</span>
</div>
<div>
<p className="font-label-sm text-secondary uppercase tracking-wider">Revenu Total</p>
<h3 className="font-h1 text-h1">{dashboard?.totalRevenue?.toLocaleString()} €</h3>
</div>
</div>
<div className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl flex flex-col gap-sm shadow-sm hover:shadow-md transition-shadow">
<div className="flex justify-between items-center">
<span className="material-symbols-outlined text-on-tertiary-container bg-tertiary-fixed p-sm rounded-lg" data-icon="receipt">receipt</span>
</div>
<div>
<p className="font-label-sm text-secondary uppercase tracking-wider">Factures Payées</p>
<h3 className="font-h1 text-h1">{dashboard?.invoices?.length || 0}</h3>
</div>

</div>
<div className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl flex flex-col gap-sm shadow-sm hover:shadow-md transition-shadow">
<div className="flex justify-between items-center">
<span className="material-symbols-outlined text-secondary bg-secondary-fixed p-sm rounded-lg" data-icon="hourglass_empty">hourglass_empty</span>
<span className="text-secondary font-bold font-label-sm">{dashboard?.pendingQuotesCount || 0} En attente</span>
</div>
<div>
<p className="font-label-sm text-secondary uppercase tracking-wider">Devis en cours</p>
<h3 className="font-h1 text-h1"> {dashboard?.pendingQuotesTotal?.toLocaleString()} €</h3>
</div>
</div>



<div className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl flex flex-col gap-sm shadow-sm hover:shadow-md transition-shadow">
<div className="flex justify-between items-center">
    <span className="material-symbols-outlined text-blue-600 bg-blue-100 p-sm rounded-lg">
      group
    </span>
</div>
<div>
<p className="font-label-sm text-secondary uppercase tracking-wider">
      Clients
</p>

<h3 className="font-h1 text-h1">
    {dashboard?.clients || 0} 
</h3>
</div>
</div>

</div>
<div className="grid grid-cols-1 lg:grid-cols-3 gap-lg h-auto">
<div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant rounded-xl p-lg flex flex-col">
<div className="flex justify-between items-center mb-xl">
<div>
<h4 className="font-h2 text-h2 text-on-surface">Aperçu du Revenu</h4>
<p className="font-body-sm text-secondary">Évolution de la facturation sur les 6 derniers mois</p>
</div>
<select
      value={period}
      onChange={handleChange}
      className="bg-surface border border-outline-variant rounded-lg px-md py-xs font-body-sm focus:ring-primary"
    >
      <option value="6_months">6 derniers mois</option>
      <option value="this_year">Cette année</option>
</select>
</div>


<div className="mt-6 h-[320px]">
  {dashboard?.revenueChart && (
    <RevenueChart
      data={dashboard.revenueChart}
    />
  )}
</div>

</div>
<div className="lg:col-span-1 bg-surface-container-lowest border border-outline-variant rounded-xl p-lg flex flex-col">
<div className="flex justify-between items-center mb-lg">
<h4 className="font-h2 text-h2 text-on-surface">Activité Récente</h4>
<button className="text-primary font-label-sm hover:underline">Voir tout</button>
</div>
<div className="space-y-lg">
{dashboard?.recentInvoices?.map((inv: any) => (
    <div className="flex gap-md" key={inv.id}>
    <div className="w-10 h-10 rounded-full bg-tertiary-fixed flex items-center justify-center flex-shrink-0">
    <span className="material-symbols-outlined text-tertiary-container" data-icon={getInvoiceIcon(inv.status)}>
    {getInvoiceIcon(inv.status)}
    </span>
    </div>
    <div className="flex-1 border-b border-outline-variant pb-md">
    <div className="flex justify-between items-start">
    <p className="font-body-md text-on-surface font-bold">{inv.invoiceNumber}</p>
    <span className="font-label-sm text-secondary">
    {formatRelativeDate(inv.createdAt)}
    </span>
    </div>
    <p className="font-body-sm text-secondary">Client: {inv.client.name} - <span className="text-on-surface font-medium">{inv.total} €</span></p>
    <span
    className={`inline-block mt-xs px-sm py-[2px] rounded-full text-[10px] font-bold uppercase ${getInvoiceStatusClass(inv.status)}`}
    >
    {getInvoiceStatusLabel(inv.status)}
    </span>
    </div>
    </div>
))}

</div>
</div>
</div>
</>
)
}
export default  Dashboard