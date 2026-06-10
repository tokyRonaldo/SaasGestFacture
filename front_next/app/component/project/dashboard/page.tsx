'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";
//import { signOut } from "next-auth/react";


const Dashboard=()=>{

    const router = useRouter();

    const fetchData = async (e:any) => {

        e.preventDefault();

        try {

            const response = await fetch('/api/dashboard',{
                method : 'get',
                headers :{
                    'content-type':'application/json'
                }
            })

            const data= await response.json()
            if (!response.ok){
                throw new Error(data.message || 'error')
            }
            console.log(data)


        } catch(error:any){

            console.log(error);

            alert(error.message);
        }
    }    

    const logout = () => {

        localStorage.removeItem('token');

        localStorage.removeItem('user');

        router.push('/component/auth/login');
    }

return(
<>
<div className="mb-xl">
<h2 className="font-h1 text-h1 text-on-surface">Tableau de bord</h2>
<p className="font-body-md text-body-md text-secondary">Bienvenue, voici l'état de vos finances pour ce mois-ci.</p>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-lg mb-xl">
<div className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl flex flex-col gap-sm shadow-sm hover:shadow-md transition-shadow">
<div className="flex justify-between items-center">
<span className="material-symbols-outlined text-primary bg-primary-fixed p-sm rounded-lg" data-icon="payments">payments</span>
<span className="text-primary font-bold font-label-sm">+12.5%</span>
</div>
<div>
<p className="font-label-sm text-secondary uppercase tracking-wider">Revenu Total</p>
<h3 className="font-h1 text-h1">45 280,00 €</h3>
</div>
<p className="font-body-sm text-secondary">Comparé à 40 250 € le mois dernier</p>
</div>
<div className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl flex flex-col gap-sm shadow-sm hover:shadow-md transition-shadow">
<div className="flex justify-between items-center">
<span className="material-symbols-outlined text-on-tertiary-container bg-tertiary-fixed p-sm rounded-lg" data-icon="receipt">receipt</span>
<span className="text-tertiary font-bold font-label-sm">24 Factures</span>
</div>
<div>
<p className="font-label-sm text-secondary uppercase tracking-wider">Factures Payées</p>
<h3 className="font-h1 text-h1">32 150,00 €</h3>
</div>
<div className="w-full bg-surface-container rounded-full h-2 mt-sm">
<div className="bg-tertiary-container h-2 rounded-full w-[70%]"></div>
</div>
</div>
<div className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl flex flex-col gap-sm shadow-sm hover:shadow-md transition-shadow">
<div className="flex justify-between items-center">
<span className="material-symbols-outlined text-secondary bg-secondary-fixed p-sm rounded-lg" data-icon="hourglass_empty">hourglass_empty</span>
<span className="text-secondary font-bold font-label-sm">8 En attente</span>
</div>
<div>
<p className="font-label-sm text-secondary uppercase tracking-wider">Devis en cours</p>
<h3 className="font-h1 text-h1">12 400,00 €</h3>
</div>
<p className="font-body-sm text-secondary">Relance suggérée pour 3 devis</p>
</div>
</div>
<div className="grid grid-cols-1 lg:grid-cols-3 gap-lg h-auto">
<div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant rounded-xl p-lg flex flex-col">
<div className="flex justify-between items-center mb-xl">
<div>
<h4 className="font-h2 text-h2 text-on-surface">Aperçu du Revenu</h4>
<p className="font-body-sm text-secondary">Évolution de la facturation sur les 6 derniers mois</p>
</div>
<select className="bg-surface border border-outline-variant rounded-lg px-md py-xs font-body-sm focus:ring-primary">
<option>6 derniers mois</option>
<option>Cette année</option>
</select>
</div>
<div className="flex-1 min-h-[300px] flex items-end gap-md pt-lg">
<div className="flex-1 bg-primary-container/20 rounded-t-lg h-[40%] relative group">
<div className="absolute inset-x-0 bottom-0 bg-primary-container h-3/4 rounded-t-lg transition-all group-hover:bg-primary"></div>
<span className="absolute -bottom-xl left-1/2 -translate-x-1/2 font-label-sm text-secondary">Jan</span>
</div>
<div className="flex-1 bg-primary-container/20 rounded-t-lg h-[60%] relative group">
<div className="absolute inset-x-0 bottom-0 bg-primary-container h-4/5 rounded-t-lg transition-all group-hover:bg-primary"></div>
<span className="absolute -bottom-xl left-1/2 -translate-x-1/2 font-label-sm text-secondary">Fév</span>
</div>
<div className="flex-1 bg-primary-container/20 rounded-t-lg h-[55%] relative group">
<div className="absolute inset-x-0 bottom-0 bg-primary-container h-1/2 rounded-t-lg transition-all group-hover:bg-primary"></div>
<span className="absolute -bottom-xl left-1/2 -translate-x-1/2 font-label-sm text-secondary">Mar</span>
</div>
<div className="flex-1 bg-primary-container/20 rounded-t-lg h-[80%] relative group">
<div className="absolute inset-x-0 bottom-0 bg-primary-container h-[90%] rounded-t-lg transition-all group-hover:bg-primary"></div>
<span className="absolute -bottom-xl left-1/2 -translate-x-1/2 font-label-sm text-secondary">Avr</span>
</div>
<div className="flex-1 bg-primary-container/20 rounded-t-lg h-[65%] relative group">
<div className="absolute inset-x-0 bottom-0 bg-primary-container h-[70%] rounded-t-lg transition-all group-hover:bg-primary"></div>
<span className="absolute -bottom-xl left-1/2 -translate-x-1/2 font-label-sm text-secondary">Mai</span>
</div>
<div className="flex-1 bg-primary-container/20 rounded-t-lg h-[95%] relative group">
<div className="absolute inset-x-0 bottom-0 bg-primary-container h-full rounded-t-lg transition-all group-hover:bg-primary"></div>
<span className="absolute -bottom-xl left-1/2 -translate-x-1/2 font-label-sm text-secondary">Juin</span>
</div>
</div>
</div>
<div className="lg:col-span-1 bg-surface-container-lowest border border-outline-variant rounded-xl p-lg flex flex-col">
<div className="flex justify-between items-center mb-lg">
<h4 className="font-h2 text-h2 text-on-surface">Activité Récente</h4>
<button className="text-primary font-label-sm hover:underline">Voir tout</button>
</div>
<div className="space-y-lg">
<div className="flex gap-md">
<div className="w-10 h-10 rounded-full bg-tertiary-fixed flex items-center justify-center flex-shrink-0">
<span className="material-symbols-outlined text-tertiary-container" data-icon="check_circle">check_circle</span>
</div>
<div className="flex-1 border-b border-outline-variant pb-md">
<div className="flex justify-between items-start">
<p className="font-body-md text-on-surface font-bold">Facture #2024-051</p>
<span className="font-label-sm text-secondary">Hier</span>
</div>
<p className="font-body-sm text-secondary">Client: Acme Corp - <span className="text-on-surface font-medium">1 250,00 €</span></p>
<span className="inline-block mt-xs px-sm py-[2px] bg-green-100 text-green-700 rounded-full text-[10px] font-bold uppercase">Payée</span>
</div>
</div>
<div className="flex gap-md">
<div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center flex-shrink-0">
<span className="material-symbols-outlined text-on-secondary-fixed-variant" data-icon="send">send</span>
</div>
<div className="flex-1 border-b border-outline-variant pb-md">
<div className="flex justify-between items-start">
<p className="font-body-md text-on-surface font-bold">Devis #DV-992</p>
<span className="font-label-sm text-secondary">14:20</span>
</div>
<p className="font-body-sm text-secondary">Client: TechFlow - <span className="text-on-surface font-medium">3 400,00 €</span></p>
<span className="inline-block mt-xs px-sm py-[2px] bg-blue-100 text-blue-700 rounded-full text-[10px] font-bold uppercase">Envoyé</span>
</div>
</div>
<div className="flex gap-md">
<div className="w-10 h-10 rounded-full bg-error-container flex items-center justify-center flex-shrink-0">
<span className="material-symbols-outlined text-error" data-icon="warning">warning</span>
</div>
<div className="flex-1 border-b border-outline-variant pb-md">
<div className="flex justify-between items-start">
<p className="font-body-md text-on-surface font-bold">Facture #2024-048</p>
<span className="font-label-sm text-secondary">2 jours</span>
</div>
<p className="font-body-sm text-secondary">Client: Studio Design - <span className="text-on-surface font-medium">850,00 €</span></p>
<span className="inline-block mt-xs px-sm py-[2px] bg-red-100 text-red-700 rounded-full text-[10px] font-bold uppercase">En retard</span>
</div>
</div>
<div className="flex gap-md">
<div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center flex-shrink-0">
<span className="material-symbols-outlined text-primary" data-icon="person_add">person_add</span>
</div>
<div className="flex-1">
<div className="flex justify-between items-start">
<p className="font-body-md text-on-surface font-bold">Nouveau Client</p>
<span className="font-label-sm text-secondary">3 jours</span>
</div>
<p className="font-body-sm text-secondary">L'agence Web-X a été ajoutée</p>
</div>
</div>
</div>
</div>
</div>
<div className="grid grid-cols-1 md:grid-cols-4 gap-lg mt-xl">
<div className="bg-primary hover:bg-primary-container text-white p-lg rounded-xl flex items-center gap-md cursor-pointer transition-colors group">
<span className="material-symbols-outlined text-display-lg" data-icon="note_add">note_add</span>
<div>
<p className="font-h3 text-h3">Nouveau Devis</p>
<p className="font-body-sm opacity-80">Créer et envoyer</p>
</div>
</div>
<div className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl flex items-center gap-md cursor-pointer hover:bg-surface-container transition-colors group">
<span className="material-symbols-outlined text-primary text-display-lg" data-icon="group">group</span>
<div>
<p className="font-h3 text-h3">Clients</p>
<p className="font-body-sm text-secondary">Gérer la base</p>
</div>
</div>
<div className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl flex items-center gap-md cursor-pointer hover:bg-surface-container transition-colors group">
<span className="material-symbols-outlined text-primary text-display-lg" data-icon="analytics">analytics</span>
<div>
<p className="font-h3 text-h3">Rapports</p>
<p className="font-body-sm text-secondary">Exporter PDF/Excel</p>
</div>
</div>
<div className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl flex items-center gap-md cursor-pointer hover:bg-surface-container transition-colors group">
<span className="material-symbols-outlined text-primary text-display-lg" data-icon="history">history</span>
<div>
<p className="font-h3 text-h3">Historique</p>
<p className="font-body-sm text-secondary">Toutes les actions</p>
</div>
</div>
</div>
</>
)
}
export default  Dashboard