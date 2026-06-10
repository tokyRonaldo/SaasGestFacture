'use client'
import { useEffect,useState } from "react"
import {formatQuoteNumber} from '@/lib/formatNumber';
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Quote(){
    const router = useRouter();
    const [user,setUser]=useState<any>(null);
    const [quotes,setQuotes]=useState<any[]>([])
    const [status, setStatus] = useState("");
    const [search, setSearch] = useState("");
    const [searchInput, setSearchInput] = useState("");

    const [showExportMenu, setShowExportMenu] = useState(false);

    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [paginateFrom, setPaginateFrom] = useState(0);
    const [paginateTo, setPaginateTo] = useState(0);
    const statuses = [
        { label: "Tous", value: "" },
        { label: "Brouillon", value: "DRAFT" },
        { label: "Envoyé", value: "SENT" },
        { label: "Accepté", value: "ACCEPTED" },
        { label: "Refusé", value: "REJECTED" },
    ];
    
    const limit = 5;
    
    const url = process.env.NEXT_PUBLIC_API_URL;
    
    const [loadingDelete, setLoadingDelete] = useState(false);

    const handleDelete = async (id: string) => {
        const confirmDelete = confirm("Voulez-vous vraiment supprimer ce devis ?");
        if (!confirmDelete) return;

        try {
            setLoadingDelete(true);

            const res = await fetch(`${url}/quote/${id}`, {
                method: "DELETE",
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message);

            // refresh list
            getQuote(user.id, page);

        } catch (error) {
            console.error(error);
        } finally {
            setLoadingDelete(false);
        }
    };

    const getQuote = async(
        useId :string,
        currentPage = 1, 
        currentStatus = "",
        currentSearch = ""
    )=>{

        const query = new URLSearchParams({
            page: currentPage.toString(),
            limit: limit.toString(),
        });

        if (currentStatus) {
            query.append("status", currentStatus);
        }

        if (currentSearch) {
            query.append("search", currentSearch);
        }

        const result = await fetch(url + `/quote/${useId}?${query.toString()}`,{
            method : 'GET',
            headers :{
                'content-type': 'application/json'
            }        
        })
        const response = await result.json();

        if (!result.ok) throw new Error(response.message);
        setQuotes(response.data);
        setPaginateFrom(response.from)
        setPaginateTo(response.to)
        setPage(response.page);
        setLastPage(response.lastPage)
        setTotal(response.total)


        console.log(response);
    }

    const updateQuoteStatus = async (
        quoteId: string,
        status: string
    ) => {
        try {
            const response = await fetch(
                `${url}/quote/${quoteId}/status`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        status,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            setQuotes((prev) =>
                prev.map((quote) =>
                    quote.id === quoteId
                        ? { ...quote, status }
                        : quote
                )
            );
        } catch (error) {
            console.error(error);
            alert("Erreur lors de la mise à jour");
        }
    };

    const handleInvoice = async (id: string) => {
        try {

            const response = await fetch(`${url}/quote/create/invoice/${id}`, {
                method: "GET",
                headers: {
                    "content-type": "application/json",
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            // ✔ refresh quotes pour récupérer invoice
            if (user?.id) {
                await getQuote(user.id, page, status, search);
            }

        } catch (error) {
            console.error(error);
            alert("Erreur lors de la facturation");
        } 
    };

    const exportExcel = () => {
        const data = quotes.map((q) => ({
            Numero: q.quoteNumber,
            Client: q.client?.name,
            Date: new Date(q.createdAt).toLocaleDateString(),
            Montant: q.total,
            Statut: q.status,
        }));

        const worksheet = XLSX.utils.json_to_sheet(data);

        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            "Devis"
        );

        XLSX.writeFile(
            workbook,
            `quotes-${Date.now()}.xlsx`
        );
    };


    const exportPDF = () => {

        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text("Liste des devis", 14, 20);

        autoTable(doc, {
            startY: 30,
            head: [[
                "Numero",
                "Client",
                "Date",
                "Montant",
                "Statut"
            ]],
            body: quotes.map((q) => [
                q.quoteNumber,
                q.client?.name,
                new Date(q.createdAt)
                    .toLocaleDateString(),
                `${q.total} €`,
                q.status,
            ]),
        });

        doc.save(
            `quotes-${Date.now()}.pdf`
        );
    };

    const exportSingleQuotePDF = (quote: any) => {
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text("Devis", 14, 20);

        doc.setFontSize(12);

        doc.text(
            `Numéro : ${quote.quoteNumber}`,
            14,
            40
        );

        doc.text(
            `Client : ${quote.client?.name}`,
            14,
            50
        );

        doc.text(
            `Date : ${new Date(
                quote.createdAt
            ).toLocaleDateString()}`,
            14,
            60
        );

        doc.text(
            `Statut : ${quote.status}`,
            14,
            70
        );

        doc.text(
            `Montant : ${quote.total} €`,
            14,
            80
        );

        if (quote.items?.length) {
            autoTable(doc, {
                startY: 100,
                head: [[
                    "Produit",
                    "Quantité",
                    "Prix",
                    "Total"
                ]],
                body: quote.items.map((item: any) => [
                    item.label,
                    item.quantity,
                    item.unitPrice,
                    item.total,
                ]),
            });
        }

        doc.save(
            `devis-${quote.quoteNumber}.pdf`
        );
    };

    useEffect(()=>{
        const userString = localStorage.getItem("user");
        
        if (userString) {
            const parsedUser = JSON.parse(userString);

            setUser(parsedUser);

            console.log(parsedUser.id);

            getQuote(            
                parsedUser.id,
                page,
                status,
                search
            )
        }
    },[page ,status, search])

    return(
<div className="pt-16 p-lg space-y-xl max-w-container-max mx-auto">
<div className="flex flex-col md:flex-row md:items-center justify-between gap-md">
<div>
<h2 className="font-h1 text-h1 text-on-surface">Liste des Devis</h2>
<p className="font-body-md text-body-md text-on-surface-variant">Gérez vos propositions commerciales et suivez leur acceptation.</p>
</div>
<button 
    onClick={() => router.push(`/component/project/quote/create`)}
    className="flex items-center gap-sm bg-primary-container text-white px-lg py-sm rounded-lg font-bold hover:brightness-110 active:scale-95 transition-all"
    >
<span className="material-symbols-outlined">add</span>
<span>Nouveau Devis</span>
</button>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md">
<div className="bg-white p-lg rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow">
<div className="flex items-center justify-between mb-md">
<span className="font-label-sm text-label-sm text-on-surface-variant">TOTAL DEVIS (HT)</span>
<div className="p-xs bg-primary-fixed rounded-lg text-primary">
<span className="material-symbols-outlined">account_balance_wallet</span>
</div>
</div>
<p className="font-h2 text-h2 text-on-surface">142,500.00 €</p>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-sm flex items-center gap-xs">
<span className="material-symbols-outlined text-sm">trending_up</span>
<span className="text-primary font-bold">+12%</span> par rapport au mois dernier
                    </p>
</div>
<div className="bg-white p-lg rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow">
<div className="flex items-center justify-between mb-md">
<span className="font-label-sm text-label-sm text-on-surface-variant">EN ATTENTE</span>
<div className="p-xs bg-tertiary-fixed rounded-lg text-tertiary">
<span className="material-symbols-outlined">hourglass_empty</span>
</div>
</div>
<p className="font-h2 text-h2 text-on-surface">48,200.00 €</p>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-sm">24 devis en attente d'acceptation</p>
</div>
<div className="bg-white p-lg rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-primary-container">
<div className="flex items-center justify-between mb-md">
<span className="font-label-sm text-label-sm text-on-surface-variant">ACCEPTÉS (MOIS)</span>
<div className="p-xs bg-green-100 rounded-lg text-green-700">
<span className="material-symbols-outlined">check_circle</span>
</div>
</div>
<p className="font-h2 text-h2 text-on-surface">32,150.00 €</p>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-sm">18 devis acceptés ce mois-ci</p>
</div>
<div className="bg-white p-lg rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow">
<div className="flex items-center justify-between mb-md">
<span className="font-label-sm text-label-sm text-on-surface-variant">TAUX DE CONVERSION</span>
<div className="p-xs bg-surface-container-highest rounded-lg text-on-surface">
<span className="material-symbols-outlined">donut_large</span>
</div>
</div>
<p className="font-h2 text-h2 text-on-surface">68.5%</p>
<div className="w-full bg-surface-container-low h-1.5 rounded-full mt-md">
<div className="bg-primary-container h-full rounded-full w-[68.5%]"></div>
</div>
</div>
</div>
<div className="bg-white rounded-xl border border-outline-variant shadow-sm overflow-hidden">
<div className="p-md border-b border-outline-variant flex flex-col sm:flex-row items-center justify-between gap-md bg-surface-container-lowest">
<div className="flex items-center gap-xs overflow-x-auto w-full sm:w-auto pb-sm sm:pb-0">

{statuses.map((item) => (
    <button
        key={item.value}
        onClick={() => {
            setPage(1);
            setStatus(item.value);
        }}
        className={`px-md py-xs rounded-full whitespace-nowrap
        ${
            status === item.value
                ? "bg-primary-container text-white font-bold text-body-sm"
                : "hover:bg-surface-container-high text-on-surface-variant font-medium text-body-sm"
        }`}
    >
        {item.label}
    </button>
))}

</div>
<div className="flex items-center gap-sm">
<button className="flex items-center gap-xs text-body-sm font-medium border border-outline-variant rounded-lg px-md py-xs hover:bg-surface-container-low transition-colors">
    <span className="material-symbols-outlined text-sm">filter_list</span>
                            Filtrer
</button>
<div className="relative">
    <button
        onClick={() => setShowExportMenu(!showExportMenu)}
        className="flex items-center gap-xs text-body-sm font-medium border border-outline-variant rounded-lg px-md py-xs hover:bg-surface-container-low transition-colors"
    >
        <span className="material-symbols-outlined text-sm">
            download
        </span>
        Exporter
        <span className="material-symbols-outlined text-sm">
            expand_more
        </span>
    </button>

    {showExportMenu && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-outline-variant rounded-lg shadow-lg z-50 overflow-hidden">
            
            <button
                onClick={() => {
                    exportExcel();
                    setShowExportMenu(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-3 hover:bg-surface-container-low text-left"
            >
                <span className="material-symbols-outlined">
                    table_view
                </span>
                Excel (.xlsx)
            </button>

            <button
                onClick={() => {
                    exportPDF();
                    setShowExportMenu(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-3 hover:bg-surface-container-low text-left"
            >
                <span className="material-symbols-outlined">
                    picture_as_pdf
                </span>
                PDF (.pdf)
            </button>

        </div>
    )}
</div>
</div>
</div>
<div className="overflow-x-auto">
<table className="w-full border-collapse">
<thead>
<tr className="bg-surface-container-low text-left">
<th className="py-md px-lg font-label-sm text-label-sm text-on-surface-variant border-b border-outline-variant uppercase tracking-wider">N° Devis</th>
<th className="py-md px-lg font-label-sm text-label-sm text-on-surface-variant border-b border-outline-variant uppercase tracking-wider">Client</th>
<th className="py-md px-lg font-label-sm text-label-sm text-on-surface-variant border-b border-outline-variant uppercase tracking-wider">Date</th>
<th className="py-md px-lg font-label-sm text-label-sm text-on-surface-variant border-b border-outline-variant uppercase tracking-wider text-right">Montant (HT)</th>
<th className="py-md px-lg font-label-sm text-label-sm text-on-surface-variant border-b border-outline-variant uppercase tracking-wider">Statut</th>
<th className="py-md px-lg font-label-sm text-label-sm text-on-surface-variant border-b border-outline-variant uppercase tracking-wider text-right">Actions</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant">
    {quotes.map((quote,index)=>(

        <tr className="hover:bg-surface-container-low transition-colors group">
        <td className="py-md px-lg font-body-md text-body-md font-bold text-primary">{quote?.quoteNumber ? formatQuoteNumber(quote.quoteNumber) : formatQuoteNumber(index)}</td>
        <td className="py-md px-lg">
        <div className="flex items-center gap-sm">
        <div className="w-8 h-8 rounded-full bg-primary-fixed-dim text-on-primary-fixed flex items-center justify-center font-bold text-xs">{quote?.client?.name?.slice(0,2).toUpperCase()}</div>
        <span className="font-body-md text-body-md">{quote?.client.name}</span>
        </div>
        </td>
        <td className="py-md px-lg font-body-md text-body-md text-on-surface-variant">{
            new Date(quote.createdAt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            })
            }</td>
        <td className="py-md px-lg font-body-md text-body-md text-right font-semibold">{quote?.total} €</td>
        <td className="py-md px-lg">
              <div className="relative inline-block">
                <select
                    value={quote.status}
                    onChange={(e) =>
                        updateQuoteStatus(quote.id, e.target.value)
                    }
                    className={`
                        appearance-none cursor-pointer
                        px-3 py-1.5 pr-8 rounded-full text-xs font-bold border
                        transition-all duration-200
                        focus:outline-none focus:ring-2 focus:ring-primary/30

                        ${
                            quote.status === "DRAFT"
                                ? "bg-gray-100 text-gray-700 border-gray-300"
                                : ""
                        }
                        ${
                            quote.status === "SENT"
                                ? "bg-blue-100 text-blue-700 border-blue-300"
                                : ""
                        }
                        ${
                            quote.status === "ACCEPTED"
                                ? "bg-green-100 text-green-700 border-green-300"
                                : ""
                        }
                        ${
                            quote.status === "REJECTED"
                                ? "bg-red-100 text-red-700 border-red-300"
                                : ""
                        }
                    `}
                >
                    <option value="DRAFT">Brouillon</option>
                    <option value="SENT">Envoyé</option>
                    <option value="ACCEPTED">Accepté</option>
                    <option value="REJECTED">Refusé</option>
                </select>

                {/* petite flèche custom */}
                <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs text-on-surface-variant">
                    ▼
                </span>
            </div>
        </td>
        <td className="py-md px-lg text-right">
        <div className="flex items-center justify-end gap-sm">
            {quote?.status === "ACCEPTED" &&  !quote?.invoice &&(
                <button
                    onClick={()=>{handleInvoice(quote.id)}} 
                    className="bg-primary text-white text-xs px-sm py-1.5 rounded-lg font-bold hover:brightness-110 active:scale-95 transition-all flex items-center gap-xs"
                >
                    <span className="material-symbols-outlined text-[16px]">receipt_long</span>
                    Facturer
                </button>
            )}

        <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
            onClick={() => exportSingleQuotePDF(quote)}
            className="p-xs text-on-surface-variant hover:text-primary transition-colors" title="Voir PDF"
        >
        <span className="material-symbols-outlined">picture_as_pdf</span>
        </button>
        <button
            onClick={() => router.push(`/component/project/quote/create?id=${quote.id}`)}
            className="p-xs text-on-surface-variant hover:text-primary transition-colors"
            title="Modifier"
        >
            <span className="material-symbols-outlined">edit</span>
        </button>

        <button
            onClick={() => handleDelete(quote.id)}
            className="p-xs text-on-surface-variant hover:text-error transition-colors"
            title="Supprimer"
        >
            <span className="material-symbols-outlined">delete</span>
        </button>

        </div>
        </div>
        </td>
        </tr>
    ))}
</tbody>
</table>
</div>
<div className="p-md bg-surface-container-low border-t border-outline-variant flex items-center justify-between">
<p className="font-body-sm text-body-sm text-on-surface-variant">Affichage de {paginateFrom} à {paginateTo} sur {total} devis</p>
<div className="flex items-center gap-xs">
<button 
disabled={page === 1}
onClick={() => setPage(page - 1)}
className="p-base rounded-lg border border-outline-variant hover:bg-white transition-colors disabled:opacity-50" >
<span className="material-symbols-outlined">chevron_left</span>
</button>
{/* PAGE NUMBERS */}
{
    [...Array(lastPage)].map((_, index) => (

    <button
        key={index}
        onClick={() => setPage(index + 1)}
        className={`w-8 h-8 rounded-lg text-xs ${
        page === index + 1
            ? 'bg-primary text-white font-bold'
            : 'border border-outline-variant hover:bg-white text-on-surface-variant font-medium'
        }`}
    >
        {index + 1}
    </button>

    ))
}
<button 
disabled={page === lastPage}
onClick={() => setPage(page + 1)}
className="p-base rounded-lg border border-outline-variant hover:bg-white transition-colors">
<span className="material-symbols-outlined">chevron_right</span>
</button>
</div>
</div>
</div>
<div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
<div className="lg:col-span-2 relative overflow-hidden rounded-xl bg-primary-container text-white p-2xl">
<div className="relative z-10 flex flex-col justify-center h-full">
<h3 className="font-h2 text-h2 mb-md">Accélérez vos paiements</h3>
<p className="font-body-lg text-body-lg mb-xl max-w-lg opacity-90">Activez la signature électronique sur vos devis pour réduire le délai d'acceptation de 40% en moyenne.</p>
<button className="w-fit bg-white text-primary-container font-bold px-xl py-md rounded-lg hover:bg-surface-container-low transition-colors shadow-lg">En savoir plus</button>
</div>
<div className="absolute right-0 top-0 w-1/3 h-full opacity-20 pointer-events-none">
<div className="w-full h-full bg-gradient-to-l from-white/40 to-transparent"></div>
</div>
<img alt="Signature électronique" className="absolute right-[-10%] top-0 h-full w-auto object-cover mix-blend-overlay" data-alt="A professional close-up of a digital tablet screen being signed with an electronic stylus in a bright modern office. The image is bathed in a professional high-key light, emphasizing a clean corporate atmosphere with deep blue accents from the surrounding UI design. The mood is efficient, secure, and technologically advanced, mirroring a premium SaaS aesthetic." src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0lrLYWZoH45QymvQqHJLVXAhsXQtAdQKvmC9foFWRXkVCyCLSxTu3M_LNR6iTtiHK2n9u1W4KYTCdj5wG5rZ6Zt5mjaQOQnPZh5VTQWo0uywZsVXdkPqJPFnMFF_0yO9FF39PvtxqOO07c167F7630-e3p3GraUFMdojdT8Zzkwwd5uMrogwuZV3yPQOIhL2op4G7ro08Tm5S9u6QM4p-ff5DAvZLOaaWnuKcyF-xSPZBXIiZzYJWFXjp6oNKSGGYEG-BXzsnY13n"/>
</div>
<div className="bg-white rounded-xl border border-outline-variant p-lg flex flex-col justify-between">
<div>
<div className="flex items-center gap-sm text-primary mb-md">
<span className="material-symbols-outlined">lightbulb</span>
<span className="font-label-sm text-label-sm uppercase font-bold">Conseil Finance</span>
</div>
<h4 className="font-h3 text-h3 mb-sm">Relances automatiques</h4>
<p className="font-body-md text-body-md text-on-surface-variant">Vous avez 5 devis 'Envoyés' depuis plus de 7 jours. Souhaitez-vous activer une relance automatique ?</p>
</div>
<button className="mt-xl w-full border border-primary text-primary font-bold py-sm rounded-lg hover:bg-primary-fixed transition-colors">Activer les relances</button>
</div>
</div>
</div>
    )
}