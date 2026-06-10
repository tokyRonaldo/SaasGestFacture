'use client'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { useState,useEffect } from "react"

export default function Client(){
  const [name,setName]=useState('');
  const [company,setCompany]=useState('');
  const [email,setEmail]=useState('');
  const [phone,setPhone]=useState('');
  const [address,setaddress]=useState('');
  const [notes,setNotes]=useState('');

  const [clients,setClients]=useState([]);

  const url = process.env.NEXT_PUBLIC_API_URL;
  const [user, setUser] = useState<any>(null);

  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [paginateFrom, setPaginateFrom] = useState(0);
  const [paginateTo, setPaginateTo] = useState(0);

  const [isEdit,setIsEdit]= useState(false)
  const [editingClient, setEditingClient] = useState<any>(null);
  const [open, setOpen] = useState(false);

  const limit = 5;

  const handleSubmitClient = async (e: any) => {
    e.preventDefault();

    if (!user) return;

    try {
      const payload = {
        name,
        company,
        email,
        phone,
        address,
        notes,
        userId: user.id,
      };

      const urlApi = isEdit
        ? `${url}/client/${editingClient.id}`
        : `${url}/client`;

      const method = isEdit ? "PUT" : "POST";

      const result = await fetch(urlApi, {
        method,
        body: JSON.stringify(payload),
        headers: {
          "content-type": "application/json",
        },
      });

      const response = await result.json();

      if (!result.ok) throw new Error(response.message);

      console.log(response);

      // refresh
      getClient(user.id, page);

      // reset
      setOpen(false);
      setIsEdit(false);
      setEditingClient(null);

    } catch (error: any) {
      console.log("ERROR:", error.message);
    }
  };

  const getClient = async (userId: string, currentPage = 1)=>{
       const result= await fetch(url + `/client/${userId}?page=${currentPage}&limit=${limit}`,{
      method : 'GET',
      headers :{
        'content-type' : 'application/json'
      }
    })

    const response= await result.json();

    if(!result.ok){
      throw new Error('error:' + response.message)
    }
    console.log('------response------');
    console.log(response);
    setClients(response.data);
    setLastPage(response.lastPage);
    setTotal(response.total);
    setPaginateFrom(response.from)
    setPaginateTo(response.to)


  }

  const handleDelete = async (id:string) => {

    try {

      const result = await fetch(`${url}/client/${id}`, {
        method: 'DELETE',
      });

      const response = await result.json();

      if(!result.ok){
        throw new Error(response.message);
      }

      console.log(response);

      // refresh list
      if(user){
        getClient(user.id, page);
      }

    } catch(error:any){
      console.log(error.message);
    }

  }

  const handleEdit=async (client : any)=>{
    //afficher le modal
    setIsEdit(true);
    setEditingClient(client);

    // remplir le formulaire
    setName(client.name);
    setCompany(client.company);
    setEmail(client.email);
    setPhone(client.phone);
    setaddress(client.address);
    setNotes(client.notes);

    // ouvrir modal
    setOpen(true);
  }

  function resetForm(){
    setIsEdit(false);
    setEditingClient(null);
    setName('');
    setCompany('');
    setEmail('');
    setPhone('');
    setaddress('');
    setNotes('');
  }

  useEffect(()=>{
  const userString = localStorage.getItem("user");

  if (userString) {
    const parsedUser = JSON.parse(userString);

    setUser(parsedUser);

    console.log(parsedUser.id);

    getClient(parsedUser.id,page);
  }
  console.log('----------user---------')
  },[page])

    return(
        <div className="p-xl max-w-container-max mx-auto">
<div className="flex justify-between items-end mb-xl">
<div>
<nav className="flex items-center gap-xs text-secondary mb-xs">
<span className="text-label-sm font-label-sm">Dashboard</span>
<span className="material-symbols-outlined text-[14px]" data-icon="chevron_right">chevron_right</span>
<span className="text-label-sm font-label-sm text-primary font-bold">Clients</span>
</nav>
<h2 className="font-h1 text-h1 text-on-surface">Gestion des Clients</h2>
<p className="font-body-md text-on-surface-variant">Gérez votre base de données clients et suivez leurs transactions.</p>
</div>

    <Dialog open={open} onOpenChange={setOpen}>
      {/* TRIGGER */}
      <DialogTrigger className="flex items-center gap-sm bg-primary text-on-primary px-lg py-md rounded-lg font-h3 text-[16px] hover:shadow-lg active:scale-95 transition-all"
        onClick={resetForm}
      >
        <span className="material-symbols-outlined">person_add</span>
        Ajouter un Client
      </DialogTrigger>

      {/* MODAL */}
      <DialogContent className="max-w-[720px] p-0 overflow-hidden rounded-lg border border-outline-variant bg-surface-container-lowest">

        {/* HEADER */}
        <DialogHeader className="p-lg border-b border-outline-variant">
          <DialogTitle className="text-on-surface text-h2 font-h2">
            Ajouter un nouveau client
          </DialogTitle>

          <DialogDescription className="text-secondary text-body-sm mt-xs">
            Saisissez les informations de votre client pour commencer à facturer.
          </DialogDescription>
        </DialogHeader>

        {/* FORM */}
        <form className="p-lg space-y-xl max-h-[70vh] overflow-y-auto" onSubmit={handleSubmitClient}>

          {/* SECTION 1 */}
          <div className="space-y-md">
            <div className="flex items-center gap-sm">
              <span className="material-symbols-outlined text-primary">
                person
              </span>
              <h3 className="uppercase text-primary font-label-caps">
                Informations Générales
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-lg">

              {/* CONTACT */}
              <div className="space-y-xs">
                <label className="text-sm text-on-surface-variant block">
                  Nom du contact
                </label>
                <input
                  type="text"
                  placeholder="Prénom Nom"
                  value={name}
                  onChange={(e)=>{setName(e.target.value)}}
                  className="w-full bg-surface border border-outline-variant rounded-lg px-md py-sm focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              {/* ENTREPRISE */}
              <div className="space-y-xs">
                <label className="text-sm text-on-surface-variant block">
                  Nom de l'entreprise
                </label>
                <input
                  type="text"
                  placeholder="Acme Corp"
                  value={company}
                  onChange={(e)=>{setCompany(e.target.value)}}
                  className="w-full bg-surface border border-outline-variant rounded-lg px-md py-sm focus:ring-2 focus:ring-primary outline-none"
                />
              </div>


              {/* EMAIL */}
              <div className="space-y-xs">
                <label className="text-sm text-on-surface-variant block">
                  Email Professionnel
                </label>
                <input
                  type="email"
                  placeholder="contact@entreprise.com"
                  value={email}
                  onChange={(e)=>{setEmail(e.target.value)}}
                  className="w-full bg-surface border border-outline-variant rounded-lg px-md py-sm focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              {/* TEL */}
              <div className="space-y-xs">
                <label className="text-sm text-on-surface-variant block">
                  Téléphone
                </label>
                <input
                  type="tel"
                  placeholder="+33 00 00 00 00"
                  value={phone}
                  onChange={(e)=>{setPhone(e.target.value)}}
                  className="w-full bg-surface border border-outline-variant rounded-lg px-md py-sm focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

            </div>
          </div>

          <hr className="border-outline-variant" />

          {/* SECTION 2 */}
          <div className="space-y-md">

            <div className="flex items-center gap-sm">
              <span className="material-symbols-outlined text-primary">
                payments
              </span>
              <h3 className="uppercase text-primary font-label-caps">
                Détails de Facturation
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-lg">

              {/* ADRESSE */}
              <div className="col-span-2 space-y-xs">
                <label className="text-sm text-on-surface-variant block">
                  Adresse
                </label>
                <input
                  type="text"
                  placeholder="123 Rue de l'Économie"
                  value={address}
                  onChange={(e)=>{setaddress(e.target.value)}}
                  className="w-full bg-surface border border-outline-variant rounded-lg px-md py-sm focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              {/* VILLE */}
              <div className="space-y-xs">
                <label className="text-sm text-on-surface-variant block">
                  Ville
                </label>
                <input
                  type="text"
                  placeholder="Paris"
                  className="w-full bg-surface border border-outline-variant rounded-lg px-md py-sm focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              {/* CODE POSTAL */}
              <div className="space-y-xs">
                <label className="text-sm text-on-surface-variant block">
                  Code Postal
                </label>
                <input
                  type="text"
                  placeholder="75001"
                  className="w-full bg-surface border border-outline-variant rounded-lg px-md py-sm focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              {/* PAYS */}
              <div className="space-y-xs col-span-2">
                <label className="text-sm text-on-surface-variant block">
                  Pays
                </label>
                <select className="w-full bg-surface border border-outline-variant rounded-lg px-md py-sm">
                  <option>France</option>
                  <option>Belgique</option>
                  <option>Suisse</option>
                </select>
              </div>

              {/* NOTE */}
              <div className="space-y-xs col-span-2">
                <label className="text-sm text-on-surface-variant block">
                  Note
                </label>
                <textarea
                  name="note"
                  id="note"
                  value={notes}
                  className="w-full bg-surface border border-outline-variant rounded-lg px-md py-sm focus:ring-2 focus:ring-primary outline-none"
                  onChange={(e) => setNotes(e.target.value)}
                ></textarea>
              </div>

            </div>
          </div>

          {/* FOOTER */}
          <DialogFooter className="flex justify-end gap-md pt-lg border-t border-outline-variant">

            <DialogClose asChild>
              <button className="px-lg py-sm text-secondary hover:text-on-surface">
                Annuler
              </button>
            </DialogClose>

            <button
              type="submit"
              className="bg-primary-container text-on-primary px-xl py-sm rounded-lg font-bold hover:shadow-md active:scale-95"
            >
              Enregistrer le client
            </button>
          </DialogFooter>

        </form>
      </DialogContent>
    </Dialog>
</div>
<div className="grid grid-cols-1 md:grid-cols-4 gap-lg mb-xl">
<div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow">
<div className="flex justify-between items-start mb-md">
<span className="p-2 bg-primary-fixed text-on-primary-fixed rounded-lg">
<span className="material-symbols-outlined" data-icon="group">group</span>
</span>
<span className="text-on-tertiary-fixed-variant font-label-caps text-[10px] bg-tertiary-fixed px-2 py-1 rounded-full">+12% ce mois</span>
</div>
<p className="text-secondary font-label-sm mb-xs">Total Clients</p>
<h3 className="font-h2 text-h2 text-on-surface">1,284</h3>
</div>
<div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant shadow-sm">
<div className="flex justify-between items-start mb-md">
<span className="p-2 bg-secondary-container text-on-secondary-container rounded-lg">
<span className="material-symbols-outlined" data-icon="payments">payments</span>
</span>
</div>
<p className="text-secondary font-label-sm mb-xs">Total Facturé</p>
<h3 className="font-h2 text-h2 text-on-surface">452,890.00 €</h3>
</div>
<div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant shadow-sm">
<div className="flex justify-between items-start mb-md">
<span className="p-2 bg-error-container text-on-error-container rounded-lg">
<span className="material-symbols-outlined" data-icon="pending_actions">pending_actions</span>
</span>
</div>
<p className="text-secondary font-label-sm mb-xs">En attente</p>
<h3 className="font-h2 text-h2 text-error">12,450.00 €</h3>
</div>
<div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant shadow-sm overflow-hidden relative">
<div className="absolute -right-4 -bottom-4 opacity-10">
<span className="material-symbols-outlined text-[120px]" data-icon="monitoring">monitoring</span>
</div>
<div className="flex justify-between items-start mb-md">
<span className="p-2 bg-tertiary-container text-on-tertiary-container rounded-lg">
<span className="material-symbols-outlined" data-icon="trending_up">trending_up</span>
</span>
</div>
<p className="text-secondary font-label-sm mb-xs">Conversion Devis</p>
<h3 className="font-h2 text-h2 text-on-surface">68%</h3>
</div>
</div>
<div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden shadow-sm">
<div className="p-lg flex flex-wrap items-center justify-between gap-md border-b border-outline-variant bg-surface-container-low">
<div className="flex items-center gap-md">
<button className="flex items-center gap-xs px-md py-sm bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm hover:bg-surface-container-high transition-colors">
<span className="material-symbols-outlined text-[18px]" data-icon="filter_list">filter_list</span>
                            Filtres
                        </button>
<div className="h-6 w-[1px] bg-outline-variant"></div>
<div className="flex gap-xs">
<span className="px-3 py-1 bg-primary text-on-primary text-label-sm rounded-full cursor-pointer">Tous</span>
<span className="px-3 py-1 bg-surface-container-highest text-on-surface-variant text-label-sm rounded-full cursor-pointer hover:bg-outline-variant">Actifs</span>
<span className="px-3 py-1 bg-surface-container-highest text-on-surface-variant text-label-sm rounded-full cursor-pointer hover:bg-outline-variant">Inactifs</span>
</div>
</div>
<div className="flex items-center gap-sm">
<span className="text-body-sm text-secondary">Trier par:</span>
<select className="bg-transparent border-none text-body-sm font-bold text-primary focus:ring-0 cursor-pointer">
<option>Plus récents</option>
<option>Total Facturé</option>
<option>Nom (A-Z)</option>
</select>
</div>
</div>
<div className="overflow-x-auto">
<table className="w-full text-left border-collapse">
<thead className="bg-surface-container-low">
<tr>
<th className="px-lg py-md text-label-caps text-secondary font-semibold border-b border-outline-variant">Nom</th>
<th className="px-lg py-md text-label-caps text-secondary font-semibold border-b border-outline-variant">Entreprise</th>
<th className="px-lg py-md text-label-caps text-secondary font-semibold border-b border-outline-variant">Email</th>
<th className="px-lg py-md text-label-caps text-secondary font-semibold border-b border-outline-variant text-right">Total Facturé</th>
<th className="px-lg py-md text-label-caps text-secondary font-semibold border-b border-outline-variant">Status</th>
<th className="px-lg py-md text-label-caps text-secondary font-semibold border-b border-outline-variant text-center">Actions</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant">
  {
    clients.map((client:any ,index:number)=>(
    <tr className="hover:bg-surface-container-low transition-colors group">
    <td className="px-lg py-md">
    <div className="flex items-center gap-md">
    <div className="w-9 h-9 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center font-bold text-label-sm">{client.name?.slice(0,2).toUpperCase()}</div>
    <span className="font-body-md text-on-surface">{client.name}</span>
    </div>
    </td>
    <td className="px-lg py-md font-body-md text-on-surface-variant">{client.company || ''}</td>
    <td className="px-lg py-md font-body-md text-secondary">{client.email}</td>
    <td className="px-lg py-md font-body-md text-on-surface text-right font-bold">12,450.00 €</td>
    <td className="px-lg py-md">
    <span className="px-3 py-1 bg-green-100 text-green-800 text-[11px] font-bold rounded-full uppercase tracking-tighter">Actif</span>
    </td>
    <td className="px-lg py-md text-center">
    <DropdownMenu>

      <DropdownMenuTrigger asChild>
        <button className="p-2 text-outline hover:text-primary transition-colors">
          <span className="material-symbols-outlined">
            more_vert
          </span>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-44">

        <DropdownMenuGroup>

          {/* EDIT */}
          <DropdownMenuItem
            onClick={() => handleEdit(client)}
            className="cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px] mr-2">
              edit
            </span>

            Modifier
          </DropdownMenuItem>

          {/* DELETE */}
          <DropdownMenuItem
            onClick={() => handleDelete(client.id)}
            className="cursor-pointer text-red-500 focus:text-red-500"
          >
            <span className="material-symbols-outlined text-[18px] mr-2">
              delete
            </span>

            Supprimer
          </DropdownMenuItem>

        </DropdownMenuGroup>

      </DropdownMenuContent>

    </DropdownMenu>
    </td>
    </tr>

    ))
  }
{/*<tr className="hover:bg-surface-container-low transition-colors group">
<td className="px-lg py-md">
<div className="flex items-center gap-md">
<div className="w-9 h-9 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center font-bold text-label-sm">JD</div>
<span className="font-body-md text-on-surface">Jean Dupont</span>
</div>
</td>
<td className="px-lg py-md font-body-md text-on-surface-variant">Dupont Solutions Ltd.</td>
<td className="px-lg py-md font-body-md text-secondary">jean.dupont@solutions.fr</td>
<td className="px-lg py-md font-body-md text-on-surface text-right font-bold">12,450.00 €</td>
<td className="px-lg py-md">
<span className="px-3 py-1 bg-green-100 text-green-800 text-[11px] font-bold rounded-full uppercase tracking-tighter">Actif</span>
</td>
<td className="px-lg py-md text-center">
<button className="p-2 text-outline hover:text-primary transition-colors">
<span className="material-symbols-outlined" data-icon="more_vert">more_vert</span>
</button>
</td>
</tr>
<tr className="hover:bg-surface-container-low transition-colors group">
<td className="px-lg py-md">
<div className="flex items-center gap-md">
<img alt="Client Avatar" className="w-9 h-9 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB71tVpPPyKP6O6CXxZzG16viC2MFaInIYT_ak0_cPMhKC_ih75QIfoweJZe_uIvoooHWOfvPpru87v3J_BV1EBdZtVAr57ooU8h1-kG3qtjRVOTMq30OwONm_-VHSeIs8XPBbN1r80lKYM1__983lJu2JhcaNwtPlmibbhU0eNU_82bybaNAWlRiYbswhIuimCYiSgdQYXVdGcVGvJsuumqQIa02LhtyqOOBC_E3J7QILpBRrJhDb17PWCEssVWJs2izTo39TeUCsj"/>
<span className="font-body-md text-on-surface">Alice Martin</span>
</div>
</td>
<td className="px-lg py-md font-body-md text-on-surface-variant">Martin &amp; Co Design</td>
<td className="px-lg py-md font-body-md text-secondary">a.martin@design.com</td>
<td className="px-lg py-md font-body-md text-on-surface text-right font-bold">8,920.50 €</td>
<td className="px-lg py-md">
<span className="px-3 py-1 bg-green-100 text-green-800 text-[11px] font-bold rounded-full uppercase tracking-tighter">Actif</span>
</td>
<td className="px-lg py-md text-center">
<button className="p-2 text-outline hover:text-primary transition-colors">
<span className="material-symbols-outlined" data-icon="more_vert">more_vert</span>
</button>
</td>
</tr>
<tr className="hover:bg-surface-container-low transition-colors group">
<td className="px-lg py-md">
<div className="flex items-center gap-md">
<div className="w-9 h-9 rounded-full bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center font-bold text-label-sm">RL</div>
<span className="font-body-md text-on-surface">Robert Leroy</span>
</div>
</td>
<td className="px-lg py-md font-body-md text-on-surface-variant">Leroy Logistique</td>
<td className="px-lg py-md font-body-md text-secondary">r.leroy@logistique.fr</td>
<td className="px-lg py-md font-body-md text-on-surface text-right font-bold">34,100.00 €</td>
<td className="px-lg py-md">
<span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-[11px] font-bold rounded-full uppercase tracking-tighter">En Pause</span>
</td>
<td className="px-lg py-md text-center">
<button className="p-2 text-outline hover:text-primary transition-colors">
<span className="material-symbols-outlined" data-icon="more_vert">more_vert</span>
</button>
</td>
</tr>
<tr className="hover:bg-surface-container-low transition-colors group">
<td className="px-lg py-md">
<div className="flex items-center gap-md">
<img alt="Client Avatar" className="w-9 h-9 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrBJqL1DjZkpxHqiyeBc40t_WCSu23zJAguWcaheA7H3OPa8lLCGtxhdWGexox7qx7sweyH2jLnUac7zp6SGiNgNrgerJXy6xaZPKRKrxR7LqmnapO4BusfonZ3I-MoD7LLqAT8dY9p5ksbpqxcsaYVzPibDk_wSJS3QIJZQGGjk-peYSPAQ_ze_G-bjmvEObVYwSGmK-RPVJvLyQQvxBvmN6PMuit3XvQ40fYL5plifxKz7Gk8VvVIOGI_lgD4cF58RwItyChK4US"/>
<span className="font-body-md text-on-surface">Sophie Bernard</span>
</div>
</td>
<td className="px-lg py-md font-body-md text-on-surface-variant">Auto-Entrepreneur</td>
<td className="px-lg py-md font-body-md text-secondary">sophie.b@gmail.com</td>
<td className="px-lg py-md font-body-md text-on-surface text-right font-bold">2,150.00 €</td>
<td className="px-lg py-md">
<span className="px-3 py-1 bg-green-100 text-green-800 text-[11px] font-bold rounded-full uppercase tracking-tighter">Actif</span>
</td>
<td className="px-lg py-md text-center">
<button className="p-2 text-outline hover:text-primary transition-colors">
<span className="material-symbols-outlined" data-icon="more_vert">more_vert</span>
</button>
</td>
</tr>
<tr className="hover:bg-surface-container-low transition-colors group">
<td className="px-lg py-md">
<div className="flex items-center gap-md">
<div className="w-9 h-9 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center font-bold text-label-sm">MP</div>
<span className="font-body-md text-on-surface">Michel Petit</span>
</div>
</td>
<td className="px-lg py-md font-body-md text-on-surface-variant">Boucherie du Centre</td>
<td className="px-lg py-md font-body-md text-secondary">m.petit@boucherie.net</td>
<td className="px-lg py-md font-body-md text-on-surface text-right font-bold">0.00 €</td>
<td className="px-lg py-md">
<span className="px-3 py-1 bg-gray-200 text-gray-700 text-[11px] font-bold rounded-full uppercase tracking-tighter">Inactif</span>
</td>
<td className="px-lg py-md text-center">
<button className="p-2 text-outline hover:text-primary transition-colors">
<span className="material-symbols-outlined" data-icon="more_vert">more_vert</span>
</button>
</td>
</tr>*/}
</tbody>
</table>
</div>
<div className="p-lg border-t border-outline-variant flex items-center justify-between">
<span className="text-body-sm text-secondary">Affichage de {paginateFrom} à {paginateTo} sur {total} clients</span>
<div className="flex items-center justify-between gap-2">

  <span className="text-body-sm text-secondary">
    Page {page} sur {lastPage}
  </span>

  <div className="flex items-center gap-xs">

    {/* PREVIOUS */}
    <button
      disabled={page === 1}
      onClick={() => setPage(page - 1)}
      className="w-9 h-9 flex items-center justify-center rounded-lg border border-outline-variant hover:bg-surface-container-high transition-colors text-secondary"
    >
      <span className="material-symbols-outlined text-[20px]" data-icon="chevron_left">chevron_left</span>
    </button>

    {/* PAGE NUMBERS */}
    {
      [...Array(lastPage)].map((_, index) => (

        <button
          key={index}
          onClick={() => setPage(index + 1)}
          className={`w-9 h-9 rounded-lg ${
            page === index + 1
              ? 'bg-primary text-white'
              : 'border border-outline-variant'
          }`}
        >
          {index + 1}
        </button>

      ))
    }

    {/* NEXT */}
    <button
      disabled={page === lastPage}
      onClick={() => setPage(page + 1)}
      className="w-9 h-9 flex items-center justify-center rounded-lg border border-outline-variant hover:bg-surface-container-high transition-colors text-secondary"
    >
      <span className="material-symbols-outlined text-[20px]" data-icon="chevron_right">chevron_right</span>
    </button>

  </div>
</div>
{/*<div className="flex items-center gap-xs">
<button className="w-9 h-9 flex items-center justify-center rounded-lg border border-outline-variant hover:bg-surface-container-high transition-colors text-secondary">
<span className="material-symbols-outlined text-[20px]" data-icon="chevron_left">chevron_left</span>
</button>
<button className="w-9 h-9 flex items-center justify-center rounded-lg bg-primary text-on-primary font-bold">1</button>
<button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-surface-container-high transition-colors">2</button>
<button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-surface-container-high transition-colors">3</button>
<span className="px-sm text-secondary">...</span>
<button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-surface-container-high transition-colors">257</button>
<button className="w-9 h-9 flex items-center justify-center rounded-lg border border-outline-variant hover:bg-surface-container-high transition-colors text-secondary">
<span className="material-symbols-outlined text-[20px]" data-icon="chevron_right">chevron_right</span>
</button>
</div>*/}
</div>
</div>
<div className="mt-xl grid grid-cols-1 lg:grid-cols-3 gap-xl">
<div className="lg:col-span-2 relative h-[300px] rounded-xl overflow-hidden border border-outline-variant shadow-sm group">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" data-alt="A clean, highly detailed stylized vector map of France with glowing blue data points indicating client locations. The aesthetic is professional and corporate with high-key lighting and soft shadows. Minimalist icons and thin line art connect major cities, using a color palette of slate gray, navy blue, and bright electric blue highlights." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBA9RAAUMeYHt-AEr6TMZM6bRlmG7Z4r7bfa3JD40HpscY7LUO0xMeDUV2ho8jdQgYrbhTQN-CA5Wdq67f5Ks4n_gDHNagw-gDxEigAqVpkwNYZxVT8aOTJsf15kF5IG210BCQVUErC-OIHTXzJc0QOZ4UxKlkhVBFRNOhGbc488wgkpP6PryQ-JBx_VIO6lEngFV1ImPnZXyt0nkNr0_Pg-cbsw-MSzIFaq57fGhTABrslT_7mEA0Zo2Kk3eFI9FTe-uQJb-N0XJuj"/>
<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-xl">
<div>
<h4 className="text-white font-h2 text-h2 mb-xs">Répartition Géographique</h4>
<p className="text-white/80 text-body-sm">Visualisez la densité de votre clientèle à travers le pays.</p>
</div>
</div>
<div className="absolute top-4 right-4 bg-surface-container-lowest/90 backdrop-blur-md p-md rounded-lg border border-outline-variant">
<div className="flex flex-col gap-sm">
<div className="flex items-center gap-sm">
<div className="w-3 h-3 rounded-full bg-primary"></div>
<span className="text-label-sm font-bold">Paris (42%)</span>
</div>
<div className="flex items-center gap-sm">
<div className="w-3 h-3 rounded-full bg-tertiary"></div>
<span className="text-label-sm font-bold">Lyon (18%)</span>
</div>
</div>
</div>
</div>
<div className="bg-primary text-on-primary p-xl rounded-xl flex flex-col justify-center shadow-lg relative overflow-hidden">
<div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
<span className="material-symbols-outlined text-[48px] mb-lg" data-icon="insights">insights</span>
<h4 className="font-h2 text-h2 mb-md">Client du mois</h4>
<div className="flex items-center gap-md mb-xl">
<img alt="Featured Client" className="w-14 h-14 rounded-full border-2 border-white/20" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAorIjrWWQBvnS8keCg1e6NfnMyJY8X5-IQeWQIfyw4Gd-dyGXiy0Qj4EMEQFRSl8bw2W0_4xoDXW1AZdlqcBd1fAdrEx4xBBBRmJh89ndAPXfSgwSK2JZbU0tdH_U6_Ag37OnRMCjJH78HwmiaTkoDH5tyfa5CNrCL48yDEP8kS8ScGRRYqlkN23LRMo7E5w4C_zDztbivTcbEcPFiiy2oJcwOi4AeModXZ2XGLARhZVTz_5G9vQrcaRV54QVF7y2ukwAie163m16x"/>
<div>
<p className="font-bold text-body-lg">Dupont Solutions Ltd.</p>
<p className="text-on-primary-container text-body-sm">4 Factures réglées cette semaine</p>
</div>
</div>
<button className="w-full bg-white text-primary font-bold py-md rounded-lg hover:bg-opacity-90 transition-all active:scale-95">
                        Voir le profil complet
                    </button>
</div>
</div>
</div>
    )
}