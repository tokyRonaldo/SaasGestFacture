'use client'
import { useEffect,useState, useRef } from "react"
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

import { X, Plus } from "lucide-react"
import { useSearchParams } from "next/navigation";


export default function CreateQuote(){
  
    const searchParams = useSearchParams();

    const [clients,setClients] = useState<any[]>([]);
    const [client, setClient] = useState<string | null>(null);

    const [editMode, setEditMode] = useState(false);
    const [quoteId, setQuoteId] = useState<string | null>(null);

    const dropdownRef = useRef<any>(null)

    const [openModalClient,setOpenModalClient]= useState(false);
    const [openModalQuote,setOpenModalQuote]=useState(false);

    const[notes,setNotes]=useState('')
    const[billingAddress,setBillingAddress]=useState('')
    const[conditionPayement,setConditionPayement]=useState('')
    const[discount,setDiscount]=useState('')
    const[total,setTotal]=useState('')
    const[issueDate,setIssueDate]=useState('2023-10-27')
    const[expiryDate,setExpiryDate]=useState('2023-11-27')

    const [nameClient,setNameClient]=useState('');
    const [companyClient,setCompanyClient]=useState('');
    const [emailClient,setEmailClient]=useState('');
    const [phoneClient,setPhoneClient]=useState('');
    const [addressClient,setaddressClient]=useState('');
    const [notesClient,setNotesClient]=useState('');

    //quote items
    const [labelItem,setLabelItem]=useState(''); 
    const [descriptionItem,setDescriptionItem]=useState(''); 
    const [priceItem,setPriceItem]=useState(''); 
    const [quantityItem,setQuantityItem]=useState(''); 
    const [totalItem,setTotalItem]=useState(0.00); 
    const [quoteItems,setQuoteItems] = useState<any[]>([]);

    


    const url = process.env.NEXT_PUBLIC_API_URL;
    const [user, setUser] = useState<any>(null);

    const getClient = async (userId: string,)=>{
        const result= await fetch(url + `/client/all/${userId}`,{
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
        setClients(response)


  }


  const [search, setSearch] = useState('');
  const [showList, setShowList] = useState(false);


  // filtrage
  const filteredClients = clients.filter((client) =>
    client.name?.toLowerCase().includes(search?.toLowerCase() || '')
  );

  // selection
  const handleSelect = (client: any) => {
      setSearch(client.name);
      setShowList(false);
      setClient(client.id)

      console.log('client selected', client.id);
  };


  const handleSubmitClient = async (e: any) => {
      e.preventDefault();

      if (!user) return;

      try {
        const payload = {
          'name' :nameClient,
          'company' :companyClient,
          'email': emailClient,
          'phone' : phoneClient,
          'address': addressClient,
          'notes': notesClient,
          userId: user.id,
        };

        const urlApi =  `${url}/client`;
        const result = await fetch(urlApi, {
          method: 'POST',
          body: JSON.stringify(payload),
          headers: {
            "content-type": "application/json",
          },
        });

        const response = await result.json();

        if (!result.ok) throw new Error(response.message);

        console.log(response);

        // refresh
        getClient(user.id);
        
        handleSelect(response);

        // reset
        setOpenModalClient(false);

      } catch (error: any) {
        console.log("ERROR:", error.message);
      }
    };


    const hanldeSubmitQuote = async (e: any) => {
      e.preventDefault();

      if (!user) return;

      try {
        const payload = {
          notes,
          billingAddress,
          condition_payement: conditionPayement,
          discount,
          issueDate,
          expiryDate,
          total,
          clientId: client,
          items: quoteItems,
        };

        const endpoint = editMode
          ? `${url}/quote/${quoteId}`
          : `${url}/quote`;

        const method = editMode ? "PUT" : "POST";

        const result = await fetch(endpoint, {
          method,
          body: JSON.stringify(
            editMode
              ? payload
              : { ...payload, userId: user.id }
          ),
          headers: {
            "content-type": "application/json",
          },
        });

        const response = await result.json();

        if (!result.ok) throw new Error(response.message);

        console.log(response);

        // reset / redirect
        if (editMode) {
          alert("Devis mis à jour !");
        } else {
          alert("Devis créé !");
        }

      } catch (error: any) {
        console.log("ERROR:", error.message);
      }
    };
    const handleSubmitQuoteItem= async() =>{

      const dataQuoteItem={
        label : labelItem,
        description : descriptionItem,
        quantity : Number(quantityItem),
        unitPrice :Number( priceItem),
        total : totalItem
      }
      console.log(quoteItems)
      console.log('quoteItems')
      setQuoteItems(prev=>[...prev, dataQuoteItem])
      setOpenModalQuote(false)


    }

    const handleDeleteItem = (indexToDelete: number) => {

      setQuoteItems(prev =>
        prev.filter((_, index) => index !== indexToDelete)
      )

    }


    function resetForm(){
      setNameClient('');
      setCompanyClient('');
      setEmailClient('');
      setPhoneClient('');
      setaddressClient('');
      setNotesClient('');

      setLabelItem('');
      setDescriptionItem('');
      setQuantityItem('');
      setPriceItem('');
      setTotalItem(0.00);
    }

    function calculeTotal(){
      console.log(quoteItems.length)
      console.log('quoteItems.length')
      const totalSum = quoteItems.length
      ? quoteItems.reduce((sum, item) => sum + (item.total || 0), 0)
      : 0;
      setTotal(totalSum)
    }


    const loadQuoteForEdit = async (id: string) => {
      try {
        const res = await fetch(`${url}/quote/quote/${id}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.message);

        const q = data;

        setQuoteId(q.id);
        setEditMode(true);

        // remplir form
        setNotes(q.notes || '');
        setBillingAddress(q.billingAddress || '');
        setConditionPayement(q.condition_payement || '');
        setDiscount(q.discount || '');
        setTotal(q.total || 0);
        setIssueDate(q.issueDate?.split("T")[0]);
        setExpiryDate(q.expiryDate?.split("T")[0]);

        setClient(q.clientId);

        setQuoteItems(q.items || []);

        // client affiché
        setSearch(q.client?.name || '');

      } catch (err) {
        console.error(err);
      }
    };


    useEffect(()=>{
        const userString = localStorage.getItem("user");

        if (userString) {
            const parsedUser = JSON.parse(userString);

            setUser(parsedUser);

            console.log(parsedUser.id);

            getClient(parsedUser.id);

            calculeTotal()
        }
    },[])

    // fermeture si clic extérieur
  useEffect(() => {

    const handleClickOutside = (event:any) => {

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowList(false);
      }

    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };

  }, []);

  useEffect(() => {

  setTotalItem(
    Number(priceItem) * Number(quantityItem)
  )

}, [priceItem, quantityItem])

useEffect(() => {
  calculeTotal();
}, [quoteItems]);

useEffect(() => {
  const id = searchParams.get("id");

  if (id) {
    loadQuoteForEdit(id);
  }
}, []);

    return(
        <form className="max-w-[1000px] mx-auto space-y-lg" onSubmit={hanldeSubmitQuote}>
<div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-xl flex justify-between items-start">
<div className="space-y-md">
<div className="w-20 h-20 bg-primary-container/10 rounded-lg flex items-center justify-center border border-primary/20">
<span className="material-symbols-outlined text-primary text-[40px]" data-icon="apartment">apartment</span>
</div>
<div>
<h3 className="font-h2 text-on-surface">Gestion S.A.</h3>
<p className="text-secondary font-body-sm">8 rue de l'Innovation, 75001 Paris</p>
<p className="text-secondary font-body-sm">contact@gestionsa.fr</p>
</div>
</div>
<div className="text-right space-y-sm">
<h1 className="font-display-lg text-display-lg text-primary-container opacity-20 select-none">DEVIS</h1>
<div className="flex flex-col items-end gap-xs">
{/*<label className="font-label-caps text-secondary">NUMÉRO DE DEVIS</label>
<input className="text-right border-none bg-surface-container p-0 px-sm font-h3 w-40 rounded" readOnly type="text" value="QT-2023-0042"/>*/}
</div>
</div>
</div>
<div className="grid grid-cols-12 gap-lg">
<div className="col-span-12 lg:col-span-7 bg-surface-container-lowest border border-outline-variant rounded-xl p-lg flex flex-col gap-md">
<div className="flex items-center justify-between">
<h4 className="font-h3 text-on-surface flex items-center gap-sm">
<span className="material-symbols-outlined text-primary" data-icon="person">person</span>
                            Informations Client
                        </h4>

  <Dialog open={openModalClient} onOpenChange={setOpenModalClient}>
      {/* TRIGGER */}
      <DialogTrigger className="text-primary font-label-sm hover:underline"
        onClick={resetForm}
      >
        + Nouveau Client
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
        <div className="p-lg space-y-xl max-h-[70vh] overflow-y-auto" >

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
                  value={nameClient}
                  onChange={(e)=>{setNameClient(e.target.value)}}
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
                  value={companyClient}
                  onChange={(e)=>{setCompanyClient(e.target.value)}}
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
                  value={emailClient}
                  onChange={(e)=>{setEmailClient(e.target.value)}}
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
                  value={phoneClient}
                  onChange={(e)=>{setPhoneClient(e.target.value)}}
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
                  value={addressClient}
                  onChange={(e)=>{setaddressClient(e.target.value)}}
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
              type="button"
              className="bg-primary-container text-on-primary px-xl py-sm rounded-lg font-bold hover:shadow-md active:scale-95"
              onClick={handleSubmitClient}
            >
              Enregistrer le client
            </button>
          </DialogFooter>

        </div>
      </DialogContent>
    </Dialog>

</div>
<div className="space-y-md">
<div className="flex flex-col gap-xs relative w-full"
ref={dropdownRef}
>
      <label className="font-label-sm text-secondary px-xs">
        Sélectionner un client
      </label>

      {/* INPUT */}
      <input
        type="text"
        value={search}
        placeholder="Rechercher un client..."
        onChange={(e) => {
          setSearch(e.target.value);
          setShowList(true);
        }}
        onFocus={() => setShowList(true)}
        className="w-full bg-surface border border-outline-variant rounded-lg px-md py-sm font-body-md outline-none focus:ring-2 focus:ring-primary"
      />

      {/* LIST */}
      {
        showList && (
          <div className="absolute top-[80px] left-0 w-full bg-white border border-outline-variant rounded-lg shadow-lg max-h-[220px] overflow-y-auto z-50">

            {
              filteredClients.length > 0 ? (

                filteredClients.map((client) => (

                  <div
                    key={client.id}
                    onClick={() => handleSelect(client)}
                    className="px-md py-sm cursor-pointer hover:bg-surface-container-high transition-colors"
                  >
                    {client.name}
                  </div>

                ))

              ) : (

                <div className="px-md py-sm text-secondary">
                  Aucun client trouvé
                </div>

              )
            }

          </div>
        )
      }
</div>
<div className="grid grid-cols-2 gap-md">
<div className="space-y-xs opacity-50">
<label className="font-label-sm text-secondary px-xs">Adresse de facturation</label>
<textarea className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-sm font-body-sm h-24" placeholder="L'adresse s'affichera ici..." 
value={billingAddress}
onChange={(e)=>{setBillingAddress(e.target.value)}}
></textarea>
</div>
<div className="space-y-xs opacity-50">
<label className="font-label-sm text-secondary px-xs">Notes privées</label>
<textarea className="w-full bg-surface border border-outline-variant rounded-lg px-md py-sm font-body-sm h-24" placeholder="Ajouter une note interne..."
value={notes}
onChange={(e)=>{setNotes(e.target.value)}}
></textarea>
</div>
</div>
</div>
</div>
<div className="col-span-12 lg:col-span-5 bg-surface-container-lowest border border-outline-variant rounded-xl p-lg flex flex-col gap-md">
<h4 className="font-h3 text-on-surface flex items-center gap-sm">
<span className="material-symbols-outlined text-primary" data-icon="event">event</span>
                        Dates &amp; Conditions
                    </h4>
<div className="space-y-md">
<div className="flex flex-col gap-xs">
<label className="font-label-sm text-secondary px-xs">Date d'émission</label>
<input className="w-full bg-surface border border-outline-variant rounded-lg px-md py-sm font-body-md" type="date" 
value={issueDate}
onChange={(e)=>{setIssueDate(e.target.value)}}
/>
</div>
<div className="flex flex-col gap-xs">
<label className="font-label-sm text-secondary px-xs">Date d'expiration</label>
<input className="w-full bg-surface border border-outline-variant rounded-lg px-md py-sm font-body-md" type="date" 
value={expiryDate}
onChange={(e)=>{setExpiryDate(e.target.value)}}
/>
</div>
<div className="flex flex-col gap-xs">
<label className="font-label-sm text-secondary px-xs">Devise</label>
<select className="w-full bg-surface border border-outline-variant rounded-lg px-md py-sm font-body-md"
onChange={(e)=>{setDiscount(e.target.value)}}

>
<option value="EUR">Euro (€)</option>
<option value="USD">Dollar ($)</option>
</select>
</div>
</div>
</div>
</div>
<div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
<div className="bg-surface-container-low px-lg py-sm border-b border-outline-variant">
<h4 className="font-h3 text-on-surface">Lignes d'articles</h4>
</div>
<table className="w-full text-left border-collapse">
<thead>
<tr className="bg-surface-container-lowest">
<th className="px-lg py-md font-label-caps text-secondary border-b border-outline-variant">Label</th>
<th className="px-lg py-md font-label-caps text-secondary border-b border-outline-variant w-32">Qté</th>
<th className="px-lg py-md font-label-caps text-secondary border-b border-outline-variant w-40">Prix Unitaire</th>
<th className="px-lg py-md font-label-caps text-secondary border-b border-outline-variant w-40 text-right">Total HT</th>
<th className="px-lg py-md font-label-caps text-secondary border-b border-outline-variant w-16"></th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant">
  {quoteItems.map((quoteItem,index)=>(

    <tr className="hover:bg-surface-container-low transition-colors group"
    key={index}
    >
    <td className="px-lg py-md">
    <input className="w-full border-none p-0 bg-transparent font-body-md focus:ring-0" type="text" 
    value={quoteItem.label}
    readOnly
    />
    </td>
    <td className="px-lg py-md">
    <input className="w-full bg-surface border border-outline-variant rounded px-sm py-xs font-body-md" type="number" 
    value={quoteItem.quantity}    
    readOnly
    />
    </td>
    <td className="px-lg py-md">
    <input className="w-full bg-surface border border-outline-variant rounded px-sm py-xs font-body-md" type="number" 
    value={quoteItem.unitPrice}    
    readOnly
    />
    </td>
    <td className="px-lg py-md text-right font-body-md font-bold">{quoteItem.total} €</td>
    <td className="px-lg py-md text-right">
    <button className="text-error opacity-0 group-hover:opacity-100 transition-opacity" type="button"
    onClick={()=>{handleDeleteItem(index)}}
    >
    <span className="material-symbols-outlined" data-icon="delete">delete</span>
    </button>
    </td>
    </tr>
  ))}
</tbody>
</table>
<div className="p-lg bg-surface-container-lowest">

  <Dialog open={openModalQuote} onOpenChange={setOpenModalQuote}>

      {/* TRIGGER */}
      <DialogTrigger asChild>
          <button className="flex items-center gap-sm text-primary font-label-caps hover:bg-primary-container/10 px-md py-sm rounded-lg transition-colors" type="button"
          onClick={resetForm}
          >
            <span className="material-symbols-outlined" data-icon="add">add</span>
                AJOUTER UNE LIGNE
          </button>

      </DialogTrigger>

      {/* MODAL */}
      <DialogContent className="max-w-[600px] p-0 overflow-hidden rounded-xl">

        {/* HEADER */}
        <DialogHeader className="px-xl py-lg border-b flex justify-between items-center">
          <DialogTitle className="text-h2 font-semibold">
            Ajouter une ligne d'article
          </DialogTitle>

          <button onClick={() => setOpenModalQuote(false)}>
            <X className="w-5 h-5 text-secondary" />
          </button>
        </DialogHeader>

        {/* BODY */}
        <div className="p-xl space-y-lg">

          {/* Libellé */}
          <div className="space-y-xs">
            <label className="text-sm text-secondary">Libellé</label>
            <input
              className="w-full h-12 px-3 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
              placeholder="Ex: Licence SaaS"
              value={labelItem}
              onChange={(e)=>{setLabelItem(e.target.value)}}
            />
          </div>

          {/* Description */}
          <div className="space-y-xs">
            <label className="text-sm text-secondary">Description</label>
            <textarea
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary outline-none resize-none"
              rows={3}
              placeholder="Détails..."
              value={descriptionItem}
              onChange={(e)=>{setDescriptionItem(e.target.value)}}
            />
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 gap-lg">

            {/* Quantité */}
            <div className="space-y-xs">
              <label className="text-sm text-secondary">Quantité</label>

              <div className="relative">
                <input
                  type="number"
                  className="w-full h-12 px-3 border rounded-lg"
                  value={quantityItem}
                  onChange={(e)=>{setQuantityItem(e.target.value);}}
                />

              </div>
            </div>

            {/* Prix */}
            <div className="space-y-xs">
              <label className="text-sm text-secondary">Prix Unitaire</label>

              <div className="relative">
                <input
                  type="number"
                  className="w-full h-12 px-3 pr-10 border rounded-lg text-right"
                  placeholder="0.00"
                  value={priceItem}
                  onChange={(e)=>{setPriceItem(e.target.value);}}
                />
                <span className="absolute right-3 top-3 text-secondary">
                  €
                </span>
              </div>
            </div>

          </div>

          {/* TOTAL */}
          <div className="flex justify-between items-center p-4 rounded-lg border bg-surface">
            <div>
              <p className="text-xs uppercase text-secondary">
                Total HT estimé
              </p>
              <p className="text-sm text-secondary">
                Calcul automatique
              </p>
            </div>

            <div className="text-xl font-bold text-primary">
              {totalItem} €
            </div>
          </div>

        </div>

        {/* FOOTER */}
        <DialogFooter className="p-xl border-t flex justify-end gap-3">

          <button
            onClick={() => {setOpenModalQuote(false)}}
            className="px-4 py-2 border rounded-lg"
            type="button"
          >
            Annuler
          </button>

          <button className="px-4 py-2 bg-primary text-white rounded-lg flex items-center gap-2"
            onClick={() => {
              handleSubmitQuoteItem();
              calculeTotal()
            }}
          >
            <Plus size={18} />
            Ajouter
          </button>

        </DialogFooter>

      </DialogContent>
    </Dialog>
</div>
</div>
<div className="grid grid-cols-12 gap-lg items-end">
<div className="col-span-12 lg:col-span-7 bg-surface-container-lowest border border-outline-variant rounded-xl p-lg h-full">
<label className="font-label-sm text-secondary px-xs block mb-sm">Conditions de paiement &amp; Mentions légales</label>
<textarea className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-sm font-body-sm h-32" placeholder="Ex: Paiement à 30 jours dès réception de facture. TVA non applicable, art. 293 B du CGI..."
value={conditionPayement}
onChange={(e)=>{setConditionPayement(e.target.value)}}
></textarea>
</div>
<div className="col-span-12 lg:col-span-5 bg-primary text-on-primary rounded-xl p-lg shadow-xl shadow-primary/10">
<div className="space-y-md">
<div className="flex justify-between items-center text-on-primary/70">
<span className="font-body-md">Sous-total HT</span>
<span className="font-body-md">{total ? total : 0 } €</span>
</div>
<div className="flex justify-between items-center border-b border-on-primary/20 pb-sm">
<span className="font-body-md">TVA (0%)</span>
<span className="font-body-md">0 €</span>
</div>
<div className="flex justify-between items-center pt-xs">
<span className="font-h3">TOTAL TTC</span>
<span className="font-h1 text-white">{total ? total : 0} €</span>
</div>
</div>
</div>
</div>
<div className="flex justify-between items-center bg-surface-container-lowest border border-outline-variant rounded-xl p-lg">
<div className="flex items-center gap-md">
<button className="flex items-center gap-sm px-lg py-md border border-outline-variant text-on-surface hover:bg-surface-container-low rounded-lg transition-colors font-label-sm" type="button">
<span className="material-symbols-outlined" data-icon="visibility">visibility</span>
                        Aperçu PDF
                    </button>
<button className="flex items-center gap-sm px-lg py-md border border-outline-variant text-on-surface hover:bg-surface-container-low rounded-lg transition-colors font-label-sm" type="button">
<span className="material-symbols-outlined" data-icon="mail">mail</span>
                        Envoyer au client
                    </button>
</div>
<div className="flex items-center gap-md">
<button className="px-xl py-md text-secondary font-label-sm hover:text-on-surface transition-colors" type="button">Annuler</button>
<button className="bg-primary text-on-primary px-xl py-md rounded-lg font-h3 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all" type="submit">
                        {editMode ? "Modifier le Devis" : "Enregistrer le Devis"}
                    </button>
</div>
</div>
</form>
    )
}