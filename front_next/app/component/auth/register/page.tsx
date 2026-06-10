'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";

const register= ()=> {
    const [name,setName]=useState('');
    const [email,setEmail]=useState('');
    const [companyName,setCompanyName]=useState('');
    const [phone,setPhone]=useState('');
    const [address,setAddress]=useState('');
    const [password,setPassword]=useState('');
    
    const router = useRouter();
    const url = process.env.NEXT_PUBLIC_API_URL;
    console.log(url);

    const handleRegister=async (e:any)=> {
        e.preventDefault()

      try {

            const response = await fetch(url + '/auth/register',{
                method : 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body : JSON.stringify({
                    name,
                    email,
                    password,
                    companyName,
                    address,
                    phone
                })
            });

            const data = await response.json();

            if (!response.ok){

                console.log(data.message);

                throw new Error(data.message);
            }

            alert('register avec succès');

            router.push('/component/auth/login');

        } catch(error:any){

            console.log(error);

            alert(error.message);
        }

    }

return(
    <div className="bg-background text-on-surface min-h-screen flex">
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-2xl bg-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
        <svg height="100%" preserveAspectRatio="none" viewBox="0 0 100 100" width="100%">
        <defs>
        <pattern height="10" id="grid" patternUnits="userSpaceOnUse" width="10">
        <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" stroke-width="0.5"></path>
        </pattern>
        </defs>
        <rect fill="url(#grid)" height="100%" width="100%"></rect>
        </svg>
        </div>
        <div className="relative z-10">
        <div className="flex items-center gap-md">
        <div className="w-12 h-12 bg-on-primary rounded-lg flex items-center justify-center">
        <span className="material-symbols-outlined text-primary text-h2" >account_balance</span>
        </div>
        <h1 className="font-h2 text-h2 text-on-primary font-bold">Gestion S.A.</h1>
        </div>
        <div className="mt-3xl space-y-lg">
        <h2 className="font-display-lg text-display-lg text-on-primary leading-tight">Master your corporate finance with precision.</h2>
        <p className="font-body-lg text-body-lg text-on-primary/80 max-w-md">Join over 5,000 businesses managing invoices, quotes, and international clients with our unified SaaS platform.</p>
        </div>
        </div>
        <div className="relative z-10 grid grid-cols-2 gap-md">
        <div className="bg-white/10 backdrop-blur-md p-lg rounded-xl border border-white/20">
        <span className="material-symbols-outlined text-on-primary mb-sm">verified_user</span>
        <p className="font-label-sm text-label-sm text-on-primary/60 mb-xs">COMPLIANCE</p>
        <p className="font-body-md text-body-md text-on-primary font-semibold">ISO 27001 Certified</p>
        </div>
        <div className="bg-white/10 backdrop-blur-md p-lg rounded-xl border border-white/20">
        <span className="material-symbols-outlined text-on-primary mb-sm">speed</span>
        <p className="font-label-sm text-label-sm text-on-primary/60 mb-xs">PERFORMANCE</p>
        <p className="font-body-md text-body-md text-on-primary font-semibold">Real-time Analytics</p>
        </div>
        </div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[80%] h-[60%] opacity-20 pointer-events-none">
        <img alt="Business Analytics Dashboard" className="w-full h-full object-cover rounded-3xl rotate-[-12deg]" data-alt="A professional close-up of a high-tech financial dashboard displaying real-time stock market trends and corporate growth charts. The scene is bathed in a cool blue and crisp white professional color palette with sleek glassmorphism effects. Modern office lighting reflects off clean surfaces, conveying a sense of reliability and enterprise-grade efficiency for a financial SaaS platform." src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-yQ5p-_s2aloNgC2CetfiXixPdCmiiqlVaKUDNTQjQP1zeYTLWNOWPMapFAikxQEo86RBE6xMRUYRTX9MpgrcAclIl52ZHPM__6Yw4p04N_PWDJGfiJuJ49OXkPDfC13PDa0h7Aedk64b3jKDOuRNJ1VMfbPjQ_iMKrKqhkcxn9tM_oUIb_ALcTqA8S4xSWKuCLz1k77XxQIVm2jPh8PmKlpQlg2O2Xe4jWH5evjG3ZyLIkEnp0RaXeFKcr7jlE0XBdwbNMU16MEg"/>
        </div>
        </div>
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-md sm:p-2xl bg-surface">
        <div className="w-full max-w-[480px]">
        <div className="lg:hidden flex items-center gap-sm mb-xl">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
        <span className="material-symbols-outlined text-on-primary text-h3" >account_balance</span>
        </div>
        <h1 className="font-h3 text-h3 text-primary font-bold">Gestion S.A.</h1>
        </div>
        <div className="mb-xl">
        <h2 className="font-h1 text-h1 text-on-surface mb-sm">Create account</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">Start managing your business flow today.</p>
        </div>
        <form className="space-y-lg" onSubmit={handleRegister}>
        <div className="space-y-xs">
        <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Full Name</label>
        <div className="relative flex items-center">
        <span className="material-symbols-outlined absolute left-md text-outline">person</span>
        <input className="w-full h-12 pl-[48px] pr-md bg-white border border-outline-variant rounded-lg font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
        id="full_name" placeholder="John Doe" type="text"
        value={name}
        onChange={(e)=>{setName(e.target.value)}}
        />
        </div>
        </div>
        <div className="space-y-xs">
        <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Business Name</label>
        <div className="relative flex items-center">
        <span className="material-symbols-outlined absolute left-md text-outline">corporate_fare</span>
        <input className="w-full h-12 pl-[48px] pr-md bg-white border border-outline-variant rounded-lg font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
        id="business_name" placeholder="Gestion S.A." type="text"
        value={companyName}
        onChange={(e)=>{setCompanyName(e.target.value)}}
        />
        </div>
        </div>

        <div className="space-y-xs">
        <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Work Email</label>
        <div className="relative flex items-center">
        <span className="material-symbols-outlined absolute left-md text-outline">mail</span>
        <input 
        className="w-full h-12 pl-[48px] pr-md bg-white border border-outline-variant rounded-lg font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
        id="email" placeholder="john@company.com" type="email"
        value={email}
        onChange={(e)=>{setEmail(e.target.value)}}
        />
        </div>
        </div>
        <div className="space-y-xs">
        <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider" >Password</label>
        <div className="relative flex items-center">
        <span className="material-symbols-outlined absolute left-md text-outline">lock</span>
        <input className="w-full h-12 pl-[48px] pr-12 bg-white border border-outline-variant rounded-lg font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
        id="password" placeholder="••••••••" type="password"
        value={password}
        onChange={(e)=>{setPassword(e.target.value)}}
        />
        <button className="absolute right-md text-outline hover:text-on-surface transition-colors" type="button">
        <span className="material-symbols-outlined">visibility</span>
        </button>
        </div>
        <p className="font-label-sm text-label-sm text-on-surface-variant mt-xs">Must be at least 8 characters long.</p>
        </div>
        <div className="space-y-xs">
            <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                Phone
            </label>

            <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-md text-outline">
                    phone
                </span>

                <input
                    className="w-full h-12 pl-[48px] pr-md bg-white border border-outline-variant rounded-lg font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    id="phone"
                    placeholder="+261 34 00 000 00"
                    type="text"
                    value={phone}
                    onChange={(e)=>{setPhone(e.target.value)}}
                />
            </div>
        </div>
        <div className="space-y-xs">
            <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                Address
            </label>

            <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-md text-outline">
                    location_on
                </span>

                <input
                    className="w-full h-12 pl-[48px] pr-md bg-white border border-outline-variant rounded-lg font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    id="address"
                    placeholder="Antananarivo, Madagascar"
                    type="text"
                    value={address}
                    onChange={(e)=>{setAddress(e.target.value)}}
                />
            </div>
        </div>
        <div className="flex items-start gap-md py-xs">
        <input className="mt-1 w-5 h-5 text-primary border-outline-variant rounded focus:ring-primary" id="terms" type="checkbox"/>
        <label className="font-body-sm text-body-sm text-on-surface-variant" >
                                I agree to the <a className="text-primary font-semibold hover:underline" href="#">Terms of Service</a> and <a className="text-primary font-semibold hover:underline" href="#">Privacy Policy</a>.
                            </label>
        </div>
        <button className="w-full h-12 bg-primary text-on-primary font-h3 text-h3 rounded-lg hover:bg-primary/90 active:scale-[0.98] transition-all flex items-center justify-center gap-sm" 
        type="submit"
        >
                            Get Started
                            <span className="material-symbols-outlined">arrow_forward</span>
        </button>
        </form>
        <div className="relative my-xl">
        <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-outline-variant"></div>
        </div>
        <div className="relative flex justify-center text-label-sm font-label-sm uppercase">
        <span className="bg-surface px-md text-on-surface-variant">Or continue with</span>
        </div>
        </div>
        <div className="grid grid-cols-2 gap-md mb-xl">
        <button className="flex items-center justify-center h-12 border border-outline-variant rounded-lg hover:bg-surface-container-low transition-colors gap-sm font-body-md">
        <img alt="Google" className="w-5 h-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAEhEOkSU6Qk66T7CbluSSl7FT83Hvzf0N7iURQTRXgfr-UjvLAsCvK8PC5Fd8W9U0NMV3TdizCualVpOiwcSsUYjGZIESfrsWG7T_3xUvRnnMj8lLyK0xe2nxuVNeiAU9EGg2QIDbrJbGU7ynZmQbS8LNMCxF1tWoZrCCt3jNKfYG8dB3Ion12TWBGQjFo1JLIReM7L3HAEF5QDPMHRJ2Cv6UhsaC2y3u2QDb0XmA0ftFnd1qvzJKU-zrWW-j0tNgCxU8x18iS8ip8"/>
                            Google
                        </button>
        <button className="flex items-center justify-center h-12 border border-outline-variant rounded-lg hover:bg-surface-container-low transition-colors gap-sm font-body-md">
        <span className="material-symbols-outlined text-black">ios</span>
                            Apple
                        </button>
        </div>
        <div className="text-center">
        <p className="font-body-md text-body-md text-on-surface-variant">
                            Already have an account? 
                            <a className="text-primary font-bold hover:underline" href="#">Sign in</a>
        </p>
        </div>
        </div>
        </div>
    </div>
)
}

export default register;