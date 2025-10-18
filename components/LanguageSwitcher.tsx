"use client";
import { useRouter } from "next/navigation";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function LanguageSwitcher() {
  const router = useRouter();
  const switchLang = (lang: string) => {
    const pathname = window.location.pathname;
    const afterBase = basePath ? pathname.replace(new RegExp(`^${basePath}`), "") : pathname;
    const path = afterBase.replace(/^\/(en|ar)/, "");
    router.push(`/${lang}${path}`);
  };

  return (
    <div className="flex gap-2">
      <button onClick={() => switchLang("en")} className="text-sm px-2 py-1 rounded border border-brand-300 hover:bg-brand-50 hover:border-brand-400 transition-colors">EN</button>
      <button onClick={() => switchLang("ar")} className="text-sm px-2 py-1 rounded border border-brand-300 hover:bg-brand-50 hover:border-brand-400 transition-colors">AR</button>
    </div>
  );
}
