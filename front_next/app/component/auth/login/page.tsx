'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";


const Login=()=>{
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');

    const url = process.env.NEXT_PUBLIC_API_URL;
    console.log(url);

    const router = useRouter();

    const handleLogin = async (e:any) => {

        e.preventDefault();

        try {

            /*const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if(result?.error){

                alert(result.error);
                return;
            }*/
            const result= await fetch(url+'/auth/login',{
                method : 'POST',
                headers:{
                    'content-type': 'application/json'
                },
                body : JSON.stringify({
                    email,
                    password,
                })
            })
            const response= await result.json();
            if(!result.ok){
                throw new Error(response.message || 'error')
            }
            localStorage.setItem(
            'token',
            response.access_token
            );

            localStorage.setItem(
            'user',
            JSON.stringify(response.user)
            );
            alert("login avec succès");

            router.push('/component/project/dashboard');

        } catch(error:any){

            console.log(error);

            alert(error.message);
        }
    }    

return(
    <div className="flex min-h-screen items-center justify-center p-md glass-background">
    <main className="w-full max-w-[440px] animate-in fade-in zoom-in duration-500">
    <div className="mb-xl text-center">
    <div className="inline-flex items-center justify-center gap-sm mb-md">
    <div className="w-10 h-10 bg-primary-container rounded-lg flex items-center justify-center text-on-primary">
    <span className="material-symbols-outlined" >account_balance</span>
    </div>
    <h1 className="font-h2 text-h2 font-bold text-primary">Gestion S.A.</h1>
    </div>
    <p className="font-body-md text-body-md text-on-surface-variant">Secure access to your corporate finance portal</p>
    </div>
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-xl shadow-sm">
    <form className="space-y-lg" onSubmit={handleLogin}>
    <div className="space-y-xs">
    <label className="font-label-sm text-label-sm text-on-surface-variant ml-xs" >Email Address</label>
    <div className="relative flex items-center">
    <span className="material-symbols-outlined absolute left-md text-outline" style={{fontSize:20}} >mail</span>
    <input className="w-full pl-[48px] pr-md py-sm bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none" id="email" 
    name="email" placeholder="name@company.com" type="email"
    value={email}
    onChange={(e)=>{setEmail(e.target.value)}}
    />
    </div>
    </div>
    <div className="space-y-xs">
    <div className="flex justify-between items-center px-xs">
    <label className="font-label-sm text-label-sm text-on-surface-variant" >Password</label>
    <a className="font-label-sm text-label-sm text-primary hover:underline font-semibold" href="#">Forgot password?</a>
    </div>
    <div className="relative flex items-center">
    <span className="material-symbols-outlined absolute left-md text-outline" style={{fontSize:20}}>lock</span>
    <input className="w-full pl-[48px] pr-md py-sm bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none" id="password" 
    name="password" placeholder="••••••••" type="password"
    value={password}
    onChange={(e)=>{setPassword(e.target.value)}}
    />
    </div>
    </div>
    <div className="flex items-center gap-sm px-xs">
    <input className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" id="remember" name="remember" type="checkbox"/>
    <label className="font-body-sm text-body-sm text-on-surface-variant cursor-pointer select-none" >Remember this device</label>
    </div>
    <button className="w-full bg-primary-container text-on-primary font-h3 text-h3 py-sm rounded-lg hover:bg-primary transition-colors active:scale-[0.98] duration-150 flex items-center justify-center gap-sm" type="submit">
                        Sign In
                        <span className="material-symbols-outlined">arrow_forward</span>
    </button>
    </form>
    <div className="relative my-xl">
    <div className="absolute inset-0 flex items-center">
    <div className="w-full border-t border-outline-variant"></div>
    </div>
    <div className="relative flex justify-center text-label-sm">
    <span className="bg-surface-container-lowest px-md text-outline font-label-caps">OR CONTINUE WITH</span>
    </div>
    </div>
    <button className="w-full flex items-center justify-center gap-md py-sm px-md border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface hover:bg-surface-container-low transition-colors active:scale-[0.98] duration-150">
    <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
    </svg>
                    Google Account
                </button>
    </div>
    <p className="mt-xl text-center font-body-sm text-body-sm text-on-surface-variant">
                Don't have an account? 
                <a className="text-primary font-semibold hover:underline" href="#">Register your business</a>
    </p>
    <div className="mt-2xl flex items-center justify-center gap-xs text-outline opacity-60">
    <span className="material-symbols-outlined" style={{fontSize:16}}>verified_user</span>
    <span className="font-label-sm text-label-sm tracking-widest uppercase">AES-256 Encrypted Connection</span>
    </div>
    </main>
    <div className="fixed bottom-0 right-0 p-xl hidden lg:block opacity-40 grayscale pointer-events-none">
    <img alt="Institutional Finance Background" className="w-[300px] h-auto" data-alt="A clean, professional macro photography shot of modern architectural glass and steel from a high-rise office building. The perspective is looking upwards into a clear blue sky, emphasizing structural integrity and height. The lighting is bright and high-key, reinforcing a secure and transparent corporate atmosphere. Cool blue and crisp white tones dominate the composition, creating a sense of reliability and modern institutional power." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzhMGRIgeVf9UlyzWw-zJCZvHnnxBR0-0kkeCHw4LP9qxr6WDmspAxKG5gPJku7v38LFON6krS_3wrg7CtWCP5yXsSxRthQwY_2pqWJ08svm0Iot8IaMdNCXvBCrLUnae7xqnub6v5pmAhHIsh3kohXlrBs1fVKqURXqL99h83RGob2l3LvA5rigC_HPmWy7hRrTHWaWW3vt-FmK5alLeMUTLKHXfeXrHD0DXU8K2cgrHdgib0Mx54hq4IwcBHvnN1Prw7SLsScbg3"/>
    </div>
    </div>
)
}

export default Login;