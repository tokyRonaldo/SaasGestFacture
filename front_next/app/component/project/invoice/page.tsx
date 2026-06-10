'use client'
import { useEffect, useState } from "react"
import {formatInvoiceNumber} from '@/lib/formatNumber';
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


export default function Invoice(){

    const [user,setUser]=useState<any>(null)
    const url = process.env.NEXT_PUBLIC_API_URL;

    const [status, setStatus] = useState("");
    const [search, setSearch] = useState("");
    const [searchInput, setSearchInput] = useState("");

    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [paginateFrom, setPaginateFrom] = useState(0);
    const [paginateTo, setPaginateTo] = useState(0);

    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
    const [showViewModal, setShowViewModal] = useState(false);

    const [loadingDelete, setLoadingDelete] = useState(false);

    const [invoices,setInvoices]=useState<any[]>([])

    const limit = 5;

    const statuses = [
        { label: "Tous", value: "" },
        { label: "En attente", value: "PENDING" },
        { label: "Payée", value: "PAID" },
        { label: "Annulée", value: "CANCELLED" },
        { label: "En retard", value: "OVERDUE" },
    ];

    const getInvoice= async (
        userId : string,
        currentPage = 1,
        currentStatus = "",
        currentSearch = ""
    ) =>{

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

        const response = await fetch(`${url}/invoice/${userId}?${query.toString()}`,{
            method : 'GET',
            headers : {
                'content-type' : 'application/json'
            }
        })

        const result =  await response.json()
        if(!response.ok) throw new Error(result.message)
        console.log(result)

        setInvoices(result.data);
        setPaginateFrom(result.from)
        setPaginateTo(result.to)
        setPage(result.page);
        setLastPage(result.lastPage)
        setTotal(result.total)
    }

    const handleDelete = async (id: string) => {

        const confirmDelete = confirm(
            "Voulez-vous vraiment supprimer cette facture ?"
        );

        if (!confirmDelete) return;

        try {

            setLoadingDelete(true);

            const response = await fetch(
                `${url}/invoice/${id}`,
                {
                    method: "DELETE",
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            // refresh liste

            if(user?.id){

                await getInvoice(
                    user.id,
                    page,
                    status,
                    search
                );
            }

        } catch (error) {

            console.error(error);

            alert("Erreur lors de la suppression");

        } finally {

            setLoadingDelete(false);

        }
    };

    const updateInvoiceStatus = async (
        invoiceId: string,
        status: string
    ) => {
        try {
            const response = await fetch(
                `${url}/invoice/${invoiceId}/status`,
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

            setInvoices((prev) =>
                prev.map((invoice) =>
                    invoice.id === invoiceId
                        ? { ...invoice, status }
                        : invoice
                )
            );
        } catch (error) {
            console.error(error);
            alert("Erreur lors de la mise à jour");
        }
    };


    const exportInvoicePDF = (invoice:any) => {

        const doc = new jsPDF();

        doc.setFontSize(18);

        doc.text(
            "Facture",
            14,
            20
        );

        doc.setFontSize(12);

        doc.text(
            `Numero : ${invoice.invoiceNumber}`,
            14,
            40
        );

        doc.text(
            `Client : ${invoice.client?.name}`,
            14,
            50
        );

        doc.text(
            `Statut : ${invoice.status}`,
            14,
            60
        );

        doc.text(
            `Montant : ${invoice.total} €`,
            14,
            70
        );

        autoTable(doc,{
            startY:90,
            head:[[
                "Produit",
                "Qté",
                "Prix",
                "Total"
            ]],
            body:
                invoice.items?.map(
                    (item:any)=>[
                        item.label,
                        item.quantity,
                        item.unitPrice,
                        item.total
                    ]
                ) || []
        });

        doc.save(
            `invoice-${invoice.invoiceNumber}.pdf`
        );
    }

    const exportInvoiceExcel = (
        invoice:any
    ) => {

        const data = [];

        if(invoice.items?.length){

            invoice.items.forEach(
                (item:any) => {

                    data.push({
                        Facture: invoice.invoiceNumber,
                        Client: invoice.client?.name,
                        Produit: item.label,
                        Quantite: item.quantity,
                        Prix: item.unitPrice,
                        Total: item.total,
                    });

                }
            );

        } else {

            data.push({
                Facture: invoice.invoiceNumber,
                Client: invoice.client?.name,
                Statut: invoice.status,
                Total: invoice.total,
            });

        }

        const worksheet =
            XLSX.utils.json_to_sheet(data);

        const workbook =
            XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            "Facture"
        );

        XLSX.writeFile(
            workbook,
            `invoice-${invoice.invoiceNumber}.xlsx`
        );
    };

    useEffect(() => {
        const userString = localStorage.getItem("user");

        if(userString){
            setUser(JSON.parse(userString));
        }
    },[]);

    useEffect(() => {
        if(user){
            getInvoice(
                user.id,
                page,
                status,
                search
            );
        }
    },[user,page,status,search]);

    return(
    <>
    <div className="max-w-container-max mx-auto space-y-lg">
<div className="flex flex-col md:flex-row md:items-end justify-between gap-md">
<div>
<h1 className="font-h1 text-h1 text-on-surface">Liste des Factures</h1>
<p className="font-body-md text-on-surface-variant">Gérez vos paiements et suivez votre trésorerie en temps réel.</p>
</div>
<div className="flex items-center gap-sm">
<button className="px-md py-sm border border-outline-variant rounded-lg bg-surface hover:bg-surface-container-high transition-colors flex items-center gap-xs text-on-surface-variant">
<span className="material-symbols-outlined text-[20px]">filter_list</span>
<span className="font-label-sm">Filtres avancés</span>
</button>

</div>
</div>
<div className="grid grid-cols-1 md:grid-cols-4 gap-lg">
<div className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl flex flex-col gap-sm">
<span className="text-on-surface-variant font-label-caps">Total Facturé (HT)</span>
<span className="text-h2 font-h2 text-on-surface">42 850,00 €</span>
<span className="text-primary font-label-sm flex items-center gap-xs">
<span className="material-symbols-outlined text-[16px]">trending_up</span>
                        +12% vs mois dernier
                    </span>
</div>
<div className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl flex flex-col gap-sm">
<span className="text-on-surface-variant font-label-caps">En Attente</span>
<span className="text-h2 font-h2 text-tertiary">12 400,00 €</span>
<span className="text-on-surface-variant font-label-sm">8 factures impayées</span>
</div>
<div className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl flex flex-col gap-sm">
<span className="text-on-surface-variant font-label-caps">Payées (Ce mois)</span>
<span className="text-h2 font-h2 text-primary">28 150,00 €</span>
<span className="text-on-surface-variant font-label-sm">Objectif 90% atteint</span>
</div>
<div className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl flex flex-col gap-sm">
<span className="text-on-surface-variant font-label-caps">Délai de Paiement</span>
<span className="text-h2 font-h2 text-on-surface">14 Jours</span>
<span className="text-on-surface-variant font-label-sm">Moyenne annuelle</span>
</div>
</div>
<div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
<div className="px-xl py-md border-b border-outline-variant flex flex-wrap gap-md items-center justify-between">
<div className="flex items-center gap-sm">
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
    <input
        type="text"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="N° facture ou client..."
        className="border border-outline-variant rounded-lg px-4 py-2 w-64"
    />

    <button
        onClick={() => {
            setPage(1);
            setSearch(searchInput);
        }}
        className="px-4 py-2 bg-primary text-white rounded-lg"
    >
        Rechercher
    </button>
</div>

</div>
<div className="overflow-x-auto">
<table className="w-full text-left border-collapse">
<thead>
<tr className="bg-surface-container-low">
<th className="px-xl py-md font-label-caps text-on-surface-variant border-b border-outline-variant">N° Facture</th>
<th className="px-xl py-md font-label-caps text-on-surface-variant border-b border-outline-variant">Client</th>
<th className="px-xl py-md font-label-caps text-on-surface-variant border-b border-outline-variant">Date</th>
<th className="px-xl py-md font-label-caps text-on-surface-variant border-b border-outline-variant text-right">Montant</th>
<th className="px-xl py-md font-label-caps text-on-surface-variant border-b border-outline-variant text-center">Statut</th>
<th className="px-xl py-md font-label-caps text-on-surface-variant border-b border-outline-variant"></th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant">
{invoices.map((invoice,index)=>(

<tr className="hover:bg-surface-container transition-colors group">
<td className="px-xl py-md font-body-md font-bold text-primary">{invoice?.invoiceNumber ? invoice.invoiceNumber : formatInvoiceNumber(index)}</td>
<td className="px-xl py-md">
<div className="flex flex-col">
<span className="font-body-md font-bold">{invoice?.client.name}</span>
<span className="text-label-sm text-on-surface-variant">{invoice?.client.id}</span>
</div>
</td>
<td className="px-xl py-md font-body-md text-on-surface-variant">{
            new Date(invoice.createdAt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            })
            }</td>
<td className="px-xl py-md font-body-md text-right font-bold">{invoice?.total} €</td>
<td className="px-xl py-md text-center">
                  <div className="relative inline-block">
                <select
                    value={invoice.status}
                    onChange={(e) =>
                        updateInvoiceStatus(invoice.id, e.target.value)
                    }
                    className={`
                        appearance-none cursor-pointer
                        px-3 py-1.5 pr-8 rounded-full text-xs font-bold border
                        transition-all duration-200
                        focus:outline-none focus:ring-2 focus:ring-primary/30

                        ${
                            invoice.status === "OVERDUE"
                                ? "bg-gray-100 text-gray-700 border-gray-300"
                                : ""
                        }
                        ${
                            invoice.status === "PENDING"
                                ? "bg-blue-100 text-blue-700 border-blue-300"
                                : ""
                        }
                        ${
                            invoice.status === "PAID"
                                ? "bg-green-100 text-green-700 border-green-300"
                                : ""
                        }
                        ${
                            invoice.status === "CANCELLED"
                                ? "bg-red-100 text-red-700 border-red-300"
                                : ""
                        }
                    `}
                >
                    <option value="PENDING">En attente</option>
                    <option value="PAID">Payée</option>
                    <option value="OVERDUE">En retard</option>
                    <option value="CANCELLED">Annulée</option>
                </select>

                {/* petite flèche custom */}
                <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs text-on-surface-variant">
                    ▼
                </span>
            </div>

</td>
<td className="px-xl py-md text-right relative">
    <button
        onClick={() =>
            setActiveMenu(
                activeMenu === invoice.id
                    ? null
                    : invoice.id
            )
        }
        className="p-sm text-on-surface-variant hover:text-primary"
    >
        <span className="material-symbols-outlined">
            more_vert
        </span>
    </button>

    {activeMenu === invoice.id && (
        <div className="absolute right-4 mt-2 w-56 bg-white border rounded-xl shadow-xl z-50 overflow-hidden">

            <button
                onClick={() => {
                    setSelectedInvoice(invoice);
                    setShowViewModal(true);
                    setActiveMenu(null);
                }}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-surface-container-low"
            >
                <span className="material-symbols-outlined">
                    visibility
                </span>
                Voir
            </button>

            <button
                onClick={() => exportInvoicePDF(invoice)}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-surface-container-low"
            >
                <span className="material-symbols-outlined">
                    picture_as_pdf
                </span>
                Télécharger PDF
            </button>

            <button
                onClick={() => {
                    exportInvoiceExcel(invoice);
                    setActiveMenu(null);
                }}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-surface-container-low"
            >
                <span className="material-symbols-outlined">
                    table_view
                </span>

                Télécharger XLSX
            </button>

            <button
                onClick={() => handleDelete(invoice.id)}
                className="w-full px-4 py-3 flex items-center gap-3 text-red-600 hover:bg-red-50"
            >
                <span className="material-symbols-outlined">
                    delete
                </span>
                Supprimer
            </button>

        </div>
    )}
</td>
</tr>
))}
</tbody>
</table>
</div>
<div className="p-md bg-surface-container-low border-t border-outline-variant flex items-center justify-between">
<p className="font-body-sm text-body-sm text-on-surface-variant">Affichage de {paginateFrom} à {paginateTo} sur {total} résultats</p>
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
<div className="lg:col-span-2 bg-primary-container p-2xl rounded-xl relative overflow-hidden text-white flex flex-col justify-center min-h-[240px]">
<div className="relative z-10 space-y-md">
<h2 className="font-h1 text-h1">Besoin d'aide avec la facturation ?</h2>
<p className="font-body-lg max-w-lg opacity-90">Consultez notre guide de conformité fiscale 2024 pour optimiser vos déclarations et réduire vos délais de paiement.</p>
<button className="mt-md px-lg py-md bg-white text-primary rounded-lg font-bold shadow-lg hover:scale-105 transition-transform">Télécharger le guide</button>
</div>
<div className="absolute right-[-10%] bottom-[-20%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
</div>
<div className="bg-surface-container-highest p-xl rounded-xl border border-outline-variant flex flex-col gap-md">
<h3 className="font-h3 text-h3">Prochaines Échéances</h3>
<ul className="space-y-sm">
<li className="p-md bg-white rounded-lg flex items-center justify-between border-l-4 border-tertiary">
<span className="font-body-md">TVA 3ème Trimestre</span>
<span className="text-label-sm font-bold text-tertiary">Demain</span>
</li>
<li className="p-md bg-white rounded-lg flex items-center justify-between border-l-4 border-primary">
<span className="font-body-md">Cotisations Sociales</span>
<span className="text-label-sm font-bold text-primary">J+5</span>
</li>
<li className="p-md bg-white rounded-lg flex items-center justify-between border-l-4 border-outline">
<span className="font-body-md">Impôt sur les sociétés</span>
<span className="text-label-sm font-bold text-on-surface-variant">J+15</span>
</li>
</ul>
</div>
</div>
</div>
{
    showViewModal &&
    selectedInvoice && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">

            <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-auto">

                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-bold">
                        Facture
                    </h2>

                    <button
                        onClick={() => {
                            setShowViewModal(false);
                            setSelectedInvoice(null);
                        }}
                    >
                        ✕
                    </button>
                </div>

                <div className="p-6 space-y-6">

                    <div>
                        <p className="text-sm text-gray-500">
                            Numéro
                        </p>

                        <p className="font-bold">
                            {selectedInvoice.invoiceNumber}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Client
                        </p>

                        <p>
                            {selectedInvoice.client?.name}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Date
                        </p>

                        <p>
                            {
                                new Date(
                                    selectedInvoice.createdAt
                                ).toLocaleDateString()
                            }
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Statut
                        </p>

                        <p>
                            {selectedInvoice.status}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Montant Total
                        </p>

                        <p className="font-bold text-lg">
                            {selectedInvoice.total} €
                        </p>
                    </div>

                    {
                        selectedInvoice.items?.length > 0 &&
                        (
                            <table className="w-full border">
                                <thead>
                                    <tr>
                                        <th>Produit</th>
                                        <th>Qté</th>
                                        <th>Prix</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {
                                        selectedInvoice.items.map(
                                            (
                                                item:any,
                                                index:number
                                            ) => (
                                                <tr key={index}>
                                                    <td className="text-center">
                                                        {item.label}
                                                    </td>

                                                    <td className="text-center">
                                                        {item.quantity}
                                                    </td>

                                                    <td className="text-center">
                                                        {item.unitPrice}
                                                    </td>

                                                    <td className="text-center">
                                                        {item.total}
                                                    </td>
                                                </tr>
                                            )
                                        )
                                    }
                                </tbody>
                            </table>
                        )
                    }

                </div>

            </div>

        </div>
    )
}
    </>
    )
}